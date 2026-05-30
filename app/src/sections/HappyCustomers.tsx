import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '@/components/Reveal';
import { ChevronLeft, ChevronRight, X, Star, MapPin, Bike } from 'lucide-react';

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
    <section className="py-24 md:py-32 bg-white relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14 md:mb-16">
          <Reveal direction="up">
            <span
              className="inline-block uppercase mb-5"
              style={{ fontSize: 11, letterSpacing: '0.15em', color: '#999' }}
            >
              Familia Ibiza Motos
            </span>
          </Reveal>
          <Reveal delay={0.08} direction="up">
            <h2
              className="font-display text-5xl md:text-6xl text-black mb-4"
              style={{ lineHeight: 0.95, letterSpacing: '-0.5px' }}
            >
              Clientes que ya rodaron <span style={{ color: '#E31937' }}>con nosotros</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16} direction="up">
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#777', fontWeight: 300, lineHeight: 1.65 }}>
              Cada moto entregada es una historia que empieza. Estas son algunas de las experiencias
              compartidas por la familia Ibiza Motos.
            </p>
          </Reveal>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Arrows */}
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 w-11 h-11 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:scale-[1.05] transition-all duration-200"
            style={{ border: '1px solid #e8e8e8' }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 w-11 h-11 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:scale-[1.05] transition-all duration-200"
            style={{ border: '1px solid #e8e8e8' }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Card */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #e8e8e8' }}>
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
                  className="relative h-80 md:h-[520px] overflow-hidden group"
                  style={{ background: '#f5f5f5' }}
                  aria-label="Ver foto en grande"
                >
                  {/* Foto borrosa de fondo (mismo src) para llenar el espacio sin distorsión */}
                  <img
                    src={current.src}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-30"
                  />
                  {/* Foto real centrada y completa */}
                  <img
                    src={current.src}
                    alt={`${current.name} con ${current.motorcycle} en ${current.city}`}
                    loading="lazy"
                    decoding="async"
                    className="relative w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02] z-10"
                  />
                  <div
                    className="absolute top-4 left-4 uppercase z-20"
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(4px)',
                      padding: '5px 12px',
                      borderRadius: 6,
                      fontSize: 10,
                      letterSpacing: '0.12em',
                      fontWeight: 600,
                      color: '#000',
                      border: '1px solid #e8e8e8',
                    }}
                  >
                    Foto entrega
                  </div>
                </button>

                {/* Info */}
                <div className="p-7 md:p-12 flex flex-col justify-center">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4" style={{ fill: '#E31937', color: '#E31937' }} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-xl md:text-2xl leading-relaxed mb-8" style={{ color: '#1a1a1a', fontWeight: 400 }}>
                    "{current.quote}"
                  </p>

                  {/* Author */}
                  <div className="pt-6" style={{ borderTop: '1px solid #f0f0f0' }}>
                    <h3 className="font-display text-2xl mb-3" style={{ color: '#000', letterSpacing: '-0.3px' }}>
                      {current.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm" style={{ color: '#999' }}>
                      <span className="flex items-center gap-1.5">
                        <Bike className="w-4 h-4" style={{ color: '#E31937' }} />
                        <span style={{ fontWeight: 500, color: '#555' }}>{current.motorcycle}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" style={{ color: '#E31937' }} />
                        {current.city}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-10 flex-wrap">
            {customers.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir a slide ${i + 1}`}
                className="transition-all duration-300 rounded-full"
                style={
                  i === currentIndex
                    ? { width: 36, height: 8, background: '#E31937' }
                    : { width: 8, height: 8, background: '#d8d8d8' }
                }
              />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <Reveal direction="fade" className="mt-12">
          <p
            className="text-center text-xs"
            style={{ color: '#bbb', lineHeight: 1.6 }}
          >
            Experiencias compartidas por clientes de la red Ibiza Motos.
            Para reseñas verificadas, búscanos en Google como{' '}
            <span style={{ fontWeight: 600, color: '#777' }}>Ibiza Motos</span> en tu ciudad.
          </p>
        </Reveal>
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
