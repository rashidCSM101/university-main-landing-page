# 🔍 WenClims — SEO Implementation Guide
### WordPress → React + Vite Migration: What We Do in Code & What You Do on Deploy

---

> [!IMPORTANT]
> This is a **live site migration** (WordPress → React). The biggest SEO risk is **temporarily losing Google rankings** if not handled correctly. This guide protects against that.

---

## Who Does What

| Task | Done By | When |
|------|---------|------|
| Technical SEO in code (meta tags, sitemap, schema, redirects) | **Agent (in code)** | During development |
| Google Search Console verification | **You** | At deployment |
| Submit new sitemap to Google | **You** | After deployment |
| Monitor ranking changes post-migration | **You** | First 30 days after deploy |
| Multilingual content (Urdu translations) | **You** (content) + Agent (code structure) | Phase 2 |
| OG image upload per blog/paper | **You** (via Dashboard) | Ongoing |

---

## Part 1: Pre-Migration (Before We Deploy — CRITICAL)

### 1.1 Crawl & Save the Current WordPress Site

> [!CAUTION]
> **Do this BEFORE taking WordPress down.** This gives us a record of every URL that currently has Google traffic.

**You need to do:**
1. Go to [Google Search Console](https://search.google.com/search-console) for wenclims.org
2. If the site was auto-verified via Google Analytics on WordPress, it may already be there
3. Go to **Performance** → **Pages** → Export all current URLs as CSV
4. Save this — it's our "old URL list" that we must redirect from

**Or use Screaming Frog (free up to 500 URLs):**
```
Download: https://www.screamingfrog.co.uk/seo-spider/
Crawl: wenclims.org
Export: All URLs, Status Codes, Meta Titles, Descriptions
```

### 1.2 Key Old WordPress URLs That Need 301 Redirects

The following old WordPress URLs still may have backlinks and Google juice. We redirect them to the new clean URLs:

| Old WordPress URL | New URL | Notes |
|-------------------|---------|-------|
| `/peer-reviewed-research/` | `/publications/research` | High value — published papers |
| `/reports/` | `/publications/reports` | |
| `/blogs/` | `/media/blogs` | 26 blog posts with backlinks |
| `/documentaries/` | `/media/documentaries` | |
| `/podcats-and-radioshows/` | `/media/podcasts` | Typo fixed in new URL |
| `/print-media-excerpts/` | `/media/print` | |
| `/talkshows/` | `/media/talkshows` | |
| `/project/` | `/projects` | |
| `/publications/` | `/publications` | Hub page |
| `/media/` | `/media` | Hub page |
| `/team/` | `/team` | |
| `/tools/` | `/tools` | |
| `/contact/` | `/contact` | |

**Individual blog post URLs** — each of the 26 blog slugs should redirect:
```
/the-fabric-of-climate-resilience-rethinking-fashion.../ → /media/blogs/the-fabric-of-climate-resilience...
/the-1-5c-line-why-pakistans-glaciers.../ → /media/blogs/the-1-5c-line-why-pakistans-glaciers...
(and so on for all 26 posts)
```

**Individual team member URLs** — each person's page should redirect:
```
/dr-fahad-saeed/ → /team/dr-fahad-saeed
/dr-mariam/      → /team/dr-mariam
(and so on for all 19 team members)
```

### 1.3 How We Implement 301 Redirects

Since we are a **React SPA** (no server-side routing by default), redirects are handled at the **web server / hosting level**:

**Option A — Nginx config (if self-hosted):**
```nginx
# /etc/nginx/sites-available/wenclims.org

# Old blog archive → new
rewrite ^/blogs/?$ /media/blogs permanent;
rewrite ^/peer-reviewed-research/?$ /publications/research permanent;
rewrite ^/reports/?$ /publications/reports permanent;
rewrite ^/podcats-and-radioshows/?$ /media/podcasts permanent;

# Old individual blog slugs → new path prefix
rewrite ^/(the-fabric-of-climate-resilience.*)$ /media/blogs/$1 permanent;
# Add one line per blog post OR use a catch-all pattern for known old slugs

# Old team member pages
rewrite ^/dr-fahad-saeed/?$ /team/dr-fahad-saeed permanent;
rewrite ^/dr-mariam/?$ /team/dr-mariam permanent;
```

**Option B — Netlify / Vercel `_redirects` file (if using static hosting):**
```
# client/public/_redirects (Netlify format)
/peer-reviewed-research/     /publications/research    301
/reports/                    /publications/reports     301
/blogs/                      /media/blogs              301
/podcats-and-radioshows/     /media/podcasts           301
/documentaries/              /media/documentaries      301
/print-media-excerpts/       /media/print              301
/talkshows/                  /media/talkshows          301
/project/                    /projects                 301
/dr-fahad-saeed/             /team/dr-fahad-saeed      301
/dr-mariam/                  /team/dr-mariam           301
# ... one line per person + per blog post
```

> [!TIP]
> **Agent will create this file** during development. You just upload it to your hosting provider.

---

## Part 2: What the Agent Implements in Code

### 2.1 `<SEOHead>` Component (Per-Page Meta Tags)

Every page gets unique:
- `<title>` — format: `"[Page Name] | WenClims"`
- `<meta name="description">` — 150–160 characters, compelling summary
- `<meta name="keywords">` — climate/weather/Pakistan relevant terms
- `<link rel="canonical">` — prevents duplicate content
- Open Graph tags for social sharing
- Twitter Card tags

**Example for the Blog Post page:**
```tsx
// components/shared/SEOHead.tsx
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  authorName?: string;
}

export function SEOHead({ title, description, canonicalUrl, ogImage, ogType = 'website', publishedTime, authorName }: SEOHeadProps) {
  const fullTitle = `${title} | WenClims`;
  const defaultOgImage = 'https://wenclims.org/og-image.png'; // default fallback

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="WenClims" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@wenclims" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />

      {/* Article-specific (blog posts, papers) */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && authorName && (
        <meta property="article:author" content={authorName} />
      )}
    </Helmet>
  );
}
```

### 2.2 Page-Level SEO Targets

| Page | Title Tag | Meta Description |
|------|-----------|-----------------|
| Home | `WenClims — Weather and Climate Services, Pakistan` | Science-based climate guidance and policy analysis for South Asia. Based in Islamabad, Pakistan. |
| Tools | `Climate Tools \| WenClims` | Interactive tools for climate projections, hydrology, energy balance, and water resources in Pakistan. |
| Projects | `Projects \| WenClims` | Climate research and consulting projects across South Asia funded by EU H2020, ADB, and partners. |
| Publications | `Publications \| WenClims` | Peer-reviewed research papers and reports on climate change, extreme events, and Pakistan. |
| Peer-Reviewed Research | `Peer-Reviewed Research \| WenClims` | Published papers in Nature Climate Change, PNAS, AGU, and Climate Policy by WenClims researchers. |
| Reports | `Reports \| WenClims` | World Weather Attribution reports and policy briefs on extreme events and climate risk in Pakistan. |
| Media | `Media \| WenClims` | Blogs, documentaries, podcasts, talkshows, and print media coverage on climate change in Pakistan. |
| Blogs | `Blogs \| WenClims` | Climate analysis and opinion pieces on Pakistan's climate challenges, heatwaves, floods, and policy. |
| Blog Post | `[Post Title] \| WenClims` | [Post excerpt — 155 chars] |
| Team | `Our Team \| WenClims` | Meet the researchers, scientists, and policy experts at Weather and Climate Services, Islamabad. |
| Contact | `Contact Us \| WenClims` | Get in touch with WenClims, Islamabad. Climate consulting, collaboration, and media inquiries. |

### 2.3 `robots.txt` (Already Exists — We Update It)

```
# client/public/robots.txt
User-agent: *
Allow: /

# Block dashboard (if ever same domain — but we use admin.wenclims.org so this is a safety net)
Disallow: /admin/

# Block API routes if ever exposed via same domain
Disallow: /api/

Sitemap: https://wenclims.org/sitemap.xml
```

### 2.4 `sitemap.xml` — Auto-Generated

We will build a **dynamic sitemap generator** as a server endpoint that queries the database and outputs XML. This ensures new blog posts automatically appear in the sitemap without manual updates.

**Server endpoint:** `GET /api/v1/sitemap.xml`

**Sitemap structure:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Static pages -->
  <url>
    <loc>https://wenclims.org/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://wenclims.org/tools</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... all static pages ... -->

  <!-- Dynamic: blog posts (from DB) -->
  <!-- Generated per published media_item where type='blog' -->
  <url>
    <loc>https://wenclims.org/media/blogs/{slug}</loc>
    <lastmod>{updated_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Dynamic: team members (from DB) -->
  <!-- Dynamic: projects (from DB) -->

</urlset>
```

**`client/public/sitemap.xml`** — a static fallback version with all known static pages (agent creates this file).

Vite config routes requests to the Express backend, which serves the dynamic sitemap. The static version serves as a pre-deploy fallback.

### 2.5 Structured Data / Schema Markup (JSON-LD)

Implemented as `<script type="application/ld+json">` blocks via `react-helmet-async`:

| Page | Schema Type |
|------|-------------|
| Home | `Organization` — name, logo, address, contactPoint, sameAs (social links) |
| Blog Post | `Article` — headline, author, datePublished, image, publisher |
| Peer-Reviewed Paper | `ScholarlyArticle` — name, author, datePublished, url (DOI) |
| Team Member Bio | `Person` — name, jobTitle, worksFor, sameAs (LinkedIn, Google Scholar) |
| Contact | `ContactPage` + `PostalAddress` |

**Example — Organization schema (in `HeroSection.tsx`):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "WenClims",
  "alternateName": "Weather and Climate Services",
  "url": "https://wenclims.org",
  "logo": "https://wenclims.org/favicon.svg",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+92-333-5672483",
    "email": "wenclims@gmail.com",
    "contactType": "General Enquiry"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "88, Lane 2, Lake View Lanes (LVL), Korang Road, Bani Gala",
    "addressLocality": "Islamabad",
    "addressCountry": "PK"
  },
  "sameAs": [
    "https://x.com/wenclims",
    "https://pk.linkedin.com/company/wenclims"
  ]
}
```

### 2.6 Heading Hierarchy Rule (Applied to Every Component)

```
Every page must have EXACTLY ONE <h1>
Sections use <h2>
Sub-sections use <h3>
Never skip heading levels
```

| Page | `<h1>` Content |
|------|----------------|
| Home | "Science & Policy Together — Climate Change" |
| Blogs | "Blogs" |
| Blog Post | The blog post title |
| Peer-Reviewed Research | "Peer-Reviewed Research" |
| Team | "Our Team" |

### 2.7 Performance SEO (Core Web Vitals)

Google ranks on **LCP, CLS, INP** — already handled by existing architecture:

| Metric | How We Handle It |
|--------|-----------------|
| **LCP** (Largest Contentful Paint) | Hero image pre-loaded, lazy-load everything below fold (already in codebase) |
| **CLS** (Cumulative Layout Shift) | Fixed dimensions on all images/cards, skeleton loaders |
| **INP** (Interaction to Next Paint) | React.lazy() code splitting (already in codebase), avoid blocking JS |
| **TTFB** | Express response caching headers on public API routes |

We will add `loading="lazy"` and explicit `width`/`height` on all `<img>` tags.

### 2.8 Multilingual SEO — Phased Approach

> [!NOTE]
> **Phase 1** (current build): English only. All SEO set up for English.
> **Phase 2**: Add Urdu and other languages using `hreflang`.

**Phase 2 implementation (when ready):**
```html
<!-- In <SEOHead> — tells Google which language version exists -->
<link rel="alternate" hreflang="en" href="https://wenclims.org/media/blogs/slug" />
<link rel="alternate" hreflang="ur" href="https://wenclims.org/ur/media/blogs/slug" />
<link rel="alternate" hreflang="x-default" href="https://wenclims.org/media/blogs/slug" />
```

URL structure for multilingual:
```
/media/blogs/slug          → English (default)
/ur/media/blogs/slug       → Urdu
```

Agent will build the language-switching infrastructure in Phase 2, including:
- Language toggle button in Navbar
- URL prefix routing (`/ur/...`)
- Urdu font (Noto Nastaliq Urdu from Google Fonts)
- RTL layout support for Urdu pages

---

## Part 3: What You Do at Deployment

### Step 1 — Pre-Deploy (Last Day on WordPress)

- [ ] Export all current Google Search Console performance data (save as CSV)
- [ ] Note your current Google ranking positions for key terms:
  - "climate change Pakistan"
  - "wenclims"
  - "weather climate services Islamabad"
  - "Pakistan flood attribution"
- [ ] Take a screenshot of your current Lighthouse score on wenclims.org

### Step 2 — Deploy the New React Site

- [ ] Build: `cd client && npm run build`
- [ ] Upload `dist/` to your hosting (Nginx server or Netlify/Vercel)
- [ ] Upload the `_redirects` file (or configure Nginx redirects from the config in Part 1)
- [ ] Verify the live site loads at `https://wenclims.org`
- [ ] Test 5–10 old WordPress URLs — confirm they 301-redirect to new URLs
- [ ] Test: `curl -I https://wenclims.org/peer-reviewed-research/` → should return `301 Moved Permanently`

### Step 3 — Google Search Console

**If already verified (existing WordPress property):**
- [ ] Log in to [Google Search Console](https://search.google.com/search-console)
- [ ] Go to **Sitemaps** → Submit `https://wenclims.org/sitemap.xml`
- [ ] Go to **URL Inspection** → Test the homepage → Request indexing
- [ ] Go to **Coverage** → Monitor for 404 errors (old URLs not redirected)

**If NOT yet verified (start fresh):**
- [ ] Go to [Google Search Console](https://search.google.com/search-console) → Add Property → `wenclims.org`
- [ ] Choose **HTML tag verification** → Copy the `<meta name="google-site-verification" content="...">` tag
- [ ] Tell the agent — we add it to `<SEOHead>` in the code
- [ ] Once verified: Submit sitemap, request indexing of homepage

### Step 4 — Bing Webmaster Tools (Optional but Free)
- [ ] Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [ ] Import from Google Search Console (one click)
- [ ] Submit sitemap

### Step 5 — Post-Deploy Monitoring (First 30 Days)

| Tool | URL | What to Check |
|------|-----|---------------|
| Google Search Console | search.google.com/search-console | 404 errors, coverage issues, indexing status |
| Google PageSpeed Insights | pagespeed.web.dev | Core Web Vitals (aim: all green) |
| Security Headers | securityheaders.com | Should be A rating |
| Rich Results Test | search.google.com/test/rich-results | Test JSON-LD schema on homepage + blog post |
| Mobile-Friendly Test | search.google.com/test/mobile-friendly | All pages should pass |

> [!WARNING]
> **Normal after migration:** Google rankings may dip for 2–4 weeks while Google re-crawls the redirected URLs. This is expected. As long as 301 redirects are properly in place, rankings will recover and often improve due to the faster new site.

---

## Part 4: Ongoing SEO (Dashboard-Driven)

Once the dashboard is live, these SEO tasks happen naturally through content publishing:

| Dashboard Action | SEO Effect |
|-----------------|------------|
| Publish a new blog post | Auto-appears in sitemap.xml (dynamic generation) |
| Set blog cover image | Becomes the OG image for social sharing |
| Fill in blog excerpt | Becomes the `<meta name="description">` for that post |
| Add tags to blog | Creates filterable content clusters (good for topical authority) |
| Publish a peer-reviewed paper | Adds `ScholarlyArticle` schema automatically |
| Add a team member with Google Scholar link | Adds `sameAs` link to Person schema |

> [!TIP]
> **Suggest adding to Dashboard:** A simple SEO score field for each blog post — shows a preview of how the title + description will look in Google search results (a "SERP preview"). This encourages editors to write good meta content.

---

## Part 5: SEO Content Recommendations

### Keyword Targets (for content team)

**High priority — WenClims has existing authority:**
- "climate change Pakistan"
- "Pakistan flood attribution"
- "heatwave Pakistan 2025"
- "wenclims climate services"
- "Pakistan climate policy"
- "Indus Basin climate"

**Medium priority — grow into:**
- "climate extreme events South Asia"
- "Pakistan glacier melt"
- "weather attribution science"
- "climate adaptation Pakistan"

### Blog Post SEO Checklist (for Editors in Dashboard)
Every new blog post should have:
- [ ] Title: 50–60 characters, includes primary keyword
- [ ] Meta description (excerpt): 150–160 characters, includes primary keyword, ends with a hook
- [ ] Slug: short, lowercase, hyphen-separated (auto-generated from title — editor can edit)
- [ ] Cover image: at least 1200×630px for OG sharing, alt text filled in
- [ ] One `<h1>` (the post title), subheadings using `<h2>`/`<h3>`
- [ ] At least 1 internal link (link to a related blog, publication, or project)
- [ ] At least 1 external link to a credible source (journal, government data, etc.)
- [ ] Tags filled in (2–5 tags)

---

## Summary: What the Agent Codes vs What You Do

### Agent Codes (during development):
- `SEOHead.tsx` component with all meta tags, OG, Twitter Card
- JSON-LD schema blocks (Organization, Article, ScholarlyArticle, Person)
- Dynamic `sitemap.xml` endpoint on server
- Updated `robots.txt`
- `_redirects` file for hosting (all old WP URLs → new URLs)
- `loading="lazy"` + `width`/`height` on all images
- Heading hierarchy enforcement in all components
- Canonical URL on every page
- `hreflang` infrastructure (Phase 2 — multilingual)
- SERP preview widget in Dashboard (Phase 2 — optional)

### You Do (at deployment and ongoing):
- Verify wenclims.org in Google Search Console
- Submit sitemap after deployment
- Upload `_redirects` file to hosting
- Monitor Coverage reports for 404s (first 30 days)
- Check PageSpeed Insights + fix any flagged issues
- Upload OG images per blog/paper via Dashboard
- Fill in excerpt (meta description) for each published post
- Run Lighthouse audit monthly
