import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, X, Gauge, Zap, Weight, Fuel, Settings, Activity, Share2, Heart, ChevronLeft, ChevronRight, MessageCircle, User, Phone, MapPin, ZoomIn } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMotorcycles } from '@/hooks/useMotorcycles';
import { getBrandBuyWhatsApp, getWhatsAppUrl } from '@/lib/config';
import { Calculator, ArrowRight } from 'lucide-react';
import type { Motorcycle } from '@/types';
import { CompareButton } from '@/components/MotoComparator';
import { getBrandTheme } from '@/lib/brandThemes';
import { useSEO } from '@/hooks/useSEO';

// Map de colores para renderizar
const colorMap: Record<string, string> = {
    'Negro Mate': '#1a1a1a',
    'Negro': '#000000',
    'Rojo': '#dc2626',
    'Blanco': '#f8f9fa',
    'Azul': '#2563eb',
    'Azul Metálico': '#1e40af',
    'Verde': '#16a34a',
    'Verde Militar': '#3f4f3a',
    'Gris': '#6b7280',
    'Naranja': '#f97316',
    'Amarillo': '#eab308',
    'Púrpura': '#7c3aed',
    'Gris Verde': '#5f6b5a',
    'Gris Brillante': '#9ca3af',
    'Gris/Negro': '#374151',
};

const specIcons: Record<string, React.ReactNode> = {
    'MOTOR': <Settings className="w-5 h-5" />,
    'POTENCIA': <Zap className="w-5 h-5" />,
    'TORQUE': <Activity className="w-5 h-5" />,
    'TRANSMISIÓN': <Gauge className="w-5 h-5" />,
    'PESO': <Weight className="w-5 h-5" />,
    'CAPACIDAD': <Fuel className="w-5 h-5" />,
};

