import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const courses = [
    {
      id: 1,
      title: 'Cell Biology & Genetics',
      category: 'Zoology',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '2 Years',
      students: 120,
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Animal Physiology & Anatomy',
      category: 'Zoology',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '2 Years',
      students: 100,
      rating: 4.9,
    },
    {
      id: 3,
      title: 'Ecology & Wildlife Conservation',
      category: 'Zoology',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '2 Years',
      students: 90,
      rating: 4.7,
    },
    {
      id: 4,
      title: 'Entomology & Parasitology',
      category: 'Zoology',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '2 Years',
      students: 75,
      rating: 4.6,
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

      // Cards animation - without hiding initially
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
    <section ref={sectionRef} className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="courses-header flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="decorative-line"></div>
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                Our Courses
              </span>
            </div>
            <h2 className="section-title">
              Zoology <span className="text-primary">Courses</span>
            </h2>
            <p className="section-subtitle mt-4">
              Explore our Zoology programs at Government Degree College Larkana
            </p>
          </div>
          <Link to="/course/zoology" className="btn-primary mt-6 md:mt-0 group">
            <span>View All Courses</span>
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Courses Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Link
              to="/course/zoology"
              key={course.id}
              className="course-card card group cursor-pointer block"
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
                  <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                  <span className="text-sm text-gray-400">({course.students} students)</span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>

                {/* Meta */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium text-primary flex items-center">
                    View Details
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
