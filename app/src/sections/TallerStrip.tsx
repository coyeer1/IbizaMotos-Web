import { Wrench, MessageCircle } from 'lucide-react';
import { getServiceWhatsApp } from '@/lib/config';

/**
 * Franja de taller mientras el agendamiento online esta apagado
 * (WORKSHOP_BOOKING_ENABLED = false). Reemplaza en la home a la seccion completa
 * de Services, que mostraba dos pantallas de botones deshabilitados.
 */
export default function TallerStrip() {
  return (
    <section id="servicios" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <div className="w-12 h-12 shrink-0 rounded-xl bg-ibiza-brand/10 flex items-center justify-center">
            <Wrench className="w-6 h-6 text-ibiza-brand" />
          </div>
          <div className="flex-1">
            <p className="uppercase text-[11px] tracking-[0.15em] font-semibold text-neutral-400">Taller autorizado</p>
            <h2 className="font-display text-3xl sm:text-4xl leading-none mt-1">Servicio técnico en toda la red</h2>
            <p className="text-sm text-neutral-600 mt-2 max-w-2xl">
              Mantenimiento, revisión, frenos, suspensión y motor para Suzuki, Honda, Bajaj, AKT, Hero y Vento, con
              repuestos originales. Escríbenos y te damos cita en la sucursal más cercana.
            </p>
          </div>
          <a
            href={getServiceWhatsApp('taller (mantenimiento o revisión)')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-black text-white text-sm font-semibold hover:bg-ibiza-brand transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4" /> Agendar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
