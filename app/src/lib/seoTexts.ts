import type { Motorcycle } from '@/types';

/** Datos mínimos que necesita una ficha de moto para sus textos SEO. */
export type MotoSeoInput = Pick<
  Motorcycle,
  'id' | 'brand' | 'model' | 'year' | 'price' | 'category'
>;

export const SITE = 'https://ibizamotos.co';
export const DEFAULT_TITLE = 'Ibiza Motos | El placer en dos ruedas';
export const FALLBACK_IMAGE = '/Logo-Ibiza-motos.png';

const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
});

export function formatCOP(price: number): string {
  return COP.format(price);
}

export function motoPath(m: MotoSeoInput): string {
  return `/moto/${m.id}`;
}

export function motoTitle(m: MotoSeoInput): string {
  return `${m.brand} ${m.model} ${m.year} | Ibiza Motos Pereira`;
}

export function motoDescription(m: MotoSeoInput): string {
  // Una moto sin precio cargado se anuncia "a consultar", nunca como "$0".
  const precio = m.price > 0 ? `desde ${formatCOP(m.price)}` : 'precio a consultar';
  return `${m.brand} ${m.model} ${m.year} ${precio}. ${m.category} disponible en Ibiza Motos, Pereira y el Eje Cafetero. Financiación inmediata.`;
}

export function brandTitle(brand: string): string {
  return `Motos ${brand} en Pereira y Eje Cafetero | Ibiza Motos`;
}

export function brandDescription(brand: string): string {
  return `Catálogo de motos ${brand} nuevas en Ibiza Motos: 20 sucursales en Pereira, Dosquebradas, Santa Rosa de Cabal, Quimbaya, Montenegro, Viterbo, Chinchiná y Neiva. Financiación inmediata con 8 entidades.`;
}
