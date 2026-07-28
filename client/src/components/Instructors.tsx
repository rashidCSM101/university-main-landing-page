import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const instructors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Chief Meteorologist & Radar Lead',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    role: 'Director of Atmospheric Modeling',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
  },
  {
    id: 3,
    name: 'Prof. Emily Davis',
    role: 'Head of Satellite Remote Sensing',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    role: 'Climate Impact & Hydrology Analyst',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
  },
];

const Instructors = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from('.instructors-header', {
        y: 50,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Cards animation
      gsap.from('.instructor-card', {
        y: 50,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-slate-900 text-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="instructors-header text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-px bg-sky-400"></div>
            <span className="text-sky-400 font-semibold uppercase tracking-wider text-sm">
              Meteorology Specialists
            </span>
            <div className="w-12 h-px bg-sky-400"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Meet <span className="text-sky-400">Our Team</span>
          </h2>
          <p className="text-slate-300 text-lg">
            Our team consists of leading atmospheric scientists, Doppler radar engineers, and climate analysts dedicated to delivering precision weather intelligence.
          </p>
        </div>

        {/* Instructors Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="instructor-card group bg-slate-800 rounded-2xl overflow-hidden hover:bg-slate-750 transition-colors border border-slate-700"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/5]">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  loading="lazy"
                  width={600}
                  height={750}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay with Social Links */}
                <div className="absolute inset-0 bg-gradient-to-t from-sky-950/90 via-sky-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                  <div className="flex space-x-3">
                    <span
                      aria-label={`${instructor.name} on Facebook`}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-sky-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Facebook className="w-5 h-5" />
                    </span>
                    <span
                      aria-label={`${instructor.name} on Twitter`}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-sky-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Twitter className="w-5 h-5" />
                    </span>
                    <span
                      aria-label={`${instructor.name} on LinkedIn`}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-sky-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Linkedin className="w-5 h-5" />
                    </span>
                    <span
                      aria-label={`${instructor.name} on Instagram`}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-sky-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Instagram className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-sky-300 transition-colors">
                  {instructor.name}
                </h3>
                <p className="text-slate-400 text-sm">{instructor.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/faculty" className="px-6 py-3.5 bg-sky hover:bg-sky-dark text-white font-semibold rounded-xl transition-all shadow-md">
            View All Team Specialists
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Instructors;
