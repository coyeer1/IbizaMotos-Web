import { supabase } from '@/lib/supabase';

// Fila tal como vive en Supabase (la lee el panel admin).
export interface AdvisorReview {
  id: string;
  created_at: string;
  sucursal_id: number;
  sucursal_nombre: string;
  asesor: string;
  marca: string | null;
  rating: number;
  comentario: string | null;
  cliente_nombre: string | null;
  cliente_telefono: string | null;
}

// Payload que envía el formulario público de opinión.
export interface NewReview {
  sucursal_id: number;
  sucursal_nombre: string;
  asesor: string;
  marca?: string;
  rating: number;
  comentario?: string;
  cliente_nombre?: string;
  cliente_telefono?: string;
}

// Aviso instantáneo por WhatsApp al dueño (mismo mecanismo CallMeBot que las citas).
// Si las variables no están configuradas, no hace nada (falla en silencio).
async function notifyWhatsAppAdmin(r: NewReview): Promise<void> {
  const phone  = import.meta.env.VITE_CALLMEBOT_PHONE  as string | undefined;
  const apikey = import.meta.env.VITE_CALLMEBOT_APIKEY as string | undefined;
  if (!phone || !apikey) return;
  const stars = '⭐'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
  const lines = [
    '🗣️ *Nueva opinión – Ibiza Motos*',
    `${stars} (${r.rating}/5)`,
    `👤 Asesor: ${r.asesor}`,
    `📍 ${r.sucursal_nombre}${r.marca ? ' · ' + r.marca : ''}`,
    r.comentario       ? `📝 ${r.comentario}`       : null,
    r.cliente_nombre   ? `🙋 ${r.cliente_nombre}`   : null,
    r.cliente_telefono ? `📞 ${r.cliente_telefono}` : null,
  ].filter(Boolean).join('\n');
  try {
    await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(lines)}&apikey=${apikey}`,
      { mode: 'no-cors' },
    );
  } catch { console.warn('[Ibiza Motos] Notificación de opinión falló.'); }
}

// Inserta la opinión y dispara la notificación. Devuelve { error } (null si todo ok).
export async function submitReview(r: NewReview): Promise<{ error: string | null }> {
  if (!Number.isInteger(r.rating) || r.rating < 1 || r.rating > 5) {
    return { error: 'Calificación inválida.' };
  }
  const { error } = await supabase.from('advisor_reviews').insert({
    sucursal_id:      r.sucursal_id,
    sucursal_nombre:  r.sucursal_nombre,
    asesor:           r.asesor,
    marca:            r.marca ?? null,
    rating:           r.rating,
    comentario:       r.comentario?.trim()       || null,
    cliente_nombre:   r.cliente_nombre?.trim()   || null,
    cliente_telefono: r.cliente_telefono?.trim() || null,
  });
  if (error) return { error: error.message };
  await notifyWhatsAppAdmin(r);
  return { error: null };
}
