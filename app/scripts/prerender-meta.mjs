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
  if (/\.(png|jpe?g)$/i.test(ruta) && existsSync(join(PUBLIC, ruta))) {
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

/**
 * Inserta un bloque JSON-LD antes de </head>, sin tocar los que ya existen
 * (Organization y MotorcycleDealer viven en index.html).
 */
function agregarJsonLd(html, objeto) {
  const json = JSON.stringify(objeto, null, 2).replace(/</g, '\\u003c');
  const bloque = `    <script type="application/ld+json">\n${json}\n    </script>\n`;
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

function escribir(ruta, html) {
  const destino = join(DIST, ruta.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, html, 'utf8');
}

// --- Rutas fijas: titulo y descripcion propios de cada una ---
// /privacidad y /eliminacion-datos NO van aqui: son HTML estatico propio
// (public/privacidad.html, public/eliminacion-datos.html) que vercel.json
// reescribe antes de tocar el filesystem. Si se generara un dist/<ruta>/index.html
// para ellas, Vercel serviria ese cascaron vacio de la SPA en vez del HTML real
// que Meta necesita poder leer sin JS. Igual deben quedar en el sitemap: ver
// RUTAS_SOLO_SITEMAP mas abajo.
const FIJAS = [
  ['/sucursales',        'Nuestras 20 sucursales | Ibiza Motos Eje Cafetero',      'Encuentra tu sede mas cercana: Pereira, Dosquebradas, Santa Rosa de Cabal, Quimbaya, Montenegro, Viterbo, Chinchina y Neiva. Direccion, telefono y horario de cada una.'],
  ['/financiamiento',    'Financia tu moto | 8 entidades | Ibiza Motos',           'Simula la cuota de tu moto con Progreser, Banco de Bogota, SUFI, Brilla, Addi, Venfi, Sistecredito o Crediorbe. Aprobacion rapida en Pereira y el Eje Cafetero.'],
  ['/citas',             'Servicio tecnico de motos | Ibiza Motos',                'Conoce nuestro servicio tecnico especializado para Suzuki, Honda, Bajaj, AKT, Hero y Vento en el Eje Cafetero.'],
  ['/opinion',           'Califica a tu asesor | Ibiza Motos',                     'Cuentanos como te atendieron. Tu opinion nos ayuda a mejorar el servicio en las 20 sucursales.'],
  ['/terminos',          'Terminos y condiciones | Ibiza Motos',                   'Condiciones de uso del sitio web de Ibiza Motos S.A.S.'],
  ['/marca/todas',       'Todas las marcas de motos | Ibiza Motos',                'Suzuki, Honda, Bajaj, AKT, Hero y Vento en un solo concesionario, con 20 sucursales en el Eje Cafetero y Neiva.'],
];

// Rutas que existen como HTML estatico servido por rewrite (ver vercel.json)
// y por eso no se generan como pagina, pero que igual deben aparecer en el
// sitemap para que Google y Meta las indexen.
const RUTAS_SOLO_SITEMAP = ['/privacidad', '/eliminacion-datos'];

const base = readFileSync(join(DIST, 'index.html'), 'utf8');
const sinRaster = [];
let total = 0;
const rutasSitemap = [];

// Motos
for (const m of datos.motorcycles) {
  const ruta = seo.motoPath(m);
  const [image, fallback] = imagenParaCompartir(m.images?.[0]);
  if (fallback) sinRaster.push(`${m.id} — ${m.brand} ${m.model}`);
  const url = urlAbsoluta(ruta);
  const description = seo.motoDescription(m);
  let html = aplicar(base, {
    title: seo.motoTitle(m), description, url, image, type: 'product',
  });
  html = agregarJsonLd(html, productoDeMoto(m, url, image, description));
  escribir(ruta, html);
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

// --- sitemap.xml desde el mismo catalogo que genero las paginas ---
// RUTAS_SOLO_SITEMAP se agrega aparte: no pasaron por el loop de FIJAS (no se
// generan como pagina), pero igual deben quedar indexadas.
const hoy = new Date().toISOString().slice(0, 10);
const entradas = [
  { ruta: '/', prioridad: '1.0' },
  ...rutasSitemap,
  ...RUTAS_SOLO_SITEMAP.map((ruta) => ({ ruta, prioridad: '0.7' })),
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
