import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { useSEO } from '@/hooks/useSEO';

const LAST_UPDATE  = '26 de mayo de 2026';
const RESPONSIBLE  = 'Ibiza Motos S.A.S.';
const NIT          = 'NIT 901.197.563-9';
const ADDRESS      = 'Cra 7 #25-41 Parque Lago Uribe, Pereira, Risaralda, Colombia';
const EMAIL        = 'ibizachat321@gmail.com';
const PHONE        = '+57 305 288 4546';

export default function TermsPage() {
  useSEO({
    title: 'Términos y Condiciones | Ibiza Motos',
    description: 'Términos y condiciones de uso del sitio web y servicios de Ibiza Motos S.A.S.',
    path: '/terminos',
  });
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-ibiza-red/10 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-ibiza-red" />
          </div>
          <span className="text-ibiza-red text-xs font-bold tracking-widest uppercase">Legal</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-2">
          Términos y Condiciones<br />de Uso
        </h1>
        <p className="text-white/40 text-sm mb-12">Última actualización: {LAST_UPDATE}</p>

        <div className="space-y-10 text-white/70 leading-relaxed text-[15px]">

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">1. Información de la empresa</h2>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-1 text-sm">
              <p><span className="text-white/40">Razón social:</span> <span className="text-white">{RESPONSIBLE}</span></p>
              <p><span className="text-white/40">Identificación:</span> <span className="text-white">{NIT}</span></p>
              <p><span className="text-white/40">Dirección:</span> <span className="text-white">{ADDRESS}</span></p>
              <p><span className="text-white/40">Correo:</span> <span className="text-white">{EMAIL}</span></p>
              <p><span className="text-white/40">Teléfono / WhatsApp:</span> <span className="text-white">{PHONE}</span></p>
            </div>
          </section></Reveal>

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">2. Aceptación</h2>
            <p>
              Al acceder y utilizar el sitio web <strong className="text-white">ibizamotos.com</strong>,
              los canales de WhatsApp y los demás medios digitales de {RESPONSIBLE}, usted acepta
              quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo, le pedimos
              abstenerse de utilizar nuestros servicios.
            </p>
          </section></Reveal>

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">3. Objeto</h2>
            <p>
              Este sitio permite consultar nuestro catálogo de motocicletas, solicitar cotizaciones,
              agendar citas de servicio técnico, conocer nuestras sucursales y contactar a un asesor
              comercial autorizado. Las imágenes, especificaciones y precios son referenciales y
              pueden variar sin previo aviso. El precio definitivo y la disponibilidad se confirman
              al momento de la cotización formal.
            </p>
          </section></Reveal>

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">4. Cotizaciones y compras</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Las cotizaciones generadas en este sitio o vía WhatsApp tienen una vigencia de hasta 15 días calendario, salvo indicación expresa.</li>
              <li>La compra de cualquier motocicleta se perfecciona únicamente mediante factura emitida por {RESPONSIBLE} en sucursal física.</li>
              <li>Aplican condiciones, requisitos y políticas de cada financiera (Progreser, Banco de Bogotá, SUFI, Brilla, ADDI, Venfi y demás aliadas). La aprobación de crédito es facultad exclusiva de la entidad financiera.</li>
              <li>Las promociones tienen vigencia limitada y se rigen por los términos publicados en cada campaña.</li>
            </ul>
          </section></Reveal>

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">5. Servicio técnico</h2>
            <p>
              Las citas agendadas en línea son confirmadas por un asesor. El servicio se presta en
              las sucursales autorizadas y se rige por las garantías de fábrica de cada marca
              (Suzuki, Honda, Bajaj, AKT, Hero, Vento) y por nuestras propias políticas de garantía
              de mano de obra y repuestos.
            </p>
          </section></Reveal>

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">6. Uso de WhatsApp y canales digitales</h2>
            <p className="mb-3">
              Al iniciar una conversación con nosotros por WhatsApp, Instagram, Facebook Messenger
              o cualquier otro canal:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Acepta que su mensaje y datos de contacto sean recibidos por un asesor humano o por un sistema automatizado de atención (chatbot).</li>
              <li>Acepta recibir respuestas, cotizaciones, recordatorios y mensajes transaccionales relacionados con su consulta.</li>
              <li>Puede solicitar el cese de comunicaciones de marketing en cualquier momento respondiendo "BAJA" o escribiendo a <a href={`mailto:${EMAIL}`} className="text-ibiza-red hover:underline">{EMAIL}</a>.</li>
              <li>La interacción con nuestros canales se rige adicionalmente por los términos de cada plataforma (Meta / WhatsApp / Instagram / Facebook).</li>
            </ul>
          </section></Reveal>

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">7. Propiedad intelectual</h2>
            <p>
              Los logotipos, marcas, fotografías y contenidos de este sitio son propiedad de
              {' '}{RESPONSIBLE} o de sus respectivos titulares (marcas de motocicletas) y están
              protegidos por la legislación colombiana e internacional. Queda prohibida su
              reproducción sin autorización escrita.
            </p>
          </section></Reveal>

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">8. Limitación de responsabilidad</h2>
            <p>
              {RESPONSIBLE} no se responsabiliza por la indisponibilidad temporal del sitio, errores
              tipográficos, fallas de proveedores externos (financieras, plataformas de mensajería,
              servicios de hosting) ni por daños indirectos derivados del uso del sitio. Las
              características de las motocicletas pueden variar respecto a las imágenes; siempre
              prevalece la ficha técnica oficial del fabricante.
            </p>
          </section></Reveal>

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">9. Datos personales</h2>
            <p>
              El tratamiento de datos personales se rige por nuestra{' '}
              <Link to="/privacidad" className="text-ibiza-red hover:underline">Política de Tratamiento de Datos Personales</Link>,
              conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia.
            </p>
          </section></Reveal>

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">10. Modificaciones</h2>
            <p>
              {RESPONSIBLE} podrá modificar estos términos en cualquier momento. Los cambios entran
              en vigor desde su publicación en este sitio. El uso continuado del sitio implica la
              aceptación de los términos actualizados.
            </p>
          </section></Reveal>

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">11. Ley aplicable y jurisdicción</h2>
            <p>
              Estos Términos se rigen por las leyes de la República de Colombia. Cualquier
              controversia será sometida a los jueces competentes de Pereira (Risaralda),
              salvo norma imperativa en contrario.
            </p>
          </section></Reveal>

          <Reveal delay={0.05}><div className="bg-ibiza-red/10 border border-ibiza-red/20 rounded-2xl p-6 mt-4">
            <p className="text-white font-semibold mb-1">¿Tienes preguntas sobre estos términos?</p>
            <p className="text-white/60 text-sm mb-3">Escríbenos y te respondemos en menos de 24 horas.</p>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 bg-ibiza-red hover:bg-ibiza-red/90 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              {EMAIL}
            </a>
          </div></Reveal>

        </div>
      </div>
    </div>
  );
}
