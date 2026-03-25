import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingDown, DollarSign, Calendar, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getWhatsAppUrl } from '@/lib/config';

interface FinancingCalculatorProps {
  initialPrice?: number;
  compact?: boolean;
}

// ─── Financieras data (tasas y comisiones oficiales 2026) ─────────────────────
const FINANCIERAS = [
  {
    id: 'progreser',
    name: 'Progreser',
    shortName: 'PROGRESER',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Escudo_de_Colombia.svg/60px-Escudo_de_Colombia.svg.png',
    color: '#1a5276',
    bg: '#eaf0fb',
    monthlyRate: 1.83,
    commission: 0,
    maxMonths: 60,
    badge: 'Sin comisión',
    badgeColor: '#16a34a',
    description: 'Programa del Gobierno Nacional',
  },
  {
    id: 'bancobogota',
    name: 'Banco de Bogotá',
    shortName: 'BCO. BOGOTÁ',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Banco_de_Bogot%C3%A1_logo.svg/200px-Banco_de_Bogot%C3%A1_logo.svg.png',
    color: '#c0392b',
    bg: '#fdf0ef',
    monthlyRate: 1.26,
    commission: 0,
    maxMonths: 60,
    badge: 'Tasa más baja',
    badgeColor: '#d97706',
    description: 'La tasa más competitiva del mercado',
  },
  {
    id: 'sufi',
    name: 'SUFI',
    shortName: 'SUFI',
    logo: null,
    color: '#f59e0b',
    bg: '#fffbeb',
    monthlyRate: 1.73,
    commission: 0,
    maxMonths: 48,
    badge: 'Sin comisión',
    badgeColor: '#16a34a',
    description: 'Soluciones de financiamiento Bancolombia',
  },
  {
    id: 'brilla',
    name: 'Brilla',
    shortName: 'BRILLA',
    logo: null,
    color: '#e87722',
    bg: '#fff7ed',
    monthlyRate: 1.81,
    commission: 0.93,
    maxMonths: 48,
    badge: 'Grupo EPM',
    badgeColor: '#6366f1',
    description: 'Financiamiento del Grupo EPM',
  },
  {
    id: 'addi',
    name: 'ADDI',
    shortName: 'ADDI',
    logo: 'https://cdn.addi.com/web/addi-logo.svg',
    color: '#7c3aed',
    bg: '#f5f3ff',
    monthlyRate: 1.83,
    commission: 3,
    maxMonths: 36,
    badge: 'Aprobación rápida',
    badgeColor: '#7c3aed',
    description: 'Crédito digital aprobado en minutos',
  },
  {
    id: 'venfi',
    name: 'Venfi',
    shortName: 'VENFI',
    logo: null,
    color: '#0891b2',
    bg: '#ecfeff',
    monthlyRate: 1.80,
    commission: 3,
    maxMonths: 36,
    badge: null,
    badgeColor: '#0891b2',
    description: 'Financiamiento especializado en motos',
  },
  {
    id: 'sistecredito',
    name: 'Sistecredito',
    shortName: 'SISTECREDITO',
    logo: null,
    color: '#15803d',
    bg: '#f0fdf4',
    monthlyRate: 1.90,
    commission: 10,
    maxMonths: 36,
    badge: null,
    badgeColor: '#15803d',
    description: 'Red de crédito a nivel nacional',
  },
  {
    id: 'crediorbe',
    name: 'CrediorBe',
    shortName: 'CREDIORBE',
    logo: null,
    color: '#1e40af',
    bg: '#eff6ff',
    monthlyRate: 3.72,
    commission: 0,
    maxMonths: 24,
    badge: null,
    badgeColor: '#1e40af',
    description: 'Banco de Occidente — crédito de consumo',
  },
] as const;

type Financiera = typeof FINANCIERAS[number];

const TERMS = [12, 24, 36, 48, 60];
const INITIAL_OPTIONS = [10, 20, 30, 40, 50];

