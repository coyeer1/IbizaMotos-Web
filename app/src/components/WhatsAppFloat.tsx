import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useParams } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { getGeneralWhatsApp, getBuyWhatsApp } from '@/lib/config';
import { useMotorcycles } from '@/hooks/useMotorcycles';

const WA_ICON = (
  <svg className="w-6 h-6 sm:w-7 sm:h-7 !text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ── Wrapper that grabs motorcycle context when on /moto/:id ────────────────

function WhatsAppFloatInner() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { motorcycles } = useMotorcycles();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pulse, setPulse] = useState(true);

  const isMotoPage = location.pathname.startsWith('/moto/');
  const motorcycle = isMotoPage && id
    ? motorcycles.find(m => m.id === id) ?? null
    : null;

  // Stop pulse after 4s
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const generalUrl = getGeneralWhatsApp();
  const motoUrl = motorcycle
    ? getBuyWhatsApp(motorcycle.brand, motorcycle.model)
    : null;

  const bottomClass = isMotoPage ? 'bottom-20 sm:bottom-28' : 'bottom-6';

  return (
    <div className={`fixed right-4 sm:right-6 z-[60] ${bottomClass} flex flex-col items-end gap-2`}>

      {/* ── Context menu (shown when menuOpen) ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="flex flex-col gap-2 items-end"
          >
            {/* Option: this motorcycle */}
            {motorcycle && motoUrl && (
              <motion.a
                href={motoUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-3 bg-[#1e1e20] border border-white/10 rounded-2xl px-4 py-3 shadow-xl hover:border-green-500/40 hover:bg-[#252527] transition-all group max-w-[240px]"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-500 font-medium">Consultar esta moto</p>
                  <p className="text-white font-bold text-sm truncate leading-tight">
                    {motorcycle.brand} {motorcycle.model}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-green-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </motion.a>
            )}

            {/* Option: general contact */}
            <motion.a
              href={generalUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: motorcycle ? 0.1 : 0.05 }}
              className="flex items-center gap-3 bg-[#1e1e20] border border-white/10 rounded-2xl px-4 py-3 shadow-xl hover:border-green-500/40 hover:bg-[#252527] transition-all group"
            >
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 font-medium">Contacto general</p>
                <p className="text-white font-bold text-sm">Ibiza Motos</p>
              </div>
              <ChevronRight className="w-4 h-4 text-green-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main FAB button ── */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => {
          // If no motorcycle context → go directly to WhatsApp
          if (!motorcycle) {
            window.open(generalUrl, '_blank');
          } else {
            setMenuOpen(prev => !prev);
          }
        }}
        className="relative w-13 h-13 sm:w-14 sm:h-14 w-[52px] h-[52px] bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ boxShadow: '0 4px 20px 0 rgba(37, 211, 102, 0.45)' }}
        title="WhatsApp"
        aria-label="Contactar por WhatsApp"
      >
        <AnimatePresence mode="wait">
          {menuOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </motion.span>
          ) : (
            <motion.span key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              {WA_ICON}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {pulse && !menuOpen && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />
        )}

        {/* Notification dot */}
        {!menuOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-ibiza-red border-2 border-[#080808] rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-black !text-white">
            1
          </span>
        )}
      </motion.button>

    </div>
  );
}

// ── Export: wrapped in a route-aware shell ─────────────────────────────────

export function WhatsAppFloat() {
  return <WhatsAppFloatInner />;
}
