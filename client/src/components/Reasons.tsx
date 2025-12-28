import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Building2, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Reasons = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from('.reasons-title', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Cards stagger animation
      gsap.from('.reason-card', {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const reasons = [
    {
      icon: GraduationCap,
      title: 'Expert Faculty',
      description:
        'Learn from distinguished professors and industry experts who bring real-world experience to the classroom.',
      color: 'bg-blue-500',
    },
    {
      icon: Building2,
      title: 'Modern Facilities',
      description:
        'State-of-the-art laboratories, libraries, and learning spaces equipped with the latest technology.',
      color: 'bg-primary',
    },
    {
      icon: Users,
      title: 'Industry Connections',
      description:
        'Strong partnerships with leading companies ensuring excellent internship and job placement opportunities.',
      color: 'bg-green-500',
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="reasons-title text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="decorative-line"></div>
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Why Choose Us
            </span>
            <div className="decorative-line"></div>
          </div>
          <h2 className="section-title mb-6">
            The Reasons to Choose{' '}
            <span className="text-primary">Academix</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Discover what makes Academix the preferred choice for thousands of students
            worldwide seeking quality education and career success.
          </p>
        </div>

        {/* Reasons Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="reason-card group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 ${reason.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <reason.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                {reason.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{reason.description}</p>

              {/* Decorative Line */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <a
                  href="#"
                  className="inline-flex items-center text-primary font-medium group-hover:gap-3 transition-all"
                >
                  <span>Learn More</span>
                  <svg
                    className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>

              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Ready to start your journey with us?
          </p>
          <button className="btn-primary">
            Apply Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reasons;
