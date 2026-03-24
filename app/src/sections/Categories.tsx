import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    slug: 'sport',
    name: 'Sport',
    model: 'Suzuki Gixxer 150',
    description: 'Adrenalina y rendimiento deportivo',
    filterCategory: 'Urban Sport',
    image: '/categories/gixxer.png',
    accent: '#d7263d',
    bgFrom: '#fff1f2',
  },
  {
    slug: 'enduro',
    name: 'Enduro',
    model: 'Honda XR 150L',
    description: 'Conquista cualquier terreno sin límites',
    filterCategory: 'Enduro',
    image: '/categories/xr.png',
    accent: '#276749',
    bgFrom: '#f0fff4',
  },
  {
    slug: 'scooters',
    name: 'Scooters',
    model: 'Suzuki Burgman Street',
    description: 'Agilidad y comodidad automática',
    filterCategory: 'Scooters',
    image: '/categories/burgamn.png',
    accent: '#1a56db',
    bgFrom: '#eff6ff',
  },
  {
    slug: 'urbanas',
    name: 'Urbanas',
    model: 'Bajaj NKD 125',
    description: 'Estilo retro para dominar la ciudad',
    filterCategory: 'City',
    image: '/categories/nkd.png',
    accent: '#6d28d9',
    bgFrom: '#f5f3ff',
  },
  {
    slug: 'city',
    name: 'City',
    model: 'Special 110',
    description: 'Economía y eficiencia para el día a día',
    filterCategory: 'City',
    image: '/categories/special-110.png',
    accent: '#b45309',
    bgFrom: '#fffbeb',
  },
];

// ─── Carousel constants ───────────────────────────────────────────────────────
const N = CATEGORIES.length;       // 5
const VISIBLE = 3;
const REPEATS = 5;                 // buffer: 25 items total
const TOTAL = REPEATS * N;         // 25
const START = 2 * N;               // 10 → shows CATEGORIES[0,1,2]

const ITEMS = Array.from({ length: TOTAL }, (_, i) => CATEGORIES[i % N]);

// ─── Main component ───────────────────────────────────────────────────────────
export default function Categories() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(START);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const rafRef = useRef<number>();

  // 0-based dot indicator for the first visible category
  const dotIdx = ((idx - START) % N + N) % N;

  const moveTo = useCallback(
    (newIdx: number) => {
      if (animating) return;
      setAnimating(true);
      setIdx(newIdx);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        // 1. Remove CSS transition
        setAnimating(false);
        // 2. In the next paint, silently teleport if out of the safe middle range
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          if (newIdx < N) {
            setIdx(newIdx + 2 * N);
          } else if (newIdx >= 4 * N) {
            setIdx(newIdx - 2 * N);
          }
        });
      }, 520);
    },
    [animating],
  );

  const next = () => moveTo(idx + 1);
  const prev = () => moveTo(idx - 1);

  // Touch/swipe support
  const touchStartX = useRef<number>(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
  };

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-ibiza-red font-display font-semibold text-xs tracking-[0.25em] uppercase mb-3">
              Explora por tipo
            </p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-gray-900 tracking-tight leading-none">
              NUESTRAS<br />CATEGORÍAS
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-ibiza-red hover:text-ibiza-red active:scale-90 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="w-12 h-12 rounded-full bg-ibiza-red flex items-center justify-center text-white hover:bg-red-700 active:scale-90 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Carousel track ── */}
        <div
          className="overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            style={{
              display: 'flex',
              // Track is TOTAL/VISIBLE times wider than the container
              width: `${(TOTAL / VISIBLE) * 100}%`,
              // translateX: -idx card-widths (each card = track / TOTAL = container / VISIBLE)
              transform: `translateX(calc(-${idx} * 100% / ${TOTAL}))`,
              transition: animating
                ? 'transform 0.52s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                : 'none',
            }}
          >
            {ITEMS.map((cat, i) => (
              <div
                key={i}
                style={{
                  flex: `0 0 calc(100% / ${TOTAL})`,
                  padding: '0 10px',
                }}
              >
                <CategoryCard
                  cat={cat}
                  onNavigate={() => navigate(`/?categoria=${cat.filterCategory}`)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Dots indicator ── */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {CATEGORIES.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === dotIdx ? '32px' : '8px',
                background: i === dotIdx ? '#d7263d' : '#d1d5db',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Individual card ──────────────────────────────────────────────────────────
function CategoryCard({
  cat,
  onNavigate,
}: {
  cat: (typeof CATEGORIES)[0];
  onNavigate: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onNavigate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full text-left focus:outline-none"
    >
      <div
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          height: '520px',
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          transform: hovered ? 'translateY(-14px)' : 'translateY(0)',
          boxShadow: hovered
            ? `0 36px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10)`
            : '0 2px 20px rgba(0,0,0,0.08)',
          transition: 'transform 0.42s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.42s ease',
        }}
      >
        {/* ── MOTO: 400px fijos = 77% de la tarjeta ── */}
        <div
          style={{
            height: '400px',
            flexShrink: 0,
            background: cat.bgFrom,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glow radial centrado en la moto */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at 50% 70%, ${cat.accent}30 0%, transparent 65%)`,
              opacity: hovered ? 1 : 0.45,
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
            }}
          />

          {/* Imagen — ocupa todo el contenedor */}
          <img
            src={cat.image}
            alt={cat.name}
            draggable={false}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '18px 12px 10px',
              transform: hovered
                ? 'scale(1.1) translateY(-8px)'
                : 'scale(1) translateY(0)',
              filter: hovered
                ? 'drop-shadow(0 20px 36px rgba(0,0,0,0.30))'
                : 'drop-shadow(0 6px 14px rgba(0,0,0,0.13))',
              transition:
                'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), filter 0.4s ease',
              userSelect: 'none',
            }}
          />
        </div>

        {/* ── Franja inferior con acento de color ── */}
        <div
          style={{
            flex: 1,
            borderTop: `4px solid ${cat.accent}`,
            padding: '16px 22px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            background: '#fff',
          }}
        >
          <h3
            style={{
              fontWeight: 900,
              fontSize: '1.85rem',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: hovered ? cat.accent : '#0f172a',
              transition: 'color 0.28s ease',
              margin: 0,
            }}
          >
            {cat.name}
          </h3>

          <div
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '9px 18px',
              borderRadius: '100px',
              background: cat.accent,
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          >
            Conócelas
            <ChevronRight style={{ width: '13px', height: '13px' }} />
          </div>
        </div>
      </div>
    </button>
  );
}
