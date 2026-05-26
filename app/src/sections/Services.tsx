import { Wrench, Calendar, Phone, MapPin, CheckCircle2, Clock, Star, Users, Award, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useNavigate } from 'react-router-dom';

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

const mechanics = [
  { name: 'Javier', role: 'Jefe de Taller', exp: '15 años', specialty: 'Motores 4T' },
  { name: 'Andrés', role: 'Técnico Senior', exp: '8 años', specialty: 'Sistemas de inyección' },
  { name: 'Luis', role: 'Técnico', exp: '5 años', specialty: 'Eléctrica y electrónica' },
];

export default function Services() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const navigate = useNavigate();

  const goToAppointment = (serviceId: string) => {
    navigate(`/citas?servicio=${serviceId}`);
  };

  return (
    <section id="servicios" className="py-24 bg-gray-50 relative overflow-hidden" ref={ref}>
      {/* Decorative blobs */}
      <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-ibiza-red/6 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] bg-ibiza-red/4 rounded-full blur-[130px] pointer-events-none" />
      {/* Container with background image for the new aesthetic */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Modernized Service Section */}
        <div className="relative rounded-[2.5rem] overflow-hidden mb-24 border border-white/10 shadow-2xl">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-60 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-ibiza-black via-ibiza-black/70 to-ibiza-black/30" />

          <div className="relative p-8 md:p-12 lg:p-16">

            {/* Header Area */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">

              <div className="max-w-xl">
                <div className={`mb-6 flex items-center gap-3 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <div className="w-8 h-8 rounded-lg bg-ibiza-red flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-400 font-display font-semibold text-sm tracking-widest uppercase">
                    Taller Mecánico
                  </p>
                </div>

                <h2 className={`font-display font-bold text-5xl md:text-6xl text-white mb-6 uppercase transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <span className="text-ibiza-red">Servicio</span> Técnico
                </h2>

                <p className={`text-gray-300 text-lg leading-relaxed transition-all duration-600 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                  Tres mecánicos, más de 25 años de experiencia combinada.
                  No vendemos lo que no necesitas. Diagnóstico honesto, precio justo.
                </p>
              </div>

              {/* Stats / Badges */}
              <div className={`flex flex-wrap lg:flex-nowrap gap-6 xl:gap-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                {/* Stat 1 */}
                <div className="flex flex-col items-center group">
                  <div className="w-24 h-24 rounded-full border border-ibiza-red/40 bg-ibiza-black/40 backdrop-blur-md flex flex-col items-center justify-center text-white mb-3 group-hover:border-ibiza-red group-hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all duration-500">
                    <Users className="w-6 h-6 text-gray-400 group-hover:text-ibiza-red mb-1 transition-colors" />
                    <span className="font-display font-bold text-2xl">3</span>
                  </div>
                  <span className="text-sm text-gray-400 font-medium">Mecánicos</span>
                </div>
                {/* Stat 2 */}
                <div className="flex flex-col items-center group">
                  <div className="w-24 h-24 rounded-full border border-ibiza-red/40 bg-ibiza-black/40 backdrop-blur-md flex flex-col items-center justify-center text-white mb-3 group-hover:border-ibiza-red group-hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all duration-500">
                    <Award className="w-6 h-6 text-gray-400 group-hover:text-ibiza-red mb-1 transition-colors" />
                    <span className="font-display font-bold text-2xl">25<span className="text-ibiza-red text-xl">+</span></span>
                  </div>
                  <span className="text-sm text-gray-400 font-medium">Años exp.</span>
                </div>
                {/* Stat 3 */}
                <div className="flex flex-col items-center group">
                  <div className="w-24 h-24 rounded-full border border-ibiza-red/40 bg-ibiza-black/40 backdrop-blur-md flex flex-col items-center justify-center text-white mb-3 group-hover:border-ibiza-red group-hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all duration-500">
                    <Star className="w-6 h-6 text-gray-400 group-hover:text-ibiza-red mb-1 transition-colors" />
                    <span className="font-display font-bold text-2xl">4.9</span>
                  </div>
                  <span className="text-sm text-gray-400 font-medium">Rating</span>
                </div>
              </div>

            </div>

            {/* Service Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {servicesList.map((service, index) => (
                <div
                  key={service.id}
                  className={`group bg-ibiza-black/60 backdrop-blur-lg border border-white/5 rounded-2xl p-6 hover:border-ibiza-red/30 hover:bg-ibiza-black/80 transition-all duration-500 flex flex-col justify-between opacity-0 animate-slide-up ${isVisible ? '' : ''}`}
                  style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-display font-bold text-white group-hover:text-white transition-colors">
                        {service.title}
                      </h3>
                      <service.Icon className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                    </div>

                    <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm mb-6">
                      <span className="text-ibiza-red font-semibold">
                        {service.price}
                      </span>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{service.time}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-[10px] font-semibold tracking-widest text-gray-500 mb-3 uppercase">
                        Incluye:
                      </p>
                      <ul className="flex flex-wrap gap-x-4 gap-y-2">
                        {service.includes.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-ibiza-red" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-auto">
                    <Button
                      onClick={() => goToAppointment(service.id)}
                      className="w-full bg-ibiza-black border border-ibiza-red/50 text-white hover:bg-ibiza-red hover:border-ibiza-red shadow-[0_0_15px_rgba(255,0,0,0.15)] hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all h-11 text-sm rounded-xl font-semibold"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Cita
                    </Button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>


        {/* Below modernization: Kept the rest of the existing sections */}

        {/* Team Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 mb-16 border border-gray-200 shadow-sm">
          <h3
            className={`font-display font-bold text-2xl text-gray-900 mb-8 transition-all duration-600 ${isVisible ? 'opacity-100' : 'opacity-0'
              }`}
          >
            Quién va a atender tu moto
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {mechanics.map((mechanic, index) => (
              <div
                key={mechanic.name}
                className={`flex items-center gap-4 opacity-0 animate-slide-up ${isVisible ? '' : ''
                  }`}
                style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="w-16 h-16 bg-gradient-ibiza rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="!text-white font-display font-bold text-2xl">
                    {mechanic.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold text-gray-900">{mechanic.name}</p>
                  <p className="text-sm text-gray-500">{mechanic.role}</p>
                  <p className="text-xs text-ibiza-red mt-1">
                    {mechanic.exp} · {mechanic.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div id="appointment-form" className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div
            className={`bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-gray-900 opacity-0 animate-slide-up ${isVisible ? '' : ''
              }`}
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            <h3 className="font-display font-bold text-2xl mb-6">Ven directo al taller</h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-ibiza-gold" />
                </div>
                <div>
                  <p className="font-semibold">Sede Principal</p>
                  <p className="text-gray-600 text-sm">Cra 7 #25-41 Parque Lago Uribe, Pereira</p>
                  <p className="text-gray-500 text-xs">Risaralda · Eje Cafetero</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-ibiza-gold" />
                </div>
                <div>
                  <p className="font-semibold">Horario de atención</p>
                  <p className="text-gray-600 text-sm">Lunes a Sábado: 8:00 AM - 6:00 PM</p>
                  <p className="text-gray-500 text-xs">Domingos: Solo emergencias</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-ibiza-gold" />
                </div>
                <div>
                  <p className="font-semibold">Llámanos</p>
                  <p className="text-gray-600 text-sm">(+57) 305 288 4546</p>
                  <p className="text-gray-500 text-xs">WhatsApp disponible</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/573052884546?text=Hola, quiero agendar una cita para el taller"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-ibiza-red hover:bg-ibiza-gold hover:text-white text-white font-display font-semibold rounded-full py-6">
                <Phone className="w-5 h-5 mr-2" />
                Escribir por WhatsApp
              </Button>
            </a>
          </div>

          {/* Quick Appointment CTA */}
          <div
            className={`bg-gradient-to-br from-ibiza-red to-ibiza-gold rounded-3xl p-8 !text-white opacity-0 animate-slide-up flex flex-col justify-between`}
            style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
          >
            <div>
              <h3 className="font-display font-bold text-2xl mb-2">Agenda tu cita online</h3>
              <p className="!text-white/80 mb-8">
                Elige el servicio, la fecha y la hora que mejor te quede. Sin llamadas, sin esperas. Confirmamos en menos de 30 minutos.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { id: 'mantenimiento', Icon: Wrench, label: 'Mantenimiento preventivo' },
                  { id: 'revision', Icon: CheckCircle2, label: 'Revisión general' },
                  { id: 'frenos', Icon: Star, label: 'Frenos y suspensión' },
                  { id: 'motor', Icon: Cpu, label: 'Reparación de motor' },
                ].map(({ id, Icon, label }) => (
                  <Button
                    key={id}
                    onClick={() => goToAppointment(id)}
                    variant="secondary"
                    className="w-full bg-ibiza-black/20 hover:bg-ibiza-black/40 !text-white border-0 rounded-xl py-5 justify-start transition-all"
                  >
                    <Icon className="w-5 h-5 mr-3 shrink-0" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <Button
              onClick={() => navigate('/citas')}
              className="w-full bg-ibiza-black text-white hover:bg-ibiza-black/80 font-display font-bold rounded-xl h-12"
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

