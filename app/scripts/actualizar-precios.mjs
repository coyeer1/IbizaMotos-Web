// Actualiza los precios de la web desde la lista oficial en Google Sheets.
//
//   node scripts/actualizar-precios.mjs              -> muestra cambios, pide confirmacion,
//                                                      compila, guarda en git y publica
//   node scripts/actualizar-precios.mjs --solo-ver   -> solo muestra los cambios
//   node scripts/actualizar-precios.mjs --sin-publicar [--si]
//                                                   -> escribe y compila, sin git ni deploy
//
// Lo normal es no correrlo a mano: doble clic en "ACTUALIZAR PRECIOS.bat".
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { buildSync } from 'esbuild';

const SHEET_ID = '18bu3NXvWnXdvVvBXsu-IVuUjKVL_D3CmCPZ9jfm42dM';
const PESTANA = 'CONSOLIDADO';
const URL_CSV = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${PESTANA}`;
const ARCHIVO = 'src/data/precios.generado.ts';
const MAPEO = 'scripts/precios-mapeo.json';

const args = new Set(process.argv.slice(2));
const SOLO_VER = args.has('--solo-ver');
const SIN_PUBLICAR = args.has('--sin-publicar');
const AUTO_SI = args.has('--si');

const pesos = (v) => (v > 0 ? '$' + v.toLocaleString('es-CO') : 'a consultar');
const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const salir = (msg, codigo = 1) => { console.log('\n' + msg + '\n'); process.exit(codigo); };

function correr(cmd, argv, opciones = {}) {
  return spawnSync(cmd, argv, { stdio: 'inherit', shell: true, ...opciones });
}
function salida(cmd, argv, opciones = {}) {
  const r = spawnSync(cmd, argv, { encoding: 'utf8', shell: true, ...opciones });
  return (r.stdout || '').trim();
}

/** Carga un modulo TypeScript del proyecto desde Node (mismo truco que el prerender). */
async function cargarTS(entrada) {
  const out = join(mkdtempSync(join(tmpdir(), 'precios-')), 'm.mjs');
  buildSync({ entryPoints: [entrada], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent' });
  return import(pathToFileURL(out).href);
}

/** CSV minimo (RFC 4180): comillas dobles y comas dentro de campos. */
function parsearCSV(texto) {
  const filas = []; let fila = [], campo = '', comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n') { fila.push(campo); filas.push(fila); fila = []; campo = ''; }
    else if (c !== '\r') campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  return filas;
}

// ─── 1. Revisiones previas (solo si va a publicar) ─────────────────────────────
if (!SOLO_VER && !SIN_PUBLICAR) {
  const rama = salida('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  if (rama !== 'master') salir(`La carpeta esta en la rama "${rama}", no en master. Publicar desde aqui podria subir otra version del sitio.`);
  // Archivos del repo modificados sin guardar saldrian publicados (Vercel sube el disco tal cual).
  const sucios = salida('git', ['status', '--porcelain']).split('\n').filter((l) => l && !l.startsWith('??'));
  if (sucios.length) salir('Hay cambios sin guardar en el repositorio y se publicarian junto con los precios:\n  ' + sucios.join('\n  ') + '\nGuardalos o descartalos primero.');
  console.log('Sincronizando con GitHub...');
  if (correr('git', ['pull', '--ff-only', '--quiet']).status !== 0) salir('No se pudo sincronizar con GitHub (git pull).');
}

// ─── 2. Leer la lista oficial ──────────────────────────────────────────────────
console.log(`\nLeyendo la lista de precios de Google Sheets (pestaña ${PESTANA})...`);
let csv;
try {
  const r = await fetch(URL_CSV);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  csv = await r.text();
} catch (e) {
  salir(`No se pudo leer el Sheet (${e.message}).\nRevisa internet, o que el Sheet siga compartido como "cualquiera con el enlace puede ver".`);
}
const filas = [];
for (const f of parsearCSV(csv)) {
  if (f.length < 4 || !f[0] || !/^\d{4}$/.test((f[2] || '').trim())) continue;
  const precio = Number((f[3] || '').replace(/\D/g, ''));
  if (!precio) continue;
  filas.push({ marca: f[0].trim(), modelo: f[1].trim(), anio: Number(f[2].trim()), precio });
}
if (filas.length < 50) salir(`El Sheet solo trajo ${filas.length} filas con precio; algo cambio en su formato. No toco nada.`);
console.log(`  ${filas.length} precios leidos.`);

// ─── 3. Cruzar con el catalogo de la web ───────────────────────────────────────
const { motorcycles } = await cargarTS('src/data/motorcycles.ts');
const { PRECIOS: antes = {} } = existsSync(ARCHIVO) ? await cargarTS(ARCHIVO) : {};
const mapeo = JSON.parse(readFileSync(MAPEO, 'utf8')).motos;

const nuevos = {}; const avisos = []; const sinPareja = []; const usados = new Set();
for (const m of motorcycles) {
  const nombre = mapeo[m.id];
  const buscar = nombre ? norm(nombre) : null;
  let deLaMoto = filas.filter((f) => norm(f.marca) === norm(m.brand) && (buscar ? norm(f.modelo) === buscar : norm(f.modelo) === norm(m.model)));
  if (!deLaMoto.length) {
    if (nombre) avisos.push(`${m.brand} ${m.model}: "${nombre}" ya no aparece en el Sheet; conserva su precio.`);
    else sinPareja.push(`${m.brand} ${m.model}`);
    if (antes[m.id]) nuevos[m.id] = antes[m.id];
    continue;
  }
  const porAnio = {};
  for (const f of deLaMoto) {
    usados.add(norm(f.marca) + '|' + norm(f.modelo));
    const k = String(f.anio);
    if (porAnio[k] && porAnio[k] !== f.precio) avisos.push(`${m.brand} ${m.model} ${k}: el Sheet trae dos precios (${pesos(porAnio[k])} y ${pesos(f.precio)}); uso el primero.`);
    else porAnio[k] ??= f.precio;
  }
  nuevos[m.id] = porAnio;
}

// ─── 4. Mostrar los cambios ────────────────────────────────────────────────────
const masNuevo = (p) => { const a = Object.keys(p || {}).map(Number).sort((x, y) => y - x)[0]; return a ? { anio: a, precio: p[String(a)] } : null; };
const cambios = [];
for (const m of motorcycles) {
  const n = nuevos[m.id]; if (!n) continue;
  const ya = JSON.stringify(antes[m.id] || null) === JSON.stringify(n);
  if (ya) continue;
  const viejo = { anio: m.year, precio: m.price };      // lo que muestra la web hoy
  const nuevo = masNuevo(n);
  const otros = Object.keys(n).map(Number).sort((a, b) => b - a).filter((a) => a !== nuevo.anio);
  const marcas = [];
  const noRedondos = Object.entries(n).filter(([, v]) => v % 1000).map(([a]) => a);
  if (noRedondos.length) marcas.push(`precio no redondo en ${noRedondos.join(', ')}`);
  if (viejo.precio > 0) { const d = (nuevo.precio - viejo.precio) / viejo.precio * 100; if (Math.abs(d) > 15) marcas.push(`salto de ${d > 0 ? '+' : ''}${d.toFixed(0)}%`); }
  cambios.push({ m, viejo, nuevo, otros: otros.map((a) => `${a}: ${pesos(n[String(a)])}`), marcas });
}

console.log('');
if (!cambios.length) {
  console.log('Los precios de la web ya estan al dia con el Sheet. No hay nada que cambiar.');
} else {
  const visibles = cambios.filter((c) => c.viejo.precio !== c.nuevo.precio || c.viejo.anio !== c.nuevo.anio);
  console.log(`CAMBIOS QUE VE EL CLIENTE (${visibles.length} motos):`);
  for (const c of visibles) {
    console.log(`  ${(c.m.brand + ' ' + c.m.model).slice(0, 34).padEnd(34)} `
      + `${pesos(c.viejo.precio).padStart(13)} (${c.viejo.anio}) -> ${pesos(c.nuevo.precio).padStart(13)} (${c.nuevo.anio})`
      + (c.otros.length ? `   | tambien ${c.otros.join(', ')}` : '')
      + (c.marcas.length ? `   << REVISAR: ${c.marcas.join(', ')}` : ''));
  }
  const internos = cambios.length - visibles.length;
  if (internos) console.log(`  (+ ${internos} motos que no cambian de precio visible; solo se actualizan sus precios por año modelo)`);
}
if (avisos.length) { console.log('\nAVISOS:'); avisos.forEach((a) => console.log('  ' + a)); }
if (sinPareja.length) console.log(`\nMotos de la web que no estan en el Sheet (conservan su precio): ${sinPareja.join(', ')}`);
const marcasWeb = new Set(motorcycles.map((m) => norm(m.brand)));
const faltan = [...new Set(filas.filter((f) => marcasWeb.has(norm(f.marca)) && !usados.has(norm(f.marca) + '|' + norm(f.modelo))).map((f) => `${f.marca} ${f.modelo}`))];
if (faltan.length) console.log(`\nModelos del Sheet que la web todavia no tiene (${faltan.length}; se agregan a mano, con fotos):\n  ${faltan.join('\n  ')}`);

if (!cambios.length || SOLO_VER) process.exit(0);

// ─── 5. Confirmar ──────────────────────────────────────────────────────────────
if (!AUTO_SI) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const r = (await rl.question(`\n${SIN_PUBLICAR ? 'Aplico estos cambios' : 'Aplico estos cambios y PUBLICO la web'}? (s/n): `)).trim().toLowerCase();
  rl.close();
  if (!['s', 'si', 'sí', 'y', 'yes'].includes(r)) salir('Cancelado. No se toco nada.', 0);
}

// ─── 6. Escribir, compilar y verificar ─────────────────────────────────────────
const hoy = new Date().toISOString().slice(0, 10);
const previo = existsSync(ARCHIVO) ? readFileSync(ARCHIVO, 'utf8') : null;
const ordenado = Object.fromEntries(Object.entries(nuevos).sort(([a], [b]) => Number(a) - Number(b)));
writeFileSync(ARCHIVO,
  `// GENERADO por scripts/actualizar-precios.mjs a partir de la lista oficial en Google Sheets.\n`
  + `// No editar a mano: el proximo "ACTUALIZAR PRECIOS" lo sobrescribe.\n`
  + `// id de la moto -> { "año modelo": precio }. La web muestra por defecto el año mas nuevo.\n`
  + `export const PRECIOS_ACTUALIZADO = '${hoy}';\n\n`
  + `export const PRECIOS: Record<string, Record<string, number>> = ${JSON.stringify(ordenado, null, 2)};\n`, 'utf8');
