import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// ─── Fotos de clientes ─────────────────────────────────────────────────────────
// Para agregar más: guarda la foto en /public/clientes/ y añade una línea aquí.
const customerPhotos = [
  { id: 1,  src: '/clientes/cliente1.jpg',  label: 'Bienvenida a la familia' },
  { id: 2,  src: '/clientes/cliente2.jpg',  label: 'Nuevo integrante' },
  { id: 3,  src: '/clientes/cliente3.jpg',  label: 'Bienvenida a la familia' },
  { id: 4,  src: '/clientes/cliente4.jpg',  label: 'Nuevo integrante' },
  { id: 5,  src: '/clientes/cliente5.jpg',  label: 'Bienvenida a la familia' },
  { id: 6,  src: '/clientes/cliente6.jpg',  label: 'A rodar se dijo' },
  { id: 7,  src: '/clientes/cliente7.jpg',  label: 'Bienvenido a la familia' },
  { id: 8,  src: '/clientes/cliente8.jpg',  label: 'Nueva aventura' },
  { id: 9,  src: '/clientes/cliente9.jpg',  label: 'Bienvenida a la familia' },
  { id: 10, src: '/clientes/cliente10.jpg', label: 'A rodar se dijo' },
];

const AUTOPLAY_MS = 5000;

// ─── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ photos, index, onClose, onPrev, onNext }: {
  photos: typeof customerPhotos;
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
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition">
        <X className="w-5 h-5" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 z-10 w-12 h-12 bg-white/10 hover:bg-ibiza-red rounded-full flex items-center justify-center text-white transition">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={photos[index].src}
          alt={photos[index].label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="max-h-[85vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </AnimatePresence>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 z-10 w-12 h-12 bg-white/10 hover:bg-ibiza-red rounded-full flex items-center justify-center text-white transition">
        <ChevronRight className="w-6 h-6" />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {photos.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-ibiza-red' : 'w-1.5 bg-white/30'}`} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Photo Card ────────────────────────────────────────────────────────────────
function PhotoCard({ photo, onClick }: {
  photo: (typeof customerPhotos)[0];
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer flex-1 min-w-0"
      style={{ aspectRatio: '3/4' }}
    >
      <img
        src={photo.src}
        alt={photo.label}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
        <span className="bg-ibiza-red text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg">
          ★ Ibiza Motos
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-ibiza-gold font-display font-bold text-lg leading-tight drop-shadow-md">
          {photo.label}
        </p>
        <p className="text-white/60 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          ¡Bienvenido a la familia! 🏍️
        </p>
      </div>
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-ibiza-gold/40 transition-all duration-400 pointer-events-none" />
    </div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────
export default function HappyCustomers() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const total = customerPhotos.length;

  const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const goPrev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused || lightboxIndex !== null) return;
    const t = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, lightboxIndex, goNext]);

  const idx1 = current;
  const idx2 = (current + 1) % total;

  return (
    <>
      <section
        className="py-24 bg-ibiza-black overflow-hidden"
        ref={ref}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-ibiza-gold font-display font-semibold text-sm tracking-widest uppercase mb-4"
            >
              Nuestra Familia
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-black text-5xl md:text-6xl text-white tracking-tight mb-4"
            >
              CLIENTES FELICES
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isVisible ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-24 h-1 bg-gradient-to-r from-ibiza-red to-ibiza-gold mx-auto rounded-full"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white/50 mt-5 max-w-lg mx-auto text-sm leading-relaxed"
            >
              Cada entrega es un sueño cumplido. Bienvenidos a la familia Ibiza Motos.
            </motion.p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <button
              onClick={() => { goPrev(); setPaused(false); }}
              className="absolute -left-5 md:-left-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/10 hover:bg-ibiza-red rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={idx1}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
                  className="flex gap-3 md:gap-4"
                >
                  <PhotoCard photo={customerPhotos[idx1]} onClick={() => setLightboxIndex(idx1)} />
                  <PhotoCard photo={customerPhotos[idx2]} onClick={() => setLightboxIndex(idx2)} />
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={() => { goNext(); setPaused(false); }}
              className="absolute -right-5 md:-right-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/10 hover:bg-ibiza-red rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots + progress */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex gap-2">
              {customerPhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-500 rounded-full ${
                    i === idx1 || i === idx2
                      ? 'w-8 h-2 bg-ibiza-red shadow-[0_0_8px_rgba(215,38,61,0.6)]'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
            {!paused && (
              <div className="w-32 h-0.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  key={current}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                  className="h-full bg-ibiza-gold rounded-full"
                />
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <p className="text-white/30 text-sm">
              ¿Ya eres parte de la familia?{' '}
              <a
                href="https://wa.me/573214567890?text=Hola, quiero compartir mi foto como nuevo cliente de Ibiza Motos 🏍️"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ibiza-gold font-semibold hover:text-white transition-colors"
              >
                ¡Comparte tu foto!
              </a>
            </p>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={customerPhotos}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex((i) => (i === null ? 0 : (i - 1 + total) % total))}
            onNext={() => setLightboxIndex((i) => (i === null ? 0 : (i + 1) % total))}
          />
        )}
      </AnimatePresence>
    </>
  );
}