export default function MotorcyclePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { motorcycles, loading } = useMotorcycles();
    const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
    const [lightboxZoomed, setLightboxZoomed] = useState(false);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', city: '' });
    const [quoteSubmitted, setQuoteSubmitted] = useState(false);
    const [quotePrivacyAccepted, setQuotePrivacyAccepted] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!loading && id) {
            const moto = motorcycles.find(m => m.id === id);
            if (moto) {
                setMotorcycle(moto);
                if (moto.specifications?.colors?.length > 0) {
                    setSelectedColor(moto.specifications.colors[0]);
                }
            } else {
                navigate('/');
            }
        }
    }, [id, navigate, motorcycles, loading]);

    // SEO por moto: título, descripción, canonical y og:image únicos por ficha
    const motoPrice = motorcycle
        ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(motorcycle.price)
        : '';
    useSEO(
        motorcycle
            ? {
                title: `${motorcycle.brand} ${motorcycle.model} ${motorcycle.year} | Ibiza Motos Pereira`,
                description: `${motorcycle.brand} ${motorcycle.model} ${motorcycle.year} desde ${motoPrice}. ${motorcycle.category} disponible en Ibiza Motos, Pereira y el Eje Cafetero. Financiación inmediata.`,
                path: `/moto/${motorcycle.id}`,
                image: motorcycle.images?.[0],
                type: 'product',
            }
            : { title: 'Ibiza Motos | El placer en dos ruedas' }
    );

    if (loading || !motorcycle) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
                <div className="w-12 h-12 border-4 border-ibiza-red/30 border-t-ibiza-red rounded-full animate-spin"></div>
            </div>
        );
    }

    const images = motorcycle.imagesByColor?.[selectedColor] || motorcycle.images;
    const currentImage = images[currentImageIndex] || images[0];

    const theme = getBrandTheme(motorcycle.brand);
    const brandColor = theme.primary;
    const brandGlow = theme.glowRgb;

    const formatPrice = (price: number) => {
        if (!price || price <= 0) return 'Consultar';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const hasPrice = motorcycle.price > 0;

    const whatsappUrl = getBrandBuyWhatsApp(motorcycle.brand, motorcycle.model, selectedColor);

    const videoId = motorcycle.videoUrl
        ? (motorcycle.videoUrl.match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([a-zA-Z0-9_-]+)/) || [])[1] ?? ''
        : '';

    const handleQuoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const msg = `Hola, me interesa cotizar la ${motorcycle.brand} ${motorcycle.model}${selectedColor ? ` color ${selectedColor}` : ''}.\nNombre: ${quoteForm.name}\nTeléfono: ${quoteForm.phone}\nCiudad: ${quoteForm.city || 'No especificada'}`;
        window.open(getWhatsAppUrl(msg), '_blank');
        setQuoteSubmitted(true);
        setTimeout(() => { setQuoteSubmitted(false); setShowQuoteModal(false); setQuoteForm({ name: '', phone: '', city: '' }); setQuotePrivacyAccepted(false); }, 2500);
    };

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    const specs = [
        { label: 'MOTOR', value: motorcycle.specifications.engine, icon: specIcons['MOTOR'] },
        { label: 'POTENCIA', value: motorcycle.specifications.power, icon: specIcons['POTENCIA'] },
        { label: 'TORQUE', value: motorcycle.specifications.torque, icon: specIcons['TORQUE'] },
        { label: 'TRANSMISIÓN', value: motorcycle.specifications.transmission, icon: specIcons['TRANSMISIÓN'] },
        { label: 'PESO', value: motorcycle.specifications.weight, icon: specIcons['PESO'] },
        { label: 'CAPACIDAD', value: motorcycle.specifications.fuelCapacity, icon: specIcons['CAPACIDAD'] },
    ];

    // Números clave extraídos para la banda destacada
    const pick = (re: RegExp, src: string) => { const m = src.match(re); return m ? m[1] : null; };
    const keyStats = [
        { value: pick(/([\d.]+)\s*cc/i, motorcycle.specifications.engine), unit: 'cc', label: 'Cilindraje' },
        { value: pick(/([\d.]+)\s*HP/i, motorcycle.specifications.power), unit: 'HP', label: 'Potencia' },
        { value: pick(/(\d+)\s*vel/i, motorcycle.specifications.transmission), unit: 'vel', label: 'Marchas' },
        { value: pick(/([\d.]+)\s*kg/i, motorcycle.specifications.weight), unit: 'kg', label: 'Peso' },
    ].filter(s => s.value);

    return (
        <div className="min-h-screen relative pb-32" style={{ backgroundColor: '#ffffff' }}>

            {/* ── VIDEO HERO ── */}
            {videoId && (
                <section className="relative w-full h-[60vh] md:h-screen overflow-hidden">
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&rel=0&playlist=${videoId}&modestbranding=1&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&showinfo=0`}
                        className="absolute top-1/2 left-1/2"
                        style={{ width: '177.78vh', height: '56.25vw', minWidth: '100%', minHeight: '100%', transform: 'translate(-50%, -50%) scale(1.35)', pointerEvents: 'none' }}
                        frameBorder="0"
                        allow="autoplay; encrypted-media; fullscreen"
                    />
                    {/* Capa transparente: bloquea cualquier interacción/chrome de YouTube */}
                    <div className="absolute inset-0 z-[1]" style={{ pointerEvents: 'none' }} aria-hidden />
                    {/* Gradiente superior e inferior */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%, #ffffff 100%)` }} />
                    {/* Texto overlay inferior */}
                    <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase block mb-1" style={{ color: brandColor }}>{motorcycle.brand}</span>
                        <h2 className="font-display font-black text-5xl md:text-8xl text-white uppercase leading-none tracking-tight drop-shadow-2xl">
                            {motorcycle.model}
                        </h2>
                    </div>
                    {/* Botón volver */}
                    <div className="absolute top-6 left-4 sm:left-8 z-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-white/70 hover:text-white text-sm bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </button>
                    </div>
                </section>
            )}

            {/* ── HERO SECTION ── */}
            <section className="relative w-full min-h-[60vh] md:min-h-[85vh] flex flex-col overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]" style={{ backgroundColor: `rgba(${brandGlow}, 0.05)` }} />
                    <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px]" style={{ backgroundColor: `rgba(${brandGlow}, 0.04)` }} />
                </div>

                {/* Navigation Bar inside Hero */}
                <div className="relative z-30 pt-24 px-4 sm:px-8 lg:px-12 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center transition-colors font-medium text-sm backdrop-blur-md px-5 py-2.5 rounded-full"
                        style={{ color: '#666666', backgroundColor: '#f7f7f7', border: '1px solid #ececec' }}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al catálogo
                    </button>

                    <div className="flex items-center gap-3">
                        {motorcycle && <CompareButton motorcycle={motorcycle} />}
                        <button className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center text-[#999999] hover:text-ibiza-red hover:border-ibiza-red/30 transition-all" style={{ backgroundColor: '#f7f7f7', border: '1px solid #ececec' }}>
                            <Heart className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center text-[#999999] hover:text-ibiza-red hover:border-ibiza-red/30 transition-all" style={{ backgroundColor: '#f7f7f7', border: '1px solid #ececec' }}>
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Hero Content */}
                <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-4 md:gap-8 py-4 md:py-8">
                    
                    {/* Left: Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className="lg:w-2/5 flex flex-col items-start"
                    >
                        {/* Brand badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <span
                                className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border"
                                style={{ color: brandColor, backgroundColor: `rgba(${brandGlow}, 0.1)`, borderColor: `rgba(${brandGlow}, 0.25)` }}
                            >
                                {motorcycle.brand}
                            </span>
                            <span className="text-xs text-[#999999] tracking-wider uppercase">
                                {motorcycle.category}
                            </span>
                        </div>

                        {/* Model title */}
                        <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#111111] leading-[0.9] tracking-tight mb-4">
                            {motorcycle.model}
                        </h1>

                        {/* Year */}
                        <span className="font-display font-bold text-lg mb-6" style={{ color: brandColor }}>
                            Modelo {motorcycle.year}
                        </span>

                        {/* Description */}
                        <p className="text-[#666666] text-base leading-relaxed mb-8 max-w-md">
                            {motorcycle.description}
                        </p>

                        {/* Price block */}
                        <div className="mb-8">
                            <p className="text-xs text-[#999999] font-semibold tracking-wider uppercase mb-1">{hasPrice ? 'Precio desde' : 'Precio'}</p>
                            <div className="flex items-end gap-3">
                                <span className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-[#111111] leading-none">
                                    {formatPrice(motorcycle.price)}
                                </span>
                            </div>
                        </div>

                        {/* Color selector — solo si hay imagesByColor real */}
                        {motorcycle.imagesByColor && motorcycle.specifications.colors?.length > 0 && (
                        <div className="mb-8">
                            <p className="text-xs font-bold text-[#999999] tracking-widest uppercase mb-3">
                                Color: <span className="text-[#111111]">{selectedColor}</span>
                            </p>
                            <div className="flex gap-3 flex-wrap">
                                {motorcycle.specifications.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => { setSelectedColor(color); setCurrentImageIndex(0); }}
                                        title={color}
                                        className={`w-10 h-10 rounded-full transition-all duration-300 ${
                                            selectedColor === color
                                                ? 'ring-2 ring-offset-2 scale-110'
                                                : 'border border-[#e8e8e8] hover:scale-105 hover:border-[#cccccc]'
                                        }`}
                                        style={{
                                            backgroundColor: colorMap[color] || '#888',
                                            ...(selectedColor === color ? { ringColor: brandColor, '--tw-ring-color': brandColor, '--tw-ring-offset-color': '#ffffff' } as React.CSSProperties : {}),
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex gap-3 w-full">
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                                <Button
                                    className="w-full h-14 !text-white font-display font-bold text-sm uppercase tracking-wider rounded-2xl transition-all"
                                    style={{ backgroundColor: brandColor, boxShadow: `0 0 30px rgba(${brandGlow}, 0.35)` }}
                                >
                                    🛒 Comprar Ahora
                                </Button>
                            </a>
                            <Button
                                variant="outline"
                                onClick={() => setShowQuoteModal(true)}
                                className="flex-1 h-14 border-2 border-[#e8e8e8] text-[#111111] hover:bg-[#f7f7f7] font-display font-bold text-sm uppercase tracking-wider rounded-2xl transition-all"
                            >
                                💬 Cotizar
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right: Image showcase */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:w-3/5 relative w-full"
                    >
                        {/* Main image — moto flotante con glow, sin caja vacía */}
                        <div className="relative">
                            <div className="relative flex items-center justify-center overflow-hidden">

                                {/* Glow de marca detrás de la moto */}
                                <div
                                    className="absolute w-[80%] h-[72%] rounded-full blur-[120px] pointer-events-none"
                                    style={{ backgroundColor: `rgba(${brandGlow}, 0.10)` }}
                                />
                                {/* Watermark del modelo detrás */}
                                <span
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black uppercase whitespace-nowrap pointer-events-none select-none leading-none"
                                    style={{
                                        fontSize: 'clamp(4rem, 14vw, 13rem)',
                                        color: 'rgba(17,17,17,0.04)',
                                        letterSpacing: '-0.04em',
                                    }}
                                    aria-hidden
                                >
                                    {motorcycle.model.split(' ')[0]}
                                </span>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${selectedColor}-${currentImageIndex}`}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative z-10 h-[260px] sm:h-[360px] md:h-[460px] w-full flex items-center justify-center cursor-zoom-in"
                                        onClick={() => setEnlargedImage(currentImage)}
                                    >
                                        <img
                                            src={currentImage}
                                            alt={`${motorcycle.brand} ${motorcycle.model}`}
                                            decoding="async"
                                            fetchPriority="high"
                                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.18)]"
                                        />
                                        {/* Hint de zoom */}
                                        <span className="absolute bottom-1 right-1 sm:bottom-3 sm:right-3 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-[#666666] backdrop-blur-sm px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #e8e8e8' }}>
                                            <ZoomIn className="w-3.5 h-3.5" /> Ampliar
                                        </span>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation arrows over image */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center text-[#111111] transition-all"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #e8e8e8' }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = brandColor; (e.currentTarget as HTMLButtonElement).style.borderColor = brandColor; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.9)'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e8e8'; (e.currentTarget as HTMLButtonElement).style.color = '#111111'; }}
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center text-[#111111] transition-all"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #e8e8e8' }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = brandColor; (e.currentTarget as HTMLButtonElement).style.borderColor = brandColor; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.9)'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e8e8'; (e.currentTarget as HTMLButtonElement).style.color = '#111111'; }}
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail strip — solo si el color actual tiene múltiples ángulos */}
                            {images.length > 1 && (
                                <div className="flex gap-3 mt-4 justify-center">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-[#f7f7f7] ${currentImageIndex === idx
                                                ? 'scale-105'
                                                : 'border-[#ececec] opacity-60 hover:opacity-100 hover:border-[#cccccc]'
                                                }`}
                                            style={currentImageIndex === idx ? { borderColor: brandColor, boxShadow: `0 0 15px rgba(${brandGlow}, 0.25)` } : {}}
                                        >
                                            <img src={img} alt={`Vista ${idx + 1}`} loading="lazy" decoding="async" className="w-full h-full object-contain p-1" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── FICHA TÉCNICA ── */}
            <section className="py-16 border-t" style={{ backgroundColor: '#ffffff', borderColor: '#ececec' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.5 }}
                        className="mb-10 flex items-end justify-between flex-wrap gap-4"
                    >
                        <div>
                            <p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: brandColor }}>Ficha técnica</p>
                            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#111111]">Especificaciones</h2>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="px-3 py-1.5 rounded-full text-[#666666] font-medium" style={{ backgroundColor: '#f7f7f7', border: '1px solid #ececec' }}>{motorcycle.category}</span>
                            <span className="px-3 py-1.5 rounded-full text-[#666666] font-medium" style={{ backgroundColor: '#f7f7f7', border: '1px solid #ececec' }}>Modelo {motorcycle.year}</span>
                        </div>
                    </motion.div>

                    {/* Banda de números clave */}
                    {keyStats.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.5 }}
                            className="relative overflow-hidden rounded-3xl border mb-5"
                            style={{ borderColor: '#e8e8e8', background: `linear-gradient(135deg, rgba(${brandGlow}, 0.06) 0%, rgba(${brandGlow}, 0.015) 55%, #ffffff 100%)` }}
                        >
                            {/* Glow decorativo */}
                            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-[110px] pointer-events-none" style={{ backgroundColor: `rgba(${brandGlow}, 0.08)` }} />
                            <div className={`relative grid ${keyStats.length === 4 ? 'grid-cols-2 md:grid-cols-4' : keyStats.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} divide-x divide-[#ececec]`}>
                                {keyStats.map((s) => (
                                    <div key={s.label} className="px-4 py-8 sm:py-10 text-center">
                                        <p className="font-display font-black text-[#111111] leading-none tracking-tight" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.25rem)' }}>
                                            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
                                            <span className="text-base sm:text-xl align-top ml-1 font-bold" style={{ color: brandColor }}>{s.unit}</span>
                                        </p>
                                        <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.25em] uppercase text-[#999999] mt-3">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Datasheet completo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="rounded-2xl overflow-hidden"
                        style={{ border: '1px solid #e8e8e8' }}
                    >
                        {specs.map((spec, i) => (
                            <div
                                key={spec.label}
                                className="flex items-center justify-between gap-4 px-5 sm:px-7 py-4 sm:py-5 last:border-b-0 transition-colors hover:bg-[#f7f7f7]"
                                style={{ backgroundColor: i % 2 === 0 ? '#fafafa' : '#ffffff', borderBottom: '1px solid #ececec' }}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="shrink-0" style={{ color: brandColor }}>{spec.icon}</span>
                                    <span className="text-[11px] sm:text-xs font-bold text-[#999999] tracking-wider uppercase">{spec.label}</span>
                                </div>
                                <span className="font-display font-bold text-[#111111] text-sm sm:text-lg text-right">{spec.value}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Respaldo del concesionario (honesto, igual para todas) */}
                    <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { title: 'Concesionario autorizado', sub: `Marca ${motorcycle.brand} oficial` },
                            { title: 'Garantía de fábrica', sub: 'Respaldo del fabricante' },
                            { title: 'Financiación', sub: 'Cuotas a tu medida' },
                            { title: 'Servicio técnico', sub: 'Repuestos originales' },
                        ].map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.4, delay: idx * 0.06 }}
                                className="flex items-start gap-3 rounded-2xl p-4"
                                style={{ backgroundColor: '#f7f7f7', border: '1px solid #e8e8e8' }}
                            >
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: brandColor }} />
                                <div>
                                    <p className="text-[#111111] font-display font-bold text-sm leading-tight">{item.title}</p>
                                    <p className="text-[#999999] text-xs mt-0.5">{item.sub}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FINANCING CTA ── */}
            <section className="py-14 border-t" style={{ borderColor: '#ececec' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5 }}
                        className="relative overflow-hidden rounded-3xl border"
                        style={{ borderColor: '#e8e8e8', background: `linear-gradient(115deg, rgba(${brandGlow}, 0.06) 0%, rgba(${brandGlow}, 0.02) 45%, #ffffff 100%)` }}
                    >
                        {/* Glow */}
                        <div className="absolute -left-16 -bottom-20 w-80 h-80 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: `rgba(${brandGlow}, 0.08)` }} />

                        <div className="relative grid md:grid-cols-2 gap-8 items-center p-7 sm:p-10">
                            {/* Izquierda: gancho (sin números) */}
                            <div>
                                <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 rounded-full border mb-5" style={{ color: brandColor, borderColor: `rgba(${brandGlow}, 0.3)`, backgroundColor: `rgba(${brandGlow}, 0.1)` }}>
                                    <Calculator className="w-3.5 h-3.5" /> Financiación a tu medida
                                </span>
                                <p className="font-display font-black text-[#111111] leading-[0.95] mb-3" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)' }}>
                                    FINÁNCIALA Y<br />ESTRÉNALA <span style={{ color: brandColor }}>HOY</span>
                                </p>
                                <p className="text-[#666666] text-sm leading-relaxed max-w-sm">
                                    Te armamos el plan que más te conviene con nuestras 8 financieras aliadas. Aprobación en menos de 24 horas — muchas veces sin codeudor.
                                </p>
                            </div>

                            {/* Derecha: trust + CTA */}
                            <div className="md:border-l md:pl-8" style={{ borderColor: '#ececec' }}>
                                <div className="space-y-3 mb-6">
                                    {['8 financieras aliadas (Progreser, Banco de Bogotá, Brilla…)', 'Respuesta en menos de 24 horas', 'Cuota inicial flexible · sin codeudor en muchos casos'].map((t) => (
                                        <div key={t} className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-1" style={{ color: brandColor }} />
                                            <span className="text-[#666666] text-sm">{t}</span>
                                        </div>
                                    ))}
                                </div>
                                <a
                                    href={getWhatsAppUrl(`Hola, quiero financiar la ${motorcycle.brand} ${motorcycle.model}. ¿Me asesoran con el crédito?`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-3 w-full text-white font-display font-bold px-8 py-4 rounded-2xl text-sm uppercase tracking-wider active:scale-[0.98] transition-all duration-200 group"
                                    style={{ backgroundColor: brandColor, boxShadow: `0 0 28px rgba(${brandGlow}, 0.35)` }}
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Quiero que me asesoren
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>


            {/* ── CTA BANNER ── */}
            <section className="py-16 border-t" style={{ borderColor: '#ececec' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5 }}
                        className="relative rounded-3xl overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-90" style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${theme.secondary} 100%)` }} />
                        <div className="relative p-10 md:p-16 text-center !text-white">
                            <h3 className="font-display font-bold text-3xl md:text-4xl mb-4">
                                ¿Te interesa esta {motorcycle.brand}?
                            </h3>
                            <p className="!text-white/90 mb-8 max-w-lg mx-auto text-lg">
                                Solicita tu cotización personalizada y te asesoramos sin compromiso.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="bg-white text-ibiza-red hover:bg-white/90 font-display font-bold rounded-full px-10 shadow-xl">
                                        Comprar por WhatsApp
                                    </Button>
                                </a>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => setShowQuoteModal(true)}
                                    className="border-2 border-white/50 !text-white hover:bg-white/10 font-display font-bold rounded-full px-10"
                                >
                                    💬 Cotizar ahora
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── STICKY BOTTOM ACTION BAR ── */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.08)]" style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: '#ececec' }}>
                    <div className="max-w-7xl mx-auto h-16 sm:h-20 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
                        {/* Info — visible en todos los tamaños */}
                        <div className="flex flex-col flex-1 pl-3 sm:pl-4 border-l-2 min-w-0" style={{ borderColor: brandColor }}>
                            <h4 className="font-display font-bold text-sm sm:text-lg text-[#111111] leading-tight truncate">
                                {motorcycle.brand} {motorcycle.model}
                            </h4>
                            <span className="font-display font-black text-base sm:text-2xl md:text-3xl leading-none" style={{ color: brandColor }}>
                                {formatPrice(motorcycle.price)}
                            </span>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 sm:gap-3 shrink-0">
                            <Button
                                variant="outline"
                                onClick={() => setShowQuoteModal(true)}
                                className="h-10 sm:h-11 px-3 sm:px-6 rounded-xl border-2 border-[#e8e8e8] text-[#666666] hover:bg-[#f7f7f7] font-bold text-xs transition-all flex items-center gap-1"
                            >
                                <MessageCircle className="w-3.5 h-3.5" />
                                Cotizar
                            </Button>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                <Button
                                    className="h-10 sm:h-11 px-4 sm:px-8 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] !text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all flex items-center gap-2"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── QUOTE MODAL ── */}
            <AnimatePresence>
                {showQuoteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowQuoteModal(false)}
                        className="fixed inset-0 z-[80] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 60, opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                            className="rounded-t-3xl md:rounded-3xl w-full md:max-w-md shadow-2xl p-6"
                            style={{ backgroundColor: '#ffffff', border: '1px solid #e8e8e8' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-display font-bold text-[#111111] text-xl">Cotizar esta moto</h3>
                                    <p className="text-[#999999] text-sm mt-0.5">{motorcycle.brand} {motorcycle.model}{selectedColor ? ` · ${selectedColor}` : ''}</p>
                                </div>
                                <button
                                    onClick={() => setShowQuoteModal(false)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#999999] hover:text-[#111111] transition-colors"
                                    style={{ backgroundColor: '#f7f7f7' }}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {quoteSubmitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-ibiza-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-ibiza-red" />
                                    </div>
                                    <h4 className="font-display font-bold text-[#111111] text-lg mb-2">¡Cotización enviada!</h4>
                                    <p className="text-[#666666] text-sm">Te responderemos por WhatsApp en minutos.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                                    <div>
                                        <Label className="text-[#666666] text-xs font-bold tracking-widest uppercase mb-1.5 block">
                                            <User className="w-3.5 h-3.5 inline mr-1.5" />Tu nombre
                                        </Label>
                                        <Input
                                            required
                                            value={quoteForm.name}
                                            onChange={e => setQuoteForm({ ...quoteForm, name: e.target.value })}
                                            placeholder="Ej: Juan García"
                                            className="bg-[#f7f7f7] border-[#e8e8e8] text-[#111111] placeholder:text-[#999999] rounded-xl focus:border-ibiza-red"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-[#666666] text-xs font-bold tracking-widest uppercase mb-1.5 block">
                                            <Phone className="w-3.5 h-3.5 inline mr-1.5" />Teléfono
                                        </Label>
                                        <Input
                                            required
                                            type="tel"
                                            value={quoteForm.phone}
                                            onChange={e => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                                            placeholder="300 123 4567"
                                            className="bg-[#f7f7f7] border-[#e8e8e8] text-[#111111] placeholder:text-[#999999] rounded-xl focus:border-ibiza-red"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-[#666666] text-xs font-bold tracking-widest uppercase mb-1.5 block">
                                            <MapPin className="w-3.5 h-3.5 inline mr-1.5" />Ciudad
                                        </Label>
                                        <Input
                                            value={quoteForm.city}
                                            onChange={e => setQuoteForm({ ...quoteForm, city: e.target.value })}
                                            placeholder="Ej: Armenia"
                                            className="bg-[#f7f7f7] border-[#e8e8e8] text-[#111111] placeholder:text-[#999999] rounded-xl focus:border-ibiza-red"
                                        />
                                    </div>
                                    {/* Checkbox consentimiento */}
                                    <label className="flex items-start gap-2.5 cursor-pointer group/check">
                                        <input
                                            type="checkbox"
                                            checked={quotePrivacyAccepted}
                                            onChange={e => setQuotePrivacyAccepted(e.target.checked)}
                                            className="mt-0.5 w-4 h-4 rounded border-[#e8e8e8] bg-[#f7f7f7] accent-ibiza-red cursor-pointer shrink-0"
                                        />
                                        <span className="text-[11px] text-[#999999] leading-relaxed group/check:text-[#666666]">
                                            He leído y acepto la{' '}
                                            <a href="/privacidad" target="_blank" className="text-[#666666] underline hover:text-[#111111] transition-colors">
                                                política de tratamiento de datos personales
                                            </a>
                                            {' '}de Ibiza Motos (Ley 1581/2012).
                                        </span>
                                    </label>

                                    <Button
                                        type="submit"
                                        disabled={!quotePrivacyAccepted}
                                        className="w-full bg-ibiza-red hover:bg-ibiza-red/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-display font-bold rounded-2xl h-13 text-base mt-1 group"
                                    >
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Enviar cotización por WhatsApp
                                    </Button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── IMAGE LIGHTBOX ── */}
            <AnimatePresence>
                {enlargedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setEnlargedImage(null); setLightboxZoomed(false); }}
                        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md ${lightboxZoomed ? 'overflow-auto' : 'cursor-zoom-out'}`}
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); setEnlargedImage(null); setLightboxZoomed(false); }}
                            className="fixed top-6 right-6 p-2 bg-white/10 hover:bg-ibiza-red text-white rounded-full transition-colors z-20"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        {/* Hint */}
                        <span className="fixed top-7 left-1/2 -translate-x-1/2 text-[11px] font-bold tracking-wider uppercase text-white/50 z-20 pointer-events-none">
                            {lightboxZoomed ? 'Clic para reducir' : 'Clic en la imagen para hacer zoom'}
                        </span>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            src={enlargedImage}
                            alt="Imagen Ampliada"
                            className={`object-contain rounded-lg shadow-2xl transition-all duration-300 ${lightboxZoomed ? 'max-w-none w-auto h-auto scale-[1.8] cursor-zoom-out' : 'max-w-full max-h-[90vh] cursor-zoom-in'}`}
                            onClick={(e) => { e.stopPropagation(); setLightboxZoomed(z => !z); }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
