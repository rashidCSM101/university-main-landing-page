import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CloudRain,
  ShieldAlert,
  Thermometer,
  Sun,
  Globe2,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const divisions = [
  {
    icon: CloudRain,
    name: 'Atmospheric & Attribution Science',
    projects: '12 Active Models',
    desc: 'High-resolution WRF atmospheric simulations and ERA5 extreme event attribution.',
    color: 'bg-[#008B8B]',
  },
  {
    icon: ShieldAlert,
    name: 'Hydrology & Cryosphere Lab',
    projects: '3,000+ Lakes Monitored',
    desc: 'Hindu Kush Himalaya snowpack retreat, river basin hydrographs, and GLOF warning systems.',
    color: 'bg-blue-600',
  },
  {
    icon: Thermometer,
    name: 'Urban Climate & Health',
    projects: 'TW > 35°C Monitoring',
    desc: 'Pre-monsoon humid heatwave mortality risk, wet-bulb thresholds, and cool roof policy.',
    color: 'bg-amber-600',
  },
  {
    icon: Sun,
    name: 'Clean Energy Atmospheric GIS',
    projects: '1km Irradiance Grid',
    desc: 'Multi-decadal solar irradiance and high-altitude wind velocity atlases for energy grid planners.',
    color: 'bg-emerald-600',
  },
];

const Departments = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.departments-header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.department-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
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
    <section ref={sectionRef} className="py-24 bg-white font-sans border-b border-gray-100">
      <div className="container-custom">
        {/* Section Header */}
        <div className="departments-header text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#008B8B]/10 text-[#008B8B] text-xs font-bold uppercase tracking-wider border border-[#008B8B]/30">
            <Globe2 className="w-4 h-4" />
            <span>Multidisciplinary Research Structure</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900">
            Core Research <span className="text-[#008B8B]">Divisions</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Four specialized scientific laboratories advancing extreme weather attribution, water security, and clean energy transition across South Asia.
          </p>
        </div>

        {/* Divisions Cards Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {divisions.map((div, idx) => {
            const Icon = div.icon;
            return (
              <div
                key={idx}
                className="department-card group bg-gray-50 border border-gray-200/80 rounded-3xl p-6 hover:shadow-xl hover:bg-white hover:border-[#008B8B] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${div.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-gray-900 mb-2 group-hover:text-[#008B8B] transition-colors leading-snug">
                    {div.name}
                  </h3>
                  <div className="text-xs font-bold text-[#008B8B] mb-3">
                    {div.projects}
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {div.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Departments;
