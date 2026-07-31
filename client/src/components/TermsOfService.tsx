import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, FileText, ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TermsOfService = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.terms-hero-content', { y: 40, duration: 0.8, ease: 'power3.out', delay: 0.2 });
      gsap.from('.terms-section', {
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.terms-wrapper',
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
        <title>Terms of Service | WenClims — Weather and Climate Services</title>
        <meta name="description" content="Terms of Service for Weather and Climate Services (WenClims). Read the conditions governing your use of our website, datasets, and climate services." />
        <link rel="canonical" href="https://wenclims.org/terms" />
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
            <div className="terms-hero-content">
              <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
                <FileText className="w-4 h-4 text-teal" />
                <span className="text-white/90 font-medium text-sm">Legal &amp; Policy</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                Terms of <span className="text-primary-light">Service</span>
              </h1>
              <p className="text-white/70 text-lg max-w-2xl">
                Please review these Terms of Service governing your access to and use of Weather and Climate Services (WenClims) website and climate intelligence resources.
              </p>
              <p className="text-xs text-white/50 mt-4">Last Updated: February 2026</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-16">
          <div className="terms-wrapper max-w-4xl mx-auto space-y-8">

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using the Weather and Climate Services (WenClims) website (wenclims.org), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of our website immediately. These terms apply to all visitors, researchers, partners, and users of our climate services.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">2. Use of Website &amp; Climate Resources</h2>
              <p className="text-gray-600 leading-relaxed mb-4">You agree to use our website and resources strictly for lawful purposes and in accordance with these terms. You must not:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Use the website in any way that violates applicable local, national, or international laws</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Attempt to gain unauthorized access to any part of the platform or backend infrastructure</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Upload or transmit viruses, malware, or any malicious code</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Impersonate WenClims personnel or falsely represent affiliation with our organization</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Scrape or redistribute climate datasets without proper attribution or written consent</span></li>
              </ul>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">3. Accounts &amp; Access Controls</h2>
              <p className="text-gray-600 leading-relaxed">
                If you create an account on our platform or dashboard, you are responsible for maintaining the confidentiality of your credentials. You must notify WenClims administration immediately if you suspect unauthorized access. WenClims reserves the right to suspend or terminate accounts that violate these terms.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                All research papers, climate datasets, publications, reports, logos, and design elements on this website are the intellectual property of Weather and Climate Services (WenClims) or its research contributors and are protected by applicable intellectual property laws. Proper attribution is required when citing WenClims publications.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">5. Scientific &amp; Climate Disclaimer</h2>
              <p className="text-gray-600 leading-relaxed">
                While WenClims employs state-of-the-art climate models and peer-reviewed methodology, weather telemetry and climate impact projections carry inherent scientific uncertainty. WenClims provides scientific guidance for informational and policy planning purposes and cannot guarantee absolute meteorological forecasts.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                WenClims shall not be held liable for direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website or reliance on climate projections.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">7. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws of Pakistan. Any disputes shall be subject to the jurisdiction of the courts in Islamabad, Pakistan.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">8. Contact Us</h2>
              <div className="bg-gray-50 rounded-xl p-6 text-gray-600 space-y-2">
                <p><strong>Weather and Climate Services (WenClims)</strong></p>
                <p>88, Lane 2, Lake View Lanes (LVL), Korang Road, Bani Gala, Islamabad, Pakistan</p>
                <p>Email: wenclims@gmail.com</p>
                <p>Phone: +92-333-5672483</p>
              </div>
            </div>

            <div className="terms-section text-center pt-4">
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

export default TermsOfService;
