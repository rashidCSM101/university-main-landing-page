import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Lenis from 'lenis';

// Direct imports for above-the-fold components
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';

// Lazy-loaded components for code splitting
const Introduction = lazy(() => import('./components/Introduction'));
const Stats = lazy(() => import('./components/Stats'));
const Reasons = lazy(() => import('./components/Reasons'));
const Courses = lazy(() => import('./components/Courses'));
const Events = lazy(() => import('./components/Events'));
const Departments = lazy(() => import('./components/Departments'));
const VideoTour = lazy(() => import('./components/VideoTour'));
const Instructors = lazy(() => import('./components/Instructors'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Admission = lazy(() => import('./components/Admission'));
const Blog = lazy(() => import('./components/Blog'));
const CourseDetail = lazy(() => import('./components/CourseDetail'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const Faculty = lazy(() => import('./components/Faculty'));
const EventsPage = lazy(() => import('./components/EventsPage'));
const NoticeBoard = lazy(() => import('./components/NoticeBoard'));
const Timetable = lazy(() => import('./components/Timetable'));
const Admissions = lazy(() => import('./components/Admissions'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const CookiePolicy = lazy(() => import('./components/CookiePolicy'));
const GradingPolicy = lazy(() => import('./components/GradingPolicy'));
const NotFound = lazy(() => import('./components/NotFound'));

const authRoutes = ['/login', '/signup'];

function AppContent() {
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);

  useEffect(() => {
    // Skip smooth scroll on low-end devices or reduced motion preference
    if (
      navigator.hardwareConcurrency <= 2 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let lenis: Lenis | null = null;

    // Dynamically import GSAP to keep it out of the main bundle
    import('gsap').then(async (gsapModule) => {
      const gsap = gsapModule.default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Initialize Lenis smooth scroll
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

      // Connect Lenis to GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis!.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    });

    // Cleanup
    return () => {
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  return (
    <div className="app">
      {!isAuthPage && <Header />}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
        <Routes>
          <Route path="/" element={
            <main>
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
          } />
          <Route path="/course/:id" element={<main><CourseDetail /></main>} />
          <Route path="/about" element={<main><About /></main>} />
          <Route path="/contact" element={<main><Contact /></main>} />
          <Route path="/faculty" element={<main><Faculty /></main>} />
          <Route path="/events" element={<main><EventsPage /></main>} />
          <Route path="/noticeboard" element={<main><NoticeBoard /></main>} />
          <Route path="/timetable" element={<main><Timetable /></main>} />
          <Route path="/admissions" element={<main><Admissions /></main>} />
          <Route path="/privacy" element={<main><PrivacyPolicy /></main>} />
          <Route path="/terms" element={<main><TermsOfService /></main>} />
          <Route path="/cookies" element={<main><CookiePolicy /></main>} />
          <Route path="/grading-policy" element={<main><GradingPolicy /></main>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!isAuthPage && <Footer />}
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
