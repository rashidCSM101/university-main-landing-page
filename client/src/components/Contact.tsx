import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  Send,
  MessageSquare,
  User,
  CheckCircle2,
  Twitter,
  Linkedin,
  ExternalLink,
  Building2,
  Compass,
  Layers,
} from 'lucide-react';

import heroBgFallback from '../../assets/images/1.webp?url';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [bgImage, setBgImage] = useState<string>('/assets/images/contact-hero.png');

  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setContactForm({ ...contactForm, [e.target.name]: e.target.value });

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 }
      );

      // Hero background parallax
      gsap.to('.contact-hero-bg', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.contact-hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      // Quick info cards entry
      gsap.fromTo(
        '.contact-pillar-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('sent');
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 4000);
    }, 1200);
  };

  const primaryContactPillars = [
    {
      icon: MapPin,
      badge: 'Location & Headquarters',
      title: 'Our Secretariat',
      details: 'P5F9+49, Lake View Lanes Barakahu, Islamabad, Pakistan',
      subtext: 'Federal Capital Territory, Pakistan',
      actionText: 'View on Google Maps',
      actionUrl: 'https://maps.app.goo.gl/mJEwYAnkhUzEmmkF7',
      isExternal: true,
    },
    {
      icon: PhoneCall,
      badge: 'Telephone & Desk',
      title: 'Direct Phone',
      details: '0333 5672483',
      subtext: '+92 333 5672483 • Official Inquiries',
      actionText: 'Call Now',
      actionUrl: 'tel:+923335672483',
      isExternal: false,
    },
    {
      icon: Mail,
      badge: 'Email Directorate',
      title: 'Official Mailbox',
      details: 'wenclims@gmail.com',
      subtext: 'admin@wenclims.org • Mon–Fri Response',
      actionText: 'Compose Email',
      actionUrl: 'mailto:wenclims@gmail.com',
      isExternal: false,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact &amp; Collaborations | WenClims Weather &amp; Climate Services</title>
        <meta
          name="description"
          content="Connect with WenClims for climate risk assessments, weather attribution research, policy advisory, and meteorological telemetry inquiries in Islamabad, Pakistan."
        />
        <link rel="canonical" href="https://wenclims.org/contact" />
      </Helmet>

      <div ref={pageRef} className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
        
        {/* ═══ 1. HERO SECTION (Executive Deep Navy) ═══ */}
        <section className="contact-hero-section relative pt-32 pb-20 md:pt-36 md:pb-28 bg-[#0B1E3D] text-white overflow-hidden">
          {/* Subtle Parallax Background */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={bgImage}
              alt="WenClims Contact"
              onError={() => setBgImage(heroBgFallback)}
              className="contact-hero-bg w-full h-full object-cover opacity-15 filter contrast-125 brightness-90 will-change-transform scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1E3D]/80 via-[#0B1E3D]/95 to-[#0B1E3D]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div ref={contentRef} className="max-w-3xl space-y-4">
              
              {/* Back to Home Breadcrumb */}
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-teal-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Return to Overview</span>
              </Link>

              {/* Tag Badge */}
              <div className="flex items-center gap-2 pt-1">
                <span className="w-1.5 h-4 bg-teal-400 rounded-full" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-300">
                  Global Secretariat &amp; Advisory Desk
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
                Connect with Our Scientific Directorate
              </h1>

              {/* Subtitle */}
              <p className="text-sm md:text-base text-slate-300 leading-relaxed font-light max-w-2xl">
                Direct coordination for extreme weather attribution data, climate risk management frameworks, meteorological telemetry, and strategic policy consulting.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ 2. THREE PRIMARY CONTACT PILLARS (Overlapping Executive Cards) ═══ */}
        <section className="relative z-20 -mt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {primaryContactPillars.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="contact-pillar-card bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50/80 border border-teal-100 px-2.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                        {item.title}
                      </h2>
                      <p className="text-sm md:text-base font-extrabold text-gray-950 mt-0.5 leading-snug">
                        {item.details}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-normal">
                        {item.subtext}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <a
                      href={item.actionUrl}
                      target={item.isExternal ? '_blank' : '_self'}
                      rel={item.isExternal ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 transition-colors group"
                    >
                      <span>{item.actionText}</span>
                      {item.isExternal ? (
                        <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      ) : (
                        <ArrowLeft className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:translate-x-0.5" />
                      )}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ 3. MAIN FORM & LOCATION SIDEBAR ═══ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT COLUMN: CONTACT FORM (Col 7 of 12) ── */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-7 md:p-10 border border-slate-200 shadow-sm space-y-8">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-teal-800 rounded-full" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800">
                    Transmission Portal
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-950">
                  Send a Research or Advisory Inquiry
                </h2>
                <p className="text-sm text-gray-600 font-normal leading-relaxed">
                  Please fill in your institutional credentials and inquiry objectives. Our scientific coordinator will respond within 24–48 business hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Row 1: Name & Email */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Dr. Ayesha Tariq"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                      Official Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="ayesha@institution.org"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone & Category */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <PhoneCall className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="0333 5672483"
                        value={contactForm.phone}
                        onChange={handleContactChange}
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                      Inquiry Category *
                    </label>
                    <div className="relative">
                      <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <select
                        name="subject"
                        required
                        value={contactForm.subject}
                        onChange={handleContactChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select subject category...</option>
                        <option value="attribution">Extreme Event Attribution Research</option>
                        <option value="risk-assessment">Climate Risk &amp; Adaptation Assessment</option>
                        <option value="policy-advisory">Government Climate Policy Advisory</option>
                        <option value="thermal-telemetry">Wet-Bulb Temperature &amp; Heat Stress</option>
                        <option value="data-request">Scientific Data &amp; Reanalysis Access</option>
                        <option value="media-press">Media, Press &amp; Publication Inquiries</option>
                        <option value="general">General Secretariat Query</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                    Inquiry Statement &amp; Scope *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <textarea
                      rows={5}
                      name="message"
                      required
                      placeholder="Outline your research topic, target geographical coordinates, model requirements, or institutional consultation scope..."
                      value={contactForm.message}
                      onChange={handleContactChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-75 cursor-pointer"
                  >
                    {formStatus === 'idle' && (
                      <>
                        <span>Submit Inquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                    {formStatus === 'sending' && (
                      <>
                        <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Dispatching...</span>
                      </>
                    )}
                    {formStatus === 'sent' && (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>Inquiry Dispatched Successfully!</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* ── RIGHT COLUMN: LOCATION & OPERATIONAL TELEMETRY (Col 5 of 12) ── */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Map & Office Box */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                
                {/* Map Header */}
                <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-800/80 flex items-center justify-center text-teal-300">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-white">
                        Islamabad Secretariat
                      </h3>
                      <span className="text-[11px] text-slate-400">Lake View Lanes, Barakahu</span>
                    </div>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/mJEwYAnkhUzEmmkF7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-teal-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Google Map Embed Frame */}
                <div className="h-[250px] bg-slate-100 relative">
                  <iframe
                    src="https://maps.google.com/maps?q=P5F9%2B49%2C%20Lake%20View%20Lanes%20Barakahu%2C%20Islamabad%2C%20Pakistan&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="WenClims Secretariat Location — Islamabad, Pakistan"
                  />
                </div>

                {/* Detailed Address Strip */}
                <div className="p-5 bg-slate-50/70 border-t border-slate-100 space-y-2">
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <MapPin className="w-4 h-4 text-teal-800 mt-0.5 flex-shrink-0" />
                    <p className="font-medium leading-relaxed">
                      <strong>Address:</strong> P5F9+49, Lake View Lanes Barakahu, Islamabad, Pakistan
                    </p>
                  </div>
                  <div className="pt-2">
                    <a
                      href="https://maps.app.goo.gl/mJEwYAnkhUzEmmkF7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 underline underline-offset-2 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open interactive directions in Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Working Hours & Operational Desk */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-gray-950">
                      Operational Schedule
                    </h3>
                    <p className="text-[11px] text-gray-500">Pakistan Standard Time (PKT / UTC+5)</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-gray-700">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="font-bold text-gray-900">Monday – Friday</span>
                    <span className="font-medium text-teal-800">9:00 AM – 5:00 PM PKT</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="font-bold text-gray-900">Attribution Telemetry</span>
                    <span className="font-medium text-emerald-700">24/7 Automated Monitoring</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-bold text-gray-900">Saturday – Sunday</span>
                    <span className="font-medium text-gray-500">Urgent Advisories Only</span>
                  </div>
                </div>
              </div>

              {/* Official Verified Networks */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  <Building2 className="w-4 h-4 text-teal-800" />
                  <span>Verified Directorate Channels</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href="https://pk.linkedin.com/company/wenclims"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-xs font-bold text-gray-800"
                  >
                    <Linkedin className="w-4 h-4 text-[#0077b5]" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://x.com/wenclims"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-xs font-bold text-gray-800"
                  >
                    <Twitter className="w-4 h-4 text-gray-900" />
                    <span>X / Twitter</span>
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

export default Contact;

