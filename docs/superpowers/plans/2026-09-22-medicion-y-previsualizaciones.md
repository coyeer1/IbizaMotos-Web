# Medición y previsualizaciones por ruta — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que cada ruta de `ibizamotos.co` sirva sus propias etiquetas en el HTML crudo (para que WhatsApp y Facebook muestren la moto y su precio) y que el sitio mida visitas y contactos con píxel de Meta y GA4, previo consentimiento.

**Architecture:** Un script de Node corre después de `vite build`, lee el catálogo estático transpilándolo con esbuild, y escribe una copia de `dist/index.html` por ruta con su título, Open Graph, canonical y JSON-LD `Product`. El mismo script regenera `sitemap.xml`. En paralelo, un módulo `analytics.ts` carga píxel y GA4 sólo si hay IDs configurados y el visitante aceptó cookies; los contactos por WhatsApp se capturan con un único listener delegado en lugar de tocar los 18 sitios de clic.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, React Router 6, Tailwind 3, esbuild 0.27 (ya en `node_modules` vía Vite), Node ≥ 20, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-22-medicion-y-previsualizaciones-design.md`

## Global Constraints

- **Directorio de trabajo:** todos los comandos se ejecutan desde `app/` salvo los `git`, que corren desde la raíz del repo.
- **Hay trabajo sin commitear de otra tarea** en `app/src/data/motorcycles.ts`, `app/src/lib/brandThemes.ts`, `app/src/lib/config.ts`, `app/src/pages/SucursalesPage.tsx`, `app/src/sections/BrandSelector.tsx`, más `app/optimize-images.mjs` y `app/public/_redirects` sin seguimiento. **Nunca usar `git add -A` ni `git add .`** — cada commit lista rutas explícitas.
- **No tocar** `WORKSHOP_BOOKING_ENABLED` (queda en `false`), `vercel.json`, el diseño ni el contenido del sitio.
- **Dominio canónico:** `https://ibizamotos.co` (sin barra final).
- **Moneda:** `COP`. Formato de precio: `Intl.NumberFormat('es-CO', { style:'currency', currency:'COP', minimumFractionDigits: 0 })`.
- **URLs de moto:** `/moto/<id>` donde `id` es el campo `id` del catálogo, que es un **string numérico** (`'1'`, `'2'`, … 114 motos en el catálogo actual). No son slugs. Ojo: `motorcycles.ts` también exporta `testimonials`, `services`, `branches` y `spareParts`, cuyos `id` NO son motos — contar siempre con `motorcycles.length`, nunca con un regex sobre el archivo.
- **`og:image` debe ser absoluta, en PNG o JPG (nunca WebP) y pasada por `encodeURI`** — 132 rutas del catálogo contienen espacios o paréntesis (ej. `/moto_images/ak125nkd-cbs-fp-27-pt/descarga (1).webp`).
- **Sin framework de pruebas.** `app/CLAUDE.md` dice «There are no tests in this project». La verificación de este plan son scripts de Node con `node:assert` que se ejecutan de verdad, más `npm run build`. No inventar Vitest ni Jest.
- **Convención de commits del repo:** `feat(ambito): ...`, `fix(ambito): ...`, `docs(ambito): ...`, `chore(ambito): ...`. Mensajes en español, sin tildes en la primera línea.
- Cada commit termina con:
  ```
  Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
  ```

---

## File Structure

| Archivo | Responsabilidad |
|---|---|
| `app/src/lib/seoTexts.ts` | **Nuevo.** Única fuente de títulos, descripciones y rutas SEO. Funciones puras, sin DOM, importables desde el navegador y desde Node. |
| `app/scripts/prerender-meta.mjs` | **Nuevo.** Genera un `index.html` por ruta y regenera `sitemap.xml`. Corre después de `vite build`. |
| `app/scripts/verify-prerender.mjs` | **Nuevo.** Comprueba el resultado del anterior. Es la prueba automatizada de este plan. |
| `app/src/lib/analytics.ts` | **Nuevo.** Carga condicional de píxel y GA4 + funciones de evento. Nada más toca `fbq` o `gtag`. |
| `app/src/components/CookieConsent.tsx` | **Nuevo.** Barra de consentimiento. Dueña de la clave `ibz-consent`. |
| `app/src/components/Analytics.tsx` | **Modificar.** De plantilla vacía a: inicializar, reportar rutas y delegar clics de WhatsApp. |
| `app/src/hooks/useSEO.ts` | **Modificar.** Consumir `seoTexts` para constantes. Su comportamiento no cambia. |
| `app/src/pages/MotorcyclePage.tsx` | **Modificar.** Usar `seoTexts` + `trackViewContent`. |
| `app/src/components/SearchOverlay.tsx` | **Modificar.** `trackSearch`. |
| `app/src/App.tsx` | **Modificar.** Montar `<CookieConsent />`. |
| `app/src/vite-env.d.ts` | **Modificar.** Declarar las dos variables de entorno. |
| `app/package.json` | **Modificar.** Encadenar el prerender en `build`. |
| `app/.env.local` | **Modificar.** Agregar las dos variables vacías. |

---

## Fuera de alcance (anotado, no se hace)

- **Slugs en las URLs de moto.** Hoy son `/moto/1`. Un slug (`/moto/akt-125-nkd-cbs-fp`) posicionaría mucho mejor, pero implica redirecciones 301 de las 114 URLs viejas, actualizar enlaces internos y el sitemap. Es un trabajo aparte con su propio spec.
- Reactivar el agendamiento de taller.
- Renderizar el `<body>` (SSR real).

---

## Task 1: Textos SEO en una sola fuente

Hoy el título y la descripción de una moto se arman dentro de `MotorcyclePage.tsx`. El script de prerender necesita exactamente los mismos textos. Si quedan en dos sitios, se desincronizan. Esta tarea los extrae antes de que exista el segundo consumidor.

**Files:**
- Create: `app/src/lib/seoTexts.ts`
- Create: `app/scripts/check-seotexts.mjs`
- Modify: `app/src/pages/MotorcyclePage.tsx:73-87`
- Modify: `app/src/hooks/useSEO.ts:3-4`

**Interfaces:**
- Consumes: `Motorcycle` de `@/types` (`id: string`, `brand`, `model`, `year: number`, `price: number`, `category`, `images: string[]`).
- Produces:
  - `SITE: string`, `DEFAULT_TITLE: string`, `FALLBACK_IMAGE: string`
  - `formatCOP(price: number): string`
  - `motoTitle(m: MotoSeoInput): string`
  - `motoDescription(m: MotoSeoInput): string`
  - `motoPath(m: MotoSeoInput): string`
  - `brandTitle(brand: string): string`, `brandDescription(brand: string): string`
  - `type MotoSeoInput = Pick<Motorcycle,'id'|'brand'|'model'|'year'|'price'|'category'>`

