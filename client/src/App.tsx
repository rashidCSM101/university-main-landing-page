import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Lenis from 'lenis';

// Above-the-fold: direct imports (not lazy — LCP critical path)
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';

// ─── Home page sections (lazy-loaded below fold) ───────────────────────────
const Introduction  = lazy(() => import('./components/Introduction'));
const Stats         = lazy(() => import('./components/Stats'));
const Reasons       = lazy(() => import('./components/Reasons'));
const Courses       = lazy(() => import('./components/Courses'));        // repurposed → Sectors / Tools preview
const Events        = lazy(() => import('./components/Events'));          // repurposed → Featured Projects
const Departments   = lazy(() => import('./components/Departments'));     // repurposed → Focus Areas
const VideoTour     = lazy(() => import('./components/VideoTour'));       // repurposed → Interactive Map placeholder
const Instructors   = lazy(() => import('./components/Instructors'));     // repurposed → Featured Team
const Testimonials  = lazy(() => import('./components/Testimonials'));    // repurposed → Partners / Quotes
const Admission     = lazy(() => import('./components/Admission'));       // repurposed → CTA / Latest Reports
const Blog          = lazy(() => import('./components/Blog'));            // repurposed → Latest Blogs

// ─── Full Pages ────────────────────────────────────────────────────────────
// Tools
const ToolsPage     = lazy(() => import('./components/About'));           // placeholder → will become Tools.tsx

// Projects
const ProjectsPage  = lazy(() => import('./components/Admissions'));     // placeholder → will become Projects.tsx

// Publications
const PublicationsHub    = lazy(() => import('./components/GradingPolicy'));     // placeholder → Publications.tsx
const ResearchPage       = lazy(() => import('./components/GradingPolicy'));     // placeholder → Research.tsx
const ReportsPage        = lazy(() => import('./components/GradingPolicy'));     // placeholder → Reports.tsx

// Media
const MediaHub           = lazy(() => import('./components/EventsPage'));        // placeholder → MediaHub.tsx
const BlogsPage          = lazy(() => import('./components/EventsPage'));        // placeholder → BlogsPage.tsx
const BlogPost           = lazy(() => import('./components/CourseDetail'));      // placeholder → BlogPost.tsx
const DocumentariesPage  = lazy(() => import('./components/EventsPage'));       // placeholder → Documentaries.tsx
const PodcastsPage       = lazy(() => import('./components/EventsPage'));        // placeholder → Podcasts.tsx
const TalksPage          = lazy(() => import('./components/EventsPage'));        // placeholder → Talkshows.tsx
const PrintMediaPage     = lazy(() => import('./components/EventsPage'));        // placeholder → PrintMedia.tsx

// Team
const TeamPage       = lazy(() => import('./components/Faculty'));        // placeholder → Team.tsx
const TeamMemberBio  = lazy(() => import('./components/Faculty'));        // placeholder → TeamBio.tsx

// Contact
const ContactPage    = lazy(() => import('./components/Contact'));

// Legal
const PrivacyPolicy  = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));

// 404
const NotFound = lazy(() => import('./components/NotFound'));

// ─── Loading spinner (same as original) ───────────────────────────────────
const PageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F7FF' }}>
    <div
      className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
      style={{ borderColor: '#0B1E3D', borderTopColor: 'transparent' }}
      aria-label="Loading page"
    />
  </div>
);

// ─── Home page assembly ───────────────────────────────────────────────────
const HomePage = () => (
  <main id="main-content">
    <Hero />
    <Introduction />
    <Stats />
    <Reasons />
    <Courses />
    <Events />
    <Departments />
    <VideoTour />
    <Instructors />
    <Testimonials />
    <Admission />
    <Blog />
  </main>
);

// ─── App content: routing + Lenis smooth scroll ───────────────────────────
function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Skip smooth scroll on low-end devices or reduced-motion preference
    // (Security: no external JS — GSAP + Lenis imported via npm, CSP-safe)
    if (
      navigator.hardwareConcurrency <= 2 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let lenis: Lenis | null = null;

    import('gsap').then(async (gsapModule) => {
      const gsap = gsapModule.default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis!.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    });

    return () => { if (lenis) lenis.destroy(); };
  }, []);

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app">
      <Header />
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          {/* ── Home ─────────────────────────────────────── */}
          <Route path="/" element={<HomePage />} />

          {/* ── Tools ────────────────────────────────────── */}
          <Route path="/tools" element={<main><ToolsPage /></main>} />

          {/* ── Projects ─────────────────────────────────── */}
          <Route path="/projects" element={<main><ProjectsPage /></main>} />

          {/* ── Publications ─────────────────────────────── */}
          <Route path="/publications"         element={<main><PublicationsHub /></main>} />
          <Route path="/publications/research" element={<main><ResearchPage /></main>} />
          <Route path="/publications/reports"  element={<main><ReportsPage /></main>} />

          {/* ── Media Hub ─────────────────────────────────── */}
          <Route path="/media"                element={<main><MediaHub /></main>} />
          <Route path="/media/blogs"          element={<main><BlogsPage /></main>} />
          <Route path="/media/blogs/:slug"    element={<main><BlogPost /></main>} />
          <Route path="/media/documentaries"  element={<main><DocumentariesPage /></main>} />
          <Route path="/media/podcasts"       element={<main><PodcastsPage /></main>} />
          <Route path="/media/talkshows"      element={<main><TalksPage /></main>} />
          <Route path="/media/print"          element={<main><PrintMediaPage /></main>} />

          {/* ── Team ──────────────────────────────────────── */}
          <Route path="/team"       element={<main><TeamPage /></main>} />
          <Route path="/team/:slug" element={<main><TeamMemberBio /></main>} />

          {/* ── Contact ───────────────────────────────────── */}
          <Route path="/contact" element={<main><ContactPage /></main>} />

          {/* ── Legal ─────────────────────────────────────── */}
          <Route path="/privacy" element={<main><PrivacyPolicy /></main>} />
          <Route path="/terms"   element={<main><TermsOfService /></main>} />

          {/* ── SEO Redirects: old WordPress URLs ─────────── */}
          {/* These are handled at Nginx/_redirects level per seo_guide.md  */}
          {/* The routes below provide fallback rendering for React catches  */}
          <Route path="/peer-reviewed-research" element={<main><ResearchPage /></main>} />
          <Route path="/peer-reviewed-research/*" element={<main><ResearchPage /></main>} />
          <Route path="/reports/*" element={<main><ReportsPage /></main>} />
          <Route path="/blogs/*"   element={<main><BlogsPage /></main>} />

          {/* ── 404 ───────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

export default App;
