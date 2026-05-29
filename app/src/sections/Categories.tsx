import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from '@/components/Reveal';

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    slug: 'calle',
    name: 'Calle',
    filterCategory: 'City',
    image: '/categories/gixxer.png',
    focalX: 80,
    focalY: 38,
  },
  {
    slug: 'aventura',
    name: 'Aventura',
    filterCategory: 'Adventure',
    image: '/categories/nkd.png',
    focalX: 80,
    focalY: 42,
  },
  {
    slug: 'automaticas',
    name: 'Automáticas',
    filterCategory: 'Scooters',
    image: '/categories/burgamn.png',
    focalX: 78,
    focalY: 40,
  },
  {
    slug: 'semi-automaticas',
    name: 'Semi\nautomáticas',
    filterCategory: 'City',
    image: '/categories/special-110.png',
    focalX: 80,
    focalY: 42,
  },
  {
    slug: 'enduro',
    name: 'Enduro',
    filterCategory: 'Enduro',
    image: '/categories/xr.png',
    focalX: 75,
    focalY: 40,
  },
];

const AUTOPLAY_DELAY = 3500;

// ─── Tokens (match the hero) ────────────────────────────────────────────────
const T = {
  text: '#000000',
  muted: '#999999',
  red: '#E31937',
  display: "'Bebas Neue', sans-serif",
  body: "'DM Sans', sans-serif",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Categories() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAutoScrollingRef = useRef(false);

  // ── helpers ──────────────────────────────────────────────────────────────
  const getCardWidth = useCallback(() => {
    if (!scrollRef.current) return 300;
    const card = scrollRef.current.querySelector<HTMLElement>('.cat-card');
    return card ? card.offsetWidth + 4 : 300; // offsetWidth + gap (gap-1 = 4px)
  }, []);

  const scrollToIndex = useCallback((idx: number, smooth = true) => {
    if (!scrollRef.current) return;
    isAutoScrollingRef.current = true;
    scrollRef.current.scrollTo({
      left: idx * getCardWidth(),
      behavior: smooth ? 'smooth' : 'instant',
    });
    // clear flag after animation
    setTimeout(() => { isAutoScrollingRef.current = false; }, 600);
  }, [getCardWidth]);

  const goTo = useCallback((raw: number) => {
    const n = CATEGORIES.length;
    const idx = ((raw % n) + n) % n;
    setActiveIndex(idx);
    scrollToIndex(idx);
  }, [scrollToIndex]);

  // ── autoplay ─────────────────────────────────────────────────────────────
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % CATEGORIES.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_DELAY);
  }, [scrollToIndex]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  // ── sync dots when user swipes manually ──────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (isAutoScrollingRef.current) return;
      const w = getCardWidth();
      const idx = Math.min(
        Math.round(el.scrollLeft / w),
        CATEGORIES.length - 1
      );
      setActiveIndex(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [getCardWidth]);

  // ── arrow handlers ────────────────────────────────────────────────────────
  const handlePrev = () => { goTo(activeIndex - 1); resetTimer(); };
  const handleNext = () => { goTo(activeIndex + 1); resetTimer(); };

  // ── pause autoplay on hover/touch ─────────────────────────────────────────
  const handleMouseEnter = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const handleMouseLeave = () => { resetTimer(); };

  return (
    <section className="py-16 md:py-24 bg-white" style={{ fontFamily: T.body, color: T.text }}>

      {/* ── Header ── */}
      <div className="text-center mb-12 md:mb-16 px-6">
        <Reveal direction="up">
          <span
            className="block uppercase"
            style={{ fontSize: 11, letterSpacing: '0.15em', color: T.muted, fontWeight: 600, marginBottom: 10 }}
          >
            Catálogo
          </span>
        </Reveal>
        <Reveal delay={0.08} direction="up">
          <h2
            style={{
              fontFamily: T.display,
              fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.5px',
              color: T.text,
            }}
          >
            Nuestras motos Ibiza
          </h2>
        </Reveal>
        <Reveal delay={0.16} direction="up">
          <button
            onClick={() => navigate('/marca/todas')}
            className="mt-6 inline-flex items-center gap-2 px-7 py-3 text-white rounded-lg text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-95"
            style={{ background: T.text, fontFamily: T.body }}
          >
            Conócelas todas →
          </button>
        </Reveal>
      </div>

      {/* ── Carousel ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Track */}
        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() =>
                navigate(`/marca/todas?categoria=${encodeURIComponent(cat.filterCategory)}`)
              }
              className="cat-card group relative flex-shrink-0 snap-start overflow-hidden cursor-pointer transition-all duration-[350ms] ease-out hover:-translate-y-1.5 focus:outline-none rounded-xl"
              style={{
                width: 'clamp(260px, 82vw, 380px)',
                height: 'clamp(400px, 72vw, 560px)',
              }}
            >
              {/* Imagen */}
              <img
                src={cat.image}
                alt={cat.name}
                draggable={false}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[350ms] ease-out"
                style={{
                  objectPosition: `${cat.focalX}% ${cat.focalY}%`,
                  transform: 'scale(2.2)',
                  transformOrigin: `${cat.focalX}% ${cat.focalY}%`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLImageElement).style.transform = 'scale(2.38)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLImageElement).style.transform = 'scale(2.2)';
                }}
              />

              {/* Gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none transition-opacity duration-[350ms] group-hover:from-black/95" />

              {/* Texto */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <h3
                  className="text-white whitespace-pre-line"
                  style={{
                    fontFamily: T.display,
                    fontSize: 'clamp(1.7rem, 2.6vw, 2.6rem)',
                    lineHeight: 0.95,
                    letterSpacing: '-0.5px',
                    marginBottom: 14,
                  }}
                >
                  {cat.name}
                </h3>
                <span
                  className="inline-flex items-center px-5 py-2.5 text-white rounded-lg font-semibold transition-transform duration-200 group-hover:scale-[1.03]"
                  style={{ background: T.red, fontFamily: T.body, fontSize: 13, letterSpacing: '0.01em' }}
                >
                  Conócelas
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* ── Flecha izquierda — visible en todos los tamaños ── */}
        <button
          onClick={handlePrev}
          aria-label="Anterior"
          className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-10
                     w-9 h-9 md:w-14 md:h-14 rounded-full
                     bg-white/95 backdrop-blur-sm
                     border border-[#e8e8e8]
                     shadow-[0_2px_12px_rgba(0,0,0,0.08)]
                     flex items-center justify-center
                     text-black hover:bg-black hover:text-white hover:border-black
                     active:scale-90 transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
        </button>

        {/* ── Flecha derecha — visible en todos los tamaños ── */}
        <button
          onClick={handleNext}
          aria-label="Siguiente"
          className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-10
                     w-9 h-9 md:w-14 md:h-14 rounded-full
                     bg-white/95 backdrop-blur-sm
                     border border-[#e8e8e8]
                     shadow-[0_2px_12px_rgba(0,0,0,0.08)]
                     flex items-center justify-center
                     text-black hover:bg-black hover:text-white hover:border-black
                     active:scale-90 transition-all duration-200"
        >
          <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
        </button>

        {/* ── Dots indicadores ── */}
        <div className="flex justify-center items-center gap-2 mt-5 px-6">
          {CATEGORIES.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetTimer(); }}
              aria-label={`Ir a ${CATEGORIES[i].name}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-6 h-2 bg-[#E31937]'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
