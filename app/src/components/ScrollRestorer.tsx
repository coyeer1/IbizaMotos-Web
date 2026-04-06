import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Guarda la posición de scroll de cada ruta en sessionStorage
 * y la restaura al navegar hacia atrás (botón "back").
 */
export default function ScrollRestorer() {
  const location = useLocation();
  const navType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'

  // Ref que trackea el scroll actual en tiempo real (sin debounce)
  const scrollYRef = useRef(0);

  // Escuchar scroll globalmente y guardar en ref
  useEffect(() => {
    const track = () => { scrollYRef.current = window.scrollY; };
    window.addEventListener('scroll', track, { passive: true });
    return () => window.removeEventListener('scroll', track);
  }, []);

  // Guardar posición al SALIR de una ruta (cleanup del effect)
  // Corre ANTES de que la nueva página haga scrollTo(0,0),
  // por eso usamos el ref en vez de window.scrollY
  useEffect(() => {
    const key = `scroll::${location.key}`;
    return () => {
      sessionStorage.setItem(key, String(scrollYRef.current));
    };
  }, [location.key]);

  // Restaurar posición al VOLVER (POP) o ir arriba al AVANZAR (PUSH/REPLACE)
  useLayoutEffect(() => {
    if (navType === 'POP') {
      const key = `scroll::${location.key}`;
      const saved = sessionStorage.getItem(key);
      if (saved) {
        const y = parseInt(saved, 10);
        // Doble RAF: asegura que el DOM ya terminó de renderizarse
        const raf1 = requestAnimationFrame(() => {
          const raf2 = requestAnimationFrame(() => {
            window.scrollTo({ top: y, behavior: 'instant' });
          });
          return () => cancelAnimationFrame(raf2);
        });
        return () => cancelAnimationFrame(raf1);
      }
    } else {
      // Si es PUSH o REPLACE, siempre al top
      window.scrollTo(0, 0);
      // Fallback para navegadores rebeldes
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
  }, [location.pathname, location.key, navType]);

  return null;
}
