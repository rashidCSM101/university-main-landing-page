import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Sparkles, FileText, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TermsOfService = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.terms-hero-content', { y: 40, duration: 0.8, ease: 'power3.out', delay: 0.2 });
      gsap.from('.terms-section', {
        y: 30, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.terms-wrapper', start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Terms of Service | GDC Larkana</title>
        <meta name="description" content="Terms of Service for Government Degree College Larkana website. Read the conditions governing your use of our website and services." />
        <link rel="canonical" href="https://gdclarkana.edu.pk/terms" />
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
                <FileText className="w-4 h-4 text-accent-gold" />
                <span className="text-white/90 font-medium text-sm">Legal</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
                Terms of <span className="text-primary-light">Service</span>
              </h1>
              <p className="text-lg text-white/70 max-w-2xl">
                Please read these terms carefully before using our website and services.
              </p>
              <p className="text-sm text-white/40 mt-4">Last updated: February 14, 2026</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="terms-wrapper container-custom py-16">
          <div className="max-w-4xl mx-auto space-y-10">

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using the Government Degree College Larkana website (gdclarkana.edu.pk), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of our website immediately. These terms apply to all visitors, students, faculty, and users of our website.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">2. Use of Website</h2>
              <p className="text-gray-600 leading-relaxed mb-4">You agree to use our website only for lawful purposes and in accordance with these terms. You must not:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Use the website in any way that violates applicable laws or regulations</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Attempt to gain unauthorized access to any part of the website or its systems</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Upload or transmit viruses, malware, or any harmful code</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Impersonate any person or entity, or falsely represent your affiliation</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Scrape, copy, or redistribute website content without written permission</span></li>
              </ul>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">3. Student Portal & Accounts</h2>
              <p className="text-gray-600 leading-relaxed">
                If you create a student account on our portal, you are responsible for maintaining the confidentiality of your login credentials. You must notify the college administration immediately if you suspect unauthorized access to your account. GDC Larkana reserves the right to suspend or terminate accounts that violate these terms or college regulations.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                All content on this website, including text, images, logos, course materials, timetables, notices, and design elements, is the property of Government Degree College Larkana or its content providers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without prior written consent from the college.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">5. Academic Information Disclaimer</h2>
              <p className="text-gray-600 leading-relaxed">
                While we strive to keep all academic information (timetables, exam schedules, admission dates, fee structures) accurate and up-to-date, GDC Larkana does not guarantee the completeness or accuracy of any information on this website. Official academic decisions should always be confirmed through the college administration office. The college reserves the right to modify courses, schedules, and policies without prior notice.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                GDC Larkana shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use this website. This includes, but is not limited to, damages from errors, omissions, interruptions, or delays in website service. Your use of the website is at your own risk.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">7. External Links</h2>
              <p className="text-gray-600 leading-relaxed">
                Our website may contain links to external websites (such as the University of Sindh, HEC, or social media platforms). These links are provided for convenience only. GDC Larkana does not endorse or take responsibility for the content, privacy practices, or terms of any third-party websites.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                GDC Larkana reserves the right to update or modify these Terms of Service at any time without prior notice. Changes will be effective immediately upon posting on this page. Your continued use of the website after any modifications constitutes acceptance of the updated terms. We encourage you to revisit this page periodically.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">9. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws of Pakistan. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Larkana, Sindh.
              </p>
            </div>

            <div className="terms-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">10. Contact</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                For questions regarding these Terms of Service, contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6 text-gray-600 space-y-2">
                <p><strong>Government Degree College Larkana</strong></p>
                <p>Station Road, Larkana, Sindh 77150, Pakistan</p>
                <p>Email: info@gdclarkana.edu.pk</p>
                <p>Phone: +92 (74) 123-4567</p>
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
