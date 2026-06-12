import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Motorcycle } from '@/types';
import { Search, X, SlidersHorizontal, ArrowRight, Gauge, Zap, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

// ─── Stock badge config ───────────────────────────────────────────────────────
const stockConfig = {
  available: { label: 'En stock', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
  limited:   { label: 'Últimas unidades', color: 'bg-amber-50 text-amber-700 border-amber-200', Icon: AlertCircle },
  order:     { label: 'Bajo pedido', color: 'bg-blue-50 text-blue-700 border-blue-200', Icon: Clock },
} as const;
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { brands, categories } from '@/data/motorcycles';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useMotorcycles } from '@/hooks/useMotorcycles';
import { motion } from 'framer-motion';
import { CompareButton } from '@/components/MotoComparator';

export interface CatalogDarkTheme {
  primary: string;   // hex, ej: '#0062B1'
  bg: string;        // hex, ej: '#080E1A'
  glowRgb: string;   // ej: '0, 98, 177'
}

interface CatalogProps {
  onViewDetails: (motorcycle: Motorcycle) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  hideTitle?: boolean;
  hideBrandFilter?: boolean;
  initialCategory?: string;
  darkTheme?: CatalogDarkTheme;
}

const colorMap: Record<string, string> = {
  'Negro Mate': '#1a1a1a', 'Negro': '#111', 'Rojo': '#dc2626',
  'Blanco': '#f5f5f5', 'Azul': '#2563eb', 'Azul Metálico': '#1e40af',
  'Verde': '#16a34a', 'Verde Militar': '#3f4f3a', 'Gris': '#6b7280',
  'Gris Verde': '#5f6b5a', 'Gris Brillante': '#9ca3af', 'Gris/Negro': '#374151',
  'Naranja': '#f97316', 'Amarillo': '#eab308', 'Dorado': '#d97706',
  'Plateado': '#9ca3af', 'Café': '#92400e', 'Púrpura': '#7c3aed',
  'Lima': '#84cc16', 'Beige': '#d4b896', 'Neon': '#39ff14',
  'Rojo/Blanco': '#dc2626', 'Azul/Negro': '#1e40af', 'Negro/Rojo': '#111',
  'Negro/Azul': '#111', 'Negro/Gris': '#111', 'Gris/Lima': '#6b7280',
  'Negro/Púrpura': '#111', 'Verde/Negro': '#16a34a', 'Naranja/Negro': '#f97316',
  'Blanco/Azul': '#f5f5f5', 'Blanco/Negro': '#f5f5f5',
  'Rojo Passion': '#dc2626', 'Negro Graphite': '#111',
  'Blanco Perlado': '#f5f5f5', 'Negro Metallic': '#111', 'Gris Glacial': '#9ca3af',
  'Blanco/Rojo': '#f5f5f5',
  'Rojo/Negro': '#dc2626', 'Negro/Lima': '#111', 'Verde Neon': '#39ff14',
};

// ─── Premium Motorcycle Card ───
const MotoCard = ({
  motorcycle,
  index,
  onViewDetails,
  darkTheme,
}: {
  motorcycle: Motorcycle;
  index: number;
  onViewDetails: (motorcycle: Motorcycle) => void;
  darkTheme?: CatalogDarkTheme;
}) => {
  const dk = darkTheme;
  const cc = motorcycle.specifications?.engine?.match(/([0-9.]+)\s*cc/i)?.[1] || '';
  const hp = motorcycle.specifications?.power?.match(/([0-9.]+)\s*HP/i)?.[1] || '';

  // Color picker state — solo motos con imagesByColor real
  const colorKeys = motorcycle.imagesByColor ? Object.keys(motorcycle.imagesByColor) : [];
  const [selectedColor, setSelectedColor] = useState<string | null>(colorKeys[0] ?? null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const activeImage = useMemo(() => {
    if (selectedColor && motorcycle.imagesByColor?.[selectedColor]?.[0]) {
      return motorcycle.imagesByColor[selectedColor][0];
    }
    return motorcycle.images?.[0] ?? null;
  }, [selectedColor, motorcycle]);

  useEffect(() => { setImgLoaded(false); }, [activeImage]);

  const handleColorClick = useCallback((e: React.MouseEvent, color: string) => {
    e.stopPropagation();
    setSelectedColor(color);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      onClick={() => onViewDetails(motorcycle)}
      className="group cursor-pointer"
    >
      <div
        className="relative rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-500"
        style={dk ? {
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        } : {
          backgroundColor: '#fff',
          border: '1px solid #f3f4f6',
        }}
        onMouseEnter={e => { if (dk) (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(${dk.glowRgb}, 0.5)`; }}
        onMouseLeave={e => { if (dk) (e.currentTarget as HTMLDivElement).style.borderColor = '#e8e8e8'; }}
      >

        {/* ── IMAGE AREA ── */}
        <div className="relative h-72 overflow-hidden rounded-[14px] m-4 mb-0">
          {/* Background — fondo claro uniforme para todas las fotos */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{ background: dk
              ? `linear-gradient(160deg, #F8FAFB 0%, rgba(${dk.glowRgb}, 0.04) 100%)`
              : 'linear-gradient(to bottom, #f9fafb, #f3f4f6)'
            }}
          />

          {/* Skeleton */}
          {!imgLoaded && activeImage && (
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
            </div>
          )}

          {/* The motorcycle image */}
          <div className="absolute inset-0 flex items-center justify-center p-5">
            {activeImage ? (
              <img
                src={activeImage}
                alt={motorcycle.model}
                loading="lazy"
                decoding="async"
                onLoad={() => setImgLoaded(true)}
                className={`max-h-full max-w-full object-contain relative z-10 transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            ) : (
              <span className={`font-display font-black text-7xl uppercase ${dk ? 'text-black/5' : 'text-black/5'}`}>
                {motorcycle.brand}
              </span>
            )}
          </div>

          {/* Top info overlay */}
          <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start z-20">
            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-lg tracking-widest shadow-md bg-white text-gray-900 border border-gray-200">
                {motorcycle.year}
              </span>
              {motorcycle.stock && (() => {
                const cfg = stockConfig[motorcycle.stock];
                return (
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border shadow-sm ${cfg.color}`}>
                    <cfg.Icon className="w-2.5 h-2.5" />{cfg.label}
                  </span>
                );
              })()}
            </div>
            <div className="flex gap-1.5 items-center">
              {cc && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-md bg-white text-gray-900 border border-gray-200">
                  <Gauge className="w-3 h-3" style={{ color: dk ? dk.primary : '#d7263d' }} />{cc}cc
                </span>
              )}
              {hp && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-md bg-white text-gray-900 border border-gray-200">
                  <Zap className="w-3 h-3 text-ibiza-gold" />{hp}HP
                </span>
              )}
            </div>
          </div>

          {/* Accent line at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: dk
              ? `linear-gradient(to right, transparent, ${dk.primary}, transparent)`
              : 'linear-gradient(to right, transparent, rgba(215,38,61,0.4), transparent)'
            }}
          />
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="relative px-6 pb-6 pt-5 flex-1 flex flex-col z-20">

          {/* Brand tag */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[11px] font-bold tracking-[0.15em] uppercase"
              style={{ color: dk ? dk.primary : '#d7263d' }}
            >
              {motorcycle.brand}
            </span>
            <span className={dk ? 'text-gray-200' : 'text-gray-200'}>|</span>
            <span className={`text-[11px] tracking-wider uppercase ${dk ? 'text-gray-400' : 'text-gray-400'}`}>
              {motorcycle.category}
            </span>
          </div>

          {/* Model Name */}
          <h3 className={`font-display font-bold text-[28px] leading-tight tracking-tight mb-3 ${dk ? 'text-gray-900' : 'text-gray-900'}`}>
            {motorcycle.model}
          </h3>

          {/* Color Picker */}
          {colorKeys.length > 0 && (
            <div className="flex items-center gap-2 mb-4" onClick={e => e.stopPropagation()}>
              <div className="flex gap-1.5">
                {colorKeys.slice(0, 6).map((color) => (
                  <button
                    key={color}
                    onClick={(e) => handleColorClick(e, color)}
                    className={`rounded-full transition-all duration-200 flex-shrink-0 ${
                      selectedColor === color ? 'w-7 h-7 scale-110' : 'w-5 h-5 border-2 shadow-sm hover:scale-110'
                    }`}
                    style={{
                      backgroundColor: colorMap[color] || '#555',
                      border: selectedColor === color ? `3px solid ${dk ? dk.primary : '#d7263d'}` : undefined,
                      boxShadow: selectedColor === color ? `0 0 0 1px ${dk ? 'white' : 'white'}` : undefined,
                    }}
                    title={color}
                  />
                ))}
                {colorKeys.length > 6 && (
                  <span className={`text-[10px] font-medium self-center ml-1 ${dk ? 'text-gray-400' : 'text-gray-400'}`}>
                    +{colorKeys.length - 6}
                  </span>
                )}
              </div>
              {selectedColor && (
                <span className={`text-[10px] font-medium ${dk ? 'text-gray-500' : 'text-gray-500'}`}>{selectedColor}</span>
              )}
            </div>
          )}

          <div className="flex-1" />

          {/* Price & Action */}
          <div className="flex items-end justify-between pt-5 mt-auto">
            <div>
              <p className={`text-[10px] font-medium tracking-widest uppercase mb-1 ${dk ? 'text-gray-400' : 'text-gray-400'}`}>Desde</p>
              <p
                className="font-display font-black text-[28px] leading-none tracking-tight transition-colors duration-500"
                style={{ color: '#111' }}
                onMouseEnter={e => { if (dk) (e.currentTarget as HTMLParagraphElement).style.color = dk.primary; }}
                onMouseLeave={e => { if (dk) (e.currentTarget as HTMLParagraphElement).style.color = '#111'; }}
              >
                ${new Intl.NumberFormat('es-CO').format(motorcycle.price)}
              </p>
            </div>

            {/* CTA Arrow */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
              style={dk ? { backgroundColor: '#f9fafb', border: '1px solid #e8e8e8' } : { backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = dk ? dk.primary : '#d7263d'; (e.currentTarget as HTMLDivElement).style.borderColor = dk ? dk.primary : '#d7263d'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 25px rgba(${dk?.glowRgb ?? '215,38,61'},0.4)`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = dk ? '#f9fafb' : '#f9fafb'; (e.currentTarget as HTMLDivElement).style.borderColor = dk ? '#e8e8e8' : '#e5e7eb'; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
            >
              <ArrowRight className={`w-5 h-5 group-hover:translate-x-0.5 transition-all duration-300 ${dk ? 'text-gray-400 group-hover:text-white' : 'text-gray-400 group-hover:text-white'}`} />
            </div>
          </div>

          {/* Compare button */}
          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#ececec' }} onClick={e => e.stopPropagation()}>
            <CompareButton motorcycle={motorcycle} asRow />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Catalog({ onViewDetails, selectedBrand, setSelectedBrand, hideTitle, hideBrandFilter, initialCategory, darkTheme }: CatalogProps) {
  const dk = darkTheme;
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
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
      <section id="catalogo" className="py-24 min-h-[50vh] flex justify-center items-center" style={{ backgroundColor: dk ? '#ffffff' : '#f9fafb' }}>
        <div className="text-xl animate-pulse font-display font-medium" style={{ color: dk?.primary ?? '#d7263d' }}>Cargando inventario...</div>
      </section>
    );
  }

  return (
    <section id="catalogo" className="py-24 min-h-screen relative overflow-hidden" style={{ backgroundColor: dk ? '#ffffff' : '#f9fafb' }} ref={ref}>

      {/* Brand Dynamic Background Watermark */}
      {activeBrandInfo && (
        <div className="flex z-0 fixed inset-0 pointer-events-none items-center justify-center overflow-hidden opacity-[0.03] transition-opacity duration-700">
          <img
            src={activeBrandInfo.logo}
            alt={`${activeBrandInfo.name} watermark`}
            loading="lazy"
            decoding="async"
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
                className="font-display font-bold text-4xl md:text-5xl text-gray-900"
              >
                NUESTRAS MOTOS
              </motion.h2>
            </div>
          )}

          {/* Search */}
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: dk ? '#999999' : '#9ca3af' }} />
              <Input
                type="text"
                placeholder="Buscar moto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full md:w-72 rounded-xl"
                style={dk ? {
                  backgroundColor: '#fff',
                  border: '1px solid #e8e8e8',
                  color: '#111',
                } : {}}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl px-4"
              style={showFilters
                ? { backgroundColor: dk?.primary ?? '#d7263d', color: '#fff', borderColor: dk?.primary ?? '#d7263d' }
                : dk ? { backgroundColor: '#fff', borderColor: '#e8e8e8', color: '#666666' } : {}
              }
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* ── BRAND PILLS ── */}
        {!hideBrandFilter && <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedBrand('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${selectedBrand === 'all'
              ? 'bg-ibiza-red text-white shadow-[0_4px_14px_rgba(215,38,61,0.3)]'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
              }`}
          >
            Todas
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(selectedBrand === brand.name ? 'all' : brand.name)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2.5 ${selectedBrand === brand.name
                ? 'bg-ibiza-red text-white shadow-[0_4px_14px_rgba(215,38,61,0.3)]'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
                }`}
            >
              <img src={brand.logo} alt={brand.name} loading="lazy" decoding="async" className="w-4 h-4 object-contain rounded-[2px]" style={{
                opacity: selectedBrand === brand.name ? 1 : 0.6,
                filter: selectedBrand === brand.name ? 'none' : 'grayscale(1)',
                mixBlendMode: 'multiply'
              }} />
              {brand.name}
            </button>
          ))}
        </div>}


        {/* ── EXTENDED FILTERS ── */}
        {showFilters && (
          <div className="mb-8 animate-slide-down">
            <div
              className="rounded-2xl p-6 border"
              style={dk ? { backgroundColor: '#fff', borderColor: '#e8e8e8', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' } : { backgroundColor: '#fff', borderColor: '#f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className={`block text-[10px] font-bold mb-2 tracking-widest uppercase ${dk ? 'text-gray-400' : 'text-gray-400'}`}>Categoría</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                    style={dk ? { backgroundColor: '#fff', borderColor: '#e8e8e8', color: '#111' } : { backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111' }}
                  >
                    <option value="all">Todas</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-[10px] font-bold mb-2 tracking-widest uppercase ${dk ? 'text-gray-400' : 'text-gray-400'}`}>Ordenar</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                    style={dk ? { backgroundColor: '#fff', borderColor: '#e8e8e8', color: '#111' } : { backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111' }}
                  >
                    <option value="name">Nombre</option>
                    <option value="price-asc">Menor precio</option>
                    <option value="price-desc">Mayor precio</option>
                  </select>
                </div>
                <div className="flex items-end">
                  {hasActiveFilters && (
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="w-full rounded-xl"
                      style={{ color: dk?.primary ?? '#d7263d', borderColor: dk ? `rgba(${dk.glowRgb},0.3)` : 'rgba(215,38,61,0.2)', backgroundColor: dk ? `rgba(${dk.glowRgb},0.08)` : 'rgba(215,38,61,0.05)' }}
                    >
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
          <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-400'}`}>
            Mostrando <span className={`font-bold ${dk ? 'text-gray-900' : 'text-gray-900'}`}>{filteredMotorcycles.length}</span> motos
          </p>
        </div>

        {/* ── CARDS GRID ── */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMotorcycles.map((motorcycle, index) => (
            <MotoCard
              key={motorcycle.id}
              motorcycle={motorcycle}
              index={index}
              onViewDetails={onViewDetails}
              darkTheme={dk}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredMotorcycles.length === 0 && (
          <div className="text-center py-20">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border ${dk ? 'bg-gray-100 border-gray-200' : 'bg-gray-100 border-gray-200'}`}>
              <Search className={`w-8 h-8 ${dk ? 'text-gray-300' : 'text-gray-300'}`} />
            </div>
            <h3 className={`font-display font-bold text-xl mb-2 ${dk ? 'text-gray-900' : 'text-gray-900'}`}>No se encontraron motos</h3>
            <p className={`mb-6 text-sm ${dk ? 'text-gray-400' : 'text-gray-400'}`}>Intenta ajustar tus filtros de búsqueda</p>
            <Button
              onClick={clearFilters}
              className="text-white rounded-xl px-8"
              style={{ backgroundColor: dk?.primary ?? '#d7263d' }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
