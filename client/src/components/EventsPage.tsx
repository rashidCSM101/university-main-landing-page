import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  ArrowRight,
  Search,
  Tag,
  Tv,
  Mic,
  FileText,
  Video,
  Newspaper,
  X,
  ExternalLink,
  Play,
  User,
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

const EventsPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [mediaList, setMediaList] = useState<MediaItem[]>(fallbackItems);
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    // Dynamic Fetch from Express API Backend
    fetch('/api/v1/media')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMediaList(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.events-hero-content', {
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from('.media-card', {
        y: 30,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });
    }, pageRef);

    return () => ctx.revert();
  }, [selectedType, mediaList]);

  // Strict Media Type Filtering
  const filtered = mediaList.filter((item) => {
    const itemType = (item.type || '').toLowerCase().trim();
    const matchesType = selectedType === 'all' || itemType === selectedType.toLowerCase().trim();

    const matchesSearch =
      search === '' ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(search.toLowerCase())) ||
      (item.body && item.body.toLowerCase().includes(search.toLowerCase()));

    return matchesType && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Media &amp; Insights Hub | WenClims Weather &amp; Climate Services</title>
        <meta
          name="description"
          content="Explore blogs, documentaries, podcasts, talkshows, and print media excerpts by WenClims climate scientists."
        />
        <link rel="canonical" href="https://wenclims.org/media" />
      </Helmet>

      <div ref={pageRef} className="min-h-screen bg-gray-50 pb-20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
          </div>

          <div className="container-custom relative z-10">
            <div className="events-hero-content">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>

              <div className="inline-flex items-center gap-2 bg-teal-500/10 backdrop-blur-sm border border-teal-500/30 rounded-full px-5 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-teal-300 font-semibold text-xs tracking-wider uppercase">
                  Media &amp; Communications Hub
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
                Climate Media &amp; <span className="text-teal-400">Talkshows</span>
              </h1>
              <p className="text-lg text-white/70 max-w-2xl">
                Browse our full collection of climate attribution blogs, television talkshows, documentary features, audio podcasts, and press excerpts.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="container-custom pt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search media by title or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
              />
            </div>

            {/* Media Type Tabs */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {mediaTypes.map((t) => {
                const Icon = t.icon;
                const isActive = selectedType === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setSelectedType(t.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-teal-400 shadow-md border border-primary-light'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-gray-500'}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
                <p className="text-gray-500 text-base font-medium">
                  No {selectedType !== 'all' ? selectedType : ''} media items found matching your filter.
                </p>
                <button
                  onClick={() => {
                    setSelectedType('all');
                    setSearch('');
                  }}
                  className="mt-4 text-sm text-teal-600 font-semibold hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filtered.map((item) => (
                <Link
                  key={item.id}
                  to={`/media/item/${item.id}`}
                  className="media-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col justify-between block"
                >
                  <div>
                    {/* Media Cover Image */}
                    <div className="relative overflow-hidden h-52 bg-gray-900">
                      <img
                        src={
                          item.cover_image ||
                          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80'
                        }
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary/90 backdrop-blur-md text-teal-300 border border-teal-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                          <Tag className="w-3 h-3 text-teal-400" />
                          {item.type}
                        </span>
                      </div>
                      {(item.embed_url || item.type === 'talkshow' || item.type === 'documentary') && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-teal-400 text-gray-900 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-xs font-medium text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          <span>
                            {item.published_at
                              ? new Date(item.published_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Recent'}
                          </span>
                        </div>
                        <span>•</span>
                        <div>{item.author_name || 'WenClims Media'}</div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {item.excerpt || item.body || ''}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex justify-between items-center">
                    <span className="inline-flex items-center text-teal-600 font-bold text-sm transition-all group-hover:translate-x-1">
                      <span>
                        {item.type === 'talkshow' || item.type === 'documentary'
                          ? 'Watch Video'
                          : item.type === 'podcast'
                          ? 'Listen Audio'
                          : 'Read Full Article'}
                      </span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Dynamic Media Reader & Video Player Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative">
              {/* Close Button */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video Embed Player OR Hero Cover Image */}
              {activeItem.embed_url ? (
                <div className="relative w-full aspect-video bg-black rounded-t-3xl overflow-hidden">
                  <iframe
                    src={activeItem.embed_url}
                    title={activeItem.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : activeItem.cover_image ? (
                <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-t-3xl bg-gray-900">
                  <img
                    src={activeItem.cover_image}
                    alt={activeItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </div>
              ) : null}

              {/* Modal Body */}
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-teal-500/10 text-teal-700 border border-teal-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {activeItem.type}
                  </span>
                  <div className="flex items-center text-xs text-gray-500 gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>
                      {activeItem.published_at
                        ? new Date(activeItem.published_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Recent'}
                    </span>
                  </div>
                  {activeItem.author_name && (
                    <div className="flex items-center text-xs text-gray-500 gap-1">
                      <User className="w-3.5 h-3.5 text-teal-600" />
                      <span>{activeItem.author_name}</span>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4 leading-snug">
                  {activeItem.title}
                </h2>

                {activeItem.excerpt && (
                  <p className="text-base text-gray-600 font-medium italic mb-6 border-l-4 border-teal-500 pl-4 py-1 bg-teal-50/50 rounded-r-lg">
                    {activeItem.excerpt}
                  </p>
                )}

                <div className="prose prose-teal max-w-none text-gray-700 text-sm md:text-base leading-relaxed mb-8">
                  {activeItem.body ? (
                    <div dangerouslySetInnerHTML={{ __html: activeItem.body.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <p>No full text body provided for this item.</p>
                  )}
                </div>

                {/* External Link Option */}
                {activeItem.external_url && (
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <a
                      href={activeItem.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-teal-300 hover:bg-primary-dark px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md"
                    >
                      <span>Open Original Video / Article Source</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EventsPage;
