import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { buildGoogleCalendarUrl } from '@/lib/googleCalendar';
import {
  Bike, Trash2, LogOut,
  AlertCircle, CheckCircle2,
  Calendar, Phone, Wrench, RefreshCw, Star, Printer
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { SUCURSALES } from '@/data/sucursales';
import { QRCodeImg } from '@/components/QRCodeImg';
import QRCode from 'qrcode';
import type { AdvisorReview } from '@/lib/reviews';

// ─── Main Admin Dashboard ───
export default function AdminDashboard() {
  const { isAuthenticated, loading: authLoading, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'appointments' | 'reviews' | 'qr'>('appointments');

  // ─── Citas state ────────────────────────────────────────────────────────────
  interface Appointment {
    id: string;
    created_at: string;
    name: string;
    phone: string;
    email?: string;
    motorcycle?: string;
    service: string;
    appt_date: string;
    appt_time: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'done' | 'cancelled';
    branch_name?: string;
    branch_address?: string;
  }
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [apptLoading, setApptLoading] = useState(false);
  const [apptFilter, setApptFilter] = useState<'all' | 'pending' | 'confirmed' | 'done' | 'cancelled'>('all');

  const SERVICE_LABELS: Record<string, string> = {
    mantenimiento: 'Mantenimiento',
    revision: 'Revisión General',
    frenos: 'Frenos y Suspensión',
    motor: 'Reparación Motor',
  };

  const STATUS_CONFIG = {
    pending:   { label: 'Pendiente',  color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    confirmed: { label: 'Confirmada', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    done:      { label: 'Completada', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    cancelled: { label: 'Cancelada',  color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  } as const;

  const fetchAppointments = async () => {
    setApptLoading(true);
    try {
      const { data, error } = await supabase
        .from('workshop_appointments')
        .select('*')
        .order('appt_date', { ascending: true })
        .order('appt_time', { ascending: true });
      if (error) throw error;
      setAppointments(data || []);
    } catch (err: any) {
      showToast('Error cargando citas: ' + err.message, 'error');
    } finally {
      setApptLoading(false);
    }
  };

  const updateApptStatus = async (id: string, status: Appointment['status']) => {
    const { error } = await supabase
      .from('workshop_appointments')
      .update({ status })
      .eq('id', id);
    if (error) {
      showToast('Error actualizando estado', 'error');
    } else {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      showToast('Estado actualizado ✓', 'success');
    }
  };

  const deleteAppt = async (id: string) => {
    const { error } = await supabase.from('workshop_appointments').delete().eq('id', id);
    if (error) {
      showToast('Error eliminando cita', 'error');
    } else {
      setAppointments(prev => prev.filter(a => a.id !== id));
      showToast('Cita eliminada ✓', 'success');
    }
  };

  // ─── Opiniones (advisor_reviews) ──────────────────────────────────────────────
  const [reviews, setReviews] = useState<AdvisorReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const { data, error } = await supabase
        .from('advisor_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReviews((data as AdvisorReview[]) || []);
    } catch (err: any) {
      showToast('Error cargando opiniones: ' + err.message, 'error');
    } finally {
      setReviewsLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    const { error } = await supabase.from('advisor_reviews').delete().eq('id', id);
    if (error) { showToast('Error eliminando opinión', 'error'); }
    else { setReviews(prev => prev.filter(r => r.id !== id)); showToast('Opinión eliminada ✓', 'success'); }
  };

  // Abre una ventana imprimible con un QR por sucursal (cada uno apunta a /opinion?s=<id>).
  const printAllQRs = async () => {
    const origin = window.location.origin;
    const items = await Promise.all(
      SUCURSALES.map(async (s) => ({
        s,
        url: await QRCode.toDataURL(`${origin}/opinion?s=${s.id}`, { width: 320, margin: 1 }),
      }))
    );
    const cards = items.map(({ s, url }) => `
      <div class="card">
        <img src="${url}" />
        <div class="marca">${s.marca}</div>
        <div class="ciudad">${s.ciudad}</div>
        <div class="asesor">${s.asesor}</div>
        <div class="cta">Escanéame y déjanos tu opinión</div>
      </div>`).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>QR Opiniones - Ibiza Motos</title>
      <style>
        *{box-sizing:border-box;font-family:Arial,Helvetica,sans-serif}
        body{margin:0;padding:16px}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .card{border:2px solid #000;border-radius:10px;padding:14px;text-align:center;page-break-inside:avoid}
        .card img{width:100%;max-width:240px}
        .marca{font-weight:800;font-size:18px;margin-top:8px;text-transform:uppercase}
        .ciudad{color:#555;font-size:13px}
        .asesor{font-weight:700;font-size:14px;margin-top:4px}
        .cta{color:#E31937;font-size:11px;font-weight:700;margin-top:6px;text-transform:uppercase;letter-spacing:.05em}
      </style></head>
      <body><div class="grid">${cards}</div>
      <script>window.onload=function(){setTimeout(function(){window.print()},300)}</script>
      </body></html>`;
    const w = window.open('', '_blank');
    if (!w) { showToast('Permite las ventanas emergentes para imprimir', 'error'); return; }
    w.document.write(html);
    w.document.close();
  };

  useEffect(() => {
    if (authLoading) return;          // espera a saber si hay sesión de Supabase
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    fetchAppointments();
  }, [isAuthenticated, authLoading, navigate]);

  // Las opiniones se cargan solo al abrir su pestaña (evita errores si la tabla
  // aún no existe en Supabase).
  useEffect(() => {
    if (isAuthenticated && activeTab === 'reviews') fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeTab]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* ── TOP BAR ── */}
      <div className="bg-[#0c0c0e] border-b border-white/[0.04] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/Logo-Ibiza-motos.png" alt="Ibiza Motos" loading="lazy" decoding="async" className="h-10" />
            <div className="h-6 w-px bg-white/10" />
            <span className="text-white/40 text-sm font-medium">Admin Panel</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/30 hover:text-ibiza-red text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── TABS ── */}
        <div className="flex gap-1 bg-white/[0.02] border border-white/[0.04] rounded-xl p-1 w-fit mb-8">
          {([
            { id: 'appointments', label: `📅 Citas${appointments.filter(a => a.status === 'pending').length > 0 ? ` · ${appointments.filter(a => a.status === 'pending').length} nuevas` : ''}` },
            { id: 'reviews', label: '⭐ Opiniones' },
            { id: 'qr', label: '🔳 QR opiniones' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-ibiza-red text-white shadow-sm' : 'text-white/30 hover:text-white/60'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════ CITAS TAB ══════════════════════════ */}
        {activeTab === 'appointments' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="font-display font-bold text-2xl text-white">Citas del Taller</h2>
              <div className="flex gap-2 flex-wrap">
                {(['all','pending','confirmed','done','cancelled'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setApptFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${apptFilter === f ? 'bg-ibiza-red text-white' : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:text-white/60'}`}
                  >
                    {f === 'all' ? 'Todas' : STATUS_CONFIG[f].label}
                    {f !== 'all' && (
                      <span className="ml-1.5 opacity-60">
                        ({appointments.filter(a => a.status === f).length})
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={fetchAppointments}
                  className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white transition-colors"
                  title="Actualizar"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {apptLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-ibiza-red/30 border-t-ibiza-red rounded-full animate-spin" />
              </div>
            ) : (() => {
              const filtered = apptFilter === 'all'
                ? appointments
                : appointments.filter(a => a.status === apptFilter);
              return filtered.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.01] rounded-2xl border border-white/[0.04]">
                  <Calendar className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No hay citas en esta categoría</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map(appt => {
                    const statusCfg = STATUS_CONFIG[appt.status];
                    return (
                      <div
                        key={appt.id}
                        className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5 hover:border-white/[0.08] transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          {/* Date + time badge */}
                          <div className="bg-ibiza-red/10 border border-ibiza-red/20 rounded-xl px-4 py-3 text-center shrink-0 min-w-[90px]">
                            <p className="font-display font-black text-ibiza-red text-lg leading-none">{appt.appt_date.slice(8)}</p>
                            <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">
                              {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][parseInt(appt.appt_date.slice(5,7)) - 1]}
                            </p>
                            <p className="text-white font-bold text-sm mt-1">{appt.appt_time}</p>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
                                    {statusCfg.label}
                                  </span>
                                  <span className="text-white/30 text-[10px]">
                                    {new Date(appt.created_at).toLocaleDateString('es-CO')}
                                  </span>
                                </div>
                                <p className="font-display font-bold text-white">{appt.name}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/40 mb-3">
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{appt.phone}</span>
                              {appt.email && <span className="flex items-center gap-1">✉ {appt.email}</span>}
                              <span className="flex items-center gap-1"><Wrench className="w-3 h-3" />{SERVICE_LABELS[appt.service] || appt.service}</span>
                              {appt.motorcycle && <span className="flex items-center gap-1"><Bike className="w-3 h-3" />{appt.motorcycle}</span>}
                              {appt.branch_name && <span className="flex items-center gap-1 text-ibiza-gold/70">📍 {appt.branch_name}</span>}
                            </div>

                            {appt.notes && (
                              <p className="text-white/30 text-xs bg-white/[0.02] rounded-lg px-3 py-2 border border-white/[0.04] mb-3">
                                💬 {appt.notes}
                              </p>
                            )}

                            {/* Status actions */}
                            <div className="flex flex-wrap gap-2 items-center">
                              {(['pending','confirmed','done','cancelled'] as const).filter(s => s !== appt.status).map(s => (
                                <button
                                  key={s}
                                  onClick={() => updateApptStatus(appt.id, s)}
                                  className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all hover:opacity-100 opacity-70 ${STATUS_CONFIG[s].color}`}
                                >
                                  → {STATUS_CONFIG[s].label}
                                </button>
                              ))}

                              {/* Botón Google Calendar */}
                              <a
                                href={buildGoogleCalendarUrl({
                                  service:    appt.service,
                                  appt_date:  appt.appt_date,
                                  appt_time:  appt.appt_time,
                                  name:       appt.name,
                                  phone:      appt.phone,
                                  email:      appt.email,
                                  motorcycle: appt.motorcycle,
                                  notes:      appt.notes,
                                })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
                                title="Agregar al Google Calendar"
                              >
                                <svg viewBox="0 0 48 48" className="w-3 h-3 shrink-0">
                                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                </svg>
                                Google Cal
                              </a>

                              <button
                                onClick={() => deleteAppt(appt.id)}
                                className="px-3 py-1 rounded-lg text-[11px] font-bold border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all ml-auto"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* ── Google Calendar embebido ─────────────────────────────── */}
            <div className="mt-10">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Vista del calendario · citas ibiza
              </p>
              <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
                <iframe
                  src="https://calendar.google.com/calendar/embed?src=05aba167a7ac04235a7af0ab5c423c4916354668468d4ace968199e0cc059c3a%40group.calendar.google.com&ctz=America%2FBogota&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&mode=WEEK"
                  style={{ border: 0 }}
                  width="100%"
                  height="520"
                  frameBorder="0"
                  scrolling="no"
                  title="Calendario de citas Ibiza Motos"
                />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════ OPINIONES TAB ══════════════════════════ */}
        {activeTab === 'reviews' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="font-display font-bold text-2xl text-white">Opiniones de asesores</h2>
              <button
                onClick={fetchReviews}
                className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white transition-colors"
                title="Recargar"
              >
                <RefreshCw className={`w-4 h-4 ${reviewsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {reviews.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/[0.04]">
                  <p className="font-display font-black text-3xl text-white">{reviews.length}</p>
                  <p className="text-white/25 text-xs font-medium mt-1">Opiniones</p>
                </div>
                <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/[0.04]">
                  <p className="font-display font-black text-3xl text-ibiza-gold">
                    {(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)} ★
                  </p>
                  <p className="text-white/25 text-xs font-medium mt-1">Promedio general</p>
                </div>
                <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/[0.04]">
                  <p className="font-display font-black text-3xl text-white">{reviews.filter(r => r.rating >= 4).length}</p>
                  <p className="text-white/25 text-xs font-medium mt-1">Positivas (4-5★)</p>
                </div>
              </div>
            )}

            {reviews.length > 0 && (
              <div className="bg-white/[0.02] rounded-2xl border border-white/[0.04] p-5 mb-8">
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">Promedio por asesor</p>
                <div className="space-y-2">
                  {Object.values(reviews.reduce((acc, r) => {
                    if (!acc[r.asesor]) acc[r.asesor] = { asesor: r.asesor, sucursal: r.sucursal_nombre, sum: 0, n: 0 };
                    acc[r.asesor].sum += r.rating; acc[r.asesor].n += 1;
                    return acc;
                  }, {} as Record<string, { asesor: string; sucursal: string; sum: number; n: number }>))
                    .sort((a, b) => (b.sum / b.n) - (a.sum / a.n))
                    .map(row => (
                      <div key={row.asesor} className="flex items-center justify-between text-sm gap-3">
                        <div className="min-w-0 truncate">
                          <span className="text-white font-semibold">{row.asesor}</span>
                          <span className="text-white/30 ml-2 text-xs">{row.sucursal}</span>
                        </div>
                        <span className="text-ibiza-gold font-bold shrink-0">
                          {(row.sum / row.n).toFixed(1)} ★ <span className="text-white/30 font-normal">({row.n})</span>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {reviewsLoading ? (
              <p className="text-white/40 text-sm">Cargando...</p>
            ) : reviews.length === 0 ? (
              <div className="bg-white/[0.02] rounded-2xl border border-white/[0.04] p-10 text-center">
                <p className="text-white/40 text-sm">Aún no hay opiniones. Cuando un cliente escanee un QR y deje su opinión, aparecerá aquí.</p>
                <p className="text-white/20 text-xs mt-3">¿No cargan? Asegúrate de haber corrido <code className="text-white/40">supabase-advisor-reviews.sql</code> en Supabase.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="bg-white/[0.02] rounded-2xl border border-white/[0.04] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 mb-1.5">
                          {[1, 2, 3, 4, 5].map(n => (
                            <Star key={n} className="w-4 h-4" style={{ fill: n <= r.rating ? '#f9c846' : 'transparent', color: n <= r.rating ? '#f9c846' : '#444' }} />
                          ))}
                          <span className="text-white/30 text-xs ml-2">{new Date(r.created_at).toLocaleDateString('es-CO')}</span>
                        </div>
                        <p className="text-white font-semibold text-sm">
                          {r.asesor} <span className="text-white/30 font-normal">· {r.sucursal_nombre}</span>
                        </p>
                        {r.comentario && <p className="text-white/60 text-sm mt-2 leading-relaxed">“{r.comentario}”</p>}
                        {(r.cliente_nombre || r.cliente_telefono) && (
                          <p className="text-white/25 text-xs mt-2">{[r.cliente_nombre, r.cliente_telefono].filter(Boolean).join(' · ')}</p>
                        )}
                      </div>
                      <button onClick={() => deleteReview(r.id)} className="text-white/20 hover:text-ibiza-red transition-colors shrink-0" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════ QR TAB ══════════════════════════ */}
        {activeTab === 'qr' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">QR de opiniones por sucursal</h2>
                <p className="text-white/40 text-sm mt-1">Imprime y pega el QR de cada local. Al escanearlo, el cliente califica directo a su asesor.</p>
              </div>
              <button
                onClick={printAllQRs}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ibiza-red text-white text-sm font-semibold hover:bg-ibiza-red/90 transition-colors shrink-0"
              >
                <Printer className="w-4 h-4" /> Imprimir todos
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {SUCURSALES.map(s => (
                <div key={s.id} className="bg-white rounded-2xl p-4 flex flex-col items-center text-center">
                  <QRCodeImg value={`${window.location.origin}/opinion?s=${s.id}`} size={150} />
                  <p className="font-black text-black text-sm mt-3 uppercase leading-tight">{s.marca}</p>
                  <p className="text-black/50 text-xs">{s.ciudad}</p>
                  <p className="text-black/70 text-xs font-semibold mt-0.5">{s.asesor}</p>
                </div>
              ))}
            </div>
          </div>
        )}



      </div>

      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${
              toast.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
