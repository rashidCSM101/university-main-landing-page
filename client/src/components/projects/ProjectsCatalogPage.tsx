import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchProjects } from '../../services/api';
import {
  FolderKanban,
  CheckCircle2,
  Calendar,
  Globe2,
  Building2,
  ArrowRight,
  Award,
} from 'lucide-react';

import heroBgFallback from '../../../assets/images/1.webp?url';
import ProjectsMapChart from '../ProjectsMapChart';

gsap.registerPlugin(ScrollTrigger);

export interface ProjectItem {
  id: string;
  title: string;
  funder_name: string;
  funder_code?: string;
  region: string;
  objectives: string[];
  activities?: string[];
  status: 'active' | 'completed' | 'upcoming' | string;
  start_date?: string;
  end_date?: string;
  thumbnail?: string;
}

// Fallback seed projects data in case API server is unreachable
const fallbackProjects: ProjectItem[] = [
  {
    id: '1',
    title: 'Indus Basin Monsoon Extreme Precipitation & Flood Attribution',
    funder_name: 'Asian Development Bank (ADB) & European Union (EU)',
    funder_code: 'ADB-EU-2025',
    region: 'Indus River Basin, Pakistan',
    objectives: [
      'Evaluate climate change contribution to extreme convective rainfall over upper and lower Indus catchments.',
      'Produce high-resolution flood hazard maps and early warning risk indicators for vulnerable communities.',
      'Deliver actionable policy briefs to national disaster management agencies and provincial authorities.',
    ],
    status: 'active',
    start_date: 'Jan 2025',
    end_date: 'Dec 2027',
    thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Hindu Kush Himalaya Glacial Retreat & GLOF Risk Mapping',
    funder_name: 'World Climate Research Programme (WCRP)',
    funder_code: 'WCRP-HKH-04',
    region: 'Gilgit-Baltistan & Khyber Pakhtunkhwa',
    objectives: [
      'Deploy satellite remote sensing to monitor 3,000+ glacial lakes across northern mountain ranges.',
      'Model Glacial Lake Outburst Flood (GLOF) hydrographs and downstream exposure zones.',
      'Build localized community warning frameworks in high-risk valley corridors.',
    ],
    status: 'active',
    start_date: 'Jun 2024',
    end_date: 'May 2027',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Urban Heatwave Vulnerability & Wet-Bulb Stress Index in Sindh',
    funder_name: 'National Disaster Management Authority (NDMA)',
    funder_code: 'NDMA-HEAT-2024',
    region: 'Karachi, Hyderabad & Larkana Division',
    objectives: [
      'Quantify wet-bulb temperature thresholds during pre-monsoon heatwaves.',
      'Identify urban heat island hotspots and vulnerable informal settlement demographics.',
      'Formulate municipal heat emergency response plans and green canopy intervention strategies.',
    ],
    status: 'completed',
    start_date: 'Mar 2024',
    end_date: 'Oct 2025',
    thumbnail: 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'South Asian Renewable Energy Integration & Atmospheric Atlas',
    funder_name: 'ADB Clean Energy Transition Fund',
    funder_code: 'ADB-RE-2026',
    region: 'Balochistan & Southern Punjab Corridors',
    objectives: [
      'Map multi-decadal solar irradiance and wind velocity variability across potential clean power sites.',
      'Assess climate resilience of regional solar farms and wind turbine infrastructure.',
      'Provide open-access wind and solar data tools for energy grid planners.',
    ],
    status: 'upcoming',
    start_date: 'Jan 2026',
    end_date: 'Dec 2028',
    thumbnail: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
  },
];

const projectStats = [
  { value: '12+', label: 'Active Projects', icon: FolderKanban },
  { value: '$15M+', label: 'Research Funding', icon: Award },
  { value: 'ADB · EU', label: 'Key Partners', icon: Building2 },
  { value: 'South Asia', label: 'Regional Scope', icon: Globe2 },
];

