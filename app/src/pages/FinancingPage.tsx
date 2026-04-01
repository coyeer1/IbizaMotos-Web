import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Reveal from '@/components/Reveal';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Precio e info de moto preseleccionada (venimos desde /moto/:id)
  const precioParam = searchParams.get('precio');
  const motoNombre = searchParams.get('moto');
  const financieraParam = searchParams.get('financiera') ?? undefined;
  const initialPrice = precioParam ? parseInt(precioParam, 10) : undefined;

  // Scroll al resultado cuando viene con ?precio= (sin financiera)
  useEffect(() => {
    if (initialPrice && !financieraParam) {
      setTimeout(() => {
        document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 800);
    }
  }, [initialPrice, financieraParam]);

  return (
    <div className="min-h-screen bg-[#09090b]">

      {/* Back button */}
      <div className="pt-24 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-20">

        {/* ── CALCULADORA ── */}
        <div>
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">Simula tu financiamiento</h2>
            <p className="text-gray-500">Ajusta precio, cuota inicial y plazo para ver tu cuota mensual exacta</p>
          </div>

          {/* Banner "calculando para X moto" */}
          {motoNombre && initialPrice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mb-6 flex items-center gap-4 bg-ibiza-red/10 border border-ibiza-red/30 rounded-2xl px-6 py-4"
            >
              <div className="w-10 h-10 rounded-xl bg-ibiza-red/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🏍️</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-ibiza-red/70 font-bold tracking-widest uppercase">Calculando para</p>
                <p className="font-display font-bold text-white truncate">{motoNombre}</p>
              </div>
              <p className="font-display font-black text-ibiza-red text-xl flex-shrink-0">
                {'$' + new Intl.NumberFormat('es-CO').format(initialPrice)}
              </p>
            </motion.div>
          )}

          <FinancingCalculator
            {...(initialPrice ? { initialPrice } : {})}
            {...(financieraParam ? { initialFinanciera: financieraParam } : {})}
          />
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
            ].map(({ step, icon, title, desc }, i) => (
              <Reveal key={step} delay={i * 0.1}><div className="relative bg-white/[0.02] rounded-2xl p-6 border border-white/[0.05] text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-ibiza-red text-white font-display font-black text-sm w-8 h-8 rounded-full flex items-center justify-center">
                  {step}
                </div>
                <div className="w-12 h-12 bg-ibiza-red/10 rounded-xl flex items-center justify-center text-ibiza-red mx-auto mb-4 mt-2">
                  {icon}
                </div>
                <h3 className="font-display font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div></Reveal>
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
