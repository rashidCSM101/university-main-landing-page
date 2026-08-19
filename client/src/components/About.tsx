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

        {/* ═══ MAIN CONTENT AREA (Clean Light Page Flow) ═══ */}
        <div className="anim-content-area max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

          {/* ── SECTION 1: OUR CAPABILITIES INCLUDE / WE DELIVER ── */}
          <section id="capabilities" className="anim-block space-y-8">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#0B1E3D] rounded-full" />
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800">Scope of Advisory</span>
                <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-gray-950">
                  Our capabilities include / We deliver:
                </h2>
              </div>
            </div>

            {/* Clean Grid directly on background with Animated Frame Borders */}
            <div className="grid md:grid-cols-2 gap-4">
              {capabilitiesList.map((item, idx) => (
                <div
                  key={idx}
                  className="capability-sparkle-card group p-6  bg-white border border-gray-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 cursor-pointer"
                >
                  <div className="w-9 h-9  bg-[#48b302]/15 text-[#48b302] font-black text-sm flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#48b302] group-hover:text-gray-950 transition-colors shadow-inner">
                    0{idx + 1}
                  </div>
                  <span className="text-xs md:text-sm font-bold text-gray-800 leading-relaxed group-hover:text-gray-950 transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 2: CLIMATE RISK & ADAPTATION ASSESSMENT ── */}
          <section id="climate-risk" className="anim-block space-y-8 pt-12 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#0B1E3D] rounded-full" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800">Technical Framework</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-gray-950">
                Climate Risk &amp; Adaptation Assessment
              </h2>
            </div>

            <p className="text-gray-800 text-base md:text-lg leading-relaxed font-normal max-w-4xl">
              We provide clear, actionable insights for climate-resilient infrastructure and development planning using state-of-the-art modelling tools and multi-scenario climate projections.
            </p>

            {/* Advisory Standard Callout */}
            <div className="border-l-2 border-[#0B1E3D] pl-6 py-2 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Assessment Standard</span>
              <p className="text-gray-900 text-base md:text-lg font-semibold leading-relaxed">
                Provision of technical assistance using the BB2 assessment criteria of Joint MDB Methodological Framework for the Assessment of Paris Alignment and ADB’s Climate Risk Assessment Framework.
              </p>
            </div>

            {/* Editorial Step-by-Step Breakdown */}
            <div className="space-y-6 pt-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500">
                Core Assessment Components Following IPCC &amp; ADB Frameworks:
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                  <span className="text-sm font-black text-teal-800 font-mono mt-0.5">01</span>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-base font-bold text-gray-950">Historic &amp; Projected Climate Hazard Analysis</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">Detailed historic and projected climate hazard mapping using high-resolution spatial models and observational tools.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                  <span className="text-sm font-black text-teal-800 font-mono mt-0.5">02</span>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-base font-bold text-gray-950">Exposure &amp; Vulnerability Assessment</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">Comprehensive exposure and vulnerability analysis of all physical and socioeconomic hazards for project components.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                  <span className="text-sm font-black text-teal-800 font-mono mt-0.5">03</span>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-base font-bold text-gray-950">Component-Wise Climate Risk Classification Matrix</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">Systematic classification of hazard risks as extreme, moderate, or low based on rigorous vulnerability matrices.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                  <span className="text-sm font-black text-teal-800 font-mono mt-0.5">04</span>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-base font-bold text-gray-950">Tailored Adaptation Measures &amp; Implementation</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">Actionable adaptation measures, policy alignment guidelines, and structured implementation roadmaps.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: POLICY ANALYSIS AND CLIMATE GOVERNANCE ── */}
          <section id="governance" className="anim-block space-y-8 pt-12 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#0B1E3D] rounded-full" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800">Government Advisory</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-gray-950">
                Policy Analysis &amp; Climate Governance
              </h2>
            </div>

            <p className="text-gray-800 text-base md:text-lg leading-relaxed font-normal max-w-4xl">
              Supporting the Government of Pakistan in strengthening intergovernmental coordination and improving the implementation of national climate policies. The work focuses on identifying policy gaps, institutional inefficiencies, and opportunities to enhance climate governance for more effective national action:
            </p>

            <div className="space-y-4">
              {[
                "Comprehensive review of Pakistan’s climate policies and governance frameworks across national and provincial levels.",
                "Assessment of institutional roles, coordination mechanisms, and implementation challenges.",
                "Comparative analysis of Pakistan’s climate governance structure against international best practices.",
                "Stakeholder consultations through workshops, interviews, and focus groups to gather insights and build consensus.",
                "Development of clear, actionable recommendations to strengthen climate governance and improve policy coherence.",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-200">
                  <span className="text-sm font-black text-teal-800 font-mono mt-0.5">0{i + 1}</span>
                  <p className="text-sm md:text-base font-medium text-gray-900 leading-relaxed flex-1">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 4: WET-BULB TEMPERATURE & PHYSIOLOGICAL RISK ANALYSIS ── */}
          <section id="wet-bulb" className="anim-block space-y-6 pt-12 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#0B1E3D] rounded-full" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800">Thermal Telemetry</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-gray-950">
                Wet-Bulb Temperature &amp; Physiological Risk Analysis
              </h2>
            </div>

            <p className="text-gray-800 text-base md:text-lg leading-relaxed font-normal max-w-4xl">
              We assess human survivability thresholds using wet-bulb temperature (Tw), identifying regions and time periods where heat exposure becomes dangerous or life-threatening. In order to assess how temperature, humidity, and wet-bulb temperature influence human activity, we integrate meteorological data with human thermophysiological models. This enables actionable monitoring among climatic attributes and safe activity limits.
            </p>
          </section>

          {/* ── SECTION 5: RECOGNIZED DATA SOURCES & TOOLS (INSIGHTS) ── */}
          <section id="data-sources" className="anim-block space-y-8 pt-12 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#0B1E3D] rounded-full" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800">Insights Directory</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-gray-950">
                Recognized Data Sources, Models &amp; Scientific References
              </h2>
            </div>

            <p className="text-gray-700 text-sm md:text-base leading-relaxed font-normal">
              Below are verified links to scientific data sources, international climate frameworks, and interactive forecasting dashboards:
            </p>

            <div className="grid md:grid-cols-2 gap-10 pt-2">
              {/* Climate Data Sources List */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-teal-800">
                  <Database className="w-4 h-4 text-teal-800" />
                  <h3 className="font-bold text-gray-950 text-xs uppercase tracking-wider">
                    Climate Data Sources
                  </h3>
                </div>
                <div className="space-y-2">
                  {climateDataSources.map((ds, idx) => (
                    <a
                      key={idx}
                      href={ds.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-2 border-b border-gray-100 hover:border-teal-700 transition-colors text-xs md:text-sm font-semibold text-gray-800 hover:text-teal-800"
                    >
                      <span className="truncate pr-2">{ds.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-teal-800 flex-shrink-0 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Tools & Dashboards List */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-teal-800">
                  <Sparkles className="w-4 h-4 text-teal-800" />
                  <h3 className="font-bold text-gray-950 text-xs uppercase tracking-wider">
                    Tools &amp; Dashboards
                  </h3>
                </div>
                <div className="space-y-2">
                  {toolsAndDashboards.map((tool, idx) => (
                    <a
                      key={idx}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-2 border-b border-gray-100 hover:border-teal-700 transition-colors text-xs md:text-sm font-semibold text-gray-800 hover:text-teal-800"
                    >
                      <span className="truncate pr-2">{tool.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-teal-800 flex-shrink-0 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 6: SCIENTIFIC QUOTE CARD (Exact Design Replica) ── */}
          <section id="quote" className="anim-block pt-12 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
              {/* Left Column: Round Photo + Video Play Icon Badge + Name & Title */}
              <div className="flex flex-col items-center text-center flex-shrink-0">
                <div className="relative w-36 h-36 mb-4">
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
                  {/* Video Play Badge */}
                  <div className="absolute bottom-1 right-1 w-9 h-9 rounded-xl bg-[#d97706] text-white flex items-center justify-center shadow-lg border-2 border-white">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                <h4 className="text-lg font-heading font-extrabold text-[#0B1E3D] italic tracking-tight mb-0.5">
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
              <div className="flex-1 self-center border-l-2 border-teal-800 pl-6 py-2">
                <blockquote className="text-base md:text-lg text-gray-900 font-serif italic leading-relaxed font-normal">
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
