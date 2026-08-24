import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTeamMembers } from '../services/api';
import { formatExternalUrl } from '../utils/url';

gsap.registerPlugin(ScrollTrigger);

// Fallback scientists
const fallbackScientists: any[] = [];

// Helper to generate 2-letter initials for avatar fallback
const getInitials = (name: string) => {
  if (!name) return 'WC';
  const parts = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const ScientistCard = ({ sc, getInitials }: { sc: any; getInitials: (name: string) => string }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative bg-white p-2.5 rounded-[30px] border border-gray-200/90 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-2">
      {/* Image Container with Studio Background & Gradient Overlay */}
      <div className="relative h-[340px] w-full rounded-[24px] overflow-hidden bg-[#D2DCDD] flex flex-col justify-end">
        {sc.image && !imgError ? (
          <img
            src={sc.image}
            alt={sc.name}
            onError={() => setImgError(true)}
            className="scientist-portrait-img absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100 will-change-transform"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#48b302] to-teal-900 text-white font-bold text-4xl flex items-center justify-center">
            {getInitials(sc.name)}
          </div>
        )}

        {/* Soft Gradient Overlay at Bottom of Portrait */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#D2DCDD] via-[#D2DCDD]/60 to-transparent opacity-95 group-hover:opacity-90 transition-opacity" />

        {/* Text Overlay Section */}
        <div className="relative z-10 p-5 pt-12">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-lg font-heading font-bold text-gray-950 leading-snug group-hover:text-[#48b302] transition-colors">
              {sc.name}
            </h3>
            <CheckCircle2 className="w-4 h-4 text-[#22c55e] fill-[#22c55e] stroke-white flex-shrink-0" />
          </div>

          <p className="text-xs text-gray-700 font-medium leading-relaxed line-clamp-2">
            {sc.role}
          </p>
        </div>
      </div>

      {/* Bottom Bar: LinkedIn, X (Twitter) Glowing Buttons & View Bio Pill Button */}
      <div className="p-3 pt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 px-1">
          {/* LinkedIn Glow Button */}
          <a
            href={formatExternalUrl(sc.linkedin || 'https://linkedin.com')}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn Profile"
            className="group/li relative w-8 h-8 rounded-full bg-[#DFE7EA] flex items-center justify-center transition-all duration-300 hover:bg-[#0077b5] hover:scale-110 hover:shadow-[0_0_12px_#0077b5]"
          >
            <svg className="w-4 h-4 fill-current text-gray-700 group-hover/li:text-white transition-colors" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>

          {/* X (Twitter) Glow Button */}
          <a
            href={formatExternalUrl(sc.twitter || 'https://x.com')}
            target="_blank"
            rel="noopener noreferrer"
            title="X (Twitter) Profile"
            className="group/x relative w-8 h-8 rounded-full bg-[#DFE7EA] flex items-center justify-center transition-all duration-300 hover:bg-gray-950 hover:scale-110 hover:shadow-[0_0_12px_rgba(0,0,0,0.5)]"
          >
            <svg className="w-3.5 h-3.5 fill-current text-gray-700 group-hover/x:text-white transition-colors" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>

        <Link
          to={`/team/${sc.slug}`}
          className="px-4 py-2 rounded-full bg-[#DFE7EA] hover:bg-[#48b302] text-gray-950 hover:text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1 group/btn"
        >
          <span>View Bio</span>
          <span className="text-sm font-bold group-hover/btn:translate-x-0.5 transition-transform">+</span>
        </Link>
      </div>
    </div>
  );
};

const Instructors = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [scientists, setScientists] = useState<any[]>(fallbackScientists);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTeamMembers(true)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.slice(0, 4).map((item: any) => ({
            id: item.id?.toString() || Math.random().toString(),
            name: item.name || 'Scientific Research Member',
            role: item.role || 'Climate Research Specialist',
            division: item.team || 'Atmospheric & Attribution Science',
            bio: item.bio || item.social_links?.bio || 'Focuses on extreme weather attribution, convection-permitting WRF regional modeling, and water security.',
            image: item.photo || item.image || item.photo_url || item.social_links?.photo || item.social_links?.image || null,
            linkedin: item.social_links?.linkedin || item.linkedin || 'https://linkedin.com',
            twitter: item.social_links?.twitter || item.social_links?.x || item.twitter || item.x || 'https://x.com',
            slug: item.slug || (item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'team-member'),
          }));
          setScientists(mapped);
        } else {
          setScientists(fallbackScientists);
        }
      })
      .catch(() => {
        setScientists(fallbackScientists);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.instructors-header', {
        y: 35,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });

      if (cardsRef.current && scientists.length > 0) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            },
          }
        );

        // Portrait parallax scrub
        gsap.utils.toArray('.scientist-portrait-img').forEach((img: any) => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, [scientists, loading]);

  return (
    <section ref={sectionRef} className="py-24 bg-slate-50 font-sans border-t border-gray-200">
      <div className="container-custom">
        {/* Section Header */}
        <div className="instructors-header text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#48b302]/10 text-[#48b302] text-xs font-bold uppercase tracking-wider border border-[#48b302]/30">
            <GraduationCap className="w-4 h-4" />
            <span>Scientific Faculty &amp; Leadership</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900">
            Meet Our Lead <span className="text-[#48b302]">Climate Scientists</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            A multidisciplinary team of atmospheric physicists, hydrologists, and climate risk policy experts leading Attribution Science across South Asia.
          </p>
        </div>

        {/* Scientists Cards Grid matching reference layout */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-[28px] p-2 border border-gray-200 shadow-sm animate-pulse">
                <div className="h-80 bg-gray-200 rounded-[22px] w-full mb-4" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-md w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-md w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
            {scientists.map((sc) => (
              <ScientistCard key={sc.id} sc={sc} getInitials={getInitials} />
            ))}
          </div>
        )}

        {/* View All Team Link */}
        <div className="text-center mt-12">
          <Link
            to="/team"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full bg-white border border-gray-200 text-gray-800 hover:text-[#48b302] hover:border-[#48b302] shadow-sm hover:shadow-md transition-all"
          >
            <span>Explore All Faculty Members</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Instructors;
