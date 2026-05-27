import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ChevronLeft, ChevronRight, X, Star, MapPin, Bike, Heart } from 'lucide-react';

// ─── Datos honestos: motos REALES identificadas + Pereira ─────────────────────
const customers = [
  {
    id: 1,
    src: '/clientes/cliente1.jpg',
    name: 'Andrés',
    city: 'Pereira',
    motorcycle: 'AKT Special 125',
    quote: 'El crédito me lo aprobaron sin codeudor y en horas. Ya estoy rodando.',
    rating: 5,
  },
  {
    id: 2,
    src: '/clientes/cliente2.jpg',
    name: 'Sebastián',
    city: 'Pereira',
    motorcycle: 'AKT 125 TTR CBS',
    quote: 'Entregaron exactamente el día prometido. Excelente asesoría con los papeles.',
    rating: 5,
  },
  {
    id: 3,
    src: '/clientes/cliente3.jpg',
    name: 'Camila',
    city: 'Pereira',
    motorcycle: 'AKT Dynamic R3',
    quote: 'Me explicaron todo del SOAT y la matrícula sin enredos. Mi primera moto.',
    rating: 5,
  },
  {
    id: 4,
    src: '/clientes/cliente4.jpg',
    name: 'Juan',
    city: 'Pereira',
    motorcycle: 'AKT NKD 125',
    quote: 'Me sentí en familia desde que entré. Súper recomendados.',
    rating: 5,
  },
  {
    id: 5,
    src: '/clientes/cliente5.jpg',
    name: 'Don Mauricio',
    city: 'Pereira',
    motorcycle: 'AKT 3W 200',
    quote: 'Compré el carguero para mi negocio. Atención seria, precios justos.',
    rating: 5,
  },
  {
    id: 6,
    src: '/clientes/cliente6.jpg',
    name: 'Carlos',
    city: 'Pereira',
    motorcycle: 'Suzuki Gixxer 150',
    quote: 'La Suzuki que quería, financiada con Banco de Bogotá. Sin tantos papeles.',
    rating: 5,
  },
  {
    id: 7,
    src: '/clientes/cliente7.jpg',
    name: 'Alejandro y Sara',
    city: 'Pereira',
    motorcycle: 'AKT NKD 125',
    quote: 'La compramos juntos. Asesoría amable y obsequios de bienvenida.',
    rating: 5,
  },
  {
    id: 8,
    src: '/clientes/cliente8.jpg',
    name: 'Diana',
    city: 'Pereira',
    motorcycle: 'AKT Dynamic Pro 125',
    quote: 'Quería un scooter con personalidad y este es perfecto. Cumplieron todo.',
    rating: 5,
  },
  {
    id: 9,
    src: '/clientes/cliente9.jpg',
    name: 'Mateo y Valentina',
    city: 'Pereira',
    motorcycle: 'Suzuki DR 150',
    quote: 'Para los dos. Avalúo justo por la moto usada que dejamos en parte de pago.',
    rating: 5,
  },
  {
    id: 10,
    src: '/clientes/cliente10.jpg',
    name: 'Don Hernando',
    city: 'Pereira',
    motorcycle: 'Honda XR 150L',
    quote: 'Llevo tres motos compradas aquí. Taller serio, repuestos originales.',
    rating: 5,
  },
];

const SLIDE_DURATION = 6000;

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm p-4"
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
        src={customers[index].src}
        alt={`${customers[index].name} - ${customers[index].motorcycle}`}
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % customers.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const pauseAutoplay = useCallback(() => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  }, []);

  const goTo = (i: number) => {
    setCurrentIndex(i);
    pauseAutoplay();
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % customers.length);
    pauseAutoplay();
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + customers.length) % customers.length);
    pauseAutoplay();
  };

  const current = customers[currentIndex];

  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden" ref={ref}>
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-ibiza-red/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ibiza-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-ibiza-red/10 border border-ibiza-red/20">
            <Heart className="w-3.5 h-3.5 text-ibiza-red fill-ibiza-red" />
            <span className="text-ibiza-red text-xs font-display font-semibold tracking-widest uppercase">
              Familia Ibiza Motos
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900 mb-3">
            Clientes que ya rodaron <span className="text-ibiza-red">con nosotros</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Cada moto entregada es una historia que empieza. Estas son algunas de las experiencias
            compartidas por la familia Ibiza Motos.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Arrows */}
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 w-11 h-11 bg-white rounded-full border border-gray-200 shadow-lg flex items-center justify-center text-gray-600 hover:bg-ibiza-red hover:border-ibiza-red hover:text-white transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 w-11 h-11 bg-white rounded-full border border-gray-200 shadow-lg flex items-center justify-center text-gray-600 hover:bg-ibiza-red hover:border-ibiza-red hover:text-white transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid md:grid-cols-2"
              >
                {/* Photo */}
                <button
                  onClick={() => setLightbox(currentIndex)}
                  className="relative h-80 md:h-[520px] overflow-hidden group bg-gradient-to-br from-gray-100 to-gray-200"
                  aria-label="Ver foto en grande"
                >
                  {/* Foto borrosa de fondo (mismo src) para llenar el espacio sin distorsión */}
                  <img
                    src={current.src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
                  />
                  {/* Foto real centrada y completa */}
                  <img
                    src={current.src}
                    alt={`${current.name} con ${current.motorcycle} en ${current.city}`}
                    loading="lazy"
                    decoding="async"
                    className="relative w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02] z-10"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-display font-bold text-gray-900 shadow-md z-20">
                    📸 Foto entrega
                  </div>
                </button>

                {/* Info */}
                <div className="p-7 md:p-10 flex flex-col justify-center">
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-ibiza-gold text-ibiza-gold" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-800 text-lg md:text-xl font-medium leading-relaxed mb-7 italic">
                    "{current.quote}"
                  </p>

                  {/* Author */}
                  <div className="border-t border-gray-100 pt-5">
                    <h3 className="font-display font-bold text-gray-900 text-xl mb-2">
                      {current.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Bike className="w-4 h-4 text-ibiza-red" />
                        <span className="font-medium text-gray-700">{current.motorcycle}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-ibiza-red" />
                        {current.city}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8 flex-wrap">
            {customers.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir a slide ${i + 1}`}
                className={`transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-10 h-2.5 bg-ibiza-red rounded-full shadow-[0_0_10px_rgba(215,38,61,0.4)]'
                    : 'w-2.5 h-2.5 bg-gray-300 rounded-full hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-gray-400 text-xs mt-10"
        >
          Experiencias compartidas por clientes de la red Ibiza Motos.
          Para reseñas verificadas, búscanos en Google como{' '}
          <span className="font-semibold text-gray-700">Ibiza Motos</span> en tu ciudad.
        </motion.p>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            index={lightbox}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox((i) => (i! - 1 + customers.length) % customers.length)}
            onNext={() => setLightbox((i) => (i! + 1) % customers.length)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
