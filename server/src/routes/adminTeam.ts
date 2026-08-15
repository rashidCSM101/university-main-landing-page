import { Router, Response } from 'express';
import { query } from '../db/index';
import { teamMemberSchema } from '../utils/validation';
import { authenticateToken, logAudit, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);


router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query('SELECT * FROM team_members ORDER BY sort_order ASC, name ASC');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch team members.' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = teamMemberSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const item = parseResult.data;
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
      JSON.stringify(item.social_links || {}),
      item.sort_order || 0,
      item.show_on_home ?? false,
      item.is_active,
    ];

    const result = await query(text, params);
    await logAudit(req.user, 'CREATE_TEAM_MEMBER', 'team_members', result.rows[0].id, req.ip || '127.0.0.1', { name: item.name });

    return res.status(201).json(result.rows[0]);
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
    const { id } = req.params;

    // Power users (super_admin and admin) can update any team member. Member role can only update their own personal bio.
    const isPowerUser = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    if (!isPowerUser) {
      const existing = await query('SELECT name, social_links FROM team_members WHERE id = $1', [id]);
      if (existing.rows.length > 0) {
        const row = existing.rows[0];
        const rowEmail = row.social_links?.email || '';
        const rowName = row.name || '';
        const isOwn =
          rowName.toLowerCase().trim() === req.user.name?.toLowerCase().trim() ||
          rowEmail.toLowerCase().trim() === req.user.email?.toLowerCase().trim();

        if (!isOwn) {
          return res.status(403).json({ error: 'Permission denied. You can only edit your own personal bio.' });
        }
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
    const result = await query('DELETE FROM team_members WHERE id = $1 RETURNING name', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found.' });
    }

    await logAudit(req.user, 'DELETE_TEAM_MEMBER', 'team_members', id, req.ip || '127.0.0.1', { name: result.rows[0].name });

    return res.json({ message: 'Team member deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete team member.' });
  }
});

export default router;
