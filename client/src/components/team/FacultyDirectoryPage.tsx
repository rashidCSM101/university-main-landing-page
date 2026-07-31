import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchTeamMembers } from '../../services/api';
import {
  Users,
  CheckCircle2,
  ArrowRight,
  Search,
  RefreshCw,
  Award,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

import heroBgFallback from '../../../assets/images/1.webp?url';

gsap.registerPlugin(ScrollTrigger);

export interface TeamMemberItem {
  id: string;
  name: string;
  slug: string;
  role: string;
  team: string; // Atmospheric, Hydrology, Climate Risk, Policy
  bio?: string;
  image?: string;
  experience?: string;
  social_links?: any;
}

// Fallback seed team data in case API server is offline
const fallbackMembers: TeamMemberItem[] = [
  {
    id: '1',
    name: 'Dr. Rashid',
    slug: 'dr-rashid',
    role: 'Lead Climate Attribution Scientist & Institute Founder',
    team: 'Atmospheric & Attribution Science',
    bio: 'Pioneer in South Asian extreme weather event attribution, convection-permitting WRF regional modeling, and IPCC AR6 convective precipitation dynamics.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    experience: '18+ Yrs Exp',
    social_links: { email: 'admin@wenclims.org', qualification: 'Ph.D. Atmospheric Physics' },
  },
  {
    id: '2',
    name: 'Dr. Ayesha Malik',
    slug: 'dr-ayesha-malik',
    role: 'Senior Hydrological & GLOF Modeling Lead',
    team: 'Hydrology & Cryosphere',
    bio: 'Specialist in Hindu Kush Himalaya glacial outburst flood hydrographs, snow-melt runoff modeling (HBV/VIC), and Indus River basin water security.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    experience: '12+ Yrs Exp',
    social_links: { email: 'ayesha@wenclims.org', qualification: 'Ph.D. Hydrology & Water Resources' },
  },
  {
    id: '3',
    name: 'Mehran',
    slug: 'mehran',
    role: 'Executive Admin & Operations Manager',
    team: 'Operations & Research Admin',
    bio: 'Coordinates international research grants, ADB & World Bank project deliverables, and academic publication workflows.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    experience: '10+ Yrs Exp',
    social_links: { email: 'mehran@wenclims.org', qualification: 'M.Sc. Research Management' },
  },
  {
    id: '4',
    name: 'Dr. Sana Khan',
    slug: 'dr-sana-khan',
    role: 'Urban Heat Action & Climate Health Specialist',
    team: 'Climate Policy & Health',
    bio: 'Lead researcher on urban heat island vulnerability, wet-bulb stress thresholds (TW > 35°C), and NDMA heat emergency response plans in Sindh.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    experience: '9+ Yrs Exp',
    social_links: { email: 'sana@wenclims.org', qualification: 'Ph.D. Environmental Health & Urban Climate' },
  },
];

const teamStats = [
  { value: '25+', label: 'Research Scientists', icon: Users },
  { value: '4', label: 'Specialized Labs', icon: GraduationCap },
  { value: '50+', label: 'International Papers', icon: BookOpen },
  { value: 'IPCC', label: 'Scientific Contributors', icon: Award },
];

export const FacultyDirectoryPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [bgImage, setBgImage] = useState<string>('/assets/images/team-hero.png');

  // Helper to generate 2-letter initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'WC';
    const parts = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Fetch dynamic team members data from Express backend API
  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const data = await fetchTeamMembers();
      if (Array.isArray(data) && data.length > 0) {
        const mapped: TeamMemberItem[] = data.map((item: any) => ({
          id: item.id?.toString() || Math.random().toString(),
          name: item.name || 'Scientific Research Member',
          slug: item.slug || (item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'team-member'),
          role: item.role || 'Climate Research Specialist',
          team: item.team || 'Atmospheric & Attribution Science',
          bio: item.bio || item.social_links?.bio || 'Scientific researcher at Weather and Climate Services (WenClims), contributing to climate modeling and attribution research.',
          image: item.image || item.photo_url || item.social_links?.image || null,
          experience: item.experience || 'Research Fellow',
          social_links: item.social_links || {},
        }));
        setMembers(mapped);
        setIsUsingFallback(false);
      } else {
        setMembers(fallbackMembers);
        setIsUsingFallback(true);
      }
    } catch (err) {
      console.warn('Backend API unreachable, using fallback team members data:', err);
      setMembers(fallbackMembers);
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
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

      if (gridRef.current && members.length > 0) {
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
  }, [loading, members]);

  const divisions = [
    'All',
    'Atmospheric & Attribution Science',
    'Hydrology & Cryosphere',
    'Climate Policy & Health',
    'Operations & Research Admin',
  ];

  const filteredMembers = members.filter((m) => {
    const matchesDivision = selectedDivision === 'All' || m.team === selectedDivision;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.bio && m.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDivision && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Scientific Faculty &amp; Research Team | WenClims</title>
        <meta
          name="description"
          content="Meet the climate scientists, atmospheric physicists, hydrologists, and policy experts leading climate attribution research at WenClims."
        />
        <link rel="canonical" href="https://wenclims.org/team" />
      </Helmet>

      <div ref={pageRef} className="min-h-screen bg-gray-50 font-sans">
        {/* ═══ HERO SECTION ═══ */}
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-gray-900 text-white overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={bgImage}
              alt="WenClims Team Background"
              onError={() => setBgImage(heroBgFallback)}
              className="w-full h-full object-cover opacity-25 filter contrast-125 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-transparent to-gray-900/90" />
          </div>

          <div className="container-custom relative z-10">
            <div ref={contentRef} className="w-full max-w-4xl">
              {/* Tag Pill */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="w-8 h-px bg-[#00C8C8]" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] px-3 py-1 rounded-full border border-[#00C8C8]/50 text-[#00C8C8] bg-[#00C8C8]/10">
                  Scientific Leadership &amp; Experts
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
                Climate Research <span className="text-[#00C8C8]">Scientists</span> &amp; Faculty
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-3xl mb-10">
                A multidisciplinary team of atmospheric physicists, hydrologists, cryosphere specialists,
                and climate risk policy experts advancing attribution science across South Asia.
              </p>

              {/* Quick Action Button */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#team-directory"
                  className="px-6 py-3.5 bg-[#00C8C8] text-gray-950 font-bold rounded-xl hover:bg-teal-400 transition-all shadow-lg text-sm inline-flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Explore Faculty Directory</span>
                </a>
              </div>
            </div>

            {/* Stats Bar matching Vision / Tools / Projects pages */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16 pt-10 border-t border-gray-800/80">
              {teamStats.map((stat, i) => {
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

        {/* ═══ TEAM DIRECTORY SECTION ═══ */}
        <div id="team-directory" className="w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Controls: Division Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#008B8B] mb-1">
                <Users className="w-4 h-4" />
                <span>Multidisciplinary Research Faculty</span>
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-900">
                Scientific <span className="text-[#008B8B]">Directory</span>
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, role, or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium focus:outline-none focus:border-[#008B8B] shadow-sm"
              />
            </div>
          </div>

          {/* Division Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 mb-8">
            {divisions.map((div) => {
              const isActive = selectedDivision === div;
              return (
                <button
                  key={div}
                  onClick={() => setSelectedDivision(div)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#008B8B] text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {div}
                </button>
              );
            })}
          </div>

          {/* Sync Status Bar */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 mb-8 border border-gray-200/80 shadow-sm text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                Data source:{' '}
                <strong className="text-gray-900">
                  {isUsingFallback ? 'Express Seed Data' : 'Live Express REST API (/api/v1/team)'}
                </strong>
              </span>
            </div>
            <button
              onClick={fetchTeamData}
              className="inline-flex items-center gap-1.5 text-[#008B8B] hover:text-teal-700 font-semibold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Directory</span>
            </button>
          </div>

          {/* Team Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-2xl mx-auto" />
                  <div className="h-5 bg-gray-200 rounded-md w-3/4 mx-auto" />
                  <div className="h-4 bg-gray-100 rounded-md w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : filteredMembers.length > 0 ? (
            <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="team-card group bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 p-6 text-center opacity-100"
                >
                  <div>
                    {/* Scientist Photo / Avatar */}
                    <div className="relative w-28 h-28 mx-auto mb-4">
                      <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-[#008B8B]/40 p-0.5 bg-gray-100 group-hover:border-[#008B8B] transition-colors shadow-md">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                              if (e.currentTarget.parentElement) {
                                e.currentTarget.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-[#008B8B] to-teal-800 text-white font-bold text-2xl flex items-center justify-center rounded-xl">${getInitials(member.name)}</div>`;
                              }
                            }}
                            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#008B8B] to-teal-800 text-white font-bold text-2xl flex items-center justify-center rounded-xl">
                            {getInitials(member.name)}
                          </div>
                        )}
                      </div>
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#008B8B] text-white shadow-sm whitespace-nowrap">
                        {member.experience}
                      </span>
                    </div>

                    {/* Name & Role */}
                    <h3 className="text-lg font-heading font-bold text-gray-900 mb-1 group-hover:text-[#008B8B] transition-colors leading-snug">
                      {member.name}
                    </h3>
                    <div className="text-xs font-semibold text-[#008B8B] mb-3 leading-snug">
                      {member.role}
                    </div>

                    {/* Division Badge */}
                    <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium mb-4">
                      {member.team}
                    </div>

                    {/* Bio Excerpt */}
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-4">
                      {member.bio}
                    </p>
                  </div>

                  {/* Card Footer Link */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-center">
                    <Link
                      to={`/team/${member.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008B8B] hover:text-teal-700 transition-colors"
                    >
                      <span>Full Bio &amp; Research Papers</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-lg mx-auto shadow-sm">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Faculty Members Found</h3>
              <p className="text-gray-500 text-sm mb-6">
                No research scientist matched your query &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => {
                  setSelectedDivision('All');
                  setSearchQuery('');
                }}
                className="btn-primary text-sm"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FacultyDirectoryPage;
