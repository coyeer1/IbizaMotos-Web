import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Send, MapPin, Phone, Mail, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { brands } from '@/data/motorcycles';
import { getGeneralWhatsApp, getWhatsAppUrl } from '@/lib/config';

const navLinks = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Motos', href: '#motos' },
  { name: 'Repuestos', href: '#repuestos' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Contacto', href: '#contacto' },
];

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/p/Ibiza-Motos-Eje-Cafetero-Digital-100064068939059/',
    color: '#1877F2',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/ibizamotossas/',
    color: '#E4405F',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: getGeneralWhatsApp(),
    color: '#25D366',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Open WhatsApp with the email for future newsletter
      window.open(getWhatsAppUrl(`Hola, quiero suscribirme al newsletter. Mi correo es: ${email}`), '_blank');
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    // id="contacto" = destino del enlace "Contacto" del Navbar y del footer.
    // Antes apuntaba a la sección Locations, que ya no se renderiza en el Home
    // (quedó huérfana) → el enlace no hacía nada.
    <footer id="contacto" className="bg-[#0a0a0a] !text-white relative overflow-hidden font-body">
      {/* Hairline top border */}
      <div className="h-px w-full bg-white/10" />

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            {/* Real logo */}
            <div className="mb-6">
              <img
                src="/Logo-Ibiza-motos.png"
                alt="Ibiza Motos - El placer en dos ruedas"
                loading="lazy"
                decoding="async"
                className="h-20 object-contain"
              />
            </div>
            
            <p className="!text-white/60 mb-6 leading-relaxed text-sm font-light">
              19 sucursales en Pereira, Dosquebradas, Santa Rosa de Cabal, Quimbaya,
              Montenegro, Viterbo, Chinchiná y Neiva. Suzuki, Honda, Bajaj, AKT, Hero y Vento.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-ibiza-red hover:bg-ibiza-red transition-all duration-200 hover:scale-[1.08]"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Navigation column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-display text-2xl tracking-wide mb-6 flex items-center gap-3">
              <span className="w-7 h-px bg-ibiza-red" />
              Navegación
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-white/60 hover:!text-ibiza-red transition-colors duration-200 flex items-center gap-2 group text-sm"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-ibiza-red" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Brands column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-display text-2xl tracking-wide mb-6 flex items-center gap-3">
              <span className="w-7 h-px bg-ibiza-red" />
              Marcas
            </h3>
            <ul className="space-y-3">
              {brands.map((brand) => (
                <li key={brand.id}>
                  <Link
                    to={`/marca/${brand.slug}`}
                    className="text-white/60 hover:!text-ibiza-red transition-colors duration-200 flex items-center gap-2 group text-sm"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-ibiza-red" />
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-display text-2xl tracking-wide mb-6 flex items-center gap-3">
              <span className="w-7 h-px bg-ibiza-red" />
              Contacto
            </h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin className="w-5 h-5 text-ibiza-red flex-shrink-0 mt-0.5" />
                <span>Cra 7 #25-41 Parque Lago Uribe, Pereira</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone className="w-5 h-5 text-ibiza-red flex-shrink-0" />
                <a href="tel:+573052884546" className="hover:text-white transition-colors duration-200">(+57) 305 288 4546</a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail className="w-5 h-5 text-ibiza-red flex-shrink-0" />
                <a href="mailto:ibizamotossas@gmail.com" className="hover:text-white transition-colors duration-200">ibizamotossas@gmail.com</a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1">Newsletter</p>
              <p className="text-white/60 text-xs mb-3 font-light">Recibe ofertas exclusivas y novedades</p>
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 text-white px-4 py-3 rounded-lg text-sm text-center"
                >
                  ¡Gracias por suscribirte!
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/40 border-white/10 !text-white placeholder:!text-white/40 rounded-lg text-sm"
                    required
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-ibiza-red hover:bg-ibiza-red !text-white rounded-lg flex-shrink-0 transition-transform duration-200 hover:scale-[1.05] active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="!text-white/40 text-xs">
                © {new Date().getFullYear()} Ibiza Motos S.A.S. Todos los derechos reservados.
              </p>
              <p className="!text-white/30 text-[11px] mt-1">
                Diseño y desarrollo por{' '}
                <a
                  href="https://chillinc.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!text-white/50 hover:!text-ibiza-red transition-colors duration-200 font-medium"
                >
                  chillinc.app
                </a>
              </p>
            </div>
            <div className="flex gap-6 text-xs">
              <Link to="/privacidad" className="!text-white/40 hover:!text-white transition-colors duration-200 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Política de privacidad
              </Link>
              <Link to="/terminos" className="!text-white/40 hover:!text-white transition-colors duration-200 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Términos de servicio
              </Link>
              <Link to="/eliminacion-datos" className="!text-white/40 hover:!text-white transition-colors duration-200 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Eliminar mis datos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
