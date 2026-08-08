import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  Building2,
} from 'lucide-react';

import visionHeroImg from '../../assets/images/vision-hero.avif?url';

gsap.registerPlugin(ScrollTrigger);

// High-resolution 3D Fluency Icons from Icons8 CDN
const icons8 = {
  earth: 'https://img.icons8.com/3d-fluency/94/earth-planet.png',
  shield: 'https://img.icons8.com/3d-fluency/94/shield.png',
  chart: 'https://img.icons8.com/3d-fluency/94/combo-chart.png',
  policy: 'https://img.icons8.com/3d-fluency/94/policy.png',
  temp: 'https://img.icons8.com/3d-fluency/94/temperature.png',
  water: 'https://img.icons8.com/3d-fluency/94/water-element.png',
  check: 'https://img.icons8.com/3d-fluency/94/checked-checkbox.png',
  team: 'https://img.icons8.com/3d-fluency/94/conference-call.png',
  matrix: 'https://img.icons8.com/3d-fluency/94/flow-chart.png',
};

const keyCapabilities = [
  {
    icon: icons8.temp,
    title: 'Multi-Hazard Climate Risk Assessments',
    desc: 'Quantifying heatwaves, flooding, droughts, and extreme precipitation across South Asia.',
  },
  {
    icon: icons8.shield,
    title: 'IPCC Hazard, Exposure & Vulnerability',
    desc: 'Standardized biophysical and socioeconomic vulnerability analysis following IPCC guidelines.',
  },
  {
    icon: icons8.water,
    title: 'Heat Stress & Wet-Bulb Telemetry',
    desc: 'Tracking extreme humid heat indices (TW > 35°C) and municipal thermal stress thresholds.',
  },
  {
    icon: icons8.matrix,
    title: 'Infrastructure Risk Classification Matrices',
    desc: 'Classifying component-level vulnerability into extreme, moderate, and low risk matrices.',
  },
  {
    icon: icons8.chart,
    title: 'Climate Risk Management Frameworks',
    desc: 'Developing institutional resilience strategies, Paris alignment benchmarks, and adaptation pathways.',
  },
  {
    icon: icons8.policy,
    title: 'National & Provincial Policy Analysis',
    desc: 'Reviewing Pakistan climate governance, institutional coordination, and regulatory alignment.',
  },
  {
    icon: icons8.team,
    title: 'Adaptation & Capacity Building Workshops',
    desc: 'Conducting stakeholder consultations, technical briefings, and policy consensus workshops.',
  },
  {
    icon: icons8.earth,
    title: 'Hydrological & Glacier Outburst Modeling',
    desc: 'Simulating GLOF risk, river discharge hydrographs, and Indus basin meltwater dynamics.',
  },
];

