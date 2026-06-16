import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMotorcycles } from '@/hooks/useMotorcycles';
import type { Motorcycle } from '@/types';

// ── Context ───────────────────────────────────────────────────────────────────

import { createContext, useContext } from 'react';

interface SearchContextValue {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const SearchContext = createContext<SearchContextValue>({
  open: false,
  openSearch: () => {},
  closeSearch: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <SearchContext.Provider value={{ open, openSearch, closeSearch }}>
      {children}
      <SearchOverlay />
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  if (!price || price <= 0) return 'Consultar';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

const STOCK_LABELS: Record<string, { label: string; color: string }> = {
  available: { label: 'Disponible', color: 'text-emerald-400' },
  limited:   { label: 'Últimas unidades', color: 'text-ibiza-gold' },
  order:     { label: 'Por encargo', color: 'text-gray-400' },
};

// ── Result card ───────────────────────────────────────────────────────────────

function ResultCard({
  moto,
  active,
  onSelect,
}: {
  moto: Motorcycle;
  active: boolean;
  onSelect: (moto: Motorcycle) => void;
}) {
  const stock = STOCK_LABELS[moto.stock ?? 'available'];
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      onClick={() => onSelect(moto)}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-150 text-left group
        ${active ? 'bg-ibiza-red/10 ring-1 ring-ibiza-red/30' : 'hover:bg-white/[0.04]'}`}
    >
      {/* Thumbnail */}
      <div className="w-16 h-12 flex-shrink-0 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center">
        {moto.images?.[0] ? (
          <img
            src={moto.images[0]}
            alt={moto.model}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <Zap className="w-5 h-5 text-white/20" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-ibiza-red tracking-widest uppercase">{moto.brand}</p>
        <p className="font-display font-bold text-white text-sm leading-tight truncate">{moto.model}</p>
        <p className={`text-[10px] font-medium ${stock.color}`}>{stock.label}</p>
      </div>

      {/* Price + arrow */}
      <div className="flex-shrink-0 text-right">
        <p className="font-display font-black text-ibiza-gold text-sm">{formatPrice(moto.price)}</p>
        <p className="text-[10px] text-gray-500">{moto.category}</p>
      </div>

      <ArrowRight className={`w-4 h-4 flex-shrink-0 transition-all duration-150
        ${active ? 'text-ibiza-red translate-x-0.5' : 'text-white/20 group-hover:text-white/50'}`}
      />
    </motion.button>
  );
}

// ── Main overlay ──────────────────────────────────────────────────────────────

function SearchOverlay() {
  const { open, closeSearch } = useSearch();
  const { motorcycles } = useMotorcycles();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset & focus when opening
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Filter motorcycles
  const results: Motorcycle[] = query.trim().length < 1
    ? motorcycles.filter(m => m.featured).slice(0, 6)
    : motorcycles.filter(m => {
        const q = query.toLowerCase();
        return (
          m.model.toLowerCase().includes(q) ||
          m.brand.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
        );
      }).slice(0, 8);

  const handleSelect = (moto: Motorcycle) => {
    closeSearch();
    navigate(`/moto/${moto.id}`);
  };

  // Keyboard navigation within results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      handleSelect(results[activeIndex]);
    }
  };

  // Reset active index when results change
  useEffect(() => { setActiveIndex(0); }, [query]);

  const isEmpty = query.trim().length > 1 && results.length === 0;
  const showLabel = query.trim().length < 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex flex-col items-center pt-[8vh] px-4 pb-8"
          onClick={closeSearch}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: -12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="relative w-full max-w-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Search box */}
            <div className="bg-[#111113] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Input row */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar moto, marca o categoría..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-base outline-none font-medium"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-gray-600 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-500 font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-3">
                {showLabel && (
                  <p className="text-[10px] font-bold text-gray-600 tracking-widest uppercase px-2 mb-2">
                    Motos destacadas
                  </p>
                )}

                {!isEmpty && (
                  <div className="space-y-0.5">
                    <AnimatePresence mode="popLayout">
                      {results.map((moto, i) => (
                        <ResultCard
                          key={moto.id}
                          moto={moto}
                          active={i === activeIndex}
                          onSelect={handleSelect}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {isEmpty && (
                  <div className="py-10 text-center">
                    <Search className="w-10 h-10 text-white/10 mx-auto mb-3" />
                    <p className="text-white/40 font-medium">Sin resultados para "{query}"</p>
                    <p className="text-white/20 text-sm mt-1">Intenta con otra marca o modelo</p>
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/[0.06] bg-white/[0.015]">
                <div className="flex items-center gap-4 text-[10px] text-gray-600">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 font-mono">↑↓</kbd>
                    navegar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 font-mono">Enter</kbd>
                    abrir
                  </span>
                </div>
                <span className="text-[10px] text-gray-600">
                  {results.length} resultado{results.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
