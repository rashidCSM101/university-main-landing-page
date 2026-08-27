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
  // CheckCircle2,
} from 'lucide-react';

import visionHeroImg from '../../assets/images/vision-hero.avif?url';

gsap.registerPlugin(ScrollTrigger);

const capabilitiesList = [
  'Multi-hazard climate risk assessments (heatwaves, flooding, droughts, extreme precipitation etc.)',
  'Heat stress assessments including wet-bulb temperatures etc',
  'Risk classification matrices for infrastructure and development projects',
  'Development of Climate Risk Management Frameworks',
  'National and Provincial Climate policies analysis',
  'Training workshops on risk assessment and adaptation planning',
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
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out' }
      );

      // Hero background image parallax scrub
      gsap.to('.vision-hero-bg', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.anim-hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      // Continuous subtle float on floating contact button
      gsap.to('.floating-contact-btn', {
        y: -6,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Section blocks entrance
      gsap.utils.toArray('.anim-block').forEach((block: any) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
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
          className="floating-contact-btn fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-full bg-[#0B1E3D] hover:bg-teal-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 border-2 border-white group"
          title="Get in Touch with WCS Experts"
        >
          <PhoneCall className="w-4 h-4 text-[#00C8C8] animate-bounce" />
          <span className="hidden sm:inline">Contact WCS</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* ═══ HERO BANNER ═══ */}
        <section className="anim-hero-section relative pt-36 md:pt-44 pb-20 overflow-hidden bg-[#071328] text-white border-b border-gray-800">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={bgImage}
              alt="Services Background"
              onError={() => setBgImage(visionHeroImg)}
              className="vision-hero-bg w-full h-full object-cover filter brightness-40 contrast-125 scale-105 will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#071328]/95 via-[#071328]/85 to-[#071328]" />
            <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />
          </div>

          <div className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="anim-hero max-w-4xl space-y-6">
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/40 backdrop-blur-md text-teal-300 text-xs font-extrabold uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                <span>Integrated Environmental Solutions</span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white leading-tight">
                Our Services — <span className="text-teal-300">What We Do</span>
              </h1>

              {/* Exact Intro Paragraph */}
              <p className="text-base md:text-xl text-gray-200 font-light leading-relaxed max-w-3xl">
                At <strong className="text-white font-semibold">WCS</strong>, we provide integrated weather, climate, and environmental solutions in the field of <span className="text-teal-300 font-medium">energy, water and climate change</span> to help stakeholders make informed decisions, reduce climate risks, and build long-term climate resilience. Our services combine scientific expertise with climate modelling, advanced data analytics, climate risk and vulnerability assessments and climate change services dashboards to deliver actionable insights.
              </p>

              {/* Quick Jump Section Anchors */}
              <div className="flex flex-wrap items-center gap-2.5 pt-4">
                <a
                  href="#capabilities"
                  className="px-4 py-2 rounded-xl bg-teal-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-teal-800 transition-all shadow-md"
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
              </div>
            </div>
          </div>
        </section>

        {/* ═══ MAIN CONTENT AREA (Executive 2-Column Split Flow) ═══ */}
        <div className="anim-content-area max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Top Section 1: Scope of Advisory & Capabilities */}
          <section id="capabilities" className="anim-block space-y-8 mb-16">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#0B1E3D] rounded-full" />
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800">Scope of Advisory</span>
                <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-gray-950">
                  Our capabilities include / We deliver:
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {capabilitiesList.map((item, idx) => (
                <div
                  key={idx}
                  className="capability-sparkle-card group p-5 bg-white border border-gray-200/90 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-start gap-3.5 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#48b302]/15 text-[#48b302] font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#48b302] group-hover:text-gray-950 transition-colors shadow-inner">
                    0{idx + 1}
                  </div>
                  <span className="text-xs md:text-sm font-bold text-gray-800 leading-relaxed group-hover:text-gray-950 transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ── 2-COLUMN SPLIT: LEFT CONTENT & RIGHT STICKY LINKS SIDEBAR ── */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-8 border-t border-gray-200">
            
            {/* ── LEFT COLUMN: TECHNICAL FRAMEWORKS, GOVERNANCE & TELEMETRY (Col 8 of 12) ── */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* SECTION 2: CLIMATE RISK & ADAPTATION ASSESSMENT */}
              <section id="climate-risk" className="anim-block space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-[#0B1E3D] rounded-full" />
                    <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800">Technical Framework</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-950">
                    Climate Risk &amp; Adaptation Assessment
                  </h2>
                </div>

                <p className="text-gray-800 text-sm md:text-base leading-relaxed font-normal">
                  We provide clear, actionable insights for climate-resilient infrastructure and development planning using state-of-the-art modelling tools and multi-scenario climate projections.
                </p>

                {/* Advisory Standard Callout */}
                <div className="border-l-2 border-[#0B1E3D] pl-5 py-2 space-y-1.5 bg-slate-50/70 p-4 rounded-r-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Assessment Standard</span>
                  <p className="text-gray-900 text-xs md:text-sm font-semibold leading-relaxed">
                    Provision of technical assistance using the BB2 assessment criteria of Joint MDB Methodological Framework for the Assessment of Paris Alignment and ADB’s Climate Risk Assessment Framework.
                  </p>
                </div>

                {/* Editorial Step-by-Step Breakdown */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                    Core Assessment Components Following IPCC &amp; ADB Frameworks:
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3.5 pb-3.5 border-b border-gray-100">
                      <span className="text-xs font-black text-teal-800 font-mono mt-0.5">01</span>
                      <div className="space-y-0.5 flex-1">
                        <h4 className="text-sm font-bold text-gray-950">Historic &amp; Projected Climate Hazard Analysis</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">Detailed historic and projected climate hazard mapping using high-resolution spatial models and observational tools.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 pb-3.5 border-b border-gray-100">
                      <span className="text-xs font-black text-teal-800 font-mono mt-0.5">02</span>
                      <div className="space-y-0.5 flex-1">
                        <h4 className="text-sm font-bold text-gray-950">Exposure &amp; Vulnerability Assessment</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">Comprehensive exposure and vulnerability analysis of all physical and socioeconomic hazards for project components.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 pb-3.5 border-b border-gray-100">
                      <span className="text-xs font-black text-teal-800 font-mono mt-0.5">03</span>
                      <div className="space-y-0.5 flex-1">
                        <h4 className="text-sm font-bold text-gray-950">Component-Wise Climate Risk Classification Matrix</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">Systematic classification of hazard risks as extreme, moderate, or low based on rigorous vulnerability matrices.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 pb-3.5 border-b border-gray-100">
                      <span className="text-xs font-black text-teal-800 font-mono mt-0.5">04</span>
                      <div className="space-y-0.5 flex-1">
                        <h4 className="text-sm font-bold text-gray-950">Tailored Adaptation Measures &amp; Implementation</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">Actionable adaptation measures, policy alignment guidelines, and structured implementation roadmaps.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: POLICY ANALYSIS AND CLIMATE GOVERNANCE */}
              <section id="governance" className="anim-block space-y-6 pt-10 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-[#0B1E3D] rounded-full" />
                    <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800">Government Advisory</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-950">
                    Policy Analysis &amp; Climate Governance
                  </h2>
                </div>

                <p className="text-gray-800 text-sm md:text-base leading-relaxed font-normal">
                  Supporting the Government of Pakistan in strengthening intergovernmental coordination and improving the implementation of national climate policies. The work focuses on identifying policy gaps, institutional inefficiencies, and opportunities to enhance climate governance for more effective national action:
                </p>

                <div className="space-y-3">
                  {[
                    "Comprehensive review of Pakistan’s climate policies and governance frameworks across national and provincial levels.",
                    "Assessment of institutional roles, coordination mechanisms, and implementation challenges.",
                    "Comparative analysis of Pakistan’s climate governance structure against international best practices.",
                    "Stakeholder consultations through workshops, interviews, and focus groups to gather insights and build consensus.",
                    "Development of clear, actionable recommendations to strengthen climate governance and improve policy coherence.",
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3.5 pb-3 border-b border-gray-100">
                      <span className="text-xs font-black text-teal-800 font-mono mt-0.5">0{i + 1}</span>
                      <p className="text-xs md:text-sm font-medium text-gray-800 leading-relaxed flex-1">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 4: WET-BULB TEMPERATURE & PHYSIOLOGICAL RISK ANALYSIS */}
              <section id="wet-bulb" className="anim-block space-y-5 pt-10 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-[#0B1E3D] rounded-full" />
                    <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800">Thermal Telemetry</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-950">
                    Wet-Bulb Temperature &amp; Physiological Risk Analysis
                  </h2>
                </div>

                <p className="text-gray-800 text-sm md:text-base leading-relaxed font-normal">
                  We assess human survivability thresholds using wet-bulb temperature (Tw), identifying regions and time periods where heat exposure becomes dangerous or life-threatening. In order to assess how temperature, humidity, and wet-bulb temperature influence human activity, we integrate meteorological data with human thermophysiological models. This enables actionable monitoring among climatic attributes and safe activity limits.
                </p>
              </section>

              {/* SECTION 5: SCIENTIFIC QUOTE CARD */}
              <section id="quote" className="anim-block pt-10 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-slate-50/80 p-6 md:p-8 rounded-2xl border border-slate-200">
                  <div className="flex flex-col items-center text-center flex-shrink-0">
                    <div className="relative w-28 h-28 mb-3">
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
                      <div className="absolute bottom-0 right-0 w-7 h-7 rounded-lg bg-[#d97706] text-white flex items-center justify-center shadow border-2 border-white">
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      </div>
                    </div>

                    <h4 className="text-sm font-heading font-extrabold text-[#0B1E3D] tracking-tight">
                      Dr Fahad Saeed
                    </h4>
                    <p className="text-[11px] font-medium text-gray-600">
                      Senior Climate Scientist
                    </p>
                    <p className="text-[11px] font-medium text-gray-600">
                      Climate Analytics
                    </p>
                  </div>

                  <div className="flex-1 self-center border-l-2 border-teal-800 pl-5 py-1">
                    <blockquote className="text-xs md:text-sm text-gray-900 font-serif italic leading-relaxed font-normal">
                      “1.5 °C limit is not a symbolic benchmark. It is the enduring and legally significant goal of Paris Agreement. It is established to avoid the most dangerous impacts of climate change and in that sense is set as the ethical and moral limit. Exceeding it would significantly increase the likelihood of severe, widespread and in some cases irreversible impacts.”
                    </blockquote>
                  </div>
                </div>
              </section>

            </div>

            {/* ── RIGHT COLUMN: STICKY SCIENTIFIC DIRECTORY & RECOGNIZED DATA SOURCES (Col 4 of 12) ── */}
            <aside id="data-sources" className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              
              {/* Directory Main Box */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-6">
                
                {/* Header */}
                <div className="space-y-1.5 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-1.5 text-teal-800 font-extrabold text-[11px] uppercase tracking-wider">
                    <Database className="w-3.5 h-3.5 text-teal-700" />
                    <span>Insights Directory</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-gray-950 text-base leading-snug">
                    Recognized Data Sources, Models &amp; Scientific References
                  </h3>
                  <p className="text-[11px] text-gray-500 font-normal leading-relaxed">
                    Verified open-access scientific repositories and forecasting tools.
                  </p>
                </div>

                {/* 1. Climate Data Sources */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      Climate Data Sources
                    </h4>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                      {climateDataSources.length}
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {climateDataSources.map((ds, idx) => (
                      <a
                        key={idx}
                        href={ds.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between py-2 text-xs font-semibold text-gray-700 hover:text-teal-800 transition-colors"
                      >
                        <span className="truncate pr-2 group-hover:translate-x-0.5 transition-transform">{ds.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-teal-800 flex-shrink-0 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* 2. Tools & Dashboards */}
                <div className="space-y-2.5 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#48b302]" />
                      Tools &amp; Dashboards
                    </h4>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                      {toolsAndDashboards.length}
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {toolsAndDashboards.map((tool, idx) => (
                      <a
                        key={idx}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between py-2 text-xs font-semibold text-gray-700 hover:text-teal-800 transition-colors"
                      >
                        <span className="truncate pr-2 group-hover:translate-x-0.5 transition-transform">{tool.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-teal-800 flex-shrink-0 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>

              </div>

              {/* Callout Info Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/40 border border-slate-200/90 shadow-sm space-y-1.5">
                <div className="flex items-center gap-1.5 text-teal-800 font-bold text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                  <span>IPCC &amp; WMO Standards</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed font-normal">
                  All models comply with IPCC AR6 guidelines and CMIP6 climate model projections for precision attribution.
                </p>
              </div>

            </aside>

          </div>

        </div>
      </div>
    </>
  );
};

export default About;
