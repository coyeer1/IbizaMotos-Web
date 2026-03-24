/**
 * ═══════════════════════════════════════════════════════════════
 *  IBIZA MOTOS — Google Apps Script para citas del taller
 * ═══════════════════════════════════════════════════════════════
 *
 *  INSTRUCCIONES DE INSTALACIÓN (5 minutos):
 *  ─────────────────────────────────────────
 *  1. Ve a https://script.google.com
 *  2. Haz clic en "Nuevo proyecto"
 *  3. Borra el código que aparece por defecto
 *  4. Pega TODO este archivo
 *  5. Cambia CALENDAR_ID (línea 28) por el ID de tu calendario
 *     → Abre Google Calendar → Configuración del calendario
 *       → "ID del calendario" (termina en @google.com o @group.calendar.google.com)
 *     → Si quieres usar el calendario principal, déjalo como 'primary'
 *  6. Guarda el proyecto (Ctrl+S) y ponle nombre: "Ibiza Motos - Citas"
 *  7. Haz clic en "Implementar" → "Nueva implementación"
 *  8. Tipo: "Aplicación web"
 *     · Ejecutar como: Yo (tu cuenta de Google)
 *     · Quién tiene acceso: Cualquier persona
 *  9. Haz clic en "Implementar" y autoriza los permisos
 *     (ahora pedirá permiso para Gmail también — es necesario para los correos)
 * 10. Copia la URL de la aplicación web
 * 11. Pégala en el archivo .env.local de la app:
 *     VITE_GCAL_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXX/exec
 *
 *  Cada vez que un cliente agende una cita en la web:
 *  · El evento aparece en el Google Calendar de la empresa
 *  · El cliente recibe un email de confirmación (si dejó su correo)
 * ═══════════════════════════════════════════════════════════════
 */

var CALENDAR_ID = '05aba167a7ac04235a7af0ab5c423c4916354668468d4ace968199e0cc059c3a@group.calendar.google.com';

// Duración en horas por tipo de servicio
var DURACIONES = {
  mantenimiento: 2,
  revision:      1,
  frenos:        2,
  motor:         3,
};

var SERVICIOS = {
  mantenimiento: 'Mantenimiento Preventivo',
  revision:      'Revisión General',
  frenos:        'Frenos y Suspensión',
  motor:         'Reparación de Motor',
};

// Días y meses en español para el email
var DIAS_ES   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
var MESES_ES  = ['enero','febrero','marzo','abril','mayo','junio',
                 'julio','agosto','septiembre','octubre','noviembre','diciembre'];

/**
 * Este función recibe el POST del formulario web,
 * crea el evento en Calendar y envía email de confirmación al cliente.
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var serviceLabel = SERVICIOS[data.service] || data.service;
    var duracion     = DURACIONES[data.service] || 1;

    // Construir fecha y hora de inicio (Colombia UTC-5)
    var partesFecha = data.appt_date.split('-').map(Number);
    var partesHora  = data.appt_time.split(':').map(Number);
    var inicio = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2],
                          partesHora[0], partesHora[1], 0);
    var fin = new Date(inicio.getTime() + duracion * 60 * 60 * 1000);

    // Fecha legible para el email
    var fechaLegible = DIAS_ES[inicio.getDay()] + ', '
                     + inicio.getDate() + ' de '
                     + MESES_ES[inicio.getMonth()] + ' de '
                     + inicio.getFullYear();

    // Hora legible (HH:MM)
    var horaLegible = partesHora[0].toString().padStart(2,'0') + ':'
                    + partesHora[1].toString().padStart(2,'0');

    // ── 1. Crear evento en Google Calendar ────────────────────────────────────
    var titulo = '🏍️ Cita Taller · ' + serviceLabel + ' · ' + data.name;

    var desc = [
      '📞 Teléfono: ' + data.phone,
      data.email          ? '✉️ Email: '     + data.email          : null,
      data.motorcycle     ? '🏍️ Moto: '     + data.motorcycle      : null,
      data.branch_name    ? '📍 Sucursal: '  + data.branch_name     : null,
      data.notes          ? '📝 Notas: '     + data.notes           : null,
      '',
      '── Agendado automáticamente desde ibizamotos.com ──',
    ].filter(function(l){ return l !== null; }).join('\n');

    var calendario = CalendarApp.getCalendarById(CALENDAR_ID);
    if (!calendario) calendario = CalendarApp.getDefaultCalendar();

    var ubicacion = data.branch_address
      ? data.branch_name + ' — ' + data.branch_address
      : 'Ibiza Motos, Armenia, Quindio';

    var evento = calendario.createEvent(titulo, inicio, fin, {
      description: desc,
      location:    ubicacion,
    });
    evento.setColor(CalendarApp.EventColor.PALE_RED);

    // ── 2. Email de confirmación al cliente ───────────────────────────────────
    if (data.email) {
      enviarEmailConfirmacion(data, serviceLabel, fechaLegible, horaLegible, duracion);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, eventId: evento.getId() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Envía el email HTML de confirmación al cliente.
 */
