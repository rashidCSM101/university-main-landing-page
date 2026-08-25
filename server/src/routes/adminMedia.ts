import { Router, Response } from 'express';
import { query } from '../db/index';
import { mediaItemSchema } from '../utils/validation';
import { authenticateToken, logAudit, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Protect all routes with JWT authentication
router.use(authenticateToken);

async function ensureMediaTableSchema() {
  try {
    await query('ALTER TABLE media_items DROP CONSTRAINT IF EXISTS media_items_type_check');
    await query('ALTER TABLE media_items DROP CONSTRAINT IF EXISTS media_items_status_check');
    await query('ALTER TABLE media_items ADD COLUMN IF NOT EXISTS author_id UUID');
    await query('ALTER TABLE media_items ADD COLUMN IF NOT EXISTS co_authors TEXT[] DEFAULT \'{}\'');
    // Ensure case-insensitive trimmed unique index on title
    await query('CREATE UNIQUE INDEX IF NOT EXISTS idx_media_unique_title_ci ON media_items (LOWER(TRIM(title)))');
  } catch (err) {
    // Safe catch
  }
}

/**
 * GET /api/v1/admin/media
 * List all media items (drafts + published)
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureMediaTableSchema();
    const { type, status } = req.query;
    let text = 'SELECT * FROM media_items WHERE 1=1';
    const params: any[] = [];

    if (type) {
      params.push(type);
      text += ` AND type = $${params.length}`;
    }

    if (status) {
      params.push(status);
      text += ` AND status = $${params.length}`;
    }

    text += ' ORDER BY created_at DESC';

    const result = await query(text, params);
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch media items.' });
  }
});

/**
 * POST /api/v1/admin/media
 * Create new media item / blog
 */
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureMediaTableSchema();
    const parseResult = mediaItemSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const item = parseResult.data;

    // ── 1. Duplicate Title Safety Check (Case-insensitive & Trimmed) ──
    const existingTitle = await query(
      'SELECT id, title FROM media_items WHERE LOWER(TRIM(title)) = LOWER(TRIM($1))',
      [item.title]
    );
    if (existingTitle.rows.length > 0) {
      return res.status(409).json({
        error: `A media post with the title "${existingTitle.rows[0].title}" already exists. Please choose a unique title.`
      });
    }

    const isPowerUser = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    const finalStatus = isPowerUser ? (item.status || 'published') : 'pending';
    const publishedAt = finalStatus === 'published' ? new Date() : null;
    const leadAuthor = isPowerUser ? (item.author_name || req.user?.name || 'Admin') : (req.user?.name || 'Member');
    const coAuthors = item.co_authors || [];

    const text = `
      INSERT INTO media_items (type, title, slug, body, excerpt, external_url, embed_url, cover_image, author_name, co_authors, author_id, tags, status, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    const params = [
      item.type,
      item.title.trim(),
      item.slug.trim(),
      item.body || null,
      item.excerpt || null,
      item.external_url || null,
      item.embed_url || null,
      item.cover_image || null,
      leadAuthor,
      coAuthors,
      req.user?.id,
      item.tags || [],
      finalStatus,
      publishedAt,
    ];

    let created;
    try {
      const result = await query(text, params);
      created = result.rows[0];
    } catch (dbErr: any) {
      if (dbErr.code === '23505') { // Slug or title collision
        return res.status(409).json({ error: 'A media item with this title or slug already exists.' });
      }
      throw dbErr;
    }

    const auditAction = isPowerUser ? 'CREATE_MEDIA' : 'SUBMIT_PENDING_APPROVAL';
    await logAudit(req.user, auditAction, 'media_items', created.id, req.ip || '127.0.0.1', {
      title: created.title,
      type: created.type,
      status: created.status,
      author: req.user?.name,
    });

    return res.status(201).json(created);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to create media item.' });
  }
});

/**
 * PUT /api/v1/admin/media/:id
 * Update media item (With Member Re-Moderation & Ownership Verification)
 */
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureMediaTableSchema();
    const { id } = req.params;
    const parseResult = mediaItemSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const item = parseResult.data;

    // ── 1. Fetch Existing Record to Check Ownership & Current Status ──
    const existing = await query('SELECT * FROM media_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Media item not found.' });
    }
    const existingRow = existing.rows[0];

    // ── 2. Ownership & Privilege Enforcement ──
    const isPowerUser = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    const isAuthor =
      (existingRow.author_id && existingRow.author_id === req.user?.id) ||
      (req.user?.name && existingRow.author_name?.toLowerCase().trim() === req.user.name.toLowerCase().trim());

    if (!isPowerUser && !isAuthor) {
      return res.status(403).json({
        error: 'Forbidden: You do not have permission to edit content authored by other members.'
      });
    }

    // ── 2b. Unique Title Check on Update (Excluding current item) ──
    const duplicateTitle = await query(
      'SELECT id FROM media_items WHERE LOWER(TRIM(title)) = LOWER(TRIM($1)) AND id != $2',
      [item.title, id]
    );
    if (duplicateTitle.rows.length > 0) {
      return res.status(409).json({
        error: `Another media post already uses the title "${item.title}". Please choose a distinct title.`
      });
    }

    // ── 3. Role-Based Status & Re-Moderation Workflow ──
    let finalStatus = item.status;
    let publishedAt = existingRow.published_at;

    if (!isPowerUser) {
      // If a member edits ANY post (draft or published), it MUST revert to 'pending' for Admin approval
      finalStatus = 'pending';
      publishedAt = null;
    } else {
      if (item.status === 'published' && !existingRow.published_at) {
        publishedAt = new Date();
      }
    }

    const authorName = isPowerUser ? (item.author_name || existingRow.author_name) : existingRow.author_name;
    const coAuthors = isPowerUser ? (item.co_authors ?? existingRow.co_authors ?? []) : (existingRow.co_authors ?? []);

    const text = `
      UPDATE media_items 
      SET type=$1, title=$2, slug=$3, body=$4, excerpt=$5, external_url=$6, embed_url=$7, cover_image=$8, author_name=$9, co_authors=$10, tags=$11, status=$12, published_at=$13, updated_at=NOW()
      WHERE id=$14
      RETURNING *
    `;
    const params = [
      item.type,
      item.title.trim(),
      item.slug.trim(),
      item.body || null,
      item.excerpt || null,
      item.external_url || null,
      item.embed_url || null,
      item.cover_image || null,
      authorName,
      coAuthors,
      item.tags || [],
      finalStatus,
      publishedAt,
      id,
    ];

    const result = await query(text, params);
    const updated = result.rows[0];

    const auditAction = !isPowerUser && existingRow.status === 'published'
      ? 'MEMBER_AMENDED_PUBLISHED_CONTENT'
      : 'UPDATE_MEDIA';

    await logAudit(req.user, auditAction, 'media_items', id, req.ip || '127.0.0.1', {
      title: item.title,
      status: finalStatus,
      previousStatus: existingRow.status,
    });

    return res.json(updated);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A media item with this title or slug already exists.' });
    }
    return res.status(500).json({ error: 'Failed to update media item.' });
  }
});

/**
 * DELETE /api/v1/admin/media/:id
 * Delete media item / blog
 */
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureMediaTableSchema();
    const isPowerUser = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    if (!isPowerUser) {
      return res.status(403).json({ error: 'Permission denied. Members cannot delete posts. Only Admin or Super Admin can delete content.' });
    }

    const { id } = req.params;
    const existing = await query('SELECT * FROM media_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Media item not found.' });
    }

    await query('DELETE FROM media_items WHERE id = $1', [id]);
    await logAudit(req.user, 'DELETE_MEDIA', 'media_items', id, req.ip || '127.0.0.1', { title: existing.rows[0].title });

    return res.json({ message: 'Media item deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete media item.' });
  }
});

/**
 * PUT /api/v1/admin/media/:id/approve
 * Approve pending post for publication (Super Admin & Executive Admin only)
 */
router.put('/:id/approve', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const isPowerUser = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    if (!isPowerUser) {
      return res.status(403).json({ error: 'Permission Denied. Only Admins can approve posts.' });
    }

    const { id } = req.params;
    const result = await query(
      `UPDATE media_items SET status = 'published', published_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Media item not found.' });
    }

    const updated = result.rows[0];
    await logAudit(req.user, 'APPROVE_POST', 'media_items', id, req.ip || '127.0.0.1', { title: updated.title });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to approve media post.' });
  }
});

export default router;
