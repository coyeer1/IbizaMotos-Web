import { useEffect } from 'react';

const SITE = 'https://ibizamotos.co';
const DEFAULT_TITLE = 'Ibiza Motos | El placer en dos ruedas';

export interface SEOOptions {
  /** Título de la pestaña y de la página en Google. */
  title: string;
  /** Meta description (lo que Google muestra debajo del título). */
  description?: string;
  /** Ruta canónica explícita (ej. "/sucursales"). Si se omite, usa la ruta actual. */
  path?: string;
  /** Imagen para compartir en redes (absoluta o relativa al dominio). */
  image?: string;
  /** og:type — "website" por defecto, "product" para fichas de moto, "article" para blog. */
  type?: string;
}

function upsert(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setMetaName(name: string, content: string) {
  upsert(
    `meta[name="${name}"]`,
    () => { const m = document.createElement('meta'); m.setAttribute('name', name); return m; },
    'content',
    content,
  );
}

function setMetaProp(prop: string, content: string) {
  upsert(
    `meta[property="${prop}"]`,
    () => { const m = document.createElement('meta'); m.setAttribute('property', prop); return m; },
    'content',
    content,
  );
}

/**
 * Gestiona <title>, meta description, canonical y Open Graph por página.
 * Pensado para SPA: Google ejecuta el JS y lee estas etiquetas al indexar.
 * Cada página llama a useSEO(...) con su propio título/descr. única → más
 * páginas posicionables y mejores resultados en búsquedas locales.
 */
export function useSEO({ title, description, path, image, type = 'website' }: SEOOptions) {
  useEffect(() => {
    document.title = title;

    const url = SITE + (path ?? window.location.pathname);
    upsert(
      'link[rel="canonical"]',
      () => { const l = document.createElement('link'); l.setAttribute('rel', 'canonical'); return l; },
      'href',
      url,
    );

    setMetaProp('og:title', title);
    setMetaProp('og:url', url);
    setMetaProp('og:type', type);

    if (description) {
      setMetaName('description', description);
      setMetaProp('og:description', description);
    }

    if (image) {
      const abs = image.startsWith('http')
        ? image
        : SITE + (image.startsWith('/') ? image : `/${image}`);
      setMetaProp('og:image', abs);
      setMetaName('twitter:image', abs);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      // Restaura el canonical al home para no dejar uno obsoleto al cambiar de ruta.
      const c = document.head.querySelector('link[rel="canonical"]');
      if (c) c.setAttribute('href', SITE);
    };
  }, [title, description, path, image, type]);
}
