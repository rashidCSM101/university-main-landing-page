import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Vite static asset imports — images in client/assets/images/
import img1 from '../../assets/images/1.webp?url';
import img2 from '../../assets/images/2.webp?url';
import img3 from '../../assets/images/3.webp?url';
import img4 from '../../assets/images/4.webp?url';

gsap.registerPlugin(ScrollTrigger);

// ─── Carousel Slides ─────────────────────────────────────────────────────────
const slides = [
  {
    id: 1,
    image: img1,
    tag: 'Hydrological Impact',
    heading: 'Water Security',
    highlight: 'Under Threat',
    sub: "From cracked riverbeds to flooded floodplains — WenClims tracks how climate variability reshapes South Asia's water future.",
    cta: { label: 'Explore Research', to: '/publications/research' },
    accent: '#00C8C8',
  },
  {
    id: 2,
    image: img2,
    tag: 'Mountain Ecosystems',
    heading: 'Glaciers &',
    highlight: 'Biodiversity',
    sub: "The Hindu Kush Himalaya holds the world's largest ice reserve outside the poles. We measure what it's losing — and what we stand to lose.",
    cta: { label: 'View Projects', to: '/projects' },
    accent: '#4FC3F7',
  },
  {
    id: 3,
    image: img3,
    tag: 'Clean Energy Transition',
    heading: 'Renewables',
    highlight: 'Power the Future',
    sub: 'Floating solar and offshore wind are climate solutions — WenClims provides the climate data that makes them viable in South Asia.',
    cta: { label: 'Our Tools', to: '/tools' },
    accent: '#FDD835',
  },
  {
    id: 4,
    image: img4,
    tag: 'Climate Resilience',
    heading: 'Science-Driven',
    highlight: 'Policy Change',
    sub: 'From ADB to EU — we partner with global funders to translate atmospheric science into policies that protect lives and livelihoods.',
    cta: { label: 'Meet Our Team', to: '/team' },
    accent: '#81C784',
  },
];

// ─── Stats bar (shared across slides) ────────────────────────────────────────
const stats = [
  { value: '13+', label: 'Peer-Reviewed Papers' },
  { value: '8+',  label: 'Funded Projects'      },
  { value: '19',  label: 'Expert Team Members'  },
  { value: 'ADB · EU', label: 'Major Funders'   },
];

const AUTOPLAY_MS = 5500;

