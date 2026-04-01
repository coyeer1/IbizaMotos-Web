import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { brands, motorcycles as allMotos } from '@/data/motorcycles';
import { getBrandSalesWhatsApp } from '@/lib/config';

const BRAND_COLORS: Record<string, string> = {
  'Suzuki':    '#1a73e8',
  'Vento':     '#e53935',
  'Hero':      '#003087',
  'Honda':     '#cc0000',
  'Bajaj':     '#003087',
  'AKT':       '#e53935',
  'Good Kidz': '#2e7d32',
};

export default function BrandSelector() {
  const navigate = useNavigate();

  const brandData = useMemo(() => {
    return brands.map(brand => {
      const motos = allMotos.filter(m => m.brand === brand.name);
      const featuredImage = motos.find(m => m.images?.[0])?.images?.[0] ?? null;
      return { ...brand, count: motos.length, featuredImage };
    });
  }, []);

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

        {/* Brand grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {brandData.map((brand, i) => {
            const color = BRAND_COLORS[brand.name] ?? '#d7263d';
            const waUrl = getBrandSalesWhatsApp(brand.name);

            return (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                onClick={() => navigate(`/marca/${brand.id}`)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer h-52 bg-gray-50 border border-gray-100 hover:border-transparent hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-500"
              >
                {/* Moto background image */}
                {brand.featuredImage && (
                  <img
                    src={brand.featuredImage}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain object-center scale-105 opacity-[0.12] group-hover:opacity-25 group-hover:scale-110 transition-all duration-700"
                  />
                )}

                {/* Gradient overlay bottom */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />

                {/* Brand color bar bottom */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1 group-hover:h-1.5 transition-all duration-300"
                  style={{ background: color }}
                />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-between p-5 pb-4">

                  {/* Logo */}
                  <div className="flex-1 flex items-center justify-center">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      loading="lazy"
                      decoding="async"
                      className="h-10 w-auto max-w-[120px] object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-400"
                    />
                  </div>

                  {/* Bottom row: name+count + CTA */}
                  <div className="w-full flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold text-gray-900 text-sm leading-tight">
                        {brand.name}
                      </p>
                      <p className="text-gray-400 text-[11px] mt-0.5 whitespace-nowrap">
                        {brand.count} {brand.count === 1 ? 'modelo' : 'modelos'}
                      </p>
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="shrink-0 flex items-center gap-1 bg-[#25D366] hover:bg-[#1db954] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Consultar
                    </a>
                  </div>
                </div>

                {/* Ver catálogo chip — aparece en hover */}
                <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/0 group-hover:bg-black/6 text-gray-400 group-hover:text-gray-600 text-[10px] font-semibold px-2 py-1 rounded-lg transition-all duration-300">
                  Ver catálogo <ChevronRight className="w-3 h-3" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
