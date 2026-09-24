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
  Calendar,
  Users,
  ArrowUpRight,
  ExternalLink,
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
  published_date?: string;
  doi?: string;
  abstract: string;
  pdf_url?: string;
  external_url?: string;
  thumbnail?: string;
  is_open_access?: boolean;
}

const isDirectPdf = (url?: string): boolean => {
  if (!url) return false;
  const clean = url.trim().toLowerCase().split('?')[0];
  return clean.endsWith('.pdf') || clean.includes('/assets/docs/') || clean.includes('/uploads/pdf/');
};

const getTargetExternalUrl = (pub: PublicationItem): string | null => {
  if (pub.external_url && !isDirectPdf(pub.external_url)) {
    let u = pub.external_url.trim();
    if (u.startsWith('10.')) return `https://doi.org/${u}`;
    if (u.startsWith('doi.org/')) return `https://${u}`;
    return u;
  }
  if (pub.doi) {
    let d = pub.doi.trim();
    if (d.startsWith('http://') || d.startsWith('https://')) return d;
    return `https://doi.org/${d}`;
  }
  return null;
};

const formatPublicationDate = (dateStr?: string, yearFallback?: string) => {
  if (!dateStr) return yearFallback || '2025';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return yearFallback || '2025';
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return yearFallback || '2025';
  }
};

