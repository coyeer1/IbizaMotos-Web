import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, X, Gauge, Zap, Weight, Fuel, Settings, Activity, Share2, Heart, ChevronLeft, ChevronRight, MessageCircle, User, Phone, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMotorcycles } from '@/hooks/useMotorcycles';
import { getBrandBuyWhatsApp, getWhatsAppUrl } from '@/lib/config';
import { Calculator, ArrowRight } from 'lucide-react';
import type { Motorcycle } from '@/types';
import { CompareButton } from '@/components/MotoComparator';

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
};

const specIcons: Record<string, React.ReactNode> = {
    'MOTOR': <Settings className="w-5 h-5" />,
    'POTENCIA': <Zap className="w-5 h-5" />,
    'TORQUE': <Activity className="w-5 h-5" />,
    'TRANSMISIÓN': <Gauge className="w-5 h-5" />,
    'PESO': <Weight className="w-5 h-5" />,
    'CAPACIDAD': <Fuel className="w-5 h-5" />,
};

// Convert any YouTube URL format to embed URL
function getYouTubeEmbedUrl(url: string): string {
    if (!url) return '';
    // Already an embed URL
    if (url.includes('/embed/')) return url;
    // Extract video ID from various formats
    let videoId = '';
    // youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) videoId = shortMatch[1];
    // youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) videoId = watchMatch[1];
    // youtube.com/v/VIDEO_ID
    const vMatch = url.match(/\/v\/([a-zA-Z0-9_-]+)/);
    if (vMatch) videoId = vMatch[1];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    return url; // Fallback
}

