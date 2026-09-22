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
