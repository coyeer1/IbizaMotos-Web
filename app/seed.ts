/**
 * Seeding script — importa datos estáticos y los sube a Supabase.
 * Ejecutar desde la carpeta app/:
 *   npx tsx seed.ts
 *
 * Requiere que .env.local tenga VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
 * (o las vars sin prefijo VITE_, ver abajo).
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { motorcycles } from './src/data/motorcycles.js';
import { posts } from './src/data/blogPosts.js';

// dotenv no entiende .env.local por defecto
config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌  Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── helpers ────────────────────────────────────────────────────────────────

async function upsertInBatches<T extends object>(
  table: string,
  rows: T[],
  batchSize = 50,
) {
  let inserted = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from(table).upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error(`❌  Error en ${table} (lote ${i}–${i + batch.length - 1}):`, error.message);
      process.exit(1);
    }
    inserted += batch.length;
    console.log(`   ✓  ${table}: ${inserted}/${rows.length} filas insertadas`);
  }
}

// ─── motorcycles ─────────────────────────────────────────────────────────────

const motorcycleRows = motorcycles.map((m) => ({
  id:             m.id,
  brand:          m.brand,
  model:          m.model,
  year:           m.year,
  price:          m.price,
  category:       m.category,
  description:    m.description,
  specifications: m.specifications,
  images:         m.images,
  images_by_color: m.imagesByColor ?? null,
  video_url:      m.videoUrl ?? null,
  featured:       m.featured ?? false,
  stock:          m.stock ?? null,
}));

// ─── blog_posts ───────────────────────────────────────────────────────────────

const blogRows = posts.map((p) => ({
  id:        p.id,
  category:  p.category,
  title:     p.title,
  excerpt:   p.excerpt,
  body:      p.body,
  read_time: p.readTime,
  date:      p.date,
  image:     p.image,
  tags:      p.tags,
  views:     p.views,
  likes:     p.likes,
  featured:  p.featured ?? false,
}));

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀  Iniciando seeding...\n');

  // Autenticar como admin para que RLS permita INSERT/UPSERT
  const adminEmail    = 'web@ibizamotos.com';
  const adminPassword = process.env.VITE_ADMIN_PASSWORD!;
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });
  if (authError) {
    console.error('❌  No se pudo autenticar como admin:', authError.message);
    process.exit(1);
  }
  console.log('🔑  Autenticado como', adminEmail, '\n');

  console.log(`📦  Motos: ${motorcycleRows.length} registros`);
  await upsertInBatches('motorcycles', motorcycleRows);

  console.log(`\n📝  Blog posts: ${blogRows.length} registros`);
  await upsertInBatches('blog_posts', blogRows);

  console.log('\n✅  Seeding completado.\n');
}

main().catch((err) => {
  console.error('❌  Error inesperado:', err);
  process.exit(1);
});
