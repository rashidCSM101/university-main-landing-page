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
    let text = 'SELECT id, type, title, slug, body, excerpt, external_url, embed_url, cover_image, author_name, co_authors, tags, published_at FROM media_items WHERE status = $1';
    const params: any[] = ['published'];

    if (type) {
      params.push(type);
      text += ` AND type = $${params.length}`;
    }

    const parsedLimit = Math.min(Math.max(parseInt(limit as string, 10) || 20, 1), 100);
    const parsedOffset = Math.max(parseInt(offset as string, 10) || 0, 0);
    text += ` ORDER BY published_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parsedLimit, parsedOffset);

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
    const { type, limit = '50', offset = '0' } = req.query;
    let text = 'SELECT * FROM publications WHERE status = $1';
    const params: any[] = ['published'];

    if (type) {
      params.push(type);
      text += ` AND type = $${params.length}`;
    }

    const parsedLimit = Math.min(Math.max(parseInt(limit as string, 10) || 50, 1), 100);
    const parsedOffset = Math.max(parseInt(offset as string, 10) || 0, 0);
    text += ` ORDER BY published_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parsedLimit, parsedOffset);

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
    const { limit = '50', offset = '0' } = req.query;
    const parsedLimit = Math.min(Math.max(parseInt(limit as string, 10) || 50, 1), 100);
    const parsedOffset = Math.max(parseInt(offset as string, 10) || 0, 0);
    const result = await query(
      'SELECT * FROM projects ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [parsedLimit, parsedOffset]
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
    const { home, limit = '50', offset = '0' } = req.query;

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

    const parsedLimit = Math.min(Math.max(parseInt(limit as string, 10) || 50, 1), 100);
    const parsedOffset = Math.max(parseInt(offset as string, 10) || 0, 0);
    const result = await query(
      'SELECT id, name, slug, role, team, photo, bio, social_links, sort_order, show_on_home FROM team_members WHERE is_active = TRUE ORDER BY sort_order ASC, name ASC LIMIT $1 OFFSET $2',
      [parsedLimit, parsedOffset]
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
 * GET /api/v1/stats
 * Fetch Dynamic Homepage Hero Statistics (Supports Publications, Blogs, Excerpts, Documentaries & Talk shows)
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // 1. Fetch custom list if stored in site_settings
    let customList: any = null;
    try {
      const setRes = await query("SELECT setting_value FROM site_settings WHERE setting_key = 'hero_stats_list'");
      if (setRes.rows.length > 0) {
        customList = typeof setRes.rows[0].setting_value === 'string'
          ? JSON.parse(setRes.rows[0].setting_value)
          : setRes.rows[0].setting_value;
      }
    } catch (e) {
      console.warn('Error reading hero_stats_list:', e);
    }

    if (Array.isArray(customList) && customList.length > 0) {
      return res.json({ stats: customList });
    }

    // 2. Fetch real counts from DB as intelligent defaults
    const pubRes   = await query("SELECT COUNT(*) FROM publications WHERE status = 'published'");
    const blogRes  = await query("SELECT COUNT(*) FROM media_items WHERE type = 'blog' AND status = 'published'");
    const excerptRes = await query("SELECT COUNT(*) FROM media_items WHERE type = 'excerpt' AND status = 'published'");
    const videoRes = await query("SELECT COUNT(*) FROM media_items WHERE type IN ('video', 'talkshow', 'documentary') AND status = 'published'");

    const pubCount   = parseInt(pubRes.rows[0]?.count || '0', 10);
    const blogCount  = parseInt(blogRes.rows[0]?.count || '0', 10);
    const excerptCount = parseInt(excerptRes.rows[0]?.count || '0', 10);
    const videoCount = parseInt(videoRes.rows[0]?.count || '0', 10);

    const defaultStats = [
      { value: pubCount > 0 ? `${pubCount}` : '23', label: 'Publications' },
      { value: blogCount > 0 ? `${blogCount}+` : '25+', label: 'Blogs' },
      { value: excerptCount > 0 ? `${excerptCount}+` : '30+', label: 'Excerpts' },
      { value: videoCount > 0 ? `${videoCount}+` : '20+', label: 'Documentaries & Talk shows' },
    ];

    return res.json({ stats: defaultStats });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    return res.json({
      stats: [
        { value: '23', label: 'Publications' },
        { value: '25+', label: 'Blogs' },
        { value: '30+', label: 'Excerpts' },
        { value: '20+', label: 'Documentaries & Talk shows' },
      ],
    });
  }
});

export default router;

