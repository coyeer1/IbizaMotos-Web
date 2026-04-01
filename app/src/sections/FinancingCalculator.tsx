import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingDown, DollarSign, Calendar, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getWhatsAppUrl } from '@/lib/config';

interface FinancingCalculatorProps {
  initialPrice?: number;
  initialFinanciera?: string;
  compact?: boolean;
}

// ─── Financieras data ─────────────────────────────────────────────────────────
const FINANCIERAS = [
  {
    id: 'progreser',
    name: 'Progreser',
    shortName: 'PROGRESER',
    logo: '/financieras/progreser.png',
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
    logo: '/financieras/banco-bogota.png',
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
    logo: '/financieras/sufi.png',
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
    logo: '/financieras/brilla.png',
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
    logo: '/financieras/addi.jpg',
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
    logo: '/financieras/venfi.png',
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
    logo: '/financieras/sistecredito.png',
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
    logo: '/financieras/crediorbe.png',
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
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function formatCOP(value: number) {
  return '$' + new Intl.NumberFormat('es-CO').format(Math.round(value));
}

// ─── Tamaños normalizados por logo ───────────────────────────────────────────
//   Área visual objetivo ≈ 2800px² para todos.
//   Calculado como: dado el aspect ratio real, w×h ≈ 2800 con max-w 108, max-h 54.
//   Escala xs/sm/lg = factor sobre md.
// Dentro de la caja blanca 72px de alto.
// Max-height 52px para dejar padding arriba/abajo.
// Logos de texto (Sufi, Brilla) más contenidos; logos cuadrados llenan más.
// Caja blanca 72px alto. Logos de texto vívido reducidos al 55-65% del ancho.
// Logos corporativos/cuadrados pueden usar más altura.
const LOGO_SIZES: Record<string, { w: number; h: number }> = {
  progreser:    { w: 60,  h: 52  },
  bancobogota:  { w: 84,  h: 52  },
  sufi:         { w: 58,  h: 18  },  // reducido al máximo — texto vívido
  brilla:       { w: 56,  h: 20  },  // reducido al máximo — texto vívido
  addi:         { w: 68,  h: 48  },
  venfi:        { w: 80,  h: 32  },
  sistecredito: { w: 56,  h: 56  },
  crediorbe:    { w: 92,  h: 19  },
};

const SCALE: Record<string, number> = { xs: 0.55, sm: 0.75, md: 1, lg: 1.35 };

function FinancieraLogo({
  fin,
  size = 'md',
  inverted = false,
}: {
  fin: Financiera;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  inverted?: boolean;
}) {
  const base = LOGO_SIZES[fin.id] ?? { w: 90, h: 36 };
  const s = SCALE[size] ?? 1;
  const w = Math.round(base.w * s);
  const h = Math.round(base.h * s);

  return (
    <div style={{ width: w, height: h, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src={fin.logo}
        alt={fin.name}
        loading="lazy"
        decoding="async"
        style={{
          width:     '100%',
          height:    '100%',
          objectFit: 'contain',
          filter: inverted ? 'brightness(0) invert(1)' : undefined,
        }}
        onError={e => {
          const img = e.currentTarget as HTMLImageElement;
          img.style.display = 'none';
          const span = document.createElement('span');
          span.textContent = fin.shortName;
          span.style.cssText = `font-weight:900;font-size:${h * 0.42}px;color:${inverted ? '#fff' : fin.color};letter-spacing:0.05em`;
          img.parentNode?.appendChild(span);
        }}
      />
    </div>
  );
}

// ─── Compact (inside MotorcyclePage) ─────────────────────────────────────────
function CompactCalculator({ initialPrice }: { initialPrice: number }) {
  const [price] = useState(initialPrice);
  const [initialPct, setInitialPct] = useState(20);
  const [term, setTerm] = useState(36);
  const [selectedFin, setSelectedFin] = useState<Financiera>(FINANCIERAS[0]);

  const results = useMemo(() => {
    const initial = price * (initialPct / 100);
    const principal = price - initial;
    const commissionAmt = principal * (selectedFin.commission / 100);
    const monthly = calcMonthlyPayment(principal, selectedFin.monthlyRate, term);
    const total = monthly * term + initial + commissionAmt;
    return { initial, principal, commissionAmt, monthly, total };
  }, [price, initialPct, term, selectedFin]);

  const whatsappMsg = `Hola, me interesa financiar una moto de ${formatCOP(price)} con ${selectedFin.name} (tasa ${selectedFin.monthlyRate}%/mes). Cuota inicial ${initialPct}% a ${term} meses → cuota de ${formatCOP(results.monthly)}/mes. ¿Me pueden asesorar?`;

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <Calculator className="w-5 h-5 text-ibiza-red" />
        <h4 className="font-display font-bold text-gray-900">Calcula tu cuota</h4>
      </div>

      {/* Financiera pills */}
      <div>
        <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2.5">Financiera</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FINANCIERAS.map(fin => {
            const active = selectedFin.id === fin.id;
            return (
              <button
                key={fin.id}
                onClick={() => {
                  setSelectedFin(fin);
                  if (term > fin.maxMonths) setTerm(fin.maxMonths as typeof term);
                }}
                className="relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-200"
                style={{
                  borderColor: active ? fin.color : '#e5e7eb',
                  background: active ? fin.bg : '#fff',
                  boxShadow: active ? `0 4px 12px ${fin.color}20` : undefined,
                }}
              >
                {active && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: fin.color }}>
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="w-full flex items-center justify-center">
                  <FinancieraLogo fin={fin} size="xs" />
                </div>
              </button>
            );
          })}
        </div>
        {selectedFin.commission > 0 && (
          <p className="text-[10px] text-amber-600 mt-2">
            ⚠️ Comisión {selectedFin.commission}% sobre el monto financiado
          </p>
        )}
      </div>

      {/* Cuota inicial */}
      <div>
        <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2 block">
          Cuota inicial: <span className="text-gray-900">{initialPct}% — {formatCOP(results.initial)}</span>
        </label>
        <input type="range" min={10} max={50} step={5} value={initialPct}
          onChange={e => setInitialPct(Number(e.target.value))}
          className="w-full accent-ibiza-red" />
      </div>

      {/* Plazo */}
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

      {/* Result */}
      <div className="rounded-xl p-4 text-center border"
        style={{ background: selectedFin.bg, borderColor: `${selectedFin.color}30` }}>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: selectedFin.color }}>
          Cuota mensual estimada
        </p>
        <p className="font-display font-black text-3xl text-gray-900">{formatCOP(results.monthly)}</p>
        <p className="text-[10px] text-gray-500 mt-1">Total a pagar: {formatCOP(results.total)}</p>
        {results.commissionAmt > 0 && (
          <p className="text-[10px] text-amber-600 mt-0.5">Incl. comisión: {formatCOP(results.commissionAmt)}</p>
        )}
      </div>

      <a href={getWhatsAppUrl(whatsappMsg)} target="_blank" rel="noopener noreferrer">
        <Button className="w-full text-white font-display font-bold rounded-xl h-11 group transition-all"
          style={{ background: selectedFin.color }}>
          Solicitar con {selectedFin.name}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </a>
    </div>
  );
}