- [ ] **Step 1: Escribir la comprobación que falla**

Crear `app/scripts/check-seotexts.mjs`:

```js
// Comprueba los textos SEO compartidos. Se ejecuta con: node scripts/check-seotexts.mjs
import assert from 'node:assert/strict';
import { buildSync } from 'esbuild';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const out = join(mkdtempSync(join(tmpdir(), 'seotexts-')), 'seoTexts.mjs');
buildSync({
  entryPoints: ['src/lib/seoTexts.ts'],
  bundle: true, format: 'esm', platform: 'node', outfile: out,
});
const seo = await import(pathToFileURL(out).href);

const conPrecio = {
  id: '10', brand: 'AKT', model: '125 NKD CBS FP',
  year: 2027, price: 6490000, category: 'Urban Sport',
};
const sinPrecio = { ...conPrecio, id: '99', price: 0 };

assert.equal(seo.SITE, 'https://ibizamotos.co');
assert.equal(seo.motoPath(conPrecio), '/moto/10');
assert.equal(seo.motoTitle(conPrecio), 'AKT 125 NKD CBS FP 2027 | Ibiza Motos Pereira');

// El precio va formateado en pesos y sin decimales.
assert.match(seo.motoDescription(conPrecio), /desde\s*\$\s?6\.490\.000/);
// Una moto sin precio NUNCA debe anunciarse como "desde $0".
assert.doesNotMatch(seo.motoDescription(sinPrecio), /\$\s?0\b/);
assert.match(seo.motoDescription(sinPrecio), /consultar/i);

assert.match(seo.brandTitle('Suzuki'), /Suzuki/);
assert.ok(seo.brandDescription('Suzuki').length > 50);

console.log('check-seotexts: OK');
```

- [ ] **Step 2: Ejecutarla y ver que falla**

```bash
cd app && node scripts/check-seotexts.mjs
```

Esperado: FALLA con un error de esbuild del tipo `Could not resolve "src/lib/seoTexts.ts"`.

- [ ] **Step 3: Escribir `seoTexts.ts`**

Crear `app/src/lib/seoTexts.ts`:

```ts
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
  return `Catálogo de motos ${brand} nuevas en Ibiza Motos: 19 sucursales en Pereira, Dosquebradas, Santa Rosa de Cabal, Quimbaya, Montenegro, Viterbo, Chinchiná y Neiva. Financiación inmediata con 8 entidades.`;
}
```

- [ ] **Step 4: Ejecutar la comprobación y verla pasar**

```bash
cd app && node scripts/check-seotexts.mjs
```

Esperado: `check-seotexts: OK`

- [ ] **Step 5: Hacer que `MotorcyclePage` use la fuente compartida**

En `app/src/pages/MotorcyclePage.tsx`, reemplazar el bloque de las líneas 73-87 por:

```tsx
    // SEO por moto: los textos viven en seoTexts.ts para que el script de
    // prerender genere exactamente los mismos que ve el navegador.
    useSEO(
        motorcycle
            ? {
                title: motoTitle(motorcycle),
                description: motoDescription(motorcycle),
                path: motoPath(motorcycle),
                image: motorcycle.images?.[0],
                type: 'product',
            }
            : { title: DEFAULT_TITLE }
    );
```

Agregar el import junto a los demás de `@/lib`:

```tsx
import { motoTitle, motoDescription, motoPath, DEFAULT_TITLE } from '@/lib/seoTexts';
```

Eliminar la constante `motoPrice` que quedó sin uso (líneas 74-76). El `formatPrice` local de la línea 104 **se conserva**: lo usa la interfaz, no el SEO.

- [ ] **Step 6: Hacer que `useSEO` tome las constantes de la fuente compartida**

En `app/src/hooks/useSEO.ts`, borrar las líneas 3-4 y poner en su lugar:

```ts
import { SITE, DEFAULT_TITLE } from '@/lib/seoTexts';
```

El resto del archivo no cambia: sigue usando `SITE` y `DEFAULT_TITLE` con los mismos nombres.

- [ ] **Step 7: Compilar**

```bash
cd app && npm run build
```

Esperado: termina sin errores de TypeScript.

- [ ] **Step 8: Commit**

```bash
git add -- app/src/lib/seoTexts.ts app/scripts/check-seotexts.mjs app/src/pages/MotorcyclePage.tsx app/src/hooks/useSEO.ts
git commit -m "$(cat <<'EOF'
refactor(seo): mover titulos y descripciones a seoTexts.ts

Fuente unica para el hook useSEO y para el script de prerender que viene
despues, para que no se desincronicen. De paso, una moto sin precio deja
de anunciarse como "desde $0" y pasa a "precio a consultar".

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Generar un HTML por ruta

El corazón del plan. Al terminar, `dist/moto/10/index.html` existe y trae las etiquetas de esa moto.

**Files:**
- Create: `app/scripts/prerender-meta.mjs`
- Create: `app/scripts/verify-prerender.mjs`

**Interfaces:**
- Consumes: `seoTexts.ts` de la Task 1; `src/data/motorcycles.ts` (exporta `motorcycles: Motorcycle[]` y `brands: Brand[]`); `src/data/blogPosts.ts` (exporta `posts: Post[]` con `id: number`, `title`, `excerpt`, `image`).
- Produces: `dist/<ruta>/index.html` por cada ruta. El script imprime `prerender: N paginas` y la lista de motos sin imagen raster.

- [ ] **Step 1: Escribir el verificador que falla**

Crear `app/scripts/verify-prerender.mjs`:

```js
// Verifica lo que dejó prerender-meta.mjs. Se ejecuta con:
//   node scripts/verify-prerender.mjs
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const leer = (ruta) => readFileSync(join(DIST, ruta, 'index.html'), 'utf8');

const og = (html, prop) => {
  const m = html.match(new RegExp(`<meta[^>]*property="${prop}"[^>]*content="([^"]*)"`, 'i'));
  return m ? m[1] : null;
};
const titulo = (html) => (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] ?? null;

// --- La raíz sigue existiendo y no se rompió ---
assert.ok(existsSync(join(DIST, 'index.html')), 'falta dist/index.html');
const home = readFileSync(join(DIST, 'index.html'), 'utf8');

