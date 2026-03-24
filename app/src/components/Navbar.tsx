import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getGeneralWhatsApp } from '@/lib/config';

const navLinks = [
  { name: 'Inicio', href: '#inicio', page: false },
  { name: 'Motos', href: '#motos', page: false },
  { name: 'Repuestos', href: '#repuestos', page: false },
  { name: 'Servicios', href: '#servicios', page: false },
  { name: 'Financiamiento', href: '/financiamiento', page: true },
  { name: 'Contacto', href: '#contacto', page: false },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { targetSection: href } });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (location.pathname === '/' && location.state?.targetSection) {
      setTimeout(() => {
        const element = document.querySelector(location.state.targetSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      window.history.replaceState({}, '')
    }
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || location.pathname !== '/'
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#inicio');
              }}
              className="flex items-center gap-2 group"
            >
              <img
                src="/Logo-Ibiza-motos.png"
                alt="Ibiza Motos"
                className={`transition-all duration-300 object-contain ${isScrolled || location.pathname !== '/' ? 'h-12' : 'h-14'}`}
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.page ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`relative font-medium text-sm transition-colors duration-300 group ${
                      isScrolled || location.pathname !== '/'
                        ? 'text-gray-600 hover:text-ibiza-red'
                        : '!text-white/90 hover:!text-white'
                    } ${location.pathname === link.href ? '!text-ibiza-red' : ''}`}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ibiza-red transition-all duration-300 group-hover:w-full" />
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={`/${link.href}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className={`relative font-medium text-sm transition-colors duration-300 group ${
                      isScrolled || location.pathname !== '/'
                        ? 'text-gray-600 hover:text-ibiza-red'
                        : '!text-white/90 hover:!text-white'
                    }`}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ibiza-red transition-all duration-300 group-hover:w-full" />
                  </a>
                )
              )}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href={getGeneralWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="bg-gradient-ibiza hover:opacity-90 !text-white font-display font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-glow"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Cotizar Ahora
                </Button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled || location.pathname !== '/' ? 'text-gray-700' : '!text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled || location.pathname !== '/' ? 'text-gray-700' : '!text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div
          className={`absolute top-0 right-0 w-80 h-full bg-white shadow-2xl transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="p-6 pt-20">
            {/* Logo in mobile menu */}
            <div className="mb-8 flex justify-center">
              <img src="/Logo-Ibiza-motos.png" alt="Ibiza Motos" className="h-16 object-contain" />
            </div>
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) =>
                link.page ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-display font-semibold text-gray-700 hover:text-ibiza-red transition-colors py-2 border-b border-gray-100"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={`/${link.href}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-lg font-display font-semibold text-gray-700 hover:text-ibiza-red transition-colors py-2 border-b border-gray-100"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {link.name}
                  </a>
                )
              )}
            </div>
            <div className="mt-8">
              <a
                href={getGeneralWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-gradient-ibiza !text-white font-display font-semibold py-3 rounded-full">
                  <Phone className="w-5 h-5 mr-2" />
                  Cotizar Ahora
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
