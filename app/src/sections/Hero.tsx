import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Each slide can have its own video (placeholder: /hero-video.mp4 until real videos are added)
const slides = [
  {
    id: 1,
    brand: 'Vento',
    model: 'Tornado 250',
    headline: 'DOMINA EL ASFALTO',
    description: 'Potencia y estilo en cada curva. La compañera perfecta para tu próxima aventura.',
    cta: 'Descúbrela Ahora',
    price: 'Desde $12.999.000',
    accent: '#FF6B00',
    video: '/hero-video.mp4',
  },
  {
    id: 2,
    brand: 'Suzuki',
    model: 'GSX-R150 ABS',
    headline: 'LA CIUDAD ES TUYA',
    description: 'Agilidad urbana con alma de campeón. Diseño deportivo que roba miradas.',
    cta: 'Conócela Aquí',
    price: 'Desde $14.990.000',
    accent: '#E53E3E',
    video: '/hero-video.mp4',
  },
  {
    id: 3,
    brand: 'Bajaj',
    model: 'Boxer 150',
    headline: 'TU PRIMER VIAJE',
    description: 'Confianza, durabilidad y economía. La moto que te lleva más lejos.',
    cta: 'Empieza Hoy',
    price: 'Desde $5.999.000',
    accent: '#3182CE',
    video: '/hero-video.mp4',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const SLIDE_DURATION = 7000; // ms

  const slide = slides[currentSlide];

  // Progress bar per slide
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

  // Auto-play
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

  // Fallback images per slide (used when video file is missing)
  const fallbackImages = [
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1508357941062-537798998e6b?auto=format&fit=crop&q=80&w=1920',
  ];

  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden bg-gray-900">

      {/* ── Fallback image (shown while video loads or is missing) ── */}
      <AnimatePresence mode="sync">
        <motion.img
          key={`img-${currentSlide}`}
          src={fallbackImages[currentSlide]}
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* ── Video Background (replaces image when available) ── */}
      <AnimatePresence mode="sync">
        <motion.video
          key={`video-${currentSlide}`}
          src={slide.video}
          autoPlay
          loop
          muted
          playsInline
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* ── Gradient overlays for text readability ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 z-[1]" />

      {/* ── Slide Content ── */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              {/* Brand tag */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: slide.accent }}
                />
                <span
                  className="text-xs font-display font-semibold tracking-[0.25em] uppercase"
                  style={{ color: slide.accent }}
                >
                  {slide.brand}
                </span>
                <span className="text-white/30 text-xs">—</span>
                <span className="text-white/50 text-xs font-display tracking-widest uppercase">
                  {slide.model}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black text-white leading-[0.95] tracking-tight mb-5"
                style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
              >
                {slide.headline}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-white/55 text-base md:text-lg leading-relaxed max-w-md mb-6"
              >
                {slide.description}
              </motion.p>

              {/* Price */}
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="font-display font-bold text-white text-2xl md:text-3xl mb-8"
              >
                {slide.price}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <a href="#motos">
                  <button
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-display font-semibold text-sm text-white transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-100"
                    style={{
                      background: slide.accent,
                      boxShadow: `0 8px 28px ${slide.accent}55`,
                    }}
                  >
                    {slide.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </a>
                <a
                  href="https://wa.me/573214567890"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-display font-semibold text-sm text-white/80 border border-white/20 backdrop-blur-sm hover:bg-white/10 hover:text-white transition-all duration-300">
                    Contactar
                  </button>
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Navigation Arrows ── */}
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

      {/* ── Bottom: Slide tabs with model names ── */}
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
                {/* Progress bar for active slide */}
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
                  className={`block text-[10px] font-display font-semibold tracking-[0.2em] uppercase mb-1 transition-colors duration-300`}
                  style={{ color: i === currentSlide ? s.accent : 'rgba(255,255,255,0.3)' }}
                >
                  {s.brand}
                </span>
                <span
                  className={`block text-sm font-display font-bold transition-colors duration-300 ${
                    i === currentSlide ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {s.model}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
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