// --- Una ficha de moto concreta ---
assert.ok(existsSync(join(DIST, 'moto', '10', 'index.html')), 'falta dist/moto/10/index.html');
const moto = leer('moto/10');

assert.notEqual(titulo(moto), titulo(home), 'la moto repite el titulo del home');
assert.notEqual(og(moto, 'og:title'), og(home, 'og:title'), 'la moto repite el og:title del home');
assert.match(og(moto, 'og:url'), /^https:\/\/ibizamotos\.co\/moto\/10$/);

// --- og:image: absoluta, raster y codificada ---
const img = og(moto, 'og:image');
assert.match(img, /^https:\/\/ibizamotos\.co\//, 'og:image no es absoluta');
assert.doesNotMatch(img, /\.webp(\?|$)/i, 'og:image en WebP: WhatsApp no lo renderiza');
assert.doesNotMatch(img, / /, 'og:image tiene espacios sin codificar');

// Ninguna pagina generada puede quedarse con un og:image en WebP o con espacios.
for (const id of ['1', '10', '50', '100', '135']) {
  const p = join(DIST, 'moto', id, 'index.html');
  if (!existsSync(p)) continue;
  const i = og(readFileSync(p, 'utf8'), 'og:image');
  assert.doesNotMatch(i, /\.webp(\?|$)/i, `moto ${id}: og:image en WebP`);
  assert.doesNotMatch(i, / /, `moto ${id}: og:image con espacios`);
}

// --- Marca y una pagina fija ---
assert.ok(existsSync(join(DIST, 'marca', 'suzuki', 'index.html')), 'falta dist/marca/suzuki');
assert.match(leer('marca/suzuki'), /Suzuki/);

assert.ok(existsSync(join(DIST, 'sucursales', 'index.html')), 'falta dist/sucursales');
assert.notEqual(titulo(leer('sucursales')), titulo(home), 'sucursales repite el titulo del home');

console.log('verify-prerender: OK');
```

- [ ] **Step 2: Ejecutarlo y ver que falla**

```bash
cd app && npm run build && node scripts/verify-prerender.mjs
```

Esperado: FALLA con `falta dist/moto/10/index.html`.

- [ ] **Step 3: Escribir el generador**

Crear `app/scripts/prerender-meta.mjs`:

```js
// Genera un index.html por ruta con sus propias etiquetas, a partir del
// dist/index.html que acaba de producir Vite. Sin navegador: sustitucion de
// texto. Corre despues de `vite build`.
import { buildSync } from 'esbuild';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = 'dist';
const PUBLIC = 'public';

/** Carga un modulo TypeScript del proyecto desde Node, via esbuild. */
function cargarTS(entrada, nombre) {
  const salida = join(mkdtempSync(join(tmpdir(), 'prerender-')), `${nombre}.mjs`);
  buildSync({
    entryPoints: [entrada],
    bundle: true, format: 'esm', platform: 'node', outfile: salida,
    logLevel: 'silent',
  });
  return import(pathToFileURL(salida).href);
}

const seo = await cargarTS('src/lib/seoTexts.ts', 'seoTexts');
const datos = await cargarTS('src/data/motorcycles.ts', 'motorcycles');
const blog = await cargarTS('src/data/blogPosts.ts', 'blogPosts');

const { SITE, FALLBACK_IMAGE } = seo;

const escaparAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const escaparHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Absoluta + codificada. encodeURI convierte los espacios en %20. */
const urlAbsoluta = (ruta) => encodeURI(SITE + (ruta.startsWith('/') ? ruta : `/${ruta}`));

/**
 * WhatsApp no renderiza WebP de forma confiable. Busca el hermano .png o .jpg
 * en public/; si no existe, cae al logo. Devuelve [url, usoFallback].
 */
function imagenParaCompartir(ruta) {
  if (!ruta) return [urlAbsoluta(FALLBACK_IMAGE), true];
  // Las rutas del catalogo vienen SIN codificar ("descarga (1).webp"), asi que
  // se usan tal cual para buscar en disco. Codificar es cosa de urlAbsoluta.
  for (const ext of ['.png', '.jpg', '.jpeg']) {
    const candidata = ruta.replace(/\.[a-z0-9]+$/i, ext);
    if (existsSync(join(PUBLIC, candidata))) return [urlAbsoluta(candidata), false];
  }
  if (!/\.webp$/i.test(ruta) && existsSync(join(PUBLIC, ruta))) {
    return [urlAbsoluta(ruta), false];
  }
  return [urlAbsoluta(FALLBACK_IMAGE), true];
}

/** Reemplaza la etiqueta completa, sin depender del orden de atributos. */
function ponerMeta(html, attr, clave, contenido) {
  const tag = `<meta ${attr}="${clave}" content="${escaparAttr(contenido)}" />`;
  const re = new RegExp(`<meta[^>]*\\s${attr}="${clave}"[^>]*>`, 'i');
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function ponerCanonical(html, url) {
  const tag = `<link rel="canonical" href="${escaparAttr(url)}" />`;
  const re = /<link[^>]*rel="canonical"[^>]*>/i;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function aplicar(base, { title, description, url, image, type }) {
  let html = base.replace(/<title>[\s\S]*?<\/title>/, `<title>${escaparHtml(title)}</title>`);
  html = ponerCanonical(html, url);
  html = ponerMeta(html, 'name', 'description', description);
  html = ponerMeta(html, 'property', 'og:title', title);
  html = ponerMeta(html, 'property', 'og:description', description);
  html = ponerMeta(html, 'property', 'og:url', url);
  html = ponerMeta(html, 'property', 'og:type', type);
  html = ponerMeta(html, 'property', 'og:image', image);
  html = ponerMeta(html, 'name', 'twitter:title', title);
  html = ponerMeta(html, 'name', 'twitter:description', description);
  html = ponerMeta(html, 'name', 'twitter:image', image);
  return html;
}

function escribir(ruta, html) {
  const destino = join(DIST, ruta.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, html, 'utf8');
}

// --- Rutas fijas: titulo y descripcion propios de cada una ---
const FIJAS = [
  ['/sucursales',        'Nuestras 19 sucursales | Ibiza Motos Eje Cafetero',      'Encuentra tu sede mas cercana: Pereira, Dosquebradas, Santa Rosa de Cabal, Quimbaya, Montenegro, Viterbo, Chinchina y Neiva. Direccion, telefono y horario de cada una.'],
  ['/financiamiento',    'Financia tu moto | 8 entidades | Ibiza Motos',           'Simula la cuota de tu moto con Progreser, Banco de Bogota, SUFI, Brilla, Addi, Venfi, Sistecredito o Crediorbe. Aprobacion rapida en Pereira y el Eje Cafetero.'],
  ['/citas',             'Agenda tu cita de taller | Ibiza Motos',                 'Servicio tecnico especializado para Suzuki, Honda, Bajaj, AKT, Hero y Vento en el Eje Cafetero.'],
  ['/opinion',           'Califica a tu asesor | Ibiza Motos',                     'Cuentanos como te atendieron. Tu opinion nos ayuda a mejorar el servicio en las 19 sucursales.'],
  ['/privacidad',        'Politica de tratamiento de datos | Ibiza Motos',         'Como tratamos tus datos personales conforme a la Ley 1581 de 2012.'],
  ['/terminos',          'Terminos y condiciones | Ibiza Motos',                   'Condiciones de uso del sitio web de Ibiza Motos S.A.S.'],
  ['/eliminacion-datos', 'Eliminacion de datos | Ibiza Motos',                     'Solicita la eliminacion de tus datos personales de nuestros sistemas.'],
  ['/marca/todas',       'Todas las marcas de motos | Ibiza Motos',                'Suzuki, Honda, Bajaj, AKT, Hero y Vento en un solo concesionario, con 19 sucursales en el Eje Cafetero y Neiva.'],
];

const base = readFileSync(join(DIST, 'index.html'), 'utf8');
const sinRaster = [];
let total = 0;
const rutasSitemap = [];

// Motos
for (const m of datos.motorcycles) {
  const ruta = seo.motoPath(m);
  const [image, fallback] = imagenParaCompartir(m.images?.[0]);
  if (fallback) sinRaster.push(`${m.id} — ${m.brand} ${m.model}`);
  escribir(ruta, aplicar(base, {
    title: seo.motoTitle(m),
    description: seo.motoDescription(m),
    url: urlAbsoluta(ruta),
    image,
    type: 'product',
  }));
  rutasSitemap.push({ ruta, prioridad: '0.8' });
  total++;
}

// Marcas
for (const b of datos.brands) {
  const ruta = `/marca/${b.slug}`;
  const [image] = imagenParaCompartir(b.logo);
  escribir(ruta, aplicar(base, {
    title: seo.brandTitle(b.name),
    description: seo.brandDescription(b.name),
    url: urlAbsoluta(ruta),
    image,
    type: 'website',
  }));
  rutasSitemap.push({ ruta, prioridad: '0.7' });
  total++;
}

// Blog
for (const p of blog.posts) {
  const ruta = `/blog/${p.id}`;
  const [image] = imagenParaCompartir(p.image);
  escribir(ruta, aplicar(base, {
    title: `${p.title} | Blog Ibiza Motos`,
    description: p.excerpt,
    url: urlAbsoluta(ruta),
    image,
    type: 'article',
  }));
  rutasSitemap.push({ ruta, prioridad: '0.6' });
  total++;
}

// Fijas
for (const [ruta, title, description] of FIJAS) {
  const [image] = imagenParaCompartir(FALLBACK_IMAGE);
  escribir(ruta, aplicar(base, {
    title, description, url: urlAbsoluta(ruta), image, type: 'website',
  }));
  rutasSitemap.push({ ruta, prioridad: '0.7' });
  total++;
}

console.log(`prerender: ${total} paginas`);
if (sinRaster.length) {
  console.log(`prerender: ${sinRaster.length} motos sin PNG/JPG, usan el logo al compartir:`);
  for (const s of sinRaster) console.log(`  - ${s}`);
}

export { rutasSitemap };
```

- [ ] **Step 4: Ejecutar el generador y el verificador**

```bash
cd app && npm run build && node scripts/prerender-meta.mjs && node scripts/verify-prerender.mjs
```

Esperado: `prerender: 141 paginas` (114 motos + 6 marcas + 13 posts + 8 fijas), posiblemente una lista de motos sin raster, y `verify-prerender: OK`.

Si el número no cuadra, contar de nuevo antes de seguir: significa que el catálogo cambió. `brands` tiene 6 entradas (suzuki, vento, hero, honda, bajaj, akt); las otras siete `slug:` del archivo son de `categories`, no de marcas, y no se generan.

- [ ] **Step 5: Commit**

```bash
git add -- app/scripts/prerender-meta.mjs app/scripts/verify-prerender.mjs
git commit -m "$(cat <<'EOF'
feat(seo): generar un HTML por ruta con sus propias etiquetas

Las 3 rutas que se probaron devolvian el mismo archivo de 7640 bytes, asi
que WhatsApp mostraba el logo generico en vez de la moto. El script copia
dist/index.html por ruta y sustituye titulo, Open Graph y canonical.

og:image cae al PNG hermano (WhatsApp no renderiza WebP) y pasa por
encodeURI, porque 132 rutas del catalogo traen espacios o parentesis.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: JSON-LD `Product` en las fichas de moto

Para que Google pueda mostrar el precio en los resultados.

**Files:**
- Modify: `app/scripts/prerender-meta.mjs`
- Modify: `app/scripts/verify-prerender.mjs`

**Interfaces:**
- Consumes: lo de la Task 2.
- Produces: un `<script type="application/ld+json">` extra en cada `dist/moto/<id>/index.html`.

- [ ] **Step 1: Añadir las comprobaciones que fallan**

En `app/scripts/verify-prerender.mjs`, antes de la línea `console.log('verify-prerender: OK');`, añadir:

```js
// --- JSON-LD Product ---
const bloquesLd = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1]));

const ldMoto = bloquesLd(moto).find((b) => b['@type'] === 'Product');
assert.ok(ldMoto, 'la ficha de moto no trae JSON-LD Product');
assert.equal(ldMoto.offers.priceCurrency, 'COP');
assert.equal(String(ldMoto.offers.price), '6490000');
assert.equal(ldMoto.offers.seller['@id'], 'https://ibizamotos.co/#organization');
assert.equal(ldMoto.brand.name, 'AKT');
assert.equal(ldMoto.image, og(moto, 'og:image'));

// Los bloques del sitio siguen ahi y siguen siendo JSON valido.
const tiposHome = bloquesLd(home).map((b) => b['@type']);
assert.ok(tiposHome.includes('Organization'), 'se perdio el JSON-LD Organization');
assert.ok(tiposHome.includes('MotorcycleDealer'), 'se perdio el JSON-LD MotorcycleDealer');

// Una moto sin precio no debe declarar offers.
const sinPrecio = datosMotos.find((m) => !m.price || m.price <= 0);
if (sinPrecio) {
  const h = readFileSync(join(DIST, 'moto', String(sinPrecio.id), 'index.html'), 'utf8');
  const ld = bloquesLd(h).find((b) => b['@type'] === 'Product');
  assert.ok(ld, `moto ${sinPrecio.id}: falta el Product`);
  assert.equal(ld.offers, undefined, `moto ${sinPrecio.id}: declara offers sin precio`);
}
```

Y al principio del archivo, tras los imports, añadir la carga del catálogo que necesita esa última comprobación:

```js
import { buildSync } from 'esbuild';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const salidaCat = join(mkdtempSync(join(tmpdir(), 'verify-')), 'motorcycles.mjs');
buildSync({
  entryPoints: ['src/data/motorcycles.ts'],
  bundle: true, format: 'esm', platform: 'node', outfile: salidaCat, logLevel: 'silent',
});
const { motorcycles: datosMotos } = await import(pathToFileURL(salidaCat).href);
```

- [ ] **Step 2: Ejecutar y ver que falla**

```bash
cd app && node scripts/verify-prerender.mjs
```

Esperado: FALLA con `la ficha de moto no trae JSON-LD Product`.

- [ ] **Step 3: Generar el bloque**

En `app/scripts/prerender-meta.mjs`, añadir esta función después de `aplicar`:

```js
/**
 * Inserta un bloque JSON-LD antes de </head>, sin tocar los que ya existen
 * (Organization y MotorcycleDealer viven en index.html).
 */
function agregarJsonLd(html, objeto) {
  const bloque = `    <script type="application/ld+json">\n${JSON.stringify(objeto, null, 2)}\n    </script>\n`;
  return html.replace('</head>', `${bloque}  </head>`);
}

function productoDeMoto(m, url, image, description) {
  const producto = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${m.brand} ${m.model} ${m.year}`,
    brand: { '@type': 'Brand', name: m.brand },
    category: m.category,
    image,
    description,
    url,
  };
  // Sin precio cargado no se declara offers: un price 0 seria un dato falso
  // y Google penaliza el marcado incorrecto.
  if (m.price > 0) {
    producto.offers = {
      '@type': 'Offer',
      price: String(m.price),
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock',
      url,
      seller: { '@id': `${SITE}/#organization` },
    };
  }
  return producto;
}
```

Y en el bucle de motos, reemplazar la llamada a `escribir` por:

```js
  const url = urlAbsoluta(ruta);
  const description = seo.motoDescription(m);
  let html = aplicar(base, {
    title: seo.motoTitle(m), description, url, image, type: 'product',
  });
  html = agregarJsonLd(html, productoDeMoto(m, url, image, description));
  escribir(ruta, html);
```

- [ ] **Step 4: Ejecutar y ver que pasa**

```bash
cd app && npm run build && node scripts/prerender-meta.mjs && node scripts/verify-prerender.mjs
```

Esperado: `verify-prerender: OK`

- [ ] **Step 5: Commit**

```bash
git add -- app/scripts/prerender-meta.mjs app/scripts/verify-prerender.mjs
git commit -m "$(cat <<'EOF'
feat(seo): JSON-LD Product por ficha de moto

Precio en COP y disponibilidad, para que Google pueda mostrar el precio en
resultados. Las motos sin precio cargado omiten offers en vez de declarar
price 0, que seria un dato falso.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Regenerar el sitemap desde el catálogo

El `sitemap.xml` de `public/` se escribió a mano: tiene 115 URLs de moto y el catálogo tiene 114: ya lista una moto que no existe, y se desfasa cada vez que se agrega o se quita una.

**Files:**
- Modify: `app/scripts/prerender-meta.mjs`
- Modify: `app/scripts/verify-prerender.mjs`
- Delete: `app/public/sitemap.xml` (al final, tras verificar el generado)

- [ ] **Step 1: Añadir la comprobación que falla**

En `app/scripts/verify-prerender.mjs`, antes del `console.log` final:

```js
// --- sitemap generado desde el catalogo ---
const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const locsMoto = locs.filter((u) => u.includes('/moto/'));

assert.equal(
  locsMoto.length, datosMotos.length,
  `el sitemap trae ${locsMoto.length} motos y el catalogo tiene ${datosMotos.length}`,
);
assert.ok(locs.includes('https://ibizamotos.co/'), 'falta la home en el sitemap');
assert.ok(locs.includes('https://ibizamotos.co/sucursales'), 'falta /sucursales en el sitemap');
assert.equal(new Set(locs).size, locs.length, 'el sitemap tiene URLs repetidas');
assert.ok(!locs.some((u) => u.includes('/admin')), 'el sitemap expone /admin');
```

- [ ] **Step 2: Ejecutar y ver que falla**

```bash
cd app && node scripts/verify-prerender.mjs
```

Esperado: FALLA. Si `public/sitemap.xml` todavía se copia a `dist`, falla con `el sitemap trae 115 motos y el catalogo tiene 114`.

- [ ] **Step 3: Generarlo**

Al final de `app/scripts/prerender-meta.mjs`, reemplazar la línea `export { rutasSitemap };` por:

```js
// --- sitemap.xml desde el mismo catalogo que genero las paginas ---
const hoy = new Date().toISOString().slice(0, 10);
const entradas = [
  { ruta: '/', prioridad: '1.0' },
  ...rutasSitemap,
];
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  entradas
    .map(({ ruta, prioridad }) =>
      `  <url>\n` +
      `    <loc>${urlAbsoluta(ruta)}</loc>\n` +
      `    <lastmod>${hoy}</lastmod>\n` +
      `    <priority>${prioridad}</priority>\n` +
      `  </url>`)
    .join('\n') +
  `\n</urlset>\n`;

writeFileSync(join(DIST, 'sitemap.xml'), xml, 'utf8');
console.log(`prerender: sitemap con ${entradas.length} URLs`);
```

Nota: `urlAbsoluta('/')` devuelve `https://ibizamotos.co/`, que es lo que el verificador espera.

- [ ] **Step 4: Ejecutar y ver que pasa**

```bash
cd app && npm run build && node scripts/prerender-meta.mjs && node scripts/verify-prerender.mjs
```

Esperado: `prerender: sitemap con 142 URLs` (141 páginas + la home) y `verify-prerender: OK`.

- [ ] **Step 5: Comprobar a ojo el sitemap generado y borrar el viejo**

```bash
cd app && head -20 dist/sitemap.xml
```

Confirmar que el XML está bien formado y las URLs son correctas. Entonces:

```bash
rm app/public/sitemap.xml
cd app && npm run build && node scripts/prerender-meta.mjs && node scripts/verify-prerender.mjs
```

Esperado: sigue pasando (ahora el único sitemap es el generado).

- [ ] **Step 6: Commit**

```bash
git add -- app/scripts/prerender-meta.mjs app/scripts/verify-prerender.mjs
git rm --cached -- app/public/sitemap.xml
git commit -m "$(cat <<'EOF'
feat(seo): generar el sitemap desde el catalogo

El sitemap escrito a mano tenia 115 motos y el catalogo tiene 114: listaba una que ya no existe.
Generarlo en el build evita que vuelva a envejecer.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Encadenar el prerender en el build

Hasta aquí el script se corría a mano. Esta tarea lo mete en `npm run build`, que es lo que ejecuta Vercel.

**Files:**
- Modify: `app/package.json`

- [ ] **Step 1: Encadenarlo**

En `app/package.json`, cambiar el script `build`:

```json
"build": "tsc -b && vite build && node scripts/prerender-meta.mjs && node scripts/verify-prerender.mjs",
```

El verificador va **dentro** del build a propósito: si el prerender se rompe, es preferible que falle el despliegue a publicar sin previsualizaciones creyendo que quedaron.

- [ ] **Step 2: Build limpio de punta a punta**

```bash
cd app && rm -rf dist && npm run build
```

Esperado: compila, imprime `prerender: N paginas`, `prerender: sitemap con N URLs` y `verify-prerender: OK`, y termina con código 0.

- [ ] **Step 3: Confirmar el resultado en disco**

```bash
cd app && ls dist/moto | head -5 && cat dist/moto/10/index.html | grep -o '<title>.*</title>'
```

Esperado: lista de carpetas numéricas y el título propio de esa moto, distinto del de la home.

- [ ] **Step 4: Commit**

```bash
git add -- app/package.json
git commit -m "$(cat <<'EOF'
build(web): encadenar prerender y verificacion en npm run build

El verificador corre dentro del build: si el prerender se rompe, preferimos
que falle el despliegue a publicar sin previsualizaciones.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Módulo de analítica

Sólo el módulo, sin cablear todavía. Sin IDs configurados no hace absolutamente nada.

**Files:**
- Create: `app/src/lib/analytics.ts`
- Modify: `app/src/vite-env.d.ts`
- Modify: `app/.env.local`

**Interfaces:**
- Produces:
  - `hasConsent(): boolean`
  - `setConsent(valor: 'granted' | 'denied'): void`
  - `getStoredConsent(): 'granted' | 'denied' | null`
  - `initAnalytics(): void`
  - `trackPageView(path: string): void`
  - `trackViewContent(m: { id: string; brand: string; model: string; price: number }): void`
  - `trackContact(origen: string): void`
  - `trackSearch(termino: string): void`
  - `CONSENT_KEY: string`

- [ ] **Step 1: Declarar las variables de entorno**

En `app/src/vite-env.d.ts`, añadir después de la línea `/// <reference types="vite/client" />`:

```ts
interface ImportMetaEnv {
  readonly VITE_META_PIXEL_ID?: string;
  readonly VITE_GA4_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

Si el archivo no existe, crearlo con la línea de referencia arriba y este bloque debajo.

- [ ] **Step 2: Añadir las variables vacías a `.env.local`**

Añadir al final de `app/.env.local`:

```
# Medicion. Vacias = no se carga ningun script.
# El pixel se crea en Meta Business Suite > Administrador de Eventos.
VITE_META_PIXEL_ID=
# La propiedad GA4 se crea en analytics.google.com. Formato G-XXXXXXXXXX.
VITE_GA4_ID=
```

- [ ] **Step 3: Escribir el módulo**

Crear `app/src/lib/analytics.ts`:

```ts
/**
 * Unico punto del sitio que toca fbq o gtag.
 *
 * Reglas:
 *  - Sin ID configurado, su script no se carga.
 *  - Sin consentimiento explicito, no se carga nada de nada.
 *  - Ninguna funcion lanza excepcion si el script no esta (bloqueadores).
 */

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim();
const GA4_ID = import.meta.env.VITE_GA4_ID?.trim();

export const CONSENT_KEY = 'ibz-consent';

type Consent = 'granted' | 'denied';

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getStoredConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    // Navegacion privada puede bloquear localStorage. Sin dato guardado,
    // se trata como "no decidido": nunca se asume consentimiento.
    return null;
  }
}

