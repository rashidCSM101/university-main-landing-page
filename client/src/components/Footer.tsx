import { MapPin, Phone, Mail, Twitter, Linkedin, ArrowRight, CloudSun, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

// WenClims Footer — content from wenclims.org
// Structure kept identical to the original footer for design continuity

const Footer = () => {
  const quickLinks = [
    { name: 'Tools', href: '/tools' },
    { name: 'Projects', href: '/projects' },
    { name: 'Publications', href: '/publications' },
    { name: 'Our Team', href: '/team' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const mediaLinks = [
    { name: 'Blogs', href: '/media/blogs' },
    { name: 'Documentaries', href: '/media/documentaries' },
    { name: 'Podcasts & Radioshows', href: '/media/podcasts' },
    { name: 'Talkshows', href: '/media/talkshows' },
    { name: 'Print Media Excerpts', href: '/media/print' },
  ];

  return (
    <footer className="bg-gray-900 text-white">

      {/* CTA Section — WenClims contact/collaboration CTA */}
      <div className="py-16" style={{ background: 'linear-gradient(135deg, #0B1E3D 0%, #1A3461 100%)' }}>
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                Science &amp; Policy{' '}
                <span style={{ color: '#00C8C8' }}>Together</span>
              </h2>
              <p className="text-white/80 max-w-md">
                Partner with WenClims for climate science, policy analysis, and capacity building across South Asia.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group"
              style={{ background: '#00C8C8', color: '#0B1E3D' }}
            >
              <span>Get in Touch</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Brand Column */}
            <div>
              <Link to="/" className="flex items-center space-x-3 mb-6" aria-label="WenClims Home">
                <div className="p-2 rounded-lg" style={{ background: '#00C8C8' }}>
                  <CloudSun className="w-7 h-7" style={{ color: '#0B1E3D' }} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-heading font-bold text-white">WenClims</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">Climate Services</span>
                </div>
              </Link>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Providing assistance and science-based guidance to decision-makers about climate change
                and its biophysical and socioeconomic impacts across South Asia.
              </p>

              {/* Social Links — X and LinkedIn only (matches wenclims.org) */}
              <div className="flex space-x-3">
                <a
                  href="https://x.com/wenclims"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WenClims on X (Twitter)"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://pk.linkedin.com/company/wenclims"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WenClims on LinkedIn"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-base font-semibold mb-6 text-white uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="footer-link flex items-center text-sm">
                      <ArrowRight className="w-3.5 h-3.5 mr-2 flex-shrink-0" style={{ color: '#00C8C8' }} />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Media Section Links */}
            <div>
              <h3 className="text-base font-semibold mb-6 text-white uppercase tracking-wider">Media</h3>
              <ul className="space-y-3">
                {mediaLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="footer-link flex items-center text-sm">
                      <ArrowRight className="w-3.5 h-3.5 mr-2 flex-shrink-0" style={{ color: '#00C8C8' }} />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info — from wenclims.org sitemap export */}
            <div>
              <h3 className="text-base font-semibold mb-6 text-white uppercase tracking-wider">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#00C8C8' }} />
                  <span className="text-gray-400 text-sm">
                    88, Lane 2, Lake View Lanes (LVL),<br />
                    Korang Road, Bani Gala,<br />
                    Islamabad, Pakistan
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#00C8C8' }} />
                  <a
                    href="tel:+923335672483"
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    +92-333-5672483
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#00C8C8' }} />
                  <a
                    href="mailto:wenclims@gmail.com"
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    wenclims@gmail.com
                  </a>
                </li>
                <li className="flex items-center space-x-3 pt-2">
                  <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: '#00C8C8' }} />
                  <a
                    href="https://pakclimtool.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    pakclimtool.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Weather and Climate Services (WenClims). All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-500 text-sm hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 text-sm hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
