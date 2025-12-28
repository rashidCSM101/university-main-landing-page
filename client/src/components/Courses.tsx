import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const courses = [
    {
      id: 1,
      title: 'Science, Education, Physical & Math',
      category: 'Science',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Years',
      students: 150,
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Pre-Medical, Learn English & Math',
      category: 'Medical',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Years',
      students: 200,
      rating: 4.9,
    },
    {
      id: 3,
      title: 'Learn Psychology in just 3 Years',
      category: 'Psychology',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Years',
      students: 120,
      rating: 4.7,
    },
    {
      id: 4,
      title: 'Sport Coaching, National Gym Skills',
      category: 'Sports',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1461896836934- voices-of-a-revolution?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '2 Years',
      students: 80,
      rating: 4.6,
    },
  ];

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
              Academic <span className="text-primary">Courses</span>
            </h2>
            <p className="section-subtitle mt-4">
              Explore our diverse range of programs designed to prepare you for success
            </p>
          </div>
          <button className="btn-primary mt-6 md:mt-0 group">
            <span>View All Courses</span>
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Courses Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="course-card card group cursor-pointer"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={course.image}
                  alt={course.title}
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

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xl font-bold text-primary">
                    ${course.price}
                  </div>
                  <button className="text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center">
                    Enroll Now
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