export function setConsent(valor: Consent): void {
  try {
    localStorage.setItem(CONSENT_KEY, valor);
  } catch {
    // Si no se puede guardar, la barra volvera a aparecer. Aceptable.
  }
}

export function hasConsent(): boolean {
  return getStoredConsent() === 'granted';
}

let iniciado = false;

function cargarPixel(id: string): void {
  /* eslint-disable */
  // Fragmento oficial de Meta, adaptado a TypeScript.
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true; t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq?.('init', id);
}

function cargarGA4(id: string): void {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  // El page_view lo mandamos nosotros en cada cambio de ruta.
  window.gtag('config', id, { send_page_view: false });
}

/** Idempotente. No hace nada sin consentimiento ni sin IDs. */
export function initAnalytics(): void {
  if (iniciado || !hasConsent()) return;
  if (!PIXEL_ID && !GA4_ID) return;
  iniciado = true;
  if (PIXEL_ID) cargarPixel(PIXEL_ID);
  if (GA4_ID) cargarGA4(GA4_ID);
}

export function trackPageView(path: string): void {
  if (!iniciado) return;
  window.fbq?.('track', 'PageView');
  window.gtag?.('event', 'page_view', { page_path: path });
}

export function trackViewContent(m: {
  id: string; brand: string; model: string; price: number;
}): void {
  if (!iniciado) return;
  const datos = {
    content_ids: [m.id],
    content_type: 'product',
    content_name: `${m.brand} ${m.model}`,
    value: m.price,
    currency: 'COP',
  };
  window.fbq?.('track', 'ViewContent', datos);
  window.gtag?.('event', 'view_item', datos);
}

