/**
 * Buscador de motos: entiende lo que escribe la gente ("automatica menos de 8
 * millones", "hayabuza", "gsx8s", "moto para trabajar") y ordena por relevancia.
 *
 * Modulo puro (sin React ni DOM) para poder probarlo desde Node.
 * Flujo: parseQuery() saca los filtros que entiende y deja el texto libre;
 * searchMotos() filtra con esos filtros y puntua el texto contra cada moto.
 */
import type { Motorcycle } from '@/types';

// ─── Normalizacion ────────────────────────────────────────────────────────────

/** minusculas, sin tildes, espacios simples. Conserva digitos y separadores numericos. */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[-_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Solo letras y numeros: "GSX-8S" -> "gsx8s", "125 NKD" -> "125nkd". */
const compact = (s: string) => normalize(s).replace(/[^a-z0-9]/g, '');

/** Parte "nkd125" en ["nkd", "125"] y "gsx8s" en ["gsx", "8", "s"]. */
const alnumParts = (t: string) => t.match(/[a-z]+|\d+/g) ?? [];

function levenshtein(a: string, b: string, max = 3): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/** Errores tolerados segun el largo de la palabra. */
const fuzzyBudget = (len: number) => (len >= 7 ? 2 : len >= 4 ? 1 : 0);

// ─── Diccionarios ─────────────────────────────────────────────────────────────

const BRANDS = ['Suzuki', 'Honda', 'Hero', 'Bajaj', 'AKT', 'Vento'];

/** Frase normalizada -> categoria del catalogo. Las frases largas primero. */
const CATEGORY_SYNONYMS: [string, string][] = [
  ['doble proposito', 'Enduro'],
  ['tres ruedas', 'Motocarros'],
  ['3 ruedas', 'Motocarros'],
  ['tuk tuk', 'Motocarros'],
  ['off road', 'Enduro'],
  ['semi automaticas', 'City'],
  ['semi automatica', 'City'],
  ['semiautomaticas', 'City'],
  ['semiautomatica', 'City'],
  ['automaticas', 'Scooters'],
  ['automatica', 'Scooters'],
  ['automaticos', 'Scooters'],
  ['automatico', 'Scooters'],
  ['scooters', 'Scooters'],
  ['scooter', 'Scooters'],
  ['pasolas', 'Scooters'],
  ['pasola', 'Scooters'],
  ['motonetas', 'Scooters'],
  ['motoneta', 'Scooters'],
  ['enduro', 'Enduro'],
  ['trocha', 'Enduro'],
  ['offroad', 'Enduro'],
  ['cross', 'Enduro'],
  ['finca', 'Enduro'],
  ['campo', 'Enduro'],
  ['deportivas', 'Urban Sport'],
  ['deportiva', 'Urban Sport'],
  ['pistera', 'Urban Sport'],
  ['pisteras', 'Urban Sport'],
  ['naked', 'Urban Sport'],
  ['sport', 'Urban Sport'],
  ['carenada', 'Urban Sport'],
  ['clasicas', 'Rebels'],
  ['clasica', 'Rebels'],
  ['retro', 'Rebels'],
  ['custom', 'Rebels'],
  ['cruiser', 'Rebels'],
  ['aventura', 'Adventure'],
  ['adventure', 'Adventure'],
  ['touring', 'Adventure'],
  ['turismo', 'Adventure'],
  ['viajera', 'Adventure'],
  ['viajar', 'Adventure'],
  ['urbana', 'City'],
  ['urbanas', 'City'],
  ['ciudad', 'City'],
  ['motocarros', 'Motocarros'],
  ['motocarro', 'Motocarros'],
  ['tuktuk', 'Motocarros'],
  ['carguero', 'Motocarros'],
  ['triciclo', 'Motocarros'],
  ['carga', 'Motocarros'],
  ['electricas', 'Eléctricas'],
  ['electrica', 'Eléctricas'],
];

const CATEGORY_LABEL: Record<string, string> = {
  Scooters: 'Automáticas',
  City: 'Urbanas',
  'Urban Sport': 'Deportivas',
  Rebels: 'Clásicas',
  Enduro: 'Enduro',
  Adventure: 'Aventura',
  Motocarros: 'Motocarros',
  'Eléctricas': 'Eléctricas',
};

const WORK_WORDS = ['para trabajar', 'trabajar', 'trabajo', 'domicilios', 'domicilio', 'domiciliario', 'mensajeria', 'mensajero', 'reparto', 'rappi'];
const CHEAP_WORDS = ['mas baratas', 'mas barata', 'mas economicas', 'mas economica', 'baratas', 'barata', 'baratos', 'barato', 'economicas', 'economica', 'economicos', 'economico', 'bajo precio'];
const POWER_WORDS = ['mas potentes', 'mas potente', 'potentes', 'potente', 'alta gama', 'alto cilindraje'];

const STOPWORDS = new Set([
  'de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'en', 'con', 'que', 'para', 'por',
  'moto', 'motos', 'motocicleta', 'motocicletas', 'busco', 'buscar', 'quiero', 'necesito', 'me', 'mi', 'una', 'modelo',
  'precio', 'precios', 'valor', 'cuesta', 'cuanto', 'cc', 'nueva', 'nuevas', 'nuevo', 'a', 'al', 'lo', 'mas', 'menos',
  'hasta', 'desde', 'entre', 'millones', 'millon', 'pesos', 'frenos', 'freno', 'marca',
]);

// ─── Numeros y rangos ─────────────────────────────────────────────────────────

const NUM = String.raw`\$?\s?(\d+(?:[.,']\d+)*)`;
const UNIT = String.raw`(?:\s?(millones|millon|mill|palos|palo|mm|m|mil|cc|c\.c\.?))?`;
const LT = String.raw`(?:menos de|menor a|menor de|hasta|maximo|max|por debajo de|debajo de|inferior a|no mas de|que no pase de|<)`;
const GT = String.raw`(?:mas de|mayor a|mayor de|desde|minimo|min|arriba de|por encima de|superior a|>)`;

function parseNumber(raw: string): number {
  // 8.000.000 / 8,000,000 / 8'000.000 -> miles; 8.5 / 8,5 -> decimal
  if (/^\d{1,3}([.,']\d{3})+$/.test(raw)) return Number(raw.replace(/[.,']/g, ''));
  return Number(raw.replace(',', '.').replace(/'/g, ''));
}

type Quantity = { kind: 'price' | 'cc'; value: number } | null;

/** Interpreta un numero con su unidad. Sin unidad decide por el tamano (contexto: motos). */
function quantity(raw: string, unit: string | undefined, comparative: boolean): Quantity {
  const n = parseNumber(raw);
  if (!isFinite(n) || n <= 0) return null;
  const u = (unit ?? '').replace(/\./g, '');
  if (u === 'cc' || u === 'c') return { kind: 'cc', value: n };
  if (['millones', 'millon', 'mill', 'palos', 'palo', 'mm', 'm'].includes(u)) return { kind: 'price', value: Math.round(n * 1_000_000) };
  if (u === 'mil') return { kind: 'price', value: Math.round(n * 1_000) };
  if (n >= 100_000) return { kind: 'price', value: n };
  if (comparative && n < 50) return { kind: 'price', value: Math.round(n * 1_000_000) };
  if (comparative && n >= 50 && n < 2000) return { kind: 'cc', value: n };
  return null;
}

// ─── Intencion ────────────────────────────────────────────────────────────────

export interface SearchIntent {
  brands: string[];
  categories: string[];
  minPrice?: number;
  maxPrice?: number;
  minCc?: number;
  maxCc?: number;
  /** Cilindraje aproximado ("150cc"). */
  cc?: number;
  abs?: boolean;
  cbs?: boolean;
  year?: number;
  sort?: 'price-asc' | 'cc-desc';
  /** Palabras libres (normalizadas) que se buscan en modelo/marca/descripcion. */
  tokens: string[];
}

export interface SearchChip {
  key: string;
  label: string;
  /** Fragmentos (normalizados) a quitar de la consulta para deshacer este filtro. */
  remove: string[];
}

export interface ParsedQuery {
  intent: SearchIntent;
  chips: SearchChip[];
}

export const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

export interface ParseOptions {
  /** No convertir palabras en categorias (reintento cuando eran parte del modelo). */
  noCategories?: boolean;
  /** No calcular "quisiste decir" (evita recursion al validar la sugerencia). */
  noSuggest?: boolean;
}

export function parseQuery(query: string, opts: ParseOptions = {}): ParsedQuery {
  let s = ` ${normalize(query)} `;
  const intent: SearchIntent = { brands: [], categories: [], tokens: [] };
  const chips: SearchChip[] = [];
  const take = (match: string) => { s = s.replace(match, ' '); };

  // Rango "entre 5 y 7 millones"
  const between = new RegExp(String.raw`entre\s+${NUM}${UNIT}\s+y\s+${NUM}${UNIT}`).exec(s);
  if (between) {
    const unit = between[2] ?? between[4];
    const a = quantity(between[1], unit, true);
    const b = quantity(between[3], between[4] ?? unit, true);
    if (a && b && a.kind === b.kind) {
      const [lo, hi] = [Math.min(a.value, b.value), Math.max(a.value, b.value)];
      if (a.kind === 'price') {
        intent.minPrice = lo; intent.maxPrice = hi;
        chips.push({ key: 'price', label: `${formatCOP(lo)} – ${formatCOP(hi)}`, remove: [between[0].trim()] });
      } else {
        intent.minCc = lo; intent.maxCc = hi;
        chips.push({ key: 'cc', label: `${lo} – ${hi} cc`, remove: [between[0].trim()] });
      }
      take(between[0]);
    }
  }

  // "menos de 8 millones", "hasta 200cc", "mas de 300cc"
  for (const [re, dir] of [[LT, 'lt'], [GT, 'gt']] as const) {
    const m = new RegExp(String.raw`${re}\s+(?:de\s+|a\s+)?${NUM}${UNIT}`).exec(s);
    if (!m) continue;
    const q = quantity(m[1], m[2], true);
    if (!q) continue;
    if (q.kind === 'price') {
      if (dir === 'lt') { intent.maxPrice = q.value; chips.push({ key: 'maxPrice', label: `Hasta ${formatCOP(q.value)}`, remove: [m[0].trim()] }); }
      else { intent.minPrice = q.value; chips.push({ key: 'minPrice', label: `Desde ${formatCOP(q.value)}`, remove: [m[0].trim()] }); }
    } else {
      if (dir === 'lt') { intent.maxCc = q.value; chips.push({ key: 'maxCc', label: `Hasta ${q.value} cc`, remove: [m[0].trim()] }); }
      else { intent.minCc = q.value; chips.push({ key: 'minCc', label: `Más de ${q.value} cc`, remove: [m[0].trim()] }); }
    }
    take(m[0]);
  }

  // Cantidades sueltas con unidad: "150cc", "de 8 millones"
  for (const m of [...s.matchAll(new RegExp(String.raw`(?:de\s+)?${NUM}\s?(millones|millon|mill|palos|palo|cc|c\.c\.?)\b`, 'g'))]) {
    const q = quantity(m[1], m[2], false);
    if (!q) continue;
    if (q.kind === 'cc') {
      intent.cc = q.value;
      chips.push({ key: 'cc', label: `≈ ${q.value} cc`, remove: [m[0].trim()] });
    } else {
      intent.minPrice = Math.round(q.value * 0.85);
      intent.maxPrice = Math.round(q.value * 1.1);
      chips.push({ key: 'price', label: `Alrededor de ${formatCOP(q.value)}`, remove: [m[0].trim()] });
    }
    take(m[0]);
  }

  // Precio escrito en pesos sin palabras: "8000000", "$8.000.000"
  for (const m of [...s.matchAll(new RegExp(NUM, 'g'))]) {
    const n = parseNumber(m[1]);
    if (n >= 1_000_000) {
      intent.maxPrice = Math.round(n * 1.1);
      intent.minPrice = Math.round(n * 0.85);
      chips.push({ key: 'price', label: `Alrededor de ${formatCOP(n)}`, remove: [m[0].trim()] });
      take(m[0]);
    }
  }

  // Ano modelo
  const year = / (20[2-3]\d) /.exec(s);
  if (year) {
    intent.year = Number(year[1]);
    chips.push({ key: 'year', label: `Modelo ${year[1]}`, remove: [year[1]] });
    take(` ${year[1]} `);
  }

  const takePhrase = (phrases: string[]) => {
    for (const p of phrases) {
      if (s.includes(` ${p} `)) { take(` ${p} `); return p; }
    }
    return null;
  };

  // Para trabajar
  const work = opts.noCategories ? null : takePhrase(WORK_WORDS);
  if (work) {
    for (const c of ['City', 'Motocarros']) if (!intent.categories.includes(c)) intent.categories.push(c);
    intent.sort ??= 'price-asc';
    chips.push({ key: 'work', label: 'Para trabajar', remove: [work] });
  }

  // Economicas / potentes
  const cheap = takePhrase(CHEAP_WORDS);
  if (cheap) { intent.sort = 'price-asc'; chips.push({ key: 'sort', label: 'Más económicas primero', remove: [cheap] }); }
  const power = takePhrase(POWER_WORDS);
  if (power) { intent.sort = 'cc-desc'; chips.push({ key: 'sort', label: 'Más potentes primero', remove: [power] }); }

  // Categorias (frases de varias palabras primero, ya vienen ordenadas)
  for (const [phrase, cat] of opts.noCategories ? [] : CATEGORY_SYNONYMS) {
    if (!s.includes(` ${phrase} `)) continue;
    take(` ${phrase} `);
    if (!intent.categories.includes(cat)) {
      intent.categories.push(cat);
      chips.push({ key: `cat:${cat}`, label: CATEGORY_LABEL[cat] ?? cat, remove: [phrase] });
    } else {
      const chip = chips.find((c) => c.key === `cat:${cat}`);
      chip?.remove.push(phrase);
    }
  }

  // ABS / CBS
  for (const [word, key] of [['abs', 'abs'], ['cbs', 'cbs']] as const) {
    if (s.includes(` ${word} `)) {
      intent[key] = true;
      chips.push({ key, label: `Con ${word.toUpperCase()}`, remove: [word] });
      take(` ${word} `);
    }
  }

  // Marcas (exactas o con un error: "susuki", "bajag")
  const words = s.split(' ').filter(Boolean);
  const rest: string[] = [];
  for (const w of words) {
    const brand = BRANDS.find((b) => {
      const nb = b.toLowerCase();
      return w === nb || (w.length >= 4 && levenshtein(w, nb, 1) <= 1);
    });
    if (brand && !STOPWORDS.has(w)) {
      if (!intent.brands.includes(brand)) {
        intent.brands.push(brand);
        chips.push({ key: `brand:${brand}`, label: brand, remove: [w] });
      }
      continue;
    }
    rest.push(w);
  }

  intent.tokens = rest.filter((w) => !STOPWORDS.has(w) && /[a-z0-9]/.test(w));
  return { intent, chips };
}

/** Consulta sin el filtro de este chip. */
export function removeChip(query: string, chip: SearchChip): string {
  let s = ` ${normalize(query)} `;
  for (const r of chip.remove) s = s.replace(` ${r} `, ' ').replace(r, ' ');
  return s.replace(/\s+/g, ' ').trim();
}

// ─── Busqueda ─────────────────────────────────────────────────────────────────

/** Cilindraje de la ficha ("149.5cc, 4 tiempos" -> 149.5). */
export function engineCc(m: Motorcycle): number | null {
  const x = /(\d[\d.,]*)\s*cc/i.exec(m.specifications?.engine ?? '');
  if (!x) return null;
  // "1,340cc" son miles; "149.5cc" o "149,5cc" es decimal.
  const raw = /^\d{1,3}(,\d{3})+$/.test(x[1]) ? x[1].replace(/,/g, '') : x[1].replace(',', '.');
  const n = Number(raw);
  return isFinite(n) ? n : null;
}

interface Indexed {
  m: Motorcycle;
  modelKey: string;
  modelWords: string[];
  brand: string;
  desc: string;
  cc: number | null;
}

const indexCache = new WeakMap<Motorcycle[], Indexed[]>();
function indexOf(catalog: Motorcycle[]): Indexed[] {
  let idx = indexCache.get(catalog);
  if (!idx) {
    idx = catalog.map((m) => {
      const model = normalize(m.model);
      return {
        m,
        modelKey: compact(m.model),
        modelWords: model.split(/[^a-z0-9]+/).filter(Boolean),
        brand: m.brand.toLowerCase(),
        desc: normalize(m.description ?? ''),
        cc: engineCc(m),
      };
    });
    indexCache.set(catalog, idx);
  }
  return idx;
}

/** Puntaje de una palabra contra una moto (0 = no coincide). */
function tokenScore(t: string, x: Indexed): number {
  if (x.modelWords.includes(t)) return 40;
  if (t.length >= 2 && x.modelWords.some((w) => w.startsWith(t))) return 30;
  if (t.length >= 3 && x.modelKey.includes(t)) return 25;
  // "nkd125" -> "nkd" + "125": cada parte debe ser una palabra del modelo o su comienzo.
  const parts = alnumParts(t);
  if (parts.length > 1 && parts.every((p) => x.modelWords.some((w) => w === p || (p.length >= 2 && w.startsWith(p))))) return 22;
  if (x.brand === t) return 15;
  const budget = fuzzyBudget(t.length);
  if (budget && x.modelWords.some((w) => w.length >= 3 && levenshtein(t, w, budget) <= budget)) return 12;
  if (budget && x.modelWords.some((w) => w.length > t.length && levenshtein(t, w.slice(0, t.length), budget) <= budget)) return 8;
  if (t.length >= 4 && x.desc.includes(t)) return 3;
  return 0;
}

function passesFilters(x: Indexed, it: SearchIntent): boolean {
  const { m } = x;
  if (it.brands.length && !it.brands.includes(m.brand)) return false;
  if (it.categories.length && !it.categories.includes(m.category)) return false;
  if (it.maxPrice !== undefined && !(m.price > 0 && m.price <= it.maxPrice)) return false;
  if (it.minPrice !== undefined && !(m.price >= it.minPrice)) return false;
  if (it.minCc !== undefined && !(x.cc !== null && x.cc >= it.minCc)) return false;
  if (it.maxCc !== undefined && !(x.cc !== null && x.cc <= it.maxCc)) return false;
  if (it.cc !== undefined) {
    const tol = Math.max(8, it.cc * 0.08);
    if (x.cc === null || Math.abs(x.cc - it.cc) > tol) return false;
  }
  const text = `${x.modelWords.join(' ')} ${x.desc}`;
  if (it.abs && !/\babs\b/.test(text)) return false;
  if (it.cbs && !/\bcbs\b/.test(text)) return false;
  if (it.year !== undefined) {
    const years = m.pricesByYear ? Object.keys(m.pricesByYear).map(Number) : [m.year];
    if (!years.includes(it.year)) return false;
  }
  return true;
}

export interface SearchResult {
  results: Motorcycle[];
  total: number;
  parsed: ParsedQuery;
  /** Consulta corregida cuando no hubo resultados ("hayabuza" -> "hayabusa"). */
  didYouMean?: string;
  /** Sin resultados exactos: lo mas parecido quitando filtros de precio/cilindraje. */
  closest: Motorcycle[];
}

const byPrice = (a: Motorcycle, b: Motorcycle) => (a.price || Infinity) - (b.price || Infinity);

export function searchMotos(catalog: Motorcycle[], query: string, limit = 24, opts: ParseOptions = {}): SearchResult {
  const parsed = parseQuery(query, opts);
  const { intent } = parsed;
  const idx = indexOf(catalog);
  const tokens = intent.tokens;
  const whole = tokens.join('');

  // Coincidencias solo en la descripcion (p.ej. "dominar" citado en la ficha de
  // otra moto) cuentan unicamente si ninguna moto coincide por su nombre.
  const NAME_HIT = 8;
  const nameMatchExists = tokens.length > 0 && idx.some((x) => tokens.every((t) => tokenScore(t, x) >= NAME_HIT));

  const score = (x: Indexed, requireAll: boolean): number => {
    if (!tokens.length) return 1;
    let total = 0;
    let matched = 0;
    for (const t of tokens) {
      const sc = tokenScore(t, x);
      if (sc >= (nameMatchExists ? NAME_HIT : 1)) matched++;
      total += sc;
    }
    if (requireAll ? matched < tokens.length : matched === 0) return 0;
    if (whole.length >= 2) {
      if (x.modelKey === whole) total += 100;
      else if (x.modelKey.startsWith(whole)) total += 60;
      else if (x.modelKey.includes(whole)) total += 30;
    }
    return total;
  };

  const rank = (requireAll: boolean, useFilters: boolean) =>
    idx
      .filter((x) => !useFilters || passesFilters(x, intent))
      .map((x) => ({ x, s: score(x, requireAll) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => {
        if (tokens.length && b.s !== a.s) return b.s - a.s;
        if (intent.sort === 'price-asc') return byPrice(a.x.m, b.x.m);
        if (intent.sort === 'cc-desc') return (b.x.cc ?? 0) - (a.x.cc ?? 0);
        if (intent.cc !== undefined) return Math.abs((a.x.cc ?? 0) - intent.cc) - Math.abs((b.x.cc ?? 0) - intent.cc) || byPrice(a.x.m, b.x.m);
        if (intent.maxPrice !== undefined || intent.minPrice !== undefined) return byPrice(a.x.m, b.x.m);
        if (!tokens.length) return Number(!!b.x.m.featured) - Number(!!a.x.m.featured) || byPrice(a.x.m, b.x.m);
        return 0;
      })
      .map((r) => r.x.m);

  // El catalogo trae algunas fichas repetidas (misma marca, modelo y precio).
  const dedupe = (list: Motorcycle[]) => {
    const seen = new Set<string>();
    return list.filter((m) => {
      const k = `${m.brand}|${compact(m.model)}|${m.price}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };

  let ranked = rank(true, true);
  // Si ninguna moto tiene TODAS las palabras, basta con alguna.
  if (!ranked.length && tokens.length > 1) ranked = rank(false, true);
  // "navi adventure": la palabra de categoria era parte del nombre del modelo.
  if (!ranked.length && tokens.length && intent.categories.length && !opts.noCategories) {
    const retry = searchMotos(catalog, query, limit, { noCategories: true });
    if (retry.total) return retry;
  }

  let didYouMean: string | undefined;
  let closest: Motorcycle[] = [];
  if (!ranked.length) {
    if (tokens.length && !opts.noSuggest) {
      // Corregir cada palabra con la mas parecida del catalogo.
      const vocab = new Set<string>();
      for (const x of idx) { x.modelWords.forEach((w) => w.length >= 3 && vocab.add(w)); vocab.add(x.brand); }
      let changed = false;
      const fixed = tokens.map((t) => {
        let best = t;
        let bestD = (t.length >= 6 ? 2 : 1) + 1;
        for (const w of vocab) {
          const d = levenshtein(t, w, bestD - 1);
          if (d < bestD) { bestD = d; best = w; }
        }
        if (best !== t) changed = true;
        return best;
      });
      // Solo se sugiere si la correccion de verdad encuentra motos.
      const suggestion = fixed.join(' ');
      if (changed && searchMotos(catalog, suggestion, 1, { ...opts, noSuggest: true }).total) didYouMean = suggestion;
    }
    // Lo mas parecido: mismas palabras/marca/categoria, sin topes de precio ni cilindraje.
    const relaxed: SearchIntent = { ...intent, minPrice: undefined, maxPrice: undefined, minCc: undefined, maxCc: undefined, cc: undefined, year: undefined };
    closest = idx
      .filter((x) => passesFilters(x, relaxed))
      .map((x) => ({ x, s: score(x, false) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || byPrice(a.x.m, b.x.m))
      .slice(0, 4)
      .map((r) => r.x.m);
  }

  ranked = dedupe(ranked);
  return { results: ranked.slice(0, limit), total: ranked.length, parsed, didYouMean, closest: dedupe(closest) };
}
