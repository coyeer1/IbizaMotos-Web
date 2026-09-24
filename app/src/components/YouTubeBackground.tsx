import { useEffect, useRef, useState } from 'react';

/*
 * Video de YouTube como fondo, sin que se note que es YouTube.
 * Una portada (la foto de la moto) tapa el reproductor hasta que el video lleva
 * unos segundos sonando: asi nunca se ven el spinner, el boton de play, el titulo
 * ni los controles del arranque. Si el video no arranca (borrado, bloqueado,
 * autoplay prohibido) la portada se queda y la seccion sigue viendose bien.
 * Montar con key={videoId}: el estado no se reinicia al cambiar de video.
 * El bucle se hace a mano, antes del final, para no mostrar la pantalla final.
 */

interface YTPlayer {
    playVideo(): void;
    seekTo(s: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    getPlaybackQuality?(): string;
    destroy(): void;
}
interface YTNamespace {
    Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer;
}
declare global {
    interface Window { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void }
}

let apiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (!apiPromise) {
        apiPromise = new Promise((resolve, reject) => {
            const prev = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => { prev?.(); if (window.YT) resolve(window.YT); };
            const s = document.createElement('script');
            s.src = 'https://www.youtube.com/iframe_api';
            s.async = true;
            s.onerror = () => { apiPromise = null; reject(new Error('iframe_api')); };
            document.head.appendChild(s);
        });
    }
    return apiPromise;
}

// Segundos de reproduccion antes de destapar: YouTube arranca en baja calidad
// y muestra el titulo; en este tiempo sube la calidad y el titulo se oculta.
const REVEAL_AFTER = 4;
// Si en este tiempo no se pudo destapar, se deja la portada para siempre.
const GIVE_UP_MS = 15000;
const LOW_QUALITY = ['tiny', 'small', 'medium'];

interface Props {
    videoId: string;
    poster: React.ReactNode;
}

export default function YouTubeBackground({ videoId, poster }: Props) {
    const hostRef = useRef<HTMLDivElement>(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        let player: YTPlayer | null = null;
        let timer: number | undefined;
        let cancelled = false;
        let shown = false;
        const host = hostRef.current;
        const startedAt = Date.now();

        const tick = () => {
            if (!player || cancelled) return;
            const t = player.getCurrentTime?.() ?? 0;
            const d = player.getDuration?.() ?? 0;
            // Bucle propio: volver al inicio antes de la pantalla final de YouTube.
            if (d > 2 && t > d - 0.6) player.seekTo(0, true);
            const q = player.getPlaybackQuality?.() ?? '';
            // Si YouTube se queda en baja calidad (conexion lenta) se prefiere la foto nitida.
            const sharp = !LOW_QUALITY.includes(q);
            if (t >= REVEAL_AFTER && sharp) { shown = true; setRevealed(true); }
            else if (!shown && Date.now() - startedAt > GIVE_UP_MS) {
                window.clearInterval(timer);
                player.destroy();
                player = null;
            }
        };

        loadYouTubeApi().then((YT) => {
            if (cancelled || !host) return;
            const el = document.createElement('div');
            host.appendChild(el);
            player = new YT.Player(el, {
                videoId,
                host: 'https://www.youtube-nocookie.com',
                playerVars: {
                    autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, rel: 0,
                    iv_load_policy: 3, modestbranding: 1, playsinline: 1, cc_load_policy: 0,
                },
                events: {
                    onReady: (e: { target: YTPlayer & { mute(): void } }) => { e.target.mute(); e.target.playVideo(); },
                    onStateChange: (e: { data: number; target: YTPlayer }) => {
                        if (e.data === 0) { e.target.seekTo(0, true); e.target.playVideo(); }
                    },
                },
            });
            timer = window.setInterval(tick, 250);
        }).catch(() => { /* sin API: se queda la portada */ });

        return () => {
            cancelled = true;
            window.clearInterval(timer);
            player?.destroy();
            if (host) host.innerHTML = '';
        };
    }, [videoId]);

    return (
        <>
            <div
                ref={hostRef}
                aria-hidden
                className="absolute top-1/2 left-1/2 [&>iframe]:w-full [&>iframe]:h-full"
                style={{ width: '177.78vh', height: '56.25vw', minWidth: '100%', minHeight: '100%', transform: 'translate(-50%, -50%) scale(1.15)', pointerEvents: 'none' }}
            />
            <div
                className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
                style={{ opacity: revealed ? 0 : 1 }}
            >
                {poster}
            </div>
        </>
    );
}
