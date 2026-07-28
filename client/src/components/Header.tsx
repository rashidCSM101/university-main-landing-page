import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, CloudSun } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About WCS', href: '/about' },
    { name: 'Our Team', href: '/faculty' },
    {
      name: 'Services', href: '/course/doppler-radar', hasDropdown: true,
      dropdownItems: [
        { name: 'Live Doppler Radar', href: '/course/doppler-radar' },
        { name: 'Satellite Schedule', href: '/timetable' },
      ],
    },
    {
      name: 'Alerts & Policy', href: '/noticeboard', hasDropdown: true,
      dropdownItems: [
        { name: 'Weather Bulletins', href: '/noticeboard' },
        { name: 'Severe Storm Advisories', href: '/admissions' },
        { name: 'Climate Events', href: '/events' },
        { name: 'AQI & Severity Guide', href: '/grading-policy' },
      ],
    },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-primary shadow-lg py-2 text-white'
          : 'bg-primary/80 backdrop-blur-md py-4 text-white'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-sky text-white shadow-md">
              <CloudSun className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-heading font-bold text-white tracking-wide">
                WCS Portal
              </span>
              <span className="text-xs text-sky-200 font-sans tracking-widest uppercase -mt-1">
                Weather & Climate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  to={link.href}
                  className="flex items-center space-x-1 font-medium text-white hover:text-sky-300 transition-colors duration-300"
                  {...(link.hasDropdown ? { 'aria-haspopup': 'true' } : {})}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <ChevronDown className="w-4 h-4 text-sky-300" />}
                </Link>
                {link.hasDropdown && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-primary-light border border-sky/20 rounded-lg shadow-xl py-2 min-w-[220px]">
                      {link.dropdownItems?.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-4 py-2.5 text-slate-100 hover:bg-sky/20 hover:text-sky-300 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/login"
              className="font-medium text-white hover:text-sky-300 transition-colors"
            >
              Sign In
            </Link>
            <Link to="/signup" className="px-5 py-2.5 bg-sky hover:bg-sky-dark text-white font-medium rounded-lg shadow-md transition-all">
              Live Radar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 bg-primary-light border border-sky/20 rounded-lg shadow-xl p-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white font-medium hover:text-sky-300 transition-colors"
                    onClick={() => !link.hasDropdown && setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.hasDropdown && link.dropdownItems && (
                    <div className="ml-4 mt-2 flex flex-col space-y-2">
                      {link.dropdownItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="text-gray-300 text-sm hover:text-sky-300 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-slate-700 flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="text-white font-medium hover:text-sky-300 transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/signup" className="px-5 py-2.5 bg-sky text-white text-center font-medium rounded-lg">
                  Live Radar
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
