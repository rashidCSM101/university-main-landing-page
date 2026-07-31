import { Router, Response } from 'express';
import { query } from '../db/index';
import { toolSchema } from '../utils/validation';
import { authenticateToken, logAudit, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query('SELECT * FROM tools ORDER BY sort_order ASC, title ASC');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tools.' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = toolSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const item = parseResult.data;
    const text = `
      INSERT INTO tools (title, sector, description, external_url, thumbnail, sort_order, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const params = [
      item.title,
      item.sector,
      item.description || null,
      item.external_url,
      item.thumbnail || null,
      item.sort_order || 0,
      item.is_active,
    ];

    const result = await query(text, params);
    await logAudit(req.user, 'CREATE_TOOL', 'tools', result.rows[0].id, req.ip || '127.0.0.1', { title: item.title });

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create tool.' });
  }
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const parseResult = toolSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const item = parseResult.data;
    const text = `
      UPDATE tools 
      SET title=$1, sector=$2, description=$3, external_url=$4, thumbnail=$5, sort_order=$6, is_active=$7
      WHERE id=$8
      RETURNING *
    `;
    const params = [
      item.title,
      item.sector,
      item.description || null,
      item.external_url,
      item.thumbnail || null,
      item.sort_order || 0,
      item.is_active,
      id,
    ];

    const result = await query(text, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tool not found.' });
    }

    await logAudit(req.user, 'UPDATE_TOOL', 'tools', id, req.ip || '127.0.0.1', { title: item.title });

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update tool.' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM tools WHERE id = $1 RETURNING title', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tool not found.' });
    }

    await logAudit(req.user, 'DELETE_TOOL', 'tools', id, req.ip || '127.0.0.1', { title: result.rows[0].title });

    return res.json({ message: 'Tool deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete tool.' });
  }
});

export default router;
