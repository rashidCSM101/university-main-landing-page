import { GraduationCap, MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Courses', href: '/course/zoology' },
    { name: 'Our Faculty', href: '/faculty' },
    { name: 'Our Events', href: '/events' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const courses = [
    { name: 'Cell Biology & Genetics', href: '/course/zoology' },
    { name: 'Animal Physiology', href: '/course/zoology' },
    { name: 'Ecology & Wildlife', href: '/course/zoology' },
    { name: 'Entomology', href: '/course/zoology' },
    { name: 'Microbiology', href: '/course/zoology' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* CTA Section */}
      <div className="bg-primary py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                Let's Get Moving <span className="text-accent-gold">Today</span>
              </h2>
              <p className="text-white/80">
                Take the first step towards your future. Apply now and join our community.
              </p>
            </div>
            <Link to="/admissions" className="btn-primary bg-white text-primary hover:bg-gray-100 group">
              <span>Apply Now</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
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
                <div className="p-2 bg-primary rounded-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <span className="text-xl font-heading font-bold">GDC Larkana</span>
              </Link>
              <p className="text-gray-400 mb-6">
                Government Degree College Larkana is a premier educational institution committed to nurturing
                minds and building futures through quality education and innovation.
              </p>
              {/* Social Links */}
              <div className="flex space-x-3">
                <span
                  aria-label="Facebook"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
                >
                  <Facebook className="w-5 h-5" />
                </span>
                <span
                  aria-label="Twitter"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
                >
                  <Twitter className="w-5 h-5" />
                </span>
                <span
                  aria-label="Instagram"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
                >
                  <Instagram className="w-5 h-5" />
                </span>
                <span
                  aria-label="LinkedIn"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
                >
                  <Linkedin className="w-5 h-5" />
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="footer-link flex items-center"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 text-primary" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Courses */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Popular Courses</h3>
              <ul className="space-y-3">
                {courses.map((course, index) => (
                  <li key={index}>
                    <Link
                      to={course.href}
                      className="footer-link flex items-center"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 text-primary" />
                      {course.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-gray-400">
                    Government Degree College, Larkana, Sindh, Pakistan
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-400">+92 (74) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-400">info@gdclarkana.edu.pk</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-400">Mon - Fri: 8:00 AM - 6:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © 2026 Government Degree College Larkana. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 text-sm hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
