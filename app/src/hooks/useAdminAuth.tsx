import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

// Admin password from environment variable — never hardcode secrets!
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('ibiza_admin_auth');
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (password: string) => {
    if (password === ADMIN_PASSWORD) {
      // Authenticate with Supabase to bypass RLS
      const { error } = await supabase.auth.signInWithPassword({
        email: 'web@ibizamotos.com',
        password: password
      });

      if (error) {
        console.error("Supabase Auth Error:", error);
        alert("Error de base de datos: Debes crear el usuario Administrador en Supabase para tener permisos (ejecuta el script SQL).");
        return false;
      }

      setIsAuthenticated(true);
      sessionStorage.setItem('ibiza_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ibiza_admin_auth');
    await supabase.auth.signOut();
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
