import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { StreakService } from '../lib/api/streak';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Registrar actividad de login cuando el usuario inicia sesión
      if (event === 'SIGNED_IN' && session?.user?.id) {
        try {
          await StreakService.recordActivity(session.user.id, 'login');
        } catch (error) {
          console.error('Error recording login activity:', error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔵 Iniciando login con:', { email, passwordLength: password.length });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('🔵 Respuesta de signIn:', { data, error });
      
      if (error) {
        console.error('❌ Error en signIn:', error);
      } else {
        console.log('✅ Login exitoso:', data.user?.id);
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Error inesperado en signIn:', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('🔵 Iniciando registro con:', { email, fullName, passwordLength: password.length });
      
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      console.log('🔵 Respuesta de signUp:', { authData, authError });

      if (authError) {
        console.error('❌ Error en signUp:', authError);
        return { error: authError };
      }
      if (!authData.user) {
        console.error('❌ No se creó el usuario');
        return { error: new Error('No se pudo crear el usuario') };
      }

      console.log('✅ Usuario creado en Auth:', authData.user.id);

      // 2. Crear registro en tabla users
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: authData.user.email!,
          full_name: fullName,
        }]);

      if (profileError) {
        console.error('❌ Error creating user profile:', profileError);
        return { error: new Error('Error al crear perfil de usuario') };
      }

      console.log('✅ Perfil de usuario creado');
      return { error: null };
    } catch (error) {
      console.error('❌ Error inesperado en signUp:', error);
      return { error: error as Error };
    }
  };  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