// ─── Full section ─────────────────────────────────────────────────────────────
export default function FinancingCalculator({ initialPrice = 8000000, initialFinanciera, compact = false }: FinancingCalculatorProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const sectionRef = useRef<HTMLDivElement>(null);

  const [price, setPrice] = useState(initialPrice);
  const [initialPct, setInitialPct] = useState(20);
  const [term, setTerm] = useState(36);
  const defaultFin = (initialFinanciera ? FINANCIERAS.find(f => f.id === initialFinanciera) : undefined) ?? FINANCIERAS[0];
  const [selectedFin, setSelectedFin] = useState<Financiera>(defaultFin);

  // Scroll automático al resultado cuando viene con financiera preseleccionada
  useEffect(() => {
    if (!initialFinanciera) return;
    const tryScroll = (attempt = 0) => {
      const el = document.getElementById('resultado');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempt < 8) {
        setTimeout(() => tryScroll(attempt + 1), 150);
      }
    };
    setTimeout(() => tryScroll(), 300);
  }, [initialFinanciera]);
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

  if (compact) return <CompactCalculator initialPrice={initialPrice} />;

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-ibiza-red/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-ibiza-gold/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

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

          <div className="flex items-center justify-between mb-5 px-1">
            <p className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">
              Elige tu financiera
            </p>
            <button onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
              <Info className="w-3.5 h-3.5" />
              ¿Cómo funciona?
            </button>
          </div>

          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                className="mb-5 bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700 leading-relaxed">
                Las tasas son <strong>mensuales</strong>. La comisión (si aplica) es un cobro único sobre el monto
                financiado, pagadero al inicio. El cálculo es orientativo — las condiciones exactas las define la
                entidad financiera al momento de la solicitud.
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Cards con logos reales ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                  className="relative flex flex-col items-center p-2 sm:p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden group cursor-pointer"
                  style={{
                    borderColor: isSelected ? fin.color : '#e5e7eb',
                    background: isSelected ? fin.bg : '#fafafa',
                    transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isSelected
                      ? `0 12px 32px ${fin.color}28`
                      : '0 1px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Badge top-right */}
                  {fin.badge && (
                    <span
                      className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white leading-tight z-10"
                      style={{ background: fin.badgeColor }}
                    >
                      {fin.badge}
                    </span>
                  )}

                  {/* Checkmark top-left */}
                  {isSelected && (
                    <div
                      className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center z-10 transition-all"
                      style={{ background: fin.color }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  {/* Logo area — caja blanca uniforme para todos los logos */}
                  <div
                    className="w-full flex items-center justify-center mb-3 mt-1 rounded-xl"
                    style={{
                      height: 72,
                      background: isSelected ? '#ffffff' : '#f4f4f5',
                      border: `1px solid ${isSelected ? fin.color + '30' : '#e4e4e7'}`,
                    }}
                  >
                    <FinancieraLogo fin={fin} size="md" />
                  </div>

                  {/* Name */}
                  <p className="text-[11px] font-bold text-center text-gray-700 mb-2.5 leading-tight">
                    {fin.name}
                  </p>

                  {/* Stats strip */}
                  <div
                    className="w-full rounded-xl px-3 py-2 space-y-1"
                    style={{ background: isSelected ? `${fin.color}12` : '#f3f4f6' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-400 uppercase font-semibold">Tasa</span>
                      <span className="text-[12px] font-black" style={{ color: fin.color }}>
                        {fin.monthlyRate}%<span className="text-[9px] font-normal text-gray-400">/mes</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-400 uppercase font-semibold">Comisión</span>
                      <span className={`text-[10px] font-bold ${fin.commission === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                        {fin.commission === 0 ? '✓ Sin cobro' : `${fin.commission}%`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-400 uppercase font-semibold">Plazo máx.</span>
                      <span className="text-[10px] font-bold text-gray-600">{fin.maxMonths} m</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Selected banner */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFin.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25 }}
              className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 rounded-2xl border"
              style={{ background: selectedFin.bg, borderColor: `${selectedFin.color}35` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${selectedFin.color}18` }}
                >
                  <FinancieraLogo fin={selectedFin} size="xs" />
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight" style={{ color: selectedFin.color }}>
                    {selectedFin.name}
                  </p>
                  <p className="text-gray-400 text-xs">{selectedFin.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 ml-auto flex-wrap">
                {[
                  { label: 'Tasa mensual', value: `${selectedFin.monthlyRate}%`, accent: true },
                  {
                    label: 'Comisión',
                    value: selectedFin.commission === 0 ? 'Sin comisión' : `${selectedFin.commission}%`,
                    accent: false,
                    green: selectedFin.commission === 0,
                  },
                  { label: 'Plazo máx.', value: `${selectedFin.maxMonths} meses`, accent: false },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <p className="text-[9px] text-gray-400 font-semibold uppercase">{item.label}</p>
                    <p
                      className="font-black text-lg leading-tight"
                      style={{
                        color: item.accent
                          ? selectedFin.color
                          : item.green
                          ? '#16a34a'
                          : '#d97706',
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
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
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(Math.max(1000000, Number(e.target.value)))}
                  className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-8 pr-4 py-3.5 font-display font-bold text-lg focus:border-ibiza-red outline-none transition-colors"
                  step={500000} min={1000000}
                />
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
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
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
            id="resultado"
            className="space-y-4">

            {/* Main result card */}
            <div className="relative rounded-3xl overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${selectedFin.color} 0%, ${selectedFin.color}cc 100%)` }}>
              {/* Watermark text */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
                <span className="font-display font-black text-white text-5xl tracking-widest">
                  {selectedFin.shortName}
                </span>
              </div>

              <div className="relative p-8 text-center text-white">
                {/* Logo chip — fondo blanco para que el logo sea legible */}
                <div className="inline-flex items-center justify-center bg-white rounded-2xl px-5 py-3 mb-4">
                  <FinancieraLogo fin={selectedFin} size="md" />
                </div>

                <p className="text-white/70 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                  Tu cuota mensual sería
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${results.monthly}-${selectedFin.id}`}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    transition={{ duration: 0.2 }}
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
                { icon: <DollarSign className="w-5 h-5" />, label: 'Cuota inicial', value: formatCOP(results.initial), sub: `${initialPct}% del precio` },
                { icon: <TrendingDown className="w-5 h-5" />, label: 'Monto a financiar', value: formatCOP(results.principal), sub: 'Saldo pendiente' },
                { icon: <Calendar className="w-5 h-5" />, label: 'Total en cuotas', value: formatCOP(results.totalCuotas), sub: `En ${term} cuotas` },
                { icon: <Calculator className="w-5 h-5" />, label: 'Costo total', value: formatCOP(results.total), sub: `Incl. inicial${results.commissionAmt > 0 ? ' y comisión' : ''}` },
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
              <Button
                className="w-full text-white font-display font-bold rounded-2xl h-14 text-base group mt-2 transition-all"
                style={{ background: selectedFin.color }}>
                Solicitar con {selectedFin.name}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <p className="text-[11px] text-gray-500 text-center">
              *Cálculo orientativo. Tasas vigentes 2026. Condiciones finales sujetas a aprobación de la entidad financiera.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
