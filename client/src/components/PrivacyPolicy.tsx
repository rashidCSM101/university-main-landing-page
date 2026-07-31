import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Sparkles, Shield, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PrivacyPolicy = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.policy-hero-content', { y: 40, duration: 0.8, ease: 'power3.out', delay: 0.2 });
      gsap.from('.policy-section', {
        y: 30, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.policy-wrapper', start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Privacy Policy | WenClims — Weather and Climate Services</title>
        <meta name="description" content="Privacy Policy of Weather and Climate Services (WenClims). Learn how we collect, use, and protect your information." />
        <link rel="canonical" href="https://wenclims.org/privacy" />
      </Helmet>
      <div ref={pageRef} className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="container-custom relative z-10">
            <div className="policy-hero-content">
              <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
                <Shield className="w-4 h-4 text-accent-gold" />
                <span className="text-white/90 font-medium text-sm">Legal</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
                Privacy <span className="text-primary-light">Policy</span>
              </h1>
              <p className="text-lg text-white/70 max-w-2xl">
                Your privacy is important to us. This policy explains how we handle your personal data.
              </p>
              <p className="text-sm text-white/40 mt-4">Last updated: February 14, 2026</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="policy-wrapper container-custom py-16">
          <div className="max-w-4xl mx-auto space-y-10">

            <div className="policy-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Weather and Climate Services (WenClims) may collect the following types of information when you use our website:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span><strong>Personal Information:</strong> Name, email address, phone number, and academic details when you fill out contact forms, admission applications, or registration forms.</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span><strong>Usage Data:</strong> Browser type, IP address, pages visited, time spent on pages, and other analytical data collected automatically.</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span><strong>Cookies:</strong> Small data files stored on your device to enhance your browsing experience.</span></li>
              </ul>
            </div>

            <div className="policy-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Process admission applications and enrollment requests</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Respond to inquiries and provide academic support</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Send important notices, exam schedules, and timetable updates</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Improve our website functionality and user experience</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Comply with legal obligations and institutional requirements</span></li>
              </ul>
            </div>

            <div className="policy-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">3. Data Protection & Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Our website uses HTTPS encryption for secure data transmission. Access to personal data is restricted to authorized college staff who need it to perform their duties.
              </p>
            </div>

            <div className="policy-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
              <p className="text-gray-600 leading-relaxed">
                Our website may use third-party services such as Google Fonts for typography and YouTube for embedded video content. These services may collect usage data in accordance with their own privacy policies. We do not sell, trade, or rent your personal information to third parties.
              </p>
            </div>

            <div className="policy-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">5. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Access the personal data we hold about you</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Request correction of inaccurate information</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Request deletion of your personal data (subject to legal requirements)</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Opt out of non-essential communications</span></li>
              </ul>
            </div>

            <div className="policy-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">6. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6 text-gray-600 space-y-2">
                <p><strong>Weather and Climate Services (WenClims)</strong></p>
                <p>88, Lane 2, Lake View Lanes (LVL), Korang Road, Bani Gala, Islamabad, Pakistan</p>
                <p>Email: wenclims@gmail.com</p>
                <p>Phone: +92-333-5672483</p>
              </div>
            </div>

            <div className="policy-section text-center pt-4">
              <Link to="/" className="btn-primary group inline-flex">
                <span>Back to Home</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
