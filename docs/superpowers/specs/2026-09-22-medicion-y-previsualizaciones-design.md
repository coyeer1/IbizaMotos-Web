# Medición de pauta y previsualizaciones por ruta — diseño

**Fecha:** 2026-09-22
**Proyecto:** `pagina 1` — sitio público de Ibiza Motos (`ibizamotos.co`, React 19 + TS + Vite, desplegado en Vercel)
**Origen:** hallazgos del informe de competencia del 21–22 de septiembre de 2026

---

## 1. Problema

### 1.1 No hay medición

`app/src/components/Analytics.tsx` es una plantilla vacía: sólo escribe en consola y el cuerpo real está comentado desde que se creó. No hay píxel de Meta ni Google Analytics en el sitio.

Consecuencia concreta: si se aprueba presupuesto de pauta, no hay forma de saber qué anuncio generó ventas, ni de construir públicos de remarketing, ni de excluir a quien ya compró. La competencia directa sí lo tiene — Zagamotos corre Meta Pixel + Google Tag Manager + Analytics.

Se verificó que **no existe ningún píxel ni propiedad de GA4** en ninguno de los proyectos de Ibiza. Hay que crearlos. Sí existe una app de Meta con página de Facebook e Instagram conectadas (en el CRM), así que el píxel se crea dentro de ese mismo Business Manager.

### 1.2 Las previsualizaciones de enlaces están rotas

Medido el 22-09-2026 pidiendo el HTML crudo con el *user-agent* de `facebookexternalhit`:

| URL | Bytes | `og:title` que recibe |
|---|---:|---|
| `/` | 7 640 | «Ibiza Motos \| 19 sucursales en el Eje Cafetero y Neiva» |
| `/moto/dominar-400-volcano` | 7 640 | «Ibiza Motos \| 19 sucursales en el Eje Cafetero y Neiva» |
| `/sucursales` | 7 640 | «Ibiza Motos \| 19 sucursales en el Eje Cafetero y Neiva» |

Las tres rutas devuelven **el mismo archivo, byte por byte**.

**Causa:** el sitio ya tiene un hook `useSEO` bien hecho y aplicado en todas las páginas, pero corre dentro de un `useEffect` — es decir, después de que el navegador ejecuta JavaScript. Google ejecuta JS y sí lee esas etiquetas. WhatsApp, Facebook e Instagram **no**: leen el HTML crudo tal como sale del servidor, y ahí todas las rutas son idénticas.

Cuando un asesor pega el link de una moto en WhatsApp, al cliente le llega el logo genérico en vez de la moto con su precio.

### 1.3 Falta el dato estructurado de producto

Existen dos bloques JSON-LD (`Organization` y `MotorcycleDealer`) a nivel de sitio, pero ninguna ficha de moto declara `Product` con precio y disponibilidad, que es lo que permite que Google muestre el precio en los resultados de búsqueda.

### 1.4 Lo que NO está mal

El informe de competencia afirmó que la web «prácticamente solo tiene el título». Es incorrecto y queda corregido aquí: el sitio tiene `<title>`, meta description, keywords, Open Graph, Twitter cards, geo tags, canonical, dos bloques JSON-LD, `robots.txt`, `sitemap.xml` con 143 URLs (115 fichas de moto) y una carpeta `agente-seo` con playbook y borradores de blog. El SEO de sitio está por encima del promedio local. El problema es específico: las etiquetas son **las mismas para todas las rutas** en el HTML servido.

---

## 2. Alcance

**Dentro:**
1. Píxel de Meta + GA4, activados por variable de entorno
2. Aviso de cookies con consentimiento previo
3. Generación de un HTML por ruta con sus propias etiquetas (título, Open Graph, canonical)
4. JSON-LD `Product` por ficha de moto
5. Regeneración del `sitemap.xml` desde el catálogo

**Fuera:**
- **Reactivar el agendamiento de taller.** `WORKSHOP_BOOKING_ENABLED` se queda en `false`. Se apagó deliberadamente y reactivarlo exige decisiones de negocio (qué precios mostrar) y poblar `city` en las sucursales. Decisión del 22-09-2026: queda para otra sesión.
- Renderizado en servidor real (contenido del `<body>` en el HTML). Ver «Alternativas descartadas».
- Cambios de diseño o de contenido del sitio.

---

## 3. Diseño

### 3.1 Medición

**`app/src/lib/analytics.ts`** — módulo nuevo, única puerta de entrada a la analítica.

