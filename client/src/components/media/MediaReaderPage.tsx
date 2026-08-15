import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import {
  ArrowLeft,
  Calendar,
  Tag,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Tv,
} from 'lucide-react';
import { fetchMediaItems, fetchMediaItemBySlug } from '../../services/api';

export const MediaReaderPage = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const [item, setItem] = useState<any>(null);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const identifier = id || slug;
    setLoading(true);

    const fallbackDefault = {
      id: identifier || 'default',
      title: 'Heatwave Attribution and Climate Impact in South Asia 2025',
      slug: 'heatwave-attribution-south-asia-2025',
      type: 'blog',
      body: 'Comprehensive attribution analysis of extreme regional weather systems, heat dome formations, and hydrological precipitation shifts across South Asia.',
      excerpt: 'Attribution modeling and regional weather analysis by WenClims climate research group.',
      author_name: 'Dr. Rashid',
      published_at: new Date().toISOString(),
      cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      tags: ['Climate Change', 'Attribution Science', 'South Asia'],
    };

    if (!identifier) {
      setItem(fallbackDefault);
      setLoading(false);
      return;
    }

    // Try direct item endpoint first, then list endpoint
    fetchMediaItemBySlug(identifier)
      .then((singleData) => {
        if (singleData && singleData.id) {
          setItem(singleData);
          setLoading(false);
          // Fetch list for recent items
          fetchMediaItems()
            .then((list) => {
              if (Array.isArray(list)) {
                setRecentItems(list.filter((m) => String(m.id) !== identifier && m.slug !== identifier).slice(0, 3));
              }
            })
            .catch(() => {});
        } else {
          // Fallback to searching all media list
          fetchMediaItems()
            .then((data) => {
              if (Array.isArray(data) && data.length > 0) {
                const found = data.find(
                  (m) =>
                    String(m.id) === identifier ||
                    m.slug === identifier ||
                    m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === identifier
                );
                setItem(found || data[0]);
                setRecentItems(data.filter((m) => String(m.id) !== identifier).slice(0, 3));
              } else {
                setItem(fallbackDefault);
              }
            })
            .catch(() => setItem(fallbackDefault))
            .finally(() => setLoading(false));
        }
      })
      .catch(() => {
        setItem(fallbackDefault);
        setLoading(false);
      });
  }, [id, slug]);

  useEffect(() => {
    if (!item) return;

    const ctx = gsap.context(() => {
      gsap.from('.detail-hero', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.detail-media-container', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.detail-content-section', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from('.detail-sidebar-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out',
      });
    }, pageRef);

    return () => ctx.revert();
  }, [item]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 font-medium text-sm">Loading media article...</span>
        </div>
      </div>
    );
  }

  const publishedDate = item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '2025';

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-950 text-gray-100 pt-28 pb-20">
      <Helmet>
        <title>{`${item.title} | WenClims Media & Insights`}</title>
        <meta name="description" content={item.excerpt || item.title} />
      </Helmet>

      {/* Top Back Navigation Bar */}
      <div className="container-custom mb-8">
        <Link
          to="/media"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-semibold text-gray-300 hover:text-white hover:border-teal transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-teal" />
          <span>Back to Media &amp; Publications Hub</span>
        </Link>
      </div>

      <div className="container-custom">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Article & Media Section (8 columns) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Hero Header Card */}
            <div className="detail-hero bg-gray-900/90 border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md">
              {/* Type Badge & Date */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal/15 text-teal border border-teal/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{item.type || 'Article'}</span>
                  </span>
                  <span className="text-xs text-gray-400 font-mono px-3 py-1 rounded-full bg-gray-800/80 border border-gray-700/50">
                    WenClims Insights
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                  <Calendar className="w-4 h-4 text-teal" />
                  <span>{publishedDate}</span>
                </div>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight mb-6">
                {item.title}
              </h1>

              {/* Author & Excerpt */}
              <div className="flex items-center gap-3 pb-6 border-b border-gray-800/80">
                <div className="w-10 h-10 rounded-full bg-teal/20 border border-teal/40 flex items-center justify-center text-teal font-bold text-sm">
                  {item.author_name ? item.author_name.charAt(0) : 'W'}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{item.author_name || 'Dr. Rashid'}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
                  </div>
                  <div className="text-xs text-gray-400">Weather and Climate Services Research Fellow</div>
                </div>
              </div>

              {item.excerpt && (
                <p className="mt-6 text-base md:text-lg text-gray-300 font-light leading-relaxed italic bg-gray-950/60 p-4 md:p-6 rounded-2xl border border-gray-800/80">
                  &ldquo;{item.excerpt}&rdquo;
                </p>
              )}
            </div>

            {/* Embedded Media Container (Video / Audio / Image) */}
            <div className="detail-media-container bg-gray-900/90 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
              {item.embed_url ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={item.embed_url}
                    title={item.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : item.cover_image ? (
                <div className="relative aspect-video w-full overflow-hidden bg-gray-950">
                  <img
                    src={item.cover_image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60" />
                </div>
              ) : null}
            </div>

            {/* Main Body Content */}
            <div className="detail-content-section bg-gray-900/90 border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl">
              <div className="prose prose-invert max-w-none prose-teal text-gray-300 leading-relaxed space-y-6 text-base md:text-lg">
                {item.body ? (
                  item.body.split('\n\n').map((paragraph: string, idx: number) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>No detailed body content available for this media item.</p>
                )}
              </div>

              {/* Tags List */}
              {Array.isArray(item.tags) && item.tags.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-800 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-teal" />
                    <span>Tags:</span>
                  </span>
                  {item.tags.map((t: string, i: number) => (
                    <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-800 text-teal border border-gray-700">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area (4 columns) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Metadata Card */}
            <div className="detail-sidebar-card bg-gray-900/90 border border-gray-800 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-lg font-heading font-bold text-white mb-4 pb-3 border-b border-gray-800 flex items-center gap-2">
                <Tv className="w-5 h-5 text-teal" />
                <span>Media Details</span>
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-800/60">
                  <span className="text-gray-400 text-xs">Format:</span>
                  <span className="font-bold text-white capitalize">{item.type || 'Blog Article'}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-800/60">
                  <span className="text-gray-400 text-xs">Access Status:</span>
                  <span className="font-bold text-emerald-400 text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800">
                    Open Access
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-800/60">
                  <span className="text-gray-400 text-xs">Publisher:</span>
                  <span className="font-bold text-white text-xs">WenClims Media Lab</span>
                </div>

                {item.external_url && (
                  <a
                    href={item.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal text-gray-950 font-bold text-xs hover:bg-teal-400 transition-all shadow-lg"
                  >
                    <span>Open External Resource</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Related Insights Sidebar List */}
            {recentItems.length > 0 && (
              <div className="detail-sidebar-card bg-gray-900/90 border border-gray-800 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-lg font-heading font-bold text-white mb-4 pb-3 border-b border-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal" />
                  <span>Related Insights</span>
                </h3>

                <div className="space-y-4">
                  {recentItems.map((rec) => (
                    <Link
                      key={rec.id}
                      to={`/media/blogs/${rec.slug || rec.id}`}
                      className="group block p-3.5 rounded-2xl bg-gray-950/60 border border-gray-800/80 hover:border-teal/50 transition-all"
                    >
                      <div className="text-xs text-teal font-bold uppercase tracking-wider mb-1">
                        {rec.type || 'Blog'}
                      </div>
                      <h4 className="text-sm font-bold text-gray-200 group-hover:text-white line-clamp-2 transition-colors">
                        {rec.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaReaderPage;
