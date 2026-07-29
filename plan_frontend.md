# 🌦️ WenClims — Frontend Public Site Plan
### wenclims.org → React + Vite + TypeScript rebuild

---

## Project Identity

| Field | Value |
|-------|-------|
| **Organisation** | Weather and Climate Services (WenClims), Islamabad, Pakistan |
| **Site** | wenclims.org |
| **Stack** | React 18 · TypeScript · Vite · TailwindCSS v3 · React Router v6 |
| **Animations** | GSAP + Lenis (already in codebase — keep) |
| **Map** | Leaflet.js + GeoJSON (world country boundaries) |
| **SEO** | react-helmet-async (already in codebase — keep) |
| **Icons** | Lucide React (already in codebase — keep) |
| **Deployment** | gh-pages → wenclims.org |

---

## Design Direction

- **Color Palette**: Deep navy `#0B1E3D` primary, electric teal `#00C8C8` accent, sky gradient headers, clean white content areas
- **Typography**: Google Fonts — `Inter` (body) + `Outfit` (headings)
- **Feel**: Premium scientific/policy organization. Think IPCC × think-tank × modern NGO — NOT generic university template
- **Dark sections** for hero + map; **white/light sections** for content
- **Micro-animations**: GSAP scroll-triggered reveals on all section entries
- **No placeholder images** — generate or use real WenClims media

---

## Routing Table (14 Pages)

```
wenclims.org/
│
├── /                          → Home (landing)
├── /tools                     → Tools (sector cards + external links)
├── /projects                  → Projects listing
├── /projects/:slug            → Individual project detail
│
├── /publications              → Publications hub (latest from both sub-types)
├── /publications/research     → Peer-Reviewed Research listing
├── /publications/reports      → Reports listing
│
├── /media                     → Media hub (latest from all 5 sub-types)
├── /media/blogs               → Blog listing
├── /media/blogs/:slug         → Single Blog post
├── /media/documentaries       → Documentaries listing
├── /media/documentaries/:slug → Single Documentary
├── /media/podcasts            → Podcasts & Radioshows listing
├── /media/talkshows           → Talkshows listing
├── /media/print               → Print Media Excerpts listing
│
├── /team                      → Team directory
├── /team/:slug                → Individual team member bio
│
├── /contact                   → Contact form + map embed
│
└── *                          → 404 NotFound
```

> **Note:** No `/login` or `/signup` on the public site — auth lives entirely on `admin.wenclims.org`

---

## Component Architecture

### Layout Components (always rendered)
| Component | Description |
|-----------|-------------|
| `Navbar.tsx` | Sticky top nav, mega-menu for Publications & Media dropdowns |
| `Footer.tsx` | Address, email, phone, social links (X, LinkedIn) |
| `ScrollToTop.tsx` | Resets scroll position on route change |
| `SEOHead.tsx` | Wrapper around `react-helmet-async` for per-page meta tags |

### Page Components

#### 🏠 Home (`/`)
Sections stacked vertically, each scroll-triggered:

| Section Component | Content |
|-------------------|---------|
| `HeroSection.tsx` | Full-screen animated banner: tagline "SCIENCE & POLICY TOGETHER — Climate Change", CTA buttons |
| `SectorsSlider.tsx` | 3-card sector slider: Climate / Water / Energy, each linking to tools |
| `AboutSummary.tsx` | Motivation · Focus · Consulting — 3-column layout |
| `InteractiveMap.tsx` | **World map (Leaflet + GeoJSON)** — click any country to see climate data panel |
| `FeaturedProjects.tsx` | Latest 3 projects pulled from API |
| `FeaturedMedia.tsx` | Latest blog posts + 1 documentary card |
| `PartnersBar.tsx` | Logos of EU H2020, ADB, World Weather Attribution, etc. |

#### 🗺️ Interactive Map (within Home)

**Library**: Leaflet.js + `react-leaflet` + GeoJSON world boundaries (Natural Earth / ne_110m)

**Behaviour on country click:**
1. Country polygon highlights (fill color change)
2. Side panel slides in with:
   - Country name + flag emoji
   - **Temperature anomaly** (via Open-Meteo API — free, no key needed)
   - **Rainfall data** (last 30 days average)
   - **Extreme events** count (if WenClims has data for that country)
   - Link: "View related publications →" (filters `/publications` by country tag)
