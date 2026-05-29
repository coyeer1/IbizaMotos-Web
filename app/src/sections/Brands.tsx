import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { brands } from '@/data/motorcycles';
import Reveal from '@/components/Reveal';

// ─── Tokens (alineados con el hero) ───────────────────────────────────────
const T = {
  border: '#e8e8e8',
  pill: '#f5f5f5',
  red: '#E31937',
  body: "'DM Sans', sans-serif",
};

interface BrandLogoProps {
  name: string;
  logo: string;
  onClick: () => void;
}

const BrandLogo = ({ name, logo, onClick }: BrandLogoProps) => {
  return (
    <div
      onClick={onClick}
      className="group flex-shrink-0 mx-6 cursor-pointer transition-transform duration-200 hover:scale-[1.04]"
    >
      <div
        className="flex items-center justify-center transition-colors duration-200 group-hover:border-[#000]"
        style={{
          width: 128,
          height: 80,
          borderRadius: 12,
          background: '#fff',
          border: `1px solid ${T.border}`,
          padding: 16,
        }}
      >
        <img
          src={logo}
          alt={`Logo ${name}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain grayscale opacity-50 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
        />
      </div>
    </div>
  );
};

interface BrandsProps {
  onBrandClick?: (brand: string) => void;
}

export default function Brands({ onBrandClick }: BrandsProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      className="py-16 overflow-hidden"
      ref={ref}
      style={{ background: T.pill, fontFamily: T.body }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mb-10">
        <Reveal direction="up">
          <p
            className="text-center uppercase"
            style={{ fontSize: 11, letterSpacing: '0.15em', color: '#999', fontWeight: 500 }}
          >
            Distribuidores Oficiales de las Mejores Marcas
          </p>
        </Reveal>
      </div>

      {/* Infinite scroll container */}
      <div className="relative">
        {/* Gradient fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10" style={{ background: 'linear-gradient(to right, #f5f5f5, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10" style={{ background: 'linear-gradient(to left, #f5f5f5, transparent)' }} />

        {/* Scrolling row */}
        <div
          className={`flex animate-infinite-scroll hover:[animation-play-state:paused] transition-opacity duration-700 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* First set */}
          {brands.map((brand, index) => (
            <BrandLogo
              key={`first-${index}`}
              name={brand.name}
              logo={brand.logo}
              onClick={() => onBrandClick?.(brand.name)}
            />
          ))}
          {/* Duplicate for seamless loop */}
          {brands.map((brand, index) => (
            <BrandLogo
              key={`second-${index}`}
              name={brand.name}
              logo={brand.logo}
              onClick={() => onBrandClick?.(brand.name)}
            />
          ))}
        </div>
      </div>

      {/* Second row - reverse direction */}
      <div className="relative mt-6">
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10" style={{ background: 'linear-gradient(to right, #f5f5f5, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10" style={{ background: 'linear-gradient(to left, #f5f5f5, transparent)' }} />

        <div
          className={`flex animate-infinite-scroll-reverse hover:[animation-play-state:paused] transition-opacity duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {[...brands].reverse().map((brand, index) => (
            <BrandLogo
              key={`reverse-first-${index}`}
              name={brand.name}
              logo={brand.logo}
              onClick={() => onBrandClick?.(brand.name)}
            />
          ))}
          {[...brands].reverse().map((brand, index) => (
            <BrandLogo
              key={`reverse-second-${index}`}
              name={brand.name}
              logo={brand.logo}
              onClick={() => onBrandClick?.(brand.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
