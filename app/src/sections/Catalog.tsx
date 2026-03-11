import { useState, useMemo } from 'react';
import type { Motorcycle } from '@/types';
import { Search, X, SlidersHorizontal, ArrowRight, Gauge, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { brands, categories } from '@/data/motorcycles';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useMotorcycles } from '@/hooks/useMotorcycles';
import { motion } from 'framer-motion';

interface CatalogProps {
  onViewDetails: (motorcycle: Motorcycle) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  hideTitle?: boolean;
}

const colorMap: Record<string, string> = {
  'Negro Mate': '#1a1a1a', 'Negro': '#111', 'Rojo': '#dc2626',
  'Blanco': '#e5e5e5', 'Azul': '#2563eb', 'Azul Metálico': '#1e40af',
  'Verde': '#16a34a', 'Verde Militar': '#3f4f3a', 'Gris': '#6b7280',
  'Naranja': '#f97316',
};

// ─── Premium Motorcycle Card ───
const MotoCard = ({
  motorcycle,
  index,
  onViewDetails,
}: {
  motorcycle: Motorcycle;
  index: number;
  onViewDetails: (motorcycle: Motorcycle) => void;
}) => {
  const cc = motorcycle.specifications?.engine?.match(/([0-9.]+)\s*cc/i)?.[1] || '';
  const hp = motorcycle.specifications?.power?.match(/([0-9.]+)\s*HP/i)?.[1] || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={() => onViewDetails(motorcycle)}
      className="group cursor-pointer"
    >
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#141416] to-[#0c0c0e] border border-white/[0.04] h-full flex flex-col transition-all duration-500 hover:border-ibiza-red/30 hover:shadow-[0_0_50px_rgba(227,25,55,0.08)]">

        {/* ── IMAGE AREA ── */}
        <div className="relative h-64 overflow-hidden rounded-xl m-3 mb-0">
          {/* Clean light background for maximum image visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f5] to-[#e8e8e8] rounded-xl" />

          {/* The motorcycle image — CLEAR and prominent */}
          <div className="absolute inset-0 flex items-center justify-center p-5">
            {motorcycle.images && motorcycle.images.length > 0 ? (
              <img
                src={motorcycle.images[0]}
                alt={motorcycle.model}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain relative z-10 transition-all duration-700 group-hover:scale-110"
              />
            ) : (
              <span className="text-black/5 font-display font-black text-7xl uppercase">
                {motorcycle.brand}
              </span>
            )}
          </div>

          {/* Top info overlay */}
          <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start z-20">
            <span className="text-[10px] font-bold text-white bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg tracking-widest">
              {motorcycle.year}
            </span>
            <div className="flex gap-1.5">
              {cc && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-white bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg">
                  <Gauge className="w-3 h-3 text-ibiza-red" />{cc}cc
                </span>
              )}
              {hp && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-white bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg">
                  <Zap className="w-3 h-3 text-ibiza-gold" />{hp}HP
                </span>
              )}
            </div>
          </div>

          {/* Red accent line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ibiza-red/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="relative px-5 pb-5 pt-4 flex-1 flex flex-col z-20">
          
          {/* Brand tag */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold text-ibiza-red tracking-[0.15em] uppercase">
              {motorcycle.brand}
            </span>
            <span className="text-white/10">|</span>
            <span className="text-[11px] text-white/25 tracking-wider uppercase">
              {motorcycle.category}
            </span>
          </div>

          {/* Model Name */}
          <h3 className="font-display font-bold text-[26px] text-white leading-tight tracking-tight mb-3">
            {motorcycle.model}
          </h3>

          {/* Color Options */}
          {motorcycle.specifications?.colors && motorcycle.specifications.colors.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-1">
                {motorcycle.specifications.colors.slice(0, 5).map((color, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border-2 border-[#0c0c0e]"
                    style={{ backgroundColor: colorMap[color] || '#555', zIndex: 5 - i }}
                    title={color}
                  />
                ))}
              </div>
              <span className="text-[10px] text-white/20 font-medium">
                {motorcycle.specifications.colors.length} colores
              </span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price & Action */}
          <div className="flex items-end justify-between pt-4 mt-auto">
            <div>
              <p className="text-[10px] text-white/20 font-medium tracking-widest uppercase mb-1">Desde</p>
              <p className="font-display font-black text-[28px] text-white leading-none tracking-tight group-hover:text-ibiza-red transition-colors duration-500">
                ${new Intl.NumberFormat('es-CO').format(motorcycle.price)}
              </p>
            </div>

            {/* CTA Arrow */}
            <div className="relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-ibiza-red group-hover:border-ibiza-red group-hover:shadow-[0_0_25px_rgba(227,25,55,0.4)] transition-all duration-400">
                <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Hover border glow effect */}
        <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-ibiza-red/20 transition-all duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default function Catalog({ onViewDetails, selectedBrand, setSelectedBrand, hideTitle }: CatalogProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const { motorcycles, loading } = useMotorcycles();

  const activeBrandInfo = useMemo(() => {
    if (selectedBrand === 'all') return null;
    return brands.find((b) => b.name === selectedBrand) || null;
  }, [selectedBrand]);

  const filteredMotorcycles = useMemo(() => {
    const filtered = motorcycles.filter((moto) => {
      const matchesSearch =
        moto.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        moto.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        moto.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === 'all' || moto.brand === selectedBrand;
      const matchesCategory = selectedCategory === 'all' || moto.category === selectedCategory;
      const matchesPrice = moto.price >= priceRange[0] && moto.price <= priceRange[1];
      return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'name': filtered.sort((a, b) => a.model.localeCompare(b.model)); break;
    }
    return filtered;
  }, [motorcycles, searchQuery, selectedBrand, selectedCategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBrand('all');
    setSelectedCategory('all');
    setPriceRange([0, 20000000]);
  };

  const hasActiveFilters = searchQuery || selectedBrand !== 'all' || selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < 20000000;

  if (loading) {
    return (
      <section id="catalogo" className="py-24 bg-[#09090b] min-h-[50vh] flex justify-center items-center">
        <div className="text-ibiza-red text-xl animate-pulse font-display font-medium">Cargando inventario...</div>
      </section>
    );
  }

  return (
    <section id="catalogo" className="py-24 bg-[#09090b] min-h-screen relative overflow-hidden" ref={ref}>

      {/* Brand Dynamic Background Watermark */}
      {activeBrandInfo && (
        <div className="flex z-0 fixed inset-0 pointer-events-none items-center justify-center overflow-hidden opacity-[0.03] transition-opacity duration-700">
          <img
            src={activeBrandInfo.logo}
            alt={`${activeBrandInfo.name} watermark`}
            className="w-auto h-auto max-w-[80vw] max-h-[80vh] object-contain filter grayscale select-none"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          {!hideTitle && (
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-ibiza-red font-display font-semibold text-sm tracking-widest uppercase mb-3"
              >
                🏍️ Catálogo
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display font-bold text-4xl md:text-5xl text-white"
              >
                NUESTRAS MOTOS
              </motion.h2>
            </div>
          )}

          {/* Search */}
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <Input
                type="text"
                placeholder="Buscar moto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full md:w-72 bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/20 rounded-xl focus:border-ibiza-red focus:ring-ibiza-red"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-xl px-4 border-white/[0.06] text-white/40 bg-white/[0.03] hover:bg-white/[0.06] ${showFilters ? 'bg-ibiza-red !text-white border-ibiza-red hover:bg-ibiza-red' : ''}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* ── BRAND PILLS ── */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedBrand('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${selectedBrand === 'all'
              ? 'bg-ibiza-red text-white shadow-[0_0_20px_rgba(227,25,55,0.3)]'
              : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/50'
              }`}
          >
            Todas
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(selectedBrand === brand.name ? 'all' : brand.name)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2.5 ${selectedBrand === brand.name
                ? 'bg-ibiza-red text-white shadow-[0_0_20px_rgba(227,25,55,0.3)]'
                : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/50'
                }`}
            >
              <img src={brand.logo} alt={brand.name} className="w-4 h-4 object-contain" style={{ filter: selectedBrand === brand.name ? 'brightness(10)' : 'grayscale(1) brightness(0.5)' }} />
              {brand.name}
            </button>
          ))}
        </div>

        {/* ── EXTENDED FILTERS ── */}
        {showFilters && (
          <div className="mb-8 animate-slide-down">
            <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/[0.04]">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-white/20 mb-2 tracking-widest uppercase">Categoría</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/[0.03] text-white rounded-xl border border-white/[0.06] focus:border-ibiza-red outline-none text-sm"
                  >
                    <option value="all">Todas</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/20 mb-2 tracking-widest uppercase">Ordenar</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="w-full px-4 py-2.5 bg-white/[0.03] text-white rounded-xl border border-white/[0.06] focus:border-ibiza-red outline-none text-sm"
                  >
                    <option value="name">Nombre</option>
                    <option value="price-asc">Menor precio</option>
                    <option value="price-desc">Mayor precio</option>
                  </select>
                </div>
                <div className="flex items-end">
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="outline" className="w-full rounded-xl text-ibiza-red border-ibiza-red/20 bg-ibiza-red/5 hover:bg-ibiza-red hover:text-white">
                      <X className="w-4 h-4 mr-2" /> Limpiar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-8">
          <p className="text-white/20 text-sm">
            Mostrando <span className="font-bold text-white">{filteredMotorcycles.length}</span> motos
          </p>
        </div>

        {/* ── CARDS GRID ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMotorcycles.map((motorcycle, index) => (
            <MotoCard
              key={motorcycle.id}
              motorcycle={motorcycle}
              index={index}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredMotorcycles.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/[0.02] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/[0.04]">
              <Search className="w-8 h-8 text-white/10" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">No se encontraron motos</h3>
            <p className="text-white/30 mb-6 text-sm">Intenta ajustar tus filtros de búsqueda</p>
            <Button onClick={clearFilters} className="bg-ibiza-red text-white hover:bg-ibiza-red/80 rounded-xl px-8">
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