/** El evento que importa: el salto a WhatsApp es la conversion real. */
export function trackContact(origen: string): void {
  if (!iniciado) return;
  window.fbq?.('track', 'Contact', { content_category: origen });
  window.gtag?.('event', 'generate_lead', { method: 'whatsapp', origen });
}

export function trackSearch(termino: string): void {
  if (!iniciado || !termino.trim()) return;
  window.fbq?.('track', 'Search', { search_string: termino });
  window.gtag?.('event', 'search', { search_term: termino });
}
```

- [ ] **Step 4: Compilar**

```bash
cd app && npm run build
```

Esperado: sin errores de TypeScript. El módulo aún no lo importa nadie, así que el bundle no debe cambiar de tamaño de forma apreciable.

- [ ] **Step 5: Commit**

```bash
git add -- app/src/lib/analytics.ts app/src/vite-env.d.ts app/.env.local
git commit -m "$(cat <<'EOF'
feat(analytics): modulo de medicion con pixel de Meta y GA4

Carga condicional: sin IDs configurados o sin consentimiento no se inyecta
ningun script. Ninguna funcion lanza si el script fue bloqueado.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Consentimiento y cableado de eventos

**Files:**
- Create: `app/src/components/CookieConsent.tsx`
- Modify: `app/src/components/Analytics.tsx` (archivo completo)
- Modify: `app/src/App.tsx:76`
- Modify: `app/src/pages/MotorcyclePage.tsx`
- Modify: `app/src/components/SearchOverlay.tsx`

