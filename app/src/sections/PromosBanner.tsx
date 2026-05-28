import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMotorcycles } from '@/hooks/useMotorcycles';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getQuoteWhatsApp } from '@/lib/config';
import { useNavigate } from 'react-router-dom';

// ─── Tokens (match the hero) ──────────────────────────────────────────────
const T = {
  text: '#000000',
  muted: '#999999',
  border: '#e8e8e8',
  hairline: '#f0f0f0',
  pill: '#f5f5f5',
  red: '#E31937',
  display: "'Bebas Neue', sans-serif",
  body: "'DM Sans', sans-serif",
};

// stagger helper
const anim = (delayMs: number, dur = 0.5, name = 'fadeUp') =>
  ({ animation: `${name} ${dur}s both`, animationDelay: `${delayMs}ms` } as React.CSSProperties);

// Promos data — edit here to change the featured deal
const promos = [
  {
    motorcycleId: '5',
    discountPercent: 12,
    badge: 'OFERTA DEL MES',
    tagline: 'Precio de lanzamiento — solo hasta agotar existencias',
    extraPerks: ['SOAT incluido', 'Kit de mantenimiento gratis', 'Matrícula bonificada'],
  },
  {
    motorcycleId: '3',
    discountPercent: 8,
    badge: 'MEJOR PRECIO',
    tagline: 'La moto de trabajo más económica del Eje Cafetero',
    extraPerks: ['Garantía extendida 3 años', 'Primer mantenimiento gratis'],
  },
  {
    motorcycleId: '2',
    discountPercent: 10,
    badge: 'HOT DEAL',
    tagline: 'Financiación 0% interés los primeros 3 meses',
    extraPerks: ['Casco de regalo', '0% interés 3 meses', 'Entrega inmediata'],
  },
];

// Countdown to end of month
function useCountdown() {
  const getSecondsLeft = () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
    return Math.floor((endOfMonth.getTime() - now.getTime()) / 1000);
  };

  const [seconds, setSeconds] = useState(getSecondsLeft);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(getSecondsLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return { d, h, m, s };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[52px]">
      <div
        className="w-12 h-12 flex items-center justify-center rounded-lg"
        style={{ background: T.pill, border: `1px solid ${T.border}` }}
      >
        <span
          className="leading-none"
          style={{ fontFamily: T.display, fontSize: 26, color: T.text, letterSpacing: '0.02em' }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span
        className="mt-1 uppercase"
        style={{ fontSize: 9, letterSpacing: '0.15em', color: T.muted, fontWeight: 600 }}
      >
        {label}
      </span>
    </div>
  );
}

