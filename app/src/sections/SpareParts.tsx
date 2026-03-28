import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { brands } from '@/data/motorcycles';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getBrandPartsWhatsApp } from '@/lib/config';

export default function SpareParts() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="repuestos" className="py-24 bg-gray-50 relative" ref={ref}>
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
            className="font-display font-bold text-4xl md:text-5xl text-gray-900 mb-4"
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
            Repuestos originales para todas las marcas que distribuimos. Toca tu marca y habla directo con el encargado.
          </motion.p>
        </div>

        {/* Brand logos — WhatsApp por marca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mb-14"
        >
          <p className="text-center text-xs font-bold text-gray-400 tracking-widest uppercase mb-6">
            Selecciona tu marca para consultar
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand, i) => (
              <motion.a
                key={brand.id}
                href={getBrandPartsWhatsApp(brand.name)}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                className="group flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-gray-100 hover:border-ibiza-red/30 hover:shadow-[0_4px_20px_rgba(215,38,61,0.10)] transition-all duration-300"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
                <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-900 transition-colors duration-300">
                  {brand.name}
                </span>
                <MessageCircle className="w-4 h-4 text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-gray-200"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ibiza-red to-ibiza-gold opacity-90" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />

          <div className="relative p-8 md:p-12 text-center !text-white">
            <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">
              ¿No encuentras el repuesto que necesitas?
            </h3>
            <p className="!text-white/90 mb-6 max-w-xl mx-auto">
              Contamos con un amplio catálogo. Contáctanos y te ayudamos a encontrar exactamente lo que buscas.
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
