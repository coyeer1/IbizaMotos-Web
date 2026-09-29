import { useMemo } from 'react';
import { ArrowRight, BadgePercent, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMotorcycles } from '@/hooks/useMotorcycles';
import { getQuoteWhatsApp } from '@/lib/config';
import { BONOS_MES } from '@/data/precios.generado';
import Reveal from '@/components/Reveal';
import type { Motorcycle } from '@/types';

/*
 * Bonos del mes. TODO sale de la lista oficial (columna BONO DE MARCA del Sheet, via
 * ACTUALIZAR PRECIOS, solo cuando el detalle dice de donde sale el bono). Nada de
 * descuentos, regalos ni cuentas regresivas inventadas, y nunca bonos de una financiera
 * especifica: el asesor tiene que poder sostener lo que dice la web.
 */

const MAX = 4;
const pesos = (v: number) => '$' + new Intl.NumberFormat('es-CO').format(v);

/** Las de mayor bono de marca, sin repetir marca mientras haya de otras. */
function elegir(motos: Motorcycle[]): Motorcycle[] {
  const conBono = motos
    .filter((m) => m.bono && m.bono.anio === m.year && m.price > 0)
    .sort((a, b) => (b.bono!.monto - a.bono!.monto) || (a.price - b.price));
  const elegidas: Motorcycle[] = [];
  const marcas = new Set<string>();
  for (const m of conBono) {
    if (elegidas.length === MAX) break;
    if (!marcas.has(m.brand)) { elegidas.push(m); marcas.add(m.brand); }
  }
  for (const m of conBono) {
    if (elegidas.length === MAX) break;
    if (!elegidas.includes(m)) elegidas.push(m);
  }
  return elegidas;
}

export default function PromosBanner() {
  const { motorcycles } = useMotorcycles();
  const navigate = useNavigate();
  const ofertas = useMemo(() => elegir(motorcycles), [motorcycles]);
  const total = useMemo(() => motorcycles.filter((m) => m.bono && m.bono.anio === m.year).length, [motorcycles]);

  if (!ofertas.length) return null;

  return (
    <section className="py-16 sm:py-20 bg-white font-body text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <Reveal direction="up">
              <span className="uppercase text-[11px] tracking-[0.15em] font-semibold text-ibiza-brand">
                Bonos {BONOS_MES ? `de ${BONOS_MES}` : 'del mes'}
              </span>
            </Reveal>
            <Reveal delay={0.08} direction="up">
              <h2 className="font-display mt-1.5 leading-[0.95]" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)' }}>
                Ofertas del mes
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12} direction="up">
            <p className="text-sm text-neutral-500 max-w-md">
              {total} motos tienen bono este mes. Estos son los más altos.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ofertas.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.06} direction="up">
              <article className="group h-full flex flex-col rounded-2xl border border-neutral-200 bg-white overflow-hidden transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                <button
                  type="button"
                  onClick={() => navigate(`/moto/${m.id}`)}
                  className="relative aspect-[4/3] bg-neutral-50 flex items-center justify-center p-6"
                  aria-label={`Ver ${m.brand} ${m.model}`}
                >
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ibiza-brand px-3 py-1 text-[11px] font-bold text-white">
                    <BadgePercent className="w-3.5 h-3.5" /> Bono {pesos(m.bono!.monto)}
                  </span>
                  {m.images?.[0] && (
                    <img
                      src={m.images[0]}
                      alt={`${m.brand} ${m.model}`}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </button>
                <div className="flex flex-1 flex-col p-5">
                  <p className="uppercase text-[11px] tracking-[0.15em] font-semibold text-neutral-400">{m.brand}</p>
                  <h3 className="font-display text-3xl leading-none mt-1">{m.model}</h3>
                  <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-400">Precio modelo {m.year}</p>
                  <p className="text-2xl font-bold">{pesos(m.price)}</p>
                  <ul className="mt-3 space-y-1.5 text-[13px] text-neutral-600">
                    <li className="flex items-center gap-2">
                      <BadgePercent className="w-4 h-4 text-ibiza-brand shrink-0" />
                      {m.bono!.tipo === 'contado' ? 'Bono de contado' : 'Bono de marca'} {pesos(m.bono!.monto)} · modelo {m.bono!.anio}
                    </li>
                    {m.bono!.tipo === 'contado' && (
                      <li className="flex items-center gap-2 text-neutral-500">
                        <Wallet className="w-4 h-4 shrink-0" /> Aplica pagando de contado
                      </li>
                    )}
                  </ul>
                  <div className="mt-auto pt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/moto/${m.id}`)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-lg bg-black text-white text-sm font-semibold hover:bg-ibiza-brand transition-colors"
                    >
                      Ver moto <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href={getQuoteWhatsApp(m.brand, `${m.model} modelo ${m.year} (bono ${m.bono!.tipo === 'contado' ? 'de contado' : 'de marca'} de ${pesos(m.bono!.monto)})`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-11 px-4 rounded-lg border border-neutral-300 text-sm font-semibold hover:border-black transition-colors"
                    >
                      Cotizar
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-xs text-neutral-400 max-w-3xl">
          Bonos de marca de la lista oficial de precios{BONOS_MES ? ` de ${BONOS_MES}` : ''}, válidos para el año modelo
          indicado, sujetos a disponibilidad de unidades y a las condiciones de la marca, y no acumulables salvo que tu
          asesor lo confirme. Los bonos de contado no aplican financiando. Si financias, tu asesor te dice qué beneficios
          tiene cada financiera.
        </p>
      </div>
    </section>
  );
}
