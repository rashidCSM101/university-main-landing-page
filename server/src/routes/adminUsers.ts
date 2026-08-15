import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/index';
import { authenticateToken, logAudit, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Protect all user management routes with JWT authentication
router.use(authenticateToken);

const createUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['super_admin', 'admin', 'member', 'editor']),
});

async function ensureUsersTableSchema() {
  try {
    await query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check');
    await query('ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50)');
  } catch (err) {
    // Safe catch
  }
}

/**
 * GET /api/v1/admin/users
 * List all registered platform users
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureUsersTableSchema();
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied. Only Super Admin or Admin can access user management.' });
    }

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
 * Super Admin -> Can create super_admin, admin, member accounts
 * Admin -> Can ONLY create member accounts
 */
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied. Only Super Admin or Admin can create new user accounts.' });
    }

    const parseResult = createUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]?.message || 'Validation failed';
      return res.status(400).json({ error: firstIssue, details: parseResult.error.issues });
    }

    const { name, email, password, role } = parseResult.data;

    // Enforce Rule: Admin cannot create another Admin or Super Admin account!
    if (req.user?.role === 'admin' && (role === 'admin' || role === 'super_admin')) {
      return res.status(403).json({ error: 'Permission denied. Admin users can only create Member accounts. Only Super Admin can promote/create Admin users.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing email
    const existing = await query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'A user account with this email already exists.' });
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 12);

    const text = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, is_active, created_at
    `;
    const result = await query(text, [name.trim(), normalizedEmail, passwordHash, role]);
    const createdUser = result.rows[0];

    // Also auto-create a matching record in team_members table so member displays on team directory
    try {
      const teamSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await query(
        `INSERT INTO team_members (name, slug, role, team, social_links, is_active)
         VALUES ($1, $2, $3, $4, $5, TRUE)
         ON CONFLICT (slug) DO NOTHING`,
        [
          name.trim(),
          teamSlug,
          role === 'admin' ? 'Executive Admin' : 'Associate Researcher',
          'Atmospheric & Attribution Science',
          JSON.stringify({ email: normalizedEmail, qualification: 'Climate Research Specialist' })
        ]
      );
    } catch (err) {
      console.warn('Auto team_member creation warning:', err);
    }

    await logAudit(req.user, 'CREATE_USER', 'users', createdUser.id, req.ip || '127.0.0.1', { email: normalizedEmail, role });

    return res.status(201).json(createdUser);
  } catch (error: any) {
    console.error('CREATE USER DATABASE ERROR:', error);
    return res.status(500).json({ error: error?.message || 'Failed to create user account.' });
  }
});

/**
 * PUT /api/v1/admin/users/:id/role
 * Change user role
 */
router.put('/:id/role', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureUsersTableSchema();
    if (req.user?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Permission denied. Only Super Admin can modify user roles.' });
    }

    const { id } = req.params;
    const { role } = req.body;

    if (!['super_admin', 'admin', 'member', 'editor'].includes(role)) {
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
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied.' });
    }

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

/**
 * DELETE /api/v1/admin/users/:id
 * Delete user account and associated team member record (Super Admin Only)
 */
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Permission denied. Only Super Admin can delete user accounts.' });
    }

    const { id } = req.params;

    // Prevent Super Admin from deleting their own active logged-in account!
    if (id === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own active Super Admin account.' });
    }

    const existing = await query('SELECT name, email FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const targetUser = existing.rows[0];

    // Delete user from users table
    await query('DELETE FROM users WHERE id = $1', [id]);

    // Also delete matching record in team_members table
    try {
      await query(
        "DELETE FROM team_members WHERE LOWER(name) = LOWER($1) OR social_links->>'email' = $2",
        [targetUser.name, targetUser.email]
      );
    } catch (err) {
      console.warn('Matching team member deletion warning:', err);
    }

    await logAudit(req.user, 'DELETE_USER', 'users', id, req.ip || '127.0.0.1', { name: targetUser.name, email: targetUser.email });

    return res.json({ message: 'User account deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete user account: ' + (error?.message || 'Server error') });
  }
});

export default router;
