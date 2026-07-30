# Codebase WenClims (climate services) ke liye partially migrate hui hai, lekin zyada tar content, SEO meta, routes, aur sitemap abhi bhi GDC Larkana (college) wala hai. Ye sab se bara masla hai — deploy par users ko galat content milega aur Google ko mixed/conflicting signals jayengi.

Main JS bundle ~340 KB (~117 KB gzip) hai, jisme GSAP + Hero initial load par hain. Images zyada tar Unsplash CDN se aa rahi hain — ye speed aur reliability dono ke liye risk hai.

## 1. Critical Bugs (Deploy par seedha impact)

### 1.1 Broken / Dead Routes

Kai links purani routing par hain, jab ke `App.tsx` mein nayi routes hain:

| Link code mein                     | Actual route             | Result |
| ---------------------------------- | ------------------------ | ------ |
| `/about` (Introduction)            | ❌ exist nahi             | 404    |
| `/admissions` (Reasons, Admission) | `/projects` hai          | 404    |
| `/faculty` (Instructors)           | `/team` hai              | 404    |
| `/events` (Events section)         | `/media` hai             | 404    |
| `/course/zoology` (Courses)        | `/media/blogs/:slug` hai | 404    |

**Fix:** Ek central `routes.ts` config banao aur saari internal links update karo. Purani URLs ke liye `Navigate` redirects add karo:

```tsx
<Route path="/about" element={<Navigate to="/tools" replace />} />
<Route path="/admissions" element={<Navigate to="/projects" replace />} />
<Route path="/faculty" element={<Navigate to="/team" replace />} />
<Route path="/events" element={<Navigate to="/media" replace />} />
```

### 1.2 Placeholder Pages — Galat Content

`App.tsx` mein naye routes purane components par map hain:

```tsx
const ToolsPage     = lazy(() => import('./components/About'));           // placeholder
const ProjectsPage  = lazy(() => import('./components/Admissions'));     // placeholder
const PublicationsHub    = lazy(() => import('./components/GradingPolicy'));
const ResearchPage       = lazy(() => import('./components/GradingPolicy'));
// ... 6 alag media routes → same EventsPage component
const TeamPage       = lazy(() => import('./components/Faculty'));
const TeamMemberBio  = lazy(() => import('./components/Faculty'));  // slug use nahi hota
```

`/publications/research`, `/publications/reports`, `/media/blogs`, `/media/podcasts` sab par same page + same SEO title render hoga — ye bug bhi hai, SEO disaster bhi.

**Fix:** Har route ke liye alag component banao (chahe placeholder ho), aur Helmet mein unique title, description, canonical do. `TeamMemberBio` mein `useParams()` se slug read karo.

### 1.3 Lenis Memory Leak

```tsx
useEffect(() => {
  // ...
  let lenis: Lenis | null = null;
  import('gsap').then(async (gsapModule) => {
    // lenis yahan assign hota hai — async
    lenis = new Lenis({ ... });
  });
  return () => { if (lenis) lenis.destroy(); }; // cleanup pe aksar lenis abhi null hai
}, []);
```

Component unmount hone ke baad bhi Lenis/GSAP ticker chal sakta hai.

**Fix:** `useRef` + `cancelled` flag use karo:

```tsx
useEffect(() => {
  let cancelled = false;
  let lenis: Lenis | null = null;
  import('gsap').then(async (m) => {
    if (cancelled) return;
    lenis = new Lenis({ ... });
  });
  return () => {
    cancelled = true;
    lenis?.destroy();
    gsap.ticker.remove(/* raf callback */);
  };
}, []);
```

### 1.4 OG Image Broken

`index.html` mein `og-image.png` hai, lekin `public/` mein sirf `og-image.svg` hai. Social share par image nahi dikhegi.

**Fix:** PNG export karo (1200×630) ya meta tags mein SVG URL update karo (Facebook PNG prefer karta hai).

---

## 2. Brand / Content Mismatch (Functional Bug)

Header/Footer/Hero WenClims ke hain, baaki zyada tar sections abhi GDC Larkana ke hain:

