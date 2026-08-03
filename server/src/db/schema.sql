-- =============================================================================
-- WenClims PostgreSQL Database Schema
-- Database Name: wenclims_db
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Authentication & RBAC)
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'editor')),
  totp_secret   VARCHAR(255),
  is_active     BOOLEAN DEFAULT TRUE,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Media Items Table (Blogs, Documentaries, Podcasts, Talkshows, Print)
CREATE TABLE IF NOT EXISTS media_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type         VARCHAR(50) NOT NULL CHECK (type IN ('blog', 'documentary', 'podcast', 'talkshow', 'print')),
  title        VARCHAR(500) NOT NULL,
  slug         VARCHAR(500) UNIQUE NOT NULL,
  body         TEXT,
  excerpt      TEXT,
  external_url TEXT,
  embed_url    TEXT,
  cover_image  TEXT,
  author_name  VARCHAR(255),
  author_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  tags         TEXT[] DEFAULT '{}',
  status       VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Publications Table (Peer-Reviewed Research & Reports)
CREATE TABLE IF NOT EXISTS publications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type           VARCHAR(50) NOT NULL CHECK (type IN ('peer-reviewed', 'report')),
  title          VARCHAR(500) NOT NULL,
  author_name    VARCHAR(255),
  co_authors     TEXT[] DEFAULT '{}',
  outlet_name    VARCHAR(255),
  external_url   VARCHAR(1000),
  published_date DATE,
  abstract       TEXT,
  thumbnail      VARCHAR(1000),
  tags           TEXT[] DEFAULT '{}',
  status         VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Projects Table (Regional Climate Projects & Initiatives)
CREATE TABLE IF NOT EXISTS projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(500) NOT NULL,
  slug         VARCHAR(500) UNIQUE NOT NULL,
  funder_name  VARCHAR(255),
  funder_code  VARCHAR(100),
  region       VARCHAR(255),
  objectives   TEXT[] DEFAULT '{}',
  activities   TEXT[] DEFAULT '{}',
  services     TEXT[] DEFAULT '{}',
  images       TEXT[] DEFAULT '{}',
  status       VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'upcoming')),
  start_date   DATE,
  end_date     DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Team Members Table (Leadership, Policy, Data Modelling)
CREATE TABLE IF NOT EXISTS team_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) UNIQUE NOT NULL,
  role         TEXT NOT NULL,
  team         TEXT,
  photo        TEXT,
  bio          TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  sort_order   INT DEFAULT 0,
  show_on_home BOOLEAN DEFAULT FALSE,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tools Table (Sector Climate & Meteorological Tools)
CREATE TABLE IF NOT EXISTS tools (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(255) NOT NULL,
  sector       VARCHAR(50) CHECK (sector IN ('Climate', 'Meteo', 'Energy', 'Water')),
  description  TEXT,
  external_url VARCHAR(1000) NOT NULL,
  thumbnail    VARCHAR(1000),
  sort_order   INT DEFAULT 0,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Audit Logs Table (Security Monitoring & Activity Tracking)
CREATE TABLE IF NOT EXISTS audit_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  action     VARCHAR(255) NOT NULL,
  entity     VARCHAR(100),
  entity_id  VARCHAR(255),
  ip_address VARCHAR(100),
  details    JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- Initial Seed Data
-- =============================================================================

-- Seed Default Super Admin Account: admin@wenclims.org
-- Password: "AdminPassword123!" hashed with bcrypt (cost factor 12)
INSERT INTO users (id, name, email, password_hash, role, is_active)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Dr. Rashid',
  'admin@wenclims.org',
  '$2b$12$wKORAT1STEOisgxGZX2wseIKSpdhogKYSTK7FgDhF8O8WjRxvHxfq',
  'super_admin',
  TRUE
) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Seed Sample Blogs & Media
INSERT INTO media_items (title, slug, type, body, excerpt, author_name, tags, status, published_at)
VALUES 
(
  'Heatwave Attribution and Climate Impact in South Asia 2025',
  'heatwave-attribution-south-asia-2025',
  'blog',
  'Comprehensive analysis of recent extreme temperatures and attribution modeling in regional weather systems.',
  'Attribution analysis of South Asian summer heatwaves using climate model ensembles.',
  'Dr. Rashid',
  ARRAY['Climate Change', 'Attribution', 'South Asia'],
  'published',
  NOW()
),
(
  'Monsoon Dynamics & Hydrological Forecasting Report',
  'monsoon-dynamics-hydrological-forecasting',
  'blog',
  'An in-depth review of monsoon precipitation shifts, runoff predictability, and flood warning integrations.',
  'Review of monsoon rainfall variability across river basins.',
  'Dr. Rashid',
  ARRAY['Monsoon', 'Hydrology', 'Weather'],
  'published',
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Publications
INSERT INTO publications (title, type, author_name, outlet_name, external_url, published_date, abstract, tags, status)
VALUES 
(
  'Extreme Precipitation Attribution over the Indus River Basin',
  'peer-reviewed',
  'Dr. Rashid',
  'Journal of Climate Dynamics',
  'https://doi.org/10.1007/s00382-025-07123-x',
  '2025-04-15',
  'This study presents high-resolution climate modeling evaluating extreme precipitation events across northern Pakistan.',
  ARRAY['Attribution', 'Indus Basin', 'Precipitation'],
  'published'
),
(
  'South Asian Climate Resilience & Policy Report 2025',
  'report',
  'WenClims Policy Research Team',
  'World Weather Attribution Partnership',
  'https://wenclims.org/reports/south-asia-resilience-2025.pdf',
  '2025-06-01',
  'Policy recommendations and vulnerable community impact assessments for heatwaves and extreme flood preparedness.',
  ARRAY['Policy', 'Resilience', 'Adaptation'],
  'published'
);

-- Seed Sample Tools
INSERT INTO tools (title, sector, description, external_url, sort_order, is_active)
VALUES
('PakClim Weather Tool', 'Meteo', 'High resolution weather and climate visualization platform for Pakistan.', 'https://pakclimtool.com', 1, TRUE),
('Indus Hydrological Predictor', 'Water', 'Streamflow and reservoir inflow forecasting interface.', 'https://pakclimtool.com/water', 2, TRUE),
('Solar & Wind Energy Atlas', 'Energy', 'Renewable energy potential mapping across South Asian regions.', 'https://pakclimtool.com/energy', 3, TRUE)
ON CONFLICT DO NOTHING;

