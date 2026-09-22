import { Link } from 'react-router-dom';
import { setConsent, initAnalytics, trackPageView } from '@/lib/analytics';

interface CookieConsentProps {
  /** Fuente de verdad para mostrarse: vive en App.tsx (ver comentario alli). */
  visible: boolean;
  /** Avisa al padre que ya hay decision, para que libere a WhatsAppFloat. */
  onDecide: () => void;
}

/**
 * Barra de consentimiento. Sin decision previa no se carga ningun pixel.
 * Al aceptar, la medicion arranca en el momento y registra la visita en
 * curso (incluida su query string, para no perder atribucion de UTM en la
 * pagina exacta donde el visitante decidio), sin recargar la pagina.
 *
 * Componente controlado: la visibilidad la calcula App.tsx con un
 * inicializador perezoso (correcta desde el primer pintado, sin useEffect)
 * porque WhatsAppFloat necesita el mismo dato para levantarse por encima de
 * esta barra mientras este visible.
 */
export default function CookieConsent({ visible, onDecide }: CookieConsentProps) {
  if (!visible) return null;

  const decidir = (valor: 'granted' | 'denied') => {
    setConsent(valor);
    onDecide();
    if (valor === 'granted') {
      initAnalytics();
      trackPageView(window.location.pathname + window.location.search);
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
