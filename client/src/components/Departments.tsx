import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calculator,
  Monitor,
  FlaskConical,
  Brain,
  BookOpen,
  Cog,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Departments = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from('.departments-header', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Cards animation with stagger
      gsap.from('.department-card', {
        y: 60,
        opacity: 0,
        duration: 0.6,
        stagger: {
          amount: 0.8,
          from: 'start',
        },
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const departments = [
    {
      icon: Calculator,
      name: 'Economics',
      courses: 12,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Monitor,
      name: 'Computer Science',
      courses: 18,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: FlaskConical,
      name: 'Biological Science',
      courses: 15,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Brain,
      name: 'Psychology',
      courses: 10,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
    },
    {
      icon: BookOpen,
      name: 'English',
      courses: 8,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Cog,
      name: 'Engineering',
      courses: 20,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="departments-header text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="decorative-line"></div>
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Our Departments
            </span>
            <div className="decorative-line"></div>
          </div>
          <h2 className="section-title mb-6">
            Popular <span className="text-primary">Departments</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Explore our diverse range of academic departments, each offering
            world-class education and research opportunities.
          </p>
        </div>

        {/* Departments Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {departments.map((dept, index) => (
            <div
              key={index}
              className="department-card bg-white rounded-2xl p-6 text-center cursor-pointer group hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`department-icon w-16 h-16 ${dept.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300`}
              >
                <dept.icon className={`w-8 h-8 ${dept.color.replace('bg-', 'text-')}`} />
              </div>

              {/* Name */}
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                {dept.name}
              </h3>

              {/* Courses Count */}
              <p className="text-sm text-gray-500">
                {dept.courses} Courses
              </p>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <button className="btn-secondary group">
            <span>Explore All Departments</span>
            <svg
              className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
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
          </button>
        </div>
      </div>
    </section>
  );
};

export default Departments;
