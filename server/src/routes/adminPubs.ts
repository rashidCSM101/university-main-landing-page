import { Router, Response } from 'express';
import { query } from '../db/index';
import { publicationSchema } from '../utils/validation';
import { authenticateToken, logAudit, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query('SELECT * FROM publications ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch publications.' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = publicationSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const item = parseResult.data;

    // ── 1. Duplicate Title Safety Check ──
    const existingTitle = await query(
      'SELECT id, title FROM publications WHERE LOWER(TRIM(title)) = LOWER(TRIM($1))',
      [item.title]
    );
    if (existingTitle.rows.length > 0) {
      return res.status(409).json({
        error: `A publication or paper with the title "${existingTitle.rows[0].title}" already exists. Please choose a unique title.`
      });
    }

    const isPowerUser = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    const finalStatus = isPowerUser ? (item.status || 'published') : 'pending';

    const text = `
      INSERT INTO publications (type, title, author_name, co_authors, outlet_name, external_url, published_date, abstract, thumbnail, tags, status, author_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    const params = [
      item.type,
      item.title.trim(),
      item.author_name || req.user?.name || null,
      item.co_authors || [],
      item.outlet_name || null,
      item.external_url || null,
      (item.published_date && item.published_date.trim() !== '' ? item.published_date : null),
      item.abstract || null,
      item.thumbnail || null,
      item.tags || [],
      finalStatus,
      req.user?.id || null,
    ];

    let created;
    try {
      const result = await query(text, params);
      created = result.rows[0];
    } catch (dbErr: any) {
      if (dbErr.code === '23505') {
        return res.status(409).json({ error: 'A publication with this title already exists.' });
      }
      throw dbErr;
    }

    const auditAction = isPowerUser ? 'CREATE_PUBLICATION' : 'SUBMIT_PENDING_APPROVAL';
    await logAudit(req.user, auditAction, 'publications', created.id, req.ip || '127.0.0.1', {
      title: item.title,
      author: req.user?.name,
      status: finalStatus
    });

    return res.status(201).json(created);
  } catch (error: any) {
    console.error('Create publication error:', error);
    return res.status(500).json({ error: 'Failed to create publication.' });
  }
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch existing publication
    const existing = await query('SELECT * FROM publications WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Publication not found.' });
    }

    const existingRow = existing.rows[0];
    const isPowerUser = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    if (!isPowerUser) {
      const isAuthor =
        (existingRow.author_id && existingRow.author_id === req.user?.id) ||
        (req.user?.name && existingRow.author_name?.toLowerCase().trim() === req.user.name.toLowerCase().trim());
      if (!isAuthor) {
        return res.status(403).json({ error: 'Permission denied. You can only edit your own submitted publications.' });
      }
    }

    const parseResult = publicationSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const item = parseResult.data;

    // ── 2. Duplicate Title Safety Check on Update ──
    const duplicateCheck = await query(
      'SELECT id, title FROM publications WHERE LOWER(TRIM(title)) = LOWER(TRIM($1)) AND id != $2',
      [item.title, id]
    );
    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        error: `Another publication with the title "${duplicateCheck.rows[0].title}" already exists. Please choose a unique title.`
      });
    }

    // ── 3. Role-Based Status & Re-Moderation Workflow ──
    let finalStatus = item.status;
    if (!isPowerUser) {
      // Member edit to ANY paper reverts to pending review
      finalStatus = 'pending';
    }

    const authorName = isPowerUser ? (item.author_name || existingRow.author_name) : existingRow.author_name;

    const text = `
      UPDATE publications 
      SET type=$1, title=$2, author_name=$3, co_authors=$4, outlet_name=$5, external_url=$6, published_date=$7, abstract=$8, thumbnail=$9, tags=$10, status=$11, updated_at=NOW()
      WHERE id=$12
      RETURNING *
    `;
    const params = [
      item.type,
      item.title.trim(),
      authorName,
      item.co_authors || [],
      item.outlet_name || null,
      item.external_url || null,
      (item.published_date && item.published_date.trim() !== '' ? item.published_date : null),
      item.abstract || null,
      item.thumbnail || null,
      item.tags || [],
      finalStatus,
      id,
    ];

    const result = await query(text, params);
    const updated = result.rows[0];

    const auditAction = !isPowerUser && existingRow.status === 'published'
      ? 'MEMBER_AMENDED_PUBLISHED_PUBLICATION'
      : 'UPDATE_PUBLICATION';

    await logAudit(req.user, auditAction, 'publications', id, req.ip || '127.0.0.1', {
      title: item.title,
      status: finalStatus,
      previousStatus: existingRow.status,
    });

    return res.json(updated);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A publication with this title already exists.' });
    }
    return res.status(500).json({ error: 'Failed to update publication.' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Only Super Admin and Admin can delete publications
    const isPowerUser = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    if (!isPowerUser) {
      return res.status(403).json({ error: 'Permission denied. Members cannot delete publications. Only Admin or Super Admin can delete content.' });
    }

    const { id } = req.params;
    const result = await query('DELETE FROM publications WHERE id = $1 RETURNING title', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publication not found.' });
    }

    await logAudit(req.user, 'DELETE_PUBLICATION', 'publications', id, req.ip || '127.0.0.1', { title: result.rows[0].title });

    return res.json({ message: 'Publication deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete publication.' });
  }
});

/**
 * PUT /api/v1/admin/publications/:id/approve
 * Approve pending publication for release (Super Admin & Executive Admin only)
 */
router.put('/:id/approve', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const isPowerUser = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    if (!isPowerUser) {
      return res.status(403).json({ error: 'Permission Denied. Only Admins can approve publications.' });
    }

    const { id } = req.params;
    const result = await query(
      `UPDATE publications SET status = 'published', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publication not found.' });
    }

    const updated = result.rows[0];
    await logAudit(req.user, 'APPROVE_PUBLICATION', 'publications', id, req.ip || '127.0.0.1', { title: updated.title });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to approve publication.' });
  }
});

export default router;
