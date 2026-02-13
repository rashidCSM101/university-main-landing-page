import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, GraduationCap } from 'lucide-react';

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
    { name: 'About', href: '/about' },
    { name: 'Faculty', href: '/faculty' },
    {
      name: 'Courses', href: '/course/zoology', hasDropdown: true,
      dropdownItems: [
        { name: 'BS Zoology', href: '/course/zoology' },
        { name: 'Timetable', href: '/timetable' },
      ],
    },
    {
      name: 'Pages', href: '#', hasDropdown: true,
      dropdownItems: [
        { name: 'Notice Board', href: '/noticeboard' },
        { name: 'Admissions', href: '/admissions' },
        { name: 'Events', href: '/events' },
      ],
    },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${isScrolled ? 'bg-primary' : 'bg-white'}`}>
              <GraduationCap className={`w-8 h-8 ${isScrolled ? 'text-white' : 'text-primary'}`} />
            </div>
            <span className={`text-xl font-heading font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              GDC Larkana
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  to={link.href}
                  className={`flex items-center space-x-1 font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-primary-100'
                  }`}
                  {...(link.hasDropdown ? { 'aria-haspopup': 'true' } : {})}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
                {link.hasDropdown && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white rounded-lg shadow-xl py-2 min-w-[200px]">
                      {link.dropdownItems?.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
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
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-primary-100'
              }`}
            >
              Log In
            </Link>
            <Link to="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 bg-white rounded-lg shadow-xl p-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-700 font-medium hover:text-primary transition-colors"
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
                          className="text-gray-500 text-sm hover:text-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="text-gray-700 font-medium hover:text-primary transition-colors"
                >
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary text-center">
                  Get Started
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
