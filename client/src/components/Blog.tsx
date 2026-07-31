import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const fallbackBlogs = [
  {
    id: '1',
    title: 'Heatwave Attribution and Climate Impact in South Asia 2025',
    excerpt: 'Comprehensive analysis of recent extreme temperatures and attribution modeling in regional weather systems.',
    published_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    author_name: 'Dr. Rashid',
    cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'blog',
    slug: 'heatwave-attribution-south-asia-2025',
  },
  {
    id: '2',
    title: 'Monsoon Dynamics & Hydrological Forecasting Report',
    excerpt: 'An in-depth review of monsoon precipitation shifts, runoff predictability, and flood warning integrations.',
    published_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    author_name: 'Dr. Rashid',
    cover_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'blog',
    slug: 'monsoon-dynamics-hydrological-forecasting',
  },
];

const Blog = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [blogs, setBlogs] = useState<any[]>(fallbackBlogs);

  useEffect(() => {
    // Dynamic Fetch from Express API Backend
    fetch('/api/v1/media?type=blog')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data);
        }
      })
      .catch(() => {
        // Fallback to static items if backend is offline
      });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
  }, [blogs]);

  return (
    <section ref={sectionRef} className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="blog-header flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="decorative-line"></div>
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                Our Blog &amp; Insights
              </span>
            </div>
            <h2 className="section-title">
              Latest Climate Insights &amp;{' '}
              <span className="text-primary">Attribution</span>
            </h2>
          </div>
          <Link to="/media/blogs" className="btn-secondary mt-6 md:mt-0 group">
            <span>View All Articles</span>
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Blog Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="blog-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative overflow-hidden h-52">
                  <img
                    src={blog.cover_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={blog.title}
                    loading="lazy"
                    width={800}
                    height={533}
                    className="blog-image w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {Array.isArray(blog.tags) ? blog.tags[0] || 'Climate' : 'Climate'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{blog.published_at ? new Date(blog.published_at).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{blog.author_name || 'Dr. Rashid'}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6">
                <Link
                  to={`/media/blogs/${blog.slug}`}
                  className="inline-flex items-center text-primary font-medium cursor-pointer group-hover:gap-2 transition-all"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
