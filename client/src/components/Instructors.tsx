import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTeamMembers } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

// Fallback scientists (empty - real data loaded dynamically from PostgreSQL)
const fallbackScientists: any[] = [];

const Instructors = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [scientists, setScientists] = useState<any[]>(fallbackScientists);
  const [loading, setLoading] = useState(true);

  // Helper to generate 2-letter initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'WC';
    const parts = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

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
            image: item.photo || item.image || item.photo_url || item.social_links?.photo || item.social_links?.image || null,
            experience: item.experience || 'Research Fellow',
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
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      if (cardsRef.current && scientists.length > 0) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [scientists, loading]);

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 font-sans">
      <div className="container-custom">
        {/* Section Header */}
        <div className="instructors-header text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#008B8B]/10 text-[#008B8B] text-xs font-bold uppercase tracking-wider border border-[#008B8B]/30">
            <GraduationCap className="w-4 h-4" />
            <span>Scientific Faculty &amp; Leadership</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900">
            Meet Our Lead <span className="text-[#008B8B]">Climate Scientists</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            A multidisciplinary team of atmospheric physicists, hydrologists, and climate risk policy experts leading Attribution Science across South Asia.
          </p>
        </div>

        {/* Scientists Cards Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
                <div className="h-72 bg-gray-200 w-full" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-md w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-md w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {scientists.map((sc) => (
              <div
                key={sc.id}
                className="instructor-card group bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col justify-between hover:-translate-y-2"
              >
                <div>
                  {/* Portrait Cover Image Section */}
                  <div className="relative h-72 w-full overflow-hidden bg-gray-900">
                    {sc.image ? (
                      <img
                        src={sc.image}
                        alt={sc.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-[#008B8B] to-teal-900 text-white font-bold text-4xl flex items-center justify-center">${getInitials(sc.name)}</div>`;
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#008B8B] to-teal-900 text-white font-bold text-4xl flex items-center justify-center">
                        {getInitials(sc.name)}
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />

                    {/* Floating Experience Badge */}
                    <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#008B8B] text-white shadow-lg backdrop-blur-md border border-white/20">
                      {sc.experience}
                    </span>

                    {/* Floating Division Tag */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-gray-900/90 text-[#00C8C8] border border-[#00C8C8]/40 backdrop-blur-md shadow-md">
                        {sc.division}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-bold text-gray-900 group-hover:text-[#008B8B] transition-colors leading-snug mb-1">
                      {sc.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#008B8B] leading-relaxed">
                      {sc.role}
                    </p>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="px-6 pb-6 pt-0">
                  <Link
                    to={`/team/${sc.slug}`}
                    className="w-full py-3 px-4 rounded-xl bg-gray-50 group-hover:bg-[#008B8B] text-gray-700 group-hover:text-white font-bold text-xs flex items-center justify-between transition-all duration-300 shadow-sm"
                  >
                    <span>Read Bio &amp; Research</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Instructors;
