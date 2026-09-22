// Verifica lo que dejó prerender-meta.mjs. Se ejecuta con:
//   node scripts/verify-prerender.mjs
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { buildSync } from 'esbuild';

const salidaCat = join(mkdtempSync(join(tmpdir(), 'verify-')), 'motorcycles.mjs');
buildSync({
  entryPoints: ['src/data/motorcycles.ts'],
  bundle: true, format: 'esm', platform: 'node', outfile: salidaCat, logLevel: 'silent',
});
const { motorcycles: datosMotos } = await import(pathToFileURL(salidaCat).href);

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

console.log('verify-prerender: OK');
