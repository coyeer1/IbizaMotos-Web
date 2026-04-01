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

### Price Updater (`actualizar_precios.py` / `ACTUALIZAR PRECIOS.bat`)

Batch-updates motorcycle prices in `app/src/data/motorcycles.ts` by reading "Hoja 2" from the dealership's Excel file (`HOJA DE NEGOCIO IBIZA*.xlsm`) in the user's Downloads folder. The `MAPEO` dict maps Excel row names → model names in `motorcycles.ts`.

- Run by double-clicking `ACTUALIZAR PRECIOS.bat` (no terminal needed)
- Requires `openpyxl`: `python -m pip install openpyxl`
- Prioritizes 2026 price column; falls back to 2025 if empty
- Reports updated / unchanged / not-found models after running
- **After running, rebuild and deploy the site**

To add a new model to the price sync, add an entry to `MAPEO` in `actualizar_precios.py`:
```python
'NOMBRE EN EXCEL':  'Nombre exacto del model en motorcycles.ts',
```

### Photo Utilities

- `copiar_fotos.ps1` — copies motorcycle photos to the correct `app/public/moto_images/` subdirectory
- `renombrar_fotos.ps1` — renames photos to the naming convention used by `motorcycles.ts`

### Supabase SQL Scripts

Run these in the Supabase SQL editor (one-time setup):

| File | Purpose |
|---|---|
| `supabase-create-admin.sql` | Creates the `web@ibizamotos.com` admin user used by the dashboard login |
| `supabase-add-status.sql` | Adds the `status` column to `workshop_appointments` |
| `supabase-storage-setup.sql` | Configures storage buckets and RLS policies |
