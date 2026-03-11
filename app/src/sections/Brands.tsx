import { useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { brands } from '@/data/motorcycles';

interface BrandLogoProps {
  name: string;
  logo: string;
  onClick: () => void;
}

const BrandLogo = ({ name, logo, onClick }: BrandLogoProps) => {
  const logoRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!logoRef.current) return;
    const rect = logoRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / rect.width) * 15;
    const rotateX = ((centerY - e.clientY) / rect.height) * 15;

    logoRef.current.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.1)`;
  };

  const handleMouseLeave = () => {
    if (!logoRef.current) return;
    logoRef.current.style.transform = 'perspective(500px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
  };

  return (
    <div
      ref={logoRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="flex-shrink-0 mx-8 cursor-pointer transition-all duration-300 group"
      style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
    >
      <div
        className="w-32 h-20 rounded-xl flex items-center justify-center bg-ibiza-black shadow-md hover:shadow-xl transition-shadow duration-300 border border-border group-hover:border-ibiza-red/50 p-4"
      >
        <img
          src={logo}
          alt={`Logo ${name}`}
          className="w-full h-full object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
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
    <section className="py-16 bg-ibiza-gray-100 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p
          className={`text-center text-gray-500 font-display text-sm tracking-widest uppercase transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
        >
          Distribuidores Oficiales de las Mejores Marcas
        </p>
      </div>

      {/* Infinite scroll container */}
      <div className="relative">
        {/* Gradient fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#111] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#111] to-transparent z-10" />

        {/* Scrolling row */}
        <div
          className={`flex animate-infinite-scroll hover:[animation-play-state:paused] transition-opacity duration-800 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'
            }`}
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
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#111] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#111] to-transparent z-10" />

        <div
          className={`flex animate-infinite-scroll-reverse hover:[animation-play-state:paused] transition-opacity duration-800 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'
            }`}
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
