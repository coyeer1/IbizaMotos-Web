# 🤖 Agente SEO + Contenido — Ibiza Motos

**Objetivo:** mantener la página viva y mejorar el posicionamiento local (Pereira / Eje Cafetero / Neiva) sin trabajo manual. El agente **propone**, un humano **aprueba y publica**.

**Modo:** bajo demanda — se dispara cuando el usuario dice **«corre el agente»** (ideal: 2-3 veces por semana).
**Entrega:** archivos dentro de este proyecto (`agente-seo/borradores/` y `agente-seo/informes/`).
**Imágenes:** el agente deja el **prompt de imagen listo**; el humano la genera en Google ImageFX / Gemini con su cuenta y la descarga.

---

## Qué hace en CADA corrida

### 1. Borrador de blog (SEO local)
- Escribe **1 artículo de 600-900 palabras** en Markdown, optimizado para búsquedas locales.
- Rota entre estos tipos de tema (no repetir el del informe anterior):
  1. **Novedades / modelos** (ej. una moto nueva del catálogo)
  2. **Comparativas** (modelo A vs B para un perfil de comprador)
  3. **Mantenimiento / tips** (cuidado de la moto, ahorro)
  4. **Financiación** (cómo comprar a crédito — SIN mostrar cuotas/tasas exactas)
  5. **Seguridad / manejo** (en vías del Eje Cafetero)
  6. **Local** ("mejores motos para X en Pereira/Dosquebradas/Neiva")
- Cada borrador incluye al inicio: `título`, `meta description` (≤155 caracteres), `keywords` (siempre con ciudad), y al final un **CTA a WhatsApp**.
- Guarda en `agente-seo/borradores/AAAA-MM-DD-slug.md`.

### 2. Brief de imagen
- Al final del borrador, incluye un **prompt de imagen** (descripción para generar la foto de portada). NO inventa fotos de modelos reales — para producto se usan fotos reales; el brief es para banners/lifestyle/abstracto.

### 3. Chequeo de salud del sitio
- Verifica que respondan (200) las URLs clave: `/`, `/financiamiento`, `/sucursales`, `/marca/akt`, un par de `/moto/:id`, `/sitemap.xml`, `/robots.txt`.
- Verifica que 2-3 imágenes clave no estén rotas.
- Reporta cualquier error.

### 4. Informe corto
- Guarda en `agente-seo/informes/AAAA-MM-DD.md` con:
  - Estado de salud (✅/⚠️ por URL).
  - **3 acciones de SEO concretas** para esta semana (priorizadas).
  - Nombre del borrador nuevo creado.

---

## Reglas (IMPORTANTES)
1. **Nunca inventar precios.** Si menciona precios, tomarlos de `PRECIOS-MOTOS.md` (raíz del proyecto). Mejor: decir "consulta el precio con un asesor".
2. **Nunca mostrar cuotas ni tasas** (decisión del dueño): financiación se vende como gancho, los números los da un asesor.
3. **No publicar solo.** Todo queda como borrador para aprobación humana.
4. **Voz de marca:** cercana, colombiana, directa. Pereira/Eje Cafetero como ancla local.
5. **No prometer entregas "el mismo día"** (depende de inventario y trámites).
6. Datos del negocio: 19 sucursales, marcas Suzuki/Honda/Bajaj/AKT/Hero/Vento, financiación con 8 aliadas, crédito en 24h.

---

## Cómo se publica un borrador (manual, lo hace el humano)
Los artículos del blog viven en `app/src/data/blogPosts.ts`. Para publicar un borrador aprobado, se agrega un objeto al arreglo `posts` con el título, excerpt, body (párrafos), imagen y categoría. (El agente puede dejar el objeto ya listo para pegar si se le pide.)
