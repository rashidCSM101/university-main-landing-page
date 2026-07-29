import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, CloudSun } from 'lucide-react';

// WenClims — Weather and Climate Services
// Navigation: same component structure as before, content replaced for wenclims.org

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route navigation
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tools', href: '/tools' },
    { name: 'Projects', href: '/projects' },
    {
      name: 'Publications',
      href: '/publications',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Peer-Reviewed Research', href: '/publications/research' },
        { name: 'Reports', href: '/publications/reports' },
      ],
    },
    {
      name: 'Media',
      href: '/media',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Blogs', href: '/media/blogs' },
        { name: 'Documentaries', href: '/media/documentaries' },
        { name: 'Podcasts & Radioshows', href: '/media/podcasts' },
        { name: 'Talkshows', href: '/media/talkshows' },
        { name: 'Print Media', href: '/media/print' },
      ],
    },
    { name: 'Team', href: '/team' },
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

          {/* Logo — WenClims brand */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeMenu} aria-label="WenClims Home">
            <div className={`p-2 rounded-lg transition-colors ${isScrolled ? 'bg-primary' : 'bg-white/10 backdrop-blur-sm'}`}>
              <CloudSun className={`w-7 h-7 ${isScrolled ? 'text-teal' : 'text-teal'}`} />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`text-lg font-heading font-bold tracking-tight ${isScrolled ? 'text-primary' : 'text-white'}`}>
                WenClims
              </span>
              <span className={`text-[10px] font-medium uppercase tracking-widest ${isScrolled ? 'text-gray-500' : 'text-white/70'}`}>
                Weather &amp; Climate Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative group"
                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.href}
                  className={`flex items-center space-x-1 font-medium text-sm transition-colors duration-300 ${
                    isScrolled ? 'text-gray-700 hover:text-teal' : 'text-white/90 hover:text-teal'
                  }`}
                  aria-haspopup={link.hasDropdown ? 'true' : undefined}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === link.name ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {link.hasDropdown && (
                  <div
                    className={`absolute top-full left-0 pt-3 transition-all duration-200 ${
                      activeDropdown === link.name
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-1'
                    }`}
                  >
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[220px]">
                      {/* Teal accent bar at top of dropdown */}
                      <div className="h-0.5 bg-gradient-to-r from-teal to-teal-dark mx-3 mb-2 rounded" />
                      {link.dropdownItems?.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:text-primary hover:bg-primary-50 transition-colors"
                          onClick={closeMenu}
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

          {/* Desktop CTA — link to admin dashboard (no auth on public site per security guide) */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="https://admin.wenclims.org"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium transition-colors ${
                isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
              }`}
              aria-label="WenClims Admin Dashboard"
            >
              Dashboard
            </a>
            <Link
              to="/contact"
              className="btn-teal text-sm px-5 py-2.5 rounded-lg"
            >
              Get in Touch
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle"
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
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
          <div id="mobile-menu" className="lg:hidden mt-4 bg-white rounded-xl shadow-xl border border-gray-100 p-4">
            {/* Teal accent bar */}
            <div className="h-0.5 bg-gradient-to-r from-teal to-teal-dark mb-4 rounded" />
            <nav className="flex flex-col space-y-3" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-800 font-medium hover:text-teal transition-colors block py-1"
                    onClick={() => !link.hasDropdown && closeMenu()}
                  >
                    {link.name}
                  </Link>
                  {link.hasDropdown && link.dropdownItems && (
                    <div className="ml-4 mt-2 flex flex-col space-y-2 border-l-2 border-teal/30 pl-3">
                      {link.dropdownItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="text-gray-500 text-sm hover:text-teal transition-colors"
                          onClick={closeMenu}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex flex-col space-y-2">
                <Link
                  to="/contact"
                  className="btn-teal text-center text-sm"
                  onClick={closeMenu}
                >
                  Get in Touch
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
