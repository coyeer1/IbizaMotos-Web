import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredConsent, setConsent, initAnalytics, trackPageView } from '@/lib/analytics';

/**
 * Barra de consentimiento. Sin decision previa no se carga ningun pixel.
 * Al aceptar, la medicion arranca en el momento y registra la visita en
 * curso, sin recargar la pagina.
 *
 * La visibilidad inicial se calcula con un inicializador perezoso (en vez
 * de un useEffect) para no violar la regla react-hooks/set-state-in-effect
 * del lint del proyecto: el dato (localStorage) ya esta disponible de forma
 * sincronica al montar, asi que no hace falta un efecto para leerlo.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(() => getStoredConsent() === null);

  if (!visible) return null;

  const decidir = (valor: 'granted' | 'denied') => {
    setConsent(valor);
    setVisible(false);
    if (valor === 'granted') {
      initAnalytics();
      trackPageView(window.location.pathname);
    }
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 inset-x-0 z-[150] bg-ibiza-black/95 backdrop-blur border-t border-white/10 px-4 py-4"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm text-white/80 flex-1">
          Usamos cookies para medir el uso del sitio y mostrarte publicidad relevante.{' '}
          <Link to="/privacidad" className="underline text-white hover:text-ibiza-gold">
            Conoce cómo tratamos tus datos
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => decidir('denied')}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white/80 border border-white/20 hover:bg-white/10"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => decidir('granted')}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-ibiza-red text-white hover:bg-ibiza-red/90"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
