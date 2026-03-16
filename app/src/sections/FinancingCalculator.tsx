import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getWhatsAppUrl } from '@/lib/config';

interface FinancingCalculatorProps {
  initialPrice?: number;
  compact?: boolean;
}

const MONTHLY_RATE = 0.018; // 1.8% monthly (~24% annual) — typical Colombian rate

const TERMS = [12, 24, 36, 48, 60];

const INITIAL_OPTIONS = [10, 20, 30, 40, 50]; // % of price

function calcMonthlyPayment(principal: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return principal / months;
  const r = monthlyRate;
  const n = months;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function formatCOP(value: number) {
  return '$' + new Intl.NumberFormat('es-CO').format(Math.round(value));
}

export default function FinancingCalculator({ initialPrice = 8000000, compact = false }: FinancingCalculatorProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const [price, setPrice] = useState(initialPrice);
  const [initialPct, setInitialPct] = useState(20);
  const [term, setTerm] = useState(36);
  const [rate, setRate] = useState(MONTHLY_RATE * 100); // stored as percent

  const results = useMemo(() => {
    const initial = price * (initialPct / 100);
    const principal = price - initial;
    const r = rate / 100;
    const monthly = calcMonthlyPayment(principal, r, term);
    const total = monthly * term + initial;
    const totalInterest = total - price;
    return { initial, principal, monthly, total, totalInterest };
  }, [price, initialPct, term, rate]);

  const whatsappMsg = `Hola, me interesa saber más sobre el financiamiento de una moto de ${formatCOP(price)}. Con cuota inicial del ${initialPct}% a ${term} meses, la cuota sería de ${formatCOP(results.monthly)}/mes. ¿Pueden ayudarme?`;

  if (compact) {
    // Versión compacta para usar dentro de MotorcyclePage
    return (
      <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.06] space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5 text-ibiza-red" />
          <h4 className="font-display font-bold text-white">Calcula tu cuota</h4>
        </div>

        {/* Initial percent */}
        <div>
          <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2 block">
            Cuota inicial: <span className="text-white">{initialPct}% — {formatCOP(results.initial)}</span>
          </label>
          <input
            type="range" min={10} max={50} step={5}
            value={initialPct}
            onChange={e => setInitialPct(Number(e.target.value))}
            className="w-full accent-ibiza-red"
          />
          <div className="flex justify-between text-[10px] text-white/20 mt-1">
            <span>10%</span><span>30%</span><span>50%</span>
          </div>
        </div>

        {/* Term */}
        <div>
          <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2 block">Plazo</label>
          <div className="flex gap-2 flex-wrap">
            {TERMS.map(t => (
              <button
                key={t}
                onClick={() => setTerm(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${term === t ? 'bg-ibiza-red text-white' : 'bg-white/5 text-white/40 hover:text-white/70'}`}
              >
                {t}m
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="bg-ibiza-red/10 border border-ibiza-red/20 rounded-xl p-4 text-center">
          <p className="text-[10px] text-ibiza-red/70 font-bold tracking-widest uppercase mb-1">Cuota mensual estimada</p>
          <p className="font-display font-black text-3xl text-white">{formatCOP(results.monthly)}</p>
          <p className="text-[10px] text-gray-500 mt-1">Total a pagar: {formatCOP(results.total)}</p>
        </div>

        <a href={getWhatsAppUrl(whatsappMsg)} target="_blank" rel="noopener noreferrer">
          <Button className="w-full bg-ibiza-red hover:bg-ibiza-red/90 text-white font-display font-bold rounded-xl h-11 group">
            Solicitar financiamiento
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </a>
        <p className="text-[10px] text-gray-600 text-center">*Cálculo estimado. Tasa real definida por entidad financiera.</p>
      </div>
    );
  }

  // Full section version
  return (
    <section ref={ref} className="py-24 bg-ibiza-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-ibiza-red/5 rounded-full blur-[150px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-ibiza-gold/5 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-ibiza-red flex items-center justify-center">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <p className="text-ibiza-red font-display font-semibold text-sm tracking-widest uppercase">
              Financiamiento
            </p>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            CALCULA TU <span className="text-ibiza-red">CUOTA</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Simula el financiamiento de tu moto ideal. Ajusta la cuota inicial y el plazo para encontrar la opción perfecta para ti.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Left: Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-white/[0.02] rounded-3xl p-8 border border-white/[0.05] space-y-8"
          >
            {/* Price input */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3 block">
                Precio de la moto
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ibiza-gold font-bold text-sm">$</span>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(Math.max(1000000, Number(e.target.value)))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white rounded-xl pl-8 pr-4 py-3.5 font-display font-bold text-lg focus:border-ibiza-red outline-none transition-colors"
                  step={500000}
                  min={1000000}
                />
              </div>
              <input
                type="range"
                min={1000000} max={20000000} step={500000}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full mt-3 accent-ibiza-red"
              />
              <div className="flex justify-between text-[10px] text-white/20 mt-1">
                <span>$1M</span><span>$10M</span><span>$20M</span>
              </div>
            </div>

            {/* Initial payment */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3 block">
                Cuota inicial: <span className="text-white">{initialPct}% — {formatCOP(results.initial)}</span>
              </label>
              <div className="flex gap-2 flex-wrap mb-3">
                {INITIAL_OPTIONS.map(pct => (
                  <button
                    key={pct}
                    onClick={() => setInitialPct(pct)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${initialPct === pct ? 'bg-ibiza-red text-white shadow-[0_0_12px_rgba(227,25,55,0.3)]' : 'bg-white/[0.04] text-white/40 border border-white/[0.08] hover:text-white/70'}`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <input
                type="range" min={10} max={50} step={5}
                value={initialPct}
                onChange={e => setInitialPct(Number(e.target.value))}
                className="w-full accent-ibiza-red"
              />
            </div>

            {/* Term */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3 block">
                Plazo de financiamiento
              </label>
              <div className="grid grid-cols-5 gap-2">
                {TERMS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTerm(t)}
                    className={`py-3 rounded-xl text-sm font-bold transition-all flex flex-col items-center ${term === t ? 'bg-ibiza-red text-white shadow-[0_0_12px_rgba(227,25,55,0.3)]' : 'bg-white/[0.04] text-white/40 border border-white/[0.08] hover:text-white/70'}`}
                  >
                    <span className="text-base">{t}</span>
                    <span className="text-[9px] tracking-wider">meses</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interest rate */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3 block">
                Tasa mensual estimada: <span className="text-white">{rate.toFixed(1)}%</span>
              </label>
              <input
                type="range" min={0.5} max={3.5} step={0.1}
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
                className="w-full accent-ibiza-red"
              />
              <div className="flex justify-between text-[10px] text-white/20 mt-1">
                <span>0.5% (mín)</span><span>1.8% (típica)</span><span>3.5% (máx)</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Main result card */}
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-ibiza-red to-ibiza-gold opacity-90" />
              <div className="relative p-8 text-center text-white">
                <p className="text-white/70 text-xs font-bold tracking-[0.2em] uppercase mb-2">Tu cuota mensual sería</p>
                <motion.p
                  key={results.monthly}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-display font-black text-5xl md:text-6xl leading-none mb-3"
                >
                  {formatCOP(results.monthly)}
                </motion.p>
                <p className="text-white/60 text-sm">
                  por {term} meses
                </p>
              </div>
            </div>

            {/* Detail cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <DollarSign className="w-5 h-5" />, label: 'Cuota inicial', value: formatCOP(results.initial), sub: `${initialPct}% del precio` },
                { icon: <TrendingDown className="w-5 h-5" />, label: 'Monto a financiar', value: formatCOP(results.principal), sub: 'Saldo pendiente' },
                { icon: <Calendar className="w-5 h-5" />, label: 'Total a pagar', value: formatCOP(results.total), sub: `En ${term} cuotas` },
                { icon: <Calculator className="w-5 h-5" />, label: 'Total en intereses', value: formatCOP(results.totalInterest), sub: `Tasa ${rate.toFixed(1)}%/mes` },
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.02] rounded-2xl p-5 border border-white/[0.05]">
                  <div className="w-9 h-9 rounded-xl bg-ibiza-red/10 flex items-center justify-center text-ibiza-red mb-3">
                    {item.icon}
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">{item.label}</p>
                  <p className="font-display font-bold text-white text-lg leading-tight">{item.value}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a href={getWhatsAppUrl(whatsappMsg)} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-ibiza-red hover:bg-ibiza-red/90 text-white font-display font-bold rounded-2xl h-14 text-base group mt-2">
                Solicitar financiamiento real
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <p className="text-[11px] text-gray-600 text-center">
              *Cálculo orientativo. La tasa y condiciones finales las define la entidad financiera. SOAT y matrícula no incluidos.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
