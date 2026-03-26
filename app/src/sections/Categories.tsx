import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Data (orden exacto del usuario) ─────────────────────────────────────────
const CATEGORIES = [
  {
    slug: 'calle',
    name: 'Calle',
    filterCategory: 'City',
    image: '/categories/gixxer.png',
    focalX: 80,
    focalY: 38,
  },
  {
    slug: 'aventura',
    name: 'Aventura',
    filterCategory: 'Adventure',
    image: '/categories/nkd.png',
    focalX: 80,
    focalY: 42,
  },
  {
    slug: 'automaticas',
    name: 'Automáticas',
    filterCategory: 'Scooters',
    image: '/categories/burgamn.png',
    focalX: 78,
    focalY: 40,
  },
  {
    slug: 'semi-automaticas',
    name: 'Semi\nautomáticas',
    filterCategory: 'City',
    image: '/categories/special-110.png',
    focalX: 80,
    focalY: 42,
  },
  {
    slug: 'enduro',
    name: 'Enduro',
    filterCategory: 'Enduro',
    image: '/categories/xr.png',
    focalX: 75,
    focalY: 40,
  },
];

// ─── Main component ──────────────────────────────────────────────────────────
export default function Categories() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector<HTMLElement>('.cat-card');
    const w = card ? card.offsetWidth + 4 : 320; // card width + gap
    scrollRef.current.scrollBy({ left: dir === 'right' ? w : -w, behavior: 'smooth' });
  };

  return (
    <section className="py-14 md:py-20 bg-white">
      {/* ── Header centrado ── */}
      <div className="text-center mb-10 md:mb-14 px-6">
        <h2
          className="font-display font-black text-gray-900 tracking-tight leading-none"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
        >
          Nuestras motos Ibiza
        </h2>
        <button
          onClick={() => navigate('/marca/suzuki')}
          className="mt-5 inline-flex items-center gap-2 px-7 py-3 bg-[#d7263d] text-white rounded-full font-display font-semibold text-sm hover:bg-red-700 active:scale-95 transition-all duration-200"
        >
          Conócelas todas
        </button>
      </div>

      {/* ── Carousel ── */}
      <div className="relative">
        {/* Track */}
        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => navigate(`/marca/todas?categoria=${encodeURIComponent(cat.filterCategory)}`)}
              className="cat-card group relative flex-shrink-0 snap-start overflow-hidden cursor-pointer transition-all duration-[350ms] ease-out hover:-translate-y-1.5 focus:outline-none"
              style={{
                width: 'clamp(260px, 20vw, 380px)',
                height: 'clamp(420px, 38vw, 560px)',
              }}
            >
              {/* Imagen — zoom al frente de la moto */}
              <img
                src={cat.image}
                alt={cat.name}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[350ms] ease-out"
                style={{
                  objectPosition: `${cat.focalX}% ${cat.focalY}%`,
                  transform: 'scale(2.2)',
                  transformOrigin: `${cat.focalX}% ${cat.focalY}%`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLImageElement).style.transform = 'scale(2.38)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLImageElement).style.transform = 'scale(2.2)';
                }}
              />

              {/* Gradiente oscuro inferior */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

              {/* Texto overlay inferior */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <h3 className="font-display font-black text-white leading-tight mb-3 whitespace-pre-line"
                  style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.2rem)' }}
                >
                  {cat.name}
                </h3>
                <span className="inline-flex items-center px-5 py-2.5 bg-[#d7263d] text-white rounded-md text-xs sm:text-sm font-semibold tracking-wide group-hover:bg-red-700 transition-colors duration-200">
                  Conócelas
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* ── Flecha derecha ── */}
        <button
          onClick={() => scroll('right')}
          aria-label="Siguiente"
          className="hidden sm:flex absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.15)] items-center justify-center text-gray-700 hover:bg-white hover:shadow-[0_6px_28px_rgba(0,0,0,0.2)] active:scale-90 transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* ── Flecha izquierda ── */}
        <button
          onClick={() => scroll('left')}
          aria-label="Anterior"
          className="hidden sm:flex absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.15)] items-center justify-center text-gray-700 hover:bg-white hover:shadow-[0_6px_28px_rgba(0,0,0,0.2)] active:scale-90 transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
