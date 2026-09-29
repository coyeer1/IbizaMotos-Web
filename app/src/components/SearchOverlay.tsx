import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, CornerDownLeft, Zap, Wallet, Briefcase, Mountain, Truck, Gauge, MessageCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMotorcycles } from '@/hooks/useMotorcycles';
import type { Motorcycle } from '@/types';
import { trackSearch } from '@/lib/analytics';
import { getWhatsAppUrl } from '@/lib/config';
import { searchMotos, removeChip, engineCc, formatCOP, type SearchChip } from '@/lib/motoSearch';

// ── Context ───────────────────────────────────────────────────────────────────

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

  // Atajo de teclado: Ctrl+K / Cmd+K abre y cierra; Esc cierra.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
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
      <AnimatePresence>{open && <SearchPanel key="search" />}</AnimatePresence>
    </SearchContext.Provider>
  );
}

// El hook vive junto al provider a proposito (API publica usada por la Navbar).
// eslint-disable-next-line react-refresh/only-export-components
export function useSearch() {
  return useContext(SearchContext);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const CATEGORY_LABEL: Record<string, string> = {
  Scooters: 'Automática',
  City: 'Urbana',
  'Urban Sport': 'Deportiva',
  Rebels: 'Clásica',
  Enduro: 'Enduro',
  Adventure: 'Aventura',
  Motocarros: 'Motocarro',
};

const QUICK_SEARCHES = [
  { label: 'Automáticas', query: 'automatica', Icon: Zap },
  { label: 'Menos de $7 millones', query: 'menos de 7 millones', Icon: Wallet },
  { label: 'Para trabajar', query: 'para trabajar', Icon: Briefcase },
  { label: 'Enduro', query: 'enduro', Icon: Mountain },
  { label: 'Motocarros', query: 'motocarro', Icon: Truck },
  { label: 'Deportivas', query: 'deportiva', Icon: Gauge },
];

// ── Fila de resultado ─────────────────────────────────────────────────────────

function ResultRow({
  moto,
  index,
  active,
  onSelect,
  onHover,
}: {
  moto: Motorcycle;
  index: number;
  active: boolean;
  onSelect: (moto: Motorcycle) => void;
  onHover: (index: number) => void;
}) {
  const cc = engineCc(moto);
  const meta = [CATEGORY_LABEL[moto.category] ?? moto.category, cc ? `${Math.round(cc)} cc` : null].filter(Boolean).join(' · ');
  return (
    <li
      id={`search-opt-${moto.id}`}
      role="option"
      aria-selected={active}
      onMouseMove={() => onHover(index)}
      onClick={() => onSelect(moto)}
      className={`relative flex items-center gap-4 pl-3 pr-4 py-2.5 min-h-[76px] rounded-2xl cursor-pointer transition-colors duration-100
        ${active ? 'bg-neutral-100' : 'bg-transparent'}`}
    >
      <span
        aria-hidden
        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-ibiza-brand transition-opacity duration-150 ${active ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="w-[88px] h-[60px] flex-shrink-0 bg-white rounded-xl border border-neutral-200/80 overflow-hidden flex items-center justify-center">
        {moto.images?.[0] ? (
          <img src={moto.images[0]} alt="" loading="lazy" decoding="async" className="w-full h-full object-contain p-1.5" />
        ) : (
          <Zap className="w-5 h-5 text-neutral-300" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-ibiza-brand leading-none mb-1">{moto.brand}</p>
        <p className="font-display text-[22px] leading-none text-neutral-900 truncate">{moto.model}</p>
        <p className="text-xs text-neutral-500 mt-1 truncate">{meta}</p>
      </div>

      <div className="flex-shrink-0 text-right">
        {moto.price > 0 ? (
          <>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 leading-none mb-1">Desde</p>
            <p className="font-display text-xl leading-none text-neutral-900">{formatCOP(moto.price)}</p>
          </>
        ) : (
          <p className="text-sm font-semibold text-neutral-500">Consultar</p>
        )}
      </div>

      <ArrowRight
        aria-hidden
        className={`hidden sm:block w-4 h-4 flex-shrink-0 transition-all duration-150 ${active ? 'text-ibiza-brand translate-x-0.5' : 'text-neutral-300'}`}
      />
    </li>
  );
}

// ── Panel ─────────────────────────────────────────────────────────────────────

function SearchPanel() {
  const { closeSearch } = useSearch();
  const { motorcycles } = useMotorcycles();
  const navigate = useNavigate();

  // Se monta cada vez que se abre: el estado arranca limpio sin efectos.
  const [query, setQueryRaw] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const setQuery = (q: string) => { setQueryRaw(q); setActiveIndex(0); };

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    // Sin scroll de fondo mientras el buscador esta abierto.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { clearTimeout(t); document.body.style.overflow = prev; };
  }, []);

  // Rebote: no disparar en cada tecla, solo cuando el visitante deja de escribir.
  useEffect(() => {
    if (!query.trim()) return;
    const t = setTimeout(() => trackSearch(query), 800);
    return () => clearTimeout(t);
  }, [query]);

  const hasQuery = query.trim().length > 0;
  const search = useMemo(() => (hasQuery ? searchMotos(motorcycles, query) : null), [motorcycles, query, hasQuery]);
  const featured = useMemo(() => motorcycles.filter(m => m.featured).slice(0, 6), [motorcycles]);

  const results = search ? (search.total ? search.results : search.closest) : featured;
  const noExact = !!search && search.total === 0;
  const chips = search?.parsed.chips ?? [];

  const handleSelect = (moto: Motorcycle) => {
    closeSearch();
    navigate(`/moto/${moto.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    }
  };

  // La fila activa siempre visible al navegar con el teclado.
  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const dropChip = (chip: SearchChip) => {
    setQuery(removeChip(query, chip));
    inputRef.current?.focus();
  };

  const activeId = results[activeIndex] ? `search-opt-${results[activeIndex].id}` : undefined;
  const whatsapp = getWhatsAppUrl(`Hola, estoy buscando una moto: "${query.trim()}". ¿Me pueden asesorar?`);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[160] flex sm:items-start sm:justify-center sm:pt-[9vh] sm:px-4"
      onMouseDown={closeSearch}
    >
      <div className="absolute inset-0 bg-neutral-950/45 backdrop-blur-md" aria-hidden />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Buscar motos"
        initial={{ opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        onMouseDown={e => e.stopPropagation()}
        className="relative flex flex-col w-full h-[100dvh] sm:h-auto sm:max-h-[78vh] sm:max-w-[720px] bg-white sm:rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] sm:ring-1 sm:ring-black/5 overflow-hidden font-body"
      >
        {/* Campo de busqueda */}
        <div className="flex items-center gap-3 pl-5 pr-3 h-[68px] border-b border-neutral-100 flex-shrink-0">
          <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-listbox"
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            aria-label="Buscar moto, marca, precio o tipo"
            placeholder="Busca por modelo, marca, precio o tipo…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0 bg-transparent text-neutral-900 placeholder:text-neutral-400 text-[17px] sm:text-lg outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              aria-label="Borrar búsqueda"
              className="w-11 h-11 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 rounded-md border border-neutral-200 bg-neutral-50 text-[10px] font-mono text-neutral-500">ESC</kbd>
          <button
            type="button"
            onClick={closeSearch}
            className="sm:hidden h-11 px-2 text-sm font-semibold text-neutral-600"
          >
            Cerrar
          </button>
        </div>

        {/* Filtros entendidos */}
        <AnimatePresence initial={false}>
          {chips.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex-shrink-0 overflow-hidden border-b border-neutral-100"
            >
              <div className="flex items-center gap-2 px-5 py-3 overflow-x-auto no-scrollbar">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden /> Entendí
                </span>
                {chips.map(chip => (
                  <button
                    key={chip.key + chip.label}
                    type="button"
                    onClick={() => dropChip(chip)}
                    aria-label={`Quitar filtro ${chip.label}`}
                    className="group inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full bg-ibiza-brand/10 text-ibiza-brand text-xs font-semibold whitespace-nowrap hover:bg-ibiza-brand/15 transition-colors"
                  >
                    {chip.label}
                    <X className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" aria-hidden />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-2.5 sm:px-3 py-3">
          {!hasQuery && (
            <div className="px-2.5 pb-4">
              <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-400 mb-3">Búsquedas rápidas</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUICK_SEARCHES.map(({ label, query: q, Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => { setQuery(q); inputRef.current?.focus(); }}
                    className="flex items-center gap-2.5 min-h-[48px] px-3.5 rounded-2xl border border-neutral-200 text-left text-sm font-semibold text-neutral-700 hover:border-ibiza-brand/40 hover:bg-ibiza-brand/[0.04] hover:text-neutral-900 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-ibiza-brand flex-shrink-0" aria-hidden />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {noExact && (
            <div className="px-4 pt-6 pb-5 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center">
                <Search className="w-6 h-6 text-neutral-400" aria-hidden />
              </div>
              <p className="font-display text-2xl text-neutral-900 leading-tight">No encontramos “{query.trim()}”</p>
              {search?.didYouMean ? (
                <p className="text-sm text-neutral-500 mt-2">
                  ¿Quisiste decir{' '}
                  <button
                    type="button"
                    onClick={() => { setQuery(search.didYouMean!); inputRef.current?.focus(); }}
                    className="font-semibold text-ibiza-brand underline underline-offset-4 decoration-ibiza-brand/30 hover:decoration-ibiza-brand"
                  >
                    {search.didYouMean}
                  </button>
                  ?
                </p>
              ) : (
                <p className="text-sm text-neutral-500 mt-2">
                  {chips.length ? 'Prueba quitando algún filtro de arriba.' : 'Prueba con otra marca, modelo o tipo de moto.'}
                </p>
              )}
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 h-11 px-5 rounded-full bg-[#25D366] text-white text-sm font-bold hover:bg-[#1ebe5b] transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden />
                Pregúntale a un asesor
              </a>
            </div>
          )}

          {results.length > 0 && (
            <>
              <p className="px-2.5 mb-1.5 text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-400">
                {!hasQuery ? 'Motos destacadas' : noExact ? 'Lo más parecido' : `${search!.total} resultado${search!.total === 1 ? '' : 's'}`}
              </p>
              <ul id="search-listbox" role="listbox" aria-label="Resultados" ref={listRef} className="space-y-0.5">
                {results.map((moto, i) => (
                  <ResultRow
                    key={moto.id}
                    moto={moto}
                    index={i}
                    active={i === activeIndex}
                    onSelect={handleSelect}
                    onHover={setActiveIndex}
                  />
                ))}
              </ul>
              {search && search.total > search.results.length && (
                <p className="px-2.5 pt-3 text-xs text-neutral-400">
                  Mostrando {search.results.length} de {search.total}. Afina la búsqueda para ver menos.
                </p>
              )}
            </>
          )}
        </div>

        {/* Pie con atajos (solo escritorio) */}
        <div className="hidden sm:flex items-center justify-between px-5 h-11 border-t border-neutral-100 bg-neutral-50/70 text-[11px] text-neutral-500 flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-neutral-200 bg-white font-mono">↑↓</kbd> navegar
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-neutral-200 bg-white font-mono inline-flex items-center"><CornerDownLeft className="w-3 h-3" /></kbd> abrir
            </span>
          </div>
          <span>Prueba: “automática menos de 8 millones”</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
