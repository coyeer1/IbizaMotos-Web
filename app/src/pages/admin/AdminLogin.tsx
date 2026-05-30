import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 800));

    if (await login(password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Contraseña incorrecta');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ibiza-red/5 rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/Logo-Ibiza-motos.png"
            alt="Ibiza Motos"
            loading="lazy"
            decoding="async"
            className="h-20 mx-auto mb-4"
          />
          <h1 className="font-display font-bold text-2xl text-white">
            Panel de Administración
          </h1>
          <p className="text-white/30 text-sm mt-2">
            Acceso exclusivo para administradores
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-8">
          <form onSubmit={handleSubmit}>
            {/* Password field */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-white/30 uppercase tracking-widest mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full pl-12 pr-12 py-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/20 focus:border-ibiza-red focus:ring-1 focus:ring-ibiza-red outline-none transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-4 bg-ibiza-red hover:bg-ibiza-red/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_30px_rgba(227,25,55,0.2)] hover:shadow-[0_0_40px_rgba(227,25,55,0.4)] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Ingresar'
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <a href="/" className="text-white/20 text-sm hover:text-white/40 transition-colors">
            ← Volver al sitio web
          </a>
        </div>
      </motion.div>
    </div>
  );
}
