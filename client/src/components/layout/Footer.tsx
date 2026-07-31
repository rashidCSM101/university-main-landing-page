import { MapPin, Phone, Mail, Twitter, Linkedin, ArrowRight, CloudSun } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const quickLinks = [
    { name: 'Vision & Mission', href: '/vision' },
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
      {/* CTA Section */}
      <div className="py-16" style={{ background: 'linear-gradient(135deg, #0B1E3D 0%, #1A3461 100%)' }}>
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                Science &amp; Policy <span style={{ color: '#00C8C8' }}>Together</span>
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

      {/* Main Footer Links */}
      <div className="py-16 border-b border-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CloudSun className="w-8 h-8 text-[#00C8C8]" />
                <span className="font-heading text-xl font-bold text-white">WenClims</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Weather &amp; Climate Services (WenClims) is an independent scientific initiative advancing climate science, adaptation, and risk communication in Pakistan and South Asia.
              </p>
              <div className="flex items-center space-x-4 pt-2">
                <a
                  href="https://x.com/wenclims"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#00C8C8] transition-colors"
                  aria-label="WenClims on X (Twitter)"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://pk.linkedin.com/company/wenclims"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#00C8C8] transition-colors"
                  aria-label="WenClims on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-lg mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2.5">
                {quickLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-400 hover:text-[#00C8C8] transition-colors text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3.5 h-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#00C8C8]" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-lg mb-4 text-white">Media &amp; Outlets</h3>
              <ul className="space-y-2.5">
                {mediaLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-400 hover:text-[#00C8C8] transition-colors text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3.5 h-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#00C8C8]" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-lg mb-4 text-white">Contact Info</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#00C8C8] flex-shrink-0 mt-0.5" />
                  <span>Islamabad, Pakistan</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#00C8C8] flex-shrink-0" />
                  <span className="font-mono text-xs">+92 51 9260100</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#00C8C8] flex-shrink-0" />
                  <span className="font-mono text-xs">info@wenclims.org</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 text-center text-xs text-gray-500">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} WenClims — Weather &amp; Climate Services. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-gray-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
