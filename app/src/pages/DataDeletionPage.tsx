import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Reveal from '@/components/Reveal';

const RESPONSIBLE = 'Ibiza Motos S.A.S.';
const EMAIL       = 'ibizachat321@gmail.com';
const PHONE       = '+57 305 288 4546';
const WA_LINK     = `https://wa.me/573052884546?text=${encodeURIComponent('Hola, quiero solicitar la eliminación de mis datos personales.')}`;

export default function DataDeletionPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Eliminación de Datos | Ibiza Motos';
    return () => { document.title = 'Ibiza Motos | El placer en dos ruedas'; };
  }, []);

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
            <Trash2 className="w-5 h-5 text-ibiza-red" />
          </div>
          <span className="text-ibiza-red text-xs font-bold tracking-widest uppercase">Legal</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-2">
          Solicitud de eliminación<br />de datos personales
        </h1>
        <p className="text-white/40 text-sm mb-12">
          Conforme a la Ley 1581 de 2012 de Colombia y a las políticas de Meta para WhatsApp,
          Facebook e Instagram.
        </p>

        <div className="space-y-10 text-white/70 leading-relaxed text-[15px]">

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">¿Qué datos puedes eliminar?</h2>
            <p className="mb-3">
              Como titular de la información, tienes derecho a solicitar la eliminación de:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Tu nombre, número de teléfono / WhatsApp, correo y ciudad.</li>
              <li>Historial de conversaciones con nuestros asesores en WhatsApp, Instagram y Facebook Messenger.</li>
              <li>Cotizaciones, citas de servicio y formularios que hayas enviado desde este sitio.</li>
              <li>Cualquier información asociada a tu identidad almacenada por {RESPONSIBLE}.</li>
            </ul>
            <p className="mt-3 text-white/50 text-sm">
              Algunos datos pueden conservarse por obligación legal (facturación, garantías, RUNT)
              durante los plazos establecidos por la normativa colombiana.
            </p>
          </section></Reveal>

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">Cómo solicitarlo</h2>
            <p className="mb-4">Tienes tres formas de pedir la eliminación de tus datos:</p>

            <div className="space-y-4">
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                <p className="text-white font-bold mb-2">📧 Por correo electrónico</p>
                <p className="text-sm mb-3">
                  Envía un correo a{' '}
                  <a href={`mailto:${EMAIL}?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20datos`} className="text-ibiza-red hover:underline">{EMAIL}</a>{' '}
                  con el asunto <em>"Solicitud de eliminación de datos"</em>, incluyendo:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 pl-2">
                  <li>Nombre completo</li>
                  <li>Número de identificación</li>
                  <li>Número de WhatsApp registrado con nosotros</li>
                  <li>Descripción de la solicitud</li>
                </ul>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                <p className="text-white font-bold mb-2">💬 Por WhatsApp</p>
                <p className="text-sm mb-3">
                  Escríbenos al <span className="text-white">{PHONE}</span> con el mensaje
                  "Solicito eliminación de mis datos". Te pediremos verificar tu identidad antes de proceder.
                </p>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:opacity-90 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-opacity"
                >
                  Abrir WhatsApp
                </a>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                <p className="text-white font-bold mb-2">🏪 En cualquier sucursal</p>
                <p className="text-sm">
                  Puedes acercarte a cualquiera de nuestras 19 sucursales en Pereira, Dosquebradas,
                  Santa Rosa de Cabal, Quimbaya, Montenegro, Viterbo, Chinchiná o Neiva, y diligenciar
                  el formato físico de solicitud de derechos.
                </p>
              </div>
            </div>
          </section></Reveal>

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">Plazo de respuesta</h2>
            <p>
              Daremos respuesta a tu solicitud en un plazo máximo de <strong className="text-white">10 días hábiles</strong>,
              conforme a la Ley 1581 de 2012. Una vez verificada tu identidad, eliminaremos
              tus datos personales de nuestras bases de datos (web, CRM, WhatsApp Business)
              salvo los registros que la ley nos obligue a conservar.
            </p>
          </section></Reveal>

          <Reveal delay={0.05}><section>
            <h2 className="text-white font-display font-bold text-xl mb-3">Datos compartidos con Meta</h2>
            <p>
              Si interactuaste con nosotros a través de WhatsApp, Instagram o Facebook Messenger,
              Meta también conserva metadatos de la conversación bajo sus propias políticas. Para
              solicitar eliminación directamente a Meta, visita{' '}
              <a href="https://www.facebook.com/help/contact/1638046109617856" target="_blank" rel="noopener noreferrer" className="text-ibiza-red hover:underline">
                el centro de ayuda de Facebook
              </a>.
            </p>
          </section></Reveal>

          <Reveal delay={0.05}><div className="bg-ibiza-red/10 border border-ibiza-red/20 rounded-2xl p-6 mt-4">
            <p className="text-white font-semibold mb-1">¿Dudas adicionales?</p>
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
