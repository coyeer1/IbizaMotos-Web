// ─── Google Calendar Utilities ────────────────────────────────────────────────
// Dos funciones:
//  1. buildGoogleCalendarUrl — genera un link para que CUALQUIERA agregue el
//     evento a su propio Google Calendar (sin auth, funciona en browser)
//  2. notifyAppsScript — envía los datos a un Google Apps Script que crea el
//     evento automáticamente en el calendario de la empresa

export interface CalendarEventParams {
  service:    string;    // id: 'mantenimiento', 'revision', etc.
  appt_date:  string;    // 'YYYY-MM-DD'
  appt_time:  string;    // 'HH:MM'
  name:       string;
  phone:      string;
  email?:     string;
  motorcycle?: string;
  notes?:     string;
}

const SERVICE_LABELS: Record<string, string> = {
  mantenimiento: 'Mantenimiento Preventivo',
  revision:      'Revisión General',
  frenos:        'Frenos y Suspensión',
  motor:         'Reparación de Motor',
};

const SERVICE_DURATION_H: Record<string, number> = {
  mantenimiento: 2,
  revision:      1,
  frenos:        2,
  motor:         3,
};

// Colombia = UTC-5
const COL_UTC_OFFSET = 5;

/**
 * Genera la URL de Google Calendar para pre-crear un evento.
 * El usuario solo tiene que hacer clic y guardar — sin login adicional.
 */
export function buildGoogleCalendarUrl(p: CalendarEventParams): string {
  const [year, month, day] = p.appt_date.split('-').map(Number);
  const [hour, minute]     = p.appt_time.split(':').map(Number);

  // Convertir hora Colombia → UTC
  const startUTC = new Date(Date.UTC(year, month - 1, day, hour + COL_UTC_OFFSET, minute));
  const durationH = SERVICE_DURATION_H[p.service] ?? 1;
  const endUTC = new Date(startUTC.getTime() + durationH * 3_600_000);

  const fmtDT = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const title = `🏍️ Cita Taller · ${SERVICE_LABELS[p.service] ?? p.service} · ${p.name}`;

  const details = [
    `📞 Tel: ${p.phone}`,
    p.email      ? `✉️ Email: ${p.email}`    : null,
    p.motorcycle ? `🏍️ Moto: ${p.motorcycle}` : null,
    p.notes      ? `📝 ${p.notes}`            : null,
    '',
    'Ibiza Motos del Eje Cafetero',
  ].filter(Boolean).join('\n');

  const qs = new URLSearchParams({
    action:   'TEMPLATE',
    text:     title,
    dates:    `${fmtDT(startUTC)}/${fmtDT(endUTC)}`,
    details:  details,
    location: 'Carrera 23 #23-45, Armenia, Quindío',
  });

  return `https://calendar.google.com/calendar/render?${qs.toString()}`;
}

/**
 * Envía los datos de la cita al Google Apps Script de la empresa.
 * El script crea el evento directamente en el calendario corporativo.
 *
 * scriptUrl viene de la variable de entorno VITE_GCAL_SCRIPT_URL.
 * Si no está configurada, esta función no hace nada (silent fail).
 */
export async function notifyAppsScript(params: CalendarEventParams): Promise<void> {
  const scriptUrl = import.meta.env.VITE_GCAL_SCRIPT_URL as string | undefined;
  if (!scriptUrl) return; // No configurado aún — OK

  try {
    await fetch(scriptUrl, {
      method:  'POST',
      // 'no-cors' es necesario porque Google Apps Script no devuelve
      // los headers CORS correctos en todos los casos
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(params),
    });
  } catch {
    // El webhook es complementario — no interrumpimos el flujo principal
    console.warn('[Ibiza Motos] Google Apps Script webhook falló silenciosamente.');
  }
}
