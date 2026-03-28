import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Dimensiones basadas en las proporciones reales de cada imagen
const FINANCIERAS_LOGOS = [
  { id: 'progreser',    logo: '/financieras/progreser.png',    name: 'Progreser',      w: 40, h: 40 },
  { id: 'bancobogota',  logo: '/financieras/banco-bogota.png', name: 'Banco de Bogotá',w: 76, h: 56 },
  { id: 'sufi',         logo: '/financieras/sufi.png',         name: 'SUFI',           w: 72, h: 22 },
  { id: 'brilla',       logo: '/financieras/brilla.png',       name: 'Brilla',         w: 72, h: 26 },
  { id: 'addi',         logo: '/financieras/addi.jpg',         name: 'ADDI',           w: 60, h: 42 },
  { id: 'venfi',        logo: '/financieras/venfi.png',        name: 'Venfi',          w: 76, h: 30 },
  { id: 'sistecredito', logo: '/financieras/sistecredito.png', name: 'Sistecredito',   w: 48, h: 48 },
  { id: 'crediorbe',    logo: '/financieras/crediorbe.png',    name: 'CrediorBe',      w: 84, h: 17 },
];

const STATS = [
  { value: '1.26%', label: 'Tasa mínima mensual' },
  { value: '60',    label: 'Meses máx. de plazo' },
  { value: '8',     label: 'Financieras aliadas' },
  { value: '24h',   label: 'Desembolso rápido' },
];

export default function FinancingTeaser() {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Sutil acento rojo en esquina */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-ibiza-red/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-12"
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
          <h2 className="font-display font-black text-4xl md:text-5xl text-gray-900 mb-4 leading-tight">
            TU MOTO,{' '}
            <span className="text-ibiza-red">A TU RITMO</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Trabajamos con 8 financieras aliadas para que consigas la tasa más baja
            y la cuota que se ajusta a tu bolsillo.
          </p>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center"
            >
              <p className="font-display font-black text-3xl text-ibiza-red">{s.value}</p>
              <p className="text-[11px] text-gray-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Logos strip ── */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase text-center mb-5">
            Financieras aliadas
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            {FINANCIERAS_LOGOS.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.3 + i * 0.05 }}
                className="flex items-center justify-center bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-ibiza-red/40 hover:shadow-md cursor-pointer transition-all duration-200"
                style={{ minWidth: 80 }}
                onClick={() => navigate(`/financiamiento?financiera=${f.id}`)}
                title={`Financiar con ${f.name}`}
              >
                <div style={{ width: f.w, height: f.h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={f.logo}
                    alt={f.name}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <button
            onClick={() => navigate('/financiamiento')}
            className="inline-flex items-center gap-3 bg-ibiza-red hover:bg-red-700 text-white font-display font-bold px-10 py-4 rounded-2xl text-base active:scale-95 transition-all duration-200 shadow-[0_4px_24px_rgba(215,38,61,0.30)] group"
          >
            <Calculator className="w-5 h-5" />
            Calcular mi cuota
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <p className="text-gray-400 text-xs mt-3">
            Simulación gratuita · Sin compromiso · Tasas vigentes 2026
          </p>
        </motion.div>

      </div>
    </section>
  );
}