function enviarEmailConfirmacion(data, serviceLabel, fechaLegible, horaLegible, duracion) {
  var motoFila  = data.motorcycle
    ? '<tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">'
      + '<span style="color:#999;font-size:13px;display:block;">Motocicleta</span>'
      + '<span style="color:#222;font-size:15px;font-weight:600;">' + data.motorcycle + '</span>'
      + '</td></tr>'
    : '';
  var notasFila = data.notes
    ? '<tr><td style="padding:8px 0;">'
      + '<span style="color:#999;font-size:13px;display:block;">Notas</span>'
      + '<span style="color:#222;font-size:15px;">' + data.notes + '</span>'
      + '</td></tr>'
    : '';

  var waText = encodeURIComponent('Hola, quiero reprogramar mi cita del ' + fechaLegible);

  var html = '<!DOCTYPE html>'
    + '<html lang="es"><head><meta charset="UTF-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '</head>'
    + '<body style="margin:0;padding:0;background:#f0f0f0;font-family:\'Helvetica Neue\',Arial,sans-serif;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;">'
    + '<tr><td align="center" style="padding:32px 16px;">'
    + '<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">'

    // ── HEADER ──────────────────────────────────────────────────────
    + '<tr><td style="background:#d7263d;border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">'
    + '<div style="display:inline-block;background:rgba(0,0,0,0.15);border-radius:50%;width:56px;height:56px;line-height:56px;font-size:28px;margin-bottom:14px;">&#10003;</div>'
    + '<h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Cita confirmada</h1>'
    + '<p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Ibiza Motos del Eje Cafetero</p>'
    + '</td></tr>'

    // ── SALUDO ───────────────────────────────────────────────────────
    + '<tr><td style="background:#ffffff;padding:32px 40px 0;">'
    + '<p style="margin:0;color:#222;font-size:16px;">Hola <strong>' + data.name + '</strong>,</p>'
    + '<p style="margin:10px 0 28px;color:#666;font-size:15px;line-height:1.6;">Tu cita en nuestro taller ha sido agendada correctamente. Te esperamos puntual.</p>'
    + '</td></tr>'

    // ── TARJETA DE DETALLES ──────────────────────────────────────────
    + '<tr><td style="background:#ffffff;padding:0 40px;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #ebebeb;border-radius:12px;overflow:hidden;">'
    + '<tr><td style="background:#111;padding:14px 20px;">'
    + '<span style="color:#f9c846;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Detalles de la cita</span>'
    + '</td></tr>'
    + '<tr><td style="padding:4px 20px 0;">'
    + '<table width="100%" cellpadding="0" cellspacing="0">'

    + '<tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">'
    + '<span style="color:#999;font-size:13px;display:block;">Servicio</span>'
    + '<span style="color:#222;font-size:16px;font-weight:700;">' + serviceLabel + '</span>'
    + '</td></tr>'

    + '<tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">'
    + '<span style="color:#999;font-size:13px;display:block;">Fecha</span>'
    + '<span style="color:#222;font-size:15px;font-weight:600;">' + fechaLegible + '</span>'
    + '</td></tr>'

    + '<tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">'
    + '<span style="color:#999;font-size:13px;display:block;">Hora</span>'
    + '<span style="color:#222;font-size:15px;font-weight:600;">' + horaLegible + '&nbsp;&nbsp;<span style="color:#999;font-size:13px;font-weight:400;">Duración aprox. ' + duracion + ' hora' + (duracion > 1 ? 's' : '') + '</span></span>'
    + '</td></tr>'

    + '<tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">'
    + '<span style="color:#999;font-size:13px;display:block;">Sucursal</span>'
    + '<span style="color:#222;font-size:15px;font-weight:600;">' + (data.branch_name || 'Ibiza Motos') + '</span>'
    + (data.branch_address ? '<span style="color:#666;font-size:13px;display:block;margin-top:2px;">' + data.branch_address + '</span>' : '')
    + '</td></tr>'

    + motoFila
    + notasFila

    + '</table>'
    + '</td></tr>'
    + '</table>'
    + '</td></tr>'

    // ── AVISO ────────────────────────────────────────────────────────
    + '<tr><td style="background:#ffffff;padding:24px 40px;">'
    + '<p style="margin:0 0 20px;color:#888;font-size:13px;line-height:1.7;border-left:3px solid #d7263d;padding-left:12px;">'
    + 'Si necesitas reprogramar o cancelar tu cita, escribenos con anticipacion para poder atender a otros clientes.'
    + '</p>'

    // ── BOTON WHATSAPP ───────────────────────────────────────────────
    + '<table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center">'
    + '<a href="https://wa.me/573214567890?text=' + waText + '" '
    + 'style="display:inline-block;background:#25d366;color:#ffffff;font-size:15px;font-weight:700;'
    + 'text-decoration:none;padding:14px 32px;border-radius:10px;letter-spacing:0.2px;">Escribir por WhatsApp</a>'
    + '</td></tr></table>'
    + '</td></tr>'

    // ── FOOTER ───────────────────────────────────────────────────────
    + '<tr><td style="background:#111111;border-radius:0 0 16px 16px;padding:22px 40px;text-align:center;">'
    + '<p style="margin:0;color:#aaaaaa;font-size:13px;font-weight:600;">Ibiza Motos del Eje Cafetero</p>'
    + '<p style="margin:4px 0 0;color:#555555;font-size:12px;">Armenia, Quindio &nbsp;·&nbsp; Este correo es automatico, por favor no respondas.</p>'
    + '</td></tr>'

    + '</table>'
    + '</td></tr></table>'
    + '</body></html>';

  GmailApp.sendEmail(
    data.email,
    'Cita confirmada – ' + serviceLabel + ' | Ibiza Motos',
    'Hola ' + data.name + ',\n\nTu cita en Ibiza Motos esta confirmada.\n\n'
    + 'Servicio: ' + serviceLabel + '\n'
    + 'Fecha: ' + fechaLegible + '\n'
    + 'Hora: ' + horaLegible + '\n'
    + 'Sucursal: ' + (data.branch_name || 'Ibiza Motos') + '\n'
    + (data.branch_address ? 'Direccion: ' + data.branch_address + '\n' : '')
    + '\nPara reprogramar escribenos por WhatsApp.\n\n'
    + 'Ibiza Motos del Eje Cafetero',
    { htmlBody: html }
  );
}

/**
 * Función GET para verificar que el script funciona (opcional).
 * Visita la URL en el navegador para probar.
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Ibiza Motos - Script activo ✓' }))
    .setMimeType(ContentService.MimeType.JSON);
}
