import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Reveal from '@/components/Reveal';

const LAST_UPDATE = '26 de mayo de 2026';
const RESPONSIBLE  = 'Ibiza Motos S.A.S.';
const NIT          = 'NIT 901.197.563-9';
const ADDRESS      = 'Cra 7 #25-41 Parque Lago Uribe, Pereira, Risaralda, Colombia';
const EMAIL        = 'ibizachat321@gmail.com';
const PHONE        = '+57 305 288 4546';

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Política de Privacidad | Ibiza Motos';
    return () => { document.title = 'Ibiza Motos | El placer en dos ruedas'; };
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-ibiza-red/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-ibiza-red" />
          </div>
          <span className="text-ibiza-red text-xs font-bold tracking-widest uppercase">Legal</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-2">
          Política de Tratamiento<br />de Datos Personales
        </h1>
        <p className="text-white/40 text-sm mb-12">Última actualización: {LAST_UPDATE}</p>

        <div className="space-y-10 text-white/70 leading-relaxed text-[15px]">

          {/* 1 */}
          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">1. Responsable del tratamiento</h2>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-1 text-sm">
              <p><span className="text-white/40">Razón social:</span> <span className="text-white">{RESPONSIBLE}</span></p>
              <p><span className="text-white/40">Identificación:</span> <span className="text-white">{NIT}</span></p>
              <p><span className="text-white/40">Dirección:</span> <span className="text-white">{ADDRESS}</span></p>
              <p><span className="text-white/40">Correo:</span> <span className="text-white">{EMAIL}</span></p>
              <p><span className="text-white/40">Teléfono:</span> <span className="text-white">{PHONE}</span></p>
            </div>
          </section></Reveal>

          {/* 2 */}
          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">2. Marco legal</h2>
            <p>
              La presente política se expide en cumplimiento de la <strong className="text-white">Ley 1581 de 2012</strong> (Protección de
              Datos Personales), el <strong className="text-white">Decreto 1377 de 2013</strong> y las instrucciones impartidas por
              la Superintendencia de Industria y Comercio (SIC).
            </p>
          </section></Reveal>

          {/* 3 */}
          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">3. Datos que recolectamos</h2>
            <p className="mb-3">A través de los formularios del sitio web podemos recolectar:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Nombre completo</li>
              <li>Número de teléfono / WhatsApp</li>
              <li>Correo electrónico</li>
              <li>Ciudad de residencia</li>
              <li>Información sobre la motocicleta de interés o de servicio</li>
            </ul>
            <p className="mt-3">
              No recolectamos datos sensibles (datos financieros, médicos, biométricos, etc.)
              a través de este sitio web.
            </p>
          </section></Reveal>

          {/* 4 */}
          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">4. Finalidad del tratamiento</h2>
            <p className="mb-3">Sus datos serán utilizados para:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Agendar y confirmar citas de servicio técnico</li>
              <li>Atender solicitudes de cotización de motocicletas</li>
              <li>Brindar asesoría comercial personalizada</li>
              <li>Enviar información sobre productos, promociones y novedades (solo si usted lo autoriza)</li>
              <li>Cumplir obligaciones legales y contractuales</li>
            </ul>
          </section></Reveal>

          {/* 5 */}
          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">5. Almacenamiento y seguridad</h2>
            <p>
              Los datos recolectados a través del formulario de citas son almacenados en{' '}
              <strong className="text-white">Supabase</strong>, una plataforma con cifrado en tránsito (TLS) y en reposo.
              No vendemos, cedemos ni compartimos sus datos personales con terceros, salvo
              que sea requerido por autoridad competente o para la prestación del servicio contratado.
            </p>
          </section></Reveal>

          {/* 6 */}
          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">6. Derechos del titular</h2>
            <p className="mb-3">
              De conformidad con el artículo 8 de la Ley 1581 de 2012, usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong className="text-white">Conocer</strong> los datos que tenemos sobre usted</li>
              <li><strong className="text-white">Actualizar y rectificar</strong> datos inexactos o incompletos</li>
              <li><strong className="text-white">Solicitar la supresión</strong> de sus datos cuando no sean necesarios para la finalidad informada</li>
              <li><strong className="text-white">Revocar la autorización</strong> para el tratamiento de sus datos</li>
              <li><strong className="text-white">Presentar quejas</strong> ante la SIC por infracciones a la ley</li>
            </ul>
          </section></Reveal>

          {/* 7 */}
          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">7. Cómo ejercer sus derechos</h2>
            <p>
              Para ejercer cualquiera de sus derechos, puede enviarnos un correo a{' '}
              <a href={`mailto:${EMAIL}`} className="text-ibiza-red hover:underline">{EMAIL}</a>{' '}
              indicando su nombre completo, número de identificación, descripción de la solicitud y
              número de contacto. Daremos respuesta en un plazo máximo de <strong className="text-white">10 días hábiles</strong>.
            </p>
          </section></Reveal>

          {/* 8 */}
          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">8. Transferencias internacionales</h2>
            <p>
              Sus datos pueden ser procesados en servidores ubicados fuera de Colombia como parte
              de los servicios de infraestructura que utilizamos (Supabase — AWS us-east-1).
              Estos proveedores cuentan con políticas de privacidad y seguridad equivalentes a los
              estándares exigidos por la legislación colombiana.
            </p>
          </section></Reveal>

          {/* 9 */}
          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">9. Vigencia</h2>
            <p>
              Esta política entra en vigor el {LAST_UPDATE} y permanecerá vigente mientras
              {' '}{RESPONSIBLE} desarrolle sus actividades comerciales. Nos reservamos el derecho
              de actualizarla. Cualquier cambio sustancial será comunicado a través del sitio web.
            </p>
          </section></Reveal>

          {/* Contact CTA */}
          <Reveal delay={0.05}><div className="bg-ibiza-red/10 border border-ibiza-red/20 rounded-2xl p-6 mt-4">
            <p className="text-white font-semibold mb-1">¿Tiene preguntas sobre esta política?</p>
            <p className="text-white/60 text-sm mb-3">Escríbanos y le respondemos en menos de 24 horas.</p>
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
