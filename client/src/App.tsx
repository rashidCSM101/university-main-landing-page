import { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Helmet } from 'react-helmet-async';
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

import loadingGif from '../assets/images/loading.gif';

// ─── Loading spinner ───────────────────────────────────────────────────────
const PageSpinner = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
    <img
      src={loadingGif}
      alt="Loading..."
      className="w-52 md:w-64 h-auto object-contain max-h-[300px]"
    />
  </div>
);

// ─── Thin wrappers for duplicate placeholder routes (unique Helmet + noindex) ─
const PublicationsHubPage = () => (
  <>
    <Helmet>
      <title>Publications | WenClims — Weather and Climate Services</title>
      <meta name="description" content="Explore WenClims publications — peer-reviewed research, policy reports, and technical briefs on climate change in South Asia." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://wenclims.org/publications" />
    </Helmet>
    <PublicationsHub />
  </>
);

const ResearchPageWrapped = () => (
  <>
    <Helmet>
      <title>Peer-Reviewed Research | WenClims</title>
      <meta name="description" content="WenClims peer-reviewed climate research papers on South Asian weather, attribution science, and climate impact." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://wenclims.org/publications/research" />
    </Helmet>
    <ResearchPage />
  </>
);

const ReportsPageWrapped = () => (
  <>
    <Helmet>
      <title>Reports | WenClims</title>
      <meta name="description" content="WenClims technical and policy reports on climate resilience, disaster risk, and environmental governance in Pakistan." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://wenclims.org/publications/reports" />
    </Helmet>
    <ReportsPage />
  </>
);

const MediaHubPage = () => (
  <>
    <Helmet>
      <title>Media Hub | WenClims</title>
      <meta name="description" content="WenClims media — documentaries, podcasts, talkshows, blogs, and print media on climate science in South Asia." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://wenclims.org/media" />
    </Helmet>
    <MediaHub />
  </>
);

const BlogsPageWrapped = () => (
  <>
    <Helmet>
      <title>Blogs | WenClims</title>
      <meta name="description" content="WenClims blog — expert insights, climate analysis, and policy commentary from the WenClims team." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://wenclims.org/media/blogs" />
    </Helmet>
    <BlogsPage />
  </>
);

const DocumentariesPageWrapped = () => (
  <>
    <Helmet>
      <title>Documentaries | WenClims</title>
      <meta name="description" content="Climate documentaries and visual media by WenClims covering South Asian weather events and climate change." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://wenclims.org/media/documentaries" />
    </Helmet>
    <DocumentariesPage />
  </>
);

const PodcastsPageWrapped = () => (
  <>
    <Helmet>
      <title>Podcasts & Radioshows | WenClims</title>
      <meta name="description" content="Listen to WenClims podcasts and radio broadcasts on climate change, weather science, and environmental policy." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://wenclims.org/media/podcasts" />
    </Helmet>
    <PodcastsPage />
  </>
);

const TalksPageWrapped = () => (
  <>
    <Helmet>
      <title>Talkshows | WenClims</title>
      <meta name="description" content="WenClims talkshow appearances and panel discussions on climate policy, disaster risk reduction, and South Asian weather." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://wenclims.org/media/talkshows" />
    </Helmet>
    <TalksPage />
  </>
);

const PrintMediaPageWrapped = () => (
  <>
    <Helmet>
      <title>Print Media | WenClims</title>
      <meta name="description" content="WenClims in print — newspaper features, magazine articles, and op-eds on climate change and weather science." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://wenclims.org/media/print" />
    </Helmet>
    <PrintMediaPage />
  </>
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
  const rafCallbackRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    // Skip smooth scroll on low-end devices, mobile, or reduced-motion preference
    if (
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let cancelled = false;
    let lenis: Lenis | null = null;

    import('gsap').then(async (gsapModule) => {
      if (cancelled) return;

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

      // Store RAF callback in ref so we can remove it on cleanup
      const rafCallback = (time: number) => { lenis!.raf(time * 1000); };
      rafCallbackRef.current = rafCallback;
      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      cancelled = true;
      lenis?.destroy();
      // Remove GSAP ticker to prevent leak after unmount
      if (rafCallbackRef.current) {
        import('gsap').then((gsapModule) => {
          gsapModule.default.ticker.remove(rafCallbackRef.current!);
          rafCallbackRef.current = null;
        });
      }
    };
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
          <Route path="/publications"         element={<main><PublicationsHubPage /></main>} />
          <Route path="/publications/research" element={<main><ResearchPageWrapped /></main>} />
          <Route path="/publications/reports"  element={<main><ReportsPageWrapped /></main>} />

          {/* ── Media Hub ─────────────────────────────────── */}
          <Route path="/media"                element={<main><MediaHubPage /></main>} />
          <Route path="/media/item/:id"       element={<main><BlogPost /></main>} />
          <Route path="/media/blogs"          element={<main><BlogsPageWrapped /></main>} />
          <Route path="/media/blogs/:slug"    element={<main><BlogPost /></main>} />
          <Route path="/media/documentaries"  element={<main><DocumentariesPageWrapped /></main>} />
          <Route path="/media/podcasts"       element={<main><PodcastsPageWrapped /></main>} />
          <Route path="/media/talkshows"      element={<main><TalksPageWrapped /></main>} />
          <Route path="/media/print"          element={<main><PrintMediaPageWrapped /></main>} />

          {/* ── Team ──────────────────────────────────────── */}
          <Route path="/team"       element={<main><TeamPage /></main>} />
          <Route path="/team/:slug" element={<main><TeamMemberBio /></main>} />

          {/* ── Contact ───────────────────────────────────── */}
          <Route path="/contact" element={<main><ContactPage /></main>} />

          {/* ── Legal ─────────────────────────────────────── */}
          <Route path="/privacy" element={<main><PrivacyPolicy /></main>} />
          <Route path="/terms"   element={<main><TermsOfService /></main>} />

          {/* ── Legacy redirects: old GDC Larkana / LMS routes ── */}
          <Route path="/about"        element={<Navigate to="/tools" replace />} />
          <Route path="/admissions"   element={<Navigate to="/projects" replace />} />
          <Route path="/faculty"      element={<Navigate to="/team" replace />} />
          <Route path="/events"       element={<Navigate to="/media" replace />} />
          <Route path="/noticeboard"  element={<Navigate to="/" replace />} />
          <Route path="/timetable"    element={<Navigate to="/" replace />} />
          <Route path="/grading-policy" element={<Navigate to="/publications" replace />} />
          <Route path="/course/:slug" element={<Navigate to="/media/blogs" replace />} />
          <Route path="/cookies"      element={<Navigate to="/privacy" replace />} />

          {/* ── SEO Redirects: old WordPress URLs ─────────── */}
          <Route path="/peer-reviewed-research"   element={<main><ResearchPageWrapped /></main>} />
          <Route path="/peer-reviewed-research/*" element={<main><ResearchPageWrapped /></main>} />
          <Route path="/reports/*"                element={<main><ReportsPageWrapped /></main>} />
          <Route path="/blogs/*"                  element={<main><BlogsPageWrapped /></main>} />

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
