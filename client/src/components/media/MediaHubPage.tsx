import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchMediaItems } from '../../services/api';
import {
  Sparkles,
  Calendar,
  ArrowRight,
  Search,
  Tv,
  Mic,
  FileText,
  Video,
  Newspaper,
  X,
  ExternalLink,
  Play,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface MediaItem {
  id: string;
  type: 'blog' | 'documentary' | 'podcast' | 'talkshow' | 'print';
  title: string;
  slug: string;
  body?: string;
  excerpt?: string;
  external_url?: string;
  embed_url?: string;
  cover_image?: string;
  author_name?: string;
  co_authors?: string[];
  tags?: string[];
  status: 'draft' | 'published';
  published_at?: string;
}

const fallbackItems: MediaItem[] = [
  {
    id: '1',
    type: 'blog',
    title: 'Heatwave Attribution and Climate Impact in South Asia 2025',
    slug: 'heatwave-attribution-south-asia-2025',
    excerpt: 'Comprehensive analysis of recent extreme temperatures and attribution modeling in regional weather systems.',
    body: 'Summer heatwaves in South Asia have become increasingly severe over the past decade. Using regional climate models and high-resolution observational datasets, scientists at WenClims analyze the thermodynamic and dynamic contributors to heat dome persistence.',
    author_name: 'Dr. Rashid',
    cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Climate Change', 'Attribution'],
    status: 'published',
    published_at: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'documentary',
    title: 'Indus Basin Glacial Melt & Downstream Vulnerability',
    slug: 'indus-basin-glacial-melt-doc',
    excerpt: 'A documentary exploring glacier retreat in the Karakoram range and its downstream impact on Indus agriculture.',
    body: 'Glaciers in the High Mountain Asia region feed vital river basins that support over 1.4 billion people. This documentary examines snowpack loss, GLOF hazards, and downstream water security.',
    author_name: 'WenClims Media',
    cover_image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Documentary', 'Glaciers'],
    status: 'published',
    published_at: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'talkshow',
    title: 'Climate Resilience & Flood Preparedness in Pakistan',
    slug: 'talkshow-climate-resilience-pakistan',
    excerpt: 'Dr. Rashid joins climate policy experts on national television to discuss flood forecasting integration.',
    body: 'Discussion on integrating early warning radar outputs directly into district emergency response plans across riverine communities in Pakistan.',
    author_name: 'Dr. Rashid',
    embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    cover_image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Talkshow', 'Policy'],
    status: 'published',
    published_at: new Date().toISOString(),
  },
  {
    id: '4',
    type: 'podcast',
    title: 'Climate Voices Podcast: Ep 14 Hydrometeorology Advances',
    slug: 'podcast-hydrometeorology-advances',
    excerpt: 'In-depth audio interview on weather attribution models and early warning delivery.',
    body: 'Interview covering advances in statistical attribution algorithms, AI-enhanced ensemble forecasts, and climate risk communications.',
    author_name: 'Dr. Rashid',
    cover_image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Podcast', 'Weather'],
    status: 'published',
    published_at: new Date().toISOString(),
  },
];

const mediaTypes = [
  { key: 'all', label: 'All Media', icon: Sparkles },
  { key: 'blog', label: 'Blogs & Articles', icon: FileText },
  { key: 'documentary', label: 'Documentaries', icon: Video },
  { key: 'talkshow', label: 'Talkshows', icon: Tv },
  { key: 'podcast', label: 'Podcasts & Radio', icon: Mic },
  { key: 'print', label: 'Print Media Excerpts', icon: Newspaper },
];

export const MediaHubPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [mediaList, setMediaList] = useState<MediaItem[]>(fallbackItems);
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchMediaItems()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMediaList(data);
        }
      })
      .catch(() => setMediaList(fallbackItems));
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.media-hero', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
      gsap.from('.media-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, [selectedType, mediaList]);

  const filteredMedia = mediaList.filter((m) => {
    const matchesType = selectedType === 'all' || m.type === selectedType;
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.excerpt && m.excerpt.toLowerCase().includes(search.toLowerCase())) ||
      (m.tags && m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));
    return matchesType && matchesSearch;
  });

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-950 text-gray-100">
      <Helmet>
        <title>Media, Podcasts &amp; Documentaries | WenClims</title>
        <meta
          name="description"
          content="Explore WenClims media hub — climate documentaries, podcasts, talkshows, and blog articles covering South Asian climate science."
        />
        <link rel="canonical" href="https://wenclims.org/media" />
      </Helmet>

      {/* ═══ HOME-STYLE HERO SECTION (Full Background Image Track + Overlay) ═══ */}
      <section
        id="hero"
        className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden bg-gray-900 border-b border-gray-800/60"
        aria-label="Media Hub Hero"
      >
        {/* Background Image Track */}
        <div className="absolute inset-0 w-full h-full will-change-transform">
          <img
            src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1920&q=80"
            alt="WenClims Climate Media Hero Background"
            fetchPriority="high"
            loading="eager"
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-700 filter brightness-90"
          />
          {/* Layered dark gradient overlays — matching Tools & Vision hero */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(10,37,64,0.95) 0%, rgba(10,37,64,0.85) 42%, rgba(10,37,64,0.65) 75%, rgba(10,37,64,0.45) 100%)',
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

        {/* Content Block matching Tools & Vision Max Width */}
        <div className="relative z-10 w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-36 lg:pt-40 pb-16 flex flex-col justify-center">
          <div className="media-hero w-full max-w-4xl">
            {/* Top Link & Tag Pill */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="w-8 h-px bg-[#00C8C8]" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] px-3 py-1 rounded-full border border-[#00C8C8]/50 text-[#00C8C8] bg-[#00C8C8]/10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Multimedia Knowledge Hub
              </span>
            </div>

            {/* Heading matching Tools & Vision Hero styling */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-tight mb-6">
              Climate Media &amp;{' '}
              <span className="relative inline-block">
                <span className="text-[#00C8C8]">Insights</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8C50 3 150 2 298 7"
                    stroke="#00C8C8"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-light mb-10 max-w-3xl">
              Documentaries, talkshow interviews, podcasts, and scientific blog articles communicating extreme weather attribution, water security, and South Asian climate policies.
            </p>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl pt-4 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#00C8C8]/20 border border-[#00C8C8]/40 flex items-center justify-center text-[#00C8C8]">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">HD Documentaries</div>
                  <div className="text-[10px] text-gray-400">Attribution Science</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Radio &amp; Podcasts</div>
                  <div className="text-[10px] text-gray-400">Expert Interviews</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Tv className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">TV Talkshows</div>
                  <div className="text-[10px] text-gray-400">National Broadcasts</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Research Blogs</div>
                  <div className="text-[10px] text-gray-400">Monographs &amp; Papers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area (Clean Light Theme matching Tools & Vision pages) */}
      <div className="py-16 bg-gray-50">

        {/* Filter Controls & Search Bar */}
        <div className="w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-gray-200 p-3.5 rounded-2xl shadow-sm">
            {/* Category Tabs — scrollbar hidden completely to prevent line */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {mediaTypes.map((t) => {
                const Icon = t.icon;
                const isActive = selectedType === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setSelectedType(t.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#48b302] text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Field */}
            <div className="relative w-full md:w-72 flex-shrink-0">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search title, keyword, tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#48b302] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Media Cards Grid */}
        <div className="w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8">
          {filteredMedia.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto my-12 shadow-sm">
              <Sparkles className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Media Found</h3>
              <p className="text-gray-500 text-xs mb-4">No content matches your search query or filter.</p>
              <button
                onClick={() => {
                  setSelectedType('all');
                  setSearch('');
                }}
                className="px-4 py-2 bg-[#48b302] text-white font-bold text-xs rounded-xl hover:bg-[#007373] transition-all shadow-md"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredMedia.map((m) => (
                <div
                  key={m.id}
                  className="media-card group bg-white border border-gray-200/80 hover:border-[#48b302]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Thumbnail Container */}
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                      {m.cover_image ? (
                        <img
                          src={m.cover_image}
                          alt={m.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-teal-50 flex items-center justify-center">
                          <Sparkles className="w-10 h-10 text-[#48b302]/40" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-60" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gray-900/80 text-[#00C8C8] border border-[#00C8C8]/30 backdrop-blur-md">
                          {m.type}
                        </span>
                        {m.embed_url && (
                          <span className="w-8 h-8 rounded-full bg-[#00C8C8] text-[#0B1E3D] flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-[#48b302]" />
                        <span>{m.published_at ? new Date(m.published_at).toLocaleDateString() : '2025'}</span>
                        {m.author_name && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-600 font-sans font-medium">
                              {m.author_name}
                              {m.co_authors && m.co_authors.length > 0 && ` +${m.co_authors.length}`}
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-lg font-heading font-bold text-gray-900 group-hover:text-[#48b302] transition-colors leading-snug line-clamp-2">
                        {m.title}
                      </h3>

                      {m.excerpt && (
                        <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 font-light">
                          {m.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-6 pt-0 border-t border-gray-100 mt-4 flex items-center justify-between">
                    {m.embed_url ? (
                      <button
                        onClick={() => setActiveItem(m)}
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#48b302] hover:text-[#006666] transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Watch &amp; Read</span>
                      </button>
                    ) : (
                      <Link
                        to={`/media/blogs/${m.slug || m.id}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#48b302] hover:text-[#006666] transition-colors"
                      >
                        <span>Read Full Article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Embed Media Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 px-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white line-clamp-1">{activeItem.title}</h3>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              {activeItem.embed_url ? (
                <iframe
                  src={activeItem.embed_url}
                  title={activeItem.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={activeItem.cover_image}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="p-6 space-y-3">
              <p className="text-xs text-gray-300 leading-relaxed">{activeItem.body || activeItem.excerpt}</p>
              {activeItem.external_url && (
                <a
                  href={activeItem.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal text-gray-950 text-xs font-bold hover:bg-teal-400 transition-all"
                >
                  <span>Visit External Media Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaHubPage;
