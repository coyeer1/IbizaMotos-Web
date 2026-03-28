import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Clock, ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMotorcycles } from '@/hooks/useMotorcycles';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getQuoteWhatsApp } from '@/lib/config';
import { useNavigate } from 'react-router-dom';

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
    badge: 'HOT DEAL 🔥',
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
      <div className="bg-gray-100 backdrop-blur-md rounded-xl w-12 h-12 flex items-center justify-center border border-gray-200">
        <span className="font-display font-black text-xl text-gray-900 leading-none">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[9px] text-gray-500 font-bold tracking-widest mt-1 uppercase">{label}</span>
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
    <section ref={ref} className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Flame className="w-5 h-5 text-ibiza-red" />
          <span className="text-ibiza-red font-display font-semibold text-sm tracking-widest uppercase">
            Promociones
          </span>
        </motion.div>

        {/* Promo tabs */}
        <div className="flex gap-2 mb-6">
          {promos.map((p, i) => {
            const mo = motorcycles.find(mo => mo.id === p.motorcycleId);
            return (
              <button
                key={i}
                onClick={() => setActivePromo(i)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activePromo === i
                    ? 'bg-ibiza-red text-white shadow-[0_0_15px_rgba(227,25,55,0.3)]'
                    : 'bg-gray-50 text-gray-400 border border-gray-100 hover:text-gray-600'
                }`}
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
          className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-sm bg-white"
        >
          {/* Subtle red accent top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ibiza-red via-red-400 to-ibiza-red" />

          <div className="relative grid lg:grid-cols-2 gap-0 min-h-[400px]">

            {/* Left: Info */}
            <div className="p-8 md:p-12 flex flex-col justify-between">
              {/* Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-ibiza-red text-white text-[10px] font-black tracking-[0.2em] px-3 py-1.5 rounded-full uppercase">
                  {promo.badge}
                </span>
                <span className="bg-amber-50 text-amber-600 text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-amber-200 uppercase">
                  -{promo.discountPercent}% off
                </span>
              </div>

              <div>
                <p className="text-ibiza-red font-display font-bold text-sm tracking-widest uppercase mb-2">
                  {moto.brand}
                </p>
                <h3 className="font-display font-black text-4xl md:text-5xl text-gray-900 leading-tight mb-3">
                  {moto.model}
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm">{promo.tagline}</p>

                {/* Perks */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {promo.extraPerks.map((perk, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg"
                    >
                      <Tag className="w-3 h-3 text-ibiza-red" />
                      {perk}
                    </span>
                  ))}
                </div>

                {/* Pricing */}
                <div className="flex items-end gap-4 mb-8">
                  <div>
                    <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">Precio especial</p>
                    <p className="font-display font-black text-4xl text-gray-900 leading-none">
                      ${new Intl.NumberFormat('es-CO').format(discountedPrice)}
                    </p>
                  </div>
                  <div className="pb-1">
                    <p className="text-gray-400 line-through text-lg">
                      ${new Intl.NumberFormat('es-CO').format(moto.price)}
                    </p>
                    <p className="text-ibiza-red text-xs font-bold">
                      Ahorras ${new Intl.NumberFormat('es-CO').format(savings)}
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate(`/moto/${moto.id}`)}
                    className="bg-ibiza-red hover:bg-ibiza-red/90 text-white font-display font-bold rounded-xl px-6 h-12 group"
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
                      className="border-gray-200 text-gray-700 hover:bg-gray-50 font-display font-bold rounded-xl px-6 h-12"
                    >
                      Cotizar
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Image + Countdown */}
            <div className="relative flex flex-col items-center justify-center p-8 lg:p-12">
              {/* Motorcycle image */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full max-w-sm mb-8 flex justify-center"
              >
                {/* Glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-8 bg-ibiza-red/10 blur-2xl rounded-full" />
                {moto.images?.[0] && (
                  <img
                    src={moto.images[0]}
                    alt={moto.model}
                    loading="lazy"
                    decoding="async"
                    className="max-h-56 max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative z-10"
                  />
                )}
              </motion.div>

              {/* Countdown */}
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-3">
                  <Clock className="w-4 h-4 text-ibiza-red" />
                  <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">
                    Oferta termina en
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CountdownUnit value={d} label="días" />
                  <span className="text-gray-400 font-bold text-xl mb-4">:</span>
                  <CountdownUnit value={h} label="horas" />
                  <span className="text-gray-400 font-bold text-xl mb-4">:</span>
                  <CountdownUnit value={m} label="min" />
                  <span className="text-gray-400 font-bold text-xl mb-4">:</span>
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
