# ⚙️ WenClims — Admin Dashboard Plan
### admin.wenclims.org → Separate React + Vite App + Express + PostgreSQL

---

## Architecture Overview

```
admin.wenclims.org         → React + Vite + TypeScript (dashboard SPA)
api.wenclims.org           → Express.js + TypeScript (shared backend)
PostgreSQL                 → Single database (wenclims_db)
```

> The dashboard is a **completely separate Vite app** in its own folder (e.g. `/admin` alongside `/client` and `/server`).  
> It shares the same Express backend — just protected routes under `/api/v1/admin/*`.

---

## Roles & Access Control

| Role | Description | Permissions |
|------|-------------|-------------|
| **Super Admin** | Full system access | Manage users · All CRUD · Site settings · Audit logs |
| **Editor / Employee** | Content manager | Create/Edit/Delete own blogs, papers, media, projects · Cannot manage users |

> Role is stored in the PostgreSQL `users` table and checked **server-side on every request** — never trust the frontend role claim.

---

## Dashboard Pages & Features

### 1. Auth Pages
| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Email + Password + TOTP (2FA) for Super Admin |
| Forgot Password | `/forgot-password` | Email-based password reset link |

### 2. Main Dashboard (after login)
| Widget | Visible To |
|--------|------------|
| Total published blogs / papers / projects | Both |
| Pending drafts count | Both |
| Recent activity feed | Both |
| User management quick link | Super Admin only |
| Audit log quick link | Super Admin only |

### 3. Blog Management
| Feature | Super Admin | Editor |
|---------|------------|--------|
| List all blogs | ✅ | Own only |
| Create new blog | ✅ | ✅ |
| Edit blog (rich text editor) | ✅ | Own only |
| Upload cover image | ✅ | ✅ |
| Add tags / categories | ✅ | ✅ |
| **Publish** (goes live on main site) | ✅ | ✅ (own) |
| Delete any blog | ✅ | Own only |

**Blog fields**: `title`, `slug` (auto-generated), `body` (rich text), `excerpt`, `coverImage`, `tags[]`, `author`, `status` (draft/published), `publishedAt`, `updatedAt`

### 4. Publications Management
#### Peer-Reviewed Research
**Fields**: `title`, `authorName`, `coAuthors[]`, `outletName`, `externalDOI_URL`, `publishedDate`, `abstract`, `thumbnail`, `tags[]`

#### Reports
**Fields**: `title`, `authorName`, `source` (e.g. "World Weather Attribution"), `externalURL`, `publishedDate`, `summary`, `thumbnail`

| Feature | Super Admin | Editor |
|---------|------------|--------|
| Add / Edit / Delete papers & reports | ✅ | ✅ |
| Publish | ✅ | ✅ |

### 5. Media Management
All 5 media types managed from one interface with a **Type** selector:

| Type | Key Extra Fields |
|------|-----------------|
| Blog | Rich text body, cover image |
| Documentary | YouTube/Vimeo embed URL or internal writeup |
| Podcast & Radioshow | Audio embed URL or external link |
| Talkshow | YouTube embed URL or external link |
| Print Media Excerpt | External URL, source name (Dawn, Al Jazeera, etc.) |

**Shared fields for all media**: `title`, `slug`, `type`, `authorName`, `date`, `thumbnail`, `status`, `tags[]`

### 6. Projects Management
**Fields**: `title`, `slug`, `funderName`, `funderCode` (e.g. ADB-55236-001), `region`, `objectives[]`, `activities[]`, `services[]`, `images[]`, `status`, `startDate`, `endDate`

### 7. Team Management
**Fields**: `name`, `slug`, `role`, `team` (leadership / policy / data-modelling), `photo`, `bio` (rich text), `socialLinks` (LinkedIn, X, Google Scholar, GitHub, Kaggle), `isActive`

### 8. Tools Management
Manage the tools cards shown on `/tools`:
**Fields**: `title`, `sector` (Climate / Meteo / Energy / Water), `description`, `externalURL`, `thumbnail`, `order`

### 9. User Management *(Super Admin only)*
| Feature | Description |
|---------|-------------|
| List all users | Name, email, role, last login, status |
| Invite new user | Send invite link to email (no self-registration) |
| Change role | Admin ↔ Editor |
| Deactivate user | Soft-delete (cannot login, data preserved) |
| Reset 2FA | If admin loses authenticator |

