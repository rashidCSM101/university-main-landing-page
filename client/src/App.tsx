import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import Introduction from './components/Introduction';
import Stats from './components/Stats';
import Reasons from './components/Reasons';
import Courses from './components/Courses';
import Events from './components/Events';
import Departments from './components/Departments';
import VideoTour from './components/VideoTour';
import Instructors from './components/Instructors';
import Testimonials from './components/Testimonials';
// import Pricing from './components/Pricing';
import Admission from './components/Admission';
import Blog from './components/Blog';
import Footer from './components/Footer';
import CourseDetail from './components/CourseDetail';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import Faculty from './components/Faculty';
import EventsPage from './components/EventsPage';

gsap.registerPlugin(ScrollTrigger);

const authRoutes = ['/login', '/signup'];

function AppContent() {
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
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
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="app">
      {!isAuthPage && <Header />}
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
            {/* <Pricing /> */}
            <Admission />
            <Blog />
          </main>
        } />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/events" element={<EventsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
