/**
 * Unico punto del sitio que toca fbq o gtag.
 *
 * Reglas:
 *  - Sin ID configurado, su script no se carga.
 *  - Sin consentimiento explicito, no se carga nada de nada.
 *  - Ninguna funcion lanza excepcion si el script no esta (bloqueadores).
 */

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim();
const GA4_ID = import.meta.env.VITE_GA4_ID?.trim();

export const CONSENT_KEY = 'ibz-consent';

type Consent = 'granted' | 'denied';

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getStoredConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    // Navegacion privada puede bloquear localStorage. Sin dato guardado,
    // se trata como "no decidido": nunca se asume consentimiento.
    return null;
  }
}

export function setConsent(valor: Consent): void {
  try {
    localStorage.setItem(CONSENT_KEY, valor);
  } catch {
    // Si no se puede guardar, la barra volvera a aparecer. Aceptable.
  }
}

export function hasConsent(): boolean {
  return getStoredConsent() === 'granted';
}

let iniciado = false;

function cargarPixel(id: string): void {
  /* eslint-disable */
  // Fragmento oficial de Meta, adaptado a TypeScript.
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true; t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq?.('init', id);
}

function cargarGA4(id: string): void {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  // El page_view lo mandamos nosotros en cada cambio de ruta.
  window.gtag('config', id, { send_page_view: false });
}

/** Idempotente. No hace nada sin consentimiento ni sin IDs. */
export function initAnalytics(): void {
  if (iniciado || !hasConsent()) return;
  if (!PIXEL_ID && !GA4_ID) return;
  iniciado = true;
  if (PIXEL_ID) cargarPixel(PIXEL_ID);
  if (GA4_ID) cargarGA4(GA4_ID);
}

export function trackPageView(path: string): void {
  if (!iniciado) return;
  window.fbq?.('track', 'PageView');
  window.gtag?.('event', 'page_view', { page_path: path });
}

export function trackViewContent(m: {
  id: string; brand: string; model: string; price: number;
}): void {
  if (!iniciado) return;
  const datos = {
    content_ids: [m.id],
    content_type: 'product',
    content_name: `${m.brand} ${m.model}`,
    value: m.price,
    currency: 'COP',
  };
  window.fbq?.('track', 'ViewContent', datos);
  window.gtag?.('event', 'view_item', datos);
}

/** El evento que importa: el salto a WhatsApp es la conversion real. */
export function trackContact(origen: string): void {
  if (!iniciado) return;
  window.fbq?.('track', 'Contact', { content_category: origen });
  window.gtag?.('event', 'generate_lead', { method: 'whatsapp', origen });
}

export function trackSearch(termino: string): void {
  if (!iniciado || !termino.trim()) return;
  window.fbq?.('track', 'Search', { search_string: termino });
  window.gtag?.('event', 'search', { search_term: termino });
}
