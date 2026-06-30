import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Send, Loader2, CheckCircle2, MapPin, User, MessageSquare } from 'lucide-react';
import { SUCURSALES } from '@/data/sucursales';
import { submitReview } from '@/lib/reviews';
import { useSEO } from '@/hooks/useSEO';

const RATING_LABELS = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];

const inputCls =
  'w-full px-4 py-3.5 bg-white border-2 border-black/20 focus:border-black text-black placeholder:text-black/30 text-sm outline-none transition-all font-medium';

export default function OpinionPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useSEO({
    title: 'Tu opinión | Ibiza Motos',
    description: 'Cuéntanos cómo te atendió nuestro equipo. Tu opinión nos ayuda a mejorar.',
    path: '/opinion',
  });

  const sParam = params.get('s');
  const [selectedId, setSelectedId] = useState<number | null>(() => {
    const n = Number(sParam);
    return sParam && Number.isFinite(n) && SUCURSALES.some((s) => s.id === n) ? n : null;
  });

  const sucursal = useMemo(() => SUCURSALES.find((s) => s.id === selectedId) ?? null, [selectedId]);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState('');
  const [nombre, setNombre] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!sucursal || rating < 1) return;
    setSubmitting(true);
    setError('');
    const { error } = await submitReview({
      sucursal_id: sucursal.id,
      sucursal_nombre: `${sucursal.marca} · ${sucursal.ciudad}`,
      asesor: sucursal.asesor,
      marca: sucursal.marca,
      rating,
      comentario,
      cliente_nombre: nombre,
    });
    setSubmitting(false);
    if (error) {
      setError('No pudimos guardar tu opinión. Revisa tu conexión e intenta de nuevo.');
      return;
    }
    setSubmitted(true);
  };

  // ── Pantalla de gracias ─────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#d4d0cb] flex items-center justify-center px-4 pt-20 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
          <div className="bg-white border-2 border-black p-8 text-center">
            <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-black text-3xl text-black mb-3 uppercase">¡Gracias!</h1>
            <p className="text-gray-600 text-sm mb-8">
              Tu opinión nos ayuda a mejorar el servicio en Ibiza Motos. La recibimos correctamente.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-black text-white font-black py-3.5 hover:bg-[#EE1111] transition-colors text-sm uppercase tracking-wider border-2 border-black"
            >
              Volver al inicio
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Respaldo: sin sucursal válida en el QR → elegir manualmente ───────────────
  if (!sucursal) {
    const ciudades = [...new Set(SUCURSALES.map((s) => s.ciudad))];
    return (
      <div className="min-h-screen bg-[#d4d0cb] flex items-center justify-center px-4 pt-20 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
          <div className="bg-white border-2 border-black p-8">
            <h1 className="font-black text-2xl text-black mb-2 uppercase leading-tight">
              ¿En qué sede te atendieron?
            </h1>
            <p className="text-gray-600 text-sm mb-6">Elige la sucursal para dejar tu opinión.</p>
            <label className="flex items-center gap-1.5 text-[10px] font-black text-black/40 uppercase tracking-widest mb-2">
              <MapPin className="w-3 h-3" /> Sucursal
            </label>
            <select
              value={selectedId ?? ''}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className={`${inputCls} cursor-pointer`}
              style={{ colorScheme: 'light' }}
            >
              <option value="" disabled>
                Elige tu sucursal...
              </option>
              {ciudades.map((ciudad) => (
                <optgroup key={ciudad} label={ciudad}>
                  {SUCURSALES.filter((s) => s.ciudad === ciudad).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.marca} — {s.asesor}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Formulario de opinión ─────────────────────────────────────────────────────
  const activeStars = hover || rating;

  return (
    <div className="min-h-screen bg-[#d4d0cb] flex items-center justify-center px-4 pt-20 pb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <div className="bg-white border-2 border-black p-8">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black/40 mb-4">
            <MapPin className="w-3 h-3" /> {sucursal.marca} · {sucursal.ciudad}
          </span>
          <h1 className="font-black text-3xl text-black mb-2 uppercase leading-[0.95]">
            ¿Cómo te atendió<br />
            <span className="text-[#EE1111]">{sucursal.asesor}</span>?
          </h1>
          <p className="text-gray-600 text-sm mb-7">Toca las estrellas para calificar.</p>

          {/* Estrellas */}
          <div className="flex flex-col items-center gap-2 mb-7">
            <div className="flex items-center gap-2" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
                  onMouseEnter={() => setHover(n)}
                  onClick={() => setRating(n)}
                  className="p-1 transition-transform duration-150 hover:scale-110 focus:outline-none"
                >
                  <Star
                    className="w-9 h-9 transition-colors duration-150"
                    style={{
                      fill: n <= activeStars ? '#f9c846' : 'transparent',
                      color: n <= activeStars ? '#f9c846' : '#cccccc',
                    }}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-black/50 h-4">
              {RATING_LABELS[activeStars] || ''}
            </span>
          </div>

          {/* Comentario */}
          <label className="flex items-center gap-1.5 text-[10px] font-black text-black/40 uppercase tracking-widest mb-2">
            <MessageSquare className="w-3 h-3" /> Tu comentario (opcional)
          </label>
          <textarea
            rows={3}
            value={comentario}
            maxLength={1000}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="¿Qué te gustó o qué podemos mejorar?"
            className={`${inputCls} resize-none mb-5`}
          />

          {/* Nombre opcional */}
          <label className="flex items-center gap-1.5 text-[10px] font-black text-black/40 uppercase tracking-widest mb-2">
            <User className="w-3 h-3" /> Tu nombre (opcional)
          </label>
          <input
            value={nombre}
            maxLength={120}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="¿Cómo te llamas?"
            className={`${inputCls} mb-6`}
          />

          {error && (
            <p className="text-[#EE1111] text-sm mb-4 bg-red-50 border-2 border-[#EE1111] px-4 py-3 font-bold">{error}</p>
          )}

          <button
            disabled={rating < 1 || submitting}
            onClick={handleSubmit}
            className="w-full bg-black text-white font-black h-14 text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#EE1111] disabled:bg-black/20 disabled:cursor-not-allowed border-2 border-transparent transition-all"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Enviar opinión
              </span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
