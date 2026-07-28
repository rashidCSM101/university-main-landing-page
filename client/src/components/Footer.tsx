import { CloudSun, MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { name: 'About WCS', href: '/about' },
    { name: 'Live Radar & Services', href: '/course/doppler-radar' },
    { name: 'Our Team', href: '/faculty' },
    { name: 'Weather Bulletins', href: '/noticeboard' },
    { name: 'Contact Station', href: '/contact' },
  ];

  const services = [
    { name: 'High-Res Doppler Radar', href: '/course/doppler-radar' },
    { name: 'Agricultural Soil Weather', href: '/course/doppler-radar' },
    { name: 'Marine & Offshore Wave Tracking', href: '/course/doppler-radar' },
    { name: 'Aviation Turbulence Alert', href: '/course/doppler-radar' },
    { name: 'Satellite Telemetry', href: '/timetable' },
  ];

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary via-primary-light to-secondary py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-white">
                Stay Ahead of Severe Weather <span className="text-amber">Alerts</span>
              </h2>
              <p className="text-slate-200">
                Subscribe to real-time satellite notifications, rainfall warnings, and climate advisories.
              </p>
            </div>
            <Link to="/noticeboard" className="px-6 py-3.5 bg-sky hover:bg-sky-dark text-white font-semibold rounded-xl shadow-lg transition-all flex items-center space-x-2">
              <span>View Weather Alerts</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* About */}
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-sky rounded-lg text-white">
                  <CloudSun className="w-8 h-8" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-heading font-bold text-white tracking-wide">
                    WCS Portal
                  </span>
                  <span className="text-xs text-sky-400 uppercase tracking-widest -mt-1 font-semibold">
                    Weather & Climate
                  </span>
                </div>
              </Link>
              <p className="text-slate-400 mb-6 text-sm">
                Weather & Climate Services (WCS) provides state-of-the-art Doppler radar forecasting, satellite remote sensing telemetry, and climate hazard advisories.
              </p>
              {/* Social Links */}
              <div className="flex space-x-3">
                <span
                  aria-label="Facebook"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky transition-colors cursor-pointer text-white"
                >
                  <Facebook className="w-5 h-5" />
                </span>
                <span
                  aria-label="Twitter"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky transition-colors cursor-pointer text-white"
                >
                  <Twitter className="w-5 h-5" />
                </span>
                <span
                  aria-label="Instagram"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky transition-colors cursor-pointer text-white"
                >
                  <Instagram className="w-5 h-5" />
                </span>
                <span
                  aria-label="LinkedIn"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky transition-colors cursor-pointer text-white"
                >
                  <Linkedin className="w-5 h-5" />
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-sky-300 transition-colors flex items-center text-sm"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 text-sky" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weather Services */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Weather Services</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link
                      to={service.href}
                      className="text-slate-400 hover:text-sky-300 transition-colors flex items-center text-sm"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 text-sky" />
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Station Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-sky mt-1 flex-shrink-0" />
                  <span className="text-slate-400 text-sm">
                    Atmospheric Telemetry Center, Station 101, National Climate Grid
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-sky flex-shrink-0" />
                  <span className="text-slate-400 text-sm">+1 (800) 555-WCS-RADAR</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-sky flex-shrink-0" />
                  <span className="text-slate-400 text-sm">alerts@wcs-weather.org</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-sky flex-shrink-0" />
                  <span className="text-slate-400 text-sm">Operation Desk: 24/7 Real-Time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-slate-500 text-sm">
              © 2026 Weather & Climate Services (WCS). All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-slate-400 text-sm hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-400 text-sm hover:text-white transition-colors">
                Terms of Telemetry
              </Link>
              <Link to="/grading-policy" className="text-slate-400 text-sm hover:text-white transition-colors">
                AQI Severity Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
