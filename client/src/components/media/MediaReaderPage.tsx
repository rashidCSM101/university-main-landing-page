import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import {
  ArrowLeft,
  Calendar,
  Tag,
  Sparkles,
  CheckCircle2,
  Clock,
  Share2,
  Check,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { fetchMediaItems, fetchMediaItemBySlug } from '../../services/api';

export const MediaReaderPage = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const [item, setItem] = useState<any>(null);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);

  // Scroll reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPercent = (totalScroll / windowHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, scrollPercent)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const identifier = id || slug;
    setLoading(true);

    const fallbackDefault = {
      id: identifier || 'default',
      title: 'Heatwave Attribution and Climate Impact in South Asia 2025',
      slug: 'heatwave-attribution-south-asia-2025',
      type: 'blog',
      body: 'Comprehensive attribution analysis of extreme regional weather systems, heat dome formations, and hydrological precipitation shifts across South Asia.\n\nRecent observational telemetry across the Indus Basin indicates a compounding interplay between elevated sea-surface temperature anomalies and continental anticyclonic subsidence. Our WRF convective ensembles demonstrate that anthropogenic forcing has increased the probability of threshold-exceeding wet-bulb heat extremes by approximately 3.2-fold relative to pre-industrial baselines.\n\nMulti-scenario spatial mapping reveals heightened exposure across agricultural and high-density urban corridors, reinforcing the urgent imperative for integrated early warning telemetry and localized climate resilience frameworks.\n\nIn tandem with predictive regional modeling, localized adaptation mechanisms must incorporate multi-hazard mitigation protocols to shield vulnerable agricultural livelihoods and critical public infrastructure.',
      excerpt: 'Attribution modeling and regional weather analysis by WenClims climate research group.',
      author_name: 'Dr. Rashid',
      published_at: new Date().toISOString(),
      cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      tags: ['Climate Change', 'Attribution Science', 'South Asia', 'Heatwave Telemetry'],
    };

    if (!identifier) {
      setItem(fallbackDefault);
      setLoading(false);
      return;
    }

    fetchMediaItemBySlug(identifier)
      .then((singleData) => {
        if (singleData && singleData.id) {
          setItem(singleData);
          setLoading(false);
          fetchMediaItems()
            .then((list) => {
              if (Array.isArray(list)) {
                setRecentItems(list.filter((m) => String(m.id) !== identifier && m.slug !== identifier).slice(0, 3));
              }
            })
            .catch(() => {});
        } else {
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
      gsap.fromTo(
        '.anim-article-card',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [item]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#48b302] border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600 font-medium text-sm">Loading research article...</span>
        </div>
      </div>
    );
  }

  const publishedDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'August 2025';

  const paragraphs = item.body ? item.body.split('\n\n') : [];

  return (
    <div ref={pageRef} className="min-h-screen bg-slate-50 font-sans text-gray-900 pt-28 md:pt-36 pb-24 relative selection:bg-[#48b302] selection:text-gray-950">
      <Helmet>
        <title>{`${item.title} | WenClims Research & Insights`}</title>
        <meta name="description" content={item.excerpt || item.title} />
      </Helmet>

      {/* ── Fixed Reading Progress Bar at Top ── */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-200 z-[100]">
        <div
          className="h-full bg-gradient-to-r from-[#48b302] to-emerald-400 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-[76rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* ── Top Breadcrumbs & Back Action ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/media"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-gray-950 hover:border-[#48b302] hover:shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#48b302]" />
            <span>Back to Media Hub</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>Media</span>
            <ChevronRight className="w-3 h-3" />
            <span className="capitalize">{item.type || 'Blog'}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{item.title}</span>
          </div>
        </div>

        {/* ── Full-Size Magazine Article Card ── */}
        <article className="anim-article-card bg-white rounded-3xl p-8 md:p-14 border border-gray-200/90 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#48b302] via-emerald-400 to-teal-500" />

          {/* ── 1. Full-Width Top Header & Metadata ── */}
          <div className="space-y-6 pb-8 border-b border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#48b302]/10 border border-[#48b302]/30 text-[#48b302] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{item.type || 'Research Article'}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#48b302]" />
                  {publishedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#48b302]" />
                  5 min read
                </span>
              </div>
            </div>

            {/* Main Full-Size Headline */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold text-gray-950 leading-tight tracking-tight">
              {item.title}
            </h1>

            {/* Author Strip & Share Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#48b302]/20 to-teal-50 border border-[#48b302]/30 flex items-center justify-center text-[#48b302] font-black text-lg shadow-inner">
                  {item.author_name ? item.author_name.charAt(0) : 'W'}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-950 flex flex-wrap items-center gap-1.5">
                    <span>{item.author_name || 'Dr. Rashid'}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#48b302] fill-[#48b302]/15" />
                    {item.co_authors && item.co_authors.length > 0 && (
                      <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                        with {item.co_authors.join(', ')}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Weather &amp; Climate Services Scientific Research Group
                  </div>
                </div>
              </div>

              {/* Share Link Button */}
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-800 text-xs font-bold transition-all"
                title="Share Article"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#48b302]" />
                    <span className="text-[#48b302]">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-gray-600" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── 2. Magazine Content Area with Right-Floating Media ── */}
          <div className="pt-8 flow-root">
            
            {/* Right-Floated Featured Image / Video */}
            {(item.embed_url || item.cover_image) && (
              <div className="w-full md:w-[45%] md:float-right md:ml-10 mb-8 mt-1 rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-slate-100">
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
                ) : (
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 right-3 px-2.5 py-1 rounded-md bg-gray-950/75 backdrop-blur-md text-white text-[10px] font-medium">
                      Satellite Telemetry &amp; Informatics
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Highlight Excerpt (Wraps on Left) */}
            {item.excerpt && (
              <div className="bg-emerald-50/70 border-l-4 border-[#48b302] p-5 md:p-6 rounded-r-2xl mb-6">
                <p className="text-base md:text-lg text-gray-900 font-serif italic leading-relaxed">
                  &ldquo;{item.excerpt}&rdquo;
                </p>
              </div>
            )}

            {/* Article Paragraphs (Wraps around image, then expands full width) */}
            <div className="text-gray-800 text-base md:text-lg leading-relaxed space-y-6 font-normal">
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph: string, idx: number) => (
                  <p
                    key={idx}
                    className={
                      idx === 0
                        ? 'text-lg md:text-xl font-medium text-gray-950 leading-relaxed'
                        : 'leading-relaxed'
                    }
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>No detailed body content available for this media item.</p>
              )}
            </div>

            {/* Clear Floats */}
            <div className="clear-both" />

            {/* ── 3. Tags Section ── */}
            {Array.isArray(item.tags) && item.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mr-2">
                  <Tag className="w-3.5 h-3.5 text-[#48b302]" />
                  <span>Focus Tags:</span>
                </span>
                {item.tags.map((t: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#48b302]/15 text-gray-800 hover:text-[#48b302] border border-slate-200 transition-colors"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

          </div>
        </article>

        {/* ── Related Insights Section (Clean 3-Card Grid at Bottom) ── */}
        {recentItems.length > 0 && (
          <section className="space-y-6 pt-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#48b302]/15 text-[#48b302] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-heading font-extrabold text-gray-950">
                Related Research &amp; Insights
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {recentItems.map((rec) => (
                <Link
                  key={rec.id}
                  to={`/media/blogs/${rec.slug || rec.id}`}
                  className="group block p-6 rounded-3xl bg-white border border-gray-200/90 hover:border-[#48b302] hover:shadow-xl transition-all"
                >
                  <div className="text-xs text-[#48b302] font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>{rec.type || 'Blog'}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 group-hover:text-[#48b302] line-clamp-2 leading-snug transition-colors">
                    {rec.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Bottom Research CTA ── */}
        <div className="bg-gradient-to-r from-gray-950 via-[#071328] to-gray-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#48b302]">WCS Research Lab</span>
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-white">Have questions about this attribution model?</h3>
            <p className="text-sm text-gray-300 font-light">Connect directly with our climate science and modeling team.</p>
          </div>

          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-2xl bg-[#48b302] hover:bg-[#3ea002] text-gray-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 flex-shrink-0"
          >
            <span>Consult Our Experts</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default MediaReaderPage;
