import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const courses = [
  {
    id: 1,
    title: 'High-Resolution Doppler Live Radar',
    category: 'Meteorology',
    price: 0,
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '24/7 Telemetry',
    students: 45000,
    rating: 4.9,
  },
  {
    id: 2,
    title: 'Agricultural Soil & Rainfall Intelligence',
    category: 'Agri-Climate',
    price: 0,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: 'Seasonal Advisory',
    students: 18200,
    rating: 4.8,
  },
  {
    id: 3,
    title: 'Marine Weather & Offshore Wave Tracking',
    category: 'Oceanography',
    price: 0,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: 'Real-time Feed',
    students: 9500,
    rating: 4.9,
  },
  {
    id: 4,
    title: 'Aviation Turbulence & Crosswind Telemetry',
    category: 'Aviation',
    price: 0,
    image: 'https://images.unsplash.com/photo-1519074069444-1ba4eff56024?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: 'Continuous Stream',
    students: 6200,
    rating: 4.9,
  },
];

const Courses = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from('.courses-header', {
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
      gsap.from('.course-card', {
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
    <section ref={sectionRef} className="section-padding bg-slate-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="courses-header flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-1 bg-sky"></div>
              <span className="text-sky font-semibold uppercase tracking-wider text-sm">
                Meteorological Telemetry
              </span>
            </div>
            <h2 className="section-title text-slate-900">
              Weather & Climate <span className="text-sky">Services</span>
            </h2>
            <p className="section-subtitle mt-4 text-slate-600">
              High-precision radar imagery, agricultural drought monitoring, marine sea-state tracking, and aviation turbulence feeds.
            </p>
          </div>
          <Link to="/noticeboard" className="px-6 py-3 bg-sky hover:bg-sky-dark text-white font-semibold rounded-xl shadow-md transition-all flex items-center space-x-2 mt-6 md:mt-0">
            <span>Explore Weather Alerts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Courses Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Link
              to="/course/doppler-radar"
              key={course.id}
              className="course-card card group cursor-pointer block border border-slate-100 hover:border-sky/30"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={course.image}
                  alt={course.title}
                  loading="lazy"
                  width={800}
                  height={533}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    {course.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="w-4 h-4 text-amber fill-amber" />
                  <span className="text-sm font-medium text-slate-800">{course.rating}</span>
                  <span className="text-sm text-slate-500">({course.students.toLocaleString()} active users)</span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-slate-900 mb-3 group-hover:text-sky transition-colors line-clamp-2">
                  {course.title}
                </h3>

                {/* Meta */}
                <div className="flex items-center space-x-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-sky" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-sky" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                  <span className="text-sm font-medium text-sky flex items-center">
                    Access Telemetry
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
