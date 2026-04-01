import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Calendar, Clock,
  Wrench, ShieldAlert, Cpu, Search, User, Phone, Mail,
  Bike, MessageSquare, ChevronLeft, ChevronRight, Loader2, MapPin, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { buildGoogleCalendarUrl, notifyAppsScript, type CalendarEventParams } from '@/lib/googleCalendar';
import { branches } from '@/data/motorcycles';

// ─── WhatsApp admin notification via CallMeBot ────────────────────────────────
async function notifyWhatsAppAdmin(p: CalendarEventParams): Promise<void> {
  const phone  = import.meta.env.VITE_CALLMEBOT_PHONE  as string | undefined;
  const apikey = import.meta.env.VITE_CALLMEBOT_APIKEY as string | undefined;
  if (!phone || !apikey) return;
  const SERVICE_SHORT: Record<string, string> = {
    mantenimiento: 'Mantenimiento', revision: 'Revisión general',
    frenos: 'Frenos / Suspensión', motor: 'Reparación motor',
  };
  const lines = [
    '🏍️ *Nueva cita – Ibiza Motos*',
    `📋 ${SERVICE_SHORT[p.service] ?? p.service}`,
    `📅 ${p.appt_date}  ⏰ ${p.appt_time}`,
    `👤 ${p.name}  📞 ${p.phone}`,
    p.motorcycle  ? `🏍️ ${p.motorcycle}`  : null,
    p.branch_name ? `📍 ${p.branch_name}` : null,
    p.notes       ? `📝 ${p.notes}`       : null,
  ].filter(Boolean).join('\n');
  try {
    await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(lines)}&apikey=${apikey}`,
      { mode: 'no-cors' },
    );
  } catch { console.warn('[Ibiza Motos] Notificación WhatsApp falló silenciosamente.'); }
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 'mantenimiento',
    label: 'Mantenimiento Preventivo',
    code: 'SRV-01',
    desc: 'Cambio de aceite, filtros, ajuste de válvulas y revisión de 15 puntos.',
    price: 'Desde $85.000',
    duration: '1–2 horas',
    Icon: Wrench,
    accent: '#2563eb',
    bg: 'from-blue-600 to-blue-800',
    image: '/services/mantenimiento.jpg',
  },
  {
    id: 'revision',
    label: 'Revisión General',
    code: 'SRV-02',
    desc: 'Diagnóstico completo: motor, eléctrica, frenos y presupuesto detallado.',
    price: '$35.000',
    duration: '30–45 min',
    Icon: Search,
    accent: '#059669',
    bg: 'from-emerald-600 to-emerald-800',
    image: '/services/revision.jpg',
  },
  {
    id: 'frenos',
    label: 'Frenos y Suspensión',
    code: 'SRV-03',
    desc: 'Cambio de pastillas, rectificación de discos y reparación de horquillas.',
    price: 'Desde $120.000',
    duration: '2–3 horas',
    Icon: ShieldAlert,
    accent: '#d97706',
    bg: 'from-amber-600 to-amber-800',
    image: '/services/frenos.jpg',
  },
  {
    id: 'motor',
    label: 'Reparación de Motor',
    code: 'SRV-04',
    desc: 'Desde ajustes menores hasta reconstrucción completa. Trabajo garantizado.',
    price: 'Cotización gratis',
    duration: 'Según diagnóstico',
    Icon: Cpu,
    accent: '#d7263d',
    bg: 'from-ibiza-red to-red-800',
    image: '/services/motor.jpg',
  },
];

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

const DAYS_ES    = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

interface FormData {
  name: string; phone: string; email: string;
  motorcycle: string; notes: string; branch_id: string;
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────
function MiniCalendar({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const days = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const last  = new Date(viewYear, viewMonth + 1, 0);
    const cells: (Date | null)[] = Array(first.getDay()).fill(null);
    for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(viewYear, viewMonth, d));
    return cells;
  }, [viewYear, viewMonth]);

  const prevMonth = () => viewMonth === 0 ? (setViewMonth(11), setViewYear(y => y - 1)) : setViewMonth(m => m - 1);
  const nextMonth = () => viewMonth === 11 ? (setViewMonth(0), setViewYear(y => y + 1)) : setViewMonth(m => m + 1);

  const isDisabled = (d: Date) => {
    if (d < today) return true;
    if (d.getDay() === 0) return true;
    const max = new Date(today); max.setDate(max.getDate() + 30);
    return d > max;
  };

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-4 select-none">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-display font-bold text-white text-sm">{MONTHS_ES[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS_ES.map(d => <div key={d} className="text-center text-[10px] font-bold text-white/25 tracking-wider py-1">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const disabled = isDisabled(day);
          const sel  = selected?.toDateString() === day.toDateString();
          const tod  = day.toDateString() === today.toDateString();
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => onSelect(day)}
              className={`
                aspect-square flex items-center justify-center text-xs font-semibold rounded-lg transition-all duration-150
                ${disabled ? 'text-white/15 cursor-not-allowed' : 'cursor-pointer'}
                ${sel ? 'bg-ibiza-red text-white shadow-[0_2px_12px_rgba(215,38,61,0.5)]' : ''}
                ${tod && !sel ? 'text-ibiza-red font-black ring-1 ring-ibiza-red/40' : ''}
                ${!sel && !disabled ? 'text-white/60 hover:bg-white/[0.08] hover:text-white' : ''}
              `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-white/20 text-center mt-3">Domingos cerrado · Máx. 30 días</p>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ step }: { step: number }) {
  const steps = [{ n: 1, label: 'Servicio' }, { n: 2, label: 'Fecha y hora' }, { n: 3, label: 'Tus datos' }];
  return (
    <div className="flex items-center gap-0 mt-8">
      {steps.map(({ n, label }, i) => (
        <div key={n} className="flex items-center" style={{ flex: n < steps.length ? '1' : 'none' }}>
          {/* Circle */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-400 shrink-0"
              style={{
                background: step > n ? '#10b981' : step === n ? '#d7263d' : 'rgba(255,255,255,0.06)',
                color: step >= n ? 'white' : 'rgba(255,255,255,0.3)',
                boxShadow: step === n ? '0 0 0 4px rgba(215,38,61,0.2)' : step > n ? '0 0 0 4px rgba(16,185,129,0.15)' : 'none',
              }}
            >
              {step > n ? <Check className="w-4 h-4" /> : n}
            </div>
            <span className={`text-[11px] font-semibold whitespace-nowrap transition-colors ${step === n ? 'text-white' : step > n ? 'text-emerald-400' : 'text-white/25'}`}>
              {label}
            </span>
          </div>
          {/* Connector */}
          {i < steps.length - 1 && (
            <div className="flex-1 h-[2px] mx-3 mb-5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: step > n ? '100%' : '0%', background: '#10b981' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
        <Icon className="w-3 h-3" />{label}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 text-sm outline-none focus:border-ibiza-red/60 focus:bg-white/[0.06] transition-all";

// ─── Componente principal ─────────────────────────────────────────────────────
export default function AppointmentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep]                     = useState(1);
  const [selectedService, setSelectedService] = useState<string>(searchParams.get('servicio') || '');
  const [selectedDate, setSelectedDate]     = useState<Date | null>(null);
  const [selectedTime, setSelectedTime]     = useState('');
  const [form, setForm]                     = useState<FormData>({ name: '', phone: '', email: '', motorcycle: '', notes: '', branch_id: '' });
  const [submitting, setSubmitting]         = useState(false);
  const [submitted, setSubmitted]           = useState(false);
  const [error, setError]                   = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const formatDate    = (d: Date) => `${DAYS_ES[d.getDay()]} ${d.getDate()} de ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
  const formatDateISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !form.name || !form.phone || !form.branch_id) return;
    setSubmitting(true); setError('');
    const selectedBranch = branches.find(b => b.id === form.branch_id);
    const apptParams: CalendarEventParams = {
      service: selectedService, appt_date: formatDateISO(selectedDate), appt_time: selectedTime,
      name: form.name.trim(), phone: form.phone.trim(),
      email: form.email.trim() || undefined, motorcycle: form.motorcycle.trim() || undefined,
      notes: form.notes.trim() || undefined,
      branch_name: selectedBranch?.name, branch_address: selectedBranch?.address,
    };
    const { error: err } = await supabase.from('workshop_appointments').insert({
      name: apptParams.name, phone: apptParams.phone, email: apptParams.email ?? null,
      motorcycle: apptParams.motorcycle ?? null, service: apptParams.service,
      appt_date: apptParams.appt_date, appt_time: apptParams.appt_time,
      notes: apptParams.notes ?? null, branch_name: apptParams.branch_name ?? null,
      branch_address: apptParams.branch_address ?? null,
    });
    if (err) { setSubmitting(false); setError('Hubo un problema al guardar tu cita. Intenta de nuevo o escríbenos por WhatsApp.'); return; }
    await Promise.all([notifyAppsScript(apptParams), notifyWhatsAppAdmin(apptParams)]);
    setSubmitting(false); setSubmitted(true);
  };

  const serviceInfo = SERVICES.find(s => s.id === selectedService);

  const clientCalendarUrl = selectedDate && selectedTime ? buildGoogleCalendarUrl({
    service: selectedService, appt_date: formatDateISO(selectedDate), appt_time: selectedTime,
    name: form.name, phone: form.phone, email: form.email || undefined,
    motorcycle: form.motorcycle || undefined, notes: form.notes || undefined,
  }) : '#';

  // ── Pantalla de éxito ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4 pt-20 pb-10">
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
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
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-left mb-6 space-y-2">
            {[
              { label: 'Servicio',  value: serviceInfo?.label || selectedService },
              { label: 'Fecha',     value: selectedDate ? formatDate(selectedDate) : '' },
              { label: 'Hora',      value: selectedTime },
              { label: 'Sucursal',  value: branches.find(b => b.id === form.branch_id)?.name || '' },
              { label: 'Cliente',   value: form.name },
              ...(form.motorcycle ? [{ label: 'Moto', value: form.motorcycle }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-white/40">{label}</span>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
          <a
            href={clientCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-white hover:bg-gray-100 text-gray-800 font-bold px-6 py-3.5 rounded-2xl mb-3 transition-colors text-sm"
          >
            <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Agregar a mi Google Calendar
          </a>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/')} variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/[0.06] rounded-xl">
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

  // ── Resumen chip (pasos 2 y 3) ────────────────────────────────────────────
  const SummaryChips = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {serviceInfo && (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: `${serviceInfo.accent}20`, color: serviceInfo.accent, border: `1px solid ${serviceInfo.accent}40` }}>
          <serviceInfo.Icon className="w-3 h-3" />
          {serviceInfo.label}
        </span>
      )}
      {selectedDate && (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/[0.06] text-white/60 border border-white/[0.08]">
          <Calendar className="w-3 h-3" />
          {formatDate(selectedDate)}
        </span>
      )}
      {selectedTime && (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/[0.06] text-white/60 border border-white/[0.08]">
          <Clock className="w-3 h-3" />
          {selectedTime}
        </span>
      )}
    </div>
  );

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
        <p className="text-gray-500 text-sm">Sin filas, sin esperar. Confirmamos en menos de 30 minutos.</p>

        <StepBar step={step} />
      </div>

      {/* Step content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">

          {/* ── PASO 1: Servicio ──────────────────────────────────────────── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {SERVICES.map(service => {
                  const sel = selectedService === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className="relative text-left rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none"
                      style={{
                        border: `1.5px solid ${sel ? service.accent : 'rgba(255,255,255,0.07)'}`,
                        boxShadow: sel ? `0 0 36px ${service.accent}28` : 'none',
                        minHeight: 180,
                      }}
                    >
                      {/* Background image */}
                      <img
                        src={service.image}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                        style={{ transform: sel ? 'scale(1.06)' : 'scale(1)', opacity: sel ? 0.28 : 0.14 }}
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                      {/* Check badge */}
                      {sel && (
                        <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full flex items-center justify-center z-10"
                          style={{ background: service.accent }}>
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="relative z-10 p-5">
                        {/* Code + icon row */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${service.bg} flex items-center justify-center shadow-lg`}>
                            <service.Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: `${service.accent}cc` }}>
                            {service.code}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-white mb-1.5 text-base">{service.label}</h3>
                        <p className="text-xs text-gray-400 mb-4 leading-relaxed">{service.desc}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-bold" style={{ color: service.accent }}>{service.price}</span>
                          <span className="text-white/20">·</span>
                          <span className="text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" />{service.duration}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <Button
                disabled={!selectedService}
                onClick={() => setStep(2)}
                className="w-full bg-ibiza-red hover:bg-ibiza-red/90 text-white font-display font-bold h-14 rounded-2xl text-base group disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </motion.div>
          )}

          {/* ── PASO 2: Fecha y hora ──────────────────────────────────────── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
              <SummaryChips />
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
                    <div className="h-[200px] flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] gap-2">
                      <Calendar className="w-8 h-8 text-white/10" />
                      <p className="text-white/25 text-sm text-center">Elige primero<br />una fecha</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className="py-3 rounded-xl text-xs font-bold transition-all duration-150 focus:outline-none"
                          style={{
                            background: selectedTime === slot ? '#d7263d' : 'rgba(255,255,255,0.04)',
                            color: selectedTime === slot ? 'white' : 'rgba(255,255,255,0.45)',
                            border: `1px solid ${selectedTime === slot ? '#d7263d' : 'rgba(255,255,255,0.06)'}`,
                            boxShadow: selectedTime === slot ? '0 2px 12px rgba(215,38,61,0.4)' : 'none',
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedDate && selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 rounded-xl p-4 border"
                      style={{ background: 'rgba(215,38,61,0.08)', borderColor: 'rgba(215,38,61,0.2)' }}
                    >
                      <p className="text-[10px] font-bold text-ibiza-red/60 uppercase tracking-widest mb-1">Tu cita quedará así</p>
                      <p className="text-white font-semibold text-sm">{formatDate(selectedDate)}</p>
                      <p className="text-ibiza-red font-bold text-xl leading-tight">{selectedTime}</p>
                    </motion.div>
                  )}
                </div>
              </div>

              <Button
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(3)}
                className="w-full bg-ibiza-red hover:bg-ibiza-red/90 text-white font-display font-bold h-14 rounded-2xl text-base group disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </motion.div>
          )}

          {/* ── PASO 3: Datos personales ──────────────────────────────────── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
              <SummaryChips />

              {/* Selector sucursal */}
              <div className="mb-6">
                <Field label="Sucursal *" icon={MapPin}>
                  <select
                    value={form.branch_id}
                    onChange={e => setForm(f => ({ ...f, branch_id: e.target.value }))}
                    className={`${inputCls} cursor-pointer`}
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="" disabled>Elige tu sucursal más cercana...</option>
                    {(() => {
                      const cities = [...new Set(branches.map(b => b.city))];
                      return cities.map(city => (
                        <optgroup key={city} label={city}>
                          {branches.filter(b => b.city === city).map(b => (
                            <option key={b.id} value={b.id}>{b.name} — {b.address}</option>
                          ))}
                        </optgroup>
                      ));
                    })()}
                  </select>
                </Field>
              </div>

              {/* Formulario */}
              <div className="space-y-4 mb-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nombre *" icon={User}>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Tu nombre completo" className={inputCls} />
                  </Field>
                  <Field label="Teléfono *" icon={Phone}>
                    <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="300 123 4567" className={inputCls} />
                  </Field>
                </div>
                <Field label="Correo (opcional)" icon={Mail}>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="tu@correo.com" className={inputCls} />
                </Field>
                <Field label="Tu moto (opcional)" icon={Bike}>
                  <input value={form.motorcycle} onChange={e => setForm(f => ({ ...f, motorcycle: e.target.value }))}
                    placeholder="Ej: Suzuki GSX-R150 2026" className={inputCls} />
                </Field>
                <Field label="¿Algo más que debamos saber?" icon={MessageSquare}>
                  <textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Describe el problema o cuéntanos qué le pasa a tu moto..."
                    className={`${inputCls} resize-none`} />
                </Field>
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer mb-5 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <input type="checkbox" checked={privacyAccepted} onChange={e => setPrivacyAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/10 accent-ibiza-red cursor-pointer shrink-0" />
                <span className="text-xs text-white/40 leading-relaxed">
                  He leído y acepto la{' '}
                  <a href="/privacidad" target="_blank" className="text-white/60 underline hover:text-white transition-colors">
                    política de tratamiento de datos personales
                  </a>
                  {' '}de Ibiza Motos (Ley 1581/2012).
                </span>
              </label>

              <Button
                disabled={!form.name || !form.phone || !form.branch_id || submitting || !privacyAccepted}
                onClick={handleSubmit}
                className="w-full bg-ibiza-red hover:bg-ibiza-red/90 text-white font-display font-bold h-14 rounded-2xl text-base disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Guardando cita...</span>
                  : <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" />Confirmar cita</span>
                }
              </Button>

              <p className="text-[11px] text-white/20 text-center mt-4">
                Al confirmar autorizas el tratamiento de tus datos según nuestra{' '}
                <a href="/privacidad" target="_blank" className="underline hover:text-white/40 transition-colors">política de privacidad</a>
                {' '}(Ley 1581/2012).
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