### 10. Audit Log *(Super Admin only)*
Auto-logged table showing:
- `timestamp`, `user`, `action` (published blog #12, deleted paper #3, changed role of user X), `ip_address`

### 11. Site Settings *(Super Admin only)*
- Update contact info (address, email, phone)
- Update social links
- Toggle maintenance mode

---

## PostgreSQL Database Schema

```sql
-- Users
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,        -- bcrypt, cost 12
  role        TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
  totp_secret TEXT,                   -- for 2FA (admins only)
  is_active   BOOLEAN DEFAULT TRUE,
  last_login  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Media Items (blogs, documentaries, podcasts, talkshows, print)
CREATE TABLE media_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type         TEXT NOT NULL CHECK (type IN ('blog','documentary','podcast','talkshow','print')),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  body         TEXT,                  -- rich HTML (sanitized before save)
  excerpt      TEXT,
  external_url TEXT,
  embed_url    TEXT,
  cover_image  TEXT,                  -- storage path or URL
  author_name  TEXT,
  author_id    UUID REFERENCES users(id),
  tags         TEXT[],
  status       TEXT DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Publications (peer-reviewed + reports)
CREATE TABLE publications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type         TEXT NOT NULL CHECK (type IN ('peer-reviewed','report')),
  title        TEXT NOT NULL,
  author_name  TEXT,
  co_authors   TEXT[],
  outlet_name  TEXT,
  external_url TEXT,
  published_date DATE,
  abstract     TEXT,
  thumbnail    TEXT,
  tags         TEXT[],
  status       TEXT DEFAULT 'published',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  funder_name  TEXT,
  funder_code  TEXT,
  region       TEXT,
  objectives   TEXT[],
  activities   TEXT[],
  services     TEXT[],
  images       TEXT[],
  status       TEXT DEFAULT 'active',
  start_date   DATE,
  end_date     DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members
CREATE TABLE team_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  role         TEXT NOT NULL,
  team         TEXT CHECK (team IN ('leadership','policy','data-modelling')),
  photo        TEXT,
  bio          TEXT,
  social_links JSONB,               -- { linkedin, twitter, scholar, github, kaggle }
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Tools
CREATE TABLE tools (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  sector       TEXT CHECK (sector IN ('Climate','Meteo','Energy','Water')),
  description  TEXT,
  external_url TEXT NOT NULL,
  thumbnail    TEXT,
  sort_order   INT DEFAULT 0,
  is_active    BOOLEAN DEFAULT TRUE
);

-- Audit Logs
CREATE TABLE audit_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  user_email TEXT,
  action     TEXT NOT NULL,
  entity     TEXT,                   -- 'blog', 'project', 'user', etc.
  entity_id  TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Backend API Routes (Protected)

All routes under `/api/v1/admin/*` require a valid JWT in the `Authorization: Bearer <token>` header.

```
POST   /api/v1/auth/login               → Returns access_token + sets refresh_token cookie
POST   /api/v1/auth/refresh             → Refresh access token
POST   /api/v1/auth/logout              → Invalidate refresh token (server-side)
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

--- Admin protected ---
GET    /api/v1/admin/dashboard/stats    → Counts, recent activity
GET    /api/v1/admin/audit-logs         → [admin only]

GET    /api/v1/admin/media              → List (with ?type=blog&status=draft filters)
POST   /api/v1/admin/media              → Create
GET    /api/v1/admin/media/:id
PUT    /api/v1/admin/media/:id
DELETE /api/v1/admin/media/:id

GET    /api/v1/admin/publications
POST   /api/v1/admin/publications
PUT    /api/v1/admin/publications/:id
DELETE /api/v1/admin/publications/:id

GET    /api/v1/admin/projects
POST   /api/v1/admin/projects
PUT    /api/v1/admin/projects/:id
DELETE /api/v1/admin/projects/:id

GET    /api/v1/admin/team
POST   /api/v1/admin/team
PUT    /api/v1/admin/team/:id
DELETE /api/v1/admin/team/:id

GET    /api/v1/admin/tools
POST   /api/v1/admin/tools
PUT    /api/v1/admin/tools/:id
DELETE /api/v1/admin/tools/:id

GET    /api/v1/admin/users              → [admin only]
POST   /api/v1/admin/users/invite       → [admin only]
PUT    /api/v1/admin/users/:id/role     → [admin only]
PUT    /api/v1/admin/users/:id/deactivate → [admin only]
```

---

## Security Implementation Checklist
> Following `security-testing-guide.md` in implementation order

### ✅ Phase 1 — Auth & RBAC (First, builds everything else on top)
- [ ] Separate login endpoint for admin site only (`/api/v1/auth/login`)
- [ ] Roles stored in DB (`admin` | `editor`) — checked **server-side on every route**
- [ ] Passwords hashed with **bcrypt** (cost factor 12)
- [ ] **TOTP 2FA** for Super Admin via `speakeasy` library
- [ ] **JWT access tokens** — 15 min expiry
- [ ] **Refresh tokens** — stored as `httpOnly; Secure; SameSite=Strict` cookie
- [ ] On logout, refresh token invalidated in DB (token blacklist table)
- [ ] Object-level permission check: editors can only edit **their own** content items

### ✅ Phase 2 — Input Validation
- [ ] All API inputs validated with **Zod** schemas server-side
- [ ] Use **Prisma** (PostgreSQL ORM) — no raw SQL concatenation
- [ ] Blog/media body HTML sanitized with `DOMPurify` (via jsdom) **before saving** to DB
- [ ] Frontend: `react-markdown` to render blog body — never `dangerouslySetInnerHTML`

### ✅ Phase 3 — File Upload Security
- [ ] File type validated by **magic bytes** using `file-type` npm package
- [ ] Max file size: 20 MB (papers/PDFs), 5 MB (images)
- [ ] Files renamed to `uuid + safe extension` on upload
- [ ] Files stored in **cloud storage** (Cloudinary or AWS S3) — not in the web root
- [ ] Serve files via signed URLs with permission checks

### ✅ Phase 4 — HTTP Security Headers
- [ ] **Helmet.js** added to Express for all security headers
- [ ] `Content-Security-Policy` configured (restrict script/style sources)
- [ ] `X-Frame-Options: DENY` on all admin routes
- [ ] Force HTTPS + `Strict-Transport-Security` header
- [ ] `X-Content-Type-Options: nosniff`

### ✅ Phase 5 — CSRF Protection
- [ ] JWT in `Authorization` header (not cookie) for API calls — reduces CSRF risk
- [ ] Validate `Origin` / `Referer` headers on all state-changing admin actions
- [ ] Refresh token cookie: `SameSite=Strict; Secure; HttpOnly`

### ✅ Phase 6 — Rate Limiting
- [ ] Login endpoint: **5 attempts per 15 min per IP** via `express-rate-limit`
- [ ] Exponential backoff after 3 consecutive failures
- [ ] All `/api/v1/admin/*` routes: 100 req/min rate limit

### ✅ Phase 7 — Secrets Management
- [ ] All credentials in `.env` — `.env` in `.gitignore`
- [ ] Verify `.env` was never committed: `git log --all --full-history -- .env`
- [ ] JWT secret, DB password, Cloudinary keys all in `.env`

### ✅ Phase 8 — Audit Logging
- [ ] Every admin action auto-logged to `audit_logs` table
- [ ] Log format: `{ user_id, user_email, action, entity, entity_id, ip_address, created_at }`
- [ ] Never log passwords or token values

### ✅ Phase 9 — Dependency & Infrastructure
- [ ] Run `npm audit` before every deploy
- [ ] Enable Dependabot on GitHub repo
- [ ] Daily DB backup configured (PostgreSQL `pg_dump`)

### ✅ Phase 10 — Testing
- [ ] Unit tests for permission middleware (Jest)
- [ ] Integration tests: each role × each protected route (Supertest)
- [ ] E2E: login → create blog → publish → logout (Playwright)
- [ ] Security scan: OWASP ZAP against staging before go-live

---

## Dashboard UI Stack

| Tech | Purpose |
|------|---------|
| React 18 + TypeScript | Framework |
| Vite | Build tool |
| TailwindCSS v3 | Styling |
| React Router v6 | Routing (protected routes HOC) |
| React Hook Form + Zod | Form handling + validation |
| TipTap | Rich text editor (for blogs, project bios) |
| React Query (TanStack) | Server state management, caching |
| Recharts | Stats charts on dashboard home |
| Lucide React | Icons |

---

## Dashboard Folder Structure

```
admin/                          ← New folder alongside /client and /server
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── App.tsx                 ← Protected route wrapper
    │
    ├── styles/
    │   └── index.css
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.tsx     ← Nav: Dashboard, Media, Publications, etc.
    │   │   ├── TopBar.tsx      ← User avatar, logout, role badge
    │   │   └── ProtectedRoute.tsx ← Redirects to /login if no valid token
    │   │
    │   ├── auth/
    │   │   ├── LoginPage.tsx
    │   │   ├── TOTPSetupPage.tsx
    │   │   └── ForgotPasswordPage.tsx
    │   │
    │   ├── dashboard/
    │   │   ├── DashboardHome.tsx
    │   │   ├── StatsCards.tsx
    │   │   └── RecentActivity.tsx
    │   │
    │   ├── media/
    │   │   ├── MediaList.tsx
    │   │   ├── MediaEditor.tsx  ← Create/Edit form with TipTap
    │   │   └── MediaFilters.tsx
    │   │
    │   ├── publications/
    │   │   ├── PublicationsList.tsx
    │   │   └── PublicationForm.tsx
    │   │
    │   ├── projects/
    │   │   ├── ProjectsList.tsx
    │   │   └── ProjectForm.tsx
    │   │
    │   ├── team/
    │   │   ├── TeamList.tsx
    │   │   └── TeamMemberForm.tsx
    │   │
    │   ├── tools/
    │   │   ├── ToolsList.tsx
    │   │   └── ToolForm.tsx
    │   │
    │   ├── users/              ← Super Admin only
    │   │   ├── UsersList.tsx
    │   │   └── InviteUserForm.tsx
    │   │
    │   └── audit/             ← Super Admin only
    │       └── AuditLogPage.tsx
    │
    └── services/
        ├── api.ts             ← Axios instance with JWT interceptor
        └── auth.ts            ← Login, logout, token refresh logic
```

---

## Implementation Order

```
Phase 1 — Backend Security Foundation
  [1]  Install Prisma + PostgreSQL + create schema migrations
  [2]  Auth routes: login, refresh, logout (JWT + bcrypt)
  [3]  TOTP 2FA setup for admin (speakeasy)
  [4]  Role middleware + object-level permission checks
  [5]  Helmet.js, CORS config, rate limiting
  [6]  Audit log middleware (auto-fires on every mutation)
  [7]  File upload route (multer + file-type + Cloudinary/S3)
  [8]  Zod validation schemas for all request bodies
  [9]  All CRUD routes for: media, publications, projects, team, tools, users

Phase 2 — Dashboard Frontend Shell
  [10] Vite app scaffold in /admin folder
  [11] Tailwind design system (dark sidebar + light content area)
  [12] Auth pages: Login + TOTP entry
  [13] ProtectedRoute HOC (checks token, role)
  [14] Sidebar + TopBar layout

Phase 3 — Content Management UIs
  [15] Dashboard Home (stats + recent activity)
  [16] Media list + editor (TipTap rich text)
  [17] Publications list + form
  [18] Projects list + form
  [19] Team list + form
  [20] Tools list + form

Phase 4 — Admin-Only Features
  [21] User management page (invite, role change, deactivate)
  [22] Audit log viewer (filterable table)
  [23] Site settings page

Phase 5 — Security Testing
  [24] Integration tests: all role × route combinations (Supertest)
  [25] E2E test flows (Playwright)
  [26] OWASP ZAP scan on staging
  [27] npm audit — fix all high/critical
```

---

## Connection: Dashboard → Public Site

When an Editor publishes content in the dashboard:
1. The record's `status` changes to `'published'` and `published_at` is set in PostgreSQL
2. The public site's API (`GET /api/v1/media?status=published`) already filters by this
3. Content appears **live immediately** on the corresponding public page (no rebuild needed)

Content is served from the same Express backend — just different route prefixes:
- **Public**: `GET /api/v1/media` → no auth required, returns only `published` items
- **Admin**: `GET /api/v1/admin/media` → JWT required, returns all statuses
