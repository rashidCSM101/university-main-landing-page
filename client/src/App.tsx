import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
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
import Pricing from './components/Pricing';
import Admission from './components/Admission';
import Blog from './components/Blog';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
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
    <Router>
      <div className="app">
        <Header />
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
          <Pricing />
          <Admission />
          <Blog />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