console.log('\nCompilando y verificando la web (1-2 minutos)...');
if (correr('npm', ['run', 'build']).status !== 0) {
  if (previo === null) writeFileSync(ARCHIVO, 'export const PRECIOS_ACTUALIZADO = \'\';\nexport const PRECIOS: Record<string, Record<string, number>> = {};\n');
  else writeFileSync(ARCHIVO, previo, 'utf8');
  salir('La compilacion fallo: deje los precios como estaban y NO publique nada.');
}
if (SIN_PUBLICAR) salir(`Listo: ${cambios.length} motos actualizadas y compiladas (sin publicar).`, 0);

// ─── 7. Guardar en el repositorio y publicar ───────────────────────────────────
correr('git', ['add', ARCHIVO]);
if (correr('git', ['commit', '-q', '-m', `"chore(precios): lista de precios ${hoy} (${cambios.length} motos)"`]).status !== 0) salir('No se pudo guardar el cambio en git.');
if (correr('git', ['push', '-q', 'origin', 'master']).status !== 0) console.log('AVISO: no se pudo subir a GitHub; el cambio quedo guardado en este computador.');
console.log('\nPublicando en ibizamotos.co...');
if (correr('vercel', ['deploy', '--prod', '--yes'], { cwd: '..' }).status !== 0) salir('La publicacion en Vercel fallo. Los precios quedaron guardados; vuelve a correr esto o publica con "vercel --prod".');
salir(`Listo: ${cambios.length} motos con precio nuevo, publicadas en https://ibizamotos.co`, 0);
