import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query } from '../db/index';
import { teamMemberSchema } from '../utils/validation';
import { authenticateToken, requireRole, logAudit, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

/** Generates a secure random temporary password */
function generateTempPassword(): string {
  const adjectives = ['Blue', 'Swift', 'Bold', 'Bright', 'Clear', 'Deep', 'Fair', 'Gold', 'Green', 'High', 'Keen', 'Kind', 'Light', 'Prime', 'Safe', 'Sharp', 'Soft', 'Star', 'Strong', 'True'];
  const nouns      = ['Cloud', 'Coast', 'Field', 'Force', 'Grove', 'Lake', 'Land', 'Peak', 'River', 'Rock', 'Shore', 'Storm', 'Stream', 'Wave', 'Wind', 'Bridge', 'Crest', 'Dawn', 'Frost', 'Glow'];
  const adj  = adjectives[crypto.randomInt(adjectives.length)];
  const noun = nouns[crypto.randomInt(nouns.length)];
  const num  = String(crypto.randomInt(1000, 9999));
  return `${adj}${noun}${num}`;
}

async function ensureTeamTableSchema() {
  try {
    await query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT FALSE');
    await query('ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_team_check');
    await query('ALTER TABLE team_members ALTER COLUMN photo TYPE TEXT');
    await query('ALTER TABLE team_members ALTER COLUMN role TYPE TEXT');
    await query('ALTER TABLE team_members ALTER COLUMN team TYPE TEXT');
    await query('ALTER TABLE team_members ALTER COLUMN bio TYPE TEXT');
  } catch (err) {
    // Column type alter safe catch
  }
}

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureTeamTableSchema();
    const result = await query('SELECT * FROM team_members ORDER BY sort_order ASC, name ASC');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch team members.' });
  }
});

router.post('/', requireRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureTeamTableSchema();
    const parseResult = teamMemberSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const item = parseResult.data;
    const socialLinks = item.social_links || {};
    const memberEmail = (socialLinks.email || req.body.email || '').trim().toLowerCase();

    // 1. Insert into team_members table
    const text = `
      INSERT INTO team_members (name, slug, role, team, photo, bio, social_links, sort_order, show_on_home, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const params = [
      item.name,
      item.slug,
      item.role || 'Associate Researcher',
      item.team || null,
      item.photo || null,
      item.bio || null,
      JSON.stringify(socialLinks),
      item.sort_order || 0,
      item.show_on_home ?? false,
      item.is_active,
    ];

    const result = await query(text, params);
    const createdTeamMember = result.rows[0];

    // 2. Auto-create matching user login account in users table if email is provided
    let tempPassword = '';
    if (memberEmail) {
      const existingUser = await query('SELECT id FROM users WHERE LOWER(email) = $1', [memberEmail]);
      if (existingUser.rows.length === 0) {
        tempPassword = generateTempPassword();
        const passwordHash = await bcrypt.hash(tempPassword, 12);
        await query(
          `INSERT INTO users (name, email, password_hash, role, is_active)
           VALUES ($1, $2, $3, 'member', TRUE)
           ON CONFLICT DO NOTHING`,
          [item.name.trim(), memberEmail, passwordHash]
        );
      }
    }

    await logAudit(req.user, 'CREATE_TEAM_MEMBER', 'team_members', createdTeamMember.id, req.ip || '127.0.0.1', { name: item.name, email: memberEmail });

    // Return team member + generated temporary password and email so UI can pop up credentials
    return res.status(201).json({
      ...createdTeamMember,
      temp_password: tempPassword,
      user_email: memberEmail,
    });
  } catch (error: any) {
    console.error('Error creating team member:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Team member with this slug already exists.' });
    }
    return res.status(500).json({ error: 'Failed to create team member: ' + (error.message || 'Server error') });
  }
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await ensureTeamTableSchema();
    const { id } = req.params;

    const isPowerUser = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    if (!isPowerUser) {
      // SECURITY: Verify ownership by email FK lookup from users table — NOT by name string matching
      // This prevents spoofing by matching another member's display name.
      const existing = await query(
        `SELECT tm.id, u.email AS owner_email
           FROM team_members tm
           LEFT JOIN users u ON LOWER(u.email) = LOWER(tm.social_links->>'email')
          WHERE tm.id = $1`,
        [id]
      );
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Team member not found.' });
      }
      const ownerEmail = (existing.rows[0].owner_email || '').toLowerCase().trim();
      const requestorEmail = (req.user?.email || '').toLowerCase().trim();

      if (!requestorEmail || !ownerEmail || ownerEmail !== requestorEmail) {
        return res.status(403).json({ error: 'Permission denied. You can only edit your own personal bio.' });
      }
    }


    const parseResult = teamMemberSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const item = parseResult.data;
    const text = `
      UPDATE team_members 
      SET name=$1, slug=$2, role=$3, team=$4, photo=$5, bio=$6, social_links=$7, sort_order=$8, show_on_home=$9, is_active=$10, updated_at=NOW()
      WHERE id=$11
      RETURNING *
    `;
    const params = [
      item.name,
      item.slug,
      item.role,
      item.team || null,
      item.photo || null,
      item.bio || null,
      JSON.stringify(item.social_links || {}),
      item.sort_order || 0,
      item.show_on_home ?? false,
      item.is_active,
      id,
    ];

    const result = await query(text, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found.' });
    }

    await logAudit(req.user, 'UPDATE_TEAM_MEMBER', 'team_members', id, req.ip || '127.0.0.1', { name: item.name });

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update team member.' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Permission denied. Only Super Admin can delete team members.' });
    }

    const { id } = req.params;
    const result = await query('DELETE FROM team_members WHERE id = $1 RETURNING name, social_links', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found.' });
    }

    const deletedRow = result.rows[0];
    const memberEmail = deletedRow.social_links?.email || '';

    // Also delete matching user account from users table
    try {
      await query(
        "DELETE FROM users WHERE LOWER(name) = LOWER($1) OR (LOWER(email) = LOWER($2) AND $2 != '')",
        [deletedRow.name, memberEmail]
      );
    } catch (err) {
      console.warn('Matching user account deletion warning:', err);
    }

    await logAudit(req.user, 'DELETE_TEAM_MEMBER', 'team_members', id, req.ip || '127.0.0.1', { name: deletedRow.name });

    return res.json({ message: 'Team member deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete team member.' });
  }
});

export default router;
