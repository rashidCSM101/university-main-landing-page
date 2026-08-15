import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchTools } from '../services/api';
import {
  Wrench,
  ExternalLink,
  Search,
  Filter,
  Activity,
  CloudSun,
  Zap,
  Droplets,
  Layers,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

import toolsHeroImg from '../../assets/images/tools-hero.png?url';

gsap.registerPlugin(ScrollTrigger);

export interface ToolItem {
  id: string;
  title: string;
  sector: 'Climate' | 'Meteo' | 'Energy' | 'Water' | string;
  description: string;
  external_url: string;
  thumbnail?: string;
  sort_order?: number;
  is_active?: boolean;
}

// Fallback seed tools data in case API server is unreachable
const fallbackTools: ToolItem[] = [
  {
    id: '1',
    title: 'PakClim Weather Telemetry Platform',
    sector: 'Meteo',
    description: 'High-resolution numerical weather prediction and Doppler radar visualization engine tailored for Pakistan & South Asia.',
    external_url: 'https://pakclimtool.com',
    thumbnail: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80',
    sort_order: 1,
    is_active: true,
  },
  {
    id: '2',
    title: 'Indus Basin Hydrological Predictor',
    sector: 'Water',
    description: 'Real-time streamflow modeling, glacio-hydrological runoff prediction, and river basin flood risk telemetry.',
    external_url: 'https://pakclimtool.com/water',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    sort_order: 2,
    is_active: true,
  },
  {
    id: '3',
    title: 'Solar & Wind Energy Potential Atlas',
    sector: 'Energy',
    description: 'Spatial renewable energy feasibility maps, solar irradiance forecasting, and wind turbine yield analysis across regions.',
    external_url: 'https://pakclimtool.com/energy',
    thumbnail: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    sort_order: 3,
    is_active: true,
  },
  {
    id: '4',
    title: 'Heatwave & Wet-Bulb Stress Monitor',
    sector: 'Climate',
    description: 'Real-time extreme temperature anomaly detector, wet-bulb heat index calculator, and urban thermal vulnerability maps.',
    external_url: 'https://wenclims.org/tools/heatwave',
    thumbnail: 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?auto=format&fit=crop&w=800&q=80',
    sort_order: 4,
    is_active: true,
  },
  {
    id: '5',
    title: 'Satellite Vegetation & Drought Index (NDVI)',
    sector: 'Climate',
    description: 'MODIS & Sentinel satellite telemetry calculating agricultural drought severity and soil moisture index across cropland basins.',
    external_url: 'https://wenclims.org/tools/ndvi',
    thumbnail: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    sort_order: 5,
    is_active: true,
  },
  {
    id: '6',
    title: 'Doppler Radar Precipitation Telemetry',
    sector: 'Meteo',
    description: '24/7 cloud reflectivity, convective storm tracking, and cloud-to-ground lightning stroke density analytics.',
    external_url: 'https://wenclims.org/tools/radar',
    thumbnail: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=800&q=80',
    sort_order: 6,
    is_active: true,
  },
];

const sectorIcons: Record<string, any> = {
  Climate: CloudSun,
  Meteo: Activity,
  Energy: Zap,
  Water: Droplets,
};

const heroStats = [
  { value: '6+', label: 'Active Sector Tools' },
  { value: '24/7', label: 'Telemetry Data Feeds' },
  { value: '4', label: 'Core Science Domains' },
  { value: 'API v1', label: 'Express Integration' },
];

const Tools = () => {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [bgImage, setBgImage] = useState<string>(toolsHeroImg);

  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch dynamic tools data from Express backend
  const fetchToolsData = async () => {
    setLoading(true);
    try {
      const data = await fetchTools();
      if (Array.isArray(data) && data.length > 0) {
        setTools(data);
        setIsUsingFallback(false);
      } else {
        setTools(fallbackTools);
        setIsUsingFallback(true);
      }
    } catch (err) {
      console.warn('Backend API unreachable, using fallback tools data:', err);
      setTools(fallbackTools);
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToolsData();
  }, []);

  // GSAP Entrance Animations & Parallax matching Home Hero
  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        const children = Array.from(contentRef.current.children) as HTMLElement[];
        gsap.fromTo(
          children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      }

      // Parallax scroll on tools hero background image
      gsap.to('.tools-hero-track', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '#tools-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      if (gridRef.current) {
        gsap.from('.tool-card', {
          opacity: 0,
          y: 40,
          scale: 0.96,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          },
        });

        // Parallax on card thumbnails
        gsap.utils.toArray('.tool-card img').forEach((img: any) => {
          gsap.to(img, {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          });
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, [loading]);

  const sectors = ['All', 'Climate', 'Meteo', 'Energy', 'Water'];

  const filteredTools = tools.filter((tool) => {
    const matchesSector = selectedSector === 'All' || tool.sector.toLowerCase() === selectedSector.toLowerCase();
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Sector Climate &amp; Meteorological Tools | WenClims</title>
        <meta
          name="description"
          content="Explore science-based climate intelligence, Doppler weather forecasting, hydrological predictors, and renewable energy atlases at WenClims."
        />
        <link rel="canonical" href="https://wenclims.org/tools" />
      </Helmet>

      <div ref={pageRef} className="min-h-screen bg-gray-50">
        {/* ═══ HOME-STYLE HERO SECTION (Full Background Image Track + Overlay) ═══ */}
        <section
          id="tools-hero"
          className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gray-900"
          aria-label="Tools Hero"
        >
          {/* Background Image Track */}
          <div className="tools-hero-track absolute inset-0 w-full h-full will-change-transform">
            <img
              src={bgImage}
              alt="WenClims Sector Tools Hero Background"
              onError={() => {
                if (bgImage !== toolsHeroImg) {
                  setBgImage(toolsHeroImg);
                }
              }}
              fetchPriority="high"
              loading="eager"
              width={1920}
              height={1080}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-700"
            />
            {/* Layered dark gradient overlays — seamless full-screen coverage */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(105deg, rgba(10,37,64,0.95) 0%, rgba(10,37,64,0.82) 42%, rgba(10,37,64,0.60) 75%, rgba(10,37,64,0.40) 100%)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(5,20,40,0.98) 0%, rgba(5,20,40,0.60) 50%, transparent 100%)',
              }}
            />
          </div>

          {/* Grid Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* ── Main Content Block matching Home Hero max-w-[68rem] ── */}
          <div className="relative z-10 w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-40 lg:pt-44 pb-20 flex flex-col justify-center">
            <div ref={contentRef} className="w-full max-w-4xl">
              {/* Top Link & Tag Pill */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="w-8 h-px bg-[#00C8C8]" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] px-3 py-1 rounded-full border border-[#00C8C8]/50 text-[#00C8C8] bg-[#00C8C8]/10">
                  Interactive Telemetry Platforms
                </span>
              </div>

              {/* Heading matching Home Hero styling */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-tight mb-6">
                Climate &amp; Meteorological{' '}
                <span className="relative inline-block">
                  <span className="text-[#00C8C8]">Tools</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 8C80 2 220 2 298 8"
                      stroke="#00C8C8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Sub-copy */}
              <p className="text-base md:text-lg text-white/80 mb-8 max-w-3xl leading-relaxed">
                Access our suite of numerical weather prediction platforms, Indus Basin hydrological forecasting tools, and regional renewable energy atlases.
              </p>

              {/* Search Bar matching Home Hero button styling */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search tools by keyword, sector, or model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00C8C8] transition-all text-sm"
                  />
                </div>
                <button
                  onClick={() => {
                    const catalogEl = document.getElementById('sector-catalog');
                    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center px-7 py-3.5 font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl group bg-[#00C8C8] text-[#0B1E3D] flex-shrink-0"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Hero Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/15 max-w-3xl">
                {heroStats.map((st, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-2xl font-bold text-white font-heading">{st.value}</span>
                    <span className="text-xs text-white/70 mt-0.5">{st.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SECTOR CATALOG & DYNAMIC TOOLS GRID ═══ */}
        <div id="sector-catalog" className="w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header & Sector Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#48b302] mb-2">
                <Layers className="w-4 h-4" />
                <span>Dynamic Sector Catalog</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                Explore Available <span className="text-[#48b302]">Platforms</span>
              </h2>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
              {sectors.map((sec) => {
                const IconComponent = sectorIcons[sec] || Filter;
                const isActive = selectedSector === sec;
                return (
                  <button
                    key={sec}
                    onClick={() => setSelectedSector(sec)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#48b302] text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {sec !== 'All' && <IconComponent className="w-3.5 h-3.5" />}
                    <span>{sec}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sync / Live Status Banner */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 mb-8 border border-gray-200/80 shadow-sm text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                Data source:{' '}
                <strong className="text-gray-900">
                  {isUsingFallback ? 'Express Backend Seed Cache' : 'Live Express REST API (/api/v1/tools)'}
                </strong>
              </span>
            </div>
            <button
              onClick={fetchToolsData}
              className="inline-flex items-center gap-1.5 text-[#48b302] hover:text-teal-700 font-semibold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          </div>

          {/* Tools Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4">
                  <div className="h-44 bg-gray-200 rounded-2xl w-full" />
                  <div className="h-6 bg-gray-200 rounded-md w-3/4" />
                  <div className="h-12 bg-gray-100 rounded-md w-full" />
                  <div className="h-10 bg-gray-200 rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : filteredTools.length > 0 ? (
            <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.map((tool) => {
                const IconComp = sectorIcons[tool.sector] || Activity;
                return (
                  <div
                    key={tool.id}
                    className="tool-card group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
                  >
                    <div>
                      {/* Image / Thumbnail Container */}
                      <div className="relative h-48 overflow-hidden bg-gray-900">
                        {tool.thumbnail ? (
                          <img
                            src={tool.thumbnail}
                            alt={tool.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-[#00C8C8]">
                            <IconComp className="w-12 h-12 opacity-80" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

                        {/* Sector Badge */}
                        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-gray-900/80 backdrop-blur border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          <IconComp className="w-3.5 h-3.5 text-[#00C8C8]" />
                          <span>{tool.sector}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-[#48b302] transition-colors leading-snug">
                          {tool.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {tool.description || 'Interactive sector platform for climate analysis and forecasting.'}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Button */}
                    <div className="px-6 pb-6 pt-2">
                      <a
                        href={tool.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-teal-50 hover:bg-[#48b302] text-[#48b302] hover:text-white font-bold py-3 px-5 rounded-2xl transition-all duration-300 border border-teal-200 group-hover:border-[#48b302] text-sm shadow-sm"
                      >
                        <span>Launch Platform</span>
                        <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-lg mx-auto shadow-sm">
              <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Tools Found</h3>
              <p className="text-gray-500 text-sm mb-6">
                No sector tools matched your current filter &quot;{selectedSector}&quot; or search query &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => {
                  setSelectedSector('All');
                  setSearchQuery('');
                }}
                className="btn-primary text-sm"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Tools;
