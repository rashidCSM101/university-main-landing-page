import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  User,
  CheckCircle2,
  Twitter,
  Linkedin,
  HelpCircle,
  Globe2,
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

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
      );

      gsap.from('.contact-card-anim', {
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-grid-wrapper',
          start: 'top 85%',
        },
      });
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

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Office',
      lines: [
        '88, Lane 2, Lake View Lanes (LVL)',
        'Korang Road, Bani Gala, Islamabad',
      ],
      gradient: 'from-[#48b302] to-teal-900',
    },
    {
      icon: Phone,
      title: 'Phone',
      lines: ['+92-333-5672483', '+92 51 9260100'],
      gradient: 'from-[#00C8C8] to-[#48b302]',
    },
    {
      icon: Mail,
      title: 'Email Inquiries',
      lines: ['wenclims@gmail.com', 'admin@wenclims.org'],
      gradient: 'from-sky-600 to-teal-800',
    },
    {
      icon: Clock,
      title: 'Office Hours',
      lines: ['Mon – Fri: 9:00 AM – 5:00 PM (PKT)', 'Sat–Sun: Urgent Telemetry Only'],
      gradient: 'from-slate-700 to-slate-900',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact &amp; Collaborations | WenClims Weather &amp; Climate Services</title>
        <meta
          name="description"
          content="Reach out to WenClims for extreme event attribution data, research partnerships, policy consulting, and meteorological telemetry inquiries."
        />
        <link rel="canonical" href="https://wenclims.org/contact" />
      </Helmet>

      <div ref={pageRef} className="min-h-screen bg-white font-sans">
        {/* ═══ HERO SECTION ═══ */}
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-gray-900 text-white overflow-hidden">
          {/* Background Image & Overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src={bgImage}
              alt="WenClims Contact Hero"
              onError={() => setBgImage(heroBgFallback)}
              className="w-full h-full object-cover opacity-20 filter contrast-125 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-transparent to-gray-900/90" />
          </div>

          <div className="container-custom relative z-10">
            <div ref={contentRef} className="w-full max-w-4xl">
              {/* Back Link */}
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[#00C8C8] hover:text-white transition-colors mb-6 text-xs font-semibold uppercase tracking-wider group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Return to Overview</span>
              </Link>

              {/* Category Pill */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="w-8 h-px bg-[#00C8C8]" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] px-3.5 py-1.5 rounded-full border border-[#00C8C8]/50 text-[#00C8C8] bg-[#00C8C8]/10 backdrop-blur-md">
                  Scientific Inquiries &amp; Collaborations
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
                Get in Touch with <span className="text-[#00C8C8]">WenClims</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-3xl mb-4">
                Have a question about our extreme weather attribution models, high-resolution WRF data, or regional climate policy consulting?
                Our scientific team is available for partnerships and technical inquiries.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ CONTACT CARDS & FORM CONTAINER ═══ */}
        <section className="bg-white relative z-20 pt-0 pb-20">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              {/* 4 Top Info Cards (Overlapping Hero) */}
              <div className="contact-grid-wrapper grid sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 relative z-30 mb-16">
                {contactInfo.map((info, i) => (
                  <div
                    key={i}
                    className="contact-card-anim group bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100/90 flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">{info.title}</h3>
                      {info.lines.map((line, j) => (
                        <p key={j} className="text-xs text-gray-600 font-medium leading-relaxed">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form & Sidebar Grid */}
              <div className="grid lg:grid-cols-5 gap-10 items-start">
                {/* Left Side: Contact Form */}
                <div className="lg:col-span-3 bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-200/80">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#48b302]/10 text-[#48b302] text-xs font-bold uppercase tracking-wider mb-4 border border-[#48b302]/30">
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Message</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-3">
                    Write to Our <span className="text-[#48b302]">Scientific Team</span>
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-8">
                    Submit your data inquiry, research proposal, or partnership query below. Our team reviews all messages promptly.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            placeholder="Dr. Ali Haider"
                            required
                            value={contactForm.name}
                            onChange={handleContactChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#48b302]/30 focus:border-[#48b302] transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            placeholder="ali@university.edu.pk"
                            required
                            value={contactForm.email}
                            onChange={handleContactChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#48b302]/30 focus:border-[#48b302] transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Phone (Optional)</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            placeholder="+92 300 1234567"
                            value={contactForm.phone}
                            onChange={handleContactChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#48b302]/30 focus:border-[#48b302] transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Inquiry Category *</label>
                        <select
                          name="subject"
                          required
                          value={contactForm.subject}
                          onChange={handleContactChange}
                          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#48b302]/30 focus:border-[#48b302] transition-all font-medium appearance-none"
                        >
                          <option value="">Select subject category</option>
                          <option value="climate-data">Climate &amp; Reanalysis Data Request</option>
                          <option value="research">Attribution Research Collaboration</option>
                          <option value="policy">Policy &amp; Disaster Risk Consulting</option>
                          <option value="publications">Publications &amp; Citation Inquiry</option>
                          <option value="media">Media, Press &amp; Interview</option>
                          <option value="general">General Institution Query</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Message *</label>
                      <textarea
                        rows={5}
                        name="message"
                        placeholder="Describe your research project, dataset request, or collaboration objective in detail..."
                        required
                        value={contactForm.message}
                        onChange={handleContactChange}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#48b302]/30 focus:border-[#48b302] transition-all resize-none font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className={`w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#48b302] hover:bg-[#007474] text-white font-bold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 ${
                        formStatus === 'sending' ? 'opacity-75 cursor-wait' : ''
                      }`}
                    >
                      {formStatus === 'idle' && (
                        <>
                          <span>Submit Message</span>
                          <Send className="ml-2 w-4 h-4" />
                        </>
                      )}
                      {formStatus === 'sending' && (
                        <>
                          <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>Sending Inquiry...</span>
                        </>
                      )}
                      {formStatus === 'sent' && (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-300" />
                          <span>Message Submitted Successfully!</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Right Side: Map & Sidebar Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Google Map Box */}
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200/80">
                    <div className="p-5 bg-gray-900 text-white flex items-center justify-between">
                      <h3 className="font-heading font-bold text-base flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#00C8C8]" />
                        <span>Islamabad Headquarters</span>
                      </h3>
                      <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md bg-[#00C8C8]/20 text-[#00C8C8] border border-[#00C8C8]/30">
                        PKT GMT+5
                      </span>
                    </div>
                    <div className="h-[260px] bg-gray-200 relative">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3322.5!2d73.1!3d33.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM5JzAwLjAiTiA3M8KwMDYnMDAuMCJF!5e0!3m2!1sen!2spk!4v1700000000000"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        sandbox="allow-scripts"
                        title="WenClims Office Location — Islamabad"
                      />
                    </div>
                    <div className="p-5 bg-gray-50 border-t border-gray-100">
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">
                        📍 88, Lane 2, Lake View Lanes (LVL), Korang Road, Bani Gala, Islamabad, Pakistan.
                      </p>
                    </div>
                  </div>

                  {/* Social Channels */}
                  <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200/80">
                    <h3 className="font-heading font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Globe2 className="w-4 h-4 text-[#48b302]" />
                      <span>Official Network</span>
                    </h3>
                    <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                      Follow our official publications and daily attribution alerts on social networks.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Twitter, label: 'X / Twitter', href: 'https://x.com/wenclims', color: 'hover:bg-sky-500 hover:text-white', bg: 'bg-sky-50', text: 'text-sky-600' },
                        { icon: Linkedin, label: 'LinkedIn', href: 'https://pk.linkedin.com/company/wenclims', color: 'hover:bg-indigo-600 hover:text-white', bg: 'bg-indigo-50', text: 'text-indigo-600' },
                      ].map((social, i) => (
                        <a
                          key={i}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className={`flex items-center gap-2.5 ${social.bg} rounded-2xl p-3.5 transition-all duration-300 ${social.color}`}
                        >
                          <social.icon className={`w-4 h-4 ${social.text} transition-colors`} />
                          <span className={`text-xs font-bold ${social.text} transition-colors`}>
                            {social.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Quick FAQ Card */}
                  <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-teal-950 rounded-3xl p-6 text-white shadow-xl border border-teal-900/50">
                    <h3 className="font-heading font-bold text-base mb-4 flex items-center gap-2 text-[#00C8C8]">
                      <HelpCircle className="w-4 h-4" />
                      <span>Frequently Asked</span>
                    </h3>
                    <div className="space-y-3.5">
                      {[
                        { q: 'Do you provide regional climate datasets?', a: 'Yes — submit an inquiry specifying target coordinates, model parameters, and timescale.' },
                        { q: 'Can WenClims consult for disaster policy?', a: 'We work closely with disaster management authorities and climate risk agencies across South Asia.' },
                        { q: 'Are publications open-access?', a: 'All our research papers and technical monographs are available on our Publications page.' },
                      ].map((faq, i) => (
                        <div key={i} className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-md border border-white/10">
                          <p className="text-xs font-bold text-white mb-1">{faq.q}</p>
                          <p className="text-[11px] text-gray-300 font-light leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
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