export const ProjectsCatalogPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [bgImage, setBgImage] = useState<string>('/assets/images/projects-hero.png');

  // Fetch dynamic projects data from Express backend API
  const fetchProjectsData = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects();
      if (Array.isArray(data) && data.length > 0) {
        const mapped: ProjectItem[] = data.map((item: any) => ({
          id: item.id?.toString() || Math.random().toString(),
          title: item.title || 'Untitled Research Project',
          funder_name: item.funder_name || 'International Climate Fund',
          funder_code: item.funder_code || `WCS-PRJ-${item.id ? item.id.substring(0, 4) : '01'}`,
          region: item.region || 'South Asia & Indus Basin',
          objectives: Array.isArray(item.objectives) && item.objectives.length > 0
            ? item.objectives
            : [item.description || 'Advance climate attribution models and regional risk assessments.'],
          status: (item.status || 'active').toLowerCase(),
          start_date: item.start_date || '2024',
          end_date: item.end_date || '2027',
          thumbnail: item.thumbnail || item.cover_image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
        }));
        setProjects(mapped);
      } else {
        setProjects(fallbackProjects);
      }
    } catch (err) {
      console.warn('Backend API unreachable, using fallback projects data:', err);
      setProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsData();
  }, []);

  // GSAP Animations & Parallax
  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 }
      );

      // Hero background parallax
      gsap.to('.projects-hero-bg', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.projects-hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      if (gridRef.current && projects.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
          }
        );

        // Project thumbnails parallax
        gsap.utils.toArray('.project-card-thumb').forEach((img: any) => {
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
  }, [loading, projects]);

  const filteredProjects = projects.filter((p) => {
    if (selectedStatus === 'all') return true;
    return p.status.toLowerCase() === selectedStatus.toLowerCase();
  });

  return (
    <>
      <Helmet>
        <title>Projects &amp; Grant Initiatives | WenClims</title>
        <meta
          name="description"
          content="Explore climate research projects, flood attribution studies, GLOF monitoring programs, and clean energy transition grants led by WenClims."
        />
        <link rel="canonical" href="https://wenclims.org/projects" />
      </Helmet>

      <div ref={pageRef} className="min-h-screen bg-gray-50 font-sans">
        {/* ═══ HERO SECTION ═══ */}
        <section className="projects-hero-section relative pt-32 pb-24 md:pt-40 md:pb-32 bg-gray-900 text-white overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={bgImage}
              alt="WenClims Projects Background"
              onError={() => setBgImage(heroBgFallback)}
              className="projects-hero-bg w-full h-full object-cover opacity-25 filter contrast-125 brightness-90 will-change-transform scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-transparent to-gray-900/90" />
          </div>

          <div className="container-custom relative z-10">
            <div ref={contentRef} className="max-w-4xl">
              {/* Tag Pill matching Home, Tools, Vision */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="w-8 h-px bg-[#00C8C8]" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] px-3 py-1 rounded-full border border-[#00C8C8]/50 text-[#00C8C8] bg-[#00C8C8]/10">
                  Multilateral Climate Projects Portfolio
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
                Climate Action <span className="text-[#00C8C8]">Projects</span> &amp; Grants
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-3xl mb-10">
                Independent climate attribution research, flood risk mapping, and extreme event resilience
                initiatives funded by ADB, World Bank, WCRP, EU, and NDMA.
              </p>

              {/* Quick Action Button */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#projects-catalog"
                  className="px-6 py-3.5 bg-[#00C8C8] text-gray-950 font-bold rounded-xl hover:bg-teal-400 transition-all shadow-lg text-sm inline-flex items-center gap-2"
                >
                  <FolderKanban className="w-4 h-4" />
                  <span>Explore Project Portfolio</span>
                </a>
              </div>
            </div>

            {/* Stats Bar matching Vision / Tools pages */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16 pt-10 border-t border-gray-800/80">
              {projectStats.map((stat, i) => {
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

        {/* ═══ INTERACTIVE GIS PROJECTS MAP ═══ */}
        <section className="py-12 bg-gray-950">
          <div className="container-custom">
            <ProjectsMapChart />
          </div>
        </section>

        {/* ═══ PROJECTS CATALOG SECTION ═══ */}
        <div id="projects-catalog" className="w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Controls & Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#48b302] mb-1">
                <FolderKanban className="w-4 h-4" />
                <span>Active &amp; Completed Research Portfolio</span>
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-900">
                Grant <span className="text-[#48b302]">Initiatives</span>
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
              {['all', 'active', 'completed', 'upcoming'].map((st) => {
                const isActive = selectedStatus === st;
                return (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                      isActive
                        ? 'bg-[#48b302] text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Projects Cards Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded-md w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-md w-1/2" />
                  <div className="h-20 bg-gray-100 rounded-md w-full" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div ref={gridRef} className="grid md:grid-cols-2 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="project-card group bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 opacity-100"
                >
                  <div className="p-6 sm:p-8">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          project.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : project.status === 'completed'
                            ? 'bg-gray-100 text-gray-700 border border-gray-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        ● {project.status}
                      </span>
                      {project.start_date && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {project.start_date} {project.end_date ? `- ${project.end_date}` : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-[#48b302] transition-colors leading-snug">
                      {project.title}
                    </h3>

                    {/* Funder & Region */}
                    <div className="space-y-1.5 mb-6 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#48b302] flex-shrink-0" />
                        <span>
                          Funder: <strong className="text-gray-800">{project.funder_name}</strong>
                          {project.funder_code && ` (${project.funder_code})`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe2 className="w-4 h-4 text-[#48b302] flex-shrink-0" />
                        <span>
                          Region: <strong className="text-gray-800">{project.region}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Objectives List */}
                    <div className="space-y-2 mb-6">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Key Research Objectives:
                      </div>
                      <ul className="space-y-2">
                        {project.objectives.map((obj, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-[#48b302] flex-shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer Link */}
                  <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">
                      WenClims Climate Portfolio
                    </span>
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#48b302] group-hover:text-teal-700 group-hover:translate-x-1 transition-all"
                    >
                      <span>View Details &amp; Data</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-lg mx-auto shadow-sm">
              <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Projects Found</h3>
              <p className="text-gray-500 text-sm mb-6">
                No research project matched the selected status &quot;{selectedStatus}&quot;.
              </p>
              <button
                onClick={() => setSelectedStatus('all')}
                className="btn-primary text-sm"
              >
                Show All Projects
              </button>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-gray-800">
            <div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2">
                Partner with <span className="text-[#00C8C8]">WenClims Research</span>
              </h3>
              <p className="text-gray-300 text-sm max-w-xl">
                Collaborate with our scientists on climate attribution, flood forecasting models,
                and regional vulnerability risk studies across South Asia.
              </p>
            </div>
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-[#00C8C8] text-gray-950 font-bold rounded-xl hover:bg-teal-400 transition-all text-sm whitespace-nowrap shadow-lg flex-shrink-0"
            >
              Propose Research Collaboration
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsCatalogPage;
