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
    { name: 'About', href: '/about', hasDropdown: true },
    { name: 'Pages', href: '/pages', hasDropdown: true },
    { name: 'Courses', href: '/courses', hasDropdown: true },
    { name: 'Blog', href: '/blog', hasDropdown: true },
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
            <span className={`text-2xl font-heading font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              Academix
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
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
                {link.hasDropdown && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white rounded-lg shadow-xl py-2 min-w-[200px]">
                      <Link
                        to={`${link.href}/option1`}
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
                      >
                        Option 1
                      </Link>
                      <Link
                        to={`${link.href}/option2`}
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
                      >
                        Option 2
                      </Link>
                      <Link
                        to={`${link.href}/option3`}
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
                      >
                        Option 3
                      </Link>
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
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-700 font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
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
