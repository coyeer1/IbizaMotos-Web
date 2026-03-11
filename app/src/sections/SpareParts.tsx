import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Phone, Wrench, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { spareParts } from '@/data/motorcycles';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getPartWhatsApp } from '@/lib/config';

const categoryIcons: Record<string, React.ReactNode> = {
  'Aceites': <Zap className="w-8 h-8" />,
  'Frenos': <Shield className="w-8 h-8" />,
  'Filtros': <Wrench className="w-8 h-8" />,
  'Transmisión': <Wrench className="w-8 h-8" />,
  'Eléctrico': <Zap className="w-8 h-8" />,
  'Suspensión': <Shield className="w-8 h-8" />,
};

export default function SpareParts() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(spareParts.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const filteredParts = useMemo(() => {
    return spareParts.filter((part) => {
      const matchesSearch = 
        part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.compatibility.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || part.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppConsult = (partName: string) => {
    window.open(getPartWhatsApp(partName), '_blank');
  };

  return (
    <section id="repuestos" className="py-24 bg-ibiza-black relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-ibiza-red font-display font-semibold text-sm tracking-widest uppercase mb-4"
          >
            🔧 Repuestos Originales
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl text-white mb-4"
          >
            REPUESTOS Y ACCESORIOS
          </motion.h2>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isVisible ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-24 h-1 bg-gradient-ibiza mx-auto rounded-full"
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-500 mt-4 max-w-xl mx-auto"
          >
            Encuentra los repuestos originales para tu moto. Contamos con piezas para todas las marcas que distribuimos.
          </motion.p>
        </div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 mb-10 border border-white/5"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Buscar repuesto, categoría o marca compatible..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full rounded-xl border-white/10 bg-ibiza-black/50 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-ibiza-red focus:border-transparent"
              />
            </div>

            {/* WhatsApp CTA */}
            <a 
              href="https://wa.me/573214567890?text=Hola, necesito información sobre repuestos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full md:w-auto bg-ibiza-red hover:bg-ibiza-red/80 !text-white rounded-xl font-semibold">
                <Phone className="w-4 h-4 mr-2" />
                Consultar Disponibilidad
              </Button>
            </a>
          </div>

          {/* Quick category pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-ibiza-red !text-white shadow-[0_0_15px_rgba(227,25,55,0.3)]'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Parts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredParts.map((part, index) => (
              <motion.div
                key={part.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <div className="bg-white/[0.03] rounded-2xl overflow-hidden hover:shadow-[0_0_25px_rgba(227,25,55,0.15)] transition-all duration-500 hover:-translate-y-1 border border-white/5 hover:border-ibiza-red/20">
                  {/* Image area with icon */}
                  <div className="relative h-40 bg-gradient-to-br from-ibiza-black to-zinc-900 flex items-center justify-center overflow-hidden">
                    {/* Decorative background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-ibiza-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="text-gray-600 group-hover:text-ibiza-red transition-colors duration-500 group-hover:scale-110 transform transition-transform">
                      {categoryIcons[part.category] || <Package className="w-8 h-8" />}
                    </div>
                    
                    {/* Stock badge */}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      part.stock 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {part.stock ? '✓ En stock' : 'Agotado'}
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-white/60 backdrop-blur-sm">
                      {part.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg text-white mt-1 mb-3 group-hover:text-white transition-colors">
                      {part.name}
                    </h3>
                    
                    {/* Compatibility */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {part.compatibility.slice(0, 2).map((brand) => (
                        <span 
                          key={brand}
                          className="text-xs bg-white/5 px-2 py-1 rounded-full text-gray-400 border border-white/5"
                        >
                          {brand}
                        </span>
                      ))}
                      {part.compatibility.length > 2 && (
                        <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-gray-400 border border-white/5">
                          +{part.compatibility.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="font-display font-bold text-xl text-ibiza-red">
                        {formatPrice(part.price)}
                      </p>
                      
                      <button 
                        onClick={() => handleWhatsAppConsult(part.name)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                          part.stock 
                            ? 'bg-ibiza-red/10 text-ibiza-red border border-ibiza-red/20 hover:bg-ibiza-red hover:!text-white hover:shadow-[0_0_15px_rgba(227,25,55,0.3)]' 
                            : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                        }`}
                        disabled={!part.stock}
                      >
                        {part.stock ? 'Consultar' : 'No disponible'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredParts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <Package className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              No se encontraron repuestos
            </h3>
            <p className="text-gray-500 mb-4">
              Intenta con otra búsqueda o contáctanos directamente
            </p>
            <a 
              href="https://wa.me/573214567890"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="border-ibiza-red/30 text-white hover:bg-ibiza-red hover:border-ibiza-red">
                <Phone className="w-4 h-4 mr-2" />
                Consultar por WhatsApp
              </Button>
            </a>
          </motion.div>
        )}

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 relative rounded-3xl overflow-hidden border border-white/10"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-ibiza-red to-ibiza-gold opacity-90" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
          
          <div className="relative p-8 md:p-12 text-center !text-white">
            <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">
              ¿No encuentras el repuesto que necesitas?
            </h3>
            <p className="!text-white/90 mb-6 max-w-xl mx-auto">
              Contamos con un amplio catálogo de repuestos. Contáctanos y te ayudamos a encontrar exactamente lo que buscas.
            </p>
            <a 
              href="https://wa.me/573214567890?text=Hola, busco un repuesto específico"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-ibiza-black text-white hover:bg-white hover:text-ibiza-black font-display font-semibold rounded-full transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Solicitar Repuesto
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
