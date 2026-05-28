import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, MapPin, BadgeCheck, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getBrandSalesWhatsApp } from '@/lib/config';
import { motorcycles } from '@/data/motorcycles';

// Precio y cuota tomados del catálogo (fuente única) para que el hero
// siempre coincida con la ficha de cada moto.
const fmtCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
const cuotaMensual = (precio: number) =>
  Math.round((precio * (0.0126 * Math.pow(1.0126, 36))) / (Math.pow(1.0126, 36) - 1));

interface Slide {
  id: number;
  brand: string;
  model: string;
  headline: string;
  subline: string;
  description: string;
  price: string;
  fromMonth: string;
  accent: string;
  image: string;
  motoSlug: string;
}

const slides: Slide[] = [
  {
    id: 1,
    brand: 'Bajaj',
    model: 'Dominar 400 Volcano',
    headline: 'NACIDA PARA LA RUTA',
    subline: 'Tour grande, motor 4 válvulas, frenos Bybre. Tu próxima aventura empieza acá.',
    description: 'En Pereira, Dosquebradas, Santa Rosa de Cabal, Quimbaya y Neiva.',
    price: '$22.990.000',
    fromMonth: '$465.000/mes',
    accent: '#003399',
    image: '/moto_images/dominar-400-volcano/dominar-400-volcano.png',
    motoSlug: 'dominar-400-volcano',
  },
  {
    id: 2,
    brand: 'Honda',
    model: 'CB 300F',
    headline: 'PRESTIGIO HONDA',
    subline: 'Naked deportiva, motor 286cc, tecnología Honda en cada vibración.',
    description: 'Tu Honda con financiación inmediata vía Progreser, Banco de Bogotá o SUFI.',
    price: '$18.490.000',
    fromMonth: '$390.000/mes',
    accent: '#cc0000',
    image: '/moto_images/cb-300f/Nueva-CB-300F-rojo.webp',
    motoSlug: 'cb-300f',
  },
  {
    id: 3,
    brand: 'Suzuki',
    model: 'Gixxer SF 250',
    headline: 'SPORT DE VERDAD',
    subline: 'Carenado completo, motor 250cc refrigerado por aceite, ABS en ambas ruedas.',
    description: 'Concesionario Suzuki autorizado en el Eje Cafetero, con servicio técnico y repuestos originales.',
    price: '$19.990.000',
    fromMonth: '$420.000/mes',
    accent: '#1a73e8',
    image: '/moto_images/gixxer-sf-250/GIXXER-SF-250-BLANCA-AZUL.png',
    motoSlug: 'gixxer-sf-250',
  },
];