**Interfaces:**
- Consumes: todo lo que produce `analytics.ts` en la Task 6.
- Produces: `<CookieConsent />`, y un `Analytics` que ya inicializa y reporta.

**Nota de diseño que refina el spec:** el spec preveía tocar los sitios de clic a WhatsApp «si son más de ~4, centralizar». Son **18** repartidos en 14 archivos. Así que se usa **un único listener delegado** en `Analytics.tsx` que captura cualquier clic sobre un enlace a `wa.me` — cero ediciones en esos 14 archivos. Los 4 sitios que abren WhatsApp con `window.open` en vez de un enlace (`MotorcyclePage.tsx:124`, `AppointmentPage.tsx:340`, `WhatsAppFloat.tsx:107`, `Footer.tsx:59`) quedan **fuera de esta captura y se anotan como pendiente conocido** al final del plan, para no dispersar el cambio.

- [ ] **Step 1: Escribir la barra de consentimiento**

Crear `app/src/components/CookieConsent.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredConsent, setConsent, initAnalytics, trackPageView } from '@/lib/analytics';

/**
 * Barra de consentimiento. Sin decision previa no se carga ningun pixel.
 * Al aceptar, la medicion arranca en el momento y registra la visita en
 * curso, sin recargar la pagina.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getStoredConsent() === null) setVisible(true);
  }, []);

  if (!visible) return null;

  const decidir = (valor: 'granted' | 'denied') => {
    setConsent(valor);
    setVisible(false);
    if (valor === 'granted') {
      initAnalytics();
      trackPageView(window.location.pathname);
    }
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 inset-x-0 z-[150] bg-ibiza-black/95 backdrop-blur border-t border-white/10 px-4 py-4"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm text-white/80 flex-1">
          Usamos cookies para medir el uso del sitio y mostrarte publicidad relevante.{' '}
          <Link to="/privacidad" className="underline text-white hover:text-ibiza-gold">
            Conoce cómo tratamos tus datos
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => decidir('denied')}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white/80 border border-white/20 hover:bg-white/10"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => decidir('granted')}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-ibiza-red text-white hover:bg-ibiza-red/90"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Reemplazar `Analytics.tsx` completo**

```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageView, trackContact } from '@/lib/analytics';

