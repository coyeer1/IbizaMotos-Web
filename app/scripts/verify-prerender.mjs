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
