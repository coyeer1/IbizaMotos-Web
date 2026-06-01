import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Calendar, Clock,
  Wrench, ShieldAlert, Cpu, Search, User, Phone, Mail,
  Bike, MessageSquare, ChevronLeft, ChevronRight, Loader2, MapPin, Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { buildGoogleCalendarUrl, notifyAppsScript, type CalendarEventParams } from '@/lib/googleCalendar';
import { branches } from '@/data/motorcycles';

// ─── WhatsApp admin notification ─────────────────────────────────────────────
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
  } catch { console.warn('[Ibiza Motos] Notificación WhatsApp falló.'); }
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 'mantenimiento', code: 'SRV-01',
    label: 'Mantenimiento Preventivo',
    desc: 'Cambio de aceite, filtros, ajuste de válvulas y revisión de 15 puntos.',
    price: 'Desde $85.000', duration: '1–2 horas',
    Icon: Wrench, image: '/services/mantenimiento.webp',
  },
  {
    id: 'revision', code: 'SRV-02',
    label: 'Revisión General',
    desc: 'Diagnóstico completo: motor, eléctrica, frenos y presupuesto detallado.',
    price: '$35.000', duration: '30–45 min',
    Icon: Search, image: '/services/revision.webp',
  },
  {
    id: 'frenos', code: 'SRV-03',
    label: 'Frenos y Suspensión',
    desc: 'Cambio de pastillas, rectificación de discos y reparación de horquillas.',
    price: 'Desde $120.000', duration: '2–3 horas',
    Icon: ShieldAlert, image: '/services/frenos.webp',
  },
  {
    id: 'motor', code: 'SRV-04',
    label: 'Reparación de Motor',
    desc: 'Desde ajustes menores hasta reconstrucción completa. Trabajo garantizado.',
    price: 'Cotización gratis', duration: 'Según diagnóstico',
    Icon: Cpu, image: '/services/motor.webp',
  },
];

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];
const DAYS_ES   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

interface FormData {
  name: string; phone: string; email: string;
  motorcycle: string; notes: string; branch_id: string;
}

// ─── MiniCalendar — light/brutalist theme ─────────────────────────────────────
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
    if (d < today || d.getDay() === 0) return true;
    const max = new Date(today); max.setDate(max.getDate() + 30);
    return d > max;
  };

  return (
    <div className="bg-white border-2 border-black p-4 select-none">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-black text-black text-sm uppercase tracking-wider">{MONTHS_ES[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {DAYS_ES.map(d => <div key={d} className="text-center text-[10px] font-black text-black/30 tracking-wider py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const disabled = isDisabled(day);
          const sel = selected?.toDateString() === day.toDateString();
          const tod = day.toDateString() === today.toDateString();
          return (
            <button key={i} disabled={disabled} onClick={() => onSelect(day)}
              className={`aspect-square flex items-center justify-center text-xs font-bold transition-all duration-150
                ${disabled ? 'text-black/20 cursor-not-allowed' : 'cursor-pointer'}
                ${sel ? 'bg-[#EE1111] text-white' : ''}
                ${tod && !sel ? 'ring-2 ring-[#EE1111] text-[#EE1111]' : ''}
                ${!sel && !disabled ? 'hover:bg-black/10 text-black/70' : ''}
              `}
            >{day.getDate()}</button>
          );
        })}
      </div>
      <p className="text-[10px] text-black/30 text-center mt-3 font-semibold uppercase tracking-wider">Domingos cerrado · Máx. 30 días</p>
    </div>
  );
}

