import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// WenClims Hero Section
// Parallax + GSAP animation structure kept intact — only content replaced

const Hero = () => {
  const heroRef   = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect for hero image (unchanged from original)
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

      // Content animation (unchanged from original)
      gsap.from(contentRef.current?.children || [], {
        y: 50,
        opacity: 0,
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
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background Image with Parallax — climate/science theme */}
      <div ref={imageRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        <img
          src="https://images.unsplash.com/photo-1504608524841-42584120d424?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=50"
          srcSet="https://images.unsplash.com/photo-1504608524841-42584120d424?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=50 640w, https://images.unsplash.com/photo-1504608524841-42584120d424?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=50 1280w, https://images.unsplash.com/photo-1504608524841-42584120d424?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=50 2000w"
          sizes="100vw"
          alt="Climate science and weather research — satellite view of cloud formations"
          width={2000}
          height={1333}
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
        {/* WenClims hero gradient: deep navy to teal wash */}
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <div ref={contentRef} className="max-w-6xl">

          {/* Eyebrow / Category Label */}
          <div className="flex items-center space-x-3 mb-6">
            <span className="w-8 h-px" style={{ background: '#00C8C8' }} />
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full border"
              style={{ color: '#00C8C8', borderColor: 'rgba(0,200,200,0.4)', background: 'rgba(0,200,200,0.08)' }}
            >
              Science &amp; Policy Together
            </span>
          </div>

          {/* Main Heading — h1, single per page, SEO target */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-tight mb-6">
            Climate Change &amp;{' '}
            <span className="relative inline-block">
              Its Impacts
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 8C80 2 220 2 298 8"
                  stroke="#00C8C8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {' '}on{' '}
            <span style={{ color: '#E8C547' }}>South Asia</span>
          </h1>

          {/* Sub-copy — WenClims tagline from live site */}
          <p className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl leading-relaxed">
            We provide assistance and science-based guidance to decision-makers about
            climate change and its biophysical and socioeconomic impacts.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/publications/research"
              className="inline-flex items-center justify-center px-7 py-3.5 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl group"
              style={{ background: '#00C8C8', color: '#0B1E3D' }}
            >
              <span>Explore Research</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/tools"
              className="btn-outline group flex items-center"
            >
              <span>Climate Tools</span>
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats Bar — WenClims key numbers */}
          <div className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl font-bold text-white font-heading">13+</div>
              <div className="text-white/60 text-xs uppercase tracking-wider mt-0.5">Peer-Reviewed Papers</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <div className="text-3xl font-bold text-white font-heading">8+</div>
              <div className="text-white/60 text-xs uppercase tracking-wider mt-0.5">Funded Projects</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <div className="text-3xl font-bold text-white font-heading">19</div>
              <div className="text-white/60 text-xs uppercase tracking-wider mt-0.5">Expert Team Members</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <div className="text-3xl font-bold font-heading" style={{ color: '#00C8C8' }}>ADB · EU</div>
              <div className="text-white/60 text-xs uppercase tracking-wider mt-0.5">Major Funders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center text-white/50">
          <span className="text-xs mb-2 uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </div>

      {/* Decorative Elements */}
      <div
        className="absolute top-24 right-24 w-48 h-48 rounded-full hidden lg:block pointer-events-none"
        style={{ border: '1px solid rgba(0,200,200,0.15)' }}
      />
      <div
        className="absolute bottom-32 right-48 w-24 h-24 rounded-full hidden lg:block pointer-events-none"
        style={{ border: '1px solid rgba(0,200,200,0.08)' }}
      />
    </section>
  );
};

export default Hero;
