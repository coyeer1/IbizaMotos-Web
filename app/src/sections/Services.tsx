import { useState } from 'react';
import { Wrench, Calendar, Phone, MapPin, CheckCircle2, Clock, Star, Users, Award, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getWhatsAppUrl } from '@/lib/config';

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
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    motorcycle: '',
    date: '',
    details: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp message based on the form data
    const message = `Hola, quiero agendar una cita para el taller.
Servicio: ${selectedService}
Nombre: ${formData.name}
Teléfono: ${formData.phone}
Moto: ${formData.motorcycle || 'No especificada'}
Día preferido: ${formData.date || 'No especificado'}`;

    // Open WhatsApp with pre-filled message
    window.open(getWhatsAppUrl(message), '_blank');

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setShowForm(false);
      setFormData({ name: '', phone: '', motorcycle: '', date: '', details: '' });
    }, 2500);
  };

  const openForm = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setShowForm(true);
    // Scroll to form if needed
    document.getElementById('appointment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="servicios" className="py-24 bg-ibiza-black relative" ref={ref}>
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
                    <Button variant="outline" className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white hover:border-white/20 transition-all h-11 text-sm rounded-xl">
                      Ver Detalles
                    </Button>
                    <Button
                      onClick={() => openForm(service.title)}
                      className="flex-1 bg-ibiza-black border border-ibiza-red/50 text-white hover:bg-ibiza-red hover:border-ibiza-red shadow-[0_0_15px_rgba(255,0,0,0.15)] hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all h-11 text-sm rounded-xl font-semibold"
                    >
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
        <div className="bg-ibiza-gray-100 rounded-3xl p-8 md:p-12 mb-16 border border-white/5">
          <h3
            className={`font-display font-bold text-2xl text-white mb-8 transition-all duration-600 ${isVisible ? 'opacity-100' : 'opacity-0'
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
                  <p className="font-display font-bold text-white">{mechanic.name}</p>
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
            className={`bg-ibiza-gray-100 rounded-3xl p-8 border border-white/5 !text-white opacity-0 animate-slide-up ${isVisible ? '' : ''
              }`}
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            <h3 className="font-display font-bold text-2xl mb-6">Ven directo al taller</h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-ibiza-black/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-ibiza-gold" />
                </div>
                <div>
                  <p className="font-semibold">Taller Principal</p>
                  <p className="!text-white/70 text-sm">Carrera 23 # 23-45, Armenia</p>
                  <p className="!text-white/50 text-xs">Entrada por la calle del parque</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-ibiza-black/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-ibiza-gold" />
                </div>
                <div>
                  <p className="font-semibold">Horario de atención</p>
                  <p className="!text-white/70 text-sm">Lunes a Sábado: 8:00 AM - 6:00 PM</p>
                  <p className="!text-white/50 text-xs">Domingos: Solo emergencias</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-ibiza-black/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-ibiza-gold" />
                </div>
                <div>
                  <p className="font-semibold">Llámanos</p>
                  <p className="!text-white/70 text-sm">(+57) 321 456 7890</p>
                  <p className="!text-white/50 text-xs">WhatsApp disponible</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/573214567890?text=Hola, quiero agendar una cita para el taller"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-ibiza-red hover:bg-ibiza-gold hover:text-white !text-white font-display font-semibold rounded-full py-6">
                <Phone className="w-5 h-5 mr-2" />
                Escribir por WhatsApp
              </Button>
            </a>
          </div>

          {/* Quick Appointment */}
          <div
            className={`bg-gradient-to-br from-ibiza-red to-ibiza-gold rounded-3xl p-8 !text-white opacity-0 animate-slide-up ${isVisible ? '' : ''
              }`}
            style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
          >
            <h3 className="font-display font-bold text-2xl mb-2">Agenda tu cita</h3>
            <p className="!text-white/80 mb-6">
              Dinos qué necesitas y te confirmamos la hora. Sin compromiso.
            </p>

            {!showForm ? (
              <div className="space-y-3">
                <Button
                  onClick={() => openForm('Mantenimiento')}
                  variant="secondary"
                  className="w-full bg-ibiza-black/20 hover:bg-ibiza-black/30 !text-white border-0 rounded-xl py-5 justify-start"
                >
                  <Wrench className="w-5 h-5 mr-3" />
                  Necesito mantenimiento
                </Button>
                <Button
                  onClick={() => openForm('Revisión')}
                  variant="secondary"
                  className="w-full bg-ibiza-black/20 hover:bg-ibiza-black/30 !text-white border-0 rounded-xl py-5 justify-start"
                >
                  <CheckCircle2 className="w-5 h-5 mr-3" />
                  Quiero una revisión
                </Button>
                <Button
                  onClick={() => openForm('Reparación')}
                  variant="secondary"
                  className="w-full bg-ibiza-black/20 hover:bg-ibiza-black/30 !text-white border-0 rounded-xl py-5 justify-start"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Tengo un problema
                </Button>
              </div>
            ) : isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-ibiza-black/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 !text-white" />
                </div>
                <h4 className="font-display font-bold text-xl mb-2">¡Listo!</h4>
                <p className="!text-white/80">
                  Te llamamos en menos de 30 min para confirmar tu cita.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="!text-white/80 text-sm">Servicio</Label>
                  <Input
                    value={selectedService}
                    readOnly
                    className="bg-ibiza-black/20 border-0 !text-white placeholder:!text-white/50 mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="!text-white/80 text-sm">Tu nombre</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Carlos"
                      className="bg-ibiza-black/20 border-0 !text-white placeholder:!text-white/50 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="!text-white/80 text-sm">Teléfono</Label>
                    <Input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="300 123 4567"
                      className="bg-ibiza-black/20 border-0 !text-white placeholder:!text-white/50 mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="!text-white/80 text-sm">Tu moto</Label>
                  <Input
                    value={formData.motorcycle}
                    onChange={(e) => setFormData({ ...formData, motorcycle: e.target.value })}
                    placeholder="Ej: Vento Tornado 250, 2022"
                    className="bg-ibiza-black/20 border-0 !text-white placeholder:!text-white/50 mt-1"
                  />
                </div>
                <div>
                  <Label className="!text-white/80 text-sm">¿Qué día prefieres?</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-ibiza-black/20 border-0 !text-white placeholder:!text-white/50 mt-1"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-ibiza-black/20 hover:bg-ibiza-black/30 !text-white border-0 rounded-full"
                  >
                    Volver
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-ibiza-black text-ibiza-red hover:bg-ibiza-black hover:!text-white font-semibold rounded-full"
                  >
                    Solicitar cita
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

