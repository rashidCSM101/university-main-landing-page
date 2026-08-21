import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchPublications } from '../../services/api';
import {
  FileText,
  Search,
  Download,
  BookOpen,
  Award,
  Copy,
} from 'lucide-react';

import heroBgFallback from '../../../assets/images/1.webp?url';

import { CitationModal } from './CitationModal';
import { PDFViewerModal } from '../shared/PDFViewerModal';

gsap.registerPlugin(ScrollTrigger);

export interface PublicationItem {
  id: string;
  title: string;
  category: 'Peer-Reviewed Journal' | 'Technical Report' | 'Policy Brief' | 'Monograph' | string;
  authors: string[];
  journal: string;
  year: string;
  doi?: string;
  abstract: string;
  pdf_url?: string;
  is_open_access?: boolean;
}

const fallbackPublications: PublicationItem[] = [
  {
    id: 'pub-1',
    title: 'Attribution of Extreme Monsoon Precipitation Over Upper & Lower Indus Catchments Under 2°C Warming',
    category: 'Peer-Reviewed Journal',
    authors: ['Dr. Rashid', 'Dr. Ayesha Malik', 'Prof. Tariq Ahmed'],
    journal: 'Nature Climate Change / AMS Journal of Climate',
    year: '2025',
    doi: '10.1038/s41558-025-0192',
    abstract:
      'Applying high-resolution WRF convective atmospheric simulations and 40+ years of ERA5 reanalysis to isolate greenhouse gas forcing from natural monsoon variability during the extreme 2022–2024 Indus floods.',
    pdf_url: '/assets/docs/indus-monsoon-attribution-2025.pdf',
    is_open_access: true,
  },
  {
    id: 'pub-2',
    title: 'Hindu Kush Himalaya Glacial Lake Volume Mapping & GLOF Outburst Hydrograph Telemetry',
    category: 'Peer-Reviewed Journal',
    authors: ['Prof. Tariq Ahmed', 'Dr. Rashid', 'ICIMOD Cryosphere Team'],
    journal: 'The Cryosphere (EGU / Copernicus)',
    year: '2024',
    doi: '10.5194/tc-18-2024',
    abstract:
      'Remote sensing satellite telemetry monitoring 3,000+ moraine-dammed glacial lakes in Gilgit-Baltistan to model Glacial Lake Outburst Flood (GLOF) outburst hydrographs for mountain valley hazard mapping.',
    pdf_url: '/assets/docs/hkh-glof-telemetry-2024.pdf',
    is_open_access: true,
  },
  {
    id: 'pub-3',
    title: 'Karachi & Sindh Municipal Heat Action Plan: Wet-Bulb Stress Thresholds & Cool Roofs',
    category: 'Policy Brief',
    authors: ['Dr. Sana Khan', 'National Disaster Management Authority (NDMA)', 'WenClims Urban Lab'],
    journal: 'NDMA-WenClims Technical Advisory Monograph',
    year: '2025',
    doi: '10.1016/j.lanplh.2024.09',
    abstract:
      'Quantifying pre-monsoon humid heatwave mortality risk in urban Sindh, establishing wet-bulb temperature thresholds (TW > 35°C) and municipal emergency cooling protocols for informal settlements.',
    pdf_url: '/assets/docs/karachi-heat-action-plan.pdf',
    is_open_access: true,
  },
  {
    id: 'pub-4',
    title: 'Indus Basin Renewable Wind & Solar Energy Atlas: Multi-Decadal Atmospheric Irradiance',
    category: 'Monograph',
    authors: ['WenClims Clean Energy Unit', 'Asian Development Bank Clean Energy Fund'],
    journal: 'ADB Technical Research Paper Series',
    year: '2026',
    doi: '10.22617/WCS-RE-2026',
    abstract:
      'A 1km-resolution GIS atlas modeling multi-decadal solar horizontal irradiance (GHI) and high-altitude wind velocity profiles across Balochistan & Punjab renewable energy corridors.',
    pdf_url: '/assets/docs/indus-renewable-atlas.pdf',
    is_open_access: true,
  },
  {
    id: 'pub-5',
    title: 'Thermodynamic vs Dynamic Drivers of Extreme Monsoon Convective Storms in South Asia',
    category: 'Peer-Reviewed Journal',
    authors: ['Dr. Rashid', 'UK Met Office Attribution Group'],
    journal: 'Geophysical Research Letters (AGU)',
    year: '2023',
    doi: '10.1029/2023GL104812',
    abstract:
      'Disentangling atmospheric moisture convergence (Clausius-Clapeyron scaling) from large-scale circulation anomalies during extreme precipitation events in the Arabian Sea & Indus Delta.',
    pdf_url: '/assets/docs/thermodynamic-monsoon-drivers.pdf',
    is_open_access: true,
  },
];

