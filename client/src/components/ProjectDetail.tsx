import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchProjectBySlug } from '../services/api';
import {
  ArrowLeft,
  Calendar,
  Globe2,
  Building2,
  CheckCircle2,
  FileText,
  Download,
  ShieldCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';

import heroBgFallback from '../../assets/images/1.webp?url';

export interface ProjectDetailData {
  id: string;
  title: string;
  funder_name: string;
  funder_code: string;
  region: string;
  status: 'active' | 'completed' | 'upcoming';
  start_date: string;
  end_date: string;
  leadInstitution: string;
  overview: string;
  problemStatement: string;
  objectives: string[];
  dataStreams: string[];
  outcomes: string[];
  thumbnail: string;
}

const projectsDatabase: Record<string, ProjectDetailData> = {
  '1': {
    id: '1',
    title: 'Indus Basin Monsoon Extreme Precipitation & Flood Attribution',
    funder_name: 'Asian Development Bank (ADB) & European Union (EU)',
    funder_code: 'ADB-EU-2025',
    region: 'Indus River Basin, Pakistan',
    status: 'active',
    start_date: 'Jan 2025',
    end_date: 'Dec 2027',
    leadInstitution: 'WenClims Atmospheric Modeling Team & PMD',
    overview: 'This flagship 3-year research initiative combines state-of-the-art climate attribution science with high-resolution hydrological modeling across upper and lower Indus catchments. By analyzing 40+ years of ERA5 reanalysis and high-resolution WRF atmospheric simulations, the project isolates human-induced climate warming from natural monsoon variability.',
    problemStatement: 'The Indus Basin experiences severe monsoon extreme rainfall events causing catastrophic flooding and socioeconomic dislocation. Decision-makers require rapid, peer-reviewed attribution evidence to justify climate adaptation investments and loss-and-damage funding.',
    objectives: [
      'Evaluate greenhouse gas forcing contribution to 5-day extreme convective monsoon precipitation events.',
      'Produce 10m-resolution flood hazard maps and early warning risk indicators for vulnerable riverine districts.',
      'Formulate actionable policy briefs for provincial disaster management authorities (PDMA Sindh & Punjab).',
      'Train 50+ local atmospheric scientists in extreme event attribution methodology.',
    ],
    dataStreams: [
      'ERA5 Reanalysis Data (1979 – Present)',
      'High-Resolution WRF Atmospheric Modeling (3km Grid)',
      'NASA TERRA & AQUA MODIS Satellite Hydrological Products',
      'Indus River System Authority (IRSA) Daily Discharge Telemetry',
    ],
    outcomes: [
      'Interactive Indus Basin Flood Hazard & Attribution Web Portal.',
      'Peer-reviewed research paper submitted to Nature Climate Change.',
      'Policy Roadmap for Disaster Resilient Infrastructure in Sindh.',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
  },
  '2': {
    id: '2',
    title: 'Hindu Kush Himalaya Glacial Retreat & GLOF Risk Mapping',
    funder_name: 'World Climate Research Programme (WCRP)',
    funder_code: 'WCRP-HKH-04',
    region: 'Gilgit-Baltistan & Khyber Pakhtunkhwa',
    status: 'active',
    start_date: 'Jun 2024',
    end_date: 'May 2027',
    leadInstitution: 'WenClims Cryosphere Unit & ICIMOD',
    overview: 'Deploying high-resolution satellite remote sensing to track glacial mass balance and monitor over 3,000 glacial lakes across Pakistan’s northern mountain ranges. The project models potential Glacial Lake Outburst Flood (GLOF) outburst hydrographs to safeguard downstream mountain communities.',
    problemStatement: 'Rapid thermal warming in the Hindu Kush Himalaya has accelerated glacial melt, expanding dangerous moraine-dammed lakes that threaten mountain infrastructure, bridges, and villages with sudden GLOF events.',
    objectives: [
      'Map multi-decadal retreat rates for 500+ key glaciers in Hunza, Gilgit, and Swat valleys.',
      'Develop real-time hydrograph outburst simulation tools for 30 high-risk glacial lakes.',
      'Establish community-level early warning notification networks in mountain valleys.',
    ],
    dataStreams: [
      'Sentinel-2 & Landsat-9 High-Resolution Satellite Imagery',
      'ICESat-2 Laser Altimetry Mass Balance Datasets',
      'Automated Weather Station (AWS) Telemetry in High-Altitude Valleys',
    ],
    outcomes: [
      'Glacial Lake Outburst Risk Inventory & GIS Hazard Atlas.',
      'Early Warning Alert Telemetry system deployed in Hunza & Shigar valleys.',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  },
  '3': {
    id: '3',
    title: 'Urban Heatwave Vulnerability & Wet-Bulb Stress Index in Sindh',
    funder_name: 'National Disaster Management Authority (NDMA)',
    funder_code: 'NDMA-HEAT-2024',
    region: 'Karachi, Hyderabad & Larkana Division',
    status: 'completed',
    start_date: 'Mar 2024',
    end_date: 'Oct 2025',
    leadInstitution: 'WenClims Urban Climate & Health Lab',
    overview: 'Investigating pre-monsoon humid heatwaves in Sindh, establishing critical wet-bulb temperature thresholds (TW > 35°C) where human thermoregulation fails. The project created urban heat island maps for Karachi and Hyderabad to target cool-roof interventions.',
    problemStatement: 'Extreme summer heatwaves in southern Pakistan disproportionately impact outdoor laborers and urban informal settlements. Conventional air temperature metrics underrepresent severe humid heat stress.',
    objectives: [
      'Map urban microclimate temperature gradients across 18 municipal zones in Karachi.',
      'Evaluate wet-bulb globe temperature (WBGT) mortality risk thresholds.',
      'Design municipal Heat Action Plans with urban forestry and cooling center priorities.',
    ],
    dataStreams: [
      'ECOSTRESS Land Surface Temperature Satellite Data',
      'Urban Telemetry Sensor Network (25 Monitoring Stations)',
      'Hospital Heatstroke Admission Records & Demographic Datasets',
    ],
    outcomes: [
      'Karachi & Sindh Municipal Heat Action Plan 2025.',
      'Public Wet-Bulb Temperature Warning Dashboard.',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?auto=format&fit=crop&w=1200&q=80',
  },
  '4': {
    id: '4',
    title: 'South Asian Renewable Energy Integration & Atmospheric Atlas',
    funder_name: 'ADB Clean Energy Transition Fund',
    funder_code: 'ADB-RE-2026',
    region: 'Balochistan & Southern Punjab Corridors',
    status: 'upcoming',
    start_date: 'Jan 2026',
    end_date: 'Dec 2028',
    leadInstitution: 'WenClims Renewable Telemetry Division',
    overview: 'Mapping multi-decadal solar irradiance and wind velocity variability across potential clean power corridors in Balochistan. Provides atmospheric data modeling to assess climate change impacts on solar PV degradation and wind turbine output.',
    problemStatement: 'Clean energy investments require high-precision, long-term atmospheric data to model renewable power generation reliability and grid stability under future climate scenarios.',
    objectives: [
      'Produce 1km-resolution solar GHI (Global Horizontal Irradiance) and wind atlas for Pakistan.',
      'Model climate warming impacts on solar panel temperature efficiency drops.',
      'Provide open API access to power grid planners and renewable energy developers.',
    ],
    dataStreams: [
      'ERA5 & MERRA-2 Solar Irradiance Reanalysis',
      'High-Altitude Wind Telemetry Anemometer Towers',
    ],
    outcomes: [
      'Open-Access South Asia Clean Energy Atmospheric GIS Atlas.',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
  },
};

// Aliases for map ISO codes (pk-1, pk-2, bd-1, etc.)
projectsDatabase['pk-1'] = projectsDatabase['1'];
projectsDatabase['pk-2'] = projectsDatabase['2'];
projectsDatabase['pk-3'] = projectsDatabase['3'];
projectsDatabase['pk-4'] = projectsDatabase['4'];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    if (id && projectsDatabase[id]) {
      setProject(projectsDatabase[id]);
      setLoading(false);
    } else if (id) {
      fetchProjectBySlug(id)
        .then((data) => {
          if (data && data.title) {
            setProject(data);
          } else {
            setProject(projectsDatabase['1']);
          }
        })
        .catch(() => {
          setProject(projectsDatabase['1']);
        })
        .finally(() => setLoading(false));
    } else {
      setProject(projectsDatabase['1']);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#00C8C8] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-300">Loading Project Details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl border border-gray-200 max-w-md">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">The requested climate research project could not be located.</p>
          <Link to="/projects" className="btn-primary text-sm">
            Back to All Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${project.title} | Climate Projects — WenClims`}</title>
        <meta name="description" content={project.overview} />
        <link rel="canonical" href={`https://wenclims.org/projects/${project.id}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* ═══ PROJECT HERO BANNER ═══ */}
        <section className="relative min-h-[55vh] flex flex-col justify-center overflow-hidden bg-gray-900 text-white pt-28 pb-16">
          {/* Background Image & Overlays */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={project.thumbnail || heroBgFallback}
              alt={project.title}
              className="w-full h-full object-cover object-center scale-105"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(105deg, rgba(10,37,64,0.96) 0%, rgba(10,37,64,0.85) 45%, rgba(10,37,64,0.65) 100%)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(5,20,40,0.98) 0%, transparent 80%)',
              }}
            />
          </div>

          <div className="relative z-10 w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 group text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Projects Catalog</span>
            </Link>

            {/* Funder Pill & Status */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[#00C8C8]/50 text-[#00C8C8] bg-[#00C8C8]/10">
                {project.funder_name}
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border ${
                  project.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : project.status === 'completed'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                ● {project.status}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-tight max-w-4xl">
              {project.title}
            </h1>

            {/* Quick Metadata Bar */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/80 pt-4 border-t border-white/15 max-w-3xl">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#00C8C8]" />
                <span>{project.region}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00C8C8]" />
                <span>{project.start_date} – {project.end_date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00C8C8]" />
                <span className="font-mono text-xs text-white/60">Code: {project.funder_code}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ MAIN CONTENT BODY (2-Column Grid) ═══ */}
        <section className="w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* ── LEFT COLUMN: Full Research Details ── */}
            <div className="lg:col-span-8 space-y-12">
              {/* Executive Overview */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#48b302] uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  <span>Executive Overview</span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-gray-900">Project Scope &amp; Summary</h2>
                <p className="text-gray-600 leading-relaxed text-base">{project.overview}</p>
              </div>

              {/* Problem Statement */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Regional Climate Impact</span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-gray-900">Problem Statement &amp; Vulnerability</h2>
                <p className="text-gray-600 leading-relaxed text-base">{project.problemStatement}</p>
              </div>

              {/* Research Objectives */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#48b302] uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Core Research Objectives</span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-gray-900">Deliverables &amp; Targets</h2>
                <div className="space-y-4">
                  {project.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-3.5 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-7 h-7 rounded-xl bg-[#48b302]/10 text-[#48b302] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        0{i + 1}
                      </div>
                      <p className="text-gray-700 text-sm font-medium leading-relaxed">{obj}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Streams & Methodology */}
              {project.dataStreams && project.dataStreams.length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>Atmospheric Telemetry</span>
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900">Data Streams &amp; Observation Inputs</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.dataStreams.map((stream, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 text-indigo-950 font-medium text-xs">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span>{stream}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN: Metadata & Collaboration Card ── */}
            <div className="lg:col-span-4 space-y-6">
              {/* Partner & Metadata Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md space-y-6 sticky top-28">
                <div className="pb-4 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Lead Research Institution
                  </span>
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                    <Building2 className="w-4 h-4 text-[#48b302]" />
                    <span>{project.leadInstitution}</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-400">Funding Agency</span>
                    <span className="font-bold text-gray-900">{project.funder_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-400">Grant Identifier</span>
                    <span className="font-mono font-bold text-gray-900">{project.funder_code}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-400">Project Status</span>
                    <span className="font-bold capitalize text-emerald-600">{project.status}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-400">Duration</span>
                    <span className="font-bold text-gray-900">{project.start_date} – {project.end_date}</span>
                  </div>
                </div>

                {/* Call to Action Buttons */}
                <div className="space-y-3 pt-2">
                  <a
                    href="/contact"
                    className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-[#48b302] text-white font-bold rounded-xl hover:bg-teal-700 transition-colors text-sm shadow-md"
                  >
                    <span>Request Collaboration</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="/contact"
                    className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-xs"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                    <span>Download Policy Brief (PDF)</span>
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

export default ProjectDetail;
