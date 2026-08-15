/**
 * startup-migration.ts
 * ---------------------
 * Runs ONE TIME when the server starts.
 * Contains all schema patches that were previously scattered inside route handlers
 * as ALTER TABLE / CREATE TABLE calls on every request.
 *
 * This is NOT a full migration system — it's a safe idempotent patch runner.
 * Each statement uses IF NOT EXISTS / IF EXISTS so it's safe to run repeatedly.
 */

import { query } from '../db/index';

export async function runStartupMigrations(): Promise<void> {
  console.log('⚙️  Running startup schema migrations...');

  const migrations: Array<{ name: string; sql: string }> = [
    // ── team_members patches ──────────────────────────────────────────────────
    {
      name: 'team_members: add show_on_home column',
      sql: 'ALTER TABLE team_members ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT FALSE',
    },
    {
      name: 'team_members: drop enum constraint on team column',
      sql: 'ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_team_check',
    },
    {
      name: 'team_members: widen photo column to TEXT',
      sql: 'ALTER TABLE team_members ALTER COLUMN photo TYPE TEXT',
    },
    {
      name: 'team_members: widen role column to TEXT',
      sql: 'ALTER TABLE team_members ALTER COLUMN role TYPE TEXT',
    },
    {
      name: 'team_members: widen team column to TEXT',
      sql: 'ALTER TABLE team_members ALTER COLUMN team TYPE TEXT',
    },
    {
      name: 'team_members: widen bio column to TEXT',
      sql: 'ALTER TABLE team_members ALTER COLUMN bio TYPE TEXT',
    },

    // ── media_items patches ───────────────────────────────────────────────────
    {
      name: 'media_items: drop type enum constraint',
      sql: 'ALTER TABLE media_items DROP CONSTRAINT IF EXISTS media_items_type_check',
    },
    {
      name: 'media_items: drop status enum constraint',
      sql: 'ALTER TABLE media_items DROP CONSTRAINT IF EXISTS media_items_status_check',
    },

    // ── publications patches ──────────────────────────────────────────────────
    {
      name: 'publications: drop type enum constraint',
      sql: 'ALTER TABLE publications DROP CONSTRAINT IF EXISTS publications_type_check',
    },
    {
      name: 'publications: drop status enum constraint',
      sql: 'ALTER TABLE publications DROP CONSTRAINT IF EXISTS publications_status_check',
    },
    {
      name: 'publications: widen thumbnail column to TEXT',
      sql: 'ALTER TABLE publications ALTER COLUMN thumbnail TYPE TEXT',
    },
    {
      name: 'publications: widen external_url column to TEXT',
      sql: 'ALTER TABLE publications ALTER COLUMN external_url TYPE TEXT',
    },
    {
      name: 'publications: widen outlet_name column to TEXT',
      sql: 'ALTER TABLE publications ALTER COLUMN outlet_name TYPE TEXT',
    },
    {
      name: 'publications: widen author_name column to TEXT',
      sql: 'ALTER TABLE publications ALTER COLUMN author_name TYPE TEXT',
    },

    // ── projects patches ──────────────────────────────────────────────────────
    {
      name: 'projects: drop status enum constraint',
      sql: 'ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check',
    },

    // ── tools patches ─────────────────────────────────────────────────────────
    {
      name: 'tools: drop sector enum constraint',
      sql: 'ALTER TABLE tools DROP CONSTRAINT IF EXISTS tools_sector_check',
    },
    {
      name: 'tools: widen thumbnail column to TEXT',
      sql: 'ALTER TABLE tools ALTER COLUMN thumbnail TYPE TEXT',
    },
    {
      name: 'tools: widen external_url column to TEXT',
      sql: 'ALTER TABLE tools ALTER COLUMN external_url TYPE TEXT',
    },
    {
      name: 'tools: widen sector column to TEXT',
      sql: 'ALTER TABLE tools ALTER COLUMN sector TYPE TEXT',
    },

    // ── users patches ─────────────────────────────────────────────────────────
    {
      name: 'users: drop role enum constraint',
      sql: 'ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check',
    },
    {
      name: 'users: widen role column to VARCHAR(50)',
      sql: 'ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50)',
    },

    // ── system_settings table ─────────────────────────────────────────────────
    {
      name: 'system_settings: create table if not exists',
      sql: `CREATE TABLE IF NOT EXISTS system_settings (
        key        VARCHAR(255) PRIMARY KEY,
        value      JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )`,
    },
    {
      name: 'system_settings: seed default emergency banner',
      sql: `INSERT INTO system_settings (key, value, updated_at)
            VALUES ('emergency_banner', '{"is_active":false,"message":"🔴 Emergency Alert: Indus Basin Flash Flood & Precipitation Attribution Study 2026 Released","url":"/publications"}', NOW())
            ON CONFLICT (key) DO NOTHING`,
    },
  ];

  let successCount = 0;
  let skipCount = 0;

  for (const migration of migrations) {
    try {
      await query(migration.sql);
      successCount++;
    } catch (err: any) {
      // Many ALTER TABLE commands harmlessly fail if already applied (wrong type, etc.)
      // Log as a skip rather than crashing the server
      console.warn(`  ⚠️  Migration skipped [${migration.name}]:`, err.message?.split('\n')[0]);
      skipCount++;
    }
  }

  console.log(`✅ Startup migrations complete: ${successCount} applied, ${skipCount} skipped.`);
}
