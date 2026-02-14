import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const blogs = [
    {
      id: 1,
      title: 'The Future of Education Technology',
      excerpt: 'Discover how technology is reshaping the educational landscape and what it means for students and educators.',
      date: 'Dec 20, 2025',
      author: 'Admin',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Technology',
    },
    {
      id: 2,
      title: 'Tips for Academic Success in University',
      excerpt: 'Essential strategies for excelling in your academic journey and making the most of your university experience.',
      date: 'Dec 18, 2025',
      author: 'Admin',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Education',
    },
    {
      id: 3,
      title: 'Career Opportunities After Graduation',
      excerpt: 'Explore the vast career opportunities available to our graduates and how to prepare for the job market.',
      date: 'Dec 15, 2025',
      author: 'Admin',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Career',
    },
  ];

const Blog = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from('.blog-header', {
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
      gsap.from('.blog-card', {
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

  return (
    <section ref={sectionRef} className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="blog-header flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="decorative-line"></div>
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                Our Blog
              </span>
            </div>
            <h2 className="section-title">
              Latest Insights &{' '}
              <span className="text-primary">Updates</span>
            </h2>
          </div>
          <button className="btn-secondary mt-6 md:mt-0 group">
            <span>View All Posts</span>
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Blog Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="blog-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-52">
                <img
                  src={blog.image}
                  alt={blog.title}
                  loading="lazy"
                  width={800}
                  height={533}
                  className="blog-image w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{blog.author}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>

                {/* Read More */}
                <span
                  className="inline-flex items-center text-primary font-medium cursor-pointer group-hover:gap-2 transition-all"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
