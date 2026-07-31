import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  ExternalLink,
  Share2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Tv,
} from 'lucide-react';

export const MediaDetailPage = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const [item, setItem] = useState<any>(null);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const identifier = id || slug;

    fetch('/api/v1/media')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const found = data.find(
            (m) =>
              String(m.id) === identifier ||
              m.slug === identifier ||
              m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === identifier
          );
          if (found) {
            setItem(found);
          } else {
            setItem(data[0]);
          }
          setRecentItems(data.filter((m) => String(m.id) !== identifier).slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
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
        x: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.4,
        ease: 'power2.out',
      });
    }, pageRef);

    return () => ctx.revert();
  }, [item]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gray-900 text-white">
        <div className="flex items-center gap-3 text-teal-400 font-semibold text-lg animate-pulse">
          <Sparkles className="w-6 h-6" />
          <span>Loading Media Article...</span>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen pt-32 pb-20 container-custom text-center bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Media Article Not Found</h2>
        <Link
          to="/media"
          className="inline-flex items-center gap-2 bg-primary text-teal-300 px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Media Hub
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${item.title} | WenClims Weather & Climate Media`}</title>
        <meta name="description" content={item.excerpt || item.title} />
      </Helmet>

      <div ref={pageRef} className="min-h-screen bg-gray-50 pb-24">
        {/* Full-width Premium Cinema Hero */}
        <div className="relative bg-gradient-to-br from-gray-950 via-primary-dark to-gray-900 pt-32 pb-24 overflow-hidden border-b border-gray-800">
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-10 left-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-blue-600 rounded-full blur-3xl" />
          </div>

        {/* Hero Section Container */}
        <div className="w-full px-4 md:px-8 max-w-[1750px] mx-auto relative z-10">
          <div className="detail-hero max-w-6xl">
              {/* Back Breadcrumb */}
              <Link
                to="/media"
                className="inline-flex items-center gap-2 text-teal-400/80 hover:text-teal-300 transition-colors mb-8 group text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to Media &amp; Talkshows</span>
              </Link>

              {/* Category & Tags Pill */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-teal-500/20 backdrop-blur-md border border-teal-500/40 text-teal-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2 shadow-lg">
                  <Tag className="w-3.5 h-3.5 text-teal-400" />
                  {item.type || 'Media'}
                </span>

                <div className="flex items-center text-xs text-white/70 gap-1.5 bg-white/5 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  <span>
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recent Publication'}
                  </span>
                </div>

                {item.author_name && (
                  <div className="flex items-center text-xs text-white/70 gap-1.5 bg-white/5 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
                    <User className="w-3.5 h-3.5 text-teal-400" />
                    <span>{item.author_name}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white leading-tight mb-6 tracking-tight">
                {item.title}
              </h1>

              {/* Sub-excerpt */}
              {item.excerpt && (
                <p className="text-lg md:text-xl text-teal-100/80 font-normal leading-relaxed max-w-3xl">
                  {item.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="w-full px-4 md:px-8 max-w-[1750px] mx-auto -mt-12 relative z-20">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left/Center Main Column (9 Cols): Video / Cover & Article Text */}
            <div className="lg:col-span-9 space-y-8">
              {/* Media Player OR Cover Banner Card */}
              <div className="detail-media-container bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80">
                {item.embed_url ? (
                  <div className="relative w-full aspect-video bg-black shadow-inner">
                    <iframe
                      src={item.embed_url}
                      title={item.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : item.cover_image ? (
                  <div className="relative h-80 md:h-[28rem] w-full bg-gray-900 overflow-hidden">
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                ) : null}

                {/* Article Body Container */}
                <div className="detail-content-section p-8 md:p-12">
                  {/* Highlight Callout */}
                  {item.excerpt && (
                    <div className="p-6 mb-8 rounded-2xl bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-transparent border-l-4 border-teal-500 text-gray-800 text-base md:text-lg font-medium italic leading-relaxed">
                      "{item.excerpt}"
                    </div>
                  )}

                  {/* Body Text */}
                  <div className="prose prose-lg prose-teal max-w-none text-gray-800 leading-relaxed font-sans space-y-6">
                    {item.body ? (
                      <div dangerouslySetInnerHTML={{ __html: item.body.replace(/\n/g, '<br/><br/>') }} />
                    ) : (
                      <p>
                        Full coverage and climate attribution documentation published by WenClims. This research report addresses climate impacts, hydrological forecasting, and regional resilience.
                      </p>
                    )}
                  </div>

                  {/* External Source Action Box */}
                  {item.external_url && (
                    <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-teal-500/30">
                      <div>
                        <h4 className="text-lg font-bold text-teal-300 mb-1">Watch / Read External Source</h4>
                        <p className="text-xs text-white/70">Access the full broadcast or press release directly at the origin outlet.</p>
                      </div>
                      <a
                        href={item.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-300 text-gray-900 font-extrabold px-6 py-3 rounded-xl transition-all shadow-md text-sm shrink-0"
                      >
                        <span>Open Source Link</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  {/* Share & Tags Bar */}
                  <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Tags:</span>
                      {Array.isArray(item.tags)
                        ? item.tags.map((t: string, i: number) => (
                            <span
                              key={i}
                              className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-lg border border-gray-200"
                            >
                              #{t}
                            </span>
                          ))
                        : (
                            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-lg border border-gray-200">
                              #ClimateAttribution
                            </span>
                          )}
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Page URL copied to clipboard!');
                      }}
                      className="inline-flex items-center gap-2 bg-gray-100 hover:bg-teal-50 text-gray-700 hover:text-teal-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border border-gray-200"
                    >
                      <Share2 className="w-4 h-4 text-teal-600" />
                      <span>Share This Media</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (3 Cols): Sidebar Info & Related Media */}
            <div className="lg:col-span-3 space-y-6">
              {/* Author & Info Card */}
              <div className="detail-sidebar-card bg-white rounded-3xl p-6 shadow-xl border border-gray-200/80">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-teal-600 text-teal-300 font-extrabold text-xl flex items-center justify-center shadow-md">
                    {item.author_name ? item.author_name[0] : 'W'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.author_name || 'WenClims Media'}</h3>
                    <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider mt-0.5">Climate Research &amp; Media</p>
                  </div>
                </div>

                <div className="space-y-3.5 border-t border-gray-100 pt-5 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Category:</span>
                    <span className="font-bold text-gray-900 uppercase text-xs bg-gray-100 px-2.5 py-1 rounded-md">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Status:</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Published
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Video Embed:</span>
                    <span className="font-bold text-gray-900 text-xs">
                      {item.embed_url ? 'Available (YouTube)' : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Media Card */}
              {recentItems.length > 0 && (
                <div className="detail-sidebar-card bg-white rounded-3xl p-6 shadow-xl border border-gray-200/80">
                  <h3 className="font-heading font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                    <Tv className="w-5 h-5 text-teal-600" />
                    <span>More Climate Media</span>
                  </h3>

                  <div className="space-y-4">
                    {recentItems.map((rec) => (
                      <Link
                        key={rec.id}
                        to={`/media/item/${rec.id}`}
                        className="group flex gap-3.5 p-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                      >
                        <div className="w-20 h-16 rounded-lg bg-gray-900 overflow-hidden shrink-0">
                          <img
                            src={rec.cover_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80'}
                            alt={rec.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 block mb-0.5">
                            {rec.type}
                          </span>
                          <h4 className="text-xs font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
                            {rec.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Link
                    to="/media"
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gray-50 hover:bg-teal-50 text-teal-700 font-bold text-xs py-3 rounded-xl transition-all border border-gray-200"
                  >
                    <span>View All Media Articles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaDetailPage;
