# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for **Ibiza Motos del Eje Cafetero** — a Colombian motorcycle dealership network. The website source lives entirely in the `app/` subdirectory (React + TypeScript + Vite). Full architecture documentation is in [`app/CLAUDE.md`](app/CLAUDE.md).

## Dev Commands

All commands must run from the `app/` directory:

```bash
cd app
npm run dev        # Start dev server (localhost:5173)
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

## Root-Level Tooling

### Price Updater (`ACTUALIZAR PRECIOS.bat`)

Monthly, double-click `ACTUALIZAR PRECIOS.bat`. It runs `app/scripts/actualizar-precios.mjs`, which:

1. Reads the official price list from Google Sheets (tab `CONSOLIDADO`, shared as "anyone with the link can view").
2. Shows the price changes the customer will see and waits for a yes.
3. Writes `app/src/data/precios.generado.ts`, runs `npm run build` (aborts and restores on failure), commits, pushes and deploys with `vercel --prod`.

It refuses to run if the folder is not on `master` or has uncommitted tracked changes, because Vercel uploads the disk as-is.

- Name matching lives in `app/scripts/precios-mapeo.json` (web motorcycle `id` -> exact `MODELO` in the Sheet). When the Sheet renames a model, fix it there.
- Each motorcycle shows the newest model year by default; `pricesByYear` keeps every year for the selector on the motorcycle page.
- Motorcycles missing from the Sheet keep the fallback price written in `motorcycles.ts`.
- `--solo-ver` only shows the changes.

### Photo Utilities

- `copiar_fotos.ps1` — copies motorcycle photos to the correct `app/public/moto_images/` subdirectory
- `renombrar_fotos.ps1` — renames photos to the naming convention used by `motorcycles.ts`

### Vercel Deployment

`vercel.json` (project root) configures the Vercel deployment:
- `buildCommand`: `cd app && npm run build`
- `outputDirectory`: `app/dist`
- `rewrites`: all routes → `/index.html` (SPA fallback)

**Deploy is MANUAL.** There is no Vercel Git integration (verified 2026-09-22: 0 deployments, 0 webhooks, no PR checks), so pushing or merging to `master` deploys nothing and creates no previews. Publish with `vercel --prod --yes` from the repo root (needs `vercel login`). **The CLI uploads the local directory as it is on disk — uncommitted changes ship too**, so check `git status` first.

### Supabase SQL Scripts

Run these in the Supabase SQL editor (one-time setup):

| File | Purpose |
|---|---|
| `supabase-create-admin.sql` | Creates the `web@ibizamotos.com` admin user used by the dashboard login |
| `supabase-add-status.sql` | Adds the `status` column to `workshop_appointments` |
| `supabase-storage-setup.sql` | Configures storage buckets and RLS policies |
