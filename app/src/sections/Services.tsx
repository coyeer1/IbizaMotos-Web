import { Wrench, Calendar, Phone, MapPin, CheckCircle2, Clock, Star, Award, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// ─── Tokens (alineados con el hero) ───────────────────────────────────────
const T = {
  text: '#000000',
  muted: '#999999',
  border: '#e8e8e8',
  hairline: '#f0f0f0',
  pill: '#f5f5f5',
  red: '#E31937',
  display: "'Bebas Neue', sans-serif",
  body: "'DM Sans', sans-serif",
};

// helper para el stagger de entrada interno
const anim = (delayMs: number, dur = 0.5, name = 'fadeUp') =>
  ({ animation: `${name} ${dur}s both`, animationDelay: `${delayMs}ms` } as React.CSSProperties);

const servicesList = [
  {
    id: 'mantenimiento',
    title: 'Mantenimiento Preventivo',
    description: 'Cambio de aceite, ajuste de válvulas, revisión de frenos y lubricación de cables.',
    price: 'Desde $85.000',
    time: '1-2 horas',
    includes: ['Aceite 20W-50', 'Filtro de aceite', 'Revisión de 15 puntos', 'Lavado básico', 'Cambio de pastillas', 'Rectificación de discos, Reparación de amortiguadores'],
    Icon: Wrench,
  },
  {
    id: 'revision',
    title: 'Revisión General',
    description: 'Diagnóstico completo del estado de tu moto. Te decimos qué necesita y cuánto cuesta antes de tocar nada.',
    price: '$35.000',
    time: '30-45 min',
    includes: ['Diagnóstico computarizado', 'Estado del motor', 'Sistema eléctrico', 'Presupuesto detallado'],
    Icon: CheckCircle2,
  },
  {
    id: 'frenos',
    title: 'Frenos y Suspensión',
    description: 'Cambio de pastillas, rectificación de discos, reparación de amortiguadores y horquillas.',
    price: 'Desde $120.000',
    time: '2-3 horas',
    includes: ['Cambio de pastillas', 'Rectificación de discos', 'Horquillas'],
    Icon: ShieldAlert,
  },
  {
    id: 'motor',
    title: 'Reparación de Motor',
    description: 'Desde un ajuste menor hasta una reconstrucción completa. Trabajo garantizado.',
    price: 'Cotización gratis',
    time: 'Según diagnóstico',
    includes: ['Desde un ajuste menor hasta una reconstrucción completa. Trabajo garantizado.'],
    Icon: Cpu,
  },
];

const stats = [
  { Icon: MapPin, value: '19', label: 'Sucursales' },
  { Icon: Award, value: '6', label: 'Marcas' },
  { Icon: Star, value: '8', label: 'Ciudades' },
];

export default function Services() {
  const navigate = useNavigate();

  const goToAppointment = (serviceId: string) => {
    navigate(`/citas?servicio=${serviceId}`);
  };

  return (
    <section
      id="servicios"
      className="py-24 bg-white"
      style={{ fontFamily: T.body, color: T.text }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">

        {/* ── Encabezado editorial ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <span
              className="inline-block uppercase"
              style={{
                ...anim(0),
                fontSize: 11,
                letterSpacing: '0.15em',
                color: '#999',
                fontWeight: 500,
              }}
            >
              Taller Mecánico
            </span>

            <h2
              style={{
                ...anim(80, 0.55),
                fontFamily: T.display,
                fontSize: 'clamp(44px, 6vw, 68px)',
                lineHeight: 0.95,
                letterSpacing: '-1px',
                marginTop: 12,
                color: T.text,
              }}
            >
              Servicio <span style={{ color: T.red }}>Técnico</span>
            </h2>

            <p
              style={{
                ...anim(160),
                fontSize: 15,
                color: '#666',
                fontWeight: 300,
                lineHeight: 1.7,
                maxWidth: 440,
                marginTop: 18,
              }}
            >
              Talleres autorizados Suzuki, Honda, Bajaj, AKT, Hero y Vento en toda
              la red. Repuestos originales, diagnóstico honesto y precio justo.
            </p>
          </div>

          {/* Stats — datos verificables, light */}
          <div className="flex flex-wrap lg:flex-nowrap gap-4 sm:gap-6" style={anim(240)}>
            {stats.map(({ Icon, value, label }, i) => (
              <div
                key={label}
                className="group flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-1"
                style={anim(280 + i * 60)}
              >
                <div
                  className="flex flex-col items-center justify-center transition-colors duration-200 group-hover:border-[#E31937]"
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: 999,
                    border: `1px solid ${T.border}`,
                    background: T.pill,
                    marginBottom: 10,
                  }}
                >
                  <Icon className="w-5 h-5 mb-1 text-[#bbb] transition-colors duration-200 group-hover:text-[#E31937]" />
                  <span style={{ fontFamily: T.display, fontSize: 30, lineHeight: 1, color: T.text }}>
                    {value}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: '#999', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Grid de servicios — tarjetas light editorial ── */}
        <div className="grid md:grid-cols-2 gap-6 mb-24">
          {servicesList.map((service, index) => (
            <div
              key={service.id}
              className="group flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.12)]"
              style={{
                ...anim(index * 80),
                background: '#fff',
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: 28,
              }}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3
                    style={{
                      fontFamily: T.display,
                      fontSize: 26,
                      lineHeight: 1.05,
                      letterSpacing: '-0.3px',
                      color: T.text,
                    }}
                  >
                    {service.title}
                  </h3>
                  <service.Icon className="w-5 h-5 text-[#bbb] transition-colors duration-200 group-hover:text-[#E31937] shrink-0 ml-3" />
                </div>

                <p style={{ fontSize: 14, color: '#666', fontWeight: 300, lineHeight: 1.65, marginBottom: 18 }}>
                  {service.description}
                </p>

                <div className="flex items-center gap-5 mb-6">
                  <span style={{ color: T.red, fontWeight: 600, fontSize: 14 }}>{service.price}</span>
                  <span className="flex items-center gap-1.5" style={{ color: '#999', fontSize: 13 }}>
                    <Clock className="w-3.5 h-3.5" />
                    {service.time}
                  </span>
                </div>

                <div className="mb-6">
                  <p
                    className="uppercase"
                    style={{ fontSize: 10, letterSpacing: '0.15em', color: '#aaa', fontWeight: 600, marginBottom: 12 }}
                  >
                    Incluye
                  </p>
                  <ul className="flex flex-wrap gap-x-4 gap-y-2">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2" style={{ fontSize: 12, color: '#555' }}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E31937] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button
                onClick={() => goToAppointment(service.id)}
                className="w-full h-11 rounded-lg text-sm font-semibold bg-black text-white hover:bg-black hover:scale-[1.02] active:scale-95 transition-transform duration-200 shadow-none"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Cita
              </Button>
            </div>
          ))}
        </div>

        {/* ── CTA — dos columnas light ── */}
        <div id="appointment-form" className="grid lg:grid-cols-2 gap-6">

          {/* Información de contacto */}
          <div
            style={{
              ...anim(0),
              background: '#fff',
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: 32,
            }}
          >
            <h3
              style={{
                fontFamily: T.display,
                fontSize: 30,
                lineHeight: 1,
                letterSpacing: '-0.3px',
                color: T.text,
                marginBottom: 24,
              }}
            >
              Ven directo al taller
            </h3>

            <div className="space-y-5 mb-8">
              {[
                { Icon: MapPin, title: 'Sede Principal', l1: 'Cra 7 #25-41 Parque Lago Uribe, Pereira', l2: 'Risaralda · Eje Cafetero' },
                { Icon: Clock, title: 'Horario de atención', l1: 'Lunes a Sábado: 8:00 AM - 6:00 PM', l2: 'Domingos: Solo emergencias' },
                { Icon: Phone, title: 'Llámanos', l1: '(+57) 305 288 4546', l2: 'WhatsApp disponible' },
              ].map(({ Icon, title, l1, l2 }) => (
                <div key={title} className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{ width: 40, height: 40, borderRadius: 10, background: T.pill }}
                  >
                    <Icon className="w-5 h-5 text-[#E31937]" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15, color: T.text }}>{title}</p>
                    <p style={{ fontSize: 14, color: '#666' }}>{l1}</p>
                    <p style={{ fontSize: 12, color: '#999' }}>{l2}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/573052884546?text=Hola, quiero agendar una cita para el taller"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-[#E31937] text-white hover:bg-[#E31937] hover:scale-[1.02] active:scale-95 transition-transform duration-200 font-semibold rounded-lg h-12 shadow-none">
                <Phone className="w-5 h-5 mr-2" />
                Escribir por WhatsApp
              </Button>
            </a>
          </div>

          {/* Cita online — tarjeta light (sin gradiente) */}
          <div
            className="flex flex-col justify-between"
            style={{
              ...anim(80),
              background: T.pill,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: 32,
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: T.display,
                  fontSize: 30,
                  lineHeight: 1,
                  letterSpacing: '-0.3px',
                  color: T.text,
                  marginBottom: 10,
                }}
              >
                Agenda tu cita online
              </h3>
              <p style={{ fontSize: 14, color: '#666', fontWeight: 300, lineHeight: 1.7, marginBottom: 28 }}>
                Elige el servicio, la fecha y la hora que mejor te quede. Sin llamadas, sin esperas. Confirmamos en menos de 30 minutos.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { id: 'mantenimiento', Icon: Wrench, label: 'Mantenimiento preventivo' },
                  { id: 'revision', Icon: CheckCircle2, label: 'Revisión general' },
                  { id: 'frenos', Icon: Star, label: 'Frenos y suspensión' },
                  { id: 'motor', Icon: Cpu, label: 'Reparación de motor' },
                ].map(({ id, Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => goToAppointment(id)}
                    className="w-full flex items-center transition-colors duration-200 hover:border-[#000]"
                    style={{
                      background: '#fff',
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      padding: '14px 16px',
                      fontSize: 14,
                      fontWeight: 500,
                      color: T.text,
                      textAlign: 'left',
                    }}
                  >
                    <Icon className="w-5 h-5 mr-3 shrink-0 text-[#E31937]" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={() => navigate('/citas')}
              className="w-full bg-black text-white hover:bg-black hover:scale-[1.02] active:scale-95 transition-transform duration-200 font-semibold rounded-lg h-12 shadow-none"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Ver disponibilidad completa
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
