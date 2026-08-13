import { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Helmet } from 'react-helmet-async';
import Lenis from 'lenis';

// Above-the-fold: direct imports (not lazy — LCP critical path)
import Header from './components/layout/Navbar';
import Hero from './components/Hero';
import Footer from './components/layout/Footer';
import { EmergencyBanner } from './components/layout/EmergencyBanner';

// ─── Home page sections (lazy-loaded below fold) ───────────────────────────
const Introduction  = lazy(() => import('./components/Introduction'));
const ServicesSlider = lazy(() => import('./components/home/ServicesSlider'));
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

// ─── Full Domain Pages ──────────────────────────────────────────────────────
// Vision & Tools
const VisionPage    = lazy(() => import('./components/About'));
const ToolsPage     = lazy(() => import('./components/tools/ToolsPage'));

// Projects
const ProjectsPage      = lazy(() => import('./components/projects/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./components/projects/ProjectDetail'));

// Publications
const PublicationsHub    = lazy(() => import('./components/publications/PublicationsHub'));
const ResearchPage       = lazy(() => import('./components/publications/PublicationsHub'));
const ReportsPage        = lazy(() => import('./components/publications/PublicationsHub'));

// Media
const MediaHub           = lazy(() => import('./components/media/MediaHub'));
const BlogsPage          = lazy(() => import('./components/media/MediaHub'));
const BlogPost           = lazy(() => import('./components/media/MediaReaderPage'));
const DocumentariesPage  = lazy(() => import('./components/media/MediaHub'));
const PodcastsPage       = lazy(() => import('./components/media/MediaHub'));
const TalksPage          = lazy(() => import('./components/media/MediaHub'));
const PrintMediaPage     = lazy(() => import('./components/media/MediaHub'));

// Team
const TeamPage       = lazy(() => import('./components/team/TeamPage'));
const TeamMemberBio  = lazy(() => import('./components/team/TeamMemberBio'));

// Contact
const ContactPage    = lazy(() => import('./components/contact/ContactPage'));

// Legal
const PrivacyPolicy  = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));

// 404
const NotFound = lazy(() => import('./components/shared/NotFound'));

// ─── Lightweight SVG 3D Vector Globe Loader (1.5 KB vs 15 MB GIF) ─────────
const PageSpinner = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B1E3D] text-white font-sans">
    <div className="relative flex items-center justify-center mb-6">
      {/* Outer Glow Pulse Ring */}
      <div className="absolute w-36 h-36 rounded-full border border-[#00C8C8]/30 animate-ping opacity-30" />
      
      {/* Spinning Teal Orbital Ring */}
      <div className="absolute w-32 h-32 rounded-full border-2 border-t-[#00C8C8] border-r-transparent border-b-[#48b302] border-l-transparent animate-spin duration-1000" />
      
      {/* Reverse Outer Ring */}
      <div className="absolute w-24 h-24 rounded-full border border-teal-500/20 border-dashed animate-[spin_4s_linear_infinite_reverse]" />

      {/* 3D Vector Globe SVG */}
      <div className="w-20 h-20 rounded-full bg-[#071328] border border-[#00C8C8]/40 p-3 shadow-2xl shadow-teal-950 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-[#00C8C8] animate-[spin_8s_linear_infinite]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2.5" opacity="0.9" />
          <ellipse cx="50" cy="50" rx="44" ry="18" stroke="currentColor" strokeDasharray="3 3" opacity="0.7" />
          <ellipse cx="50" cy="50" rx="44" ry="32" stroke="currentColor" opacity="0.5" />
          <ellipse cx="50" cy="50" rx="18" ry="44" stroke="currentColor" opacity="0.7" />
          <ellipse cx="50" cy="50" rx="32" ry="44" stroke="currentColor" opacity="0.5" />
          <line x1="50" y1="6" x2="50" y2="94" stroke="currentColor" strokeWidth="2" />
          <line x1="6" y1="50" x2="94" y2="50" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>

    {/* Brand & Loading Indicator */}
    <div className="text-center space-y-1.5">
      <div className="text-lg font-heading font-bold tracking-wider text-white">
        WenClims <span className="text-[#00C8C8]">Telemetry</span>
      </div>
      <p className="text-xs text-gray-400 font-medium tracking-widest uppercase flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00C8C8] animate-ping" />
        <span>Initializing Climate Intelligence...</span>
      </p>
    </div>
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

const ClimateMapChart = lazy(() => import('./components/ClimateMapChart'));

// ─── Home page assembly ───────────────────────────────────────────────────
const HomePage = () => (
  <main id="main-content">
    <Hero />
    <Introduction />
    <ServicesSlider />
    <ClimateMapChart />
    {/* <Stats /> */}
    {/* <Reasons /> */}
    {/* <Courses /> */}
    <Events />
    {/* <Departments /> */}
    <VideoTour />
    <Instructors />
    <Testimonials />
    {/* <Admission /> */}
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
      <EmergencyBanner />
      <Header />
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          {/* ── Home ─────────────────────────────────────── */}
          <Route path="/" element={<HomePage />} />

          {/* ── Services & Solutions ───────────────────── */}
          <Route path="/services" element={<main><VisionPage /></main>} />
          <Route path="/vision" element={<Navigate to="/services" replace />} />

          {/* ── Tools ────────────────────────────────────── */}
          <Route path="/tools" element={<main><ToolsPage /></main>} />

          {/* ── Projects ─────────────────────────────────── */}
          <Route path="/projects"     element={<main><ProjectsPage /></main>} />
          <Route path="/projects/:id" element={<main><ProjectDetailPage /></main>} />

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

          {/* ── Route compatibility redirects ── */}
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
