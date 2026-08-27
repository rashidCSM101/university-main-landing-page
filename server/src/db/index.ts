import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Build SSL configuration from environment
function buildSslConfig(): false | { rejectUnauthorized: boolean; ca?: string } {
  if (process.env.NODE_ENV !== 'production') return false;
  const caPath = process.env.DB_SSL_CA;
  if (caPath) {
    return { rejectUnauthorized: true, ca: fs.readFileSync(caPath, 'utf-8') };
  }
  // Fallback: SSL enabled but no CA cert verification (set DB_SSL_CA for full security)
  return { rejectUnauthorized: false };
}

// PostgreSQL Connection Pool setup using environment variables
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'wenclims_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 10,                         // Reduced from 20 — safe for 2GB VPS
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: buildSslConfig(),
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

/**
 * Parameterized Query Wrapper — Prevents SQL Injection Vulnerabilities
 * Always pass parameterized queries (`$1, $2`) and values array (`[val1, val2]`).
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text: text.substring(0, 80), duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', { text, error });
    throw error;
  }
}

/**
 * Runs one-time startup schema alignments without impacting per-request latency
 */
export async function initDbSchema(): Promise<void> {
  try {
    // 1. Settings tables
    await query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR(255) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(255) PRIMARY KEY,
        setting_value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Users schema alignments
    await query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check');
    await query('ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50)');

    // 3. Media schema alignments
    await query('ALTER TABLE media_items DROP CONSTRAINT IF EXISTS media_items_type_check');
    await query('ALTER TABLE media_items DROP CONSTRAINT IF EXISTS media_items_status_check');
    await query('ALTER TABLE media_items ADD COLUMN IF NOT EXISTS author_id UUID');
    await query('ALTER TABLE media_items ADD COLUMN IF NOT EXISTS co_authors TEXT[]');
    await query('CREATE UNIQUE INDEX IF NOT EXISTS idx_media_unique_title_ci ON media_items (LOWER(TRIM(title)))');

    // 4. Publications schema alignments
    await query('ALTER TABLE publications ADD COLUMN IF NOT EXISTS author_id VARCHAR(255)');
    await query('ALTER TABLE publications DROP CONSTRAINT IF EXISTS publications_type_check');
    await query('ALTER TABLE publications DROP CONSTRAINT IF EXISTS publications_status_check');
    await query('ALTER TABLE publications ALTER COLUMN thumbnail TYPE TEXT');
    await query('ALTER TABLE publications ALTER COLUMN external_url TYPE TEXT');
    await query('ALTER TABLE publications ALTER COLUMN outlet_name TYPE TEXT');
    await query('ALTER TABLE publications ALTER COLUMN author_name TYPE TEXT');
    await query('CREATE UNIQUE INDEX IF NOT EXISTS idx_pubs_unique_title_ci ON publications (LOWER(TRIM(title)))');

    // 5. Projects schema alignments
    await query('ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check');

    // 6. Team schema alignments
    await query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT FALSE');
    await query('ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_team_check');
    await query('ALTER TABLE team_members ALTER COLUMN photo TYPE TEXT');
    await query('ALTER TABLE team_members ALTER COLUMN role TYPE TEXT');
    await query('ALTER TABLE team_members ALTER COLUMN team TYPE TEXT');
    await query('ALTER TABLE team_members ALTER COLUMN bio TYPE TEXT');

    // 7. Tools schema alignments
    await query('ALTER TABLE tools DROP CONSTRAINT IF EXISTS tools_sector_check');
    await query('ALTER TABLE tools ALTER COLUMN thumbnail TYPE TEXT');
    await query('ALTER TABLE tools ALTER COLUMN external_url TYPE TEXT');
    await query('ALTER TABLE tools ALTER COLUMN sector TYPE TEXT');

    console.log('✅ Database schema verified and initialized.');
  } catch (error) {
    console.warn('⚠️ Non-fatal DB schema initialization warning:', error);
  }
}
