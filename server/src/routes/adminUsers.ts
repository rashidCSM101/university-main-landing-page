import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/index';
import { authenticateToken, requireRole, logAudit, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Protect all user management routes with JWT & Super Admin Role
router.use(authenticateToken);
router.use(requireRole('super_admin'));

const createUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['super_admin', 'editor']),
});

/**
 * GET /api/v1/admin/users
 * List all registered platform users
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT id, name, email, role, is_active, last_login, created_at FROM users ORDER BY created_at DESC'
    );
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

/**
 * POST /api/v1/admin/users
 * Create new user account
 */
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = createUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const { name, email, password, role } = parseResult.data;

    // Hash password with bcrypt (cost factor 12)
    const passwordHash = await bcrypt.hash(password, 12);

    const text = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, is_active, created_at
    `;
    const result = await query(text, [name, email, passwordHash, role]);
    const createdUser = result.rows[0];

    await logAudit(req.user, 'CREATE_USER', 'users', createdUser.id, req.ip || '127.0.0.1', { email, role });

    return res.status(201).json(createdUser);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }
    return res.status(500).json({ error: 'Failed to create user.' });
  }
});

/**
 * PUT /api/v1/admin/users/:id/role
 * Change user role
 */
router.put('/:id/role', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['super_admin', 'editor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    const result = await query(
      'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await logAudit(req.user, 'CHANGE_USER_ROLE', 'users', id, req.ip || '127.0.0.1', { newRole: role });

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user role.' });
  }
});

/**
 * PUT /api/v1/admin/users/:id/toggle-status
 * Toggle user active status (deactivate/activate)
 */
router.put('/:id/toggle-status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT is_active, email FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const newStatus = !existing.rows[0].is_active;
    const result = await query(
      'UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, is_active',
      [newStatus, id]
    );

    await logAudit(req.user, 'TOGGLE_USER_STATUS', 'users', id, req.ip || '127.0.0.1', { newStatus });

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to toggle user status.' });
  }
});

export default router;