```
VITE_META_PIXEL_ID   → id del píxel (15-16 dígitos)
VITE_GA4_ID          → id de medición (G-XXXXXXXXXX)
```

Si una variable está vacía, su script **no se carga**. Sin IDs configurados el sitio se comporta exactamente como hoy: nada que romper en desarrollo, y se puede desplegar antes de tener las cuentas creadas.

Expone:

| Función | Qué hace |
|---|---|
| `initAnalytics()` | Inyecta los scripts una sola vez. Idempotente. No hace nada sin consentimiento. |
| `trackPageView(path)` | `PageView` de Meta + `page_view` de GA4 |
| `trackViewContent(moto)` | `ViewContent` con id, marca, modelo, precio y `currency: 'COP'` |
| `trackContact(origen)` | `Contact` — el origen distingue cotizar / comprar / repuestos / sucursal |
| `trackSearch(termino)` | `Search` |

**`app/src/components/Analytics.tsx`** — deja de ser plantilla. Llama a `initAnalytics()` al montar y a `trackPageView()` en cada cambio de `useLocation()`. Ya está montado en `App.tsx:75`, no hay que cablear nada más.

**Dónde se disparan los eventos de negocio:**

- `trackViewContent` — en `MotorcyclePage`, junto al `useSEO` que ya recibe la moto.
- `trackContact` — en los clics que abren WhatsApp. Los enlaces se construyen con los helpers de `src/lib/config.ts` (`getQuoteWhatsApp`, `getBuyWhatsApp`, `getBrandSalesWhatsApp`, `getBrandPartsWhatsApp`, `getServiceWhatsApp`). Esos helpers **devuelven URLs, no navegan**, así que el disparo va en los sitios de clic. Durante la implementación se cuentan los sitios: si son más de ~4, se centraliza en un helper `abrirWhatsApp(url, origen)` en vez de repetir la llamada.
- `trackSearch` — en `SearchOverlay`, con rebote para no disparar en cada tecla.

`trackContact` es el evento que más importa: hoy el lead se pierde en el salto a WhatsApp y no queda atribuido a ningún anuncio.

### 3.2 Consentimiento

**`app/src/components/CookieConsent.tsx`** — barra fija abajo, discreta, con «Aceptar» y «Rechazar» y enlace a `/privacidad` (la página ya existe y cumple Ley 1581/2012).

- La decisión se guarda en `localStorage` bajo `ibz-consent` (`"granted"` / `"denied"`), envuelto en `try/catch` porque algunos navegadores bloquean el almacenamiento en modo privado. Si falla el guardado, se trata como «no decidido» y la barra vuelve a aparecer — nunca se asume consentimiento.
- `initAnalytics()` sólo corre con `"granted"`. Al aceptar, se inicializa en el momento y se registra la visita en curso, sin recargar.
- Sin decisión previa: no se carga ningún píxel.

### 3.3 Generación de HTML por ruta

**`app/scripts/prerender-meta.mjs`** — script de Node que corre después de `vite build`.

```
"build": "tsc -b && vite build && node scripts/prerender-meta.mjs"
```

**Cómo lee el catálogo.** `src/data/motorcycles.ts` es TypeScript y Node no lo importa directamente. El script lo transpila a un módulo temporal con **esbuild**, presente en `node_modules` como dependencia de Vite (verificado: v0.27.2) — sin agregar nada al `package.json`. Como es una dependencia transitiva y depende del aplanado de `node_modules`, si en algún entorno no resuelve se declara como `devDependency` explícita; es el mismo paquete y la misma versión, así que no cambia nada más. El catálogo es estático (`useMotorcycles` sólo hace `import { motorcycles } from '@/data/motorcycles'`, no consulta base de datos), así que en tiempo de compilación está todo disponible.

**Qué genera.** Para cada ruta, una copia de `dist/index.html` con estas etiquetas reemplazadas por las de esa ruta:

- `<title>`, `meta[name=description]`, `link[rel=canonical]`
- `og:title`, `og:description`, `og:url`, `og:image`, `og:type`
- `twitter:title`, `twitter:description`, `twitter:image`
- para fichas de moto, un bloque `<script type="application/ld+json">` adicional con `Product`

Se escribe en `dist/<ruta>/index.html` (por ejemplo `dist/moto/dominar-400-volcano/index.html`).

**Rutas cubiertas:**

| Grupo | Origen | Cantidad aprox. |
|---|---|---|
| Fichas de moto | catálogo | 115 |
| Páginas de marca | catálogo | 7 |
| Blog | `src/data/blogPosts.ts` | variable |
| Fijas | lista explícita en el script | 8 |

