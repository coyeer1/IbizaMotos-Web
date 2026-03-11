import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

import { useMotorcycles } from '@/hooks/useMotorcycles';


// 3D Floating particles component
const FloatingParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
};

// 3D Card component for content
const Content3DCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / rect.width) * 10;
    const rotateX = ((centerY - e.clientY) / rect.height) * 10;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="preserve-3d transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(30px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default function Hero() {
  const { motorcycles: motos, loading } = useMotorcycles();

  const slides = [
    {
      id: 1,
      headline: 'DOMINA EL ASFALTO',
      subheadline: 'Nueva Vento Tornado 250',
      description: 'Potencia y estilo en cada curva. La compañera perfecta para tu próxima aventura.',
      cta: 'Descúbrela Ahora',
      price: 'Desde $12.999.000',
      gradient: 'from-ibiza-red/90 to-ibiza-black/80',
      image: motos.find(m => m.id === 'vento-tornado-250' || m.id === '1')?.images[0] || '',
      stats: [
        { label: 'Cilindraje', value: '250cc', percent: 85 },
        { label: 'Velocidad Max', value: '130 km/h', percent: 75 },
        { label: 'Aceleración', value: '0-100 en 8s', percent: 80 }
      ]
    },
    {
      id: 2,
      headline: 'LA CIUDAD ES TUYA',
      subheadline: 'Suzuki GSX-R150',
      description: 'Agilidad urbana con alma de campeón. Diseño deportivo que roba miradas.',
      cta: 'Conócela Aquí',
      price: 'Desde $9.499.000',
      gradient: 'from-blue-600/90 to-ibiza-black/80',
      image: motos.find(m => m.id === 'suzuki-gsxr-150' || m.id === '2')?.images[0] || '',
      stats: [
        { label: 'Cilindraje', value: '150cc', percent: 65 },
        { label: 'Velocidad Max', value: '140 km/h', percent: 85 },
        { label: 'Aceleración', value: 'Deportiva', percent: 90 }
      ]
    },
    {
      id: 3,
      headline: 'TU PRIMER VIAJE',
      subheadline: 'Bajaj Boxer 150',
      description: 'Confianza, durabilidad y economía. La moto que te lleva más lejos.',
      cta: 'Empieza Hoy',
      price: 'Desde $5.999.000',
      gradient: 'from-emerald-600/90 to-ibiza-black/80',
      image: motos.find(m => m.id === 'bajaj-boxer-150' || m.id === '3')?.images[0] || '',
      stats: [
        { label: 'Cilindraje', value: '150cc', percent: 60 },
        { label: 'Consumo', value: 'Extra Económico', percent: 95 },
        { label: 'Terreno', value: 'Todo Destino', percent: 85 }
      ]
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.2]);
  const bgFilter = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(8px)']);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  useEffect(() => {
    let frameId: number;
    let targetTime = 0;

    const render = () => {
      if (videoRef.current && videoRef.current.duration) {
        // Interpolar suavemente el scrub del video
        videoRef.current.currentTime += (targetTime - videoRef.current.currentTime) * 0.1;
      }
      frameId = requestAnimationFrame(render);
    };
    frameId = requestAnimationFrame(render);

    const handleScroll = () => {
      // Si scrollea hacia abajo, pausamos el slider principal para no resetear el slide
      if (window.scrollY > 50) {
        setIsAutoPlaying(false);
      }

      // Animación basada en 100vh extra de scroll
      const maxScroll = window.innerHeight;
      let progress = window.scrollY / maxScroll;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      if (videoRef.current && videoRef.current.duration) {
        targetTime = progress * videoRef.current.duration;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ibiza-black flex items-center justify-center relative overflow-hidden">
        <div className="w-12 h-12 border-4 border-ibiza-red/30 border-t-ibiza-red rounded-full animate-spin"></div>
      </div>
    );
  }

  const slide = slides[currentSlide];

  return (
    <section ref={sectionRef} id="inicio" className="relative h-[200vh] w-full bg-ibiza-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Slide Gradient overlays */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Background Video with Scroll Animation */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ scale: bgScale, opacity: bgOpacity, filter: bgFilter }}
        >
          <video
            src="/hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </motion.div>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-[5]" />

        {/* 3D Floating particles */}
        <FloatingParticles />

        {/* Content */}
        <motion.div
          className="relative z-20 h-full flex items-center"
          style={{ y: contentY }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left content */}
              <Content3DCard>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    {/* Subheadline */}
                    <motion.p
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="text-ibiza-gold font-display font-semibold text-lg tracking-wider uppercase"
                    >
                      {slide.subheadline}
                    </motion.p>

                    {/* Headline */}
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.7 }}
                      className="font-display font-bold text-5xl md:text-6xl lg:text-7xl !text-white leading-tight"
                    >
                      {slide.headline}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="!text-white/80 text-lg md:text-xl max-w-lg"
                    >
                      {slide.description}
                    </motion.p>

                    {/* Price */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
                      className="inline-block"
                    >
                      <span className="text-ibiza-gold font-display font-bold text-2xl md:text-3xl animate-float">
                        {slide.price}
                      </span>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="flex flex-wrap gap-4 pt-4"
                    >
                      <a href="#motos">
                        <Button
                          size="lg"
                          className="bg-gradient-ibiza hover:opacity-90 !text-white font-display font-semibold px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-glow-lg group"
                        >
                          {slide.cta}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </a>
                      <a href="https://wa.me/573214567890" target="_blank" rel="noopener noreferrer">
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-2 border-white/50 !text-white hover:bg-ibiza-black/10 font-display font-semibold px-8 py-6 rounded-full transition-all duration-300"
                        >
                          Contactar
                        </Button>
                      </a>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </Content3DCard>

              {/* Right side - 3D Motorcycle showcase */}
              <div className="hidden lg:flex justify-center items-center">
                <Content3DCard className="w-full max-w-lg">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, rotateY: -30, scale: 0.8 }}
                      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                      exit={{ opacity: 0, rotateY: 30, scale: 0.9 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="relative"
                    >
                      {/* Holographic interface frame */}
                      <div className="relative preserve-3d w-full">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-ibiza-red/20 blur-3xl rounded-full scale-[1.2]" />

                        <div className="relative bg-black/40 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-[0_0_50px_rgba(255,107,0,0.15)] flex flex-col items-center justify-center">

                          {/* Floating Image */}
                          <motion.div
                            animate={{ y: [-15, 10, -15] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-full relative flex justify-center mb-6 h-48 md:h-64 items-center"
                          >
                            {slide.image ? (
                              <img
                                src={slide.image}
                                alt={slide.headline}
                                className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                              />
                            ) : (
                              <div className="text-white/50 text-sm">Imagen no disponible</div>
                            )}

                            {/* Decorative Hologram Lines */}
                            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px] mix-blend-overlay"></div>
                          </motion.div>

                          {/* Animated Stats Bars */}
                          <div className="w-full space-y-4">
                            <h4 className="text-white/50 text-xs font-display tracking-[0.2em] uppercase mb-4 text-center">
                              Rendimiento del Sistema
                            </h4>

                            {slide.stats.map((stat, idx) => (
                              <div key={idx} className="w-full">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-300 font-display font-medium">{stat.label}</span>
                                  <span className="text-ibiza-gold font-bold">{stat.value}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stat.percent}%` }}
                                    transition={{ duration: 1.5, delay: 0.5 + (idx * 0.2), ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-ibiza-red to-ibiza-gold rounded-full"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </Content3DCard>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation arrows */}
        <div className="absolute bottom-1/2 translate-y-1/2 left-4 z-30">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full bg-ibiza-black/10 backdrop-blur-sm border border-white/20 flex items-center justify-center !text-white hover:bg-ibiza-black/20 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute bottom-1/2 translate-y-1/2 right-4 z-30">
          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full bg-ibiza-black/10 backdrop-blur-sm border border-white/20 flex items-center justify-center !text-white hover:bg-ibiza-black/20 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${index === currentSlide
                ? 'w-10 h-3 bg-ibiza-red rounded-full'
                : 'w-3 h-3 bg-ibiza-black/50 rounded-full hover:bg-ibiza-black/80'
                }`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 right-8 z-30 hidden lg:flex flex-col items-center gap-2"
        >
          <span className="!text-white/60 text-xs font-display tracking-wider">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
