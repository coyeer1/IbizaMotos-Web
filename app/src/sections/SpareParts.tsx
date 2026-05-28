import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { brands } from '@/data/motorcycles';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getBrandPartsWhatsApp, getWhatsAppUrl } from '@/lib/config';

export default function SpareParts() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="repuestos" className="py-24 bg-white relative font-body" style={{ color: '#000' }} ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="uppercase"
            style={{ fontSize: 11, letterSpacing: '0.15em', color: '#999' }}
          >
            Repuestos Originales
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display mt-3 leading-[0.92]"
            style={{ fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '-1px', color: '#000' }}
          >
            REPUESTOS Y ACCESORIOS
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isVisible ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-5"
            style={{ width: 56, height: 2, background: '#E31937', borderRadius: 2 }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-6"
            style={{ fontSize: 15, color: '#666', fontWeight: 300, lineHeight: 1.65, maxWidth: 480 }}
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
          <p
            className="text-center uppercase mb-7"
            style={{ fontSize: 11, letterSpacing: '0.15em', color: '#aaa' }}
          >
            Selecciona tu marca para consultar
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {brands.map((brand, i) => (
              <motion.a
                key={brand.id}
                href={getBrandPartsWhatsApp(brand.name)}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                className="group flex items-center gap-3 bg-white transition-all duration-200 hover:scale-[1.02]"
                style={{ border: '1px solid #e8e8e8', borderRadius: 10, padding: '14px 22px' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8e8e8'; }}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
                <span
                  className="font-body transition-colors duration-200"
                  style={{ fontSize: 14, fontWeight: 600, color: '#888' }}
                >
                  {brand.name}
                </span>
                <MessageCircle className="w-4 h-4 text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
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
          className="relative overflow-hidden"
          style={{ background: '#000', borderRadius: 16 }}
        >
          {/* Hairline accent rule */}
          <div className="absolute top-0 left-0" style={{ width: 56, height: 3, background: '#E31937' }} />

          <div className="relative p-10 md:p-14 text-center">
            <h3
              className="font-display"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.5px', lineHeight: 1.0, color: '#fff' }}
            >
              ¿NO ENCUENTRAS EL <span style={{ color: '#E31937' }}>REPUESTO</span> QUE NECESITAS?
            </h3>
            <p
              className="mx-auto mt-5 mb-8"
              style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', fontWeight: 300, lineHeight: 1.65, maxWidth: 480 }}
            >
              Contamos con un amplio catálogo. Contáctanos y te ayudamos a encontrar exactamente lo que buscas.
            </p>
            <a
              href={getWhatsAppUrl('Hola, busco un repuesto específico')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-body transition-transform duration-200 hover:scale-[1.02] active:scale-95"
              style={{ background: '#fff', color: '#000', borderRadius: 8, padding: '13px 28px', fontSize: 14, fontWeight: 600 }}
            >
              <Phone className="w-[18px] h-[18px] mr-2" />
              Solicitar Repuesto
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
