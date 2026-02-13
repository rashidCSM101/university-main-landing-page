import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, FileText, Calendar, UserCheck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    { icon: FileText, title: 'Fill Application', desc: 'Complete the online form' },
    { icon: Calendar, title: 'Book Interview', desc: 'Schedule your interview' },
    { icon: UserCheck, title: 'Get Accepted', desc: 'Receive admission decision' },
    { icon: CreditCard, title: 'Pay & Enroll', desc: 'Complete enrollment' },
  ];

const Admission = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on background
      gsap.to('.admission-bg', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Content animation
      gsap.from('.admission-content', {
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Steps animation
      gsap.from('.admission-step', {
        y: 20,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.admission-steps',
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="admission-bg absolute inset-0 w-full h-[120%] -top-[10%]">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=50"
          alt="Government Degree College Larkana campus aerial view"
          loading="lazy"
          width={2000}
          height={1333}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary-dark/90"></div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="admission-content text-center text-white mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            Admission <span className="text-accent-gold">Now</span>
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Start your journey with GDC Larkana today. Our streamlined admission process
            makes it easy to join thousands of successful students.
          </p>
          <Link to="/admissions" className="btn-primary bg-white text-primary hover:bg-gray-100 group">
            <span>Admission Form</span>
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Admission Steps */}
        <div className="admission-steps grid md:grid-cols-4 gap-6 mt-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="admission-step text-center group"
            >
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-white/20 transition-colors">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-[60%] w-[80%] h-px bg-white/30">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full"></div>
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h4 className="text-lg font-semibold text-white mb-1">{step.title}</h4>
              <p className="text-white/70 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Admission;
