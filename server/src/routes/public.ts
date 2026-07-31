import { Router, Request, Response } from 'express';
import { query } from '../db/index';

const router = Router();

/**
 * GET /api/v1/media
 * Fetch Published Blogs & Media Items
 */
router.get('/media', async (req: Request, res: Response) => {
  try {
    const { type, limit = '20', offset = '0' } = req.query;
    let text = 'SELECT id, type, title, slug, body, excerpt, external_url, embed_url, cover_image, author_name, tags, published_at FROM media_items WHERE status = $1';
    const params: any[] = ['published'];

    if (type) {
      params.push(type);
      text += ` AND type = $${params.length}`;
    }

    text += ` ORDER BY published_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit as string, 10), parseInt(offset as string, 10));

    const result = await query(text, params);
    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching public media:', error);
    return res.status(500).json({ error: 'Failed to fetch media items.' });
  }
});

/**
 * GET /api/v1/media/:identifier
 * Fetch Single Media Item by Slug or UUID ID
 */
router.get('/media/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const result = await query(
      `SELECT * FROM media_items WHERE (slug = $1 OR id::text = $1) AND status = $2`,
      [identifier, 'published']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found.' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch content.' });
  }
});

/**
 * GET /api/v1/publications
 * Fetch Published Publications & Reports
 */
router.get('/publications', async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    let text = 'SELECT * FROM publications WHERE status = $1';
    const params: any[] = ['published'];

    if (type) {
      params.push(type);
      text += ` AND type = $${params.length}`;
    }

    text += ' ORDER BY published_date DESC';

    const result = await query(text, params);
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch publications.' });
  }
});

/**
 * GET /api/v1/projects
 * Fetch Climate Projects
 */
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

/**
 * GET /api/v1/team
 * Fetch Active Team Members (Supports ?home=true for Home Page Cards)
 */
router.get('/team', async (req: Request, res: Response) => {
  try {
    const { home } = req.query;
    await query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT FALSE');

    if (home === 'true') {
      const homeResult = await query(
        'SELECT id, name, slug, role, team, photo, bio, social_links, sort_order, show_on_home FROM team_members WHERE is_active = TRUE AND show_on_home = TRUE ORDER BY sort_order ASC, name ASC LIMIT 4'
      );
      if (homeResult.rows.length > 0) {
        return res.json(homeResult.rows);
      }
      // Fallback: If no members are explicitly checked for home, return top 4
      const fallbackResult = await query(
        'SELECT id, name, slug, role, team, photo, bio, social_links, sort_order, show_on_home FROM team_members WHERE is_active = TRUE ORDER BY sort_order ASC, name ASC LIMIT 4'
      );
      return res.json(fallbackResult.rows);
    }

    const result = await query(
      'SELECT id, name, slug, role, team, photo, bio, social_links, sort_order, show_on_home FROM team_members WHERE is_active = TRUE ORDER BY sort_order ASC, name ASC'
    );
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch team members.' });
  }
});

/**
 * GET /api/v1/projects/:identifier
 * Fetch Single Climate Project by ID or Slug
 */
router.get('/projects/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const result = await query(
      'SELECT * FROM projects WHERE (id::text = $1 OR slug = $1)',
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch project.' });
  }
});

/**
 * GET /api/v1/publications/:identifier
 * Fetch Single Publication by ID
 */
router.get('/publications/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const result = await query(
      'SELECT * FROM publications WHERE id::text = $1 AND status = $2',
      [identifier, 'published']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publication not found.' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch publication.' });
  }
});

/**
 * GET /api/v1/team/:identifier
 * Fetch Single Team Member by ID or Slug
 */
router.get('/team/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const result = await query(
      'SELECT * FROM team_members WHERE (id::text = $1 OR slug = $1) AND is_active = TRUE',
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found.' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch team member.' });
  }
});

/**
 * GET /api/v1/tools
 * Fetch Active Sector Tools
 */
router.get('/tools', async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM tools WHERE is_active = TRUE ORDER BY sort_order ASC'
    );
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tools.' });
  }
});

export default router;
