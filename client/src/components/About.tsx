import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BookOpen,
  Users,
  Award,
  Globe2,
  Target,
  Eye,
  Heart,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

import visionHeroImg from '../../assets/images/vision-hero.avif?url';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  { year: '2010', title: 'WenClims Founded', desc: 'Established as an independent weather & climate research initiative in Islamabad.' },
  { year: '2015', title: 'Doppler Telemetry Live', desc: 'Integrated high-resolution Doppler weather radar & satellite data streams.' },
  { year: '2019', title: 'ADB & EU Partnerships', desc: 'Expanded regional partnerships for climate impact & flood risk modeling.' },
  { year: '2022', title: 'Attribution Science Lead', desc: 'Pioneered extreme monsoon & heatwave event attribution studies in South Asia.' },
  { year: '2026', title: 'Interactive Climate Portal', desc: 'Launched real-time interactive climate telemetry and amCharts analytics hub.' },
];

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To provide decision-makers, governments, and civil society with science-based guidance on climate change and its biophysical and socioeconomic impacts across South Asia.',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'To be South Asia\'s premier climate intelligence hub, empowering communities with cutting-edge attribution science, satellite telemetry, and climate resilience frameworks.',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'We uphold scientific integrity, open-access research, and climate resilience across South Asia, providing independent data to safeguard vulnerable communities.',
    gradient: 'from-[#48b302] to-teal-600',
    bg: 'bg-teal-50',
  },
];

const stats = [
  { value: '18+', label: 'Years Attribution Research', icon: Award },
  { value: '3,000+', label: 'Glacial Lakes Monitored', icon: Globe2 },
  { value: '25+', label: 'Research Scientists', icon: Users },
  { value: '50+', label: 'Peer-Reviewed Monographs', icon: BookOpen },
];

const facilities = [
  'WRF Convective Atmospheric Modeling Cluster',
  'Indus Basin Glacial Outburst Hydrograph Telemetry Center',
  'Pre-Monsoon Humid Heatwave Observatory (Karachi & Sindh)',
  'GIS Solar Irradiance & Wind Velocity Mapping Lab',
  'Open-Access South Asian Climate Monograph Library',
  'Disaster Management Policy Advisory & Briefing Unit',
];

