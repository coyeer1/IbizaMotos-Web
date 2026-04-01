import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { brands, motorcycles as allMotos } from '@/data/motorcycles';
import { getBrandSalesWhatsApp } from '@/lib/config';

const BRAND_COLORS: Record<string, string> = {
  'Suzuki':    '#1a73e8',
  'Vento':     '#e53935',
  'Hero':      '#003087',
  'Honda':     '#cc0000',
  'Bajaj':     '#003087',
  'AKT':       '#e53935',
  'Good Kidz': '#2e7d32',
};

const BRAND_SLIDES: Record<string, string> = {
  'Suzuki':    '/brand-slides/suzuki.jpg',
  'Vento':     '/brand-slides/vento.jpg',
  'Hero':      '/brand-slides/hero.png',
  'Honda':     '/brand-slides/honda.jpg',
  'Bajaj':     '/brand-slides/bajaj.jpg',
  'AKT':       '/brand-slides/akt.jpg',
  'Good Kidz': '/brand-slides/goodkidz.jpg',
};

const AUTOPLAY_DELAY = 4500;

export default function BrandSelector() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPaused = useRef(false);

  const brandData = useMemo(() => {
    return brands.map(brand => {
      const motos = allMotos.filter(m => m.brand === brand.name);
      return { ...brand, count: motos.length, slideImage: BRAND_SLIDES[brand.name] ?? null };
    });
  }, []);

  const goTo = useCallback((raw: number) => {
    const n = brandData.length;
    setActive(((raw % n) + n) % n);
  }, [brandData.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isPaused.current) setActive(p => (p + 1) % brandData.length);
    }, AUTOPLAY_DELAY);
  }, [brandData.length]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const handlePrev = () => { goTo(active - 1); resetTimer(); };
  const handleNext = () => { goTo(active + 1); resetTimer(); };

  const brand = brandData[active];
  const color = BRAND_COLORS[brand.name] ?? '#d7263d';
  const waUrl = getBrandSalesWhatsApp(brand.name);

  return (
    <section
      id="motos"
      className="relative w-full overflow-hidden select-none bg-[#f4f4f4]"
      style={{ height: 'clamp(520px, 85vh, 820px)' }}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      {/* ── Moto images — right-aligned, clean product shot on light bg ── */}
      {brandData.map((b, i) => (
        <div
          key={b.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          {b.slideImage && (
            <img
              src={b.slideImage}
              alt=""
              aria-hidden
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute top-0 bottom-0 right-0 h-full object-contain object-right"
              style={{
                width: '68%',
                transform: i === active ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 7s ease-out',
              }}
            />
          )}
        </div>
      ))}

      {/* Fade left → right so text stays legible */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to right, #f4f4f4 36%, rgba(244,244,244,0.85) 54%, rgba(244,244,244,0.1) 75%, transparent 90%)',
        }}
      />

      {/* Subtle brand color accent on left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 z-20 transition-all duration-700"
        style={{ background: color }}
      />

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between pl-8 pr-6 sm:pl-12 sm:pr-10 pt-7 z-20">
        <div>
          <span className="text-gray-400 text-[10px] uppercase tracking-[0.25em] font-semibold">
            Marcas oficiales
          </span>
          <p className="text-gray-400 text-xs font-medium mt-0.5">
            {active + 1} / {brandData.length}
          </p>
        </div>
        <button
          onClick={() => navigate('/marca/todas')}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-xs font-semibold transition-colors"
        >
          Ver todo <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Left content ── */}
      <div className="absolute inset-0 flex flex-col justify-center pl-8 sm:pl-12 z-20 pointer-events-none">

        {/* Logo */}
        <div className="relative h-12 sm:h-16 mb-5 w-48">
          {brandData.map((b, i) => (
            <div
              key={b.id}
              className="absolute inset-0 flex items-center transition-all duration-500 ease-in-out"
              style={{
                opacity: i === active ? 1 : 0,
                transform: i === active ? 'translateY(0px)' : 'translateY(6px)',
              }}
            >
              <img
                src={b.logo}
                alt={b.name}
                loading="lazy"
                decoding="async"
                className="h-10 sm:h-14 w-auto max-w-[150px] object-contain"
              />
            </div>
          ))}
        </div>

        {/* Brand name */}
        <h2
          key={`name-${active}`}
          className="font-display font-black text-gray-900 leading-none mb-2 animate-[fadeUp_0.45s_ease_forwards]"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 5rem)' }}
        >
          {brand.name}
        </h2>
        <p
          key={`count-${active}`}
          className="text-gray-400 text-sm font-medium mb-7 animate-[fadeUp_0.5s_ease_forwards]"
        >
          {brand.count} {brand.count === 1 ? 'modelo disponible' : 'modelos disponibles'}
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => navigate(`/marca/${brand.id}`)}
            className="flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-md"
            style={{ background: color }}
          >
            Ver catálogo <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1db954] transition-colors active:scale-95 shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            Consultar
          </a>
        </div>
      </div>

      {/* ── Brand thumbnail nav — bottom left ── */}
      <div className="absolute bottom-8 left-8 sm:left-12 flex items-center gap-2 overflow-x-auto no-scrollbar z-20">
        {brandData.map((b, i) => (
          <button
            key={b.id}
            onClick={() => { goTo(i); resetTimer(); }}
            aria-label={`Ver ${b.name}`}
            className="shrink-0 flex items-center justify-center rounded-xl bg-white transition-all duration-300 shadow-sm hover:shadow-md"
            style={{
              width: i === active ? 68 : 52,
              height: i === active ? 42 : 34,
              outline: i === active ? `2.5px solid ${color}` : '2px solid transparent',
              opacity: i === active ? 1 : 0.55,
            }}
          >
            <img
              src={b.logo}
              alt={b.name}
              loading="lazy"
              className="h-5 w-auto max-w-[48px] object-contain"
            />
          </button>
        ))}
      </div>

      {/* ── Arrows — bottom right ── */}
      <button
        onClick={handlePrev}
        aria-label="Anterior marca"
        className="absolute right-16 bottom-7 z-20
                   w-10 h-10 rounded-full bg-white shadow border border-gray-200
                   flex items-center justify-center text-gray-600 hover:text-gray-900
                   active:scale-90 transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Siguiente marca"
        className="absolute right-4 bottom-7 z-20
                   w-10 h-10 rounded-full bg-white shadow border border-gray-200
                   flex items-center justify-center text-gray-600 hover:text-gray-900
                   active:scale-90 transition-all duration-200"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-200 z-30">
        <div
          key={active}
          className="h-full animate-[progressBar_4.5s_linear_forwards]"
          style={{ background: color }}
        />
      </div>
    </section>
  );
}