// ─── Vertical Step Indicator ──────────────────────────────────────────────────
function VerticalStepBar({ step }: { step: number }) {
  const steps = [
    { n: 1, label: 'Servicio' },
    { n: 2, label: 'Fecha y hora' },
    { n: 3, label: 'Tus datos' },
  ];
  return (
    <div className="flex flex-col items-center shrink-0 pt-1">
      {steps.map(({ n, label }, i) => (
        <div key={n} className="flex flex-col items-center">
          {/* Circle */}
          <div
            className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-sm transition-all duration-300"
            style={{
              borderColor: step >= n ? (step > n ? '#111' : '#EE1111') : '#999',
              background:  step > n ? '#111' : step === n ? '#EE1111' : 'transparent',
              color:       step >= n ? 'white' : '#999',
              boxShadow:   step === n ? '0 0 0 4px rgba(238,17,17,0.15)' : 'none',
            }}
          >
            {step > n ? <Check className="w-4 h-4" /> : n}
          </div>
          {/* Label */}
          <span className={`text-[9px] font-black uppercase tracking-widest mt-1 text-center leading-tight max-w-[52px]
            ${step === n ? 'text-[#EE1111]' : step > n ? 'text-black/50' : 'text-black/25'}`}
          >
            {label}
          </span>
          {/* Connector */}
          {i < steps.length - 1 && (
            <div className="w-0.5 h-12 sm:h-16 bg-black/15 relative my-1.5 overflow-hidden">
              <div className="absolute inset-0 bg-black transition-all duration-500"
                style={{ transform: step > n ? 'scaleY(1)' : 'scaleY(0)', transformOrigin: 'top' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
const inputCls = "w-full px-4 py-3.5 bg-white border-2 border-black/20 focus:border-black text-black placeholder:text-black/30 text-sm outline-none transition-all font-medium";

function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[10px] font-black text-black/40 uppercase tracking-widest mb-2">
        <Icon className="w-3 h-3" />{label}
      </label>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AppointmentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep]                       = useState(1);
  const [selectedService, setSelectedService] = useState<string>(searchParams.get('servicio') || '');
  const [selectedDate, setSelectedDate]       = useState<Date | null>(null);
  const [selectedTime, setSelectedTime]       = useState('');
  const [form, setForm]                       = useState<FormData>({ name:'', phone:'', email:'', motorcycle:'', notes:'', branch_id:'' });
  const [submitting, setSubmitting]           = useState(false);
  const [submitted, setSubmitted]             = useState(false);
  const [error, setError]                     = useState('');
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
    if (err) { setSubmitting(false); setError('Hubo un problema. Intenta de nuevo o escríbenos por WhatsApp.'); return; }
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
      <div className="min-h-screen bg-[#d4d0cb] flex items-center justify-center px-4 pt-20 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
          <div className="bg-white border-2 border-black p-8 text-center">
            <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-black text-3xl text-black mb-3 uppercase">¡Cita agendada!</h1>
            <p className="text-gray-600 text-sm mb-6">
              {selectedDate ? formatDate(selectedDate) : ''} · <strong>{selectedTime}</strong><br/>
              Te contactaremos al <span className="text-[#EE1111] font-bold">{form.phone}</span>.
            </p>
            <div className="border-2 border-black/10 p-4 text-left mb-6 space-y-2">
              {[
                { label: 'Servicio',  value: serviceInfo?.label || selectedService },
                { label: 'Fecha',     value: selectedDate ? formatDate(selectedDate) : '' },
                { label: 'Hora',      value: selectedTime },
                { label: 'Sucursal',  value: branches.find(b => b.id === form.branch_id)?.name || '' },
                { label: 'Cliente',   value: form.name },
                ...(form.motorcycle ? [{ label: 'Moto', value: form.motorcycle }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="font-black text-black/40 uppercase text-[10px] tracking-wider">{label}</span>
                  <span className="text-black font-bold text-right">{value}</span>
                </div>
              ))}
            </div>
            <a href={clientCalendarUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-white border-2 border-black hover:bg-black hover:text-white text-black font-black px-6 py-3.5 mb-3 transition-colors text-sm uppercase tracking-wider">
              <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Agregar a Google Calendar
            </a>
            <div className="flex gap-3">
              <button onClick={() => navigate('/')}
                className="flex-1 border-2 border-black text-black font-black py-3 hover:bg-black hover:text-white transition-colors text-sm uppercase">
                Inicio
              </button>
              <button onClick={() => {
                const msg = `Hola, acabo de agendar una cita:\nServicio: ${serviceInfo?.label}\nFecha: ${selectedDate ? formatDate(selectedDate) : ''} a las ${selectedTime}\nNombre: ${form.name}`;
                window.open(`https://wa.me/573052884546?text=${encodeURIComponent(msg)}`, '_blank');
              }} className="flex-1 bg-[#25D366] text-white font-black py-3 text-sm uppercase border-2 border-[#25D366] hover:bg-[#1db954] transition-colors">
                WhatsApp
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Summary chips (steps 2-3) ─────────────────────────────────────────────
  const SummaryChips = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {serviceInfo && (
        <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 bg-white border-2 border-black text-black uppercase tracking-wider">
          <serviceInfo.Icon className="w-3 h-3" />{serviceInfo.code} — {serviceInfo.label}
        </span>
      )}
      {selectedDate && (
        <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 bg-white border-2 border-black/20 text-black/50 uppercase tracking-wider">
          <Calendar className="w-3 h-3" />{formatDate(selectedDate)}
        </span>
      )}
      {selectedTime && (
        <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 bg-[#EE1111] border-2 border-[#EE1111] text-white uppercase tracking-wider">
          <Clock className="w-3 h-3" />{selectedTime}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#d4d0cb] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Back */}
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-black text-black/40 hover:text-black transition-colors mt-4 mb-6 uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          {step > 1 ? 'Paso anterior' : 'Volver'}
        </button>

        {/* Big title */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-10 mb-10">
          <h1 className="font-black text-black leading-[0.88] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 9vw, 6rem)' }}>
            Agenda tu<br />cita al taller
          </h1>
          <p className="text-black/50 text-sm font-medium max-w-[180px] sm:mb-2 leading-relaxed">
            Sin filas, sin esperar. Confirmamos en menos de 30 minutos.
          </p>
        </div>

        {/* Layout: vertical stepper + content */}
        <div className="flex gap-6 sm:gap-10 items-start">
          <VerticalStepBar step={step} />

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {/* ── PASO 1: Servicio ─────────────────────────────────── */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <div className="flex flex-col gap-0 mb-6">
                    {SERVICES.map((service, i) => {
                      const sel = selectedService === service.id;
                      return (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className="relative flex overflow-hidden text-left focus:outline-none group transition-all duration-200"
                          style={{
                            borderLeft:   `2px solid ${sel ? '#EE1111' : '#111'}`,
                            borderRight:  `2px solid ${sel ? '#EE1111' : '#111'}`,
                            borderTop:    `2px solid ${sel ? '#EE1111' : '#111'}`,
                            borderBottom: i === SERVICES.length - 1 ? `2px solid ${sel ? '#EE1111' : '#111'}` : 'none',
                            background:   sel ? '#fff' : '#f0ece6',
                            marginBottom: i < SERVICES.length - 1 ? '-2px' : 0,
                          }}
                        >
                          {/* Left: text */}
                          <div className="flex-1 p-5 sm:p-6 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[10px] font-black tracking-widest uppercase"
                                style={{ color: sel ? '#EE1111' : '#999' }}>
                                {service.code}
                              </span>
                              {sel && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-white bg-[#EE1111] px-2 py-0.5 uppercase tracking-wider">
                                  <Check className="w-3 h-3" /> Seleccionado
                                </span>
                              )}
                            </div>
                            <h3 className="font-black text-black text-lg sm:text-xl leading-tight mb-2"
                              style={{ color: sel ? '#111' : '#222' }}>
                              {service.label}
                            </h3>
                            <p className="text-xs text-black/50 mb-4 leading-relaxed max-w-xs">{service.desc}</p>
                            <div className="flex items-center gap-3 text-xs font-black">
                              <span style={{ color: sel ? '#EE1111' : '#333' }}>{service.price}</span>
                              <span className="text-black/20">·</span>
                              <span className="text-black/40 flex items-center gap-1">
                                <Clock className="w-3 h-3" />{service.duration}
                              </span>
                            </div>
                          </div>

                          {/* Right: image */}
                          <div className="w-32 sm:w-44 shrink-0 overflow-hidden">
                            <img
                              src={service.image}
                              alt=""
                              aria-hidden
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover transition-all duration-500"
                              style={{
                                transform:  sel ? 'scale(1.08)' : 'scale(1)',
                                filter:     sel ? 'grayscale(0) contrast(1.05)' : 'grayscale(0.4) contrast(0.95)',
                                minHeight: '140px',
                              }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={!selectedService}
                    onClick={() => setStep(2)}
                    className="w-full bg-black text-white font-black h-14 text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-200 hover:bg-[#EE1111] disabled:bg-black/20 disabled:cursor-not-allowed border-2 border-transparent disabled:border-black/20"
                  >
                    Continuar <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* ── PASO 2: Fecha y hora ─────────────────────────────── */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <SummaryChips />
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {/* Calendar */}
                    <div>
                      <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> Selecciona el día
                      </p>
                      <MiniCalendar selected={selectedDate} onSelect={(d) => { setSelectedDate(d); setSelectedTime(''); }} />
                    </div>

                    {/* Time slots */}
                    <div>
                      <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> Hora disponible
                      </p>
                      {!selectedDate ? (
                        <div className="h-[200px] flex flex-col items-center justify-center border-2 border-black/20 bg-white gap-2">
                          <Calendar className="w-8 h-8 text-black/15" />
                          <p className="text-black/30 text-sm font-bold uppercase tracking-wider text-center">Elige primero<br />una fecha</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-1.5">
                          {TIME_SLOTS.map(slot => (
                            <button key={slot} onClick={() => setSelectedTime(slot)}
                              className="py-3 text-xs font-black uppercase tracking-wider transition-all duration-150 focus:outline-none border-2"
                              style={{
                                background:   selectedTime === slot ? '#EE1111' : 'white',
                                color:        selectedTime === slot ? 'white' : '#333',
                                borderColor:  selectedTime === slot ? '#EE1111' : '#ccc',
                              }}
                            >{slot}</button>
                          ))}
                        </div>
                      )}
                      {selectedDate && selectedTime && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className="mt-4 bg-[#EE1111] p-4 border-2 border-[#EE1111]">
                          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Tu cita</p>
                          <p className="text-white font-bold text-sm">{formatDate(selectedDate)}</p>
                          <p className="text-white font-black text-2xl leading-tight">{selectedTime}</p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <button
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep(3)}
                    className="w-full bg-black text-white font-black h-14 text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#EE1111] disabled:bg-black/20 disabled:cursor-not-allowed border-2 border-transparent transition-all"
                  >
                    Continuar <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* ── PASO 3: Datos ────────────────────────────────────── */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <SummaryChips />

                  <div className="mb-5">
                    <Field label="Sucursal *" icon={MapPin}>
                      <select value={form.branch_id} onChange={e => setForm(f => ({ ...f, branch_id: e.target.value }))}
                        className={`${inputCls} cursor-pointer`} style={{ colorScheme: 'light' }}>
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

                  <div className="space-y-4 mb-5">
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
                    <p className="text-[#EE1111] text-sm mb-4 bg-red-50 border-2 border-[#EE1111] px-4 py-3 font-bold">{error}</p>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer mb-5 p-4 border-2 border-black/10 bg-white">
                    <input type="checkbox" checked={privacyAccepted} onChange={e => setPrivacyAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#EE1111] cursor-pointer shrink-0" />
                    <span className="text-xs text-black/50 leading-relaxed font-medium">
                      He leído y acepto la{' '}
                      <a href="/privacidad" target="_blank" className="text-black underline hover:text-[#EE1111] transition-colors font-bold">
                        política de tratamiento de datos personales
                      </a>
                      {' '}de Ibiza Motos (Ley 1581/2012).
                    </span>
                  </label>

                  <button
                    disabled={!form.name || !form.phone || !form.branch_id || submitting || !privacyAccepted}
                    onClick={handleSubmit}
                    className="w-full bg-black text-white font-black h-14 text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#EE1111] disabled:bg-black/20 disabled:cursor-not-allowed border-2 border-transparent transition-all"
                  >
                    {submitting
                      ? <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Guardando...</span>
                      : <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" />Confirmar cita</span>
                    }
                  </button>

                  <p className="text-[11px] text-black/30 text-center mt-4 font-medium">
                    Al confirmar autorizas el tratamiento de tus datos —{' '}
                    <a href="/privacidad" target="_blank" className="underline hover:text-black/50 transition-colors">política de privacidad</a>
                    {' '}(Ley 1581/2012).
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
