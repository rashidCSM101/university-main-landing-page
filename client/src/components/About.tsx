import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ExternalLink,
  Play,
  PhoneCall,
  Sparkles,
  Database,
  CheckCircle2,
} from 'lucide-react';

import visionHeroImg from '../../assets/images/vision-hero.avif?url';

gsap.registerPlugin(ScrollTrigger);

const capabilitiesList = [
  'Multi-hazard climate risk assessments (heatwaves, flooding, droughts, extreme precipitation etc.)',
  'Hazard, exposure, vulnerability analysis following IPCC methodology',
  'Heat stress assessments including wet-bulb temperatures etc',
  'Risk classification matrices for infrastructure and development projects',
  'Development of Climate Risk Management Frameworks',
  'National and Provincial Climate policies analysis',
  'Training workshops on risk assessment and adaptation planning',
  'Hydrological modelling for glacier flow, river discharge, and flood hotspots',
];

const climateDataSources = [
  { name: 'Climate Risk Assessment Information sources', url: 'https://www.climaterisk.org' },
  { name: 'Principles of Climate Risk Management for Climate Proofing Projects', url: 'https://www.adb.org' },
  { name: 'IPCC Fifth Assessment report AR5', url: 'https://www.ipcc.ch/report/ar5/' },
  { name: 'Climate Change Knowledge portal, World Bank', url: 'https://climateknowledgeportal.worldbank.org/' },
  { name: 'Google Earth Engine', url: 'https://earthengine.google.com/' },
  { name: 'ERA5 Reanalysis', url: 'https://cds.climate.copernicus.eu/' },
];

const toolsAndDashboards = [
  { name: 'IPCC WGI Interactive Atlas', url: 'https://interactive-atlas.ipcc.ch/' },
  { name: 'Copernicus Climate Data Store', url: 'https://cds.climate.copernicus.eu/' },
  { name: 'Think Hazard', url: 'https://thinkhazard.org/' },
  { name: 'PROVIDE Climate Risk Dashboard', url: 'https://www.provide-h2020.eu/' },
  { name: 'Regional climate model projection Tool', url: 'https://www.climate-projections.org/' },
  { name: 'Heat stress Forecasting Dashboard (MET)', url: 'https://www.metoffice.gov.uk/' },
];

