import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calculator } from 'lucide-react';
import Reveal from '@/components/Reveal';

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

  return (
    <section
      className="py-24 bg-white relative overflow-hidden font-body"
      style={{ color: '#000' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <Reveal direction="up">
            <p
              className="font-body uppercase"
              style={{ fontSize: 11, letterSpacing: '0.15em', color: '#999' }}
            >
              Financiamiento
            </p>
          </Reveal>
          <Reveal delay={0.08} direction="up">
            <h2
              className="font-display mt-3 leading-[0.92]"
              style={{ fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '-1px', color: '#000' }}
            >
              TU MOTO, <span style={{ color: '#E31937' }}>A TU RITMO</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16} direction="up">
            <p
              className="mx-auto mt-5"
              style={{ fontSize: 15, color: '#666', fontWeight: 300, lineHeight: 1.65, maxWidth: 460 }}
            >
              Trabajamos con 8 financieras aliadas para que consigas la tasa más baja
              y la cuota que se ajusta a tu bolsillo.
            </p>
          </Reveal>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={Math.min(i, 6) * 0.08} direction="up" className="flex">
            <div
              className="text-center w-full transition-transform duration-200 hover:scale-[1.02]"
              style={{ background: '#f5f5f5', border: '1px solid #e8e8e8', borderRadius: 12, padding: '22px 18px' }}
            >
              <p className="font-display leading-none" style={{ fontSize: 38, letterSpacing: '-0.5px', color: '#000' }}>
                {s.value}
              </p>
              <p style={{ fontSize: 11, color: '#999', marginTop: 6, lineHeight: 1.4 }}>{s.label}</p>
            </div>
            </Reveal>
          ))}
        </div>

        {/* ── Logos strip ── */}
        <div className="mb-10">
          <Reveal direction="up">
            <p
              className="uppercase text-center mb-6"
              style={{ fontSize: 11, letterSpacing: '0.15em', color: '#aaa' }}
            >
              Financieras aliadas
            </p>
          </Reveal>
          <div className="flex flex-wrap justify-center items-center gap-3">
            {FINANCIERAS_LOGOS.map((f, i) => (
              <Reveal key={f.id} delay={Math.min(i, 6) * 0.08} direction="up">
              <div
                className="flex items-center justify-center bg-white cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                style={{ minWidth: 'clamp(60px, 15vw, 80px)', border: '1px solid #e8e8e8', borderRadius: 10, padding: '12px 16px' }}
                onClick={() => navigate(`/financiamiento?financiera=${f.id}`)}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8e8e8'; }}
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
              </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <Reveal direction="up" className="text-center">
          <button
            onClick={() => navigate('/financiamiento')}
            className="inline-flex items-center gap-3 text-white font-body active:scale-95 transition-transform duration-200 hover:scale-[1.02] group"
            style={{ background: '#000', borderRadius: 8, padding: '14px 30px', fontSize: 15, fontWeight: 600 }}
          >
            <Calculator className="w-[18px] h-[18px]" />
            Calcular mi cuota
            <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <p style={{ fontSize: 12, color: '#aaa', marginTop: 14 }}>
            Simulación gratuita · Sin compromiso · Tasas vigentes 2026
          </p>
        </Reveal>

      </div>
    </section>
  );
}