/**
 * Arranca la medicion y reporta cada cambio de ruta.
 *
 * Los contactos por WhatsApp se capturan con un unico listener delegado:
 * hay 18 enlaces a wa.me repartidos por el sitio y engancharlos uno a uno
 * seria imposible de mantener.
 */
export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      const enlace = target?.closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
      if (!enlace) return;
      // El origen sale de la ruta en la que estaba el visitante: sirve para
      // separar cotizaciones de ficha, repuestos, sucursales, etc.
      trackContact(window.location.pathname);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
```

- [ ] **Step 3: Montar la barra en `App.tsx`**

En `app/src/App.tsx`, añadir el import junto a los demás de `@/components`:

```tsx
import CookieConsent from '@/components/CookieConsent';
```

Y en `AppContent`, justo después de la línea 76 (`{!isAdminRoute && <WhatsAppFloat />}`), añadir:

```tsx
      {!isAdminRoute && <CookieConsent />}
```

- [ ] **Step 4: Disparar `ViewContent` en la ficha de moto**

En `app/src/pages/MotorcyclePage.tsx`, añadir el import:

```tsx
import { trackViewContent } from '@/lib/analytics';
```

Y después del bloque `useSEO(...)` que quedó en la Task 1, añadir:

```tsx
    // Publico de remarketing: "vio esta moto y no escribio".
    useEffect(() => {
        if (!motorcycle) return;
        trackViewContent({
            id: motorcycle.id,
            brand: motorcycle.brand,
            model: motorcycle.model,
            price: motorcycle.price,
        });
    }, [motorcycle]);
```

- [ ] **Step 5: Disparar `trackSearch` en el buscador**

En `app/src/components/SearchOverlay.tsx`, añadir el import:

```tsx
import { trackSearch } from '@/lib/analytics';
```

Localizar el estado que guarda el texto de búsqueda (la variable que alimenta el filtrado) y añadir, junto a los demás `useEffect` del componente:

```tsx
  // Rebote: no disparar en cada tecla, solo cuando el visitante deja de escribir.
  useEffect(() => {
    if (!query.trim()) return;
    const t = setTimeout(() => trackSearch(query), 800);
    return () => clearTimeout(t);
  }, [query]);
```

La variable de estado es `query`, declarada en `SearchOverlay.tsx:137` (`const [query, setQuery] = useState('')`).

- [ ] **Step 6: Compilar**

```bash
cd app && npm run build
```

Esperado: sin errores de TypeScript ni de ESLint en los archivos tocados.

- [ ] **Step 7: Probar el consentimiento a mano**

```bash
cd app && npm run dev
```

En el navegador, con la consola abierta:

1. Abrir en ventana privada → aparece la barra de cookies.
2. Pulsar **Rechazar** → la barra desaparece; en la pestaña Red **no** hay peticiones a `connect.facebook.net` ni a `googletagmanager.com`. (Con los IDs vacíos tampoco las habría; esta prueba se repite de verdad en la Task 8 una vez existan.)
3. Ejecutar `localStorage.getItem('ibz-consent')` → `"denied"`.
4. Ejecutar `localStorage.removeItem('ibz-consent')` y recargar → la barra vuelve.
5. Pulsar **Aceptar** → `localStorage.getItem('ibz-consent')` devuelve `"granted"` y la barra no vuelve a salir al navegar.

- [ ] **Step 8: Commit**

```bash
git add -- app/src/components/CookieConsent.tsx app/src/components/Analytics.tsx app/src/App.tsx app/src/pages/MotorcyclePage.tsx app/src/components/SearchOverlay.tsx
git commit -m "$(cat <<'EOF'
feat(analytics): consentimiento de cookies y eventos de negocio

