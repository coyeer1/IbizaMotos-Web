import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, TrendingUp, Shield,
  MessageCircle, Star, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import FinancingCalculator from '@/sections/FinancingCalculator';
import { getWhatsAppUrl } from '@/lib/config';

// ─── Datos de financieras ──────────────────────────────────────────────────
interface Financiera {
  name: string;
  logo: string;          // emoji o inicial para fallback
  monthlyRate: number;   // %
  minTerm: number;       // meses
  maxTerm: number;
  highlight: string;
  badge?: string;        // texto de badge especial
  badgeColor?: string;
}

const financieras: Financiera[] = [
  {
    name: 'Banco de Bogotá',
    logo: 'BB',
    monthlyRate: 1.26,
    minTerm: 12,
    maxTerm: 60,
    highlight: 'La tasa más baja disponible. Ideal para montos altos.',
    badge: 'Mejor tasa',
    badgeColor: 'bg-emerald-500',
  },
  {
    name: 'SUFI',
    logo: 'SF',
    monthlyRate: 1.73,
    minTerm: 12,
    maxTerm: 48,
    highlight: 'Cuota fija garantizada. Especialista en motos.',
    badge: 'Cuota fija',
    badgeColor: 'bg-blue-500',
  },
  {
    name: 'VENFI',
    logo: 'VF',
    monthlyRate: 1.80,
    minTerm: 12,
    maxTerm: 48,
    highlight: 'Especialista 100% en financiamiento de vehículos.',
  },
  {
    name: 'BRILLA',
    logo: 'BR',
    monthlyRate: 1.81,
    minTerm: 12,
    maxTerm: 48,
    highlight: 'Aprobación rápida con pocos requisitos.',
  },
  {
    name: 'ADDI',
    logo: 'AD',
    monthlyRate: 1.83,
    minTerm: 3,
    maxTerm: 12,
    highlight: '100% digital. Aprobación en minutos desde tu celular.',
    badge: 'Más rápido',
    badgeColor: 'bg-purple-500',
  },
  {
    name: 'PROGRESER',
    logo: 'PG',
    monthlyRate: 1.83,
    minTerm: 12,
    maxTerm: 60,
    highlight: 'Desembolso en 24 horas. Hasta 60 meses de plazo.',
  },
  {
    name: 'SISTECREDITO',
    logo: 'SC',
    monthlyRate: 1.90,
    minTerm: 6,
    maxTerm: 36,
    highlight: 'Aprobación sin historial crediticio. Excelente para primeros créditos.',
    badge: 'Sin historial',
    badgeColor: 'bg-amber-500',
  },
  {
    name: 'CREDIORBE',
    logo: 'CO',
    monthlyRate: 3.72,
    minTerm: 6,
    maxTerm: 24,
    highlight: 'Sin cuota inicial requerida. Proceso simplificado.',
    badge: 'Sin inicial',
    badgeColor: 'bg-orange-500',
  },
];

const faqs = [
  {
    q: '¿Qué documentos necesito para solicitar financiamiento?',
    a: 'Generalmente: cédula de ciudadanía, últimos 3 desprendibles de pago (o declaración de renta si eres independiente), extractos bancarios de los últimos 3 meses y comprobante de domicilio. Según la financiera, puede variar.',
  },
  {
    q: '¿Cuánto tiempo tarda la aprobación del crédito?',
    a: 'Depende de la entidad. ADDI aprueba en minutos de forma digital. Banco de Bogotá y SUFI pueden tardar 24-72 horas hábiles. PROGRESER garantiza desembolso en 24 horas una vez aprobado.',
  },
  {
    q: '¿Puedo pagar la moto de contado y tener descuento?',
    a: 'Sí. El pago de contado puede darte entre un 2% y un 5% de descuento adicional sobre el precio de lista, dependiendo de la moto y la marca. Consúltanos directamente para negociar.',
  },
  {
    q: '¿La tasa que aparece aquí es la que me aplicarán?',
    a: 'Las tasas son las vigentes al momento de publicación y pueden variar. La tasa final depende de tu perfil crediticio, el monto financiado y el plazo elegido. Estos datos son orientativos; el asesor de crédito te confirmará la tasa exacta.',
  },
  {
    q: '¿Puedo hacer abonos extra o pagar anticipadamente?',
    a: 'Sí, todas las financieras permiten abonos extraordinarios o pago anticipado. Sin embargo, algunas cobran penalidad por prepago (máx. 1% sobre el saldo según norma colombiana). SUFI y Banco de Bogotá no cobran esta penalidad.',
  },
  {
    q: '¿El SOAT y la matrícula están incluidos en el financiamiento?',
    a: 'No. El financiamiento cubre el precio de la moto. El SOAT, matrícula e impuesto de rodamiento se pagan por separado. Considera entre $450.000 y $800.000 adicionales dependiendo del cilindraje y municipio.',
  },
];

