import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Building2, Users, Sparkles, ArrowUpRight } from 'lucide-react';

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
        y: 50,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.2,
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

  const reasons = [
    {
      icon: GraduationCap,
      title: 'Expert Faculty',
      description:
        'Learn from distinguished professors and industry experts who bring real-world experience to the classroom.',
      gradient: 'from-blue-500 to-indigo-600',
      lightBg: 'bg-blue-50',
      accent: 'text-blue-600',
      number: '01',
      link: '/faculty',
    },
    {
      icon: Building2,
      title: 'Modern Facilities',
      description:
        'State-of-the-art laboratories, libraries, and learning spaces equipped with the latest technology.',
      gradient: 'from-primary to-rose-700',
      lightBg: 'bg-red-50',
      accent: 'text-primary',
      number: '02',
      link: '/about',
    },
    {
      icon: Users,
      title: 'Industry Connections',
      description:
        'Strong partnerships with leading companies ensuring excellent internship and job placement opportunities.',
      gradient: 'from-emerald-500 to-teal-600',
      lightBg: 'bg-emerald-50',
      accent: 'text-emerald-600',
      number: '03',
      link: '/about',
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="reasons-title text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-5 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Why Choose Us
            </span>
          </div>
          <h2 className="section-title mb-6">
            The Reasons to Choose{' '}
            <span className="text-primary">GDC Larkana</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Discover what makes GDC Larkana the preferred choice for thousands of students
            worldwide seeking quality education and career success.
          </p>
        </div>

        {/* Reasons Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="reason-card group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]"
            >
              {/* Top Gradient Bar */}
              <div className={`h-1.5 bg-gradient-to-r ${reason.gradient}`}></div>

              <div className="p-8 pt-7">
                {/* Top Row - Number & Arrow */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-5xl font-bold text-gray-100 font-heading select-none">
                    {reason.number}
                  </span>
                  <div className={`w-10 h-10 rounded-full ${reason.lightBg} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-45`}>
                    <ArrowUpRight className={`w-5 h-5 ${reason.accent}`} />
                  </div>
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${reason.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <reason.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className={`text-xl font-bold text-gray-900 mb-3 group-hover:${reason.accent} transition-colors`}>
                  {reason.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">{reason.description}</p>

                {/* Bottom Link */}
                <div className="mt-7 pt-5 border-t border-gray-100/80">
                  <Link
                    to={reason.link}
                    className={`inline-flex items-center ${reason.accent} font-semibold text-sm tracking-wide hover:gap-3 transition-all duration-300`}
                  >
                    <span>Learn More</span>
                    <ArrowUpRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

              {/* Background Glow on Hover */}
              <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${reason.gradient} rounded-full opacity-0 group-hover:opacity-[0.04] blur-2xl transition-opacity duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-gray-500 mb-5 text-sm">
            Ready to start your journey with us?
          </p>
          <button className="btn-primary group">
            <span>Apply Now</span>
            <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reasons;
