import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect for hero image
      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Content animation
      gsap.from(contentRef.current?.children || [], {
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div ref={imageRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        <img
          src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=50"
          sizes="100vw"
          alt="Satellite Atmosphere Weather Radar"
          width={2000}
          height={1333}
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-20">
        <div ref={contentRef} className="max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sky-200 mb-6">
            <span className="w-8 h-px bg-sky-400"></span>
            <span className="text-sm font-semibold uppercase tracking-wider">
              High-Precision Atmospheric & Climate Intelligence
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6">
            Real-Time Weather{' '}
            <span className="relative text-sky-400">
              Telemetry
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            & Climate Analytics
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl">
            Access Doppler live radar monitoring, hyper-local rainfall forecasting, microburst storm warnings, and agricultural soil moisture intelligence powered by satellite remote sensing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/noticeboard" className="px-6 py-3.5 bg-sky hover:bg-sky-dark text-white font-semibold rounded-xl shadow-lg transition-all flex items-center space-x-2">
              <span>View Weather Alerts</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/timetable" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium border border-white/30 rounded-xl backdrop-blur-md transition-all flex items-center space-x-2">
              <Play className="w-4 h-4 fill-white" />
              <span>Live Doppler Stream</span>
            </Link>
          </div>

          {/* Atmospheric Telemetry Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl font-bold text-sky-300">27.4°C</div>
              <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Avg Surface Temp</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400">74%</div>
              <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Relative Humidity</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-400">18 km/h</div>
              <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">NW Wind Speed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">42 AQI</div>
              <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Air Quality (Good)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-xs mb-2 tracking-wider">Scroll for Radar Insights</span>
          <div className="w-5 h-9 border-2 border-white/50 rounded-full flex justify-center pt-1.5">
            <div className="w-1.5 h-2.5 bg-sky-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
