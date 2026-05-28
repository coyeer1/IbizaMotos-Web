import { useState, useRef, useEffect } from 'react';
import { X, Check, MessageCircle, Calendar, Share2, Download, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Motorcycle } from '@/types';

interface MotorcycleDetailProps {
  motorcycle: Motorcycle | null;
  isOpen: boolean;
  onClose: () => void;
}

// 3D Motorcycle Viewer Component
const Motorcycle3DViewer = ({ 
  motorcycle, 
  selectedColor 
}: { 
  motorcycle: Motorcycle; 
  selectedColor: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    setRotation(prev => ({
      x: Math.max(-30, Math.min(30, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startPos.x;
    const deltaY = e.touches[0].clientY - startPos.y;
    setRotation(prev => ({
      x: Math.max(-30, Math.min(30, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));
    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const colorMap: Record<string, string> = {
    'Negro Mate': '#1a1a1a',
    'Negro': '#000000',
    'Rojo': '#dc2626',
    'Blanco': '#ffffff',
    'Azul': '#2563eb',
    'Azul Metálico': '#1e40af',
    'Verde': '#16a34a',
    'Verde Militar': '#3f4f3a',
    'Gris': '#6b7280',
    'Naranja': '#f97316',
  };

  const bikeColor = colorMap[selectedColor] || '#d7263d';

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <div 
        className="absolute inset-0 flex items-center justify-center preserve-3d"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* 3D Motorcycle representation */}
        <div className="relative">
          {/* Main body */}
          <div 
            className="w-80 h-48 rounded-3xl shadow-2xl flex items-center justify-center relative"
            style={{ 
              backgroundColor: bikeColor,
              boxShadow: `0 25px 50px -12px ${bikeColor}66`,
              transform: 'translateZ(50px)'
            }}
          >
            <span className="!text-white font-display font-bold text-5xl drop-shadow-lg">
              {motorcycle.brand.charAt(0)}
            </span>
            
            {/* Reflection */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent" />
          </div>

          {/* Wheels */}
          <div 
            className="absolute -left-12 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-8 border-gray-800 bg-gray-700"
            style={{ transform: 'translateZ(30px) translateX(-20px)' }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-gray-600" />
          </div>
          <div 
            className="absolute -right-12 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-8 border-gray-800 bg-gray-700"
            style={{ transform: 'translateZ(30px) translateX(20px)' }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-gray-600" />
          </div>

          {/* Handlebars */}
          <div 
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-4 bg-gray-800 rounded-full"
            style={{ transform: 'translateZ(70px)' }}
          />

          {/* Seat */}
          <div 
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-gray-900 rounded-xl"
            style={{ transform: 'translateZ(60px)' }}
          />

          {/* Headlight */}
          <div 
            className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-12 bg-yellow-100 rounded-r-xl"
            style={{ 
              transform: 'translateZ(55px)',
              boxShadow: '0 0 20px rgba(255, 255, 200, 0.8)'
            }}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-gray-500 text-sm">
          Arrastra para rotar la vista 3D
        </p>
      </div>

      {/* Auto-rotate indicator */}
      <div className="absolute top-4 right-4 w-8 h-8 border-2 border-ibiza-red/30 border-t-ibiza-red rounded-full animate-spin" />
    </div>
  );
};

export default function MotorcycleDetail({ motorcycle, isOpen, onClose }: MotorcycleDetailProps) {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (motorcycle) {
      setSelectedColor(motorcycle.specifications.colors[0]);
    }
  }, [motorcycle]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!motorcycle) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const whatsappMessage = `Hola, estoy interesado en la ${motorcycle.brand} ${motorcycle.model}. ¿Podrían darme más información?`;
  const whatsappUrl = `https://wa.me/573052884546?text=${encodeURIComponent(whatsappMessage)}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-ibiza-black rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-ibiza-black/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-ibiza-red hover:!text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid lg:grid-cols-2 h-full max-h-[90vh] overflow-auto">
          {/* Left side - 3D Viewer */}
          <div className="bg-gradient-to-br from-[#111] to-[#222] p-8 flex flex-col min-h-[400px]">
            <div className="flex-1 min-h-[400px] relative">
              <Motorcycle3DViewer 
                motorcycle={motorcycle} 
                selectedColor={selectedColor}
              />
            </div>

            {/* Color selector */}
            <div className="mt-6">
              <p className="text-sm font-display font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Selecciona un color
              </p>
              <div className="flex flex-wrap gap-3">
                {motorcycle.specifications.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedColor === color
                        ? 'bg-ibiza-red !text-white shadow-lg'
                        : 'bg-ibiza-black text-ibiza-gray-600 hover:bg-ibiza-gray-100'
                    }`}
                  >
                    {selectedColor === color && <Check className="w-4 h-4 inline mr-1" />}
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail navigation */}
            <div className="flex justify-center gap-2 mt-6">
              {motorcycle.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentImageIndex === index ? 'bg-ibiza-red w-8' : 'bg-ibiza-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right side - Details */}
          <div className="p-8 overflow-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-ibiza-red font-display font-semibold text-sm">
                  {motorcycle.brand}
                </span>
                <span className="w-1 h-1 bg-ibiza-gray-300 rounded-full" />
                <span className="text-gray-500 text-sm">{motorcycle.category}</span>
                <span className="w-1 h-1 bg-ibiza-gray-300 rounded-full" />
                <span className="text-gray-500 text-sm">{motorcycle.year}</span>
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">
                {motorcycle.model}
              </h2>
              <p className="font-display font-bold text-3xl text-ibiza-red">
                {formatPrice(motorcycle.price)}
              </p>
            </div>

            {/* Description */}
            <p className="text-ibiza-gray-600 mb-8 leading-relaxed">
              {motorcycle.description}
            </p>

            {/* Tabs */}
            <Tabs defaultValue="specs" className="mb-8">
              <TabsList className="w-full">
                <TabsTrigger value="specs" className="flex-1">Especificaciones</TabsTrigger>
                <TabsTrigger value="features" className="flex-1">Características</TabsTrigger>
              </TabsList>

              <TabsContent value="specs" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <SpecItem label="Motor" value={motorcycle.specifications.engine} />
                  <SpecItem label="Potencia" value={motorcycle.specifications.power} />
                  <SpecItem label="Torque" value={motorcycle.specifications.torque} />
                  <SpecItem label="Transmisión" value={motorcycle.specifications.transmission} />
                  <SpecItem label="Peso" value={motorcycle.specifications.weight} />
                  <SpecItem label="Capacidad" value={motorcycle.specifications.fuelCapacity} />
                </div>
              </TabsContent>

              <TabsContent value="features" className="mt-4">
                <ul className="space-y-3">
                  {[
                    'Sistema de frenos ABS de última generación',
                    'Iluminación LED full',
                    'Panel digital multifunción',
                    'Suspensión ajustable',
                    'Garantía de 2 años',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-ibiza-red flex-shrink-0 mt-0.5" />
                      <span className="text-ibiza-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button
                  size="lg"
                  className="w-full bg-gradient-ibiza hover:opacity-90 !text-white font-display font-semibold rounded-full"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Consultar por WhatsApp
                </Button>
              </a>
              <a href="#servicios" onClick={onClose} className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-ibiza-black text-white hover:bg-ibiza-black hover:!text-white font-display font-semibold rounded-full"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar Test Drive
                </Button>
              </a>
            </div>

            {/* Share buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="p-3 rounded-full bg-ibiza-gray-100 hover:bg-ibiza-red hover:!text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full bg-ibiza-gray-100 hover:bg-ibiza-red hover:!text-white transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SpecItem = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-ibiza-gray-100 rounded-xl p-4">
    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="font-display font-semibold text-white text-sm">{value}</p>
  </div>
);