export default function Hero() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const SLIDE_DURATION = 7000;

  const slide = slides[currentSlide];

  // Precio real desde el catálogo (fallback al hardcodeado si no se encuentra)
  const motoData = motorcycles.find((m) => m.model === slide.model);
  const displayPrice = motoData ? fmtCOP(motoData.price) : slide.price;
  const displayCuota = motoData ? `${fmtCOP(cuotaMensual(motoData.price))}/mes` : slide.fromMonth;

  useEffect(() => {
    setProgress(0);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    const step = 100 / (SLIDE_DURATION / 50);
    progressTimerRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + step, 100));
    }, 50);
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [currentSlide]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isAutoPlaying, currentSlide]);

  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  const resetAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    autoPlayTimerRef.current = setTimeout(() => setIsAutoPlaying(true), 12000);
  }, []);

  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    setCurrentSlide(index);
    resetAutoPlay();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    resetAutoPlay();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    resetAutoPlay();
  };

  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Preload de imágenes para evitar parpadeo entre slides */}
      {slides.map((s) => (
        <link key={s.id} rel="preload" as="image" href={s.image} />
      ))}

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />

      {/* Imagen con efecto Ken Burns */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`image-${currentSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 ken-burns"
            style={{
              backgroundImage: `url('${slide.image}')`,
              backgroundSize: 'contain',
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Acento de color por slide */}
      <motion.div
        key={`accent-${currentSlide}`}
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        transition={{ duration: 1.2 }}
        style={{
          background: `radial-gradient(circle at 80% 50%, ${slide.accent}, transparent 60%)`,
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 z-[1]" />

      {/* Slide Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl"
            >
              {/* Eyebrow: badge marca */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: slide.accent }}
                />
                <span
                  className="text-[10px] font-display font-semibold tracking-[0.25em] uppercase"
                  style={{ color: slide.accent }}
                >
                  {slide.brand}
                </span>
                <span className="text-white/30 text-[10px]">·</span>
                <span className="text-white/60 text-[10px] font-display tracking-widest uppercase">
                  {slide.model}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black !text-white leading-[0.95] tracking-tight mb-4"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
              >
                {slide.headline}
              </motion.h1>

              {/* Subline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-white/85 text-base md:text-lg leading-relaxed mb-2 font-medium"
              >
                {slide.subline}
              </motion.p>

              {/* Disponibilidad / contexto local */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-white/55 text-sm md:text-base leading-relaxed mb-6"
              >
                {slide.description}
              </motion.p>

              {/* Precio */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="mb-7"
              >
                <p className="text-white/40 text-xs font-display tracking-widest uppercase mb-1">
                  Desde
                </p>
                <div className="flex items-end gap-4 flex-wrap">
                  <p className="font-display font-black !text-white text-3xl md:text-4xl leading-none">
                    {displayPrice}
                  </p>
                  <p className="text-white/60 text-sm">
                    o <span className="text-white font-semibold">{displayCuota}</span>
                  </p>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="flex flex-wrap gap-3"
              >
                <a
                  href={getBrandSalesWhatsApp(slide.brand)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-display font-bold text-sm !text-white border border-transparent transition-all duration-300 hover:scale-[1.03] hover:brightness-110 shadow-xl active:scale-95"
                    style={{
                      background: '#25D366',
                      boxShadow: `0 12px 35px rgba(37, 211, 102, 0.45)`,
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Cotizar por WhatsApp
                  </button>
                </a>
                <button
                  onClick={() => navigate(`/marca/${slide.brand.toLowerCase()}`)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-display font-semibold text-sm !text-white/85 border border-white/20 backdrop-blur-sm hover:bg-white/10 hover:!text-white transition-all duration-300"
                >
                  Ver {slide.brand}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Señales de confianza */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-7"
              >
                {[
                  { icon: <MapPin className="w-3.5 h-3.5" />, label: '19 sucursales' },
                  { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: '6 marcas oficiales' },
                  { icon: <Clock className="w-3.5 h-3.5" />, label: 'Crédito en 24h' },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {i > 0 && <span className="w-px h-4 bg-white/15 -ml-2.5 mr-0.5 hidden sm:block" />}
                    <span className="text-[#25D366]">{item.icon}</span>
                    <span className="text-white/75 text-xs sm:text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Slide anterior"
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Slide siguiente"
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom tabs */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-end gap-0 border-t border-white/10">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`flex-1 text-left px-3 sm:px-5 py-3 sm:py-5 transition-all duration-300 border-t-2 relative overflow-hidden ${
                  i === currentSlide
                    ? 'border-t-white'
                    : 'border-t-transparent hover:border-t-white/30'
                }`}
              >
                {i === currentSlide && (
                  <div className="absolute top-0 left-0 h-[2px] bg-white/20 w-full">
                    <motion.div
                      className="h-full bg-white"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: 'linear' }}
                    />
                  </div>
                )}
                <span
                  className="block text-[10px] font-display font-semibold tracking-[0.2em] uppercase mb-1 transition-colors duration-300"
                  style={{ color: i === currentSlide ? s.accent : 'rgba(255,255,255,0.3)' }}
                >
                  {s.brand}
                </span>
                <span
                  className={`block text-sm font-display font-bold transition-colors duration-300 ${
                    i === currentSlide ? '!text-white' : '!text-white/40'
                  }`}
                >
                  {s.model}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-28 right-8 z-20 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-white/25 text-[9px] font-display tracking-[0.25em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-[18px] h-7 border border-white/15 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-0.5 h-1.5 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