const About = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [bgImage, setBgImage] = useState<string>(visionHeroImg);
  const [drFahadImg, setDrFahadImg] = useState<string>('/assets/images/Dr Fahad Saeed.jpeg');

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        '.anim-hero > *',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );

      // Section blocks entrance
      gsap.fromTo(
        '.anim-block',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.anim-content-area',
            start: 'top 85%',
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Services &amp; Solutions | WenClims — Weather and Climate Services</title>
        <meta
          name="description"
          content="Integrated climate risk & adaptation assessments, wet-bulb heat stress telemetry, policy governance, and climate data analytics by WenClims."
        />
        <link rel="canonical" href="https://wenclims.org/services" />
      </Helmet>

      {/* Clean Light Background to remove stark floating boxes on black */}
      <div ref={pageRef} className="min-h-screen bg-slate-50 font-sans text-gray-900 relative selection:bg-[#48b302] selection:text-gray-950">
        
        {/* ═══ FLOATING CONTACT BUTTON (Fixed Bottom-Right) ═══ */}
        <Link
          to="/contact"
          className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-full bg-[#48b302] hover:bg-[#3ea002] text-gray-950 font-extrabold text-xs uppercase tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 border-2 border-white group"
          title="Get in Touch with WCS Experts"
        >
          <PhoneCall className="w-4 h-4 text-gray-950 animate-bounce" />
          <span className="hidden sm:inline">Contact WCS</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* ═══ HERO BANNER ═══ */}
        <section className="relative pt-36 md:pt-44 pb-20 overflow-hidden bg-[#071328] text-white border-b border-gray-800">
          <div className="absolute inset-0 z-0">
            <img
              src={bgImage}
              alt="Services Background"
              onError={() => setBgImage(visionHeroImg)}
              className="w-full h-full object-cover filter brightness-40 contrast-125 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#071328]/95 via-[#071328]/85 to-[#071328]" />
            <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#48b302]/20 blur-3xl" />
          </div>

          <div className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="anim-hero max-w-4xl space-y-6">
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#48b302]/40 bg-[#48b302]/15 backdrop-blur-md text-[#48b302] text-xs font-extrabold uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5 text-[#48b302]" />
                <span>Integrated Environmental Solutions</span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white leading-tight">
                Our Services — <span className="text-[#48b302]">What We Do</span>
              </h1>

              {/* Exact Intro Paragraph */}
              <p className="text-base md:text-xl text-gray-200 font-light leading-relaxed max-w-3xl">
                At <strong className="text-white font-semibold">WCS</strong>, we provide integrated weather, climate, and environmental solutions in the field of <span className="text-[#48b302] font-medium">energy, water and climate change</span> to help stakeholders make informed decisions, reduce climate risks, and build long-term climate resilience. Our services combine scientific expertise with climate modelling, advanced data analytics, climate risk and vulnerability assessments and climate change services dashboards to deliver actionable insights.
              </p>

              {/* Quick Jump Section Anchors */}
              <div className="flex flex-wrap items-center gap-2.5 pt-4">
                <a
                  href="#capabilities"
                  className="px-4 py-2 rounded-xl bg-[#48b302] text-gray-950 font-bold text-xs uppercase tracking-wider hover:bg-[#3ea002] transition-all shadow-md"
                >
                  Our Capabilities
                </a>
                <a
                  href="#climate-risk"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold backdrop-blur-md transition-all"
                >
                  Climate Risk Assessment
                </a>
                <a
                  href="#governance"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold backdrop-blur-md transition-all"
                >
                  Policy &amp; Governance
                </a>
                <a
                  href="#wet-bulb"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold backdrop-blur-md transition-all"
                >
                  Wet-Bulb Telemetry
                </a>
                <a
                  href="#data-sources"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold backdrop-blur-md transition-all"
                >
                  Data Sources &amp; Tools
                </a>
                <a
                  href="#quote"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold backdrop-blur-md transition-all"
                >
                  Expert Quote
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ MAIN CONTENT AREA (Clean Light Page Flow) ═══ */}
        <div className="anim-content-area max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

          {/* ── SECTION 1: OUR CAPABILITIES INCLUDE / WE DELIVER ── */}
          <section id="capabilities" className="anim-block space-y-8">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#48b302] rounded-full" />
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#48b302]">Scope of Advisory</span>
                <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-gray-900">
                  Our capabilities include / We deliver:
                </h2>
              </div>
            </div>

            {/* Clean Grid directly on background */}
            <div className="grid md:grid-cols-2 gap-4">
              {capabilitiesList.map((item, idx) => (
                <div
                  key={idx}
                  className="group p-6 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-[#48b302] hover:-translate-y-1 transition-all duration-300 flex items-start gap-4"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#48b302]/15 text-[#48b302] font-black text-sm flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#48b302] group-hover:text-gray-950 transition-colors shadow-inner">
                    0{idx + 1}
                  </div>
                  <span className="text-xs md:text-sm font-bold text-gray-800 leading-relaxed group-hover:text-gray-950">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 2: CLIMATE RISK & ADAPTATION ASSESSMENT ── */}
          <section id="climate-risk" className="anim-block bg-white rounded-3xl p-8 md:p-12 border border-gray-200/90 shadow-xl text-gray-900 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-8 bg-[#48b302] rounded-full" />
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#48b302]">Technical Framework</span>
                <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-gray-900">
                  Climate Risk &amp; Adaptation Assessment
                </h2>
              </div>
            </div>

            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8 font-light max-w-4xl">
              We provide clear, actionable insights for climate-resilient infrastructure and development planning using state-of-the-art modelling tools and multi-scenario climate projections. The services includes:
            </p>

            <div className="space-y-6">
              {/* Highlight Banner: Joint MDB */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#48b302]/10 via-emerald-50 to-teal-50 border border-[#48b302]/30 hover:border-[#48b302] transition-all">
                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-[#48b302] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-900 text-sm md:text-base leading-relaxed font-semibold">
                    Provision of technical assistance using the BB2 assessment criteria of Joint MDB Methodological Framework for the Assessment of Paris Alignment and ADB’s Climate Risk Assessment Framework.
                  </p>
                </div>
              </div>

              {/* Highlight Card: Formulation of CRA Report */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-6">
                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-[#48b302] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-900 text-sm md:text-base leading-relaxed font-semibold">
                    Formulation of a comprehensive Climate Risk Assessment report following the IPCC risk assessment framework and ADB’s Climate Risk Assessment Framework, covering:
                  </p>
                </div>

                {/* Sub-cards a, b, c, d */}
                <div className="grid sm:grid-cols-2 gap-4 pl-0 sm:pl-9">
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-[#48b302] hover:shadow-md transition-all">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-[#48b302]/15 text-[#48b302] font-black text-xs mb-2">
                      a
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      Detailed historic and projected climate hazard using online tools.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-[#48b302] hover:shadow-md transition-all">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-[#48b302]/15 text-[#48b302] font-black text-xs mb-2">
                      b
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      The exposure and vulnerability assessment of all hazards for the project components.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-[#48b302] hover:shadow-md transition-all">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-[#48b302]/15 text-[#48b302] font-black text-xs mb-2">
                      c
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      Component-wise climate risk matrix that classified the risk by each hazard as extreme/moderate/low based on the vulnerability and exposure.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-[#48b302] hover:shadow-md transition-all">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-[#48b302]/15 text-[#48b302] font-black text-xs mb-2">
                      d
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      Tailored adaptation measures and implementation timelines.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: POLICY ANALYSIS AND CLIMATE GOVERNANCE ── */}
          <section id="governance" className="anim-block bg-[#071328] text-white rounded-3xl p-8 md:p-12 border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-8 bg-[#48b302] rounded-full" />
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#48b302]">Government Advisory</span>
                <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-white">
                  Policy Analysis and Climate Governance
                </h2>
              </div>
            </div>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 font-light max-w-4xl">
              Supporting the Government of Pakistan in strengthening intergovernmental coordination and improving the implementation of national climate policies. The work focuses on identifying policy gaps, institutional inefficiencies, and opportunities to enhance climate governance for more effective national action. This includes:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Comprehensive review of Pakistan’s climate policies and governance frameworks across national and provincial levels.",
                "Assessment of institutional roles, coordination mechanisms, and implementation challenges.",
                "Comparative analysis of Pakistan’s climate governance structure against international best practices.",
                "Stakeholder consultations through workshops, interviews, and focus groups to gather insights and build consensus.",
                "Development of clear, actionable recommendations to strengthen climate governance and improve policy coherence.",
              ].map((text, i) => (
                <div
                  key={i}
                  className="group p-5 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-[#48b302]/60 hover:bg-[#0B1E3D] transition-all duration-300 flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#48b302]/20 text-[#48b302] font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#48b302] group-hover:text-gray-950 transition-colors shadow-inner">
                    0{i + 1}
                  </div>
                  <p className="text-xs md:text-sm font-medium text-gray-200 leading-relaxed group-hover:text-white">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 4: WET-BULB TEMPERATURE & PHYSIOLOGICAL RISK ANALYSIS ── */}
          <section id="wet-bulb" className="anim-block bg-gradient-to-br from-[#071328] via-[#0B1E3D] to-teal-950 text-white rounded-3xl p-8 md:p-12 border border-[#48b302]/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-8 bg-[#48b302] rounded-full" />
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#48b302]">Thermal Telemetry</span>
                <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-white">
                  Wet-Bulb Temperature &amp; Physiological Risk Analysis
                </h2>
              </div>
            </div>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light max-w-4xl">
              We assess human survivability thresholds using wet-bulb temperature (Tw), identifying regions and time periods where heat exposure becomes dangerous or life-threatening. In order to access how temperature, humidity, and wet-bulb temperature influence human activity we integrate meteorological data with human thermophysiological models. This allows real time monitoring among climatic attributes and safe activity limits.
            </p>
          </section>

          {/* ── SECTION 5: RECOGNIZED DATA SOURCES & TOOLS (INSIGHTS) ── */}
          <section id="data-sources" className="anim-block bg-white rounded-3xl p-8 md:p-12 border border-gray-200/90 shadow-xl text-gray-900 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-8 bg-[#48b302] rounded-full" />
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#48b302]">Insights Directory</span>
                <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-gray-900">
                  Recognized Data Sources, Models &amp; Scientific References
                </h2>
              </div>
            </div>

            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 font-light">
              Below are the links of our data sources, research portals, international climate frameworks, research portals and dashboards etc:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Climate Data Sources */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                  <Database className="w-4 h-4 text-[#48b302]" />
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                    Climate Data Sources
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {climateDataSources.map((ds, idx) => (
                    <a
                      key={idx}
                      href={ds.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-gray-200 hover:border-[#48b302] hover:bg-[#48b302]/10 transition-all text-xs font-semibold text-gray-800 hover:text-gray-950 shadow-2xs"
                    >
                      <span className="truncate pr-2">{ds.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#48b302] flex-shrink-0 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Tools & Dashboards */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                    Tools &amp; Dashboards
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {toolsAndDashboards.map((tool, idx) => (
                    <a
                      key={idx}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition-all text-xs font-semibold text-gray-800 hover:text-gray-950 shadow-2xs"
                    >
                      <span className="truncate pr-2">{tool.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-sky-600 flex-shrink-0 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 6: SCIENTIFIC QUOTE CARD (Exact Design Replica) ── */}
          <section id="quote" className="anim-block bg-white text-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-gray-200">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
              {/* Left Column: Round Photo + Video Play Icon Badge + Name & Title */}
              <div className="flex flex-col items-center text-center flex-shrink-0">
                <div className="relative w-44 h-44 mb-4">
                  <img
                    src={drFahadImg}
                    alt="Dr Fahad Saeed"
                    onError={() => {
                      if (drFahadImg !== '/assets/images/dr-fahad-saeed.png') {
                        setDrFahadImg('/assets/images/dr-fahad-saeed.png');
                      }
                    }}
                    className="w-full h-full rounded-full object-cover filter grayscale contrast-125 shadow-md border-2 border-gray-200"
                  />
                  {/* Video Play Badge matching attached screenshot */}
                  <div className="absolute bottom-1 right-1 w-10 h-10 rounded-xl bg-[#d97706] text-white flex items-center justify-center shadow-lg border-2 border-white">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                <h4 className="text-xl font-heading font-extrabold text-[#1e3a8a] italic tracking-tight mb-0.5">
                  Dr Fahad Saeed
                </h4>
                <p className="text-xs font-medium text-gray-600 italic">
                  Senior Climate Scientist
                </p>
                <p className="text-xs font-medium text-gray-600 italic">
                  Climate Analytics
                </p>
              </div>

              {/* Right Column: Exact Quoted Text */}
              <div className="flex-1 self-center">
                <blockquote className="text-base md:text-xl text-gray-900 font-serif italic leading-relaxed font-normal">
                  “1.5 °C limit is not a symbolic benchmark. It is the enduring and legally significant goal of Paris Agreement. It is established to avoid the most dangerous impacts of climate change and in that sense is set as the ethical and moral limit. Exceeding it would significantly increase the likelihood of severe, widespread and in some cases irreversible impacts.”
                </blockquote>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default About;
