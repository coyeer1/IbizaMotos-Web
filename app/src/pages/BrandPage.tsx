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
        const found = brands.find(b => b.name.toLowerCase() === brandId?.toLowerCase());
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

    return (
        <div className="min-h-screen" style={{ backgroundColor: theme.bg }}>

            {/* ─── HERO ──────────────────────────────────────────────────────── */}
            <section className="relative w-full h-screen overflow-hidden">

                {/* Fondo: video YouTube o imagen de marca */}
                {hasVideo ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${theme.heroVideoId}?autoplay=1&mute=1&loop=1&controls=0&rel=0&playlist=${theme.heroVideoId}&modestbranding=1&playsinline=1`}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ width: '177.78vh', height: '56.25vw', minWidth: '100%', minHeight: '100%' }}
                        frameBorder="0"
                        allow="autoplay; encrypted-media; fullscreen"
                    />
                ) : (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${theme.slideImage})` }}
                    />
                )}

                {/* Overlay de color de marca */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(135deg, ${theme.bg}EE 0%, ${theme.bg}99 40%, transparent 70%, ${theme.bg}CC 100%)`,
                    }}
                />
                {/* Gradiente inferior para que el texto sea legible */}
                <div
                    className="absolute inset-x-0 bottom-0 h-2/3"
                    style={{
                        background: `linear-gradient(to top, ${theme.bg} 0%, ${theme.bg}CC 30%, transparent 100%)`,
                    }}
                />
                {/* Glow del color de la marca */}
                <div
                    className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[180px] pointer-events-none"
                    style={{ backgroundColor: `rgba(${theme.glowRgb}, 0.12)` }}
                />

                {/* Botón volver */}
                <div className="absolute top-6 left-4 sm:left-8 z-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/70 hover:text-white text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:border-white/25 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Volver
                    </button>
                </div>

                {/* Logo de marca — arriba derecha */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute top-6 right-6 sm:right-10 z-20"
                >
                    <div className="bg-white rounded-2xl px-5 py-3 shadow-xl">
                        <img
                            src={activeBrandData.logo}
                            alt={activeBrandData.name}
                            className="h-8 sm:h-10 object-contain"
                        />
                    </div>
                </motion.div>

                {/* Contenido principal del hero */}
                <div className="absolute bottom-0 left-0 right-0 z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24">

                    {/* Tag de marca */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5"
                        style={{
                            backgroundColor: `rgba(${theme.glowRgb}, 0.15)`,
                            borderColor: `rgba(${theme.glowRgb}, 0.35)`,
                            color: theme.primary,
                        }}
                    >
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase">
                            {activeBrandData.name} · {theme.origin}
                        </span>
                    </motion.div>

                    {/* Nombre de la marca */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="font-display font-black text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem] text-white leading-none tracking-tight uppercase mb-3"
                        style={{ textShadow: `0 0 80px rgba(${theme.glowRgb}, 0.25)` }}
                    >
                        {activeBrandData.name}
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/60 text-lg sm:text-2xl font-medium italic mb-8 tracking-wide"
                    >
                        "{theme.tagline}"
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-wrap gap-4"
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
            </section>

            {/* ─── STATS BAR ─────────────────────────────────────────────────── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative z-10 border-y border-white/5"
                style={{ backgroundColor: `rgba(${theme.glowRgb}, 0.05)` }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-3 divide-x divide-white/5">
                        {[
                            { icon: <Calendar className="w-4 h-4" />, label: 'Fundada', value: theme.founded || '—' },
                            { icon: <Globe className="w-4 h-4" />,    label: 'Origen',  value: theme.origin || '—' },
                            { icon: <Bike className="w-4 h-4" />,     label: 'Modelos disponibles', value: `${motoCount} motos` },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col sm:flex-row items-center justify-center gap-3 py-5 px-4 text-center sm:text-left">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-lg"
                                    style={{ backgroundColor: theme.primary }}
                                >
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white/50 tracking-widest uppercase">{stat.label}</p>
                                    <p className="font-display font-bold text-white text-base sm:text-lg">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Línea de color de la marca en la parte inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: theme.primary, opacity: 0.4 }} />
            </motion.section>

            {/* ─── DESCRIPCIÓN DE MARCA ───────────────────────────────────────── */}
            {theme.description && (
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
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
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: theme.primary }}>
                            También en Ibiza Motos
                        </p>
                        <h3 className="font-display font-black text-3xl sm:text-4xl text-white">
                            Explora otras marcas
                        </h3>
                    </div>

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
                                        viewport={{ once: true }}
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
