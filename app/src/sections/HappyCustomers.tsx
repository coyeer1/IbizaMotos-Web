import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ChevronLeft, ChevronRight, X, Star, MapPin, Bike } from 'lucide-react';

// ─── Datos Enriquecidos de Clientes ──────────────────────────────────────────
const testimonials = [
  { 
    id: 1, src: '/clientes/cliente1.jpg', 
    name: 'Carlos Mendoza', city: 'Pereira', motorcycle: 'Yamaha MT-09',
    quote: '"La atención fue brutal, el crédito me lo probaron en 2 horas y salí rodando ese mismo día. ¡Recomendadísimos!"',
    rating: 5
  },
  { 
    id: 2, src: '/clientes/cliente2.jpg', 
    name: 'Andrés Felipe', city: 'Dosquebradas', motorcycle: 'Suzuki Gixxer 250',
    quote: '"Mucho cumplimiento con la gestión de papeles, la moto llegó intacta y explicaron todo súper bien."',
    rating: 5
  },
  { 
    id: 3, src: '/clientes/cliente3.jpg', 
    name: 'Johana Ríos', city: 'Manizales', motorcycle: 'Honda Navi',
    quote: '"Es mi primera moto y en Ibiza me tuvieron mucha paciencia. Me dieron obsequio de bienvenida, súper felices."',
    rating: 5
  },
  { 
    id: 4, src: '/clientes/cliente4.jpg', 
    name: 'Cristian Yepes', city: 'Pereira', motorcycle: 'TVS Raider 125',
    quote: '"Excelente asesoría con el SOAT y la matrícula. Muy transparentes en los precios y el trato de los asesores."',
    rating: 4
  },
  { 
    id: 5, src: '/clientes/cliente5.jpg', 
    name: 'Santiago López', city: 'Armenia', motorcycle: 'Hero Xpulse 200',
    quote: '"Viajé desde Armenia solo por comprar aquí. Me financiaron a pesar de no tener historial crediticio alto."',
    rating: 5
  },
  { 
    id: 6, src: '/clientes/cliente6.jpg', 
    name: 'Daniela Salazar', city: 'Santa Rosa', motorcycle: 'AKT NKD 125',
    quote: '"Muy ágiles con los trámites. Un sueño cumplido para ir a mi universidad, mil gracias a toda la familia Ibiza."',
    rating: 5
  },
  { 
    id: 7, src: '/clientes/cliente7.jpg', 
    name: 'Miguel Torres', city: 'Pereira', motorcycle: 'KTM Duke 200',
    quote: '"Entregaron la moto impecable, detallada y tanqueada. El mejor concesionario del Eje Cafetero de lejos."',
    rating: 5
  },
  { 
    id: 8, src: '/clientes/cliente8.jpg', 
    name: 'Valeria G.', city: 'Dosquebradas', motorcycle: 'Honda PCX 160',
    quote: '"Excelente servicio postventa. Cumplieron todo lo prometido y resolvieron mis dudas de novata amablemente."',
    rating: 5
  },
  { 
    id: 9, src: '/clientes/cliente9.jpg', 
    name: 'Juan Diego', city: 'Cartago', motorcycle: 'Bajaj Pulsar NS200',
    quote: '"Dejar mi moto usada por parte de pago fue facilísimo, me la avaluaron súper bien. Negocio transparente."',
    rating: 5
  },
  { 
    id: 10, src: '/clientes/cliente10.jpg', 
    name: 'Julián Marín', city: 'Pereira', motorcycle: 'Royal Enfield Classic',
    quote: '"Todo un estilo de vida. En Ibiza me trataron como en casa, brindaron café y la experiencia fue 10/10."',
    rating: 5
  },
];

// ─── Lightbox ──────────────────────────────────────────────────────────────────
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
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition">
        <X className="w-5 h-5" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 md:left-10 z-10 w-12 h-12 bg-white/10 hover:bg-ibiza-red rounded-full flex items-center justify-center text-white transition">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={testimonials[index].src}
          alt={testimonials[index].name}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="max-h-[85vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </AnimatePresence>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 md:right-10 z-10 w-12 h-12 bg-white/10 hover:bg-ibiza-red rounded-full flex items-center justify-center text-white transition">
        <ChevronRight className="w-6 h-6" />
      </button>
    </motion.div>
  );
}

// ─── Tarjeta Completa de Testimonio ────────────────────────────────────────────
function TestimonialCard({ item, onClick }: {
  item: typeof testimonials[0];
  onClick: () => void;
}) {
  return (
    <div className="group flex-shrink-0 w-[300px] md:w-[340px] snap-start">
      <div className="bg-white rounded-[2rem] p-4 pb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1 relative">
        
        {/* Imagen clickeable c/ Aspect Ratio Nítido (4:3) */}
        <div 
          onClick={onClick}
          className="relative overflow-hidden rounded-[1.5rem] w-full aspect-[4/3] cursor-pointer bg-gray-100"
        >
          <img
            src={item.src}
            alt={item.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
             <span className="text-white text-sm font-semibold flex items-center gap-1"><X className="w-4 h-4 rotate-45"/> Ver foto</span>
          </div>
        </div>

        {/* Estrellas */}
        <div className="flex items-center gap-1 mt-5 px-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'fill-[#ffb800] text-[#ffb800]' : 'fill-gray-100 text-gray-100'}`} />
          ))}
        </div>

        {/* Reseña / Cita */}
        <p className="mt-3 px-2 text-gray-600 text-[15px] leading-relaxed italic flex-grow">
          {item.quote}
        </p>

        {/* Divider */}
        <div className="px-2 mt-5 mb-4">
          <div className="h-px w-full bg-gray-100"></div>
        </div>

        {/* Footer info */}
        <div className="px-2">
          <p className="font-bold text-gray-900 text-lg">{item.name}</p>
          <div className="flex flex-col gap-1 mt-1">
             <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-ibiza-red" /> {item.city}
             </span>
             <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium tracking-wide">
                <Bike className="w-3.5 h-3.5 text-ibiza-red" /> {item.motorcycle}
             </span>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── SECCIÓN PRINCIPAL ─────────────────────────────────────────────────────────
