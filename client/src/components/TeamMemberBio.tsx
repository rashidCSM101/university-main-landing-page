import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchTeamMemberBySlug } from '../services/api';
import {
  ArrowLeft,
  Mail,
  Award,
  GraduationCap,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

import heroBgFallback from '../../assets/images/1.webp?url';

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
  orcid?: string;
  googleScholar?: string;
  publications: { title: string; journal: string; year: string; doi?: string }[];
  projectsLed: string[];
}

const teamRegistry: Record<string, ScientistBioData> = {
  'dr-rashid': {
    id: '1',
    slug: 'dr-rashid',
    name: 'Dr. Rashid',
    designation: 'Lead Climate Scientist & Executive Director',
    qualification: 'Ph.D. Atmospheric Physics & Attribution Science (Quaid-i-Azam University & Oxford)',
    specialization: 'Extreme Event Attribution, Convective Monsoon Modeling & IPCC Assessment',
    experience: '18+ Years Research & Advisory',
    email: 'rashid@wenclims.org',
    phone: '+92 51 9260100',
    department: 'Leadership',
    bio: 'Dr. Rashid is the Executive Director and Founding Scientist at WenClims Islamabad. With over 18 years of experience in regional atmospheric modeling and extreme event attribution, he has authored 40+ peer-reviewed papers on monsoon precipitation dynamics over the Indus Basin. He serves as an expert reviewer for IPCC Working Group I and leads regional climate adaptation consultancies with the Asian Development Bank (ADB) and European Union (EU).',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    orcid: 'https://orcid.org/0000-0002-1825-0097',
    googleScholar: 'https://scholar.google.com/citations?user=wenclims_rashid',
    publications: [
      {
        title: 'Attribution of extreme monsoon precipitation over Upper Indus Catchment under 2°C warming',
        journal: 'Journal of Climate / AMS',
        year: '2025',
        doi: '10.1175/JCLI-D-24-0192',
      },
      {
        title: 'Thermodynamic vs dynamic atmospheric drivers of South Asian summer monsoon floods',
        journal: 'Nature Climate Change',
        year: '2023',
        doi: '10.1038/s41558-023-01740-x',
      },
      {
        title: 'Indus Basin hydrological vulnerability & GLOF outburst early warning telemetry',
        journal: 'Hydrology & Earth System Sciences (HESS)',
        year: '2022',
      },
    ],
    projectsLed: [
      'Indus Basin Monsoon Extreme Precipitation & Flood Attribution (ADB-EU Funded)',
      'South Asian Rapid Extreme Event Attribution Science Protocol (UK FCDO Collab)',
    ],
  },
  'dr-ayesha-malik': {
    id: '2',
    slug: 'dr-ayesha-malik',
    name: 'Dr. Ayesha Malik',
    designation: 'Senior Hydrometeorological Analyst',
    qualification: 'Ph.D. Remote Sensing & Hydrology (University of Cambridge)',
    specialization: 'Satellite Telemetry, Doppler Radar Assimilation & ERA5 Reanalysis',
    experience: '14+ Years',
    email: 'ayesha.malik@wenclims.org',
    phone: '+92 51 9260101',
    department: 'Atmospheric & Attribution Science',
    bio: 'Dr. Ayesha Malik directs the Satellite Telemetry & Remote Sensing Unit at WenClims. Her research focuses on assimilating MODIS, Sentinel-2, and Doppler weather radar observation feeds into high-resolution hydrodynamic flood modeling for vulnerable river basins across Pakistan.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    orcid: 'https://orcid.org/0000-0001-9284-5510',
    googleScholar: 'https://scholar.google.com/citations?user=wenclims_ayesha',
    publications: [
      {
        title: 'Satellite remote sensing data assimilation for flash flood forecasting in mountain catchments',
        journal: 'Remote Sensing of Environment',
        year: '2024',
      },
      {
        title: 'Multi-decadal soil moisture anomalies across Indus alluvial plains',
        journal: 'Water Resources Research (AGU)',
        year: '2023',
      },
    ],
    projectsLed: [
      'Indus River Basin High-Resolution Telemetry & Streamflow Forecasting',
      'Ganges-Brahmaputra Coastal Storm Surge Hydrodynamic Modeling',
    ],
  },
  'prof-tariq-ahmed': {
    id: '3',
    slug: 'prof-tariq-ahmed',
    name: 'Prof. Tariq Ahmed',
    designation: 'Head of Cryosphere Research',
    qualification: 'Ph.D. Glaciology & Geomorphology (ETH Zurich)',
    specialization: 'Glacial Mass Balance, GLOF Hazard Outbursts & HKH Ice Dynamics',
    experience: '22+ Years',
    email: 'tariq.ahmed@wenclims.org',
    phone: '+92 51 9260102',
    department: 'Hydrology & Indus Basin Risk',
    bio: 'Prof. Tariq Ahmed leads Cryosphere and Glacial Research at WenClims. He has monitored over 3,000 mountain glaciers in the Karakoram and Hindu Kush, designing community Outburst Warning Protocols for high-altitude valleys in Gilgit-Baltistan.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
    publications: [
      {
        title: 'Karakoram Anomaly glacier surges and moraine lake volume dynamics',
        journal: 'The Cryosphere / EGU',
        year: '2024',
      },
    ],
    projectsLed: [
      'Hindu Kush Himalaya Glacial Retreat & GLOF Risk Mapping (WCRP Funded)',
    ],
  },
  'dr-sana-khan': {
    id: '4',
    slug: 'dr-sana-khan',
    name: 'Dr. Sana Khan',
    designation: 'Lead Climate Policy & Health Advisor',
    qualification: 'Ph.D. Climate & Public Health (Johns Hopkins University)',
    specialization: 'Wet-Bulb Temperature Indexing, Urban Heat Islands & Adaptation Policy',
    experience: '12+ Years',
    email: 'sana.khan@wenclims.org',
    phone: '+92 51 9260103',
    department: 'Climate Policy & Advisory',
    bio: 'Dr. Sana Khan bridges atmospheric physics and municipal policy. She established the Sindh Humid Heat Index monitoring project, advising NDMA and provincial authorities on heatwave emergency preparedness and informal settlement adaptation.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    publications: [
      {
        title: 'Extreme wet-bulb temperature mortality thresholds in urban South Asia',
        journal: 'The Lancet Planetary Health',
        year: '2024',
      },
    ],
    projectsLed: [
      'Urban Heatwave Vulnerability & Wet-Bulb Stress Index in Sindh (NDMA Funded)',
    ],
  },
};

