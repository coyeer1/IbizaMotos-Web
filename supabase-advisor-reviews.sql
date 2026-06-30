-- ─────────────────────────────────────────────────────────────────────────────
-- Opiniones de asesores (QR por sucursal)
-- Ejecutar UNA vez en el SQL Editor de Supabase.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.advisor_reviews (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  sucursal_id      integer not null,
  sucursal_nombre  text    not null,
  asesor           text    not null,
  marca            text,
  rating           integer not null check (rating between 1 and 5),
  comentario       text    check (comentario is null or char_length(comentario) <= 1000),
  cliente_nombre   text    check (cliente_nombre is null or char_length(cliente_nombre) <= 120),
  cliente_telefono text    check (cliente_telefono is null or char_length(cliente_telefono) <= 40)
);

create index if not exists advisor_reviews_sucursal_idx on public.advisor_reviews (sucursal_id);
create index if not exists advisor_reviews_created_idx  on public.advisor_reviews (created_at desc);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.advisor_reviews enable row level security;

-- El público (anon) SOLO puede insertar opiniones, nunca leerlas.
-- El WITH CHECK replica las validaciones aunque alguien llame la API directo.
drop policy if exists "anon_insert_reviews" on public.advisor_reviews;
create policy "anon_insert_reviews"
  on public.advisor_reviews
  for insert
  to anon
  with check (
    rating between 1 and 5
    and (comentario is null or char_length(comentario) <= 1000)
  );

-- Solo sesiones autenticadas (el admin del panel) pueden leer y borrar.
drop policy if exists "authenticated_read_reviews" on public.advisor_reviews;
create policy "authenticated_read_reviews"
  on public.advisor_reviews
  for select
  to authenticated
  using (true);

drop policy if exists "authenticated_delete_reviews" on public.advisor_reviews;
create policy "authenticated_delete_reviews"
  on public.advisor_reviews
  for delete
  to authenticated
  using (true);

-- ─── Privilegios de tabla (necesarios además de las policies) ─────────────────
grant insert            on public.advisor_reviews to anon;
grant select, delete    on public.advisor_reviews to authenticated;
