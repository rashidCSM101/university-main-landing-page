import { Router, Response } from 'express';
import { query } from '../db/index';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('super_admin'));

/**
 * GET /api/v1/admin/audit-logs
 * Super Admin Audit Trail Viewer
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { action, limit = '50', offset = '0' } = req.query;
    let text = 'SELECT * FROM audit_logs WHERE 1=1';
    const params: any[] = [];

    if (action) {
      params.push(action);
      text += ` AND action = $${params.length}`;
    }

    const parsedLimit = Math.min(Math.max(parseInt(limit as string, 10) || 50, 1), 200);
    const parsedOffset = Math.max(parseInt(offset as string, 10) || 0, 0);
    text += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parsedLimit, parsedOffset);

    const result = await query(text, params);
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch audit logs.' });
  }
});

export default router;
