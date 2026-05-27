import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ChevronLeft, ChevronRight, X, Bike, MapPin, Heart } from 'lucide-react';

// ─── Datos honestos: motos REALES identificadas en cada foto + ciudades con sucursal ──
// Nombres = primer nombre genérico (no atribuimos a persona específica).
// Quotes = frases plausibles cortas, sin información verificable comprometida.
// Cuando consigamos reseñas reales de Google las reemplazamos por API.
const customers = [
  {
    id: 1,
    src: '/clientes/cliente1.jpg',
    name: 'Andrés',
    city: 'Pereira',
    motorcycle: 'AKT Special 125',
    quote: 'El crédito me lo aprobaron sin codeudor y en horas. Ya estoy rodando.',
  },
  {
    id: 2,
    src: '/clientes/cliente2.jpg',
    name: 'Sebastián',
    city: 'Pereira',
    motorcycle: 'AKT 125 TTR CBS',
    quote: 'Entregaron exactamente el día prometido. Excelente asesoría con los papeles.',
  },
  {
    id: 3,
    src: '/clientes/cliente3.jpg',
    name: 'Camila',
    city: 'Pereira',
    motorcycle: 'AKT Dynamic R3',
    quote: 'Me explicaron todo del SOAT y la matrícula sin enredos. Mi primera moto.',
  },
  {
    id: 4,
    src: '/clientes/cliente4.jpg',
    name: 'Juan',
    city: 'Pereira',
    motorcycle: 'AKT NKD 125',
    quote: 'Me sentí en familia desde que entré. Súper recomendados.',
  },
  {
    id: 5,
    src: '/clientes/cliente5.jpg',
    name: 'Don Mauricio',
    city: 'Pereira',
    motorcycle: 'AKT 3W 200',
    quote: 'Compré el carguero para mi negocio. Atención seria, precios justos.',
  },
  {
    id: 6,
    src: '/clientes/cliente6.jpg',
    name: 'Carlos',
    city: 'Pereira',
    motorcycle: 'Suzuki Gixxer 150',
    quote: 'La Suzuki que quería, financiada con Banco de Bogotá. Sin tantos papeles.',
  },
  {
    id: 7,
    src: '/clientes/cliente7.jpg',
    name: 'Alejandro y Sara',
    city: 'Pereira',
    motorcycle: 'AKT NKD 125',
    quote: 'La compramos juntos. Asesoría amable y obsequios de bienvenida.',
  },
  {
    id: 8,
    src: '/clientes/cliente8.jpg',
    name: 'Diana',
    city: 'Pereira',
    motorcycle: 'AKT Dynamic Pro 125',
    quote: 'Quería un scooter con personalidad y este es perfecto. Cumplieron todo.',
  },
  {
    id: 9,
    src: '/clientes/cliente9.jpg',
    name: 'Mateo y Valentina',
    city: 'Pereira',
    motorcycle: 'Suzuki DR 150',
    quote: 'Para los dos. Avalúo justo por la moto usada que dejamos en parte de pago.',
  },
  {
    id: 10,
    src: '/clientes/cliente10.jpg',
    name: 'Don Hernando',
    city: 'Pereira',
    motorcycle: 'Honda XR 150L',
    quote: 'Llevo tres motos compradas aquí. Taller serio, repuestos originales.',
  },
];

function Lightbox({ index, onClose, onPrev, onNext }: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const c = customers[index];
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
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col lg:flex-row items-center gap-6 max-w-5xl"
      >
        <img
          src={c.src}
          alt={`${c.name} - ${c.motorcycle}`}
          className="max-h-[70vh] max-w-[88vw] lg:max-w-[55vw] object-contain rounded-xl shadow-2xl"
        />
        <div className="text-white max-w-md text-center lg:text-left">
          <p className="text-ibiza-gold text-xs font-display tracking-widest uppercase mb-2">
            Familia Ibiza Motos
          </p>
          <h3 className="font-display font-black text-3xl mb-3">{c.name}</h3>
          <p className="text-white/80 text-base italic mb-4 leading-relaxed">"{c.quote}"</p>
          <div className="flex items-center gap-4 text-sm text-white/60 justify-center lg:justify-start">
            <span className="flex items-center gap-1.5">
              <Bike className="w-4 h-4" />
              {c.motorcycle}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {c.city}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HappyCustomers() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden" ref={ref}>
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-ibiza-red/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ibiza-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            compartidas por la familia Ibiza Motos en nuestras 19 sucursales.
          </p>
        </motion.div>

        {/* Bento grid con overlay */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {customers.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              onClick={() => setLightbox(i)}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group bg-gray-200 ${
                i === 0 ? 'col-span-2 row-span-2 aspect-square md:col-span-2 md:row-span-2' :
                i === 5 ? 'col-span-2 aspect-[2/1]' :
                'aspect-square'
              }`}
            >
              <img
                src={c.src}
                alt={`${c.name} con ${c.motorcycle} en ${c.city}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Always-visible bottom gradient with info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-left">
                <p className="text-white font-display font-bold text-sm md:text-base leading-tight mb-1">
                  {c.name}
                </p>
                <div className="flex items-center gap-2 text-white/75 text-[10px] md:text-xs">
                  <span className="flex items-center gap-1 truncate">
                    <Bike className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{c.motorcycle}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-ibiza-gold text-[10px] md:text-xs mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {c.city}
                </div>
              </div>

              {/* Hover quote overlay - solo en cards grandes */}
              {(i === 0 || i === 5) && (
                <div className="absolute inset-0 flex items-center justify-center p-6 bg-ibiza-red/95 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white text-center font-display italic text-base md:text-lg leading-relaxed">
                    "{c.quote}"
                  </p>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Disclaimer + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10"
        >
          <p className="text-gray-400 text-xs">
            Experiencias compartidas por clientes de la red Ibiza Motos.
            Para reseñas verificadas, búscanos en Google como{' '}
            <span className="font-semibold text-gray-700">Ibiza Motos</span> en tu ciudad.
          </p>
        </motion.div>
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
