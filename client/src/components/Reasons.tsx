import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  Globe2,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const climatePillars = [
  {
    number: '01',
    category: 'Attribution Science',
    badge: 'Peer-Reviewed',
    title: 'Extreme Event Attribution',
    location: 'Indus Basin & South Asia',
    description:
      'Isolating human-induced climate warming from natural atmospheric variability to quantify extreme monsoon precipitation and heatwave drivers.',
    stats1: { value: '40+ Yrs', label: 'ERA5 Reanalysis' },
    stats2: { value: '7 Days', label: 'Rapid Attribution' },
    thumbnail: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80',
    link: '/vision',
    badgeColor: 'bg-emerald-500/90 text-white',
    accentColor: '#008B8B',
  },
  {
    number: '02',
    category: 'Real-Time Telemetry',
    badge: 'High Precision',
    title: 'Satellite & Doppler Radar',
    location: 'Regional Observation Nodes',
    description:
      'Ingesting live NASA TERRA/AQUA satellite feeds and high-resolution weather telemetry to track GLOF hazards, soil moisture, and flood hydrographs.',
    stats1: { value: '24/7', label: 'Live Data Streams' },
    stats2: { value: '1 km', label: 'Spatial Resolution' },
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    link: '/tools',
    badgeColor: 'bg-blue-600/90 text-white',
    accentColor: '#00C8C8',
  },
  {
    number: '03',
    category: 'Policy Impact',
    badge: 'ADB · EU Partner',
    title: 'Climate Risk Advisory',
    location: 'Multilateral Partnerships',
    description:
      'Translating atmospheric modeling into municipal heat action plans, Indus Basin flood vulnerability frameworks, and regional clean energy atlases.',
    stats1: { value: '$15M+', label: 'Research Grants' },
    stats2: { value: '12+', label: 'Active Projects' },
    thumbnail: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
    link: '/projects',
    badgeColor: 'bg-teal-600/90 text-white',
    accentColor: '#008B8B',
  },
];

const Reasons = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from('.reasons-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      // Cards stagger entrance
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Decorative Blur Circles */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#008B8B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00C8C8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="reasons-title text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#008B8B]/10 border border-[#008B8B]/20 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-[#008B8B]" />
            <span className="text-[#008B8B] font-bold uppercase tracking-widest text-xs">
              The WenClims Advantage
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-5 leading-tight">
            Why Partner With <span className="text-[#008B8B]">WenClims</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mx-auto max-w-2xl">
            South Asia&apos;s premier science-based platform delivering high-resolution weather telemetry, extreme event attribution, and actionable climate risk advisory.
          </p>
        </div>

        {/* 3 Premium Feature Cards Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8">
          {climatePillars.map((pillar, index) => (
            <Link
              key={index}
              to={pillar.link}
              className="reason-card group bg-white rounded-3xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-2"
            >
              <div>
                {/* Image Section with Glass Overlay */}
                <div className="relative h-56 overflow-hidden bg-gray-900">
                  <img
                    src={pillar.thumbnail}
                    alt={pillar.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className={`${pillar.badgeColor} text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md`}>
                      {pillar.badge}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md text-[#00C8C8] text-xs font-mono font-bold px-3 py-1 rounded-full border border-white/20">
                      Pillar #{pillar.number}
                    </span>
                  </div>

                  {/* Category Pill on Bottom of Image */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="text-[11px] font-semibold tracking-wider text-white/90 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/30">
                      {pillar.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7">
                  {/* Location Scope */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 font-medium">
                    <Globe2 className="w-3.5 h-3.5 text-[#008B8B]" />
                    <span>{pillar.location}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-[#008B8B] transition-colors leading-snug">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-xs leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 mb-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 font-heading">{pillar.stats1.value}</span>
                      <span className="text-[10px] text-gray-500">{pillar.stats1.label}</span>
                    </div>
                    <div className="flex flex-col border-l border-gray-200 pl-3">
                      <span className="text-sm font-bold text-[#008B8B] font-heading">{pillar.stats2.value}</span>
                      <span className="text-[10px] text-gray-500">{pillar.stats2.label}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#008B8B] group-hover:text-teal-700">
                <span>Explore Science Pillar</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200/80">
          <p className="text-gray-600 text-sm mb-4">
            Looking for climate attribution research or regional telemetry access?
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#008B8B] text-white font-bold rounded-xl hover:bg-teal-700 transition-colors text-sm shadow-md group"
          >
            <span>Explore Funded Projects &amp; Advisory</span>
            <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Reasons;
