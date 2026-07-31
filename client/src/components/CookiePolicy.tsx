import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Sparkles, Cookie, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CookiePolicy = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.cookie-hero-content', { y: 40, duration: 0.8, ease: 'power3.out', delay: 0.2 });
      gsap.from('.cookie-section', {
        y: 30, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.cookie-wrapper', start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Cookie Policy | WenClims — Weather and Climate Services</title>
        <meta name="description" content="Cookie Policy of Weather and Climate Services (WenClims). Understand how and why we use cookies on our website." />
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
            <div className="cookie-hero-content">
              <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
                <Cookie className="w-4 h-4 text-accent-gold" />
                <span className="text-white/90 font-medium text-sm">Legal</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
                Cookie <span className="text-primary-light">Policy</span>
              </h1>
              <p className="text-lg text-white/70 max-w-2xl">
                This policy explains how we use cookies and similar technologies on our website.
              </p>
              <p className="text-sm text-white/40 mt-4">Last updated: February 14, 2026</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="cookie-wrapper container-custom py-16">
          <div className="max-w-4xl mx-auto space-y-10">

            <div className="cookie-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information about how their site is being used. Cookies do not typically contain personally identifiable information.
              </p>
            </div>

            <div className="cookie-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">2. Types of Cookies We Use</h2>
              <p className="text-gray-600 leading-relaxed mb-4">Our website uses the following types of cookies:</p>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    Essential Cookies
                  </h3>
                  <p className="text-gray-600 text-sm">These cookies are necessary for the website to function properly. They enable core features like page navigation, access to secure areas, and form submissions. The website cannot function without these cookies.</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    Functional Cookies
                  </h3>
                  <p className="text-gray-600 text-sm">These cookies remember your preferences and choices (such as language or region) to provide a more personalized experience. They may also be used to remember the login status for the research member portal.</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    Analytics Cookies
                  </h3>
                  <p className="text-gray-600 text-sm">These cookies help us understand how visitors interact with our website by collecting anonymous usage data. This information helps us improve the quality and content of our site. We may use services like Google Analytics for this purpose.</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    Third-Party Cookies
                  </h3>
                  <p className="text-gray-600 text-sm">Some cookies are placed by third-party services that appear on our pages, such as embedded YouTube videos or Google Fonts. These third parties may use cookies to track your browsing activity across different websites.</p>
                </div>
              </div>
            </div>

            <div className="cookie-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">3. How to Manage Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>View and delete existing cookies</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Block all cookies or only third-party cookies</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Set preferences for certain websites</span></li>
                <li className="flex items-start gap-3"><Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><span>Receive notifications when a cookie is being set</span></li>
              </ul>
              <p className="text-gray-500 text-sm mt-4">
                Please note that disabling cookies may affect the functionality of certain features on our website, such as the research member portal login and form submissions.
              </p>
            </div>

            <div className="cookie-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">4. Cookie Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                Session cookies are temporary and are deleted when you close your browser. Persistent cookies remain on your device for a set period (typically up to 1 year for analytics cookies) or until you manually delete them. Essential cookies are session-based and are cleared automatically upon browser closure.
              </p>
            </div>

            <div className="cookie-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">5. Updates to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </div>

            <div className="cookie-section bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">6. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6 text-gray-600 space-y-2">
                <p><strong>Weather and Climate Services (WenClims)</strong></p>
                <p>88, Lane 2, Lake View Lanes (LVL), Korang Road, Bani Gala, Islamabad, Pakistan</p>
                <p>Email: wenclims@gmail.com</p>
                <p>Phone: +92-333-5672483</p>
              </div>
            </div>

            <div className="cookie-section text-center pt-4">
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

export default CookiePolicy;