function calcMonthly(price: number, rate: number, months: number, initialPct: number = 20): number {
  const principal = price * (1 - initialPct / 100);
  const r = rate / 100;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function formatCOP(n: number) {
  return '$' + new Intl.NumberFormat('es-CO').format(Math.round(n));
}

const DEMO_PRICE = 10000000;

export default function FinancingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#09090b]">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-ibiza-black to-[#09090b] pt-24 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-ibiza-red/5 to-ibiza-gold/5" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-ibiza-red/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-ibiza-gold/10 rounded-full blur-[100px]" />

        {/* Back button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-ibiza-red font-display font-semibold text-sm tracking-widest uppercase mb-4"
          >
            💳 Financiamiento
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl md:text-6xl text-white mb-6 leading-tight"
          >
            TU MOTO,<br />
            <span className="text-ibiza-red">A TU RITMO</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-10"
          >
            Trabajamos con las mejores financieras de Colombia para que consigas la tasa más baja
            y la cuota que se ajusta a tu bolsillo. Sin filas, sin papeleo innecesario.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex flex-wrap justify-center gap-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-8 py-5"
          >
            {[
              { value: '8', label: 'Financieras aliadas' },
              { value: '1.26%', label: 'Tasa mínima mensual' },
              { value: '60', label: 'Meses máx.' },
              { value: '24h', label: 'Desembolso rápido' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display font-black text-3xl text-white">{value}</p>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-20">

        {/* ── TABLA COMPARATIVA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">Compara nuestras financieras</h2>
            <p className="text-gray-500">Elige la que más te convenga según tasa, plazo y velocidad de aprobación</p>
          </div>

          {/* Tabla desktop */}
          <div className="hidden md:block rounded-2xl overflow-hidden border border-white/[0.06]">
            <table className="w-full">
              <thead>
                <tr className="bg-white/[0.04] border-b border-white/[0.06]">
                  {['Financiera', 'Tasa mensual', 'Tasa anual', 'Plazo', `Cuota est. ${formatCOP(DEMO_PRICE)}`, 'Ventaja clave'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-white/30 tracking-widest uppercase px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {financieras.map((f, i) => {
                  const monthly = calcMonthly(DEMO_PRICE, f.monthlyRate, 36);
                  const annualRate = (Math.pow(1 + f.monthlyRate / 100, 12) - 1) * 100;
                  const isBest = f.monthlyRate === Math.min(...financieras.map(x => x.monthlyRate));
                  return (
                    <tr
                      key={f.name}
                      className={`border-b border-white/[0.04] transition-colors ${isBest ? 'bg-emerald-500/5' : i % 2 === 0 ? 'bg-white/[0.01]' : ''} hover:bg-white/[0.03]`}
                    >
                      {/* Financiera */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-xs text-white ${isBest ? 'bg-emerald-500' : 'bg-ibiza-red/20'}`}>
                            {f.logo}
                          </div>
                          <div>
                            <p className="font-display font-bold text-white text-sm">{f.name}</p>
                            {f.badge && (
                              <span className={`text-[9px] font-bold text-white px-2 py-0.5 rounded-full ${f.badgeColor}`}>
                                {f.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Tasa mensual */}
                      <td className="px-5 py-4">
                        <span className={`font-display font-bold text-lg ${isBest ? 'text-emerald-400' : 'text-white'}`}>
                          {f.monthlyRate.toFixed(2)}%
                        </span>
                        {isBest && <CheckCircle2 className="w-4 h-4 text-emerald-400 inline ml-1" />}
                      </td>
                      {/* Tasa anual */}
                      <td className="px-5 py-4 text-gray-400 text-sm">{annualRate.toFixed(1)}%</td>
                      {/* Plazo */}
                      <td className="px-5 py-4 text-gray-400 text-sm">{f.minTerm} – {f.maxTerm} meses</td>
                      {/* Cuota estimada */}
                      <td className="px-5 py-4">
                        <span className="font-display font-bold text-white">{formatCOP(monthly)}</span>
                        <span className="text-[10px] text-gray-600 block">20% inicial · 36 meses</span>
                      </td>
                      {/* Ventaja */}
                      <td className="px-5 py-4 text-gray-400 text-sm max-w-[200px]">{f.highlight}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards mobile */}
          <div className="md:hidden grid gap-4">
            {financieras.map((f) => {
              const monthly = calcMonthly(DEMO_PRICE, f.monthlyRate, 36);
              const isBest = f.monthlyRate === Math.min(...financieras.map(x => x.monthlyRate));
              return (
                <div
                  key={f.name}
                  className={`rounded-2xl p-5 border ${isBest ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/[0.06] bg-white/[0.02]'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-xs text-white ${isBest ? 'bg-emerald-500' : 'bg-ibiza-red/20'}`}>
                        {f.logo}
                      </div>
                      <div>
                        <p className="font-display font-bold text-white">{f.name}</p>
                        {f.badge && (
                          <span className={`text-[9px] font-bold text-white px-2 py-0.5 rounded-full ${f.badgeColor}`}>
                            {f.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-display font-bold text-xl ${isBest ? 'text-emerald-400' : 'text-white'}`}>{f.monthlyRate.toFixed(2)}%</p>
                      <p className="text-[10px] text-gray-500">mensual</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{f.minTerm}–{f.maxTerm} meses</span>
                    <span className="font-bold text-white">{formatCOP(monthly)}<span className="text-gray-600 font-normal">/mes</span></span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">{f.highlight}</p>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-gray-600 text-center mt-4">
            *Cuota estimada para moto de {formatCOP(DEMO_PRICE)} con 20% de inicial a 36 meses. Tasa sujeta a aprobación de la entidad financiera.
          </p>
        </motion.div>

        {/* ── CALCULADORA ── */}
        <div>
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">Simula tu financiamiento</h2>
            <p className="text-gray-500">Ajusta precio, cuota inicial y plazo para ver tu cuota mensual exacta</p>
          </div>
          <FinancingCalculator />
        </div>

        {/* ── PASOS PARA FINANCIAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">¿Cómo financio mi moto?</h2>
            <p className="text-gray-500">En Ibiza Motos hacemos el proceso contigo, paso a paso</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: <MessageCircle className="w-6 h-6" />, title: 'Elige tu moto', desc: 'Visítanos o escríbenos por WhatsApp. Nuestros asesores te ayudan a elegir la moto perfecta para ti.' },
              { step: '02', icon: <Shield className="w-6 h-6" />, title: 'Presentas documentos', desc: 'Cédula, ingresos y extractos. Nosotros gestionamos el crédito con la financiera que más te convenga.' },
              { step: '03', icon: <CheckCircle2 className="w-6 h-6" />, title: 'Aprobación rápida', desc: 'En 24-72 horas tienes respuesta. En algunos casos como ADDI, en minutos.' },
              { step: '04', icon: <Star className="w-6 h-6" />, title: '¡Retiras tu moto!', desc: 'Firmás el contrato, pagás la cuota inicial y te vas en tu moto nueva ese mismo día.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="relative bg-white/[0.02] rounded-2xl p-6 border border-white/[0.05] text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-ibiza-red text-white font-display font-black text-sm w-8 h-8 rounded-full flex items-center justify-center">
                  {step}
                </div>
                <div className="w-12 h-12 bg-ibiza-red/10 rounded-xl flex items-center justify-center text-ibiza-red mx-auto mb-4 mt-2">
                  {icon}
                </div>
                <h3 className="font-display font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── VENTAJAS ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-ibiza-red/10 to-ibiza-gold/5 rounded-3xl p-8 md:p-12 border border-ibiza-red/20"
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display font-bold text-3xl text-white mb-6">¿Por qué financiar con nosotros?</h2>
              <ul className="space-y-4">
                {[
                  'Acceso a 8 financieras en un solo lugar — comparamos tasas por ti',
                  'Asesor dedicado que te acompaña durante todo el proceso',
                  'Sin filas en bancos — hacemos el trámite desde nuestro punto de venta',
                  'Experiencia de más de 15 años financiando motos en el Eje Cafetero',
                  'Aprobaciones rápidas incluso para clientes sin historial crediticio',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-300 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-ibiza-red shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center gap-5">
              <TrendingUp className="w-24 h-24 text-ibiza-red/30" />
              <div className="text-center">
                <p className="font-display font-black text-6xl text-white">95%</p>
                <p className="text-gray-400 mt-1">de solicitudes aprobadas</p>
              </div>
              <a
                href={getWhatsAppUrl('Hola, quiero financiar una moto. ¿Me pueden asesorar sobre las opciones de crédito disponibles?')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white font-bold px-8 py-4 rounded-2xl text-sm transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Iniciar solicitud por WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── FAQ ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">Preguntas frecuentes</h2>
            <p className="text-gray-500">Todo lo que necesitas saber sobre el financiamiento de tu moto</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white/[0.02] rounded-2xl border border-white/[0.05] overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-display font-semibold text-white pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 text-ibiza-red shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/[0.04]">
                    <p className="pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA FINAL ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            ¿Listo para pedalear?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Nuestros asesores están disponibles de lunes a sábado, 8am a 6pm.
            Escríbenos ahora y hoy mismo puedes salir en tu moto.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={getWhatsAppUrl('Hola, quiero financiar mi moto. ¿Cuáles son las opciones disponibles?')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white font-bold px-8 py-4 rounded-2xl text-sm transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Escríbenos por WhatsApp
            </a>
            <Button
              onClick={() => navigate('/#catalogo')}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/[0.06] px-8 py-4 rounded-2xl h-auto"
            >
              Ver catálogo de motos
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
