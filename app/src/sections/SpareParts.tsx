import { Phone, MessageCircle } from 'lucide-react';
import { brands } from '@/data/motorcycles';
import { getBrandPartsWhatsApp, getWhatsAppUrl } from '@/lib/config';
import Reveal from '@/components/Reveal';

export default function SpareParts() {
  return (
    <section id="repuestos" className="py-24 bg-white relative font-body" style={{ color: '#000' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <Reveal direction="up">
            <p
              className="uppercase"
              style={{ fontSize: 11, letterSpacing: '0.15em', color: '#999' }}
            >
              Repuestos Originales
            </p>
          </Reveal>

          <Reveal delay={0.08} direction="up">
            <h2
              className="font-display mt-3 leading-[0.92]"
              style={{ fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '-1px', color: '#000' }}
            >
              REPUESTOS Y ACCESORIOS
            </h2>
          </Reveal>

          <Reveal delay={0.16} direction="fade">
            <div
              className="mx-auto mt-5"
              style={{ width: 56, height: 2, background: '#E31937', borderRadius: 2 }}
            />
          </Reveal>

          <Reveal delay={0.24} direction="fade">
            <p
              className="mx-auto mt-6"
              style={{ fontSize: 15, color: '#666', fontWeight: 300, lineHeight: 1.65, maxWidth: 480 }}
            >
              Repuestos originales para todas las marcas que distribuimos. Toca tu marca y habla directo con el encargado.
            </p>
          </Reveal>
        </div>

        {/* Brand logos — WhatsApp por marca */}
        <div className="mb-14">
          <Reveal direction="up">
            <p
              className="text-center uppercase mb-7"
              style={{ fontSize: 11, letterSpacing: '0.15em', color: '#aaa' }}
            >
              Selecciona tu marca para consultar
            </p>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {brands.map((brand, i) => (
              <Reveal key={brand.id} delay={Math.min(i, 6) * 0.08} direction="up">
              <a
                href={getBrandPartsWhatsApp(brand.name)}
                target="_blank"
                rel="noopener noreferrer"
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
              </a>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <Reveal direction="up">
        <div
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
        </div>
        </Reveal>

      </div>
    </section>
  );
}