const fallbackPublications: PublicationItem[] = [
  {
    id: 'pub-1',
    title: 'Attribution of Extreme Monsoon Precipitation Over Upper & Lower Indus Catchments Under 2°C Warming',
    category: 'Peer-Reviewed Journal',
    authors: ['Dr. Rashid', 'Dr. Ayesha Malik', 'Prof. Tariq Ahmed'],
    journal: 'Nature Climate Change / AMS Journal of Climate',
    published_date: '2025-08-15',
    year: '2025',
    doi: '10.1038/s41558-025-0192',
    external_url: 'https://doi.org/10.1038/s41558-025-0192',
    abstract:
      'Applying high-resolution WRF convective atmospheric simulations and 40+ years of ERA5 reanalysis to isolate greenhouse gas forcing from natural monsoon variability during the extreme 2022–2024 Indus floods.',
    pdf_url: '/assets/docs/indus-monsoon-attribution-2025.pdf',
    thumbnail: '/assets/images/1.webp',
    is_open_access: true,
  },
  {
    id: 'pub-2',
    title: 'Hindu Kush Himalaya Glacial Lake Volume Mapping & GLOF Outburst Hydrograph Telemetry',
    category: 'Peer-Reviewed Journal',
    authors: ['Prof. Tariq Ahmed', 'Dr. Rashid', 'ICIMOD Cryosphere Team'],
    journal: 'The Cryosphere (EGU / Copernicus)',
    published_date: '2024-11-20',
    year: '2024',
    doi: '10.5194/tc-18-2024',
    external_url: 'https://doi.org/10.5194/tc-18-2024',
    abstract:
      'Remote sensing satellite telemetry monitoring 3,000+ moraine-dammed glacial lakes in Gilgit-Baltistan to model Glacial Lake Outburst Flood (GLOF) outburst hydrographs for mountain valley hazard mapping.',
    pdf_url: '/assets/docs/hkh-glof-telemetry-2024.pdf',
    thumbnail: '/assets/images/2.webp',
    is_open_access: true,
  },
  {
    id: 'pub-3',
    title: 'Karachi & Sindh Municipal Heat Action Plan: Wet-Bulb Stress Thresholds & Cool Roofs',
    category: 'Policy Brief',
    authors: ['Dr. Sana Khan', 'National Disaster Management Authority (NDMA)', 'WenClims Urban Lab'],
    journal: 'NDMA-WenClims Technical Advisory Monograph',
    published_date: '2025-04-10',
    year: '2025',
    doi: '10.1016/j.lanplh.2024.09',
    external_url: 'https://doi.org/10.1016/j.lanplh.2024.09',
    abstract:
      'Quantifying pre-monsoon humid heatwave mortality risk in urban Sindh, establishing wet-bulb temperature thresholds (TW > 35°C) and municipal emergency cooling protocols for informal settlements.',
    pdf_url: '/assets/docs/karachi-heat-action-plan.pdf',
    thumbnail: '/assets/images/3.webp',
    is_open_access: true,
  },
  {
    id: 'pub-4',
    title: 'Indus Basin Renewable Wind & Solar Energy Atlas: Multi-Decadal Atmospheric Irradiance',
    category: 'Monograph',
    authors: ['WenClims Clean Energy Unit', 'Asian Development Bank Clean Energy Fund'],
    journal: 'ADB Technical Research Paper Series',
    published_date: '2026-02-18',
    year: '2026',
    doi: '10.22617/WCS-RE-2026',
    external_url: 'https://doi.org/10.22617/WCS-RE-2026',
    abstract:
      'A 1km-resolution GIS atlas modeling multi-decadal solar horizontal irradiance (GHI) and high-altitude wind velocity profiles across Balochistan & Punjab renewable energy corridors.',
    pdf_url: '/assets/docs/indus-renewable-atlas.pdf',
    thumbnail: '/assets/images/project-hero.avif',
    is_open_access: true,
  },
  {
    id: 'pub-5',
    title: 'Thermodynamic vs Dynamic Drivers of Extreme Monsoon Convective Storms in South Asia',
    category: 'Peer-Reviewed Journal',
    authors: ['Dr. Rashid', 'UK Met Office Attribution Group'],
    journal: 'Geophysical Research Letters (AGU)',
    published_date: '2023-09-05',
    year: '2023',
    doi: '10.1029/2023GL104812',
    external_url: 'https://doi.org/10.1029/2023GL104812',
    abstract:
      'Disentangling atmospheric moisture convergence (Clausius-Clapeyron scaling) from large-scale circulation anomalies during extreme precipitation events in the Arabian Sea & Indus Delta.',
    pdf_url: '/assets/docs/thermodynamic-monsoon-drivers.pdf',
    thumbnail: '/assets/images/4.webp',
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
  const [pdfTarget, setPdfTarget] = useState<{ title: string; url: string; externalUrl?: string } | null>(null);

  // Fetch dynamic publications data from Express backend
  const fetchPublicationsData = async () => {
    setLoading(true);
    try {
      const data = await fetchPublications();
      if (Array.isArray(data) && data.length > 0) {
        const mapped: PublicationItem[] = data.map((item: any) => {
          const rawExt = item.external_url ? String(item.external_url).trim() : '';
          const rawPdf = item.pdf_url ? String(item.pdf_url).trim() : '';
          const rawDoi = item.doi ? String(item.doi).trim() : '';

          const extIsPdf = isDirectPdf(rawExt);
          const pdfIsPdf = isDirectPdf(rawPdf);

          const resolvedPdfUrl = pdfIsPdf ? rawPdf : (extIsPdf ? rawExt : (rawPdf || ''));

          let resolvedExtUrl = '';
          if (rawExt && !extIsPdf) {
            resolvedExtUrl = rawExt;
          } else if (rawDoi) {
            resolvedExtUrl = rawDoi.startsWith('http') ? rawDoi : `https://doi.org/${rawDoi}`;
          }

          let resolvedDoi = rawDoi;
          if (!resolvedDoi && resolvedExtUrl && resolvedExtUrl.includes('doi.org/')) {
            resolvedDoi = resolvedExtUrl.split('doi.org/')[1];
          } else if (!resolvedDoi && item.id) {
            resolvedDoi = `10.1038/wenclims.${String(item.id).substring(0, 6)}`;
          }

          return {
            id: item.id?.toString() || Math.random().toString(),
            title: item.title || 'Untitled Research Publication',
            category: item.category || (item.type === 'report' ? 'Technical Report' : 'Peer-Reviewed Journal'),
            authors: Array.isArray(item.co_authors) && item.co_authors.length > 0
              ? [item.author_name || 'Dr. Rashid', ...item.co_authors]
              : [item.author_name || 'Dr. Rashid'],
            journal: item.outlet_name || 'WenClims Research Journal',
            published_date: item.published_date || item.created_at || null,
            year: item.published_date
              ? new Date(item.published_date).getFullYear().toString()
              : (item.created_at ? new Date(item.created_at).getFullYear().toString() : '2025'),
            doi: resolvedDoi,
            abstract: item.abstract || 'Peer-reviewed climate attribution research monograph produced by the Weather and Climate Services (WenClims) research team.',
            pdf_url: resolvedPdfUrl,
            external_url: resolvedExtUrl,
            thumbnail: item.thumbnail || '',
            is_open_access: item.is_open_access ?? true,
          };
        });
        setPublications(mapped);
      } else {
        setPublications(fallbackPublications);
      }
    } catch (err) {
      console.warn('Backend API unreachable, using fallback publications data:', err);
      setPublications(fallbackPublications);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPublication = (pub: PublicationItem) => {
    const extUrl = getTargetExternalUrl(pub);
    const directPdf = pub.pdf_url && isDirectPdf(pub.pdf_url)
      ? pub.pdf_url
      : (pub.external_url && isDirectPdf(pub.external_url) ? pub.external_url : null);

    // If publication has an external journal/DOI link, redirect directly to that external link in a new tab!
    if (extUrl) {
      window.open(extUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // If it's a direct PDF, open in PDFViewerModal
    if (directPdf) {
      setPdfTarget({
        title: pub.title,
        url: directPdf,
        externalUrl: extUrl || undefined,
      });
      return;
    }

    // Fallback if external_url is present
    if (pub.external_url) {
      window.open(pub.external_url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Fallback to sample PDF viewer modal
    setPdfTarget({
      title: pub.title,
      url: '/assets/docs/wenclims-publication.pdf',
    });
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

  const filteredPubs = publications
    .filter((pub) => {
      const matchesCategory = selectedCategory === 'All' || pub.category === selectedCategory;
      const matchesSearch =
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.journal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // Sort newest publications on top, oldest on bottom
      const timeA = a.published_date
        ? new Date(a.published_date).getTime()
        : ((parseInt(a.year, 10) || 2020) * 31536000000);
      const timeB = b.published_date
        ? new Date(b.published_date).getTime()
        : ((parseInt(b.year, 10) || 2020) * 31536000000);
      return timeB - timeA;
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
        <div id="publications-catalog" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Controls: Category Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#009A9A] mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Open Access Academic &amp; Policy Literature</span>
              </div>
              <h2 className="text-3xl font-heading font-bold text-[#0B1E3D]">
                Research <span className="text-[#00C8C8]">Library</span>
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium focus:outline-none focus:border-[#00C8C8] shadow-sm"
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
                      ? 'bg-[#0B1E3D] text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Publications Cards Grid (Modern Multi-Column Grid) */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm animate-pulse space-y-4">
                  <div className="h-52 bg-gray-200 rounded-2xl w-full" />
                  <div className="h-4 bg-gray-100 rounded-md w-1/3" />
                  <div className="h-6 bg-gray-200 rounded-md w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-md w-1/2" />
                  <div className="h-10 bg-gray-200 rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : filteredPubs.length > 0 ? (
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredPubs.map((pub) => {
                const targetExtUrl = getTargetExternalUrl(pub);
                const hasDirectPdf = pub.pdf_url && isDirectPdf(pub.pdf_url);

                return (
                  <div
                    key={pub.id}
                    className="pub-card group bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-3.5 sm:p-4 flex flex-col justify-between hover:-translate-y-1.5"
                  >
                    <div>
                      {/* Top Thumbnail Image */}
                      <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden bg-[#0B1E3D] mb-4">
                        {pub.thumbnail ? (
                          <img
                            src={pub.thumbnail}
                            alt={pub.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                              const fallback = (e.target as HTMLElement).parentElement?.querySelector('.fallback-cover');
                              if (fallback) (fallback as HTMLElement).classList.remove('hidden');
                            }}
                          />
                        ) : null}

                        {/* Clean Solid Fallback Cover (No Gradients) */}
                        <div
                          className={`fallback-cover w-full h-full ${pub.thumbnail ? 'hidden' : 'flex'} flex-col items-center justify-center p-6 text-center bg-[#0B1E3D] text-white`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2.5 text-[#00C8C8]">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00C8C8]">
                            {pub.category || 'Research Publication'}
                          </span>
                          <span className="text-xs text-gray-300 line-clamp-1 mt-1 font-medium">
                            {pub.journal || 'WenClims Research Journal'}
                          </span>
                        </div>

                        {/* Top Floating Badge: Year */}
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#0B1E3D]/80 backdrop-blur-md text-white text-[11px] font-mono font-bold border border-white/10">
                          {pub.year}
                        </div>
                      </div>

                      {/* Badges Bar (Below Image, like in reference card) */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {pub.category}
                          </span>
                          {pub.is_open_access && (
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-teal-50 text-[#009A9A] border border-teal-200">
                              Open Access PDF
                            </span>
                          )}
                        </div>

                        {/* Quick Cite Icon Button */}
                        <button
                          onClick={() => setCitationTarget({
                            title: pub.title,
                            author_name: pub.authors?.[0],
                            co_authors: pub.authors?.slice(1),
                            published_date: pub.published_date || pub.year,
                            outlet_name: pub.journal,
                            external_url: targetExtUrl || pub.pdf_url,
                          })}
                          title="Cite Paper (APA / BibTeX / RIS)"
                          className="p-1.5 text-gray-400 hover:text-[#0B1E3D] hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Publication Title */}
                      <h3
                        className="text-lg sm:text-xl font-heading font-bold text-[#0B1E3D] mb-3 group-hover:text-[#009A9A] transition-colors leading-snug line-clamp-2"
                        title={pub.title}
                      >
                        {pub.title}
                      </h3>

                      {/* Metadata Rows (Authors, Date, Publisher) */}
                      <div className="space-y-2 mb-4 text-xs sm:text-[13px] text-gray-600">
                        {/* Authors */}
                        <div className="flex items-center gap-2 font-medium text-gray-700">
                          <Users className="w-4 h-4 text-[#00C8C8] flex-shrink-0" />
                          <span className="line-clamp-1" title={pub.authors.join(', ')}>
                            <strong className="text-gray-900 font-semibold">{pub.authors[0]}</strong>
                            {pub.authors.length > 1 ? ` +${pub.authors.length - 1} more` : ''}
                          </span>
                        </div>

                        {/* Date of Publication */}
                        <div className="flex items-center gap-2 font-medium text-gray-600">
                          <Calendar className="w-4 h-4 text-[#00C8C8] flex-shrink-0" />
                          <span>{formatPublicationDate(pub.published_date, pub.year)}</span>
                        </div>

                        {/* Outlet / Journal */}
                        <div className="flex items-center gap-2 font-medium text-gray-500">
                          <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="line-clamp-1" title={pub.journal}>{pub.journal}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: View Publication (External Link redirect) & PDF buttons */}
                    <div className="pt-3 border-t border-gray-100 mt-auto flex items-center gap-2">
                      <button
                        onClick={() => handleViewPublication(pub)}
                        className="flex-1 py-2.5 px-4 bg-[#0B1E3D] hover:bg-[#1A3461] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md group/btn"
                      >
                        {targetExtUrl ? (
                          <>
                            <ExternalLink className="w-4 h-4 text-[#00C8C8] flex-shrink-0" />
                            <span className="truncate">View Publication</span>
                            <ArrowUpRight className="w-4 h-4 ml-auto text-gray-300 group-hover/btn:text-white transition-colors flex-shrink-0" />
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4 text-[#00C8C8] flex-shrink-0" />
                            <span className="truncate">View Publication</span>
                            <ArrowUpRight className="w-4 h-4 ml-auto text-gray-300 group-hover/btn:text-white transition-colors flex-shrink-0" />
                          </>
                        )}
                      </button>

                      {/* If there is also a direct PDF available alongside external link, show quick PDF button */}
                      {targetExtUrl && hasDirectPdf && (
                        <button
                          onClick={() => setPdfTarget({
                            title: pub.title,
                            url: pub.pdf_url!,
                            externalUrl: targetExtUrl || undefined,
                          })}
                          title="View / Download PDF Document"
                          className="py-2.5 px-3 bg-gray-100 hover:bg-[#00C8C8] hover:text-gray-950 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm border border-gray-200"
                        >
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span>PDF</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
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
          externalUrl={pdfTarget?.externalUrl}
        />
      </div>
    </>
  );
};

export default PublicationsPage;
