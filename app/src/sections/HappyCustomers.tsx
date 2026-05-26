import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ChevronLeft, ChevronRight, X, Camera } from 'lucide-react';

// ─── Galería de clientes reales (fotos sin nombres inventados) ────────────────
// Mientras integramos reseñas reales de Google Business, mostramos solo la galería.
const photos = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  src: `/clientes/cliente${i + 1}.jpg`,
}));

function Lightbox({ index, onClose, onPrev, onNext }: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-white/10 rounded-full p-2">
        <X className="w-6 h-6" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-3 text-white/70 hover:text-white z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-3 text-white/70 hover:text-white z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all">
        <ChevronRight className="w-6 h-6" />
      </button>
      <motion.img
        key={index}
        src={photos[index].src}
        alt="Cliente Ibiza Motos"
        className="max-h-[85vh] max-w-[88vw] object-contain rounded-xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
}

export default function HappyCustomers() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-ibiza-red/10 border border-ibiza-red/20">
            <Camera className="w-3.5 h-3.5 text-ibiza-red" />
            <span className="text-ibiza-red text-xs font-display font-semibold tracking-widest uppercase">
              Familia Ibiza Motos
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900 mb-3">
            Clientes que ya rodaron con nosotros
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Cada moto entregada es una historia que empieza. Estos son algunos de los rostros
            de quienes confían en nuestras 19 sucursales.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {photos.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              onClick={() => setLightbox(i)}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
              }`}
            >
              <img
                src={p.src}
                alt="Cliente feliz Ibiza Motos"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          ))}
        </div>

        {/* CTA a reseñas reales de Google */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm mb-4">
            Las opiniones reales están en Google. Búscanos como{' '}
            <span className="font-semibold text-gray-900">Ibiza Motos</span> en tu ciudad.
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            index={lightbox}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox((i) => (i! - 1 + photos.length) % photos.length)}
            onNext={() => setLightbox((i) => (i! + 1) % photos.length)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
