import { useState, useEffect } from 'react';
import { Menu, X, Phone, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getGeneralWhatsApp } from '@/lib/config';
import { useSearch } from '@/components/SearchOverlay';

const navLinks = [
  { name: 'Inicio', href: '#inicio', page: false },
  { name: 'Catálogo', href: '/marca/todas', page: true },
  { name: 'Marcas', href: '#motos', page: false },
  { name: 'Repuestos', href: '#repuestos', page: false },
  { name: 'Servicios', href: '#servicios', page: false },
  { name: 'Financiamiento', href: '/financiamiento', page: true },
  { name: 'Sucursales', href: '/sucursales', page: true },
  { name: 'Contacto', href: '#contacto', page: false },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { openSearch } = useSearch();

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
      const target = location.state.targetSection as string;
      let tries = 0;
      let timer: ReturnType<typeof setTimeout>;
      // Polling: las secciones del Home son lazy (Suspense), pueden no
      // existir aún cuando llegamos. Reintentamos hasta que aparezcan.
      const tryScroll = () => {
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.replaceState({}, '');
        } else if (tries++ < 40) {
          timer = setTimeout(tryScroll, 100);
        }
      };
      timer = setTimeout(tryScroll, 120);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#f0f0f0] py-2.5 font-body"
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
                className="h-12 object-contain transition-transform duration-200 group-hover:scale-[1.03]"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) =>
                link.page ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`relative font-body font-medium text-sm text-[#666] hover:text-ibiza-red transition-colors duration-200 group ${
                      location.pathname === link.href ? '!text-ibiza-red' : ''
                    }`}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-ibiza-red transition-all duration-300 group-hover:w-full" />
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={`/${link.href}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="relative font-body font-medium text-sm text-[#666] hover:text-ibiza-red transition-colors duration-200 group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-ibiza-red transition-all duration-300 group-hover:w-full" />
                  </a>
                )
              )}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search Button */}
              <button
                onClick={openSearch}
                title="Buscar moto (Ctrl+K)"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e8e8e8] bg-[#f5f5f5] text-[#999] hover:border-ibiza-red/40 hover:text-ibiza-red transition-colors duration-200 text-sm font-body font-medium"
              >
                <Search className="w-4 h-4" />
                <span className="hidden xl:inline text-xs">Buscar</span>
                <kbd className="hidden xl:inline text-[10px] px-1.5 py-0.5 rounded bg-black/5 font-mono">Ctrl K</kbd>
              </button>
              <a
                href={getGeneralWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="bg-black hover:bg-black !text-white font-body font-semibold text-sm px-6 py-2 rounded-lg transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Cotizar Ahora
                </Button>
              </a>
            </div>

            {/* Mobile Search Button */}
            <button
              className="lg:hidden p-2 text-black hover:text-ibiza-red transition-colors duration-200"
              onClick={openSearch}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-black hover:text-ibiza-red transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div
          className={`absolute top-0 right-0 w-[min(320px,85vw)] h-full bg-white shadow-2xl transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="p-4 sm:p-6 pt-20">
            {/* Logo in mobile menu */}
            <div className="mb-8 flex justify-center">
              <img src="/Logo-Ibiza-motos.png" alt="Ibiza Motos" className="h-16 object-contain" />
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map((link, index) =>
                link.page ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-display tracking-wide text-black hover:text-ibiza-red transition-colors duration-200 py-3 border-b border-[#f0f0f0]"
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
                    className="text-2xl font-display tracking-wide text-black hover:text-ibiza-red transition-colors duration-200 py-3 border-b border-[#f0f0f0]"
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
                <Button className="w-full bg-black hover:bg-black !text-white font-body font-semibold py-3 rounded-lg transition-transform duration-200 hover:scale-[1.02] active:scale-95">
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
