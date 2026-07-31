import { Router, Response } from 'express';
import { query } from '../db/index';
import { projectSchema } from '../utils/validation';
import { authenticateToken, logAudit, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query('SELECT * FROM projects ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = projectSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const item = parseResult.data;
    const text = `
      INSERT INTO projects (title, slug, funder_name, funder_code, region, objectives, activities, services, images, status, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    const params = [
      item.title,
      item.slug,
      item.funder_name || null,
      item.funder_code || null,
      item.region || null,
      item.objectives || [],
      item.activities || [],
      item.services || [],
      item.images || [],
      item.status,
      item.start_date || null,
      item.end_date || null,
    ];

    const result = await query(text, params);
    await logAudit(req.user, 'CREATE_PROJECT', 'projects', result.rows[0].id, req.ip || '127.0.0.1', { title: item.title });

    return res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Project with this slug already exists.' });
    }
    return res.status(500).json({ error: 'Failed to create project.' });
  }
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const parseResult = projectSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const item = parseResult.data;
    const text = `
      UPDATE projects 
      SET title=$1, slug=$2, funder_name=$3, funder_code=$4, region=$5, objectives=$6, activities=$7, services=$8, images=$9, status=$10, start_date=$11, end_date=$12, updated_at=NOW()
      WHERE id=$13
      RETURNING *
    `;
    const params = [
      item.title,
      item.slug,
      item.funder_name || null,
      item.funder_code || null,
      item.region || null,
      item.objectives || [],
      item.activities || [],
      item.services || [],
      item.images || [],
      item.status,
      item.start_date || null,
      item.end_date || null,
      id,
    ];

    const result = await query(text, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    await logAudit(req.user, 'UPDATE_PROJECT', 'projects', id, req.ip || '127.0.0.1', { title: item.title });

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update project.' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM projects WHERE id = $1 RETURNING title', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    await logAudit(req.user, 'DELETE_PROJECT', 'projects', id, req.ip || '127.0.0.1', { title: result.rows[0].title });

    return res.json({ message: 'Project deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete project.' });
  }
});

export default router;
