import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageView, trackContact } from '@/lib/analytics';

/**
 * Arranca la medicion y reporta cada cambio de ruta.
 *
 * Los contactos por WhatsApp se capturan con un unico listener delegado:
 * hay 18 enlaces a wa.me repartidos por el sitio y engancharlos uno a uno
 * seria imposible de mantener.
 */
export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      const enlace = target?.closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
      if (!enlace) return;
      // El origen sale de la ruta en la que estaba el visitante: sirve para
      // separar cotizaciones de ficha, repuestos, sucursales, etc.
      trackContact(window.location.pathname);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
