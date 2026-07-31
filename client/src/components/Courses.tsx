import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CloudRain, ShieldAlert, Thermometer, Sun, ArrowRight, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const climateTools = [
  {
    id: 'tool-1',
    title: 'WRF Convective Weather & Attribution Platform',
    category: 'Atmospheric Science',
    icon: CloudRain,
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    resolution: '3km Convective Grid',
    users: '50+ Research Institutes',
    status: 'Live Telemetry',
    accent: '#00C8C8',
  },
  {
    id: 'tool-2',
    title: 'Indus Basin GLOF Hydrograph Portal',
    category: 'Hydrology & Cryosphere',
    icon: ShieldAlert,
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    resolution: '3,000+ Glacial Lakes',
    users: 'NDMA & Provincial Advisory',
    status: 'Real-Time Feed',
    accent: '#3B82F6',
  },
  {
    id: 'tool-3',
    title: 'Pre-Monsoon Humid Heat Stress Index (TW > 35°C)',
    category: 'Urban Climate & Health',
    icon: Thermometer,
    image: 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    resolution: 'City-Wide Microclimate',
    users: 'Municipal Early Warning',
    status: 'Active Index',
    accent: '#F59E0B',
  },
  {
    id: 'tool-4',
    title: 'South Asia Renewable Wind & Solar Energy Atlas',
    category: 'Clean Energy GIS',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    resolution: '1km Solar GHI Grid',
    users: 'Energy Grid Planners',
    status: 'Open Data',
    accent: '#10B981',
  },
];

const Courses = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      gsap.from('.course-card', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gray-900 text-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="courses-header flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="w-8 h-px bg-[#00C8C8]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C8C8]">
                Interactive Telemetry Suite
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
              Featured Climate <span className="text-[#00C8C8]">Tools &amp; Atlases</span>
            </h2>
          </div>
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#00C8C8] hover:text-teal-300 transition-colors"
          >
            <span>Explore All 6 Sector Platforms</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tools Cards Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {climateTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="course-card group bg-gray-800/80 border border-gray-700/60 rounded-3xl overflow-hidden hover:border-[#00C8C8]/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 shadow-xl"
              >
                <div>
                  {/* Image Cover */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-950">
                    <img
                      src={tool.image}
                      alt={tool.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />
                    <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-gray-900/90 text-[#00C8C8] border border-[#00C8C8]/40 backdrop-blur-md">
                      {tool.category}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <Icon className="w-4 h-4 text-[#00C8C8]" />
                      <span>{tool.resolution}</span>
                    </div>

                    <h3 className="text-lg font-heading font-bold text-white group-hover:text-[#00C8C8] transition-colors leading-snug">
                      {tool.title}
                    </h3>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0 border-t border-gray-700/50 mt-4 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{tool.status}</span>
                  </span>
                  <Link
                    to="/tools"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 group-hover:text-[#00C8C8] transition-colors"
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Courses;