Las páginas fijas van en una lista declarada dentro del script (`/sucursales`, `/financiamiento`, `/citas`, `/privacidad`, `/terminos`, `/eliminacion-datos`, `/opinion`, `/marca/todas`), cada una con su título y descripción. No se leen del `sitemap.xml`: la dirección es la contraria — el sitemap se genera desde aquí.

**Los textos no se duplican.** Los títulos y descripciones por moto son los mismos que ya produce `useSEO` en `MotorcyclePage`. Para no tener dos verdades que se desincronicen, esas plantillas se extraen a `src/lib/seoTexts.ts`, que consumen tanto el hook (en el navegador) como el script (en el build).

**Tres detalles que deciden si esto funciona:**

1. **URL absoluta.** `og:image` y `og:url` deben ser absolutas (`https://ibizamotos.co/...`). WhatsApp descarta las relativas.
2. **PNG, no WebP.** WhatsApp no renderiza WebP de forma confiable en previsualizaciones. Las fotos del catálogo son `.webp`, pero los PNG originales siguen en disco junto a ellos (verificado: 354 `.webp`, 224 `.png`, 80 `.jpg` en `public/moto_images`). El script busca el hermano `.png` o `.jpg`; si no existe, usa el logo.
3. **Reporte, no silencio.** Hay 118 carpetas de motos y no todas tienen necesariamente un raster. Al terminar, el script imprime la lista de motos que cayeron al logo, para poder agregarles PNG. Nunca falla callado ni rompe el build por esto.

### 3.4 JSON-LD `Product`

