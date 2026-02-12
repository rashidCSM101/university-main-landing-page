import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play } from 'lucide-react';

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
          src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="University Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <div ref={contentRef} className="max-w-8xl">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-white/80 mb-6">
            <span className="w-8 h-px bg-white/60"></span>
            <span className="text-sm font-medium uppercase tracking-wider">
              Welcome to Government Degree College Larkana
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6">
            Transform Your{' '}
            <span className="relative">
              Future
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="#D4AF37"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            at GDC Larkana
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            Embark on a transformative educational journey. Discover world-class programs,
            expert faculty, and endless opportunities to shape your tomorrow.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button className="btn-primary bg-white text-primary hover:bg-gray-100 group">
              <span>Explore Courses</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="btn-outline group flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3 group-hover:bg-primary transition-colors">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span>Watch Video</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl font-bold text-white">150+</div>
              <div className="text-white/70 text-sm">Expert Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">300+</div>
              <div className="text-white/70 text-sm">Quality Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-white/70 text-sm">Happy Students</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-sm mb-2">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-white/20 rounded-full hidden lg:block"></div>
      <div className="absolute bottom-40 right-40 w-20 h-20 border border-white/10 rounded-full hidden lg:block"></div>
    </section>
  );
};

export default Hero;
