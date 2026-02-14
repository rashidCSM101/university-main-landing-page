import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Building2, Users, Sparkles, MapPin, Calendar, Zap, Heart, TrendingUp, Award, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Reasons = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (index: number) => {
    setFavorites(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

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
      title: 'Expert Faculty Members',
      description: 'Learn from distinguished professors and industry experts',
      category: 'Academic',
      badge: 'Excellence',
      bgGradient: 'from-blue-400 via-blue-500 to-blue-600',
      badgeColor: 'bg-primary',
      categoryColor: 'bg-blue-600',
      location: 'Faculty of Sciences',
      stats: { value: '150+', label: 'Professors', icon: Users },
      stats2: { value: '25+', label: 'Years Exp.', icon: Award },
      number: '01',
      link: '/faculty',
    },
    {
      icon: Building2,
      title: 'Modern Infrastructure',
      description: 'State-of-the-art laboratories and learning facilities',
      category: 'Facilities',
      badge: 'Premium',
      bgGradient: 'from-rose-400 via-primary to-rose-700',
      badgeColor: 'bg-orange-500',
      categoryColor: 'bg-gray-700',
      location: 'Main Campus',
      stats: { value: '50+', label: 'Labs', icon: Building2 },
      stats2: { value: '100%', label: 'Equipped', icon: TrendingUp },
      number: '02',
      link: '/about',
    },
    {
      icon: Users,
      title: 'Career Opportunities',
      description: 'Strong industry partnerships and placement support',
      category: 'Career',
      badge: 'Top Rated',
      bgGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      badgeColor: 'bg-red-500',
      categoryColor: 'bg-teal-700',
      location: 'Career Services',
      stats: { value: '90%', label: 'Placements', icon: TrendingUp },
      stats2: { value: '200+', label: 'Companies', icon: BookOpen },
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
          {reasons.map((reason, index) => {
            const StatIcon1 = reason.stats.icon;
            const StatIcon2 = reason.stats2.icon;
            const isFavorite = favorites.includes(index);
            
            return (
              <Link
                key={index}
                to={reason.link}
                className="reason-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image/Gradient Section */}
                <div className={`relative h-64 bg-gradient-to-br ${reason.bgGradient} overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                  </div>
                  
                  {/* Icon in Center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <reason.icon className="w-24 h-24 text-white/90 group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className={`${reason.badgeColor} text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg`}>
                      {reason.badge}
                    </span>
                    <span className="bg-gray-800/80 backdrop-blur-sm text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                      <Zap className="w-4 h-4" fill="currentColor" />
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className={`${reason.categoryColor} text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg`}>
                      {reason.category}
                    </span>
                  </div>

                  {/* Bottom Price Badge & Heart */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="bg-teal-600 text-white font-bold text-lg px-5 py-2.5 rounded-xl shadow-lg">
                      #{reason.number}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(index);
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isFavorite 
                          ? 'bg-red-500 text-white scale-110' 
                          : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{reason.location}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {reason.title}
                  </h3>

                  {/* Publisher Info */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-rose-600 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">GDC Larkana</span>
                    <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                      <Calendar className="w-3 h-3" />
                      <span>Est. 1935</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{reason.description}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <StatIcon1 className="w-4 h-4 text-gray-700" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-gray-900">{reason.stats.value}</div>
                        <div className="text-gray-500">{reason.stats.label}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <StatIcon2 className="w-4 h-4 text-gray-700" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-gray-900">{reason.stats2.value}</div>
                        <div className="text-gray-500">{reason.stats2.label}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-gray-500 mb-5 text-sm">
            Ready to start your journey with us?
          </p>
          <Link to="/admissions" className="btn-primary group">
            <span>Apply Now</span>
            <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Reasons;
