import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Target,
  Eye,
  Heart,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  { year: '1995', title: 'Telemetry Station Established', desc: 'First doppler meteorological observation network deployed for atmospheric tracking.' },
  { year: '2008', title: 'Satellite Grid Integration', desc: 'Real-time geostationary cloud imagery and sea surface temperature telemetry enabled.' },
  { year: '2016', title: 'High-Resolution Doppler Radar', desc: 'Commissioned S-band Doppler radars for convective microburst early warnings.' },
  { year: '2022', title: 'AI Climate Prediction Models', desc: 'Integrated deep learning neural weather models for 10-day hyper-local forecasts.' },
  { year: '2026', title: 'Global Climate Network', desc: 'Operating 120+ active radar nodes serving aviation, marine, and agricultural sectors.' },
];

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To provide high-precision, life-saving weather forecasts, severe storm early warnings, and agricultural climate advisories powered by satellite remote sensing.',
    gradient: 'from-sky to-blue-700',
    bg: 'bg-sky-50',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'To lead global atmospheric telemetry innovation, empowering communities, aviation networks, and farmers to build climate resilience.',
    gradient: 'from-teal to-emerald-700',
    bg: 'bg-teal-50',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'We uphold scientific precision, transparency, rapid warning dissemination, and commitment to environmental safety and disaster preparedness.',
    gradient: 'from-amber to-orange-600',
    bg: 'bg-amber-50',
  },
];

const stats = [
  { value: '120+', label: 'Radar Stations', icon: Award },
  { value: '99.8%', label: 'Warning Accuracy', icon: Users },
  { value: '24/7', label: 'Telemetry Stream', icon: GraduationCap },
  { value: '500K+', label: 'Daily Data Telemetries', icon: BookOpen },
];

const facilities = [
  'Dual-Polarization S-Band Doppler Radar',
  'Geostationary Weather Satellite Downlink',
  'High-Performance Supercomputing Forecast Center',
  'Automated Weather Observation Stations (AWOS)',
  'Hydrology & River Basin Soil Sensors',
  'Aviation Wind Shear Telemetry Grid',
  '24/7 Emergency Warning Dissemination Desk',
  'Climate Research & AI Analytics Lab',
];

const About = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.about-hero-content', {
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from('.about-section', {
        y: 40,
        duration: 0.7,
        stagger: 0.15,
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
        <title>About WCS | Weather & Climate Services Portal</title>
        <meta name="description" content="Learn about Weather & Climate Services (WCS), our mission, Doppler radar infrastructure, and atmospheric modeling history." />
        <link rel="canonical" href="https://wcs-weather.org/about" />
      </Helmet>
      <div ref={pageRef} className="min-h-screen bg-slate-50">
        {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary-light to-secondary pt-32 pb-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-sky rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}></div>

        <div className="container-custom relative z-10">
          <div className="about-hero-content">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sky-200 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-amber" />
              <span className="text-white/90 font-medium text-sm">About WCS</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
              Weather & Climate <span className="text-sky">Services</span>
            </h1>
            <p className="text-lg text-slate-200 max-w-2xl mb-10">
              A premier meteorological center dedicated to Doppler live radar telemetry, severe storm alerts, and climate intelligence since 1995.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-sky" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-300">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
                <span className="text-primary">Educational Excellence</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Government Degree College Larkana is one of the oldest and most prestigious
                public sector colleges in the Larkana division of Sindh, Pakistan. Established
                in 1960, the college has been serving as a beacon of knowledge and learning
                for over six decades.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Affiliated with the University of Sindh, Jamshoro, the college offers a wide
                range of undergraduate programs including BS Zoology, Botany, Chemistry,
                Physics, Mathematics, and various Arts programs. Our Zoology department is
                particularly renowned for its comprehensive curriculum and well-equipped
                laboratories.
              </p>
              <div className="flex flex-wrap gap-3">
                {['HEC Recognized', 'University of Sindh Affiliated', 'Govt. of Sindh'].map((tag) => (
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
                  alt="GDC Larkana Campus"
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
                  GDC Larkana provides a conducive learning environment with modern facilities
                  that support both academic and extracurricular activities.
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
                Want to learn more about our programs or visit the campus? Contact us today.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: MapPin, label: 'Address', value: 'Government Degree College, Larkana, Sindh' },
                  { icon: Phone, label: 'Phone', value: '+92 (74) 123-4567' },
                  { icon: Mail, label: 'Email', value: 'info@gdclarkana.edu.pk' },
                  { icon: Clock, label: 'Timing', value: 'Mon - Sat: 8AM - 3PM' },
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