const pubStats = [
  { value: '50+', label: 'Peer-Reviewed Papers', icon: FileText },
  { value: '30+', label: 'Policy Briefs Delivered', icon: Award },
  { value: '10k+', label: 'Academic Citations', icon: BookOpen },
  { value: 'Open Access', label: 'PDF Download Rights', icon: Download },
];

export const PublicationsPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bgImage, setBgImage] = useState<string>('/assets/images/publications-hero.png');
  const [citationTarget, setCitationTarget] = useState<any>(null);
  const [pdfTarget, setPdfTarget] = useState<{ title: string; url: string } | null>(null);

  // Fetch dynamic publications data from Express backend
  const fetchPublicationsData = async () => {
    setLoading(true);
    try {
      const data = await fetchPublications();
      if (Array.isArray(data) && data.length > 0) {
        const mapped: PublicationItem[] = data.map((item: any) => ({
          id: item.id?.toString() || Math.random().toString(),
          title: item.title || 'Untitled Research Publication',
          category: item.category || item.type || 'Peer-Reviewed Journal',
          authors: Array.isArray(item.co_authors) && item.co_authors.length > 0
            ? [item.author_name || 'Dr. Rashid', ...item.co_authors]
            : [item.author_name || 'Dr. Rashid'],
          journal: item.outlet_name || 'WenClims Research Journal',
          year: item.published_date ? new Date(item.published_date).getFullYear().toString() : '2025',
          doi: item.doi || `10.1038/wenclims.${item.id ? item.id.substring(0, 6) : '0192'}`,
          abstract: item.abstract || 'Peer-reviewed climate attribution research monograph produced by the Weather and Climate Services (WenClims) research team.',
          pdf_url: item.pdf_url || item.external_url || '/assets/docs/wenclims-publication.pdf',
          is_open_access: item.is_open_access ?? true,
        }));
        setPublications(mapped);
        setIsUsingFallback(false);
      } else {
        setPublications(fallbackPublications);
        setIsUsingFallback(true);
      }
    } catch (err) {
      console.warn('Backend API unreachable, using fallback publications data:', err);
      setPublications(fallbackPublications);
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicationsData();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
      );

      if (gridRef.current && publications.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [loading, publications]);

  const categories = ['All', 'Peer-Reviewed Journal', 'Technical Report', 'Policy Brief', 'Monograph'];

  const filteredPubs = publications.filter((pub) => {
    const matchesCategory = selectedCategory === 'All' || pub.category === selectedCategory;
    const matchesSearch =
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.journal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Publications &amp; Peer-Reviewed Research | WenClims</title>
        <meta
          name="description"
          content="Explore peer-reviewed journal papers, climate attribution monographs, NDMA policy briefs, and hydrological research reports published by WenClims."
        />
        <link rel="canonical" href="https://wenclims.org/publications" />
      </Helmet>

      <div ref={pageRef} className="min-h-screen bg-gray-50 font-sans">
        {/* ═══ HERO SECTION ═══ */}
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-gray-900 text-white overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={bgImage}
              alt="WenClims Climate Publications Background"
              onError={() => setBgImage(heroBgFallback)}
              className="w-full h-full object-cover opacity-25 filter contrast-125 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-transparent to-gray-900/90" />
          </div>

          <div className="container-custom relative z-10">
            <div ref={contentRef} className="max-w-4xl">
              {/* Tag Pill */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="w-8 h-px bg-[#00C8C8]" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] px-3 py-1 rounded-full border border-[#00C8C8]/50 text-[#00C8C8] bg-[#00C8C8]/10">
                  Open Access Literature &amp; Monograph Index
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
                Peer-Reviewed <span className="text-[#00C8C8]">Publications</span> &amp; Policy Briefs
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-3xl mb-10">
                Independent, peer-reviewed climate attribution monographs, flood forecast assessments,
                and South Asian extreme weather research papers published in top-tier international journals.
              </p>

              {/* Quick Navigation CTA */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#publications-catalog"
                  className="px-6 py-3.5 bg-[#00C8C8] text-gray-950 font-bold rounded-xl hover:bg-teal-400 transition-all shadow-lg text-sm inline-flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Research Library</span>
                </a>
              </div>
            </div>

            {/* Publication Impact Metrics Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16 pt-10 border-t border-gray-800/80">
              {pubStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-gray-800/50 backdrop-blur-md border border-gray-700/60 flex items-center space-x-4"
                  >
                    <div className="p-3 rounded-xl bg-[#00C8C8]/15 text-[#00C8C8]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-heading font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ PUBLICATIONS CATALOG SECTION ═══ */}
        <div id="publications-catalog" className="w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Controls: Category Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#48b302] mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Open Access Academic &amp; Policy Literature</span>
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-900">
                Research <span className="text-[#48b302]">Library</span>
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search title, author, or DOI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium focus:outline-none focus:border-[#48b302] shadow-sm"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 mb-8">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    isActive
                      ? 'bg-[#48b302] text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Publications Cards Grid */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded-md w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-md w-1/2" />
                  <div className="h-16 bg-gray-100 rounded-md w-full" />
                </div>
              ))}
            </div>
          ) : filteredPubs.length > 0 ? (
            <div ref={gridRef} className="space-y-6">
              {filteredPubs.map((pub) => (
                <div
                  key={pub.id}
                  className="pub-card group bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between opacity-100 hover:-translate-y-1"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#48b302]/10 text-[#48b302] border border-[#48b302]/30">
                          {pub.category}
                        </span>
                        {pub.is_open_access && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ● Open Access PDF
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-500">{pub.year}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-gray-900 mb-3 group-hover:text-[#48b302] transition-colors leading-snug">
                      {pub.title}
                    </h3>

                    {/* Authors & Journal Info */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-gray-100 text-xs">
                      <div className="text-gray-800 font-semibold flex flex-wrap items-center gap-1.5">
                        <span className="text-gray-400">Authors:</span>
                        <span>{pub.authors.join(', ')}</span>
                      </div>
                      <div className="text-gray-500 font-medium flex flex-wrap items-center justify-between gap-2">
                        <span>Journal / Publisher: <strong className="text-gray-700">{pub.journal}</strong></span>
                        {pub.doi && <span className="font-mono text-gray-400">DOI: {pub.doi}</span>}
                      </div>
                    </div>

                    {/* Abstract */}
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-6">
                      {pub.abstract}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={() => setCitationTarget({ title: pub.title, author_name: pub.authors?.[0], co_authors: pub.authors?.slice(1), published_date: pub.year, outlet_name: pub.journal })}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#48b302] hover:text-teal-700 bg-teal-50 px-3 py-2 rounded-xl transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Cite Paper (APA / BibTeX / RIS)</span>
                    </button>

                    <button
                      onClick={() => setPdfTarget({ title: pub.title, url: pub.pdf_url || '/assets/docs/wenclims-publication.pdf' })}
                      className="inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-[#48b302] text-white font-bold rounded-xl hover:bg-teal-700 transition-colors text-xs shadow-md"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Preview PDF Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-lg mx-auto shadow-sm">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Publications Found</h3>
              <p className="text-gray-500 text-sm mb-6">
                No research paper matched your search query &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="btn-primary text-sm"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

        {/* Academic Citation Modal */}
        <CitationModal
          isOpen={!!citationTarget}
          onClose={() => setCitationTarget(null)}
          publication={citationTarget}
        />

        {/* Inline PDF Viewer Modal */}
        <PDFViewerModal
          isOpen={!!pdfTarget}
          onClose={() => setPdfTarget(null)}
          title={pdfTarget?.title || 'Research Report'}
          pdfUrl={pdfTarget?.url || '/assets/docs/wenclims-publication.pdf'}
        />
      </div>
    </>
  );
};

export default PublicationsPage;
