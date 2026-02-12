import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Instructors = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from('.instructors-header', {
        y: 50,
        opacity: 0,
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

  const instructors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Professor of Computer Science',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      role: 'Dean of Engineering',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
    },
    {
      id: 3,
      name: 'Prof. Emily Davis',
      role: 'Head of Mathematics',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      role: 'Psychology Department',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-gray-900 text-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="instructors-header text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-px bg-primary"></div>
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Expert Team
            </span>
            <div className="w-12 h-px bg-primary"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Learn from Experienced{' '}
            <span className="text-primary">Instructor</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Our instructors are industry experts and academic leaders who are
            passionate about teaching and mentoring the next generation.
          </p>
        </div>

        {/* Instructors Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="instructor-card group bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-700 transition-colors"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/5]">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay with Social Links */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                  <div className="flex space-x-3">
                    <a
                      href={instructor.social.facebook}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href={instructor.social.twitter}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href={instructor.social.linkedin}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={instructor.social.instagram}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                  {instructor.name}
                </h3>
                <p className="text-gray-400">{instructor.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="btn-primary">
            View All Instructors
          </button>
        </div>
      </div>
    </section>
  );
};

export default Instructors;
