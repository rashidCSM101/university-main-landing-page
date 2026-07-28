import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  Sparkles,
  Bell,
  Calendar,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Pin,
  Clock,
  Download,
  Search,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Notice {
  id: number;
  title: string;
  date: string;
  category: 'General' | 'Exam' | 'Date Sheet' | 'Circular' | 'Holiday' | 'Result';
  priority: 'normal' | 'important' | 'urgent';
  content: string;
  attachment?: string;
}

const notices: Notice[] = [
  {
    id: 1,
    title: 'Severe Convective Storm & Microburst Advisory: Sector North',
    date: 'July 28, 2026',
    category: 'Circular',
    priority: 'urgent',
    content: 'Doppler Radar Station 4 has detected convective cell development with wind gusts up to 75 km/h and localized hail. Outdoor maritime and aviation activities should be suspended immediately.',
    attachment: 'radar-bulletin-sector-north.pdf',
  },
  {
    id: 2,
    title: 'Heatwave & High UV Index Alert (Category 4)',
    date: 'July 27, 2026',
    category: 'Exam',
    priority: 'important',
    content: 'Extreme solar radiation advisory issued for the southern plains. Peak temperatures expected to reach 44.5°C between 12:00 PM and 4:00 PM. Hydration advisories active for agricultural workers.',
  },
  {
    id: 3,
    title: 'Monsoon Rainfall & Urban Flood Early Warning',
    date: 'July 25, 2026',
    category: 'Date Sheet',
    priority: 'urgent',
    content: 'Precipitation model forecasts heavy rainfall accumulation exceeding 120mm over 24 hours. Low-lying river basins are on high alert for flash runoff.',
    attachment: 'flood-advisory-map-2026.pdf',
  },
  {
    id: 4,
    title: 'Agricultural Soil Moisture & Crop Irrigation Bulletin',
    date: 'July 22, 2026',
    category: 'General',
    priority: 'normal',
    content: 'Soil telemetry indicates optimal moisture levels for cotton and rice sowing in District West. Supplemental irrigation can be deferred by 3 days.',
  },
  {
    id: 5,
    title: 'Aviation Turbulence & Crosswind Schedule Update',
    date: 'July 20, 2026',
    category: 'Result',
    priority: 'important',
    content: 'Low-level wind shear telemetry reported near Airport Runway 18L. Pilots are advised to monitor real-time wind shear alerts.',
  },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  General: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Exam: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Date Sheet': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Circular: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Holiday: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  Result: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
};

const priorityStyles: Record<string, { dot: string; bar: string }> = {
  normal: { dot: 'bg-gray-400', bar: 'bg-gray-200' },
  important: { dot: 'bg-amber-500', bar: 'bg-amber-400' },
  urgent: { dot: 'bg-red-500 animate-pulse', bar: 'bg-red-500' },
};

const categories = ['All', 'General', 'Exam', 'Date Sheet', 'Circular', 'Holiday', 'Result'];

const NoticeBoard = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.notice-hero-content', { y: 40, duration: 0.8, ease: 'power3.out', delay: 0.2 });
      gsap.from('.notice-item', {
        y: 25, duration: 0.4, stagger: 0.06, ease: 'power2.out',
        scrollTrigger: { trigger: '.notices-list', start: 'top 85%' },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const filtered = notices.filter(n => {
    const matchesCat = filter === 'All' || n.category === filter;
    const matchesSearch = search === '' || n.title.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Weather Bulletins & Severe Alerts | WCS Portal</title>
        <meta name="description" content="View live Doppler weather bulletins, storm warnings, heatwave alerts, and climate advisories from Weather & Climate Services." />
        <link rel="canonical" href="https://wcs-weather.org/noticeboard" />
      </Helmet>
      <div ref={pageRef} className="min-h-screen bg-slate-50">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-primary via-primary-light to-secondary pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-sky rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="container-custom relative z-10">
            <div className="notice-hero-content">
            <Link to="/" className="inline-flex items-center gap-2 text-sky-200 hover:text-white transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-amber" />
              <span className="text-white/90 font-medium text-sm">Emergency & Advisory Desk</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
              Weather <span className="text-sky">Bulletins & Alerts</span>
            </h1>
            <p className="text-lg text-slate-200 max-w-2xl">
              Stay updated with live meteorological notifications, severe convective warnings, heatwave alerts, and monsoon early advisories.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container-custom -mt-14 relative z-20">
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { icon: Bell, label: 'Total Notices', value: notices.length, gradient: 'from-primary to-rose-600' },
            { icon: AlertCircle, label: 'Urgent', value: notices.filter(n => n.priority === 'urgent').length, gradient: 'from-red-500 to-red-600' },
            { icon: FileText, label: 'Date Sheets', value: notices.filter(n => n.category === 'Date Sheet').length, gradient: 'from-purple-500 to-indigo-600' },
            { icon: Calendar, label: 'Exam Related', value: notices.filter(n => n.category === 'Exam').length, gradient: 'from-amber-500 to-orange-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="container-custom pt-12 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search notices..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === cat ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/30 hover:text-primary'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="container-custom pb-20">
        <div className="notices-list space-y-3 max-w-4xl">
          {filtered.map(notice => {
            const catStyle = categoryColors[notice.category];
            const priStyle = priorityStyles[notice.priority];
            const isOpen = expanded === notice.id;
            return (
              <div key={notice.id}
                className={`notice-item bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer ${notice.priority === 'urgent' ? 'ring-1 ring-red-200' : ''}`}
                onClick={() => setExpanded(isOpen ? null : notice.id)}>
                {/* Priority bar */}
                <div className={`h-1 ${priStyle.bar}`} />
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Priority indicator */}
                    <div className="mt-1.5 flex-shrink-0">
                      {notice.priority === 'urgent' && <Pin className="w-4 h-4 text-red-500" />}
                      {notice.priority === 'important' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                      {notice.priority === 'normal' && <FileText className="w-4 h-4 text-gray-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                          {notice.category}
                        </span>
                        {notice.priority !== 'normal' && (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${notice.priority === 'urgent' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${priStyle.dot}`} />
                            {notice.priority}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {notice.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug">{notice.title}</h3>

                      {/* Expanded content */}
                      {isOpen && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600 leading-relaxed">{notice.content}</p>
                          {notice.attachment && (
                            <span className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-gray-400 cursor-not-allowed"
                              title="Attachment not yet available">
                              <Download className="w-4 h-4" />
                              <span>{notice.attachment}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <button className="flex-shrink-0 mt-1">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Notices Found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default NoticeBoard;
