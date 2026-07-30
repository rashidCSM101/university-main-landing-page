import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, X, CloudRain } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VideoTour = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  // ESC key handler for modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setShowComingSoon(false);
  }, []);

  useEffect(() => {
    if (showComingSoon) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showComingSoon, handleKeyDown]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on background
      gsap.to('.video-bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Content fade in
      gsap.from('.video-content', {
        y: 30,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="video-bg absolute inset-0 w-full h-[140%] -top-[20%]">
        <img
          src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=50"
          alt="WenClims climate research and satellite data visualization"
          loading="lazy"
          width={2000}
          height={1333}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="video-content relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Icon Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
          <CloudRain className="w-4 h-4 text-teal-300" />
          <span className="text-white/90 font-medium text-sm">WenClims Story</span>
        </div>

        {/* Play Button */}
        <button
          onClick={() => setShowComingSoon(true)}
          aria-label="Watch WenClims story video"
          className="group mb-8"
        >
          <div className="play-button relative">
            <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20"></div>
            <Play className="w-8 h-8 text-white ml-1 relative z-10" fill="white" />
          </div>
        </button>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
          Our <span className="text-teal-300">Climate Story</span>
        </h2>

        {/* Description */}
        <p className="text-white/80 text-lg max-w-2xl">
          From field observations in the Himalayas to satellite-driven climate attribution —
          discover how WenClims is shaping South Asia's climate intelligence.
        </p>
      </div>

      {/* Coming Soon Modal (replaces the Rick Roll placeholder) */}
      {showComingSoon && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="WenClims story video coming soon"
        >
          <button
            onClick={() => setShowComingSoon(false)}
            aria-label="Close"
            className="absolute top-4 right-4 text-white hover:text-teal-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CloudRain className="w-10 h-10 text-teal-300" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Video Coming Soon</h3>
            <p className="text-white/70 mb-6">
              We're producing a documentary on WenClims' journey in South Asian climate science.
              Subscribe to our newsletter to be the first to watch.
            </p>
            <a
              href="mailto:wenclims@gmail.com?subject=Subscribe%20to%20WenClims%20Updates"
              className="inline-block bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Stay Updated
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoTour;