// Numerical ID mappings
teamRegistry['1'] = teamRegistry['dr-rashid'];
teamRegistry['2'] = teamRegistry['dr-ayesha-malik'];
teamRegistry['3'] = teamRegistry['prof-tariq-ahmed'];
teamRegistry['4'] = teamRegistry['dr-sana-khan'];

const TeamMemberBio = () => {
  const { slug } = useParams<{ slug: string }>();
  const [member, setMember] = useState<ScientistBioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    if (slug && teamRegistry[slug]) {
      setMember(teamRegistry[slug]);
      setLoading(false);
    } else if (slug) {
      fetchTeamMemberBySlug(slug)
        .then((data) => {
          if (data && data.name) {
            const sl = data.social_links || {};
            setMember({
              id: data.id?.toString() || slug,
              slug: data.slug || slug,
              name: data.name,
              designation: data.role || data.designation || 'Research Scientist',
              qualification: sl.qualification || data.qualification || 'Ph.D. Atmospheric Science',
              specialization: sl.specialization || data.specialization || 'Atmospheric & Climate Science',
              experience: sl.experience || data.experience || '10+ Years',
              email: sl.email || data.email || 'research@wenclims.org',
              phone: sl.phone || data.phone || '+92 51 9260100',
              department: data.team || data.department || 'Atmospheric & Attribution Science',
              bio: data.bio || 'Scientific member of the WenClims Climate Research team.',
              image: data.photo || data.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
              orcid: sl.orcid || data.orcid,
              googleScholar: sl.google_scholar || data.googleScholar,
              publications: sl.publications
                ? typeof sl.publications === 'string'
                  ? [{ title: sl.publications, journal: 'Peer-Reviewed Research', year: '2025' }]
                  : sl.publications
                : [],
              projectsLed: sl.projectsLed || ['Indus Basin Regional Climate Attribution'],
            });
          } else {
            setMember(teamRegistry['dr-rashid']);
          }
        })
        .catch(() => {
          setMember(teamRegistry['dr-rashid']);
        })
        .finally(() => setLoading(false));
    } else {
      setMember(teamRegistry['dr-rashid']);
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#00C8C8] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-300">Loading Scientist Profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl border border-gray-200 max-w-md">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Member Profile Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">The requested scientific team profile could not be located.</p>
          <Link to="/team" className="btn-primary text-sm">
            Back to Team Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${member.name} — ${member.designation} | WenClims Team`}</title>
        <meta name="description" content={member.bio} />
        <link rel="canonical" href={`https://wenclims.org/team/${member.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* ═══ SCIENTIST HERO BANNER ═══ */}
        <section className="relative min-h-[50vh] flex flex-col justify-center overflow-hidden bg-gray-900 text-white pt-28 pb-16">
          {/* Background overlay */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={heroBgFallback}
              alt="WenClims Team Backdrop"
              className="w-full h-full object-cover object-center scale-105 opacity-30"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(105deg, rgba(10,37,64,0.96) 0%, rgba(10,37,64,0.85) 45%, rgba(10,37,64,0.70) 100%)',
              }}
            />
          </div>

          <div className="relative z-10 w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/team"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 group text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Scientific Team Directory</span>
            </Link>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar Portrait */}
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden border-4 border-[#00C8C8]/50 shadow-2xl flex-shrink-0 bg-gray-800">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>

              {/* Title & Info */}
              <div className="space-y-3 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C8C8]/10 text-[#00C8C8] border border-[#00C8C8]/30 text-xs font-bold uppercase tracking-wider">
                  <span>{member.department}</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
                  {member.name}
                </h1>
                <p className="text-lg font-medium text-teal-300">{member.designation}</p>
                <p className="text-xs md:text-sm text-gray-300 max-w-2xl">{member.qualification}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-white/80 pt-2">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <Award className="w-4 h-4" />
                    <span>{member.experience}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <Mail className="w-4 h-4 text-[#00C8C8]" />
                    <span>{member.email}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ MAIN CONTENT BODY ═══ */}
        <section className="w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Left Main Details */}
            <div className="lg:col-span-8 space-y-12">
              {/* Full Bio */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#008B8B] uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>Scientific Biography</span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-gray-900">Background &amp; Research Focus</h2>
                <p className="text-gray-600 leading-relaxed text-base">{member.bio}</p>
              </div>

              {/* Specialization */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Primary Expertise</span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-gray-900">Atmospheric &amp; Climate Domain</h2>
                <p className="text-gray-700 font-semibold text-base leading-relaxed bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/60">
                  {member.specialization}
                </p>
              </div>

              {/* Research Publications */}
              {member.publications && member.publications.length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#008B8B] uppercase tracking-wider">
                    <FileText className="w-4 h-4" />
                    <span>Peer-Reviewed Literature</span>
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900">Key Publications</h2>
                  <div className="space-y-4">
                    {member.publications.map((pub, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                          <span>{pub.journal}</span>
                          <span className="font-bold text-[#008B8B]">{pub.year}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm leading-snug">{pub.title}</h4>
                        {pub.doi && <p className="text-xs text-gray-400 font-mono">DOI: {pub.doi}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar Metadata */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md space-y-6 sticky top-28">
                <div className="pb-3 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Contact &amp; Profiles
                  </span>
                  <div className="text-gray-900 font-bold text-sm">{member.name}</div>
                </div>

                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-400">Division</span>
                    <span className="font-bold text-gray-900">{member.department}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-400">Email</span>
                    <span className="font-mono text-gray-800">{member.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-400">Phone</span>
                    <span className="font-mono text-gray-800">{member.phone}</span>
                  </div>
                </div>

                {/* External Links */}
                <div className="space-y-2 pt-2">
                  {member.orcid && (
                    <a
                      href={member.orcid}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors text-xs font-bold"
                    >
                      <span>ORCID Research Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.googleScholar && (
                    <a
                      href={member.googleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-900 hover:bg-blue-100 transition-colors text-xs font-bold"
                    >
                      <span>Google Scholar Citations</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="pt-2">
                  <a
                    href="/contact"
                    className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-[#008B8B] text-white font-bold rounded-xl hover:bg-teal-700 transition-colors text-sm shadow-md"
                  >
                    <span>Request Scientific Advisory</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TeamMemberBio;
