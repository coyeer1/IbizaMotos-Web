import { useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/sections/Hero';
import Reveal from '@/components/Reveal';

// Secciones below-the-fold — se descargan solo cuando el usuario llega a ellas
const Brands          = lazy(() => import('@/sections/Brands'));
const PromosBanner    = lazy(() => import('@/sections/PromosBanner'));
const Categories      = lazy(() => import('@/sections/Categories'));
const BrandSelector   = lazy(() => import('@/sections/BrandSelector'));
const FinancingTeaser = lazy(() => import('@/sections/FinancingTeaser'));
const SpareParts      = lazy(() => import('@/sections/SpareParts'));
const Services        = lazy(() => import('@/sections/Services'));
const Blog            = lazy(() => import('@/sections/Blog'));
const HappyCustomers  = lazy(() => import('@/sections/HappyCustomers'));

function ScrollProgress() {
    const barRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let raf = 0;
        const update = () => {
            raf = 0;
            const el = document.documentElement;
            const total = el.scrollHeight - el.clientHeight;
            const p = total > 0 ? el.scrollTop / total : 0;
            const bar = barRef.current;
            if (bar) bar.style.transform = `scaleX(${p})`;
        };
        // rAF-throttled: escribe el transform directo al DOM (GPU, sin layout)
        // y SIN re-render de React en cada scroll → adiós a los micro-tirones.
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
        window.addEventListener('scroll', onScroll, { passive: true });
        update();
        return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
    }, []);
    return (
        <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none">
            <div
                ref={barRef}
                className="h-full bg-ibiza-red origin-left"
                style={{ transform: 'scaleX(0)', willChange: 'transform' }}
            />
        </div>
    );
}

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            <ScrollProgress />

            {/* Hero — carga inmediata (above the fold) */}
            <Hero />

            <Suspense fallback={<div style={{ minHeight: '300vh' }} aria-hidden />}>
                {/* Promotions Banner */}
                <PromosBanner />

                {/* Brands scroll — logos animados */}
                <Reveal>
                    <Brands onBrandClick={(brand) => {
                        navigate(`/marca/${brand.toLowerCase()}`);
                    }} />
                </Reveal>

                {/* Categories showcase */}
                <Reveal><Categories /></Reveal>

                {/* Brand selector — 1 moto por marca → /marca/:brand */}
                <Reveal><BrandSelector /></Reveal>

                {/* Financing Teaser → /financiamiento */}
                <Reveal><FinancingTeaser /></Reveal>

                {/* Spare Parts */}
                <Reveal><SpareParts /></Reveal>

                {/* Services */}
                <Reveal><Services /></Reveal>

                {/* Blog */}
                <Reveal><Blog /></Reveal>

                {/* Clientes Felices */}
                <Reveal><HappyCustomers /></Reveal>
            </Suspense>
        </>
    );
}