Barra de consentimiento previo: sin aceptar no se carga ningun pixel.
Los 18 enlaces a wa.me se capturan con un unico listener delegado en vez
de tocar 14 archivos.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Verificar en Vercel y crear las cuentas

El riesgo principal del diseño: `vercel.json` tiene `{"source": "/(.*)", "destination": "/index.html"}`. Vercel debería servir el archivo estático antes de aplicar el rewrite, pero **hay que comprobarlo en un preview antes de tocar producción**.

**Files:**
- Modify (sólo si la comprobación falla): `app/../vercel.json`

- [ ] **Step 1: Desplegar a preview**

Subir la rama a GitHub y dejar que Vercel construya el preview, o bien:

```bash
npx vercel deploy
```

(no `--prod`). Anotar la URL del preview.

- [ ] **Step 2: Comprobar que cada ruta sirve lo suyo — el criterio de aceptación**

Sustituir `<PREVIEW>` por el dominio del preview:

```bash
for u in "" "moto/10" "sucursales"; do
  echo "== /$u"
  curl -s -A "facebookexternalhit/1.1" "https://<PREVIEW>/$u" \
    | grep -o -E '<title>[^<]*</title>|property="og:(title|image)" content="[^"]*"'
done
```

Esperado: **los tres bloques distintos entre sí**. `/moto/10` debe mostrar «AKT 125 NKD CBS FP 2027 | Ibiza Motos Pereira» y un `og:image` que apunte a la foto de esa moto, no al logo.

**Si los tres salen iguales**, el rewrite está ganando. Arreglo: en `vercel.json`, añadir antes de la regla comodín:

```json
{ "source": "/moto/:id",   "destination": "/moto/:id/index.html" },
{ "source": "/marca/:id",  "destination": "/marca/:id/index.html" },
{ "source": "/blog/:id",   "destination": "/blog/:id/index.html" },
```

y volver a desplegar el preview y repetir la comprobación.

- [ ] **Step 3: Comprobar el sitemap en el preview**

```bash
curl -s "https://<PREVIEW>/sitemap.xml" | grep -c "<loc>"
```

Esperado: 142, el mismo número que imprime el build. Que sea distinto del viejo (143) es normal: el viejo se escribió a mano y listaba rutas que ya no existen.

- [ ] **Step 4: Commit (sólo si hubo que tocar `vercel.json`)**

```bash
git add -- vercel.json
git commit -m "$(cat <<'EOF'
fix(vercel): servir el HTML prerenderizado antes del comodin del SPA

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: Crear las cuentas de medición**

Esto lo hace una persona en el navegador; no es automatizable y ninguna de las dos existe hoy.

1. **Píxel de Meta** — Meta Business Suite → Administrador de Eventos → Conjuntos de datos → Crear. Hacerlo dentro del Business Manager que ya tiene conectadas la página de Facebook y la cuenta de Instagram. Copiar el ID (15-16 dígitos).
2. **Propiedad GA4** — analytics.google.com → Administrar → Crear propiedad → flujo de datos web para `ibizamotos.co`. Copiar el ID de medición (`G-XXXXXXXXXX`).

- [ ] **Step 6: Configurar los IDs en Vercel**

En el panel de Vercel → Settings → Environment Variables, añadir `VITE_META_PIXEL_ID` y `VITE_GA4_ID` para Production y Preview. Volver a desplegar (las variables `VITE_` se incrustan en el build; no basta con guardarlas).

Pegar también los valores en `app/.env.local` para desarrollo. **No commitear `.env.local`** — ya está en `.gitignore`.

- [ ] **Step 7: Verificar la medición de punta a punta**

1. Abrir el preview en ventana privada → aparece la barra de cookies.
2. **Rechazar** → en la pestaña Red **no** debe haber peticiones a `connect.facebook.net` ni a `googletagmanager.com`. Esta es la comprobación que de verdad importa.
3. Borrar el consentimiento, recargar y **Aceptar** → ahora sí aparecen.
4. Abrir una ficha de moto y pulsar un botón de WhatsApp.
5. En el Administrador de Eventos de Meta (pestaña Prueba de eventos) confirmar que llegan `PageView`, `ViewContent` y `Contact`.

- [ ] **Step 8: Validadores oficiales y prueba real**

1. **Facebook Sharing Debugger** (`developers.facebook.com/tools/debug/`) sobre `https://<PREVIEW>/moto/10` → debe mostrar el título y la foto de esa moto. Pulsar «Scrape Again» para limpiar caché.
2. **Prueba de resultados enriquecidos de Google** sobre la misma URL → debe detectar un `Product` con su precio.
3. **La prueba que importa:** pegar `https://<PREVIEW>/moto/10` en un chat de WhatsApp y ver que la tarjeta muestra la moto con su nombre, no el logo.

- [ ] **Step 9: Promover a producción**

Sólo cuando los pasos 2, 7 y 8 hayan pasado. Desplegar a producción y repetir el paso 2 contra `https://ibizamotos.co`.

Después, en Google Search Console, enviar `https://ibizamotos.co/sitemap.xml` para que reindexe con las 142 URLs.

---

## Pendientes conocidos (no son parte de este plan)

1. **Cuatro contactos de WhatsApp no quedan medidos** — los que abren con `window.open` en vez de un enlace: `MotorcyclePage.tsx:124`, `AppointmentPage.tsx:340`, `WhatsAppFloat.tsx:107`, `Footer.tsx:59`. El listener delegado sólo ve enlaces. Se resuelve añadiendo una línea `trackContact('...')` en cada uno. Se deja fuera para no dispersar el cambio; los 14 enlaces restantes sí quedan cubiertos.
2. **Las motos sin PNG/JPG comparten el logo** — el build las lista por nombre al terminar. Hay que generarles un raster.
3. **Las URLs de moto son `/moto/1`** en vez de un slug. Mejora de SEO real, pero implica 114 redirecciones 301 y su propio spec.
4. **El `<body>` sigue vacío** en el HTML servido. No afecta a Google (ejecuta JS) ni a las previsualizaciones (leen las etiquetas). Si algún día se quiere, se cambia sólo `prerender-meta.mjs` para usar Puppeteer, que ya está instalado.
