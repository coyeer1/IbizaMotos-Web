import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ChevronLeft, ChevronRight, ArrowRight, Play, X } from 'lucide-react';
import { brands, motorcycles as allMotos } from '@/data/motorcycles';
import { getBrandSalesWhatsApp } from '@/lib/config';

// Acento monocromático único — alineado con el hero (un solo rojo).
const ACCENT = '#E31937';

const BRAND_SLIDES: Record<string, string> = {
  'Suzuki':    '/brand-slides/suzuki.jpg',
  'Vento':     '/brand-slides/vento.jpg',
  'Hero':      '/brand-slides/hero.png',
  'Honda':     '/brand-slides/honda.jpg',
  'Bajaj':     '/brand-slides/bajaj.jpg',
  'AKT':       '/brand-slides/akt.jpg',
  'Good Kidz': '/brand-slides/goodkidz.jpg',
};

// YouTube video IDs para cada marca — cámbialos por el que prefieras
const BRAND_VIDEOS: Record<string, string> = {
  'Suzuki':    'MCgD4bWbpNY', // Suzuki Way of Life! Brand Movie
  'Hero':      'BFIwQyhOLEg', // Hero MotoCorp – We Ride
  'AKT':       'jFfn_czsK6s', // Historia AKT – La marca colombiana
  'Vento':     'fV7GSt4MB9g', // Catálogo Vento
  'Honda':     'Ium-algvybU', // Honda oficial
  'Bajaj':     '4T3RPI3xvmY', // Bajaj oficial
  'Good Kidz': 'CWXcKx-hPAo', // Mini Motos para Niños (cambiar si encuentran oficial)
};

const AUTOPLAY_DELAY = 4500;

function VideoModal({ videoId, brandName, color, onClose }: {
  videoId: string;
  brandName: string;
  color: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ background: color }}
        >
          <span className="text-white font-bold tracking-wide text-sm uppercase">{brandName}</span>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Video 16:9 */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={`Video ${brandName}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export default function BrandSelector() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
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
  const color = ACCENT;
  const waUrl = getBrandSalesWhatsApp(brand.name);
  const videoId = BRAND_VIDEOS[brand.name] ?? null;

  const openVideo = () => {
    isPaused.current = true;
    setVideoOpen(true);
  };
  const closeVideo = () => {
    isPaused.current = false;
    setVideoOpen(false);
  };

  return (
    <section
      id="motos"
      className="relative w-full overflow-hidden select-none bg-[#f5f5f5] font-body"
      style={{ height: 'clamp(520px, 85vh, 820px)', color: '#000' }}
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
          background: 'linear-gradient(to right, #f5f5f5 36%, rgba(245,245,245,0.85) 54%, rgba(245,245,245,0.1) 75%, transparent 90%)',
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
          <span className="uppercase" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#999' }}>
            Marcas oficiales
          </span>
          <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
            {active + 1} / {brandData.length}
          </p>
        </div>
        <button
          onClick={() => navigate('/marca/todas')}
          className="flex items-center gap-1.5 transition-colors duration-200 hover:text-black"
          style={{ fontSize: 12, fontWeight: 600, color: '#999' }}
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
          className="font-display leading-none mb-2 animate-[fadeUp_0.45s_ease_forwards]"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 5rem)', letterSpacing: '-1px', color: '#000' }}
        >
          {brand.name}
        </h2>
        <p
          key={`count-${active}`}
          className="mb-7 animate-[fadeUp_0.5s_ease_forwards]"
          style={{ fontSize: 14, color: '#aaa', fontWeight: 400 }}
        >
          {brand.count} {brand.count === 1 ? 'modelo disponible' : 'modelos disponibles'}
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3 pointer-events-auto flex-wrap">
          <button
            onClick={() => navigate(`/marca/${brand.id}`)}
            className="flex items-center gap-2 text-white transition-transform duration-200 active:scale-95 hover:scale-[1.02]"
            style={{ background: '#000', borderRadius: 8, padding: '11px 22px', fontSize: 14, fontWeight: 600 }}
          >
            Ver catálogo <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white bg-[#25D366] hover:bg-[#1db954] transition-colors duration-200 active:scale-95"
            style={{ borderRadius: 8, padding: '11px 22px', fontSize: 14, fontWeight: 600 }}
          >
            <MessageCircle className="w-4 h-4" />
            Consultar
          </a>
          {videoId && (
            <button
              key={`video-${active}`}
              onClick={openVideo}
              className="flex items-center gap-2 transition-all duration-200 active:scale-95 animate-[fadeUp_0.55s_ease_forwards]"
              style={{
                border: '1px solid #d0d0d0',
                color: '#000',
                background: 'transparent',
                borderRadius: 8,
                padding: '11px 22px',
                fontSize: 14,
                fontWeight: 600,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#000';
                (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#000';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = '#000';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#d0d0d0';
              }}
            >
              <Play className="w-4 h-4 fill-current" />
              Ver video
            </button>
          )}
        </div>
      </div>

      {/* ── Brand thumbnail nav — bottom left ── */}
      <div className="absolute bottom-8 left-8 sm:left-12 flex items-center gap-2 overflow-x-auto no-scrollbar z-20">
        {brandData.map((b, i) => (
          <button
            key={b.id}
            onClick={() => { goTo(i); resetTimer(); }}
            aria-label={`Ver ${b.name}`}
            className="shrink-0 flex items-center justify-center bg-white transition-all duration-300 hover:opacity-100"
            style={{
              width: i === active ? 68 : 52,
              height: i === active ? 42 : 34,
              borderRadius: 8,
              border: '1px solid #e8e8e8',
              outline: i === active ? `2px solid ${color}` : '2px solid transparent',
              outlineOffset: -1,
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
                   w-10 h-10 rounded-full bg-white border border-[#e8e8e8]
                   flex items-center justify-center text-gray-500 hover:text-black hover:border-black
                   active:scale-90 transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Siguiente marca"
        className="absolute right-4 bottom-7 z-20
                   w-10 h-10 rounded-full bg-white border border-[#e8e8e8]
                   flex items-center justify-center text-gray-500 hover:text-black hover:border-black
                   active:scale-90 transition-all duration-200"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#e8e8e8] z-30">
        <div
          key={active}
          className="h-full animate-[progressBar_4.5s_linear_forwards]"
          style={{ background: color }}
        />
      </div>

      {/* ── Video modal ── */}
      {videoOpen && videoId && (
        <VideoModal
          videoId={videoId}
          brandName={brand.name}
          color={color}
          onClose={closeVideo}
        />
      )}
    </section>
  );
}
