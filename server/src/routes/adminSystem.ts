import { Router, Response } from 'express';
import { query } from '../db/index';
import { authenticateToken, requireRole, logAudit, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

/**
 * PUBLIC GET /api/v1/system/banner
 * Returns live emergency alert banner text & settings for main website header
 */
router.get('/banner', async (req, res: Response) => {
  try {
    const result = await query("SELECT value FROM system_settings WHERE key = 'emergency_banner'");
    if (result.rows.length === 0) {
      const defaultPayload = {
        is_active: false,
        message: '🔴 Emergency Alert: Indus Basin Flash Flood & Precipitation Attribution Study 2026 Released',
        url: '/publications',
      };
      return res.json(defaultPayload);
    }
    const stored = result.rows[0].value;
    // Guarantee is_active is boolean
    return res.json({
      ...stored,
      is_active: Boolean(stored?.is_active),
    });
  } catch {
    return res.json({
      is_active: false,
      message: '🔴 Emergency Alert: Indus Basin Flash Flood & Precipitation Attribution Study 2026 Released',
      url: '/publications',
    });
  }
});

// Protect all admin endpoints with JWT authentication
router.use(authenticateToken);

/**
 * GET /api/v1/admin/system/audit
 * Fetch real-time security audit trail (supports ?action=, ?limit=, ?offset=)
 */
router.get('/audit', requireRole('super_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { action, limit = '100', offset = '0' } = req.query;
    let text = 'SELECT id, user_id, user_email, action, entity, entity_id, ip_address, details, created_at FROM audit_logs WHERE 1=1';
    const params: any[] = [];

    if (action && action !== 'all') {
      params.push(action);
      text += ` AND action ILIKE '%' || $${params.length} || '%'`;
    }

    text += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit as string, 10), parseInt(offset as string, 10));

    const result = await query(text, params);
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch audit trail logs.' });
  }
});

/**
 * GET /api/v1/admin/system/health
 * System health, DB connection check, and platform counts
 */
router.get('/health', requireRole('super_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const startTime = Date.now();
    await query('SELECT 1');
    const latency = Date.now() - startTime;

    const usersCount = await query('SELECT COUNT(*) FROM users');
    const mediaCount = await query('SELECT COUNT(*) FROM media_items');
    const pubCount = await query('SELECT COUNT(*) FROM publications');
    const projCount = await query('SELECT COUNT(*) FROM projects');

    return res.json({
      status: 'operational',
      db_status: 'connected',
      latency_ms: latency,
      uptime_seconds: process.uptime(),
      counts: {
        users: parseInt(usersCount.rows[0].count, 10),
        media: parseInt(mediaCount.rows[0].count, 10),
        publications: parseInt(pubCount.rows[0].count, 10),
        projects: parseInt(projCount.rows[0].count, 10),
      },
    });
  } catch (error) {
    return res.status(500).json({ status: 'degraded', db_status: 'disconnected', error: 'Database health check failed' });
  }
});

/**
 * GET /api/v1/admin/system/backup
 * Download one-click JSON/SQL database snapshot export
 */
router.get('/backup', requireRole('super_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await query('SELECT id, name, email, role, is_active, created_at FROM users');
    const media = await query('SELECT * FROM media_items');
    const publications = await query('SELECT * FROM publications');
    const projects = await query('SELECT * FROM projects');
    const team = await query('SELECT * FROM team_members');
    const tools = await query('SELECT * FROM tools');

    const snapshot = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      exported_by: req.user?.email,
      tables: {
        users: users.rows,
        media_items: media.rows,
        publications: publications.rows,
        projects: projects.rows,
        team_members: team.rows,
        tools: tools.rows,
      },
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=wenclims_db_backup_${Date.now()}.json`);

    await logAudit(req.user, 'EXPORT_DB_BACKUP', 'system', 'all', req.ip || '127.0.0.1');

    return res.send(JSON.stringify(snapshot, null, 2));
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate database backup snapshot.' });
  }
});

/**
 * PUT /api/v1/admin/system/banner
 * Update live Emergency Alert Banner text & settings
 */
router.put('/banner', requireRole('super_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { is_active, message, url } = req.body;

    const payload = {
      is_active: is_active ?? false,
      message: message || '🔴 Emergency Alert: Climate Report Released',
      url: url || '/publications',
    };

    // Ensure system_settings table exists
    await query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR(255) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Safely update or insert
    const existing = await query("SELECT key FROM system_settings WHERE key = 'emergency_banner'");
    if (existing.rows.length > 0) {
      await query(
        "UPDATE system_settings SET value = $1, updated_at = NOW() WHERE key = 'emergency_banner'",
        [JSON.stringify(payload)]
      );
    } else {
      await query(
        "INSERT INTO system_settings (key, value, updated_at) VALUES ('emergency_banner', $1, NOW())",
        [JSON.stringify(payload)]
      );
    }

    await logAudit(req.user, 'UPDATE_EMERGENCY_BANNER', 'system', 'emergency_banner', req.ip || '127.0.0.1', payload);

    return res.json(payload);
  } catch (error: any) {
    console.error('Failed to update emergency banner settings:', error);
    return res.status(500).json({ error: 'Failed to update emergency banner settings: ' + (error?.message || 'DB error') });
  }
});

/**
 * GET /api/v1/admin/system/settings
 * Fetch stored Site Settings & Hero Stat Bar custom overrides
 */
router.get('/settings', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(255) PRIMARY KEY,
        setting_value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const result = await query("SELECT setting_key, setting_value FROM site_settings");
    const settingsMap: Record<string, any> = {};
    result.rows.forEach(r => {
      settingsMap[r.setting_key] = typeof r.setting_value === 'string' ? JSON.parse(r.setting_value) : r.setting_value;
    });

    return res.json(settingsMap);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch site settings.' });
  }
});

/**
 * PUT /api/v1/admin/system/settings
 * Update stored Site Settings & Hero Stat Bar custom overrides
 */
router.put('/settings', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(255) PRIMARY KEY,
        setting_value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const { hero_stats, general_settings } = req.body;

    if (hero_stats) {
      await query(
        `INSERT INTO site_settings (setting_key, setting_value, updated_at)
         VALUES ('hero_stats', $1, NOW())
         ON CONFLICT (setting_key) DO UPDATE SET setting_value = $1, updated_at = NOW()`,
        [JSON.stringify(hero_stats)]
      );
    }

    if (general_settings) {
      await query(
        `INSERT INTO site_settings (setting_key, setting_value, updated_at)
         VALUES ('general_settings', $1, NOW())
         ON CONFLICT (setting_key) DO UPDATE SET setting_value = $1, updated_at = NOW()`,
        [JSON.stringify(general_settings)]
      );
    }

    await logAudit(req.user, 'UPDATE_SITE_SETTINGS', 'system', 'site_settings', req.ip || '127.0.0.1');
    return res.json({ message: 'Site settings saved successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to save site settings: ' + (error?.message || '') });
  }
});

export default router;

