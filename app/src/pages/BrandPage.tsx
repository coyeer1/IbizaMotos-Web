import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronDown, Globe, Calendar, Bike, MessageCircle, ArrowRight } from 'lucide-react';
import type { Motorcycle } from '@/types';
import Catalog from '@/sections/Catalog';
import { brands, motorcycles as allMotos } from '@/data/motorcycles';
import { getBrandTheme } from '@/lib/brandThemes';
import { getBrandSalesWhatsApp } from '@/lib/config';

export default function BrandPage() {
    const { brandId } = useParams<{ brandId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('categoria') || 'all';
    const catalogRef = useRef<HTMLDivElement>(null);

    const [selectedBrand, setSelectedBrand] = useState<string>('all');

    useEffect(() => {
        const found = brands.find(
            b => b.slug === brandId?.toLowerCase() || b.name.toLowerCase() === brandId?.toLowerCase()
        );
        setSelectedBrand(found ? found.name : 'all');
        window.scrollTo(0, 0);
    }, [brandId]);

    const activeBrandData = brands.find(b => b.name === selectedBrand);
    const theme = getBrandTheme(selectedBrand);
    const motoCount = allMotos.filter(m => m.brand === selectedBrand).length;
    const waUrl = getBrandSalesWhatsApp(selectedBrand);

    const handleViewDetails = (motorcycle: Motorcycle) => {
        navigate(`/moto/${motorcycle.id}`);
    };

    const scrollToCatalog = () => {
        catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // ─── Sin marca válida: catálogo genérico ──────────────────────────────────
    if (!activeBrandData) {
        return (
            <div className="min-h-screen bg-ibiza-black pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-200 mb-6 group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                        <span className="text-sm font-medium">Volver</span>
                    </button>
                    <h1 className="text-4xl font-display font-bold text-white">
                        {initialCategory !== 'all' ? initialCategory : 'Catálogo completo'}
                    </h1>
                    <p className="text-gray-400 mt-2">Todas las marcas · Todas las motos</p>
                </div>
                <Catalog
                    onViewDetails={handleViewDetails}
                    selectedBrand={selectedBrand}
                    setSelectedBrand={setSelectedBrand}
                    hideTitle={true}
                    initialCategory={initialCategory}
                />
            </div>
        );
    }

    const hasVideo = !!theme.heroVideoId;

    // ── Moto insignia (flagship) de la marca ──────────────────────────────
    const FLAGSHIP: Record<string, string> = {
        Suzuki: 'Hayabusa',
        Bajaj: 'Dominar 400 Volcano',
        Honda: 'CB 300F',
        Hero: 'XPulse 200 R 4V',
        AKT: '250 R',
        Vento: 'Alpina 300 EFI',
    };
    const brandMotos = allMotos.filter(m => m.brand === selectedBrand);
    const flagship =
        brandMotos.find(m => m.model === FLAGSHIP[selectedBrand]) ??
        [...brandMotos]
            .filter(m => !/tuk|3w|carpado|auto/i.test(m.model))
            .sort((a, b) => b.price - a.price)[0] ??
        brandMotos[0];
    const flagshipImg = flagship?.images?.[0] ?? theme.slideImage;
    const formatCOP = (n: number) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

    return (
        <div className="min-h-screen" style={{ backgroundColor: theme.bg }}>

            {/* ─── HERO SPLIT PREMIUM ────────────────────────────────────────── */}
            <section className="relative w-full min-h-[92vh] flex flex-col overflow-hidden">

                {/* Backdrop atmosférico: video o imagen de marca, oscurecido */}
                {hasVideo ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${theme.heroVideoId}?autoplay=1&mute=1&loop=1&controls=0&rel=0&playlist=${theme.heroVideoId}&modestbranding=1&playsinline=1`}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50"
                        style={{ width: '177.78vh', height: '56.25vw', minWidth: '100%', minHeight: '100%' }}
                        frameBorder="0"
                        allow="autoplay; encrypted-media; fullscreen"
                    />
                ) : (
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110 opacity-30"
                        style={{ backgroundImage: `url(${theme.slideImage})` }}
                    />
                )}

                {/* Capas: oscurecido lateral + glow radial de marca + base inferior */}
                <div className="absolute inset-0" style={{ background: `linear-gradient(110deg, ${theme.bg} 0%, ${theme.bg}F2 42%, ${theme.bg}99 100%)` }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(115% 75% at 82% 48%, rgba(${theme.glowRgb}, 0.22) 0%, transparent 58%)` }} />
                <div className="absolute inset-x-0 bottom-0 h-44" style={{ background: `linear-gradient(to top, ${theme.bg} 0%, transparent 100%)` }} />

                {/* Botón volver */}
                <div className="absolute top-6 left-4 sm:left-8 z-30">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/70 hover:text-white text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:border-white/25 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Volver
                    </button>
                </div>

                {/* Grid de contenido */}
                <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-6 lg:gap-10 items-center pt-24 pb-20">

                    {/* ── LEFT: info de marca ── */}
                    <div className="order-2 lg:order-1 flex flex-col items-start">
                        {/* Logo + eyebrow */}
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-3 mb-6 flex-wrap"
                        >
                            <div className="bg-white rounded-xl px-4 py-2 shadow-lg">
                                <img src={activeBrandData.logo} alt={activeBrandData.name} className="h-6 sm:h-7 object-contain" />
                            </div>
                            <span
                                className="text-[10px] font-black tracking-[0.3em] uppercase px-3 py-1.5 rounded-full border"
                                style={{ color: theme.primary, borderColor: `rgba(${theme.glowRgb}, 0.35)`, backgroundColor: `rgba(${theme.glowRgb}, 0.12)` }}
                            >
                                {theme.origin} · desde {theme.founded}
                            </span>
                        </motion.div>

                        {/* Nombre de la marca */}
                        <motion.h1
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.08 }}
                            className="font-display font-black text-6xl sm:text-7xl lg:text-8xl text-white leading-[0.85] tracking-tight uppercase mb-4"
                            style={{ textShadow: `0 0 80px rgba(${theme.glowRgb}, 0.3)` }}
                        >
                            {activeBrandData.name}
                        </motion.h1>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.16 }}
                            className="text-xl sm:text-2xl font-medium italic mb-5 text-white/85"
                        >
                            "{theme.tagline}"
                        </motion.p>

                        {/* Descripción corta */}
                        {theme.description && (
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.22 }}
                                className="text-gray-400 text-base leading-relaxed mb-7 max-w-md"
                            >
                                {theme.description.length > 160 ? theme.description.slice(0, 160).trim() + '…' : theme.description}
                            </motion.p>
                        )}

                        {/* Mini-stats inline */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.28 }}
                            className="flex items-center gap-5 sm:gap-7 mb-8"
                        >
                            {[
                                { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Fundada', value: theme.founded || '—' },
                                { icon: <Globe className="w-3.5 h-3.5" />, label: 'Origen', value: theme.origin || '—' },
                                { icon: <Bike className="w-3.5 h-3.5" />, label: 'Modelos', value: String(motoCount) },
                            ].map((stat, i) => (
                                <div key={stat.label} className="flex items-center gap-2.5">
                                    {i > 0 && <span className="w-px h-8 bg-white/10 -ml-3.5 sm:-ml-5 mr-1" />}
                                    <span style={{ color: theme.primary }}>{stat.icon}</span>
                                    <div>
                                        <p className="text-[9px] font-bold text-white/40 tracking-widest uppercase leading-none mb-1">{stat.label}</p>
                                        <p className="font-display font-bold text-white text-sm leading-none">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.34 }}
                            className="flex flex-wrap gap-3"
                        >
                            <button
                                onClick={scrollToCatalog}
                                className="flex items-center gap-2.5 text-white font-display font-bold text-sm uppercase tracking-wider px-7 py-3.5 rounded-full transition-all hover:brightness-110 hover:-translate-y-0.5"
                                style={{ backgroundColor: theme.primary, boxShadow: `0 0 30px rgba(${theme.glowRgb}, 0.4)` }}
                            >
                                Ver catálogo
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 text-white font-display font-bold text-sm uppercase tracking-wider px-7 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Hablar con asesor
                            </a>
                        </motion.div>
                    </div>

                    {/* ── RIGHT: moto insignia ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                        className="order-1 lg:order-2 relative flex items-center justify-center min-h-[34vh] lg:min-h-0"
                    >
                        {/* Glow detrás de la moto */}
                        <div
                            className="absolute w-[78%] h-[70%] rounded-full blur-[110px] pointer-events-none"
                            style={{ backgroundColor: `rgba(${theme.glowRgb}, 0.3)` }}
                        />
                        {flagship && (
                            <button
                                onClick={() => navigate(`/moto/${flagship.id}`)}
                                className="relative z-10 w-full group cursor-pointer"
                                aria-label={`Ver ${activeBrandData.name} ${flagship.model}`}
                            >
                                <div className="bike-float">
                                    <img
                                        src={flagshipImg}
                                        alt={`${activeBrandData.name} ${flagship.model}`}
                                        className="w-full max-h-[44vh] lg:max-h-[58vh] object-contain mx-auto drop-shadow-[0_30px_55px_rgba(0,0,0,0.7)] group-hover:scale-[1.03] transition-transform duration-500"
                                    />
                                </div>
                                {/* Badge insignia */}
                                <div className="mt-4 inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 group-hover:border-white/25 transition-all">
                                    <span className="text-[9px] font-black tracking-[0.25em] uppercase px-2 py-1 rounded-md" style={{ color: theme.primary, backgroundColor: `rgba(${theme.glowRgb}, 0.15)` }}>
                                        Insignia
                                    </span>
                                    <div className="text-left">
                                        <p className="font-display font-bold text-white text-sm leading-tight">{flagship.model}</p>
                                        <p className="text-white/50 text-xs leading-tight">desde {formatCOP(flagship.price)}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                                </div>
                            </button>
                        )}
                    </motion.div>
                </div>

                {/* Indicador de scroll */}
                <motion.button
                    onClick={scrollToCatalog}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/40 hover:text-white/80 transition-colors"
                    aria-label="Ver catálogo"
                >
                    <span className="text-[9px] font-bold tracking-[0.25em] uppercase">Catálogo</span>
                    <ChevronDown className="w-5 h-5 animate-bounce" />
                </motion.button>
            </section>

            {/* ─── DESCRIPCIÓN DE MARCA ───────────────────────────────────────── */}
            {theme.description && (
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7 }}
                    className="py-16 sm:py-20"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            {/* Logo grande */}
                            <div
                                className="w-48 h-32 lg:w-56 lg:h-36 rounded-3xl flex items-center justify-center shrink-0 bg-white shadow-2xl p-6"
                            >
                                <img
                                    src={activeBrandData.logo}
                                    alt={activeBrandData.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            {/* Texto */}
                            <div className="flex-1 max-w-2xl">
                                <div
                                    className="w-12 h-1 rounded-full mb-5"
                                    style={{ backgroundColor: theme.primary }}
                                />
                                <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4 leading-tight">
                                    Por qué elegir{' '}
                                    <span style={{ color: theme.primary }}>{activeBrandData.name}</span>
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    {theme.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* ─── CATÁLOGO ───────────────────────────────────────────────────── */}
            {/* ─── CATÁLOGO ───────────────────────────────────────────────────── */}
            <div ref={catalogRef}>
                <Catalog
                    onViewDetails={handleViewDetails}
                    selectedBrand={selectedBrand}
                    setSelectedBrand={setSelectedBrand}
                    hideTitle={true}
                    hideBrandFilter={true}
                    initialCategory={initialCategory}
                    darkTheme={{ primary: theme.primary, bg: theme.bg, glowRgb: theme.glowRgb }}
                />
            </div>

            {/* ─── EXPLORA OTRAS MARCAS ────────────────────────────────────────── */}
            <section className="py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: theme.primary }}>
                            También en Ibiza Motos
                        </p>
                        <h3 className="font-display font-black text-3xl sm:text-4xl text-white">
                            Explora otras marcas
                        </h3>
                    </motion.div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {brands
                            .filter(b => b.name !== activeBrandData.name)
                            .map((brand, i) => {
                                const bTheme = getBrandTheme(brand.name);
                                const bCount = allMotos.filter(m => m.brand === brand.name).length;
                                return (
                                    <motion.button
                                        key={brand.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ duration: 0.4, delay: i * 0.06 }}
                                        onClick={() => navigate(`/marca/${brand.name.toLowerCase().replace(' ', '-')}`)}
                                        className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl border border-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                                        style={{ backgroundColor: `rgba(${bTheme.glowRgb}, 0.05)` }}
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center transition-all shadow-md p-2">
                                            <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-display font-bold text-white text-sm">{brand.name}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">{bCount} motos</p>
                                        </div>
                                        <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all absolute top-3 right-3" />
                                    </motion.button>
                                );
                            })}
                    </div>
                </div>
            </section>
        </div>
    );
}