Por ficha de moto:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "<marca> <modelo> <año>",
  "brand": { "@type": "Brand", "name": "<marca>" },
  "image": "<url absoluta del PNG>",
  "description": "<misma descripción del og:description>",
  "offers": {
    "@type": "Offer",
    "price": "<precio>",
    "priceCurrency": "COP",
    "availability": "https://schema.org/InStock",
    "url": "<url absoluta de la ficha>",
    "seller": { "@id": "https://ibizamotos.co/#organization" }
  }
}
```

El `seller` referencia por `@id` la `Organization` que ya está declarada en `index.html`, en vez de repetir los datos.

**Motos sin precio.** El catálogo tiene modelos con precio `0` o ausente (`MotorcyclePage` ya los muestra como «Consultar»). Para esas se **omite el bloque `offers` completo** — declarar `price: 0` sería un dato falso y Google penaliza el marcado incorrecto.

### 3.5 Sitemap

El mismo script regenera `dist/sitemap.xml` desde el catálogo. Hoy es un archivo escrito a mano con 143 URLs que envejece cada vez que se agrega una moto. Al generarse, deja de desincronizarse.

Se conserva el `sitemap.xml` en `public/` como respaldo hasta comprobar que el generado sale correcto; después se elimina para no tener dos.

---

## 4. Archivos afectados

| Archivo | Acción |
|---|---|
| `app/src/lib/analytics.ts` | nuevo |
| `app/src/lib/seoTexts.ts` | nuevo — plantillas de título/descripción compartidas |
| `app/src/components/CookieConsent.tsx` | nuevo |
| `app/scripts/prerender-meta.mjs` | nuevo |
| `app/src/components/Analytics.tsx` | reemplazar el cuerpo vacío |
| `app/src/hooks/useSEO.ts` | usar `seoTexts` (sin cambiar su comportamiento) |
| `app/src/pages/MotorcyclePage.tsx` | `trackViewContent` + usar `seoTexts` |
| `app/src/components/SearchOverlay.tsx` | `trackSearch` |
| sitios de clic a WhatsApp | `trackContact` |
| `app/src/App.tsx` | montar `<CookieConsent />` |
| `app/package.json` | encadenar el script en `build` |
| `app/.env.local` | agregar las dos variables (vacías) |
| `app/public/sitemap.xml` | se elimina al final, tras verificar el generado |

**No se toca:** `WORKSHOP_BOOKING_ENABLED`, `vercel.json`, el diseño, ni el contenido.

Hay cambios sin commitear en el repo (`motorcycles.ts`, `brandThemes.ts`, `config.ts`, `SucursalesPage.tsx`, `BrandSelector.tsx`, y `optimize-images.mjs` y `public/_redirects` sin seguimiento). **Son de otro trabajo en curso y no se tocan**; los commits de esta tarea listan archivos explícitamente, nunca `git add -A`.

---

## 5. Casos borde y errores

| Situación | Comportamiento |
|---|---|
| Sin IDs configurados | No se carga ningún script. El sitio funciona igual que hoy. |
| Usuario rechaza cookies | No se carga ningún píxel. Nada de rastreo. |
| `localStorage` bloqueado | Se trata como «no decidido». Nunca se asume consentimiento. |
| Moto sin PNG ni JPG | `og:image` cae al logo y la moto sale listada en el reporte del build. |
| Moto sin precio | Se omite `offers`. El resto del `Product` se mantiene. |
| Bloqueador de anuncios | Los scripts no cargan; las funciones de `trackX` no deben lanzar excepción. Todas verifican existencia antes de llamar. |
| El script de prerender falla | El build falla con mensaje claro. Preferible a desplegar sin previsualizaciones creyendo que quedaron. |

---

## 6. Verificación

1. **`npm run build` en verde** (incluye `tsc -b`).
2. **Antes/después con el mismo comando que reveló el problema:** pedir `/`, `/moto/<id>` y `/sucursales` con el *user-agent* de `facebookexternalhit` y comprobar que cada una devuelve su propio `<title>` y su propio `og:image`. Este es el criterio de aceptación principal.
3. **Conteo:** el script reporta cuántos HTML generó; debe coincidir con motos + marcas + blog + fijas.
4. **Validadores oficiales, ya desplegado:** Facebook Sharing Debugger y la prueba de resultados enriquecidos de Google sobre una ficha de moto.
5. **Prueba real:** pegar un link de moto en un chat de WhatsApp y ver la tarjeta.
6. **Analítica:** con los IDs puestos, comprobar en el Administrador de Eventos de Meta que llegan `PageView`, `ViewContent` y `Contact`; verificar que **no** llegan si se rechazan las cookies.

No hay pruebas automatizadas en este proyecto (`app/CLAUDE.md`: «There are no tests in this project»), así que la verificación es por comando y por validador, no por suite.

---

## 7. Riesgos

| Riesgo | Mitigación |
|---|---|
| **Vercel podría servir `index.html` antes que el archivo estático.** `vercel.json` tiene `{"source": "/(.*)", "destination": "/index.html"}`. Vercel revisa el sistema de archivos antes de aplicar `rewrites`, así que `dist/moto/<id>/index.html` debería ganar — pero hay que **confirmarlo en un despliegue de preview antes de producción**. Si no gana, se añaden reglas explícitas antes del comodín. | Verificar en preview. Es el riesgo principal de todo el diseño. |
| El build se alarga | Generación por sustitución de texto, sin navegador: segundos, no minutos. |
| Títulos duplicados entre hook y script | Fuente única en `seoTexts.ts`. |
| Caché de Facebook con la versión vieja | Refrescar desde el Sharing Debugger tras desplegar. |

---

## 8. Alternativas descartadas

**Función en Vercel que detecte rastreadores** — inyectar las etiquetas al vuelo sólo para WhatsApp y Facebook. Evita alargar el build, pero mete una función serverless en el camino de todas las visitas y sirve contenido distinto según quién pregunta, técnica que Google desaconseja. Más piezas móviles para el mismo resultado.

**Prerenderizado completo con Puppeteer** — ya está instalado y dejaría el `<body>` lleno. Pero lleva el build de segundos a varios minutos y depende de que Chrome funcione dentro del entorno de compilación de Vercel, que es justo donde esto se rompe. Demasiado riesgo para un problema que la sustitución de etiquetas ya resuelve. **Si algún día se necesita el `<body>` renderizado, se cambia sólo este script y nada más.**

**Migrar a Next.js** — resolvería todo de raíz con SSR real, pero es rehacer el sitio entero para un problema que se arregla con un script.

---

## 9. Pendiente para el usuario

Fuera del código, hay que crear dos cuentas (ninguna existe hoy):

1. **Píxel de Meta** — en Meta Business Suite → Administrador de Eventos → Conjuntos de datos. Crearlo dentro del Business Manager que ya tiene la página de Facebook y la cuenta de Instagram conectadas. Devuelve un id de 15-16 dígitos.
2. **Propiedad GA4** — en analytics.google.com. Devuelve un id `G-XXXXXXXXXX`.

Los dos ids se pegan en `app/.env.local` para desarrollo y en las variables de entorno del proyecto en Vercel para producción. No son secretos: van visibles en el código de cualquier página web.
