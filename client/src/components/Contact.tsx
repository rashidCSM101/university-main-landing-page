import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from './Seo';
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
  CheckCircle2,
  Twitter,
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
    // Demo submit — backend integration pending
    setTimeout(() => {
      setFormStatus('sent');
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Office',
      lines: [
        '88, Lane 2, Lake View Lanes (LVL)',
        'Korang Road, Bani Gala, Islamabad',
      ],
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      accent: 'text-blue-600',
    },
    {
      icon: Phone,
      title: 'Phone',
      lines: ['+92-333-5672483'],
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      accent: 'text-emerald-600',
    },
    {
      icon: Mail,
      title: 'Email',
      lines: ['wenclims@gmail.com'],
      gradient: 'from-primary to-rose-600',
      bg: 'bg-red-50',
      accent: 'text-primary',
    },
    {
      icon: Clock,
      title: 'Office Hours',
      lines: ['Mon – Fri: 9:00 AM – 5:00 PM (PKT)', 'Sat–Sun: Closed'],
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      accent: 'text-amber-600',
    },
  ];

  return (
    <>
      <Seo
        title="Contact | WenClims — Weather and Climate Services"
        description="Reach out to WenClims for climate data requests, research collaborations, policy consulting, and general inquiries. Based in Islamabad, Pakistan."
        path="/contact"
      />
      <div ref={pageRef} className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}></div>

          <div className="container-custom relative z-10">
            <div className="contact-hero-content">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>

              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-accent-gold" />
                <span className="text-white/90 font-medium text-sm">Get in Touch</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
                Contact <span className="text-primary-light">WenClims</span>
              </h1>
              <p className="text-lg text-white/70 max-w-2xl">
                Have a question about our climate data, research, or policy consulting services?
                We'd love to hear from you. Reach out and we'll respond as soon as possible.
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
                <p className="text-gray-500 text-sm mb-2">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-8">
                  ⚠️ Demo mode — form submission is not yet connected to a backend. For urgent enquiries please email us directly.
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
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone (optional)</label>
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
                      <select
                        name="subject"
                        required
                        value={contactForm.subject}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                      >
                        <option value="">Select subject</option>
                        <option value="climate-data">Climate Data Request</option>
                        <option value="research">Research Collaboration</option>
                        <option value="policy">Policy Consulting</option>
                        <option value="publications">Publications Enquiry</option>
                        <option value="media">Media & Press</option>
                        <option value="general">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                    <textarea
                      rows={5}
                      name="message"
                      placeholder="Describe your query in detail..."
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
                {/* Map — WenClims Islamabad */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="p-5 pb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Our Location — Islamabad
                    </h3>
                  </div>
                  <div className="h-[250px] bg-gray-200">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3322.5!2d73.1!3d33.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM5JzAwLjAiTiA3M8KwMDYnMDAuMCJF!5e0!3m2!1sen!2spk!4v1700000000000"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      sandbox="allow-scripts"
                      title="WenClims Office — Islamabad"
                    ></iframe>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Follow WenClims</h3>
                  <p className="text-sm text-gray-500 mb-5">
                    Stay updated with our latest research, climate alerts, and policy publications.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Twitter,  label: 'X / Twitter', href: 'https://x.com/wenclims',                   color: 'hover:bg-sky-500',  bg: 'bg-sky-50',   text: 'text-sky-600'   },
                      { icon: Linkedin, label: 'LinkedIn',    href: 'https://pk.linkedin.com/company/wenclims', color: 'hover:bg-blue-700', bg: 'bg-indigo-50', text: 'text-indigo-600' },
                    ].map((social, i) => (
                      <a
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className={`flex items-center gap-3 ${social.bg} rounded-xl p-3 group transition-all duration-300 ${social.color} hover:text-white`}
                      >
                        <social.icon className={`w-5 h-5 ${social.text} group-hover:text-white transition-colors`} />
                        <span className={`text-sm font-medium ${social.text} group-hover:text-white transition-colors`}>
                          {social.label}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick FAQ */}
                <div className="bg-gradient-to-br from-gray-900 to-primary-dark rounded-3xl p-6 text-white">
                  <h3 className="font-bold mb-3">Quick FAQ</h3>
                  <div className="space-y-3">
                    {[
                      { q: 'Do you provide custom climate datasets?', a: 'Yes — contact us with your region and variable requirements.' },
                      { q: 'Can WenClims consult for government projects?', a: 'Absolutely. We work with governments and development agencies across South Asia.' },
                      { q: 'How can I access your publications?', a: 'Most publications are freely available on our Publications page.' },
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
