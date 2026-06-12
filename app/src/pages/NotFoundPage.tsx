import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center px-4">

      {/* Video de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          src="/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        {/* Overlay degradado */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff]/60 via-[#ffffff]/70 to-[#ffffff]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center max-w-lg w-full"
      >
        {/* Número 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6"
        >
          <p className="font-display font-black text-[160px] leading-none select-none"
            style={{ WebkitTextStroke: '2px rgba(215,38,61,0.4)', color: 'transparent' }}
          >
            404
          </p>
        </motion.div>

        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display font-black text-3xl text-[#111111] mb-3">
            Página no encontrada
          </h1>
          <p className="text-[#666666] mb-10 leading-relaxed">
            Esta ruta no existe o fue movida.<br />
            Vuelve al inicio y encuentra lo que buscas.
          </p>
        </motion.div>

        {/* Acciones */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-[#ececec] text-[#111111] hover:bg-black/[0.03] rounded-xl gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="bg-ibiza-red hover:bg-ibiza-red/90 text-white rounded-xl gap-2"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </Button>
        </motion.div>

        {/* Links rápidos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-[#ececec]"
        >
          <p className="text-[#999999] text-xs mb-4 uppercase tracking-widest font-bold">
            Páginas populares
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Ver motos',       path: '/#catalogo'      },
              { label: 'Financiamiento',  path: '/financiamiento' },
              { label: 'Agendar cita',    path: '/citas'          },
              { label: 'Honda',           path: '/marca/honda'    },
              { label: 'Bajaj',           path: '/marca/bajaj'    },
              { label: 'Suzuki',          path: '/marca/suzuki'   },
            ].map(({ label, path }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="text-xs text-[#999999] hover:text-ibiza-red transition-colors px-3 py-1.5 rounded-lg border border-[#e8e8e8] bg-white hover:border-ibiza-red/20"
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
