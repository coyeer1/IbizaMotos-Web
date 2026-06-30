import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBrandSalesWhatsApp } from '@/lib/config';
import { motorcycles } from '@/data/motorcycles';

// ─── Tokens del hero (no afectan al resto del sitio) ───────────────────────
const T = {
  text: '#000000',
  muted: '#999999',
  border: '#e8e8e8',
  pill: '#f5f5f5',
  red: '#E31937',
  display: "'Bebas Neue', sans-serif",
  body: "'DM Sans', sans-serif",
};

interface HeroSlide {
  brand: string;
  model: string;        // debe coincidir con el catálogo para tomar el precio real
  headline: string[];   // 3 líneas
  tagline: string;
  specs: string[];      // máx 3
  image: string;        // WebP optimizado, fondo transparente
}

const SLIDES: HeroSlide[] = [
  {
    brand: 'Bajaj',
    model: 'Dominar 400 Volcano',
    headline: ['NACIDA', 'PARA LA', 'RUTA'],
    tagline: 'Touring de verdad: motor DOHC de 373cc, frenos Bybre y autonomía para comerte la carretera.',
    specs: ['373 cc', '40 HP', '6 vel · ABS'],
    image: '/moto_images/dominar-400-volcano/dominar-400-volcano.webp',
  },
  {
    brand: 'Honda',
    model: 'CB 300F',
    headline: ['PRESTIGIO', 'EN CADA', 'CURVA'],
    tagline: 'Naked deportiva de 286cc con la confiabilidad Honda. Hecha para la ciudad y la ruta.',
    specs: ['286 cc', '26.6 HP', '6 vel'],
    image: '/moto_images/cb-300f/Nueva-CB-300F-rojo.webp',
  },
  {
    brand: 'Suzuki',
    model: 'Gixxer SF 250',
    headline: ['SPORT', 'DE PURA', 'RAZA'],
    tagline: 'Carenado completo, motor 250cc refrigerado por aceite y ABS. Adrenalina con sello Suzuki.',
    specs: ['249 cc', '26.5 HP', '6 vel'],
    image: '/moto_images/gixxer-sf-250/GIXXER-SF-250-BLANCA-AZUL.webp',
  },
];

const fmtCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export default function Hero() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [isPaused, setIsPaused] = useState(false);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slide = SLIDES[idx];
  const moto = motorcycles.find((m) => m.model === slide.model);
  const price = moto ? fmtCOP(moto.price) : '';

  // Cambio de slide: sale el actual (out), luego entra el nuevo (in)
  const goTo = useCallback((next: number) => {
    setPhase('out');
    if (swapTimer.current) clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => {
      setIdx(next);
      setPhase('in');
    }, 250);
  }, []);

  // Auto-advance cada 6s (pausa al pasar el mouse por la moto)
  useEffect(() => {
    if (isPaused) return;
    const t = setTimeout(() => goTo((idx + 1) % SLIDES.length), 6000);
    return () => clearTimeout(t);
  }, [idx, isPaused, goTo]);

  useEffect(() => () => { if (swapTimer.current) clearTimeout(swapTimer.current); }, []);

  // delay helper para el stagger de entrada
  const anim = (delayMs: number, dur = 0.4, name = 'fadeUp') =>
    ({ animation: `${name} ${dur}s both`, animationDelay: `${delayMs}ms` } as React.CSSProperties);

  return (
    <section
      id="inicio"
      className="relative w-full overflow-hidden bg-white"
      style={{ fontFamily: T.body, minHeight: '100svh', color: T.text }}
    >
      <div className="relative h-full min-h-[100svh] grid grid-cols-1 lg:grid-cols-2">

        {/* ── COLUMNA IZQUIERDA — contenido ── */}
        <div className="order-2 lg:order-1 flex flex-col justify-center px-6 sm:px-10 lg:pl-20 lg:pr-10 pb-10 lg:pb-0 pt-2 lg:pt-0">
          {/* keyed por idx → re-ejecuta el stagger en cada cambio */}
          <div key={idx} className={phase === 'out' ? 'hero-text-out' : ''} style={{ maxWidth: 520 }}>

            {/* Brand chip */}
            <span
              className="inline-block uppercase"
              style={{
                ...anim(0),
                fontSize: 11,
                letterSpacing: '0.15em',
                border: `1px solid ${T.border}`,
                borderRadius: 20,
                padding: '4px 14px',
                color: '#888',
              }}
            >
              {slide.brand}
            </span>

            {/* Nombre del modelo */}
            <p style={{ ...anim(80), fontSize: 14, color: '#aaa', fontWeight: 400, marginTop: 14 }}>
              {slide.model}
            </p>

            {/* Headline 3 líneas */}
            <h1 style={{ marginTop: 8 }}>
              {slide.headline.map((line, i) => (
                <span
                  key={i}
                  className="block"
                  style={{
                    ...anim(140 + i * 60, 0.5),
                    fontFamily: T.display,
                    fontSize: 'clamp(56px, 8vw, 90px)',
                    lineHeight: 0.92,
                    letterSpacing: '-1px',
                    color: T.text,
                  }}
                >
                  {line}
                </span>
              ))}
            </h1>

            {/* Tagline */}
            <p
              style={{
                ...anim(330),
                fontSize: 15,
                color: '#666',
                fontWeight: 300,
                maxWidth: 320,
                lineHeight: 1.65,
                marginTop: 20,
              }}
            >
              {slide.tagline}
            </p>

            {/* Specs pills */}
            <div className="flex flex-wrap" style={{ ...anim(390), gap: 8, marginTop: 18 }}>
              {slide.specs.map((s) => (
                <span
                  key={s}
                  style={{
                    background: T.pill,
                    borderRadius: 6,
                    padding: '5px 13px',
                    fontSize: 12,
                    color: '#555',
                    fontWeight: 500,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Precio */}
            <div style={{ ...anim(440), marginTop: 28 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.25em', color: '#bbb' }}>DESDE</p>
              <p style={{ fontSize: 34, fontWeight: 700, color: T.text, lineHeight: 1.05 }}>{price}</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap" style={{ ...anim(490), gap: 12, marginTop: 28 }}>
              <a href={getBrandSalesWhatsApp(slide.brand)} target="_blank" rel="noopener noreferrer">
                <button
                  className="transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                  style={{
                    background: '#000',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '13px 26px',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Cotizar por WhatsApp
                </button>
              </a>
              <button
                onClick={() => navigate(`/marca/${slide.brand.toLowerCase()}`)}
                className="transition-colors duration-200 hover:bg-black hover:text-white"
                style={{
                  background: 'transparent',
                  color: '#000',
                  border: '1px solid #d0d0d0',
                  borderRadius: 8,
                  padding: '13px 26px',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Ver modelos →
              </button>
            </div>
          </div>
        </div>

        {/* ── COLUMNA DERECHA — moto ── */}
        <div
          className="order-1 lg:order-2 relative flex flex-col items-center justify-center pt-24 lg:pt-0 px-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <img
            key={idx}
            src={slide.image}
            alt={`${slide.brand} ${slide.model}`}
            width={580}
            height={435}
            fetchPriority="high"
            decoding="async"
            className={phase === 'out' ? 'hero-img-out' : 'hero-img-in'}
            style={{
              width: '90%',
              height: 'auto',
              aspectRatio: '580 / 435',
              maxWidth: 580,
              maxHeight: '52svh',
              objectFit: 'contain',
              objectPosition: 'center',
              display: 'block',
              margin: '0 auto',
            }}
          />

          {/* Selector de modelos */}
          <div className="flex justify-center" style={{ marginTop: 28, gap: 28, animation: 'fadeIn 0.4s both', animationDelay: '600ms' }}>
            {SLIDES.map((s, i) => (
              <button
                key={s.model}
                onClick={() => i !== idx && goTo(i)}
                style={{
                  fontFamily: T.body,
                  fontSize: 13,
                  cursor: 'pointer',
                  paddingBottom: 4,
                  color: i === idx ? '#000' : '#bbb',
                  fontWeight: i === idx ? 600 : 400,
                  borderBottom: i === idx ? '2px solid #000' : '2px solid transparent',
                  transition: 'color 0.2s',
                }}
              >
                {s.brand}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── FRANJA INFERIOR — señales de confianza ── */}
      <div
        className="hidden lg:flex absolute bottom-0 left-0 right-0 items-center"
        style={{ borderTop: `1px solid #f0f0f0`, padding: '16px 80px', gap: 40 }}
      >
        {['19 sucursales', '6 marcas oficiales', 'Crédito en 24h'].map((item, i) => (
          <span key={item} className="flex items-center" style={{ gap: 40 }}>
            {i > 0 && <span style={{ width: 1, height: 14, background: '#e0e0e0', marginRight: 40 }} />}
            <span style={{ fontSize: 12, color: '#aaa' }}>{item}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
