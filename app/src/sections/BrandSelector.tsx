import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { brands } from '@/data/motorcycles';

export default function BrandSelector() {
  const navigate = useNavigate();

  return (
    <section id="motos" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-ibiza-red/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-ibiza-red/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-ibiza-red font-display font-semibold text-xs tracking-[0.25em] uppercase mb-3">
            Marcas oficiales
          </p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-gray-900 tracking-tight">
            ¿QUÉ MARCA TE MUEVE?
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            Somos distribuidores oficiales. Elige tu marca y explora el catálogo.
          </p>
        </div>

        {/* Logo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              onClick={() => navigate(`/marca/${brand.id}`)}
              className="group relative flex flex-col items-center justify-center gap-3 py-8 px-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-ibiza-red/30 hover:bg-white hover:shadow-[0_6px_30px_rgba(215,38,61,0.10)] transition-all duration-300 cursor-pointer"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                loading="lazy"
                decoding="async"
                className="h-10 w-auto max-w-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
