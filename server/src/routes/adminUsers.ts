import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/index';
import { authenticateToken, logAudit, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import crypto from 'crypto';

const router = Router();

// Protect all user management routes with JWT authentication
router.use(authenticateToken);

// ─────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────

/** Generates a secure random temporary password: 2 words + 4-digit number */
function generateTempPassword(): string {
  const adjectives = ['Blue', 'Swift', 'Bold', 'Bright', 'Clear', 'Deep', 'Fair', 'Gold', 'Green', 'High', 'Keen', 'Kind', 'Light', 'Prime', 'Safe', 'Sharp', 'Soft', 'Star', 'Strong', 'True'];
  const nouns      = ['Cloud', 'Coast', 'Field', 'Force', 'Grove', 'Lake', 'Land', 'Peak', 'River', 'Rock', 'Shore', 'Storm', 'Stream', 'Wave', 'Wind', 'Bridge', 'Crest', 'Dawn', 'Frost', 'Glow'];
  const adj  = adjectives[crypto.randomInt(adjectives.length)];
  const noun = nouns[crypto.randomInt(nouns.length)];
  const num  = String(crypto.randomInt(1000, 9999));
  return `${adj}${noun}${num}`;
}

async function ensureUsersTableSchema() {
  try {
    await query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check');
    await query('ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50)');
  } catch (err) {
    // Safe catch
  }
}

const createUserSchema = z.object({
  name:  z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role:  z.enum(['super_admin', 'admin', 'member', 'editor']),
});

// ─────────────────────────────────────────────────────
// GET /  — List all users
// ─────────────────────────────────────────────────────
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureUsersTableSchema();
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied.' });
    }
    const result = await query(
      'SELECT id, name, email, role, is_active, last_login, created_at FROM users ORDER BY created_at DESC'
    );
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// ─────────────────────────────────────────────────────
// POST /  — Create user + auto team_member record
// Returns generated temp_password so Super Admin can share it
// ─────────────────────────────────────────────────────
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied.' });
    }

    const parseResult = createUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues[0]?.message || 'Validation failed' });
    }

    const { name, email, role } = parseResult.data;

    if (req.user?.role === 'admin' && (role === 'admin' || role === 'super_admin')) {
      return res.status(403).json({ error: 'Admin can only create Member accounts.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    // Auto-generate secure temporary password
    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const userResult = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, is_active, created_at`,
      [name.trim(), normalizedEmail, passwordHash, role]
    );
    const createdUser = userResult.rows[0];

    // Auto-create linked team_members record
    try {
      const teamSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await query(
        `INSERT INTO team_members (name, slug, role, team, social_links, is_active)
         VALUES ($1, $2, $3, $4, $5, TRUE)
         ON CONFLICT (slug) DO NOTHING`,
        [
          name.trim(),
          teamSlug,
          role === 'admin' ? 'Executive Admin' : 'Associate Researcher',
          'Atmospheric & Attribution Science',
          JSON.stringify({ email: normalizedEmail }),
        ]
      );
    } catch (err) {
      console.warn('Auto team_member creation warning:', err);
    }

    await logAudit(req.user, 'CREATE_USER', 'users', createdUser.id, req.ip || '127.0.0.1', { email: normalizedEmail, role });

    // Return user + temp_password so admin can share credentials
    return res.status(201).json({ ...createdUser, temp_password: tempPassword });
  } catch (error: any) {
    console.error('CREATE USER ERROR:', error);
    return res.status(500).json({ error: error?.message || 'Failed to create user account.' });
  }
});

// ─────────────────────────────────────────────────────
// PUT /:id/reset-password  — Super Admin resets a member's password
// ─────────────────────────────────────────────────────
router.put('/:id/reset-password', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only Super Admin can reset passwords.' });
    }

    const { id } = req.params;
    const existing = await query('SELECT name, email FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [passwordHash, id]);
    await logAudit(req.user, 'RESET_USER_PASSWORD', 'users', id, req.ip || '127.0.0.1', { email: existing.rows[0].email });

    return res.json({
      message: 'Password reset successfully.',
      temp_password: tempPassword,
      email: existing.rows[0].email,
      name: existing.rows[0].name,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// ─────────────────────────────────────────────────────
// PUT /me/change-password  — Any logged-in user changes their OWN password
// ─────────────────────────────────────────────────────
router.put('/me/change-password', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Both current and new password are required.' });
    }
    if (new_password.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    }

    const userResult = await query('SELECT password_hash FROM users WHERE id = $1', [req.user?.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isValid = await bcrypt.compare(current_password, userResult.rows[0].password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const newHash = await bcrypt.hash(new_password, 12);
    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, req.user?.id]);
    await logAudit(req.user, 'CHANGE_OWN_PASSWORD', 'users', req.user?.id || '', req.ip || '127.0.0.1');

    return res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to change password.' });
  }
});

// ─────────────────────────────────────────────────────
// PUT /:id/role  — Change user role (Super Admin only)
// ─────────────────────────────────────────────────────
router.put('/:id/role', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureUsersTableSchema();
    if (req.user?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only Super Admin can modify user roles.' });
    }

    const { id } = req.params;
    const { role } = req.body;

    if (!['super_admin', 'admin', 'member', 'editor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    const result = await query(
      'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found.' });

    await logAudit(req.user, 'CHANGE_USER_ROLE', 'users', id, req.ip || '127.0.0.1', { newRole: role });
    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user role.' });
  }
});

// ─────────────────────────────────────────────────────
// PUT /:id/toggle-status  — Activate / Deactivate user
// ─────────────────────────────────────────────────────
router.put('/:id/toggle-status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied.' });
    }

    const { id } = req.params;
    const existing = await query('SELECT is_active FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'User not found.' });

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

// ─────────────────────────────────────────────────────
// DELETE /:id  — Delete user + linked team_member (Super Admin only)
// ─────────────────────────────────────────────────────
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only Super Admin can delete user accounts.' });
    }

    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }

    const existing = await query('SELECT name, email FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'User not found.' });

    const target = existing.rows[0];
    await query('DELETE FROM users WHERE id = $1', [id]);

    try {
      await query(
        "DELETE FROM team_members WHERE LOWER(name) = LOWER($1) OR social_links->>'email' = $2",
        [target.name, target.email]
      );
    } catch (err) {
      console.warn('Team member deletion warning:', err);
    }

    await logAudit(req.user, 'DELETE_USER', 'users', id, req.ip || '127.0.0.1', { name: target.name, email: target.email });
    return res.json({ message: 'User account deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete user: ' + (error?.message || '') });
  }
});

export default router;