export default function HappyCustomers() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const total = testimonials.length;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -366, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 366, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrolled = scrollLeft / (scrollWidth - clientWidth);
      const index = Math.round(scrolled * (total - 1));
      setActiveDot(Math.min(Math.max(index, 0), total - 1));
    }
  };

  return (
    <>
      <section
        className="relative py-24 lg:py-32 overflow-hidden bg-[#F8FAFC]" // Light mode premium bg
        ref={ref}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Encabezado */}
          <div className="text-center lg:text-left flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 lg:mb-16 gap-6">
            <div className="max-w-3xl">
              
              {/* Prueba Social Tag */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-6 lg:mb-8"
              >
                <div className="flex -space-x-2">
                  <img src="/clientes/cliente1.jpg" alt="Cliente 1" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                  <img src="/clientes/cliente2.jpg" alt="Cliente 2" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                  <img src="/clientes/cliente3.jpg" alt="Cliente 3" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                </div>
                <div className="flex items-center gap-1.5 pr-2">
                  <Star className="w-4 h-4 fill-[#ffb800] text-[#ffb800]" />
                  <span className="text-gray-900 font-bold text-sm tracking-wide">
                    +5,000 Clientes Felices
                  </span>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display font-black text-5xl md:text-6xl text-gray-900 leading-[1.05] tracking-tight"
              >
                FAMILIA <span className="text-[#ff6a00]">IBIZA MOTOS</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-500 text-lg sm:text-xl mt-5 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed"
              >
                No vendemos motos, entregamos llaves para nuevas emociones. No escuches lo que decimos, <strong className="text-gray-800">mira lo que opinan ellos.</strong>
              </motion.p>
              
            </div>

            {/* Controles Desktop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="hidden lg:flex gap-3 pb-2"
            >
              <button onClick={scrollLeft} className="w-14 h-14 rounded-full border-2 border-gray-200 bg-white hover:border-ibiza-red hover:bg-ibiza-red text-gray-400 hover:text-white flex items-center justify-center transition-all shadow-sm z-20">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={scrollRight} className="w-14 h-14 rounded-full border-2 border-gray-200 bg-white hover:border-ibiza-red hover:bg-ibiza-red text-gray-400 hover:text-white flex items-center justify-center transition-all shadow-sm z-20">
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
          
          {/* ─── Carrusel Nativo ─── */}
          <div className="relative -mx-4 sm:mx-0 w-full">
            
            {/* Gradientes laterales para indicar que hay más contenido y suavizar bordes */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none"></div>

            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory py-4 px-4 sm:px-6 hide-scrollbar pb-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * (i % 4) + 0.2 }}
                >
                  <TestimonialCard 
                    item={item} 
                    onClick={() => setLightboxIndex(i)} 
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── Indicadores y CTA Integrado ─── */}
          <div className="mt-6 md:mt-10 flex flex-col items-center justify-center">
            
            {/* Dots */}
            <div className="flex gap-3 bg-white px-5 py-3 rounded-full shadow-sm border border-gray-100 mb-14">
              {testimonials.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2.5 sm:h-3 rounded-full transition-all duration-500 shadow-inner ${activeDot === i ? 'w-8 sm:w-10 bg-[#ff6a00]' : 'w-2.5 sm:w-3 bg-gray-200 hover:bg-gray-300'}`} 
                />
              ))}
            </div>

            {/* Gran Botón CTA */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={isVisible ? { opacity: 1, y: 0 } : {}}
               transition={{ duration: 0.5, delay: 0.3 }}
               className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_60px_rgb(0,0,0,0.03)] w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-8 relative overflow-hidden"
            >
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gradient-to-tr from-[#ff6a00]/10 to-ibiza-red/5 rounded-full blur-3xl z-0 pointer-events-none"></div>
              
              <div className="z-10 relative flex-1">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-3 tracking-tight">¿Ya ruedas con nosotros?</h3>
                <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Compártenos tu foto para el muro y recibe gratis nuestro <strong className="text-ibiza-red font-bold">Kit de Lealtad</strong> en tu próxima revisión o tanqueada. ¡Presume tu moto!
                </p>
              </div>

              <a
                href="https://wa.me/573214567890?text=Hola, quiero compartir mi experiencia y foto como nuevo cliente de Ibiza Motos 🏍️"
                target="_blank"
                rel="noopener noreferrer"
                className="z-10 flex-shrink-0 flex items-center justify-between gap-6 bg-gradient-to-r from-gray-900 to-gray-800 hover:to-black text-white p-2 pr-6 rounded-2xl md:rounded-full font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/20 hover:-translate-y-1 group w-full lg:w-auto"
              >
                <div className="bg-white/10 p-3 rounded-xl md:rounded-full flex items-center justify-center">
                   <Star className="w-6 h-6 text-[#ffb800] fill-[#ffb800] group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-lg">¡Compartir mi foto!</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </a>
            </motion.div>

          </div>

        </div>
      </section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
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
