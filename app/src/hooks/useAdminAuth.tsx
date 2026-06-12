import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  loading: true,
  login: async () => false,
  logout: () => {},
});

// Correo del usuario administrador en Supabase. NO es secreto.
// La contraseña la valida Supabase en el servidor — nunca viaja en el bundle.
const ADMIN_EMAIL = 'web@ibizamotos.com';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // La fuente de verdad es la sesión real de Supabase, no un flag local.
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (password: string) => {
    // Supabase valida la contraseña en el servidor. Si es correcta, abre sesión
    // (y con RLS activo, recién ahí se obtienen permisos sobre las tablas).
    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });

    if (error) {
      console.error('Supabase Auth Error:', error.message);
      return false;
    }

    setIsAuthenticated(true);
    return true;
  };

  const logout = async () => {
    setIsAuthenticated(false);
    await supabase.auth.signOut();
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