function calcMonthlyPayment(principal: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return principal / months;
  const r = monthlyRate / 100;
  const n = months;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function formatCOP(value: number) {
  return '$' + new Intl.NumberFormat('es-CO').format(Math.round(value));
}

// ─── Logo component (imagen o texto estilizado) ───────────────────────────────
function FinancieraLogo({ fin, size = 'md' }: { fin: Financiera; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 20 : 28;
  if (fin.logo) {
    return (
      <img
        src={fin.logo}
        alt={fin.name}
        style={{ height: h, width: 'auto', maxWidth: size === 'sm' ? 70 : 90, objectFit: 'contain' }}
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
    );
  }
  return (
    <span style={{
      fontWeight: 900,
      fontSize: size === 'sm' ? 11 : 13,
      letterSpacing: '0.04em',
      color: fin.color,
      lineHeight: 1,
    }}>
      {fin.shortName}
    </span>
  );
}

// ─── Compact version (inside MotorcyclePage) ──────────────────────────────────
export default function FinancingCalculator({ initialPrice = 8000000, compact = false }: FinancingCalculatorProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const [price, setPrice] = useState(initialPrice);
  const [initialPct, setInitialPct] = useState(20);
  const [term, setTerm] = useState(36);
  const [selectedFin, setSelectedFin] = useState<Financiera>(FINANCIERAS[0]);
  const [showInfo, setShowInfo] = useState(false);

  const results = useMemo(() => {
    const initial = price * (initialPct / 100);
    const principal = price - initial;
    const commissionAmt = principal * (selectedFin.commission / 100);
    const monthly = calcMonthlyPayment(principal, selectedFin.monthlyRate, term);
    const totalCuotas = monthly * term;
    const total = totalCuotas + initial + commissionAmt;
    const totalInterest = total - price;
    return { initial, principal, commissionAmt, monthly, totalCuotas, total, totalInterest };
  }, [price, initialPct, term, selectedFin]);

  const whatsappMsg = `Hola, me interesa financiar una moto de ${formatCOP(price)} con ${selectedFin.name} (tasa ${selectedFin.monthlyRate}%/mes). Cuota inicial ${initialPct}% a ${term} meses → cuota de ${formatCOP(results.monthly)}/mes. ¿Me pueden asesorar?`;

  // ── Compact ──────────────────────────────────────────────────────────────────
  if (compact) {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5 text-ibiza-red" />
          <h4 className="font-display font-bold text-gray-900">Calcula tu cuota</h4>
        </div>

        {/* Mini financiera selector */}
        <div>
          <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Financiera</p>
          <div className="flex flex-wrap gap-2">
            {FINANCIERAS.map(fin => (
              <button
                key={fin.id}
                onClick={() => setSelectedFin(fin)}
                className="px-3 py-1.5 rounded-lg border text-xs font-bold transition-all"
                style={{
                  borderColor: selectedFin.id === fin.id ? fin.color : '#e5e7eb',
                  background: selectedFin.id === fin.id ? fin.bg : '#fff',
                  color: selectedFin.id === fin.id ? fin.color : '#6b7280',
                }}
              >
                {fin.shortName}
              </button>
            ))}
          </div>
          {selectedFin.commission > 0 && (
            <p className="text-[10px] text-amber-600 mt-1.5">
              ⚠️ Comisión {selectedFin.commission}% sobre el monto financiado
            </p>
          )}
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2 block">
            Cuota inicial: <span className="text-gray-900">{initialPct}% — {formatCOP(results.initial)}</span>
          </label>
          <input type="range" min={10} max={50} step={5} value={initialPct}
            onChange={e => setInitialPct(Number(e.target.value))}
            className="w-full accent-ibiza-red" />
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2 block">Plazo</label>
          <div className="flex gap-2 flex-wrap">
            {TERMS.filter(t => t <= selectedFin.maxMonths).map(t => (
              <button key={t} onClick={() => setTerm(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${term === t ? 'bg-ibiza-red text-white' : 'bg-gray-200 text-gray-500 hover:text-gray-700'}`}>
                {t}m
              </button>
            ))}
          </div>
        </div>

        <div className="bg-ibiza-red/10 border border-ibiza-red/20 rounded-xl p-4 text-center">
          <p className="text-[10px] text-ibiza-red/70 font-bold tracking-widest uppercase mb-1">Cuota mensual estimada</p>
          <p className="font-display font-black text-3xl text-gray-900">{formatCOP(results.monthly)}</p>
          <p className="text-[10px] text-gray-500 mt-1">Total a pagar: {formatCOP(results.total)}</p>
          {results.commissionAmt > 0 && (
            <p className="text-[10px] text-amber-600 mt-0.5">Incl. comisión: {formatCOP(results.commissionAmt)}</p>
          )}
        </div>

        <a href={getWhatsAppUrl(whatsappMsg)} target="_blank" rel="noopener noreferrer">
          <Button className="w-full bg-ibiza-red hover:bg-ibiza-red/90 text-white font-display font-bold rounded-xl h-11 group">
            Solicitar financiamiento
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </a>
      </div>
    );
  }

  // ── Full section ──────────────────────────────────────────────────────────────
  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-ibiza-red/5 rounded-full blur-[150px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-ibiza-gold/5 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <motion.div className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }} animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-ibiza-red flex items-center justify-center">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <p className="text-ibiza-red font-display font-semibold text-sm tracking-widest uppercase">
              Financiamiento
            </p>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900 mb-4">
            CALCULA TU <span className="text-ibiza-red">CUOTA</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Elige tu entidad financiera, ajusta la cuota inicial y el plazo. Las tasas son las vigentes 2026.
          </p>
        </motion.div>

        {/* ── Financiera selector ── */}
        <motion.div className="mb-10"
          initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">
              Elige tu financiera
            </p>
            <button onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
              <Info className="w-3.5 h-3.5" />
              ¿Cómo funciona?
            </button>
          </div>

          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700 leading-relaxed">
                Las tasas son <strong>mensuales</strong>. La comisión (si aplica) es un cobro único sobre el monto
                financiado, pagadero al inicio. El cálculo es orientativo — las condiciones exactas las define la entidad financiera al momento de la solicitud.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {FINANCIERAS.map((fin, i) => {
              const isSelected = selectedFin.id === fin.id;
              return (
                <motion.button
                  key={fin.id}
                  onClick={() => {
                    setSelectedFin(fin);
                    if (term > fin.maxMonths) setTerm(fin.maxMonths as typeof term);
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
                  className="relative flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden group"
                  style={{
                    borderColor: isSelected ? fin.color : '#e5e7eb',
                    background: isSelected ? fin.bg : '#fafafa',
                    transform: isSelected ? 'translateY(-3px)' : 'translateY(0)',
                    boxShadow: isSelected ? `0 8px 24px ${fin.color}25` : '0 1px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Badge */}
                  {fin.badge && (
                    <span className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white leading-tight"
                      style={{ background: fin.badgeColor }}>
                      {fin.badge}
                    </span>
                  )}

                  {/* Checkmark */}
                  {isSelected && (
                    <CheckCircle2 className="absolute top-2 left-2 w-3.5 h-3.5"
                      style={{ color: fin.color }} />
                  )}

                  {/* Logo / name */}
                  <div className="flex items-center justify-center w-full pt-3 pb-2 min-h-[36px]">
                    <FinancieraLogo fin={fin} size="md" />
                  </div>

                  {/* Stats */}
                  <div className="w-full mt-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-400 uppercase font-semibold">Tasa</span>
                      <span className="text-[11px] font-black" style={{ color: fin.color }}>
                        {fin.monthlyRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-400 uppercase font-semibold">Comisión</span>
                      <span className={`text-[10px] font-bold ${fin.commission === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                        {fin.commission === 0 ? '0%' : `${fin.commission}%`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-400 uppercase font-semibold">Plazo</span>
                      <span className="text-[10px] font-bold text-gray-600">
                        {fin.maxMonths}m
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Selected financiera banner */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFin.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3.5 rounded-xl border"
              style={{ background: selectedFin.bg, borderColor: `${selectedFin.color}30` }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: selectedFin.color }} />
                <span className="font-bold text-sm" style={{ color: selectedFin.color }}>
                  {selectedFin.name}
                </span>
                <span className="text-gray-400 text-xs">—</span>
                <span className="text-gray-500 text-xs">{selectedFin.description}</span>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <div className="text-center">
                  <p className="text-[9px] text-gray-400 font-semibold uppercase">Tasa mensual</p>
                  <p className="font-black text-lg leading-tight" style={{ color: selectedFin.color }}>
                    {selectedFin.monthlyRate}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-400 font-semibold uppercase">Comisión</p>
                  <p className={`font-black text-lg leading-tight ${selectedFin.commission === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                    {selectedFin.commission === 0 ? 'Sin comisión' : `${selectedFin.commission}%`}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-400 font-semibold uppercase">Plazo máx.</p>
                  <p className="font-black text-lg leading-tight text-gray-800">
                    {selectedFin.maxMonths} meses
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Calculator grid ── */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Left: Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-gray-50 rounded-3xl p-8 border border-gray-200 space-y-8">

            {/* Price */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3 block">
                Precio de la moto
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ibiza-gold font-bold text-sm">$</span>
                <input type="number" value={price}
                  onChange={e => setPrice(Math.max(1000000, Number(e.target.value)))}
                  className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-8 pr-4 py-3.5 font-display font-bold text-lg focus:border-ibiza-red outline-none transition-colors"
                  step={500000} min={1000000} />
              </div>
              <input type="range" min={1000000} max={25000000} step={500000} value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full mt-3 accent-ibiza-red" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>$1M</span><span>$12.5M</span><span>$25M</span>
              </div>
            </div>

            {/* Initial % */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3 block">
                Cuota inicial: <span className="text-gray-900">{initialPct}% — {formatCOP(results.initial)}</span>
              </label>
              <div className="flex gap-2 flex-wrap mb-3">
                {INITIAL_OPTIONS.map(pct => (
                  <button key={pct} onClick={() => setInitialPct(pct)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${initialPct === pct ? 'bg-ibiza-red text-white shadow-[0_0_12px_rgba(227,25,55,0.3)]' : 'bg-gray-100 text-gray-500 border border-gray-200 hover:text-gray-700'}`}>
                    {pct}%
                  </button>
                ))}
              </div>
              <input type="range" min={10} max={50} step={5} value={initialPct}
                onChange={e => setInitialPct(Number(e.target.value))}
                className="w-full accent-ibiza-red" />
            </div>

            {/* Term */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3 block">
                Plazo de financiamiento
              </label>
              <div className="grid grid-cols-5 gap-2">
                {TERMS.map(t => {
                  const disabled = t > selectedFin.maxMonths;
                  const active = term === t && !disabled;
                  return (
                    <button key={t}
                      onClick={() => !disabled && setTerm(t)}
                      disabled={disabled}
                      className={`py-3 rounded-xl text-sm font-bold transition-all flex flex-col items-center ${active ? 'bg-ibiza-red text-white shadow-[0_0_12px_rgba(227,25,55,0.3)]' : disabled ? 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed' : 'bg-gray-100 text-gray-500 border border-gray-200 hover:text-gray-700'}`}>
                      <span className="text-base">{t}</span>
                      <span className="text-[9px] tracking-wider">meses</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                Plazo máximo con {selectedFin.name}: {selectedFin.maxMonths} meses
              </p>
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-4">

            {/* Main result card */}
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0" style={{
                background: `linear-gradient(135deg, ${selectedFin.color} 0%, ${selectedFin.color}cc 100%)`,
              }} />
              <div className="relative p-8 text-center text-white">
                <div className="flex items-center justify-center gap-2 mb-3 opacity-80">
                  <FinancieraLogo fin={selectedFin} size="sm" />
                </div>
                <p className="text-white/70 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                  Tu cuota mensual sería
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${results.monthly}-${selectedFin.id}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="font-display font-black text-5xl md:text-6xl leading-none mb-2">
                    {formatCOP(results.monthly)}
                  </motion.p>
                </AnimatePresence>
                <p className="text-white/60 text-sm">
                  por {term} meses · tasa {selectedFin.monthlyRate}%/mes
                </p>
                {results.commissionAmt > 0 && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-white/15 rounded-full px-4 py-1.5">
                    <span className="text-white/80 text-xs">Comisión única:</span>
                    <span className="text-white font-bold text-xs">{formatCOP(results.commissionAmt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Detail cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: <DollarSign className="w-5 h-5" />,
                  label: 'Cuota inicial',
                  value: formatCOP(results.initial),
                  sub: `${initialPct}% del precio`,
                },
                {
                  icon: <TrendingDown className="w-5 h-5" />,
                  label: 'Monto a financiar',
                  value: formatCOP(results.principal),
                  sub: 'Saldo pendiente',
                },
                {
                  icon: <Calendar className="w-5 h-5" />,
                  label: 'Total en cuotas',
                  value: formatCOP(results.totalCuotas),
                  sub: `En ${term} cuotas mensuales`,
                },
                {
                  icon: <Calculator className="w-5 h-5" />,
                  label: 'Costo total',
                  value: formatCOP(results.total),
                  sub: `Incl. inicial${results.commissionAmt > 0 ? ' y comisión' : ''}`,
                },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${selectedFin.color}15`, color: selectedFin.color }}>
                    {item.icon}
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">{item.label}</p>
                  <p className="font-display font-bold text-gray-900 text-lg leading-tight">{item.value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a href={getWhatsAppUrl(whatsappMsg)} target="_blank" rel="noopener noreferrer">
              <Button className="w-full text-white font-display font-bold rounded-2xl h-14 text-base group mt-2 transition-all"
                style={{ background: selectedFin.color }}>
                Solicitar con {selectedFin.name}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <p className="text-[11px] text-gray-500 text-center">
              *Cálculo orientativo. Tasas vigentes 2026. Condiciones finales sujetas a aprobación de la entidad financiera. SOAT y matrícula no incluidos.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
