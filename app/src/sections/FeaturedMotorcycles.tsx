import { useRef, useState } from 'react';
import type { Motorcycle } from '@/types';
import { ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useMotorcycles } from '@/hooks/useMotorcycles';
import { motion } from 'framer-motion';

function calcCuota(price: number): string {
  const principal = price * 0.80;
  const r = 0.018;
  const n = 36;
  const monthly = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return '$' + new Intl.NumberFormat('es-CO').format(Math.round(monthly));
}

const getBrandColor = (brand: string): string => {
  const colors: Record<string, string> = {
    'Suzuki': '#003399',
    'Vento': '#E31937',
    'Hero': '#D7141A',
    'Honda': '#CC0000',
    'Bajaj': '#0072C6',
    'AKT': '#FF6600',
  };
  return colors[brand] || '#d7263d';
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
};

// Premium Card component matching catalog style  
const PremiumMotoCard = ({
  motorcycle,
  index,
  onViewDetails
}: {
  motorcycle: Motorcycle;
  index: number;
  onViewDetails: (moto: Motorcycle) => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative"
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onViewDetails(motorcycle)}
        className="bg-ibiza-black rounded-[2rem] p-4 flex flex-col items-start justify-between min-h-[460px] h-full border border-white/5 shadow-lg relative cursor-pointer
          before:absolute before:inset-0 before:rounded-[2rem] before:opacity-0 before:transition-opacity before:duration-500 before:shadow-[0_0_30px_rgba(227,25,55,0.4)] before:border before:border-transparent group-hover:before:opacity-100 group-hover:before:border-ibiza-red/30
          group-hover:-translate-y-2 transition-transform duration-500 z-10"
      >
        {/* Inner Image Container */}
        <div className="relative w-full h-56 bg-gradient-to-br from-zinc-800/80 to-zinc-900 rounded-2xl mb-6 flex-shrink-0 flex items-center justify-center p-6 border border-white/5 overflow-hidden">

          {/* Featured badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-ibiza-red/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
            <Flame className="w-3 h-3" />
            Destacada
          </div>

          {/* Year badge */}
          <div className="absolute top-3 right-3 z-20 bg-ibiza-gold text-white font-display font-bold text-xs px-3 py-1 rounded-full shadow-lg">
            {motorcycle.year}
          </div>

          {motorcycle.images && motorcycle.images.length > 0 ? (
            <img
              src={motorcycle.images[0]}
              alt={motorcycle.model}
              className={`relative z-10 max-h-full max-w-full object-contain filter drop-shadow-xl transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
          ) : (
            <div
              className="w-40 h-32 rounded-2xl flex items-center justify-center shadow-xl"
              style={{ backgroundColor: getBrandColor(motorcycle.brand) }}
            >
              <span className="!text-white font-display font-bold text-4xl">
                {motorcycle.brand.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 w-full flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-display font-semibold text-gray-500 uppercase tracking-wider">
              {motorcycle.brand}
            </span>
            <span className="w-1 h-1 bg-gray-600 rounded-full" />
            <span className="text-xs font-display text-gray-500">
              {motorcycle.category}
            </span>
          </div>

          <h3 className="font-display font-bold text-xl text-white mb-2">
            {motorcycle.model}
          </h3>

          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
            {motorcycle.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-xs text-gray-500">Precio desde</span>
              <p className="font-display font-bold text-2xl text-ibiza-red">
                {formatPrice(motorcycle.price)}
              </p>
              <p className="text-[10px] text-ibiza-gold/70 font-semibold mt-0.5">
                o {calcCuota(motorcycle.price)}<span className="text-gray-600">/mes</span>
              </p>
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(motorcycle);
              }}
              size="sm"
              className="bg-ibiza-black border border-ibiza-red/30 hover:bg-ibiza-red !text-white rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(227,25,55,0.4)]"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface FeaturedMotorcyclesProps {
  onViewDetails: (motorcycle: Motorcycle) => void;
}

export default function FeaturedMotorcycles({ onViewDetails }: FeaturedMotorcyclesProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { motorcycles, loading } = useMotorcycles();
  const featuredMotorcycles = motorcycles.filter(m => m.featured);

  if (loading) return null;

  return (
    <section id="motos" className="py-24 bg-ibiza-black" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p
            className={`text-ibiza-red font-display font-semibold text-sm tracking-widest uppercase mb-4 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
          >
            🔥 Las Más Pedidas
          </p>

          <h2
            className={`font-display font-bold text-4xl md:text-5xl text-white mb-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
          >
            MOTOS DESTACADAS
          </h2>

          <div
            className={`w-24 h-1 bg-gradient-ibiza mx-auto rounded-full transition-all duration-800 delay-200 ${isVisible ? 'scale-x-100' : 'scale-x-0'
              }`}
          />

          <p
            className={`text-gray-500 mt-4 max-w-xl mx-auto transition-all duration-600 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'
              }`}
          >
            Las favoritas de nuestros clientes, seleccionadas por su rendimiento, diseño y valor.
          </p>
        </div>

        {/* Premium Cards grid - matching catalog style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMotorcycles.map((motorcycle, index) => (
            <PremiumMotoCard
              key={motorcycle.id}
              motorcycle={motorcycle}
              index={index}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-16 opacity-0 animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <a href="#catalogo">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/10 text-white hover:bg-ibiza-red hover:border-ibiza-red hover:!text-white font-display font-semibold px-8 py-6 rounded-full transition-all duration-300 group"
            >
              Ver Catálogo Completo
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
