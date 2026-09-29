/**
 * Lleva a una seccion de la home (#motos, #repuestos, #contacto...).
 *
 * Las secciones de la home son lazy: al llegar puede que el destino aun no exista, o
 * que exista pero las secciones de arriba sigan cargando y lo empujen hacia abajo
 * (el "Contacto" quedaba a mitad de pagina). Por eso espera a que aparezca y vuelve a
 * apuntar hasta que su posicion deje de moverse.
 */
const NAVBAR = 80;

export function scrollToSectionWhenReady(selector: string): () => void {
    let timer: ReturnType<typeof setTimeout>;
    let tries = 0;
    let lastTop = Number.NaN;
    let stable = 0;

    const tick = () => {
        const el = document.querySelector(selector);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR;
            if (Math.abs(top - lastTop) < 4) stable++;
            else { stable = 0; window.scrollTo({ top, behavior: tries === 0 ? 'smooth' : 'auto' }); }
            lastTop = top;
        }
        if (stable < 3 && tries++ < 60) timer = setTimeout(tick, 150);
    };
    timer = setTimeout(tick, 60);
    return () => clearTimeout(timer);
}
