import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, BarChart2, CheckCircle2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { Motorcycle } from '@/types';

// ─── Context ───────────────────────────────────────────────────────────────────

interface ComparatorContextValue {
  selected: Motorcycle[];
  toggle: (moto: Motorcycle) => void;
  isSelected: (id: string) => boolean;
  clear: () => void;
}

const ComparatorContext = createContext<ComparatorContextValue>({
  selected: [],
  toggle: () => {},
  isSelected: () => false,
  clear: () => {},
});

export function ComparatorProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Motorcycle[]>([]);

  const toggle = useCallback((moto: Motorcycle) => {
    setSelected(prev => {
      if (prev.find(m => m.id === moto.id)) return prev.filter(m => m.id !== moto.id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, moto];
    });
  }, []);

  const isSelected = useCallback((id: string) => selected.some(m => m.id === id), [selected]);
  const clear = useCallback(() => setSelected([]), []);

  return (
    <ComparatorContext.Provider value={{ selected, toggle, isSelected, clear }}>
      {children}
      <ComparatorBar />
    </ComparatorContext.Provider>
  );
}

export function useComparator() {
  return useContext(ComparatorContext);
}

// ─── Floating bar at bottom of screen ─────────────────────────────────────────

function ComparatorBar() {
  const { selected, clear } = useComparator();
  const [open, setOpen] = useState(false);

  if (selected.length < 2 && !open) return (
    <AnimatePresence>
      {selected.length === 1 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#141416] border border-white/10 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4"
        >
          <span className="text-white/50 text-sm">Selecciona 1 moto más para comparar</span>
          <button onClick={clear} className="text-white/30 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <AnimatePresence>
        {selected.length >= 2 && !open && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#141416] border border-ibiza-red/30 rounded-2xl px-5 py-3 shadow-[0_0_30px_rgba(227,25,55,0.2)] flex items-center gap-4"
          >
            <div className="flex -space-x-2">
              {selected.map(m => (
                <div key={m.id} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                  {m.images?.[0] ? (
                    <img src={m.images[0]} alt={m.model} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-white/30 text-[8px] font-bold">{m.brand[0]}</span>
                  )}
                </div>
              ))}
            </div>
            <span className="text-white font-bold text-sm">
              {selected.length} motos seleccionadas
            </span>
            <Button
              onClick={() => setOpen(true)}
              className="bg-ibiza-red hover:bg-ibiza-red/90 text-white font-bold rounded-xl px-4 h-9 text-xs group"
            >
              <BarChart2 className="w-4 h-4 mr-1.5" />
              Comparar
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <button onClick={clear} className="text-white/30 hover:text-white transition-colors ml-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ComparatorModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

// ─── Comparison Modal ──────────────────────────────────────────────────────────

const SPEC_ROWS: { key: keyof Motorcycle['specifications']; label: string }[] = [
  { key: 'engine', label: 'Motor' },
  { key: 'power', label: 'Potencia' },
  { key: 'torque', label: 'Torque' },
  { key: 'transmission', label: 'Transmisión' },
  { key: 'weight', label: 'Peso' },
  { key: 'fuelCapacity', label: 'Capacidad' },
];

function extractNumber(val: string | string[] | undefined): number {
  if (!val || Array.isArray(val)) return 0;
  const match = val.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function ComparatorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { selected, clear } = useComparator();
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
  };

  const handleClear = () => {
    clear();
    onClose();
  };

  const lowestPrice = Math.min(...selected.map(m => m.price));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-[#0d0d0f] border border-white/10 rounded-t-3xl md:rounded-3xl w-full md:max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0d0d0f]/95 backdrop-blur-xl z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <BarChart2 className="w-5 h-5 text-ibiza-red" />
                <h3 className="font-display font-bold text-white text-lg">Comparar Motos</h3>
                <span className="text-xs text-gray-500">{selected.length} seleccionadas</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClear}
                  className="text-xs text-gray-500 hover:text-ibiza-red transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Limpiar
                </button>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Moto headers */}
              <div className={`grid gap-4 mb-6`} style={{ gridTemplateColumns: `160px repeat(${selected.length}, 1fr)` }}>
                <div /> {/* empty corner */}
                {selected.map(moto => (
                  <div key={moto.id} className="text-center">
                    {/* Image */}
                    <div className="relative h-32 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-2xl mb-3 overflow-hidden flex items-center justify-center p-3 border border-white/[0.06]">
                      {moto.images?.[0] && (
                        <img src={moto.images[0]} alt={moto.model} className="max-h-full max-w-full object-contain" />
                      )}
                      {moto.price === lowestPrice && (
                        <div className="absolute top-2 right-2 bg-ibiza-gold text-black text-[9px] font-black px-2 py-0.5 rounded-full">
                          MEJOR PRECIO
                        </div>
                      )}
                    </div>
                    <p className="text-ibiza-red text-[10px] font-bold tracking-widest uppercase">{moto.brand}</p>
                    <p className="font-display font-bold text-white text-base leading-tight">{moto.model}</p>
                    <p className="font-display font-black text-ibiza-gold text-lg">
                      ${new Intl.NumberFormat('es-CO').format(moto.price)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Spec rows */}
              <div className="space-y-2">
                {/* Category & Year */}
                {[
                  { label: 'Categoría', getValue: (m: Motorcycle) => m.category },
                  { label: 'Año', getValue: (m: Motorcycle) => String(m.year) },
                  { label: 'Colores', getValue: (m: Motorcycle) => `${m.specifications?.colors?.length || 0} opciones` },
                ].map(row => (
                  <div
                    key={row.label}
                    className="grid gap-4 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                    style={{ gridTemplateColumns: `160px repeat(${selected.length}, 1fr)` }}
                  >
                    <span className="text-[11px] font-bold text-gray-500 tracking-widest uppercase self-center">{row.label}</span>
                    {selected.map(moto => (
                      <div key={moto.id} className="text-center">
                        <span className="text-white text-sm font-medium">{row.getValue(moto)}</span>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Separator */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-[10px] text-gray-600 tracking-widest uppercase font-bold">Especificaciones Técnicas</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                {SPEC_ROWS.map((row, i) => {
                  const values = selected.map(m => {
                    const val = m.specifications?.[row.key];
                    return Array.isArray(val) ? val.join(', ') : (val || '—');
                  });
                  const nums = values.map(v => extractNumber(v as string));
                  const maxNum = Math.max(...nums);

                  return (
                    <div
                      key={row.key}
                      className={`grid gap-4 py-3 px-4 rounded-xl border border-white/[0.04] ${i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}`}
                      style={{ gridTemplateColumns: `160px repeat(${selected.length}, 1fr)` }}
                    >
                      <span className="text-[11px] font-bold text-gray-500 tracking-widest uppercase self-center">{row.label}</span>
                      {selected.map((moto, mi) => {
                        const val = values[mi];
                        const num = nums[mi];
                        const isBest = num > 0 && num === maxNum && nums.filter(n => n === maxNum).length === 1;
                        return (
                          <div key={moto.id} className="text-center flex flex-col items-center gap-1">
                            <span className={`text-sm font-medium ${isBest ? 'text-ibiza-gold font-bold' : 'text-white/70'}`}>
                              {val as string}
                            </span>
                            {isBest && (
                              <span className="flex items-center gap-0.5 text-[9px] text-ibiza-gold font-bold tracking-wider">
                                <CheckCircle2 className="w-3 h-3" />
                                MEJOR
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* CTA row */}
              <div
                className="grid gap-4 mt-6"
                style={{ gridTemplateColumns: `160px repeat(${selected.length}, 1fr)` }}
              >
                <div />
                {selected.map(moto => (
                  <div key={moto.id} className="flex flex-col gap-2">
                    <Button
                      onClick={() => { navigate(`/moto/${moto.id}`); handleClose(); }}
                      className="w-full bg-ibiza-red hover:bg-ibiza-red/90 text-white font-bold rounded-xl h-10 text-xs group"
                    >
                      Ver detalles
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Compare button for catalog cards ─────────────────────────────────────────

export function CompareButton({ motorcycle, asRow = false }: { motorcycle: Motorcycle; asRow?: boolean }) {
  const { toggle, isSelected, selected } = useComparator();
  const active = isSelected(motorcycle.id);
  const maxReached = selected.length >= 3 && !active;

  if (asRow) {
    return (
      <button
        onClick={e => { e.stopPropagation(); if (!maxReached) toggle(motorcycle); }}
        disabled={maxReached}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 border ${
          active
            ? 'bg-ibiza-red/10 border-ibiza-red/40 text-ibiza-red'
            : maxReached
            ? 'bg-white/[0.02] border-white/[0.04] text-white/15 cursor-not-allowed'
            : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:border-ibiza-red/30 hover:text-ibiza-red hover:bg-ibiza-red/5'
        }`}
      >
        {active
          ? <><Minus className="w-3.5 h-3.5" /> Quitar del comparador</>
          : maxReached
          ? <><BarChart2 className="w-3.5 h-3.5" /> Máx. 3 motos</>
          : <><BarChart2 className="w-3.5 h-3.5" /> Agregar al comparador</>
        }
      </button>
    );
  }

  return (
    <button
      onClick={e => { e.stopPropagation(); if (!maxReached) toggle(motorcycle); }}
      title={maxReached ? 'Máximo 3 motos' : active ? 'Quitar del comparador' : 'Agregar al comparador'}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 border ${
        active
          ? 'bg-ibiza-red border-ibiza-red text-white shadow-[0_0_12px_rgba(227,25,55,0.4)]'
          : maxReached
          ? 'bg-white/[0.02] border-white/[0.04] text-white/10 cursor-not-allowed'
          : 'bg-white/[0.04] border-white/[0.06] text-white/30 hover:border-ibiza-red/40 hover:text-ibiza-red hover:bg-ibiza-red/10'
      }`}
    >
      {active ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
    </button>
  );
}
