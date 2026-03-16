import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Calendar, Clock,
  Wrench, ShieldAlert, Cpu, Search, User, Phone, Mail,
  Bike, MessageSquare, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { buildGoogleCalendarUrl, notifyAppsScript } from '@/lib/googleCalendar';

// ─── Servicios disponibles ────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 'mantenimiento',
    label: 'Mantenimiento Preventivo',
    desc: 'Cambio de aceite, filtros, ajuste de válvulas y revisión de 15 puntos.',
    price: 'Desde $85.000',
    duration: '1–2 horas',
    Icon: Wrench,
    color: 'from-blue-600 to-blue-800',
  },
  {
    id: 'revision',
    label: 'Revisión General',
    desc: 'Diagnóstico completo: motor, eléctrica, frenos y presupuesto detallado.',
    price: '$35.000',
    duration: '30–45 min',
    Icon: Search,
    color: 'from-emerald-600 to-emerald-800',
  },
  {
    id: 'frenos',
    label: 'Frenos y Suspensión',
    desc: 'Cambio de pastillas, rectificación de discos y reparación de horquillas.',
    price: 'Desde $120.000',
    duration: '2–3 horas',
    Icon: ShieldAlert,
    color: 'from-amber-600 to-amber-800',
  },
  {
    id: 'motor',
    label: 'Reparación de Motor',
    desc: 'Desde ajustes menores hasta reconstrucción completa. Trabajo garantizado.',
    price: 'Cotización gratis',
    duration: 'Según diagnóstico',
    Icon: Cpu,
    color: 'from-ibiza-red to-red-800',
  },
];

