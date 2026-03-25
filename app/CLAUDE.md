# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (localhost:5173)
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

There are no tests in this project.

## Environment Variables

All secrets live in `.env.local` (gitignored). Required vars:

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_ADMIN_PASSWORD` | Password for `/admin` login |
| `VITE_GCAL_SCRIPT_URL` | Google Apps Script webhook URL (optional) |

**Restart the dev server after changing `.env.local`** — Vite does not hot-reload env vars.

## Architecture

### Stack
- **React 19 + TypeScript + Vite** — SPA, no SSR
- **Tailwind CSS** — custom brand colors: `ibiza-red` (#d7263d), `ibiza-gold` (#f9c846), `ibiza-black` (#000000)
- **Framer Motion** — page/step transitions; always use `AnimatePresence mode="wait"` for step-based UIs
- **Supabase** — only used for the appointments table (`workshop_appointments`). Auth uses `signInWithPassword` to bypass RLS (admin only).
- **React Router v6** — client-side routing with `base: './'` in vite.config.ts (relative paths for deployment)

### Route Map

| Path | Component | Notes |
|---|---|---|
| `/` | `Home` | Assembled from `src/sections/` |
| `/marca/:brandId` | `BrandPage` | Brand catalog page |
| `/moto/:id` | `MotorcyclePage` | Individual bike detail |
| `/blog/:id` | `BlogPage` | Blog post detail |
| `/financiamiento` | `FinancingPage` | Loan calculator |
| `/citas` | `AppointmentPage` | 4-step appointment booking |
| `/admin` | `AdminLogin` | Password gate |
| `/admin/dashboard` | `AdminDashboard` | Protected admin panel |

Admin routes hide the `<Navbar>` and `<Footer>` and the WhatsApp float button.

### Data Flow

**Static data** (motorcycles, brands, blog posts, spare parts) lives entirely in:
- `src/data/motorcycles.ts` — ~1000 lines, all catalog data
- `src/data/blogPosts.ts`
- `src/types/index.ts` — shared TypeScript interfaces

**Dynamic data** (appointments only) goes through Supabase → `workshop_appointments` table.

**Business config** (phone, address, WhatsApp messages) → `src/lib/config.ts`. Always use `BUSINESS.*` constants and helper functions (`getQuoteWhatsApp`, `getBuyWhatsApp`, etc.) instead of hardcoding.

### Appointment Booking Flow (`/citas`)

4-step wizard managed by local state in `AppointmentPage.tsx`:
1. **Service selection** — picks from `SERVICES` array
2. **Date/time selection** — custom calendar, queries Supabase for booked slots
3. **Client form** — name, phone, email, motorcycle, notes
4. **Confirmation** — saves to Supabase, fires Apps Script webhook, shows success screen

**Critical**: `clientCalendarUrl` must only be computed when **both** `selectedDate` and `selectedTime` are truthy. Computing it with an empty `selectedTime` causes `buildGoogleCalendarUrl` to produce an Invalid Date → `toISOString()` throws → black screen.

### Google Calendar Integration

Two independent mechanisms in `src/lib/googleCalendar.ts`:
- **`buildGoogleCalendarUrl()`** — generates a `calendar.google.com/render?action=TEMPLATE` URL for the client to add the event to their own calendar. Pure function, no auth needed.
- **`notifyAppsScript()`** — fire-and-forget POST (`mode: 'no-cors'`) to `VITE_GCAL_SCRIPT_URL`. Creates the event in the company's "citas ibiza" calendar. Fails silently if the URL is not set.

The companion `google-apps-script.gs` (project root) is deployed at `script.google.com` as a web app. After editing it locally, the deployed version must also be updated and re-deployed as a new version.

### Admin Dashboard (`/admin/dashboard`)

Protected by `useAdminAuth` hook + `AdminAuthProvider` context. Login calls Supabase `signInWithPassword` with `web@ibizamotos.com` to acquire an authenticated session that bypasses Row Level Security.

The dashboard has tabs: **Citas** (appointments from Supabase) | **Motos** (static catalog) | **Repuestos** | **Financiero** | **Comparativa** | **Reviews**. The Citas tab embeds a Google Calendar iframe for the "citas ibiza" calendar.

### Component Conventions

- `src/components/ui/` — shadcn/ui primitives, do not modify unless necessary
- `src/sections/` — homepage sections assembled in `src/pages/Home.tsx`
- `src/components/` — reusable feature components (Navbar, MotoComparator, etc.)
- Path alias `@/` maps to `src/`

---

## Cambios recientes (marzo 2026)

### WhatsApp por marca (`src/lib/config.ts`)
Se agregó `BRAND_CONTACTS` — un objeto con número de WhatsApp para ventas (`sales`) y repuestos (`parts`) por cada marca. **Los números actuales son placeholders** — deben reemplazarse con los números reales de cada encargado.

Helpers disponibles:
- `getBrandSalesWhatsApp(brandName)` — para sección Motos
- `getBrandPartsWhatsApp(brandName)` — para sección Repuestos

### Sección Motos — BrandSelector (`src/sections/BrandSelector.tsx`)
Los logos de marcas ya **no navegan** a `/marca/:slug`. Ahora cada logo abre WhatsApp del encargado de ventas de esa marca (`getBrandSalesWhatsApp`). Al hover aparece chip verde "Consultar".

### Sección Repuestos — SpareParts (`src/sections/SpareParts.tsx`)
Se eliminó el catálogo de productos (buscador + tarjetas). La sección ahora muestra **solo logos de marcas** que al hacer clic abren WhatsApp del encargado de repuestos (`getBrandPartsWhatsApp`) + banner CTA al fondo.

### Sección Clientes Felices (`src/sections/HappyCustomers.tsx`)
Nueva sección entre Testimonials y Locations. Carrusel con:
- **2 fotos visibles** a la vez, avanza de 1 en 1
- **Autoplay** cada 5 segundos, pausa al hacer hover
- **Lightbox** al hacer clic en cualquier foto
- Animación suave: fade + micro-movimiento vertical (`duration: 1.0, ease: [0.4, 0, 0.2, 1]`)
- Dots indicadores + barra de progreso dorada
- CTA "¿Ya eres parte de la familia? ¡Comparte tu foto!" → WhatsApp

**Fotos reales** en `/public/clientes/cliente1.jpg` … `cliente10.jpg`. Para agregar más fotos: guardar en esa carpeta y añadir entrada al array `customerPhotos` en el componente.

### Orden de secciones en Home (`src/pages/Home.tsx`)
Hero → PromosBanner → Brands → Categories → BrandSelector → FinancingCalculator → SpareParts → Services → Blog → Testimonials → **HappyCustomers** → Locations

### Sección Categorías — carousel AKT-style (`src/sections/Categories.tsx`)
Rediseñada como carousel horizontal inspirado en aktmotos.com. Puntos clave:

- **5 tarjetas** con imágenes PNG de producto en `/public/categories/` (gixxer.png, nkd.png, burgamn.png, special-110.png, xr.png)
- Cada categoría define `focalX` y `focalY` (%) + `transform: scale(2.2)` con `transformOrigin` al punto focal → simula zoom al faro delantero de la moto
- Hover escala a `scale(2.38)` vía `onMouseEnter/onMouseLeave` directos en el `<img>` (no Framer Motion, para máximo rendimiento)
- Layout: `overflow-x-auto + scroll-snap`, sin scrollbar visible (`no-scrollbar` clase custom en `index.css`)
- Flechas circulares izquierda/derecha hacen `scrollBy` de exactamente 1 card width + gap
- Texto y botón "Conócelas" son overlay inferior con gradiente oscuro

**Para ajustar el zoom focal de una moto**: cambiar `focalX`/`focalY` en el array `CATEGORIES`. Valores más altos en X mueven el recorte hacia la derecha de la imagen.

### Calculadora de Financiamiento — selector de financieras (`src/sections/FinancingCalculator.tsx`)
Rediseñada con selector de 8 entidades financieras reales (datos 2026):

| ID | Tasa mensual | Comisión | Plazo máx |
|---|---|---|---|
| `progreser` | 1.83% | 0% | 60 m |
| `bancobogota` | 1.26% | 0% | 60 m |
| `sufi` | 1.73% | 0% | 48 m |
| `brilla` | 1.81% | 0.93% | 48 m |
| `addi` | 1.83% | 3% | 36 m |
| `venfi` | 1.80% | 3% | 36 m |
| `sistecredito` | 1.90% | 10% | 36 m |
| `crediorbe` | 3.72% | 0% | 24 m |

- `selectedFin` controla tasa, comisión y plazo máximo disponible de manera reactiva
- La comisión es un cobro único sobre el monto financiado (no sobre el precio total), se muestra separado en los resultados
- Los plazos se deshabilitan si superan `fin.maxMonths` de la financiera seleccionada
- El color de la sección (acento, botones, tarjeta resultado) cambia al color de la financiera activa
- El mensaje de WhatsApp incluye el nombre de la financiera seleccionada
- La versión `compact` (usada dentro de `MotorcyclePage`) también tiene el selector de financieras
