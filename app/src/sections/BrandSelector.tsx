import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { brands } from '@/data/motorcycles';
import { getBrandSalesWhatsApp } from '@/lib/config';

export default function BrandSelector() {
  return (
    <section id="motos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-ibiza-red font-display font-semibold text-xs tracking-[0.25em] uppercase mb-3">
            Marcas oficiales
          </p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-gray-900 tracking-tight">
            ¿QUÉ MARCA TE MUEVE?
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            Somos distribuidores oficiales. Elige tu marca y habla con nuestro asesor.
          </p>
        </div>

        {/* Logo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand, i) => (
            <motion.a
              key={brand.id}
              href={getBrandSalesWhatsApp(brand.name)}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group relative flex flex-col items-center justify-center gap-3 py-8 px-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-ibiza-red/30 hover:bg-white hover:shadow-[0_6px_30px_rgba(215,38,61,0.10)] transition-all duration-300 cursor-pointer"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-10 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
              {/* WhatsApp chip — aparece al hover */}
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-[#25D366] px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
                <MessageCircle className="w-3 h-3" />
                Consultar
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
