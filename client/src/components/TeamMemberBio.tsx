import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchTeamMemberBySlug } from '../services/api';
import {
  ArrowLeft,
  Mail,
  Phone,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { formatExternalUrl } from '../utils/url';

export interface ScientistBioData {
  id: string;
  slug: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  experience: string;
  email: string;
  phone: string;
  department: string;
  bio: string;
  image: string;
  linkedin: string;
  twitter: string;
  orcid?: string;
  googleScholar?: string;
  publications: { title: string; journal: string; year: string; doi?: string }[];
  projectsLed: string[];
}

export const TeamMemberBio = () => {
  const { slug } = useParams<{ slug: string }>();
  const [member, setMember] = useState<ScientistBioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    if (slug) {
      fetchTeamMemberBySlug(slug)
        .then((data) => {
          if (data && data.name) {
            const sl = data.social_links || {};
            setMember({
              id: data.id?.toString() || slug,
              slug: data.slug || slug,
              name: data.name,
              designation: data.role || data.designation || 'Climate Research Specialist',
              qualification: sl.qualification || data.qualification || 'M.Sc. / Ph.D. Physics & Climate Informatics',
              specialization: sl.specialization || data.specialization || 'Extreme Event Attribution, Convective Modeling & Risk Analysis',
              experience: sl.experience || data.experience || 'Research Fellow',
              email: sl.email || data.email || `${data.slug || 'research'}@wenclims.org`,
              phone: sl.phone || data.phone || '+92 51 9260100',
              department: data.team || data.department || 'Atmospheric & Climate Science',
              bio: data.bio || sl.bio || 'Scientific researcher at Weather and Climate Services (WenClims), contributing to regional climate dynamics, meteorological forecasting models, and attribution analytics across South Asia.',
              image: data.photo || data.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
              linkedin: sl.linkedin || data.linkedin || 'https://linkedin.com',
              twitter: sl.twitter || sl.x || data.twitter || data.x || 'https://x.com',
              orcid: sl.orcid || data.orcid,
              googleScholar: sl.google_scholar || data.googleScholar,
              publications: Array.isArray(sl.publications) ? sl.publications : [],
              projectsLed: Array.isArray(sl.projectsLed) ? sl.projectsLed : [
                'Regional Weather & Climate Attribution Protocol',
                'Indus Basin Hydro-Meteorological Impact Assessment',
              ],
            });
          } else {
            // Fallback profile
            setMember({
              id: '1',
              slug: slug || 'faculty-member',
              name: 'Dr. Rashid',
              designation: 'Lead Climate Scientist & Executive Director',
              qualification: 'Ph.D. Atmospheric Physics & Attribution Science',
              specialization: 'Extreme Event Attribution, Convective Monsoon Modeling & IPCC Assessment',
              experience: '18+ Years Research & Advisory',
              email: 'rashid@wenclims.org',
              phone: '+92 51 9260100',
              department: 'Leadership & Atmospheric Science',
              bio: 'Founding Scientist and Executive Director at WenClims. With extensive expertise in regional atmospheric modeling, monsoon dynamics, and climate risk assessments, leading international research initiatives across the Indus Basin.',
              image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
              linkedin: 'https://linkedin.com',
              twitter: 'https://x.com',
              publications: [],
              projectsLed: ['Upper Indus Extreme Weather Telemetry', 'South Asia Climate Risk Management'],
            });
          }
        })
        .catch(() => {
          setMember({
            id: '1',
            slug: slug || 'faculty-member',
            name: 'Scientific Faculty Member',
            designation: 'Research Specialist',
            qualification: 'Atmospheric Physics & Climate Sciences',
            specialization: 'Attribution Science & Hydrological Risk',
            experience: 'Research Fellow',
            email: 'info@wenclims.org',
            phone: '+92 51 9260100',
            department: 'Scientific Research',
            bio: 'Contributing to extreme weather attribution, convection-permitting WRF regional modeling, and water security at WenClims.',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            linkedin: 'https://linkedin.com',
            twitter: 'https://x.com',
            publications: [],
            projectsLed: [],
          });
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600 font-medium text-sm">Loading faculty profile...</span>
        </div>
      </div>
    );
  }

  if (!member) return null;

  return (
    <>
      <Helmet>
        <title>{`${member.name} — ${member.designation} | WenClims Faculty Profile`}</title>
        <meta name="description" content={member.bio} />
      </Helmet>

      <main className="min-h-screen bg-slate-50 font-sans text-gray-900 pt-28 md:pt-36 pb-24 selection:bg-teal-700 selection:text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* ── Top Back Breadcrumb ── */}
          <div>
            <Link
              to="/team"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-teal-700" />
              <span>Back to Faculty Directory</span>
            </Link>
          </div>

          {/* ── Editorial Profile Header (Seamless Layout) ── */}
          <header className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 pb-12 border-b border-gray-200">
            
            {/* Faculty Portrait */}
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-3xl overflow-hidden shadow-xl bg-gray-200 flex-shrink-0">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Profile Identity Details */}
            <div className="space-y-4 text-center md:text-left flex-1">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-gray-800 text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-teal-700" />
                <span>{member.department}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-gray-950 tracking-tight flex items-center justify-center md:justify-start gap-2.5">
                <span>{member.name}</span>
                <CheckCircle2 className="w-6 h-6 text-teal-700 fill-teal-100 flex-shrink-0" />
              </h1>

              <div className="space-y-1">
                <p className="text-lg md:text-xl font-bold text-gray-800">{member.designation}</p>
                <p className="text-sm text-gray-600">{member.qualification}</p>
              </div>

              {/* Verified LinkedIn & X (Twitter) Buttons + Contact Info */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
                
                {/* LinkedIn Direct Action */}
                <a
                  href={formatExternalUrl(member.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Connect on LinkedIn"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0077b5] text-white text-xs font-bold hover:bg-[#005f93] transition-all shadow-sm hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>

                {/* X (Twitter) Direct Action */}
                <a
                  href={formatExternalUrl(member.twitter)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Follow on X (Twitter)"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-950 text-white text-xs font-bold hover:bg-black transition-all shadow-sm hover:scale-105"
                >
                  <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X (Twitter)</span>
                </a>

                {/* Email */}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-800 text-xs font-semibold hover:border-gray-400 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-teal-700" />
                    <span>{member.email}</span>
                  </a>
                )}

                {/* Phone */}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-800 text-xs font-semibold hover:border-gray-400 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-700" />
                    <span>{member.phone}</span>
                  </a>
                )}

              </div>

            </div>

          </header>

          {/* ── Seamless Editorial Body Sections ── */}
          <div className="space-y-12 max-w-4xl">

            {/* Biography Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-teal-700 rounded-full" />
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                  Biography &amp; Overview
                </h2>
              </div>
              <p className="text-gray-800 text-lg md:text-xl leading-relaxed font-normal">
                {member.bio}
              </p>
            </section>

            {/* Primary Specialization */}
            <section className="space-y-4 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-teal-700 rounded-full" />
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                  Primary Scientific Specialization
                </h2>
              </div>
              <p className="text-gray-900 text-base md:text-lg leading-relaxed font-medium">
                {member.specialization}
              </p>
            </section>

            {/* Academic Credentials & Department Info */}
            <section className="space-y-6 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-teal-700 rounded-full" />
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                  Institutional Profile &amp; Credentials
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Academic Qualification</span>
                  <span className="font-bold text-gray-900">{member.qualification}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Research Department</span>
                  <span className="font-bold text-gray-900">{member.department}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Affiliation</span>
                  <span className="font-bold text-teal-800">Weather &amp; Climate Services (WenClims)</span>
                </div>
              </div>
            </section>

            {/* Active Research & Projects */}
            {member.projectsLed && member.projectsLed.length > 0 && (
              <section className="space-y-4 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-teal-700 rounded-full" />
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                    Active Research &amp; Advisory Projects
                  </h2>
                </div>
                <ul className="space-y-2 text-gray-800 text-sm md:text-base">
                  {member.projectsLed.map((project, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-teal-700 font-bold mt-0.5">•</span>
                      <span className="font-medium">{project}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Bottom Advisory Contact Button */}
            <div className="pt-10 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-950">Consult with {member.name}</h3>
                <p className="text-xs md:text-sm text-gray-600">Direct inquiries regarding climate modeling and advisory projects.</p>
              </div>

              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex-shrink-0"
              >
                <span>Request Advisory</span>
              </Link>
            </div>

          </div>

        </div>
      </main>
    </>
  );
};

export default TeamMemberBio;

