import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, ExternalLink } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// ─── Reemplaza esta URL con tu link real de Google Business ─────────────────
const GOOGLE_REVIEWS_URL = 'https://g.page/r/ibizamotos/review';
const GOOGLE_TOTAL_RATING = 4.9;
const GOOGLE_TOTAL_REVIEWS = 127;

// Enhanced testimonials with motorcycle details 
const testimonials = [
  {
    name: 'Carlos Ramírez',
    text: 'Compré mi Suzuki GSX-R150 en Ibiza Motos y fue la mejor decisión. El equipo me ayudó a elegir la moto perfecta para mi día a día en Armenia. ¡El servicio post-venta es increíble!',
    rating: 5,
    moto: 'Suzuki GSX-R150',
    city: 'Armenia, Quindío',
    initials: 'CR',
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    name: 'María González',
    text: 'Excelente atención y precios muy competitivos. Me encantó que me explicaron todo sobre el mantenimiento de mi moto nueva. Totalmente recomendados para quien busque confianza.',
    rating: 5,
    moto: 'AKT NKD 125',
    city: 'Pereira, Risaralda',
    initials: 'MG',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    name: 'Andrés López',
    text: 'El taller de Ibiza Motos es de primera. Mi Bajaj Boxer 150 quedó como nueva después del mantenimiento. Los mecánicos saben lo que hacen y son muy honestos.',
    rating: 5,
    moto: 'Bajaj Boxer 150',
    city: 'Armenia, Quindío',
    initials: 'AL',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Laura Martínez',
    text: 'Llevaba meses buscando la moto ideal y en Ibiza Motos la encontré. Financiamiento fácil, sin tantos papeles, y me la entregaron el mismo día. Una experiencia de 10.',
    rating: 5,
    moto: 'Honda CB 125',
    city: 'Manizales, Caldas',
    initials: 'LM',
    gradient: 'from-red-500 to-pink-600',
  },
  {
    name: 'Diego Herrera',
    text: 'Los repuestos originales que compramos aquí nos han durado el doble que los genéricos. Ahora toda nuestra flota de trabajo la manejamos con Ibiza Motos. Muy profesionales.',
    rating: 5,
    moto: 'Bajaj Dominar 400',
    city: 'Cartago, Valle',
    initials: 'DH',
    gradient: 'from-purple-500 to-indigo-600',
  },
];

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden relative" ref={ref}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-ibiza-red/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-ibiza-gold/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-ibiza-red font-display font-semibold text-sm tracking-widest uppercase mb-4"
          >
            ⭐ Testimonios
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl text-gray-900 mb-4"
          >
            LO QUE DICEN NUESTROS CLIENTES
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isVisible ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-24 h-1 bg-gradient-ibiza mx-auto rounded-full mb-8"
          />

          {/* Google Reviews Badge */}
          <motion.a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex items-center gap-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 transition-all duration-300 group shadow-sm"
          >
            {/* Google "G" logo */}
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
              <svg viewBox="0 0 48 48" className="w-6 h-6">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl text-gray-900">{GOOGLE_TOTAL_RATING}</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.floor(GOOGLE_TOTAL_RATING) ? 'fill-ibiza-gold text-ibiza-gold' : 'fill-ibiza-gold/30 text-ibiza-gold/30'}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                <span className="text-gray-900 font-semibold">{GOOGLE_TOTAL_REVIEWS} reseñas</span> en Google
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors ml-2" />
          </motion.a>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-10 w-12 h-12 bg-white backdrop-blur-sm rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:bg-ibiza-red hover:border-ibiza-red hover:text-white transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-10 w-12 h-12 bg-white backdrop-blur-sm rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:bg-ibiza-red hover:border-ibiza-red hover:text-white transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards container */}
          <div className="relative h-[420px] md:h-[380px] perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 preserve-3d"
              >
                <div className="bg-white backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
                  {/* Subtle gradient accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${currentTestimonial.gradient}`} />
                  
                  {/* Quote icon */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className={`w-14 h-14 bg-gradient-to-br ${currentTestimonial.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <Quote className="w-7 h-7 !text-white" />
                  </motion.div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-ibiza-gold text-ibiza-gold" />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-lg md:text-xl text-gray-700 font-medium mb-8 leading-relaxed max-w-2xl">
                    "{currentTestimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${currentTestimonial.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="!text-white font-display font-bold text-lg">
                        {currentTestimonial.initials}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-display font-bold text-gray-900">
                        {currentTestimonial.name}
                      </p>
                      <p className="text-ibiza-red text-sm font-medium">
                        {currentTestimonial.moto}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {currentTestimonial.city}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${index === currentIndex
                    ? 'w-10 h-3 bg-ibiza-red rounded-full shadow-[0_0_10px_rgba(227,25,55,0.4)]'
                    : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
