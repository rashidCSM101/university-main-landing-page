import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VideoTour = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // ESC key handler for modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isPlaying, handleKeyDown]);

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
          src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=50"
          alt="GDC Larkana Campus Tour"
          loading="lazy"
          width={2000}
          height={1333}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="video-content relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Play Button */}
        <button
          onClick={() => setIsPlaying(true)}
          aria-label="Play campus tour video"
          className="group mb-8"
        >
          <div className="play-button relative">
            <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30"></div>
            <Play className="w-8 h-8 text-white ml-1 relative z-10" fill="white" />
          </div>
        </button>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
          Video Tour in <span className="text-primary">Campus</span>
        </h2>

        {/* Description */}
        <p className="text-white/80 text-lg max-w-2xl">
          Take a virtual tour of our beautiful campus and state-of-the-art facilities.
          Experience the vibrant academic environment that awaits you.
        </p>
      </div>

      {/* Video Modal */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label="Campus tour video">
          <button
            onClick={() => setIsPlaying(false)}
            aria-label="Close video"
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="w-full max-w-4xl aspect-video">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="GDC Larkana Campus Tour"
              className="w-full h-full rounded-lg"
              sandbox="allow-scripts allow-same-origin allow-presentation"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoTour;
