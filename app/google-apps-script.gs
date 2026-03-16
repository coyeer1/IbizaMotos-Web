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
 *  5. Cambia CALENDAR_ID (línea 25) por el ID de tu calendario
 *     → Abre Google Calendar → Configuración del calendario
 *       → "ID del calendario" (termina en @google.com o @group.calendar.google.com)
 *     → Si quieres usar el calendario principal, déjalo como 'primary'
 *  6. Guarda el proyecto (Ctrl+S) y ponle nombre: "Ibiza Motos - Citas"
 *  7. Haz clic en "Implementar" → "Nueva implementación"
 *  8. Tipo: "Aplicación web"
 *     · Ejecutar como: Yo (tu cuenta de Google)
 *     · Quién tiene acceso: Cualquier persona
 *  9. Haz clic en "Implementar" y autoriza los permisos
 * 10. Copia la URL de la aplicación web
 * 11. Pégala en el archivo .env.local de la app:
 *     VITE_GCAL_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXX/exec
 *
 *  Cada vez que un cliente agende una cita en la web, el evento
 *  aparecerá automáticamente en el Google Calendar de la empresa.
 * ═══════════════════════════════════════════════════════════════
 */

// ← CAMBIA ESTE VALOR por el ID de tu calendario de Google
var CALENDAR_ID = 'primary'; // o 'taller@ibizamotos.com', etc.

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

/**
 * Este función recibe el POST del formulario web y crea el evento en Calendar.
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var serviceLabel = SERVICIOS[data.service] || data.service;
    var duracion     = DURACIONES[data.service] || 1;

    // Construir fecha y hora de inicio (Colombia UTC-5)
    var partesFecha  = data.appt_date.split('-').map(Number);
    var partesHora   = data.appt_time.split(':').map(Number);
    var inicio = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2],
                          partesHora[0], partesHora[1], 0);
    var fin = new Date(inicio.getTime() + duracion * 60 * 60 * 1000);

    // Título del evento
    var titulo = '🏍️ Cita Taller · ' + serviceLabel + ' · ' + data.name;

    // Descripción con todos los datos del cliente
    var desc = [
      '📞 Teléfono: ' + data.phone,
      data.email      ? '✉️ Email: ' + data.email           : null,
      data.motorcycle ? '🏍️ Moto: '  + data.motorcycle      : null,
      data.notes      ? '📝 Notas: '  + data.notes           : null,
      '',
      '── Agendado automáticamente desde ibizamotos.com ──',
    ].filter(function(l){ return l !== null; }).join('\n');

    // Crear el evento en el calendario
    var calendario = CalendarApp.getCalendarById(CALENDAR_ID);
    if (!calendario) {
      calendario = CalendarApp.getDefaultCalendar();
    }

    var evento = calendario.createEvent(titulo, inicio, fin, {
      description: desc,
      location:    'Carrera 23 #23-45, Armenia, Quindío',
    });

    // Color rojo para las citas del taller
    evento.setColor(CalendarApp.EventColor.PALE_RED);

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
 * Función GET para verificar que el script funciona (opcional).
 * Visita la URL en el navegador para probar.
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Ibiza Motos - Script activo ✓' }))
    .setMimeType(ContentService.MimeType.JSON);
}