3. Click elsewhere → panel closes

**Data sources (all free):**
- Geographic boundaries: `ne_110m_admin_0_countries.geojson` (Natural Earth, ~500 KB)
- Climate data: Open-Meteo Historical API (`api.open-meteo.com/v1/archive`) — no API key
- WenClims-specific country links: internal API from our backend

#### 🔧 Tools (`/tools`)
| Component | Content |
|-----------|---------|
| `ToolsPage.tsx` | Sector-grouped cards: Climate / Meteo / Energy / Water |
| `ToolCard.tsx` | Reusable card — thumbnail, title, sector badge, external link |

#### 📁 Projects (`/projects`, `/projects/:slug`)
| Component | Content |
|-----------|---------|
| `ProjectsPage.tsx` | Grid listing of all projects |
| `ProjectCard.tsx` | Funder badge, title, region, summary excerpt |
| `ProjectDetail.tsx` | Full project — objectives, activities, services, funder logo |

#### 📚 Publications (`/publications`, `/publications/research`, `/publications/reports`)
| Component | Content |
|-----------|---------|
| `PublicationsHub.tsx` | Hub page — 4 latest from each sub-type |
| `ResearchPage.tsx` | Full listing of peer-reviewed papers, filterable by year/author |
| `ReportsPage.tsx` | Full listing of reports |
| `PublicationCard.tsx` | Reusable — title, outlet badge, author, date, external DOI link |

#### 📺 Media Hub (`/media` and sub-pages)
| Component | Content |
|-----------|---------|
| `MediaHub.tsx` | Landing — latest 4-5 from each of 5 sub-types |
| `BlogsPage.tsx` | Paginated blog listing |
| `BlogPost.tsx` | Full blog article (rich text rendered from DB) |
| `DocumentariesPage.tsx` | Video embed cards (YouTube/Vimeo) + internal writeups |
| `PodcastsPage.tsx` | Audio/embed cards, mix of internal + external |
| `TalksPage.tsx` | Talkshow embed cards (YouTube) |
| `PrintMediaPage.tsx` | External link cards to Dawn, Al Jazeera, etc. |
| `MediaCard.tsx` | Reusable card for all media sub-types |

#### 👥 Team (`/team`, `/team/:slug`)
| Component | Content |
|-----------|---------|
| `TeamPage.tsx` | 3-group layout: Leadership · Policy Team · Data & Modelling Team |
| `TeamMemberCard.tsx` | Photo, name, title, social icons |
| `TeamMemberBio.tsx` | Full bio page per person — photo, role, publications, socials |

#### 📬 Contact (`/contact`)
| Component | Content |
|-----------|---------|
| `ContactPage.tsx` | Left: form (name/email/message + reCAPTCHA) · Right: map embed + address |

---

## API Integration (Frontend → Backend)

All API calls go through a centralized `services/api.ts` file using `fetch` or `axios`.  
Base URL: `https://api.wenclims.org` (or `http://localhost:5000` in dev via Vite proxy)

```typescript
// Example service pattern
export const getProjects = () => fetch('/api/v1/projects').then(r => r.json());
export const getMediaByType = (type: string) => fetch(`/api/v1/media?type=${type}`).then(r => r.json());
```

**External API Calls (client-side):**
- Open-Meteo API — called directly from `InteractiveMap.tsx` on country click
- No API key required — CORS-friendly

---

## File & Folder Structure (target)

