import { Router, Response } from 'express';
import { query } from '../db/index';
import { publicationSchema } from '../utils/validation';
import { authenticateToken, logAudit, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

async function ensurePubsTableSchema() {
  try {
    await query('ALTER TABLE publications DROP CONSTRAINT IF EXISTS publications_type_check');
    await query('ALTER TABLE publications DROP CONSTRAINT IF EXISTS publications_status_check');
    await query('ALTER TABLE publications ALTER COLUMN thumbnail TYPE TEXT');
    await query('ALTER TABLE publications ALTER COLUMN external_url TYPE TEXT');
    await query('ALTER TABLE publications ALTER COLUMN outlet_name TYPE TEXT');
    await query('ALTER TABLE publications ALTER COLUMN author_name TYPE TEXT');
  } catch (err) {
    // Safe catch
  }
}

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensurePubsTableSchema();
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
    const text = `
      INSERT INTO publications (type, title, author_name, co_authors, outlet_name, external_url, published_date, abstract, thumbnail, tags, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const params = [
      item.type,
      item.title,
      item.author_name || null,
      item.co_authors || [],
      item.outlet_name || null,
      item.external_url || null,
      (item.published_date && item.published_date.trim() !== '' ? item.published_date : null),
      item.abstract || null,
      item.thumbnail || null,
      item.tags || [],
      item.status,
    ];

    const result = await query(text, params);
    const created = result.rows[0];

    await logAudit(req.user, 'CREATE_PUBLICATION', 'publications', created.id, req.ip || '127.0.0.1', { title: item.title });

    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create publication.' });
  }
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch existing publication
    const existing = await query('SELECT author_name FROM publications WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Publication not found.' });
    }

    // Role check: Member can only edit their own publications
    const isPowerUser = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    if (!isPowerUser) {
      const isAuthor = existing.rows[0].author_name?.toLowerCase().trim() === req.user?.name?.toLowerCase().trim();
      if (!isAuthor) {
        return res.status(403).json({ error: 'Permission denied. Members can only edit their own submitted publications.' });
      }
    }

    const parseResult = publicationSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const item = parseResult.data;
    const text = `
      UPDATE publications 
      SET type=$1, title=$2, author_name=$3, co_authors=$4, outlet_name=$5, external_url=$6, published_date=$7, abstract=$8, thumbnail=$9, tags=$10, status=$11, updated_at=NOW()
      WHERE id=$12
      RETURNING *
    `;
    const params = [
      item.type,
      item.title,
      item.author_name || null,
      item.co_authors || [],
      item.outlet_name || null,
      item.external_url || null,
      item.published_date || null,
      item.abstract || null,
      item.thumbnail || null,
      item.tags || [],
      item.status,
      id,
    ];

    const result = await query(text, params);
    await logAudit(req.user, 'UPDATE_PUBLICATION', 'publications', id, req.ip || '127.0.0.1', { title: item.title });

    return res.json(result.rows[0]);
  } catch (error) {
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

export default router;