const About = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [bgImage, setBgImage] = useState<string>(visionHeroImg);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      // Hero elements animation
      gsap.fromTo(
        '.anim-hero-text > *',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out' }
      );

      // Capability cards animation
      gsap.fromTo(
        '.anim-cap-card',
        { opacity: 0, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.anim-cap-grid',
            start: 'top 85%',
          },
        }
      );

      // Section blocks entrance
      gsap.fromTo(
        '.anim-section-block',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.anim-sections-container',
            start: 'top 80%',
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
          content="Explore WenClims' integrated climate services, risk assessments, heat stress telemetry, and policy governance solutions across South Asia."
        />
        <link rel="canonical" href="https://wenclims.org/services" />
      </Helmet>

      <div ref={pageRef} className="min-h-screen bg-gray-50 font-sans text-gray-900">
        {/* ═══ FUTURISTIC ANIMATED HERO SECTION ═══ */}
        <section
          id="hero"
          className="relative min-h-[75vh] flex flex-col justify-center overflow-hidden bg-[#071328] text-white"
        >
          {/* Background Image Track */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={bgImage}
              alt="WenClims Services Hero"
              onError={() => setBgImage(visionHeroImg)}
              className="w-full h-full object-cover object-center filter brightness-50 contrast-125 scale-105 transition-transform duration-1000"
            />
            {/* Glowing Ambient Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#071328] via-[#071328]/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071328] via-transparent to-[#071328]/70" />
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#48b302]/20 blur-3xl animate-pulse" />
            <div className="absolute -bottom-32 right-0 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-40 pb-20">
            <div className="anim-hero-text max-w-4xl space-y-6">
              {/* Tag Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#48b302]/50 bg-[#48b302]/15 backdrop-blur-md text-[#48b302] text-xs font-extrabold uppercase tracking-[0.22em] shadow-lg">
                <img src={icons8.earth} alt="Earth" className="w-5 h-5 animate-spin-slow" />
                <span>Integrated Climate Services &amp; Solutions</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white leading-tight">
                Empowering Resilience with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#48b302] via-emerald-300 to-sky-400">
                  Climate Intelligence
                </span>
              </h1>

              {/* Description Paragraph */}
              <p className="text-base md:text-xl text-gray-200 font-light leading-relaxed max-w-3xl">
                At WCS, we provide integrated weather, climate, and environmental solutions in the field of energy, water, and climate change to help stakeholders make informed decisions, reduce climate risks, and build long-term climate resilience. Our services combine scientific expertise with climate modelling, advanced data analytics, climate risk and vulnerability assessments, and climate change services dashboards to deliver actionable insights.
              </p>

              {/* Quick Jump Links */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href="#risk-assessment"
                  className="px-5 py-2.5 rounded-xl bg-[#48b302] text-gray-950 font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-lg hover:shadow-emerald-950/50 flex items-center gap-2"
                >
                  <img src={icons8.shield} alt="Shield" className="w-5 h-5" />
                  <span>Climate Risk Assessment</span>
                </a>
                <a
                  href="#climate-modelling"
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
                >
                  <img src={icons8.chart} alt="Analytics" className="w-5 h-5" />
                  <span>Data Analytics &amp; Projections</span>
                </a>
                <a
                  href="#climate-governance"
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
                >
                  <img src={icons8.policy} alt="Policy" className="w-5 h-5" />
                  <span>Policy &amp; Governance</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ANIMATED CAPABILITIES GRID (8 Interactive Cards with Icons8) ═══ */}
        <section className="py-16 md:py-24 bg-white border-b border-gray-200 relative overflow-hidden">
          <div className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#48b302]/10 text-[#48b302] text-xs font-bold uppercase tracking-wider border border-[#48b302]/30">
                <Sparkles className="w-4 h-4" />
                <span>Scope of Expertise</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-gray-900">
                Our Core <span className="text-[#48b302]">Services Overview</span>
              </h2>
              <p className="text-gray-600 text-sm md:text-base font-light">
                Comprehensive technical solutions tailored for multilateral development banks, government agencies, and climate stakeholders across South Asia.
              </p>
            </div>

            <div className="anim-cap-grid grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyCapabilities.map((cap, idx) => (
                <div
                  key={idx}
                  className="anim-cap-card group relative bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-2xl hover:border-[#48b302] transition-all duration-500 flex flex-col justify-between hover:-translate-y-2"
                >
                  <div>
                    {/* Icons8 3D Icon Header */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#48b302]/10 to-teal-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 border border-[#48b302]/20 shadow-inner">
                      <img src={cap.icon} alt={cap.title} className="w-10 h-10 object-contain" />
                    </div>

                    <h3 className="text-base font-heading font-bold text-gray-900 group-hover:text-[#48b302] transition-colors leading-snug mb-2">
                      {cap.title}
                    </h3>

                    <p className="text-xs text-gray-600 font-light leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#48b302]">
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ EDITORIAL DOCUMENT SECTIONS ═══ */}
        <div className="anim-sections-container max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          {/* ── SECTION 1: CLIMATE RISK & ADAPTATION ASSESSMENT ── */}
          <section
            id="risk-assessment"
            className="anim-section-block bg-white rounded-[32px] p-8 md:p-12 border border-gray-200 shadow-xl relative overflow-hidden group hover:border-[#48b302]/40 transition-all"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#48b302] via-emerald-400 to-teal-500" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#48b302]/10 border border-[#48b302]/30 flex items-center justify-center shadow-sm">
                <img src={icons8.shield} alt="Risk Assessment" className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#48b302]">Framework 01</span>
                <h2 className="text-2xl md:text-4xl font-heading font-bold text-gray-900 leading-tight">
                  Climate Risk &amp; Adaptation Assessment
                </h2>
              </div>
            </div>

            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8 font-light max-w-4xl">
              We provide clear, actionable insights for climate-resilient infrastructure and development planning using state-of-the-art modelling tools and multi-scenario climate projections. The services includes:
            </p>

            <div className="space-y-6">
              {/* Feature 1: MDB & Paris Alignment */}
              <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#48b302] text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-md">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950 text-base mb-1">
                      Joint MDB &amp; Paris Alignment Compliance (BB2 Criteria)
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-light">
                      Provision of technical assistance using the BB2 assessment criteria of Joint MDB Methodological Framework for the Assessment of Paris Alignment and ADB's Climate Risk Assessment Framework.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2: Detailed IPCC Report Formulation */}
              <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#48b302] text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-md">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950 text-base mb-1">
                      Comprehensive Climate Risk Assessment Report Formulation
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-light">
                      Formulation of a comprehensive Climate Risk Assessment report following the IPCC risk assessment framework and ADB's Climate Risk Assessment Framework, covering:
                    </p>
                  </div>
                </div>

                {/* Sub-cards a, b, c, d */}
                <div className="grid sm:grid-cols-2 gap-4 pl-0 sm:pl-12 pt-2">
                  <div className="group/item p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-[#48b302] hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-lg bg-[#48b302]/10 text-[#48b302] font-black text-xs flex items-center justify-center">
                        a
                      </span>
                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                        Historic &amp; Projected Climate Hazard
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 font-light leading-relaxed">
                      Detailed historic and projected climate hazard using online tools and high-resolution WRF atmospheric data.
                    </p>
                  </div>

                  <div className="group/item p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-[#48b302] hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-lg bg-[#48b302]/10 text-[#48b302] font-black text-xs flex items-center justify-center">
                        b
                      </span>
                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                        Exposure &amp; Vulnerability Assessment
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 font-light leading-relaxed">
                      The exposure and vulnerability assessment of all hazards for the project components across biophysical and social metrics.
                    </p>
                  </div>

                  <div className="group/item p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-[#48b302] hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-lg bg-[#48b302]/10 text-[#48b302] font-black text-xs flex items-center justify-center">
                        c
                      </span>
                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                        Component-Wise Risk Matrix
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 font-light leading-relaxed">
                      Component-wise climate risk matrix that classified the risk by each hazard as extreme/moderate/low based on vulnerability and exposure.
                    </p>
                  </div>

                  <div className="group/item p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-[#48b302] hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-lg bg-[#48b302]/10 text-[#48b302] font-black text-xs flex items-center justify-center">
                        d
                      </span>
                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                        Tailored Adaptation Measures
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 font-light leading-relaxed">
                      Tailored adaptation measures and implementation timelines for long-term project viability and climate resilience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 2: CLIMATE MODELLING, PROJECTIONS & DATA ANALYTICS ── */}
          <section
            id="climate-modelling"
            className="anim-section-block bg-white rounded-[32px] p-8 md:p-12 border border-gray-200 shadow-xl relative overflow-hidden group hover:border-sky-400/40 transition-all"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center shadow-sm">
                <img src={icons8.chart} alt="Modelling & Projections" className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Framework 02</span>
                <h2 className="text-2xl md:text-4xl font-heading font-bold text-gray-900 leading-tight">
                  Climate Modelling, Projections &amp; Data Analytics
                </h2>
              </div>
            </div>

            {/* Content Container with Expandable Layout */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-[#071328] text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold uppercase tracking-wider">
                    <img src={icons8.water} alt="WRF" className="w-4 h-4" />
                    <span>Convective Modeling &amp; CMIP6 Ensembles</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-white">
                    High-Resolution WRF Simulations &amp; ERA5 Reanalysis
                  </h3>
                  <p className="text-xs md:text-sm text-gray-300 font-light leading-relaxed">
                    Our data analytics suite integrates high-resolution convective WRF simulations, regional ERA5 reanalysis projections, and glacier melt hydrographs across South Asian river basins.
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <span className="px-4 py-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Data Specs Expanding</span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: POLICY ANALYSIS AND CLIMATE GOVERNANCE ── */}
          <section
            id="climate-governance"
            className="anim-section-block bg-white rounded-[32px] p-8 md:p-12 border border-gray-200 shadow-xl relative overflow-hidden group hover:border-[#48b302]/40 transition-all"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-500 via-[#48b302] to-teal-600" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-sm">
                <img src={icons8.policy} alt="Policy & Governance" className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#48b302]">Framework 03</span>
                <h2 className="text-2xl md:text-4xl font-heading font-bold text-gray-900 leading-tight">
                  Policy Analysis and Climate Governance
                </h2>
              </div>
            </div>

            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8 font-light max-w-4xl">
              Supporting the Government of Pakistan in strengthening intergovernmental coordination and improving the implementation of national climate policies. The work focuses on identifying policy gaps, institutional inefficiencies, and opportunities to enhance climate governance for more effective national action. This includes:
            </p>

            {/* 4 Interactive Columns */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-white hover:border-[#48b302] hover:shadow-lg transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#48b302]/15 text-[#48b302] font-black text-sm flex items-center justify-center flex-shrink-0 shadow-inner">
                  01
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-sm mb-1">
                    Comprehensive Review of Pakistan’s Climate Policies
                  </h3>
                  <p className="text-xs text-gray-600 font-light leading-relaxed">
                    Comprehensive review of Pakistan’s climate policies and governance frameworks across national and provincial levels.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-white hover:border-[#48b302] hover:shadow-lg transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#48b302]/15 text-[#48b302] font-black text-sm flex items-center justify-center flex-shrink-0 shadow-inner">
                  02
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-sm mb-1">
                    Institutional Roles &amp; Coordination Assessment
                  </h3>
                  <p className="text-xs text-gray-600 font-light leading-relaxed">
                    Assessment of institutional roles, coordination mechanisms, and implementation challenges across line ministries.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-white hover:border-[#48b302] hover:shadow-lg transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#48b302]/15 text-[#48b302] font-black text-sm flex items-center justify-center flex-shrink-0 shadow-inner">
                  03
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-sm mb-1">
                    Comparative Analysis Against International Best Practices
                  </h3>
                  <p className="text-xs text-gray-600 font-light leading-relaxed">
                    Comparative analysis of Pakistan’s climate governance structure against international best practices and global benchmarks.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-white hover:border-[#48b302] hover:shadow-lg transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#48b302]/15 text-[#48b302] font-black text-sm flex items-center justify-center flex-shrink-0 shadow-inner">
                  04
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-sm mb-1">
                    Stakeholder Consultations &amp; Consensus Workshops
                  </h3>
                  <p className="text-xs text-gray-600 font-light leading-relaxed">
                    Stakeholder consultations through workshops, interviews, and focus groups to gather insights and build consensus.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── TECHNICAL CONSULTATION CTA BANNER ── */}
          <section className="bg-gradient-to-r from-gray-950 via-[#071328] to-gray-950 rounded-[32px] p-8 md:p-14 text-white border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#48b302]/20 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#48b302]/20 text-[#48b302] text-xs font-bold uppercase tracking-wider border border-[#48b302]/40">
                  <Building2 className="w-4 h-4" />
                  <span>Technical Assistance &amp; Partnerships</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-heading font-extrabold text-white">
                  Partner with WCS for Paris Alignment &amp; Climate Advisory
                </h3>
                <p className="text-gray-300 text-xs md:text-sm font-light leading-relaxed">
                  Connect with our team of lead climate scientists, policy analysts, and hydro-meteorologists for project-level risk matrices, MDB compliance, and institutional governance support.
                </p>
              </div>

              <Link
                to="/contact"
                className="px-7 py-4 rounded-2xl bg-[#48b302] hover:bg-emerald-400 text-gray-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl hover:shadow-emerald-950/60 flex items-center gap-2 flex-shrink-0 group"
              >
                <span>Request Advisory Briefing</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;