```
client/src/
├── main.tsx
├── App.tsx                    ← Updated routing
├── vite-env.d.ts
│
├── styles/
│   └── index.css              ← Global design tokens, typography
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── SEOHead.tsx
│   │
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── SectorsSlider.tsx
│   │   ├── AboutSummary.tsx
│   │   ├── InteractiveMap.tsx  ← Leaflet map
│   │   ├── FeaturedProjects.tsx
│   │   ├── FeaturedMedia.tsx
│   │   └── PartnersBar.tsx
│   │
│   ├── tools/
│   │   ├── ToolsPage.tsx
│   │   └── ToolCard.tsx
│   │
│   ├── projects/
│   │   ├── ProjectsPage.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ProjectDetail.tsx
│   │
│   ├── publications/
│   │   ├── PublicationsHub.tsx
│   │   ├── ResearchPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── PublicationCard.tsx
│   │
│   ├── media/
│   │   ├── MediaHub.tsx
│   │   ├── BlogsPage.tsx
│   │   ├── BlogPost.tsx
│   │   ├── DocumentariesPage.tsx
│   │   ├── PodcastsPage.tsx
│   │   ├── TalksPage.tsx
│   │   ├── PrintMediaPage.tsx
│   │   └── MediaCard.tsx
│   │
│   ├── team/
│   │   ├── TeamPage.tsx
│   │   ├── TeamMemberCard.tsx
│   │   └── TeamMemberBio.tsx
│   │
│   ├── contact/
│   │   └── ContactPage.tsx
│   │
│   └── shared/
│       ├── NotFound.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx   ← NEW: wraps route tree
│
└── services/
    └── api.ts                  ← Centralized API calls
```

---

## New Dependencies to Add (Client)

```bash
# Map
npm install leaflet react-leaflet @types/leaflet

# Rich text rendering (for blog posts from DB)
npm install react-markdown remark-gfm

# HTTP client (optional — fetch works too)
npm install axios
```

---

## SEO Per Page

Every page uses `<SEOHead>` with:
- `<title>` — page-specific, e.g. `"Peer-Reviewed Research | WenClims"`
- `<meta name="description">` — page-specific
- `<meta property="og:image">` — page thumbnail
- `<link rel="canonical">` — correct URL

`robots.txt` and `sitemap.xml` already exist — update sitemap to reflect new routes.

---

## Security Rules During Frontend Coding
> From `security-testing-guide.md` — applied to frontend work

| Rule | Applied How |
|------|-------------|
| **Escape user content** | Never use `dangerouslySetInnerHTML` on blog/paper content — use `react-markdown` or sanitize with `DOMPurify` first |
| **No secrets in client** | Open-Meteo needs no key; if any API key is needed, proxy through backend — never hardcode in React |
| **CSP-friendly code** | No inline `<script>` or `<style>` tags; no `eval()` calls; Leaflet loaded via npm, not CDN |
| **reCAPTCHA on contact form** | Add Google reCAPTCHA v3 on the contact form before going live |
| **React auto-escaping** | Rely on JSX's built-in XSS protection; document this pattern in code comments |
| **Error boundaries** | Wrap every route tree in `<ErrorBoundary>` — users never see raw stack traces |
| **No auth on public site** | No login/JWT handling in this codebase — login is `admin.wenclims.org` only |

---

## Build & Deployment

```bash
# Dev (both client + server)
npm run dev          # from root

# Build client only
cd client && npm run build

# Deploy to gh-pages (wenclims.org)
cd client && npm run deploy
```

`vite.config.ts` — set `base` to `'/'` for custom domain deployment.

---

## Implementation Order

```
Phase 1 — Foundation
  [1] Update index.css (design tokens, typography, colors)
  [2] Create Navbar + Footer (layout shell)
  [3] Update App.tsx routing (all 14 routes)
  [4] Add ErrorBoundary + ScrollToTop + SEOHead

Phase 2 — Home Page
  [5] HeroSection
  [6] SectorsSlider
  [7] AboutSummary
  [8] InteractiveMap (Leaflet + GeoJSON + Open-Meteo)
  [9] FeaturedProjects + FeaturedMedia
  [10] PartnersBar

Phase 3 — Content Pages
  [11] Tools page
  [12] Projects listing + detail
  [13] Publications hub + Research + Reports
  [14] Media hub + all 5 sub-pages + BlogPost detail

Phase 4 — Team + Contact
  [15] Team directory + individual bio pages
  [16] Contact form + reCAPTCHA

Phase 5 — Polish
  [17] GSAP scroll animations on all sections
  [18] Full SEO audit (titles, descriptions, sitemap update)
  [19] Responsive mobile testing
  [20] `npm audit` — fix any vulnerabilities
```
