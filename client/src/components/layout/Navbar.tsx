import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import logoImg from '../../../assets/images/logo.png';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Vision', href: '/vision' },
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
        { name: 'Print Media Excerpts', href: '/media/print' },
      ],
    },
    { name: 'Team', href: '/team' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      style={{ top: isScrolled ? '0px' : 'var(--banner-height, 0px)' }}
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3 border-b border-gray-200/80'
          : 'bg-transparent py-5 border-b border-white/10'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group" onClick={closeMenu}>
            <img src={logoImg} alt="WenClims Logo" className="h-10 w-auto object-contain filter drop-shadow" />
            <div className="flex flex-col">
              <span
                className={`font-heading text-lg font-bold transition-colors leading-tight ${
                  isScrolled ? 'text-gray-900 group-hover:text-[#008B8B]' : 'text-white group-hover:text-[#00C8C8]'
                }`}
              >
                WenClims
              </span>
              <span
                className={`text-[10px] font-semibold tracking-wider uppercase transition-colors ${
                  isScrolled ? 'text-gray-500' : 'text-gray-300'
                }`}
              >
                Weather &amp; Climate Services
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative group"
                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
              >
                <Link
                  to={link.href}
                  className={`flex items-center space-x-1 text-xs md:text-sm font-semibold transition-colors py-2 ${
                    isScrolled
                      ? 'text-gray-700 hover:text-[#008B8B]'
                      : 'text-gray-100 hover:text-[#00C8C8]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform group-hover:rotate-180 ${
                        isScrolled ? 'text-gray-400 group-hover:text-[#008B8B]' : 'text-gray-300 group-hover:text-[#00C8C8]'
                      }`}
                    />
                  )}
                </Link>

                {link.hasDropdown && (
                  <div
                    className={`absolute top-full left-0 w-56 rounded-2xl shadow-2xl py-2 transition-all duration-200 ${
                      isScrolled
                        ? 'bg-white border border-gray-100 text-gray-800'
                        : 'bg-gray-900/95 border border-gray-800 backdrop-blur-xl text-gray-100'
                    } ${
                      activeDropdown === link.name
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    }`}
                  >
                    {link.dropdownItems?.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`block px-4 py-2.5 text-xs font-semibold transition-colors ${
                          isScrolled
                            ? 'text-gray-600 hover:text-[#008B8B] hover:bg-gray-50'
                            : 'text-gray-300 hover:text-[#00C8C8] hover:bg-gray-800/80'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/contact"
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                isScrolled
                  ? 'bg-[#008B8B] text-white hover:bg-teal-700'
                  : 'bg-[#00C8C8] text-gray-950 hover:bg-teal-400 shadow-teal-900/30'
              }`}
            >
              Get in Touch
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[73px] bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 p-6 shadow-2xl max-h-[calc(100vh-73px)] overflow-y-auto space-y-4 text-white">
            {navLinks.map((link) => (
              <div key={link.name} className="space-y-2">
                <Link
                  to={link.href}
                  onClick={closeMenu}
                  className="block text-base font-bold text-white hover:text-[#00C8C8] transition-colors"
                >
                  {link.name}
                </Link>
                {link.hasDropdown && (
                  <div className="pl-4 space-y-2 border-l-2 border-gray-800">
                    {link.dropdownItems?.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={closeMenu}
                        className="block text-sm text-gray-300 hover:text-[#00C8C8] transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4">
              <Link
                to="/contact"
                onClick={closeMenu}
                className="block w-full py-3 text-center bg-[#00C8C8] text-gray-950 font-bold text-sm rounded-xl hover:bg-teal-400 transition-all shadow-lg"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