const About = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [bgImage, setBgImage] = useState<string>(visionHeroImg);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.about-hero-content > *', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });

      gsap.from('.about-card', {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-sections-wrapper',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Vision &amp; Mission | WenClims — Weather and Climate Services</title>
        <meta name="description" content="Learn about WenClims' vision, mission, climate research history, and regional impact." />
        <link rel="canonical" href="https://wenclims.org/vision" />
      </Helmet>

      <div ref={pageRef} className="min-h-screen bg-gray-50">
        {/* ═══ HOME-STYLE HERO SECTION (Full Screen Background Image Track + Overlay) ═══ */}
        <section
          id="hero"
          className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gray-900"
          aria-label="Vision Hero"
        >
          {/* Background Image Track */}
          <div className="absolute inset-0 w-full h-full will-change-transform">
            <img
              src={bgImage}
              alt="WenClims Vision & Mission Hero Background"
              onError={() => {
                if (bgImage !== visionHeroImg) {
                  setBgImage(visionHeroImg);
                }
              }}
              fetchPriority="high"
              loading="eager"
              width={1920}
              height={1080}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-700"
            />
            {/* Layered dark gradient overlays — seamless full-screen coverage */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(105deg, rgba(10,37,64,0.95) 0%, rgba(10,37,64,0.82) 42%, rgba(10,37,64,0.60) 75%, rgba(10,37,64,0.40) 100%)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(5,20,40,0.98) 0%, rgba(5,20,40,0.60) 50%, transparent 100%)',
              }}
            />
          </div>

          {/* Grid Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* ── Main Content Block matching max-w-[68rem] ── */}
          <div className="relative z-10 w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-40 lg:pt-44 pb-20 flex flex-col justify-center">
            <div className="about-hero-content w-full max-w-4xl">
              {/* Tag Pill */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="w-8 h-px bg-[#00C8C8]" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] px-3 py-1 rounded-full border border-[#00C8C8]/50 text-[#00C8C8] bg-[#00C8C8]/10">
                  Vision &amp; Mission
                </span>
              </div>

              {/* Heading matching Home & Tools Hero */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-tight mb-6">
                Weather &amp; Climate{' '}
                <span className="relative inline-block">
                  <span className="text-[#00C8C8]">Services</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 8C80 2 220 2 298 8"
                      stroke="#00C8C8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-lg text-white/80 mb-8 max-w-3xl leading-relaxed">
                South Asia's premier science-based climate intelligence platform, translating atmospheric modeling and attribution research into action.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/15 max-w-3xl">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-2xl font-bold text-white font-heading">{stat.value}</span>
                    <span className="text-xs text-white/70 mt-0.5">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      {/* Main Content */}
      <div className="about-sections-wrapper container-custom py-16">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* About Introduction */}
          <div className="about-section grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-5">
                <span className="text-primary font-semibold text-xs uppercase tracking-wider">Who We Are</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-5">
                A Legacy of{' '}
                <span className="text-primary">Scientific Excellence</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Weather and Climate Services (WenClims) is a premier climate research and advisory organization headquartered in Islamabad, Pakistan. Established to address the growing climate crisis in South Asia, WenClims translates complex atmospheric modeling into actionable intelligence.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                In collaboration with international partners such as the Asian Development Bank (ADB) and the European Union (EU), our multidisciplinary team conducts extreme weather event attribution, hydrological vulnerability assessments, and agricultural resilience planning.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Peer-Reviewed Science', 'Indus Basin Research', 'ADB & EU Partner', 'Satellite Telemetry'].map((tag) => (
                  <span key={tag} className="text-xs font-semibold bg-primary/5 text-primary px-4 py-2 rounded-full border border-primary/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="WenClims Climate Telemetry Center"
                  loading="lazy"
                  width={800}
                  height={533}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">60+</div>
                    <div className="text-sm text-gray-500">Years of Service</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full -z-10"></div>
            </div>
          </div>

          {/* Mission, Vision, Values */}
          <div className="about-section">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-5">
                <span className="text-primary font-semibold text-xs uppercase tracking-wider">What Drives Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                Mission, Vision & <span className="text-primary">Values</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {values.map((item, i) => (
                <div key={i} className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
                  <div className={`h-1.5 bg-gradient-to-r ${item.gradient}`}></div>
                  <div className="p-8 pt-7">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-[15px]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline / History */}
          <div className="about-section">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-5">
                <span className="text-primary font-semibold text-xs uppercase tracking-wider">Our Journey</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                Milestones & <span className="text-primary">History</span>
              </h2>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-px"></div>

              <div className="space-y-10">
                {milestones.map((milestone, i) => (
                  <div key={i} className={`relative flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:text-right md:pr-4' : 'md:text-left md:pl-4'}`}>
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <span className="text-primary font-bold text-lg">{milestone.year}</span>
                        <h4 className="text-lg font-bold text-gray-900 mt-1">{milestone.title}</h4>
                        <p className="text-gray-500 text-sm mt-2">{milestone.desc}</p>
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-md -translate-x-1/2"></div>

                    {/* Spacer */}
                    <div className="hidden md:block md:w-[calc(50%-2rem)]"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="about-section">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c476?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="College Facilities"
                    loading="lazy"
                    width={800}
                    height={533}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-5">
                  <span className="text-primary font-semibold text-xs uppercase tracking-wider">Campus Life</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-5">
                  Our <span className="text-primary">Facilities</span>
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  WenClims provides state-of-the-art research infrastructure with modern facilities
                  that support high-resolution weather modeling and satellite telemetry.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {facilities.map((facility, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="about-section bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark rounded-3xl p-10 md:p-14 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '25px 25px',
            }}></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
                Get in <span className="text-primary-light">Touch</span>
              </h2>
              <p className="text-white/60 mb-10 max-w-lg">
                Want to learn more about our research, data services, or collaborate on climate projects? Contact us today.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: MapPin, label: 'Address', value: '88, Lane 2, Lake View Lanes, Bani Gala, Islamabad' },
                  { icon: Phone, label: 'Phone', value: '+92-333-5672483' },
                  { icon: Mail, label: 'Email', value: 'wenclims@gmail.com' },
                  { icon: Clock, label: 'Timing', value: 'Mon - Fri: 9AM - 5PM' },
                ].map((info, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary-light" />
                    </div>
                    <div>
                      <div className="text-xs text-white/40 mb-0.5">{info.label}</div>
                      <div className="text-sm font-medium text-white/90">{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/" className="btn-primary bg-white text-primary hover:bg-gray-100 group">
                  <span>Back to Home</span>
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default About;