// ─── Slots de tiempo disponibles ─────────────────────────────────────────────
const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface FormData {
  name: string;
  phone: string;
  email: string;
  motorcycle: string;
  notes: string;
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────
function MiniCalendar({
  selected,
  onSelect,
}: {
  selected: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const days = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const last = new Date(viewYear, viewMonth + 1, 0);
    const startOffset = first.getDay(); // 0=Sun
    const cells: (Date | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= last.getDate(); d++) {
      cells.push(new Date(viewYear, viewMonth, d));
    }
    return cells;
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isDisabled = (d: Date) => {
    if (d < today) return true;
    if (d.getDay() === 0) return true; // domingos cerrado
    // No más de 30 días hacia adelante
    const max = new Date(today);
    max.setDate(max.getDate() + 30);
    return d > max;
  };

  const isSel = (d: Date) => selected?.toDateString() === d.toDateString();
  const isToday = (d: Date) => d.toDateString() === today.toDateString();

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-display font-bold text-white text-sm">
          {MONTHS_ES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_ES.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-white/25 tracking-wider py-1">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const disabled = isDisabled(day);
          const sel = isSel(day);
          const tod = isToday(day);
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => onSelect(day)}
              className={`
                aspect-square flex items-center justify-center text-xs font-semibold rounded-lg transition-all duration-200
                ${disabled ? 'text-white/15 cursor-not-allowed' : 'hover:bg-white/[0.08] cursor-pointer'}
                ${sel ? 'bg-ibiza-red text-white shadow-[0_0_12px_rgba(227,25,55,0.4)] hover:bg-ibiza-red' : ''}
                ${tod && !sel ? 'text-ibiza-red font-black border border-ibiza-red/30' : ''}
                ${!sel && !disabled ? 'text-white/70' : ''}
              `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-white/20 text-center mt-3">
        Domingos cerrado · Máx. 30 días de anticipación
      </p>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function AppointmentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string>(
    searchParams.get('servicio') || ''
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [form, setForm] = useState<FormData>({ name: '', phone: '', email: '', motorcycle: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { n: 1, label: 'Servicio' },
    { n: 2, label: 'Fecha y hora' },
    { n: 3, label: 'Tus datos' },
  ];

  const formatDate = (d: Date) =>
    `${DAYS_ES[d.getDay()]} ${d.getDate()} de ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;

  const formatDateISO = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !form.name || !form.phone) return;
    setSubmitting(true);
    setError('');

    const apptParams = {
      service:    selectedService,
      appt_date:  formatDateISO(selectedDate),
      appt_time:  selectedTime,
      name:       form.name.trim(),
      phone:      form.phone.trim(),
      email:      form.email.trim() || undefined,
      motorcycle: form.motorcycle.trim() || undefined,
      notes:      form.notes.trim() || undefined,
    };

    const { error: err } = await supabase.from('workshop_appointments').insert({
      name:       apptParams.name,
      phone:      apptParams.phone,
      email:      apptParams.email ?? null,
      motorcycle: apptParams.motorcycle ?? null,
      service:    apptParams.service,
      appt_date:  apptParams.appt_date,
      appt_time:  apptParams.appt_time,
      notes:      apptParams.notes ?? null,
    });

    if (err) {
      setSubmitting(false);
      setError('Hubo un problema al guardar tu cita. Intenta de nuevo o escríbenos por WhatsApp.');
      return;
    }

    // Notificar al Google Calendar de la empresa (fire-and-forget)
    await notifyAppsScript(apptParams);

    setSubmitting(false);
    setSubmitted(true);
  };

  const serviceInfo = SERVICES.find(s => s.id === selectedService);

  // URL para que el CLIENTE agregue el evento a su Google Calendar
  const clientCalendarUrl = selectedDate ? buildGoogleCalendarUrl({
    service:    selectedService,
    appt_date:  formatDateISO(selectedDate),
    appt_time:  selectedTime,
    name:       form.name,
    phone:      form.phone,
    email:      form.email || undefined,
    motorcycle: form.motorcycle || undefined,
    notes:      form.notes || undefined,
  }) : '';

  // ── Pantalla de éxito ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          {/* Ícono éxito */}
          <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="font-display font-black text-3xl text-white mb-3">¡Cita agendada!</h1>
          <p className="text-gray-400 mb-8">
            Recibimos tu solicitud para el{' '}
            <span className="text-white font-semibold">{selectedDate ? formatDate(selectedDate) : ''}</span>
            {' '}a las{' '}
            <span className="text-white font-semibold">{selectedTime}</span>.
            <br /><br />
            Te contactaremos al <span className="text-ibiza-red font-semibold">{form.phone}</span> para confirmar.
          </p>

          {/* Resumen */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-left mb-6 space-y-2">
            {[
              { label: 'Servicio', value: serviceInfo?.label || selectedService },
              { label: 'Fecha',    value: selectedDate ? formatDate(selectedDate) : '' },
              { label: 'Hora',     value: selectedTime },
              { label: 'Cliente',  value: form.name },
              ...(form.motorcycle ? [{ label: 'Moto', value: form.motorcycle }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-white/40">{label}</span>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* ── Botón Google Calendar para el CLIENTE ── */}
          <a
            href={clientCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-white hover:bg-gray-100 text-gray-800 font-bold px-6 py-3.5 rounded-2xl mb-3 transition-colors text-sm"
          >
            {/* Google "G" logo */}
            <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Agregar a mi Google Calendar
          </a>

          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex-1 border-white/10 text-white hover:bg-white/[0.06] rounded-xl"
            >
              Volver al inicio
            </Button>
            <Button
              onClick={() => {
                const msg = `Hola, acabo de agendar una cita:\nServicio: ${serviceInfo?.label}\nFecha: ${selectedDate ? formatDate(selectedDate) : ''} a las ${selectedTime}\nNombre: ${form.name}`;
                window.open(`https://wa.me/573214567890?text=${encodeURIComponent(msg)}`, '_blank');
              }}
              className="flex-1 bg-[#25D366] hover:bg-[#20b858] text-white rounded-xl text-sm"
            >
              Confirmar por WhatsApp
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] pt-20 pb-16">

      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-10">
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {step > 1 ? 'Paso anterior' : 'Volver'}
        </button>

        <h1 className="font-display font-black text-3xl md:text-4xl text-white mb-2">
          Agenda tu cita <span className="text-ibiza-red">al taller</span>
        </h1>
        <p className="text-gray-500">Sin filas, sin esperar. Confirmaremos tu hora en menos de 30 minutos.</p>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mt-8">
          {steps.map(({ n, label }) => (
            <div key={n} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 transition-all ${step === n ? 'opacity-100' : step > n ? 'opacity-70' : 'opacity-30'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > n ? 'bg-emerald-500 text-white' :
                  step === n ? 'bg-ibiza-red text-white' :
                  'bg-white/[0.08] text-white/40'
                }`}>
                  {step > n ? <CheckCircle2 className="w-4 h-4" /> : n}
                </div>
                <span className={`text-sm font-semibold hidden sm:block ${step === n ? 'text-white' : 'text-white/40'}`}>{label}</span>
              </div>
              {n < steps.length && <div className={`flex-1 h-px w-8 ${step > n ? 'bg-emerald-500/50' : 'bg-white/[0.08]'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">

          {/* ── PASO 1: Servicio ─────────────────────────────────────────── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {SERVICES.map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`relative text-left rounded-2xl border p-5 transition-all duration-300 ${
                      selectedService === service.id
                        ? 'border-ibiza-red bg-ibiza-red/10 shadow-[0_0_30px_rgba(227,25,55,0.15)]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                    }`}
                  >
                    {selectedService === service.id && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-ibiza-red rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-3`}>
                      <service.Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-display font-bold text-white mb-1">{service.label}</h3>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">{service.desc}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-ibiza-red font-bold">{service.price}</span>
                      <span className="text-white/25">·</span>
                      <span className="text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" />{service.duration}</span>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                disabled={!selectedService}
                onClick={() => setStep(2)}
                className="w-full bg-ibiza-red hover:bg-ibiza-red/90 text-white font-display font-bold h-14 rounded-2xl text-base group disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </motion.div>
          )}

          {/* ── PASO 2: Fecha y hora ─────────────────────────────────────── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Calendar */}
                <div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Selecciona el día
                  </p>
                  <MiniCalendar selected={selectedDate} onSelect={(d) => { setSelectedDate(d); setSelectedTime(''); }} />
                </div>

                {/* Time slots */}
                <div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Hora disponible
                  </p>
                  {!selectedDate ? (
                    <div className="h-[200px] flex items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                      <p className="text-white/20 text-sm text-center">Elige primero<br />una fecha</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                            selectedTime === slot
                              ? 'bg-ibiza-red text-white shadow-[0_0_12px_rgba(227,25,55,0.3)]'
                              : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Resumen selección */}
                  {selectedDate && selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 bg-ibiza-red/10 border border-ibiza-red/20 rounded-xl p-4"
                    >
                      <p className="text-[10px] font-bold text-ibiza-red/70 uppercase tracking-widest mb-1">Tu cita</p>
                      <p className="text-white font-display font-bold">{formatDate(selectedDate)}</p>
                      <p className="text-ibiza-red font-bold text-lg">{selectedTime}</p>
                    </motion.div>
                  )}
                </div>
              </div>

              <Button
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(3)}
                className="w-full bg-ibiza-red hover:bg-ibiza-red/90 text-white font-display font-bold h-14 rounded-2xl text-base group disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </motion.div>
          )}

          {/* ── PASO 3: Datos personales ─────────────────────────────────── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>

              {/* Resumen superior */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 mb-6 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-ibiza-red" />
                  <span className="text-white font-semibold">{serviceInfo?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-ibiza-red" />
                  <span className="text-white/70">{selectedDate ? formatDate(selectedDate) : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ibiza-red" />
                  <span className="text-white/70">{selectedTime}</span>
                </div>
              </div>

              {/* Formulario */}
              <div className="space-y-4 mb-8">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
                      <User className="w-3 h-3 inline mr-1" />Nombre *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Tu nombre completo"
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/20 text-sm outline-none focus:border-ibiza-red transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
                      <Phone className="w-3 h-3 inline mr-1" />Teléfono *
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="300 123 4567"
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/20 text-sm outline-none focus:border-ibiza-red transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
                    <Mail className="w-3 h-3 inline mr-1" />Correo (opcional)
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="tu@correo.com"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/20 text-sm outline-none focus:border-ibiza-red transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
                    <Bike className="w-3 h-3 inline mr-1" />Tu moto (opcional)
                  </label>
                  <input
                    value={form.motorcycle}
                    onChange={e => setForm(f => ({ ...f, motorcycle: e.target.value }))}
                    placeholder="Ej: Suzuki GSX-R150 2026"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/20 text-sm outline-none focus:border-ibiza-red transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
                    <MessageSquare className="w-3 h-3 inline mr-1" />¿Algo más que debamos saber?
                  </label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Describe el problema o cuéntanos qué le pasa a tu moto..."
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/20 text-sm outline-none focus:border-ibiza-red transition-colors resize-none"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <Button
                disabled={!form.name || !form.phone || submitting}
                onClick={handleSubmit}
                className="w-full bg-ibiza-red hover:bg-ibiza-red/90 text-white font-display font-bold h-14 rounded-2xl text-base disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Guardando cita...</span>
                ) : (
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" />Confirmar cita</span>
                )}
              </Button>

              <p className="text-[11px] text-white/20 text-center mt-4">
                Al confirmar, aceptas que te contactemos al número indicado para verificar la cita.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