const Hero = () => {
  const heroRef    = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  const [current,  setCurrent]  = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimating = useRef(false);

  // ── GSAP: entry animation for text content ──────────────────────────────
  const animateContent = useCallback((dir: 1 | -1 = 1) => {
    const el = contentRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];

    gsap.fromTo(
      children,
      { x: dir * 60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        overwrite: true,
      }
    );
  }, []);

  // ── GSAP: slide the image track ─────────────────────────────────────────
  const goToSlide = useCallback(
    (next: number, dir: 1 | -1 = 1) => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const track = trackRef.current;
      if (!track) { isAnimating.current = false; return; }

      gsap.to(track, {
        opacity: 0,
        scale: 1.04,
        duration: 0.45,
        ease: 'power2.in',
        onComplete: () => {
          setCurrent(next);
          gsap.fromTo(
            track,
            { opacity: 0, scale: 1.04 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: 'power2.out',
              onComplete: () => { isAnimating.current = false; },
            }
          );
          animateContent(dir);
        },
      });
    },
    [animateContent]
  );

  const next = useCallback(() => {
    goToSlide((current + 1) % slides.length, 1);
  }, [current, goToSlide]);

  const prev = useCallback(() => {
    goToSlide((current - 1 + slides.length) % slides.length, -1);
  }, [current, goToSlide]);

  const goTo = useCallback(
    (i: number) => {
      if (i !== current) goToSlide(i, i > current ? 1 : -1);
    },
    [current, goToSlide]
  );

  // ── Autoplay ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setTimeout(() => {
      goToSlide((current + 1) % slides.length, 1);
    }, AUTOPLAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, isHovered, goToSlide]);

  // ── Keyboard navigation ─────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // ── Initial content entry animation & Parallax ──────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(Array.from(contentRef.current?.children ?? []) as HTMLElement[], {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2,
      });

      // Parallax scroll on background image
      if (trackRef.current) {
        gsap.to(trackRef.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }

      // Parallax fade on hero content as user scrolls down
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          yPercent: -10,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'center center',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }

      // Floating animation on hero badge
      gsap.to('.hero-badge-float', {
        y: -4,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Scroll indicator fade & pulse
      gsap.from('.hero-scroll-indicator', {
        opacity: 0,
        y: 10,
        duration: 1,
        delay: 1.2,
        ease: 'power2.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const slide = slides[current];

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      aria-label="Hero carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Background Image Track ──────────────────────────────────────── */}
      <div
        ref={trackRef}
        className="absolute inset-0 w-full h-full will-change-transform"
      >
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.heading + ' ' + slide.highlight}
          fetchPriority={slide.id === 1 ? 'high' : 'auto'}
          loading={slide.id === 1 ? 'eager' : 'lazy'}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        {/* Layered gradient: left dark panel + bottom vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(10,37,64,0.92) 0%, rgba(10,37,64,0.72) 38%, rgba(10,37,64,0.30) 65%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(5,20,40,0.85) 0%, transparent 45%)',
          }}
        />
      </div>

      {/* ── Animated Grid Overlay ───────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Decorative Orbs ─────────────────────────────────────────────── */}
      {/* 
      <div
        className="absolute top-24 right-16 w-64 h-64 rounded-full hidden lg:block pointer-events-none"
        style={{
          border: `1px solid ${slide.accent}25`,
          boxShadow: `0 0 80px ${slide.accent}15`,
        }}
      />
      <div
        className="absolute bottom-32 right-48 w-32 h-32 rounded-full hidden lg:block pointer-events-none"
        style={{ border: `1px solid ${slide.accent}15` }}
      />
      */}

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="container-custom relative z-10 pt-28 md:pt-32 lg:pt-36 pb-24 w-full">
        {/* Live Attribution Data Ticker */}
        {/* <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-md">
          <DataTicker />
        </div> */}

        <div ref={contentRef} className="w-full max-w-[68rem]">

          {/* Tag pill */}
          <div className="hero-badge-float flex items-center space-x-3 mb-6">
            <span className="w-8 h-px" style={{ background: slide.accent }} />
            <span
              className="text-xs font-semibold uppercase tracking-[0.22em] px-3 py-1 rounded-full border"
              style={{
                color: slide.accent,
                borderColor: `${slide.accent}55`,
                background: `${slide.accent}12`,
              }}
            >
              {slide.tag}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-tight mb-6">
            {slide.heading}{' '}
            <span className="relative inline-block">
              <span style={{ color: slide.accent }}>{slide.highlight}</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 8C80 2 220 2 298 8"
                  stroke={slide.accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Sub-copy */}
          <p className="text-base md:text-lg text-white/80 mb-10 max-w-4xl leading-relaxed">
            {slide.sub}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={slide.cta.to}
              className="inline-flex items-center justify-center px-7 py-3.5 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl group"
              style={{ background: slide.accent, color: '#0B1E3D' }}
            >
              <span>{slide.cta.label}</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="btn-outline group flex items-center">
              <span>Get in Touch</span>
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-6 md:gap-8 mt-12 pt-8 border-t border-white/20">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-6 md:gap-8">
                <div>
                  <div
                    className="text-2xl md:text-3xl font-bold font-heading"
                    style={{ color: i === 3 ? slide.accent : 'white' }}
                  >
                    {s.value}
                  </div>
                  <div className="text-white/55 text-[11px] uppercase tracking-wider mt-0.5">
                    {s.label}
                  </div>
                </div>
                {i < stats.length - 1 && (
                  <div className="w-px h-8 bg-white/20 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Carousel Controls ───────────────────────────────────────────── */}
      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 group"
      >
        <div
          className="w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <ChevronLeft className="w-5 h-5 text-white group-hover:text-[#00C8C8] transition-colors" />
        </div>
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 group"
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <ChevronRight className="w-5 h-5 text-white group-hover:text-[#00C8C8] transition-colors" />
        </div>
      </button>

      {/* ── Dot Indicators + Progress bar ───────────────────────────────── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
        {/* Dots */}
        <div className="flex items-center gap-2.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative flex items-center justify-center transition-all duration-300"
            >
              {i === current ? (
                // Active dot: pill with accent color + shimmer progress
                <div
                  className="relative overflow-hidden rounded-full"
                  style={{
                    width: 32,
                    height: 6,
                    background: `${slide.accent}40`,
                    border: `1px solid ${slide.accent}80`,
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: slide.accent,
                      animation: isHovered
                        ? 'none'
                        : `hero-progress ${AUTOPLAY_MS}ms linear forwards`,
                      width: '100%',
                      transformOrigin: 'left',
                      transform: 'scaleX(0)',
                    }}
                  />
                </div>
              ) : (
                <div
                  className="rounded-full transition-all duration-300 hover:scale-125"
                  style={{
                    width: 6,
                    height: 6,
                    background: 'rgba(255,255,255,0.35)',
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Slide counter */}
        <span className="text-white/40 text-[11px] font-mono tracking-widest select-none">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* ── Scroll Indicator ────────────────────────────────────────────── */}
      <div className="hero-scroll-indicator absolute bottom-10 right-8 z-10 hidden lg:flex">
        <div className="flex flex-col items-center text-white/40">
          <span className="text-[10px] mb-2 uppercase tracking-[0.25em]">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>

      {/* ── Slide thumbnail strip (right edge, desktop only) ────────────── */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="relative overflow-hidden rounded-lg transition-all duration-300 group"
            style={{
              width: 56,
              height: 38,
              opacity: i === current ? 1 : 0.45,
              transform: i === current ? 'scale(1.1)' : 'scale(1)',
              border: i === current
                ? `2px solid ${slide.accent}`
                : '2px solid rgba(255,255,255,0.15)',
              boxShadow: i === current ? `0 0 14px ${slide.accent}60` : 'none',
            }}
          >
            <img
              src={s.image}
              alt={s.heading}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Overlay for non-active */}
            {i !== current && (
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            )}
          </button>
        ))}
      </div>

      {/* ── Keyframe injection for dot progress bar ─────────────────────── */}
      <style>{`
        @keyframes hero-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