- `Introduction.tsx` — "Government Degree College Larkana"
- `Contact.tsx` — Larkana address, `info@gdclarkana.edu.pk`
- `Stats.tsx` — "2500+ Students Enrolled"
- `VideoTour.tsx` — Rick Roll YouTube embed (`dQw4w9WgXcQ`) placeholder ke taur par

**Fix:** Content migration checklist banao — har component mein WenClims copy, contact info, stats replace karo. Placeholder video hatao ya real WenClims video lagao.

---

## 3. Performance Issues (Slow Website)

### 3.1 GSAP Initial Bundle Mein (Sab se bara)

Build warning confirm karti hai:

> GSAP dynamically imported in `App.tsx` but also statically imported in Hero + 20+ components

Result: ~340 KB main chunk — first paint slow.

**Fix:**

- Hero.tsx se static GSAP import hatao; animation CSS ya IntersectionObserver se replace karo (LCP critical path)
- Baaki components mein shared hook banao: `useGsapAnimation()` — ek jagah import
- `App.tsx` ka dynamic GSAP import ya to hatao ya sirf Lenis ke liye rakho jab Hero static na ho

### 3.2 Unsplash External Images (20+)

Har section alag Unsplash request karti hai — DNS + TLS + CDN latency, koi caching control nahi.

**Fix:**

- Images download karke `public/images/` ya `src/assets/` mein rakho
- WebP/AVIF + responsive `srcSet` use karo
- Hero image ko preload karo:

```html
<link rel="preload" as="image" href="...">
```

### 3.3 Introduction Image — 286 KB

Build output:

```text
introduction-yxDBubAw.avif = 286 KB
```

Kaafi bari.

**Fix:** Image compress karo (target <80 KB), width cap karo (max 800px).

### 3.4 Google Fonts Render-Blocking

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:...&display=swap">
```

Ye stylesheet HTML parse block karti hai.

**Fix:**

```html
<link rel="preload" as="style" href="..." onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="..."></noscript>
```

Ya fonts self-host karo (`@fontsource/inter`).

### 3.5 Lenis + GSAP + ScrollTrigger Overhead

Har scroll par animations + smooth scroll + parallax — mobile/low-end devices par jank.

**Fix:**

- Mobile par Lenis/GSAP disable karo (`matchMedia('(max-width: 768px)')`)
- `prefers-reduced-motion` already partially handled — isko sab animations par extend karo
- `scrub: true` wale parallax effects kam karo

### 3.6 Header Scroll Listener — No Throttle

Har scroll event par `setState` — unnecessary re-renders.

**Fix:** `requestAnimationFrame` throttle ya `passive: true` listener with threshold check.

### 3.7 Poor Code-Splitting Strategy

Poora `<Routes>` ek `<Suspense>` mein hai — route change par full-page spinner dikhta hai.

**Fix:** Har route apna Suspense boundary rakhe, ya route-level lazy with lightweight skeleton.

### 3.8 rollup Dependencies Mein

`package.json` mein `rollup` production dependency hai — bundle size affect nahi karta lekin install time badhata hai.

**Fix:** `devDependencies` mein move karo ya hatao.

---

## 4. SEO Issues (Search Ranking Disturb)

### 4.1 Pure SPA — No SSR/Pre-rendering (Critical)

Google JavaScript execute karta hai, lekin:

- First crawl mein sirf empty `<div id="root">` milta hai
- `react-helmet-async` meta tags JS ke baad inject hote hain
- Slow crawlers / social bots ko sahi title/description nahi milta

**Fix (priority order):**

- Vite SSG plugin (`vite-plugin-ssr` ya `vite-ssg`) — static pages pre-render
- Ya Prerender.io / Cloudflare Workers se HTML snapshot
- Long term: Next.js / Astro migration for content pages

### 4.2 Wrong Canonical URLs Everywhere

Saari inner pages par abhi bhi:

```tsx
<Helmet>
  <title>Contact Us | GDC Larkana - Get in Touch</title>
  ...
  <link rel="canonical" href="https://gdclarkana.edu.pk/contact" />