export default function MotorcyclePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { motorcycles, loading } = useMotorcycles();
    const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'specs' | 'features'>('specs');
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', city: '' });
    const [quoteSubmitted, setQuoteSubmitted] = useState(false);

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

    // SEO: update page title and meta tags
    useEffect(() => {
        if (!motorcycle) return;
        const title = `${motorcycle.brand} ${motorcycle.model} ${motorcycle.year} | Ibiza Motos`;
        document.title = title;

        const setMeta = (name: string, content: string, prop = false) => {
            const attr = prop ? 'property' : 'name';
            let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        const price = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(motorcycle.price);
        const desc = `${motorcycle.brand} ${motorcycle.model} ${motorcycle.year} - ${price}. ${motorcycle.category}. Disponible en Ibiza Motos, Armenia Quindío.`;

        setMeta('description', desc);
        setMeta('og:title', title, true);
        setMeta('og:description', desc, true);
        if (motorcycle.images?.[0]) setMeta('og:image', motorcycle.images[0], true);
        setMeta('og:type', 'product', true);

        return () => {
            document.title = 'Ibiza Motos | El placer en dos ruedas';
        };
    }, [motorcycle]);

    if (loading || !motorcycle) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ibiza-black">
                <div className="w-12 h-12 border-4 border-ibiza-red/30 border-t-ibiza-red rounded-full animate-spin"></div>
            </div>
        );
    }

    const images = motorcycle.imagesByColor?.[selectedColor] || motorcycle.images;
    const currentImage = images[currentImageIndex] || images[0];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const originalPrice = motorcycle.price * 1.05;

    const whatsappUrl = getBrandBuyWhatsApp(motorcycle.brand, motorcycle.model, selectedColor);

    const videoId = motorcycle.videoUrl
        ? (motorcycle.videoUrl.match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([a-zA-Z0-9_-]+)/) || [])[1] ?? ''
        : '';

    const handleQuoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const msg = `Hola, me interesa cotizar la ${motorcycle.brand} ${motorcycle.model}${selectedColor ? ` color ${selectedColor}` : ''}.\nNombre: ${quoteForm.name}\nTeléfono: ${quoteForm.phone}\nCiudad: ${quoteForm.city || 'No especificada'}`;
        window.open(getWhatsAppUrl(msg), '_blank');
        setQuoteSubmitted(true);
        setTimeout(() => { setQuoteSubmitted(false); setShowQuoteModal(false); setQuoteForm({ name: '', phone: '', city: '' }); }, 2500);
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

    const features = [
        'Sistema de frenos de alto rendimiento',
        'Iluminación LED full',
        'Panel digital multifunción',
        'Inyección electrónica',
        'Garantía extendida de 2 años',
        'Servicio técnico autorizado',
    ];

    return (
        <div className="min-h-screen bg-[#080808] relative pb-32">

            {/* ── VIDEO HERO ── */}
            {videoId && (
                <section className="relative w-full h-[60vh] md:h-screen overflow-hidden">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&rel=0&playlist=${videoId}&modestbranding=1&playsinline=1`}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{ width: '177.78vh', height: '56.25vw', minWidth: '100%', minHeight: '100%', pointerEvents: 'none' }}
                        frameBorder="0"
                        allow="autoplay; encrypted-media; fullscreen"
                    />
                    {/* Gradiente superior e inferior */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#080808] pointer-events-none" />
                    {/* Texto overlay inferior */}
                    <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
                        <span className="text-[10px] text-ibiza-red font-bold tracking-[0.3em] uppercase block mb-1">{motorcycle.brand}</span>
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ibiza-red/8 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-ibiza-red/5 rounded-full blur-[120px]" />
                </div>

                {/* Navigation Bar inside Hero */}
                <div className="relative z-50 pt-24 px-4 sm:px-8 lg:px-12 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-400 hover:text-white transition-colors font-medium text-sm bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 hover:border-white/20"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al catálogo
                    </button>

                    <div className="flex items-center gap-3">
                        {motorcycle && <CompareButton motorcycle={motorcycle} />}
                        <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-ibiza-red hover:border-ibiza-red/30 transition-all">
                            <Heart className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-ibiza-red hover:border-ibiza-red/30 transition-all">
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
                            <span className="text-xs font-bold text-ibiza-red tracking-widest uppercase bg-ibiza-red/10 px-3 py-1.5 rounded-full border border-ibiza-red/20">
                                {motorcycle.brand}
                            </span>
                            <span className="text-xs text-gray-500 tracking-wider uppercase">
                                {motorcycle.category}
                            </span>
                        </div>

                        {/* Model title */}
                        <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[0.9] tracking-tight mb-4">
                            {motorcycle.model}
                        </h1>

                        {/* Year */}
                        <span className="text-ibiza-gold font-display font-bold text-lg mb-6">
                            Modelo {motorcycle.year}
                        </span>

                        {/* Description */}
                        <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
                            {motorcycle.description}
                        </p>

                        {/* Price block */}
                        <div className="mb-8">
                            <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase mb-1">Precio desde</p>
                            <div className="flex items-end gap-3">
                                <span className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white leading-none">
                                    {formatPrice(motorcycle.price)}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500 line-through mt-1 block">
                                {formatPrice(originalPrice)}
                            </span>
                        </div>

                        {/* Color selector — solo si hay imagesByColor real */}
                        {motorcycle.imagesByColor && motorcycle.specifications.colors?.length > 0 && (
                        <div className="mb-8">
                            <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">
                                Color: <span className="text-white">{selectedColor}</span>
                            </p>
                            <div className="flex gap-3 flex-wrap">
                                {motorcycle.specifications.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => { setSelectedColor(color); setCurrentImageIndex(0); }}
                                        title={color}
                                        className={`w-10 h-10 rounded-full transition-all duration-300 ${
                                            selectedColor === color
                                                ? 'ring-2 ring-ibiza-red ring-offset-2 ring-offset-[#080808] scale-110'
                                                : 'border border-white/20 hover:scale-105 hover:border-white/40'
                                        }`}
                                        style={{ backgroundColor: colorMap[color] || '#888' }}
                                    />
                                ))}
                            </div>
                        </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex gap-3 w-full">
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                                <Button className="w-full h-14 bg-ibiza-red hover:bg-ibiza-red/90 !text-white font-display font-bold text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(227,25,55,0.3)] hover:shadow-[0_0_40px_rgba(227,25,55,0.5)] transition-all">
                                    🛒 Comprar Ahora
                                </Button>
                            </a>
                            <Button
                                variant="outline"
                                onClick={() => setShowQuoteModal(true)}
                                className="flex-1 h-14 border-2 border-white/10 text-white hover:bg-white/5 font-display font-bold text-sm uppercase tracking-wider rounded-2xl transition-all"
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
                        className="lg:w-3/5 relative"
                    >
                        {/* Main image */}
                        <div className="relative">
                            <div className="relative bg-gradient-to-br from-zinc-900/50 to-transparent rounded-3xl p-8 border border-white/5">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${selectedColor}-${currentImageIndex}`}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative h-[200px] sm:h-[300px] md:h-[400px] flex items-center justify-center cursor-zoom-in"
                                        onClick={() => setEnlargedImage(currentImage)}
                                    >
                                        <img
                                            src={currentImage}
                                            alt={`${motorcycle.brand} ${motorcycle.model}`}
                                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.8)]"
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation arrows over image */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-ibiza-red hover:border-ibiza-red transition-all"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-ibiza-red hover:border-ibiza-red transition-all"
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
                                            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === idx
                                                ? 'border-ibiza-red shadow-[0_0_15px_rgba(227,25,55,0.4)] scale-105'
                                                : 'border-white/10 opacity-50 hover:opacity-80 hover:border-white/20'
                                                }`}
                                        >
                                            <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── SPECS SECTION ── */}
            <section className="bg-[#080808] py-16 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Tab selector */}
                    <div className="flex gap-2 mb-12 justify-center">
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`px-8 py-3 rounded-full font-display font-bold text-sm uppercase tracking-wider transition-all duration-300 ${activeTab === 'specs'
                                ? 'bg-ibiza-red text-white shadow-[0_0_20px_rgba(227,25,55,0.3)]'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            ⚙️ Especificaciones
                        </button>
                        <button
                            onClick={() => setActiveTab('features')}
                            className={`px-8 py-3 rounded-full font-display font-bold text-sm uppercase tracking-wider transition-all duration-300 ${activeTab === 'features'
                                ? 'bg-ibiza-red text-white shadow-[0_0_20px_rgba(227,25,55,0.3)]'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            ✨ Características
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'specs' ? (
                            <motion.div
                                key="specs"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                            >
                                {specs.map((spec, idx) => (
                                    <motion.div
                                        key={spec.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                                        className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 hover:border-ibiza-red/20 hover:bg-white/[0.05] transition-all duration-300 group"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-ibiza-red/10 flex items-center justify-center text-ibiza-red group-hover:bg-ibiza-red group-hover:text-white transition-all duration-300">
                                                {spec.icon}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                                                {spec.label}
                                            </span>
                                        </div>
                                        <p className="font-display font-bold text-white text-lg md:text-xl">
                                            {spec.value}
                                        </p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="features"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.08 }}
                                        className="flex items-center gap-4 bg-white/[0.03] rounded-2xl p-5 border border-white/5 hover:border-green-500/20 transition-all duration-300"
                                    >
                                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-200 font-medium">{feature}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* ── FINANCING CTA ── */}
            <section className="py-14 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-xl mx-auto bg-gradient-to-br from-ibiza-red/10 to-ibiza-red/5 border border-ibiza-red/20 rounded-3xl p-8 text-center">
                        <div className="w-14 h-14 bg-ibiza-red/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <Calculator className="w-7 h-7 text-ibiza-red" />
                        </div>
                        <h3 className="font-display font-black text-2xl text-white mb-2">
                            ¿Quieres financiar esta moto?
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                            Precio:{' '}
                            <span className="text-white font-bold">
                                {'$' + new Intl.NumberFormat('es-CO').format(motorcycle.price)}
                            </span>
                        </p>
                        <p className="text-gray-500 text-xs mb-6">
                            Simula tu cuota con 8 financieras aliadas — tasa desde 1.26%/mes
                        </p>
                        <button
                            onClick={() =>
                                navigate(
                                    `/financiamiento?precio=${motorcycle.price}&moto=${encodeURIComponent(motorcycle.brand + ' ' + motorcycle.model)}`
                                )
                            }
                            className="inline-flex items-center gap-3 bg-ibiza-red hover:bg-red-700 text-white font-display font-bold px-8 py-4 rounded-2xl text-sm active:scale-95 transition-all duration-200 shadow-[0_0_24px_rgba(215,38,61,0.3)] group w-full justify-center"
                        >
                            <Calculator className="w-5 h-5" />
                            Calcular mi cuota
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>


            {/* ── CTA BANNER ── */}
            <section className="py-16 border-t border-white/5">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-ibiza-red to-ibiza-gold opacity-90" />
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
                    </div>
                </div>
            </section>

            {/* ── STICKY BOTTOM ACTION BAR ── */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
                    <div className="max-w-7xl mx-auto h-16 sm:h-20 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
                        {/* Info — visible en todos los tamaños */}
                        <div className="flex flex-col flex-1 pl-3 sm:pl-4 border-l-2 border-ibiza-red min-w-0">
                            <h4 className="font-display font-bold text-sm sm:text-lg text-white leading-tight truncate">
                                {motorcycle.brand} {motorcycle.model}
                            </h4>
                            <span className="font-display font-black text-base sm:text-2xl md:text-3xl text-ibiza-red leading-none">
                                {formatPrice(motorcycle.price)}
                            </span>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 sm:gap-3 shrink-0">
                            <Button
                                variant="outline"
                                onClick={() => setShowQuoteModal(true)}
                                className="h-10 sm:h-11 px-3 sm:px-6 rounded-xl border-2 border-white/20 text-white/70 hover:bg-white/10 font-bold text-xs transition-all hidden sm:flex items-center gap-1"
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
                            className="bg-[#0d0d0f] border border-white/10 rounded-t-3xl md:rounded-3xl w-full md:max-w-md shadow-2xl p-6"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-display font-bold text-white text-xl">Cotizar esta moto</h3>
                                    <p className="text-gray-500 text-sm mt-0.5">{motorcycle.brand} {motorcycle.model}{selectedColor ? ` · ${selectedColor}` : ''}</p>
                                </div>
                                <button
                                    onClick={() => setShowQuoteModal(false)}
                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {quoteSubmitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-ibiza-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-ibiza-red" />
                                    </div>
                                    <h4 className="font-display font-bold text-white text-lg mb-2">¡Cotización enviada!</h4>
                                    <p className="text-gray-400 text-sm">Te responderemos por WhatsApp en minutos.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                                    <div>
                                        <Label className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                                            <User className="w-3.5 h-3.5 inline mr-1.5" />Tu nombre
                                        </Label>
                                        <Input
                                            required
                                            value={quoteForm.name}
                                            onChange={e => setQuoteForm({ ...quoteForm, name: e.target.value })}
                                            placeholder="Ej: Juan García"
                                            className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 rounded-xl focus:border-ibiza-red"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                                            <Phone className="w-3.5 h-3.5 inline mr-1.5" />Teléfono
                                        </Label>
                                        <Input
                                            required
                                            type="tel"
                                            value={quoteForm.phone}
                                            onChange={e => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                                            placeholder="300 123 4567"
                                            className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 rounded-xl focus:border-ibiza-red"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                                            <MapPin className="w-3.5 h-3.5 inline mr-1.5" />Ciudad
                                        </Label>
                                        <Input
                                            value={quoteForm.city}
                                            onChange={e => setQuoteForm({ ...quoteForm, city: e.target.value })}
                                            placeholder="Ej: Armenia"
                                            className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 rounded-xl focus:border-ibiza-red"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-ibiza-red hover:bg-ibiza-red/90 text-white font-display font-bold rounded-2xl h-13 text-base mt-2 group"
                                    >
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Enviar cotización por WhatsApp
                                    </Button>
                                    <p className="text-[10px] text-gray-600 text-center">
                                        Al enviar, aceptas nuestra{' '}
                                        <a href="/privacidad" target="_blank" className="text-gray-500 underline hover:text-white transition-colors">
                                            política de tratamiento de datos
                                        </a>
                                        {' '}(Ley 1581/2012).
                                    </p>
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
                        onClick={() => setEnlargedImage(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
                    >
                        <button
                            onClick={() => setEnlargedImage(null)}
                            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-ibiza-red text-white rounded-full transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            src={enlargedImage}
                            alt="Imagen Ampliada"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
