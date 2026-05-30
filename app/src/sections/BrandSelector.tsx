import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ChevronLeft, ChevronRight, ArrowRight, Play, X } from 'lucide-react';
import { brands, motorcycles as allMotos } from '@/data/motorcycles';
import { getBrandSalesWhatsApp } from '@/lib/config';

// Acento monocromático único — alineado con el hero (un solo rojo).
const ACCENT = '#E31937';

// Moto insignia por marca (misma lógica que BrandPage). Fallback: la más cara no utilitaria.
const FLAGSHIP: Record<string, string> = {
  Suzuki: 'Hayabusa',
  Bajaj: 'Dominar 400 Volcano',
  Honda: 'CB 300F',
  Hero: 'XPulse 200 R 4V',
  AKT: '250 R',
  Vento: 'Alpina 300 EFI',
};

// YouTube video IDs por marca
const BRAND_VIDEOS: Record<string, string> = {
  'Suzuki':    'MCgD4bWbpNY',
  'Hero':      'BFIwQyhOLEg',
  'AKT':       'jFfn_czsK6s',
  'Vento':     'fV7GSt4MB9g',
  'Honda':     'Ium-algvybU',
  'Bajaj':     '4T3RPI3xvmY',
  'Good Kidz': 'CWXcKx-hPAo',
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
        <div className="flex items-center justify-between px-5 py-3" style={{ background: color }}>
          <span className="text-white font-bold tracking-wide text-sm uppercase">{brandName}</span>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors" aria-label="Cerrar video">
            <X className="w-5 h-5" />
          </button>
        </div>
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
      const flagship =
        motos.find(m => m.model === FLAGSHIP[brand.name]) ??
        [...motos].filter(m => !/tuk|3w|carpado|auto/i.test(m.model)).sort((a, b) => b.price - a.price)[0] ??
        motos[0];
      return {
        ...brand,
        count: motos.length,
        flagshipId: flagship?.id ?? null,
        flagshipModel: flagship?.model ?? '',
        flagshipImg: flagship?.images?.[0] ?? null,
      };
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

  const openVideo = () => { isPaused.current = true; setVideoOpen(true); };
  const closeVideo = () => { isPaused.current = false; setVideoOpen(false); };

  return (
    <section
      id="motos"
      className="relative w-full overflow-hidden select-none bg-white font-body"
      style={{ minHeight: 'clamp(460px, 70vh, 660px)', color: '#000' }}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between pl-6 pr-5 sm:pl-12 sm:pr-10 pt-6 sm:pt-7 z-30">
        <div>
          <span className="uppercase block" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#999' }}>
            Marcas oficiales
          </span>
          <p style={{ fontSize: 12, color: '#bbb', marginTop: 2 }}>{active + 1} / {brandData.length}</p>
        </div>
        <button
          onClick={() => navigate('/marca/todas')}
          className="flex items-center gap-1.5 transition-colors duration-200 hover:text-black"
          style={{ fontSize: 12, fontWeight: 600, color: '#999' }}
        >
          Ver todas <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── 50/50 grid (igual que el hero) ── */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: 'clamp(460px, 70vh, 660px)' }}>

        {/* LEFT — contenido */}
        <div className="order-2 lg:order-1 flex flex-col justify-center px-6 sm:px-12 pb-9 lg:pb-0 pt-2 lg:pt-0 z-20">
          {/* Logo */}
          <div className="h-10 sm:h-12 mb-4 sm:mb-5 flex items-center">
            <img
              key={`logo-${active}`}
              src={brand.logo}
              alt={brand.name}
              loading="lazy"
              decoding="async"
              className="h-9 sm:h-11 w-auto max-w-[140px] object-contain animate-[fadeUp_0.4s_ease_forwards]"
            />
          </div>

          {/* Nombre */}
          <h2
            key={`name-${active}`}
            className="font-display leading-none mb-2 animate-[fadeUp_0.45s_ease_forwards]"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 4.6rem)', letterSpacing: '-1px', color: '#000' }}
          >
            {brand.name}
          </h2>
          <p
            key={`count-${active}`}
            className="mb-6 sm:mb-7 animate-[fadeUp_0.5s_ease_forwards]"
            style={{ fontSize: 14, color: '#aaa', fontWeight: 400 }}
          >
            {brand.count} {brand.count === 1 ? 'modelo disponible' : 'modelos disponibles'}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
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
                className="flex items-center gap-2 transition-all duration-200 active:scale-95"
                style={{ border: '1px solid #d0d0d0', color: '#000', background: 'transparent', borderRadius: 8, padding: '11px 22px', fontSize: 14, fontWeight: 600 }}
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

          {/* Miniaturas de marca */}
          <div className="flex items-center gap-2 mt-7 overflow-x-auto no-scrollbar">
            {brandData.map((b, i) => (
              <button
                key={b.id}
                onClick={() => { goTo(i); resetTimer(); }}
                aria-label={`Ver ${b.name}`}
                className="shrink-0 flex items-center justify-center bg-white transition-all duration-300 hover:opacity-100"
                style={{
                  width: i === active ? 64 : 50,
                  height: i === active ? 40 : 32,
                  borderRadius: 8,
                  border: '1px solid #e8e8e8',
                  outline: i === active ? `2px solid ${color}` : '2px solid transparent',
                  outlineOffset: -1,
                  opacity: i === active ? 1 : 0.55,
                }}
              >
                <img src={b.logo} alt={b.name} loading="lazy" className="h-5 w-auto max-w-[44px] object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — moto insignia (foto limpia WebP) */}
        <div className="order-1 lg:order-2 relative flex items-center justify-center pt-20 lg:pt-0 px-6">
          {/* Halo suave detrás de la moto */}
          <div
            className="absolute inset-6 lg:inset-10 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, #f4f5f6 0%, rgba(255,255,255,0) 70%)' }}
          />
          {brand.flagshipImg ? (
            <img
              key={`moto-${active}`}
              src={brand.flagshipImg}
              alt={`${brand.name} ${brand.flagshipModel}`}
              loading={active === 0 ? 'eager' : 'lazy'}
              decoding="async"
              onClick={() => brand.flagshipId && navigate(`/moto/${brand.flagshipId}`)}
              className="relative z-10 object-contain cursor-pointer animate-[fadeUp_0.5s_ease_forwards]"
              style={{ width: '88%', maxWidth: 560, maxHeight: '46vh' }}
            />
          ) : (
            <span className="font-display select-none" style={{ fontSize: '8rem', color: 'rgba(0,0,0,0.05)' }}>
              {brand.name}
            </span>
          )}
        </div>
      </div>

      {/* ── Flechas — bottom right (ocultas en móvil, las miniaturas navegan) ── */}
      <button
        onClick={handlePrev}
        aria-label="Anterior marca"
        className="hidden sm:flex absolute right-16 bottom-7 z-30 w-10 h-10 rounded-full bg-white border border-[#e8e8e8]
                   items-center justify-center text-gray-500 hover:text-black hover:border-black active:scale-90 transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Siguiente marca"
        className="hidden sm:flex absolute right-4 bottom-7 z-30 w-10 h-10 rounded-full bg-white border border-[#e8e8e8]
                   items-center justify-center text-gray-500 hover:text-black hover:border-black active:scale-90 transition-all duration-200"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Barra de progreso fina ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#eee] z-30">
        <div
          key={active}
          className="h-full animate-[progressBar_4.5s_linear_forwards]"
          style={{ background: color }}
        />
      </div>

      {/* ── Video modal ── */}
      {videoOpen && videoId && (
        <VideoModal videoId={videoId} brandName={brand.name} color={color} onClose={closeVideo} />
      )}
    </section>
  );
}
