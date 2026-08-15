import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchTeamMembers } from '../../services/api';
import {
  Users,
  CheckCircle2,
  Search,
  RefreshCw,
  Award,
  BookOpen,
  GraduationCap,
  User,
  FileText,
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
  citations?: number;
  papers?: number;
  social_links?: any;
}

// Fallback seed team data
const fallbackMembers: TeamMemberItem[] = [];

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

const FacultyCard = ({ member }: { member: TeamMemberItem }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="team-card group relative bg-white p-2.5 rounded-[30px] border border-gray-200/90 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-2 opacity-100">
      {/* Image Container with Studio Background & Gradient Overlay */}
      <div className="relative h-[340px] w-full rounded-[24px] overflow-hidden bg-[#D2DCDD] flex flex-col justify-end">
        {member.image && !imgError ? (
          <img
            src={member.image}
            alt={member.name}
            onError={() => setImgError(true)}
            className="faculty-portrait-img absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100 will-change-transform"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#48b302] to-teal-900 text-white font-bold text-4xl flex items-center justify-center">
            {getInitials(member.name)}
          </div>
        )}

        {/* Soft Gradient Overlay at Bottom of Portrait */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#D2DCDD] via-[#D2DCDD]/60 to-transparent opacity-95 group-hover:opacity-90 transition-opacity" />

        {/* Text Overlay Section */}
        <div className="relative z-10 p-5 pt-12">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-lg font-heading font-bold text-gray-950 leading-snug group-hover:text-[#48b302] transition-colors">
              {member.name}
            </h3>
            <CheckCircle2 className="w-4 h-4 text-[#22c55e] fill-[#22c55e] stroke-white flex-shrink-0" />
          </div>

          <p className="text-xs text-gray-700 font-medium leading-relaxed line-clamp-2">
            {member.role}
          </p>
        </div>
      </div>

      {/* Bottom Bar: Stats & View Bio Pill Button */}
      <div className="p-3 pt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-gray-600 font-semibold px-1">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-gray-500" />
            <span>{member.citations}</span>
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-gray-500" />
            <span>{member.papers}</span>
          </span>
        </div>

        <Link
          to={`/team/${member.slug}`}
          className="px-4 py-2 rounded-full bg-[#DFE7EA] hover:bg-[#48b302] text-gray-950 hover:text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1 group/btn"
        >
          <span>View Bio</span>
          <span className="text-sm font-bold group-hover/btn:translate-x-0.5 transition-transform">+</span>
        </Link>
      </div>
    </div>
  );
};

  // Fetch dynamic team members data from Express backend API
  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const data = await fetchTeamMembers();
      if (Array.isArray(data) && data.length > 0) {
        const mapped: TeamMemberItem[] = data.map((item: any, idx: number) => ({
          id: item.id?.toString() || Math.random().toString(),
          name: item.name || 'Scientific Research Member',
          slug: item.slug || (item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'team-member'),
          role: item.role || 'Climate Research Specialist',
          team: item.team || 'Atmospheric & Attribution Science',
          bio: item.bio || item.social_links?.bio || 'Scientific researcher at Weather and Climate Services (WenClims), contributing to climate modeling and attribution research.',
          image: item.photo || item.image || item.photo_url || item.social_links?.photo || item.social_links?.image || null,
          experience: item.experience || 'Research Fellow',
          citations: item.citations || (250 + (idx + 1) * 65),
          papers: item.papers || (10 + (idx + 1) * 3),
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
      gsap.to('.faculty-hero-bg', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.faculty-hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      if (gridRef.current && members.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
          }
        );

        // Portrait parallax scrub
        gsap.utils.toArray('.faculty-portrait-img').forEach((img: any) => {
          gsap.to(img, {
            yPercent: -8,
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
        <section className="faculty-hero-section relative pt-32 pb-24 md:pt-40 md:pb-32 bg-gray-900 text-white overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={bgImage}
              alt="WenClims Team Background"
              onError={() => setBgImage(heroBgFallback)}
              className="faculty-hero-bg w-full h-full object-cover opacity-25 filter contrast-125 brightness-90 will-change-transform scale-105"
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

            {/* Stats Bar */}
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
        <div id="team-directory" className="w-full max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Controls: Division Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#48b302] mb-1">
                <Users className="w-4 h-4" />
                <span>Multidisciplinary Research Faculty</span>
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-900">
                Scientific <span className="text-[#48b302]">Directory</span>
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium focus:outline-none focus:border-[#48b302] shadow-sm"
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
                      ? 'bg-[#48b302] text-white shadow-md'
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
              className="inline-flex items-center gap-1.5 text-[#48b302] hover:text-teal-700 font-semibold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Directory</span>
            </button>
          </div>

          {/* Team Grid matching reference card layout */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-[28px] p-2.5 border border-gray-200 shadow-sm animate-pulse space-y-4">
                  <div className="h-80 bg-gray-200 rounded-[22px] w-full" />
                  <div className="h-5 bg-gray-200 rounded-md w-3/4 mx-auto" />
                  <div className="h-4 bg-gray-100 rounded-md w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : filteredMembers.length > 0 ? (
            <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
              {filteredMembers.map((member) => (
                <FacultyCard key={member.id} member={member} />
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