</Helmet>
```

Google ko signal milega ke ye page `gdclarkana.edu.pk` ki hai, `wenclims.org` ki nahi — duplicate/conflicting SEO.

**Fix:** Shared SEO component banao:

```tsx
// components/Seo.tsx
export function Seo({ title, description, path }: Props) {
  const url = `https://wenclims.org${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
    </Helmet>
  );
}
```

### 4.3 Sitemap & robots.txt — Purani Site

```txt
# robots.txt for GDC Larkana
Sitemap: https://gdclarkana.edu.pk/sitemap.xml
```

`sitemap.xml` mein `/about`, `/faculty`, `/noticeboard` hain — jo app mein exist nahi karte.

**Fix:** WenClims URLs ke sath naya sitemap generate karo (`/tools`, `/projects`, `/publications/research`, etc.) aur `robots.txt` update karo.

### 4.4 Duplicate Content (Same Component, Multiple URLs)

- 6 media routes → same `EventsPage` → same title "Events | GDC Larkana"
- 3 publication routes → same `GradingPolicy`

Google duplicate content penalty laga sakta hai.

**Fix:** Har URL unique content + unique meta. Agar content nahi hai to temporarily `noindex` lagao:

```html
<meta name="robots" content="noindex, follow" />
```

### 4.5 Home Page Par Dynamic Meta Missing

Sirf `index.html` static meta hai — inner navigation ke baad bhi wahi rehta hai (SPA behavior).

**Fix:** Home par bhi Helmet add karo route change par update ho.

### 4.6 Missing Structured Data Per Page

Organization schema sirf homepage par hai. Blog, team, publications ke liye `Article`, `Person`, `BreadcrumbList` schema missing.

**Fix:** Har page type ke liye JSON-LD add karo.

### 4.7 Internal Link Structure Broken

Broken links = crawl errors + bad UX + lower rankings (fix section 1.1).

---

## 5. Security & Accessibility Weaknesses

| Issue                                 | Location         | Fix                                                    |
| ------------------------------------- | ---------------- | ------------------------------------------------------ |
| CSP mein `'unsafe-inline'` scripts    | `index.html`     | Hashed nonces ya strict CSP (Vite build plugin)        |
| Security headers sirf dev server par  | `vite.config.ts` | Production Nginx/Cloudflare par set karo               |
| Skip-to-content link missing          | Layout           | `<a href="#main-content">` add karo                    |
| Mobile menu scroll lock nahi          | Header           | Menu open par `body overflow: hidden`                  |
| Fake form submit                      | Contact          | Backend ready hone tak clear "demo" message ya disable |
| `hardwareConcurrency <= 2` unreliable | `App.tsx`        | User agent + touch detection combine karo              |

---

## 6. Recommended Fix Roadmap

### Phase 1 — Deploy se pehle (1–2 din)

- Saari GDC Larkana references → WenClims content
- Canonical URLs + sitemap + robots.txt fix
- Broken links fix + redirects
- OG image fix
- Placeholder pages par unique meta ya `noindex`

### Phase 2 — Performance (2–3 din)

- GSAP Hero se hatao (LCP improve)
- Unsplash → local optimized images
- Fonts non-blocking
- Lenis leak fix
- Route-level Suspense boundaries

### Phase 3 — SEO Long-term (1 hafta+)

- Static pre-rendering (SSG) for all public routes
- Per-page JSON-LD schema
- Real blog/team/publication pages jab backend ready ho

---

# Priority Matrix

| Priority | Issue                                  | Impact             |
| -------- | -------------------------------------- | ------------------ |
| 🔴 P0     | Wrong canonical + sitemap (gdclarkana) | SEO destroy        |
| 🔴 P0     | Broken internal links                  | 404s, bad crawl    |
| 🔴 P0     | Same component on multiple URLs        | Duplicate content  |
| 🟠 P1     | GDC content on WenClims site           | Brand/trust damage |
| 🟠 P1     | GSAP in initial bundle (340KB)         | Slow LCP           |
| 🟠 P1     | Unsplash external images               | Slow + unreliable  |
| 🟡 P2     | No SSR/pre-render                      | Weak SEO indexing  |
| 🟡 P2     | Lenis memory leak                      | Runtime bugs       |
| 🟢 P3     | Scroll listener throttle               | Minor perf         |
| 🟢 P3     | Font loading optimization              | Minor perf         |