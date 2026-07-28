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
  Sparkles,
  Send,
  MessageSquare,
  User,
  BookOpen,
  CheckCircle2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [contactForm, setContactForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.contact-hero-content', {
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from('.contact-section', {
        y: 40,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-sections-wrapper',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
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
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Station Address',
      lines: ['Atmospheric Telemetry Center', 'Station 101, National Climate Grid'],
      gradient: 'from-sky to-blue-700',
      bg: 'bg-sky-50',
      accent: 'text-sky',
    },
    {
      icon: Phone,
      title: 'Emergency Weather Hotline',
      lines: ['+1 (800) 555-WCS-RADAR', '+1 (800) 555-9277'],
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      accent: 'text-teal',
    },
    {
      icon: Mail,
      title: 'Telemetry & Alerts Email',
      lines: ['alerts@wcs-weather.org', 'data@wcs-weather.org'],
      gradient: 'from-amber to-orange-600',
      bg: 'bg-amber-50',
      accent: 'text-amber',
    },
    {
      icon: Clock,
      title: 'Operations Desk',
      lines: ['Radar Operations: 24/7 Live', 'Public Inquiry: Mon - Fri 8AM - 6PM'],
      gradient: 'from-indigo-600 to-blue-700',
      bg: 'bg-indigo-50',
      accent: 'text-indigo-600',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Station | Weather & Climate Services (WCS)</title>
        <meta name="description" content="Contact the Weather & Climate Services (WCS) telemetry center, emergency Doppler radar desk, and climate inquiry support." />
        <link rel="canonical" href="https://wcs-weather.org/contact" />
      </Helmet>
      <div ref={pageRef} className="min-h-screen bg-slate-50">
        {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary-light to-secondary pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-sky rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}></div>

        <div className="container-custom relative z-10">
          <div className="contact-hero-content">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sky-200 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-amber" />
              <span className="text-white/90 font-medium text-sm">Station Desk</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
              Weather Inquiry & <span className="text-sky">Support Desk</span>
            </h1>
            <p className="text-lg text-slate-200 max-w-2xl">
              Have questions about radar telemetry, agricultural advisories, or disaster alert integrations? Contact our 24/7 weather operations team.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="contact-sections-wrapper container-custom py-16">
        <div className="max-w-6xl mx-auto">

          {/* Contact Info Cards */}
          <div className="contact-section grid sm:grid-cols-2 lg:grid-cols-4 gap-5 -mt-28 relative z-20 mb-16">
            {contactInfo.map((info, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                {info.lines.map((line, j) => (
                  <p key={j} className="text-sm text-gray-500">{line}</p>
                ))}
              </div>
            ))}
          </div>

          {/* Form & Map Grid */}
          <div className="contact-section grid lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-5">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary font-semibold text-xs uppercase tracking-wider">Send Message</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
                Write to <span className="text-primary">Us</span>
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        required
                        value={contactForm.name}
                        onChange={handleContactChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        required
                        value={contactForm.email}
                        onChange={handleContactChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+92 300 1234567"
                        value={contactForm.phone}
                        onChange={handleContactChange}
                        pattern="(\+92|0)\d{10}"
                        title="Enter a valid Pakistani phone number"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        name="subject"
                        required
                        value={contactForm.subject}
                        onChange={handleContactChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                      >
                        <option value="">Select subject</option>
                        <option value="admission">Admission Inquiry</option>
                        <option value="zoology">Zoology Department</option>
                        <option value="fees">Fee Structure</option>
                        <option value="general">General Inquiry</option>
                        <option value="complaint">Complaint</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                  <textarea
                    rows={5}
                    name="message"
                    placeholder="Write your message here..."
                    required
                    value={contactForm.message}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className={`btn-primary w-full sm:w-auto group ${formStatus === 'sending' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {formStatus === 'idle' && (
                    <>
                      <span>Send Message</span>
                      <Send className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                  {formStatus === 'sending' && (
                    <>
                      <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Sending...</span>
                    </>
                  )}
                  {formStatus === 'sent' && (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      <span>Message Sent!</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <div className="p-5 pb-3">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Our Location
                  </h3>
                </div>
                <div className="h-[250px] bg-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3569.123456789!2d68.1!3d27.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDMzJzAwLjAiTiA2OMKwMDYnMDAuMCJF!5e0!3m2!1sen!2s!4v1700000000000"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    sandbox="allow-scripts"
                    title="GDC Larkana Location"
                  ></iframe>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
                <p className="text-sm text-gray-500 mb-5">
                  Stay connected with us on social media for latest updates and announcements.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
                    { icon: Twitter, label: 'Twitter', color: 'hover:bg-sky-500', bg: 'bg-sky-50', text: 'text-sky-600' },
                    { icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-500', bg: 'bg-pink-50', text: 'text-pink-600' },
                    { icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-700', bg: 'bg-indigo-50', text: 'text-indigo-600' },
                  ].map((social, i) => (
                    <span
                      key={i}
                      aria-label={social.label}
                      className={`flex items-center gap-3 ${social.bg} rounded-xl p-3 group transition-all duration-300 ${social.color} hover:text-white cursor-pointer`}
                    >
                      <social.icon className={`w-5 h-5 ${social.text} group-hover:text-white transition-colors`} />
                      <span className={`text-sm font-medium ${social.text} group-hover:text-white transition-colors`}>
                        {social.label}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick FAQ */}
              <div className="bg-gradient-to-br from-gray-900 to-primary-dark rounded-3xl p-6 text-white">
                <h3 className="font-bold mb-3">Quick FAQ</h3>
                <div className="space-y-3">
                  {[
                    { q: 'When do admissions open?', a: 'Admissions typically open in July-August each year.' },
                    { q: 'Is hostel available?', a: 'Currently hostel facility is not available at GDC Larkana.' },
                    { q: 'What is the fee structure?', a: 'Fee details are available at the admission office.' },
                  ].map((faq, i) => (
                    <div key={i} className="bg-white/10 rounded-xl p-3.5">
                      <p className="text-sm font-semibold text-white/90">{faq.q}</p>
                      <p className="text-xs text-white/60 mt-1">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default Contact;
