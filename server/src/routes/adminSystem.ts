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
      await query(
        "INSERT INTO system_settings (key, value, updated_at) VALUES ('emergency_banner', $1, NOW())",
        [JSON.stringify(defaultPayload)]
      );
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
 * Fetch real-time security audit trail
 */
router.get('/audit', requireRole('super_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT id, user_id, user_email, action, entity, entity_id, ip_address, details, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 100'
    );
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

    // UPSERT — atomic insert-or-update eliminates race condition
    await query(
      `INSERT INTO system_settings (key, value, updated_at)
       VALUES ('emergency_banner', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [JSON.stringify(payload)]
    );

    await logAudit(req.user, 'UPDATE_EMERGENCY_BANNER', 'system', 'emergency_banner', req.ip || '127.0.0.1', payload);

    return res.json(payload);
  } catch (error: any) {
    console.error('Failed to update emergency banner settings:', error);
    return res.status(500).json({ error: 'Failed to update emergency banner settings: ' + (error?.message || 'DB error') });
  }
});

export default router;