export default function PromosBanner() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { motorcycles } = useMotorcycles();
  const { d, h, m, s } = useCountdown();
  const navigate = useNavigate();
  const [activePromo, setActivePromo] = useState(0);

  const promo = promos[activePromo];
  const moto = motorcycles.find(mo => mo.id === promo.motorcycleId);

  if (!moto) return null;

  const discountedPrice = Math.round(moto.price * (1 - promo.discountPercent / 100));
  const savings = moto.price - discountedPrice;

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20 overflow-hidden bg-white"
      style={{ fontFamily: T.body, color: T.text }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="uppercase"
            style={{ fontSize: 11, letterSpacing: '0.15em', color: T.muted, fontWeight: 600 }}
          >
            Promociones
          </span>
          <h2
            style={{
              fontFamily: T.display,
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.5px',
              color: T.text,
              marginTop: 6,
            }}
          >
            Ofertas del mes
          </h2>
        </motion.div>

        {/* Promo tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {promos.map((p, i) => {
            const mo = motorcycles.find(mo => mo.id === p.motorcycleId);
            const active = activePromo === i;
            return (
              <button
                key={i}
                onClick={() => setActivePromo(i)}
                className="transition-all duration-200 active:scale-95"
                style={{
                  ...anim(60 + i * 70),
                  fontFamily: T.body,
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 8,
                  padding: '8px 16px',
                  background: active ? T.text : '#fff',
                  color: active ? '#fff' : T.muted,
                  border: active ? '1px solid #000' : `1px solid ${T.border}`,
                }}
              >
                {mo?.brand} {mo?.model}
              </button>
            );
          })}
        </div>

        {/* Main promo card */}
        <motion.div
          key={activePromo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-white"
          style={{ borderRadius: 16, border: `1px solid ${T.border}` }}
        >
          {/* Solid red hairline accent (flattened from old gradient) */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: T.red }} />

          <div className="relative grid lg:grid-cols-2 gap-0 min-h-[400px]">

            {/* Left: Info */}
            <div className="p-8 md:p-12 flex flex-col justify-between">
              {/* Badges */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="uppercase"
                  style={{
                    ...anim(80),
                    background: T.red,
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    padding: '6px 12px',
                    borderRadius: 20,
                  }}
                >
                  {promo.badge}
                </span>
                <span
                  className="uppercase"
                  style={{
                    ...anim(140),
                    background: T.pill,
                    color: '#555',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    padding: '6px 12px',
                    borderRadius: 20,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  -{promo.discountPercent}% off
                </span>
              </div>

              <div>
                <p
                  className="uppercase"
                  style={{ ...anim(180), fontSize: 11, letterSpacing: '0.15em', color: T.muted, fontWeight: 600, marginBottom: 6 }}
                >
                  {moto.brand}
                </p>
                <h3
                  style={{
                    ...anim(220, 0.55),
                    fontFamily: T.display,
                    fontSize: 'clamp(2.5rem, 5vw, 3.6rem)',
                    lineHeight: 0.95,
                    letterSpacing: '-0.5px',
                    color: T.text,
                    marginBottom: 12,
                  }}
                >
                  {moto.model}
                </h3>
                <p style={{ ...anim(280), fontSize: 14, color: '#666', lineHeight: 1.6, maxWidth: 360, marginBottom: 24 }}>
                  {promo.tagline}
                </p>

                {/* Perks */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {promo.extraPerks.map((perk, i) => (
                    <span
                      key={i}
                      className="flex items-center"
                      style={{
                        ...anim(330 + i * 60),
                        gap: 8,
                        fontSize: 12,
                        color: '#555',
                        background: T.pill,
                        border: `1px solid ${T.border}`,
                        padding: '6px 12px',
                        borderRadius: 8,
                      }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: 999, background: T.red, display: 'inline-block' }} />
                      {perk}
                    </span>
                  ))}
                </div>

                {/* Pricing */}
                <div className="flex items-end gap-4 mb-8" style={anim(520)}>
                  <div>
                    <p className="uppercase" style={{ fontSize: 10, letterSpacing: '0.2em', color: '#bbb', marginBottom: 4 }}>
                      Precio especial
                    </p>
                    <p style={{ fontSize: 36, fontWeight: 700, color: T.text, lineHeight: 1.05 }}>
                      ${new Intl.NumberFormat('es-CO').format(discountedPrice)}
                    </p>
                  </div>
                  <div className="pb-1">
                    <p style={{ color: '#bbb', textDecoration: 'line-through', fontSize: 17 }}>
                      ${new Intl.NumberFormat('es-CO').format(moto.price)}
                    </p>
                    <p style={{ color: T.red, fontSize: 12, fontWeight: 700 }}>
                      Ahorras ${new Intl.NumberFormat('es-CO').format(savings)}
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3" style={anim(580)}>
                  <Button
                    onClick={() => navigate(`/moto/${moto.id}`)}
                    className="group h-12 px-6 rounded-lg font-semibold text-white transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                    style={{ background: T.red, fontFamily: T.body }}
                  >
                    Ver oferta
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <a
                    href={getQuoteWhatsApp(moto.brand, moto.model)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="h-12 px-6 rounded-lg font-semibold transition-colors duration-200 hover:bg-black hover:text-white"
                      style={{ background: 'transparent', color: T.text, border: '1px solid #d0d0d0', fontFamily: T.body }}
                    >
                      Cotizar
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Image + Countdown */}
            <div
              className="relative flex flex-col items-center justify-center p-8 lg:p-12"
              style={{ background: T.pill }}
            >
              {/* Motorcycle image — float motion preserved */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full max-w-sm mb-8 flex justify-center"
              >
                {moto.images?.[0] && (
                  <img
                    src={moto.images[0]}
                    alt={moto.model}
                    loading="lazy"
                    decoding="async"
                    className="max-h-56 max-w-full object-contain relative z-10"
                    style={{ filter: 'drop-shadow(0 22px 30px rgba(0,0,0,0.18))' }}
                  />
                )}
              </motion.div>

              {/* Countdown */}
              <div className="text-center">
                <div className="mb-3">
                  <span
                    className="uppercase"
                    style={{ fontSize: 11, letterSpacing: '0.15em', color: T.muted, fontWeight: 600 }}
                  >
                    Oferta termina en
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CountdownUnit value={d} label="días" />
                  <span style={{ color: '#ccc', fontWeight: 600, fontSize: 20, marginBottom: 16 }}>:</span>
                  <CountdownUnit value={h} label="horas" />
                  <span style={{ color: '#ccc', fontWeight: 600, fontSize: 20, marginBottom: 16 }}>:</span>
                  <CountdownUnit value={m} label="min" />
                  <span style={{ color: '#ccc', fontWeight: 600, fontSize: 20, marginBottom: 16 }}>:</span>
                  <CountdownUnit value={s} label="seg" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
