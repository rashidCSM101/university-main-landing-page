import { Router, Response } from 'express';
import { query } from '../db/index';
import { mediaItemSchema } from '../utils/validation';
import { authenticateToken, logAudit, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Protect all routes with JWT authentication
router.use(authenticateToken);

/**
 * GET /api/v1/admin/media
 * List all media items (drafts + published)
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
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
    const parseResult = mediaItemSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const item = parseResult.data;
    const publishedAt = item.status === 'published' ? new Date() : null;

    const text = `
      INSERT INTO media_items (type, title, slug, body, excerpt, external_url, embed_url, cover_image, author_name, author_id, tags, status, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    const params = [
      item.type,
      item.title,
      item.slug,
      item.body || null,
      item.excerpt || null,
      item.external_url || null,
      item.embed_url || null,
      item.cover_image || null,
      item.author_name || req.user?.name || 'Admin',
      req.user?.id,
      item.tags || [],
      item.status,
      publishedAt,
    ];

    const result = await query(text, params);
    const created = result.rows[0];

    await logAudit(req.user, 'CREATE_MEDIA', 'media_items', created.id, req.ip || '127.0.0.1', { title: item.title });

    return res.status(201).json(created);
  } catch (error: any) {
    if (error.code === '23505') { // Unique constraint violation (slug)
      return res.status(400).json({ error: 'A item with this slug already exists.' });
    }
    return res.status(500).json({ error: 'Failed to create media item.' });
  }
});

/**
 * PUT /api/v1/admin/media/:id
 * Update media item / blog
 */
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const parseResult = mediaItemSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    // Object-level permission check: Editors can only edit their own content
    const existing = await query('SELECT * FROM media_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Media item not found.' });
    }

    const isPowerUser = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    const isAuthor =
      existing.rows[0].author_id === req.user?.id ||
      existing.rows[0].author_name?.toLowerCase().trim() === req.user?.name?.toLowerCase().trim();

    if (!isPowerUser && !isAuthor) {
      return res.status(403).json({ error: 'Forbidden. You can only edit your own submitted content.' });
    }

    const item = parseResult.data;
    const publishedAt = item.status === 'published' && !existing.rows[0].published_at ? new Date() : existing.rows[0].published_at;

    const text = `
      UPDATE media_items 
      SET type=$1, title=$2, slug=$3, body=$4, excerpt=$5, external_url=$6, embed_url=$7, cover_image=$8, author_name=$9, tags=$10, status=$11, published_at=$12, updated_at=NOW()
      WHERE id=$13
      RETURNING *
    `;
    const params = [
      item.type,
      item.title,
      item.slug,
      item.body || null,
      item.excerpt || null,
      item.external_url || null,
      item.embed_url || null,
      item.cover_image || null,
      item.author_name || existing.rows[0].author_name,
      item.tags || [],
      item.status,
      publishedAt,
      id,
    ];

    const result = await query(text, params);

    await logAudit(req.user, 'UPDATE_MEDIA', 'media_items', id, req.ip || '127.0.0.1', { title: item.title });

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update media item.' });
  }
});

/**
 * DELETE /api/v1/admin/media/:id
 * Delete media item / blog
 */
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const isPowerUser = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    if (!isPowerUser) {
      return res.status(403).json({ error: 'Permission denied. Members cannot delete posts. Only Admin or Super Admin can delete content.' });
    }

    const { id } = req.params;
    const existing = await query('SELECT * FROM media_items WHERE id = $1', [id]);

    await query('DELETE FROM media_items WHERE id = $1', [id]);
    await logAudit(req.user, 'DELETE_MEDIA', 'media_items', id, req.ip || '127.0.0.1', { title: existing.rows[0].title });

    return res.json({ message: 'Media item deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete media item.' });
  }
});

export default router;
