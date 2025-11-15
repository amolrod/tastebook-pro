import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Obtener variables de entorno de forma segura
const getEnvVar = (key: string): string => {
  // En el cliente, usar import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] as string || '';
  }
  // En SSR/Node, usar process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️  Variables de entorno de Supabase no configuradas. ' +
    'Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local'
  );
}

/**
 * Cliente de Supabase configurado para la aplicación.
 * 
 * Proporciona acceso a:
 * - Base de datos PostgreSQL con tipado TypeScript
 * - Sistema de autenticación (Auth)
 * - Almacenamiento de archivos (Storage)
 * - Suscripciones en tiempo real (Realtime)
 * 
 * @example
 * ```typescript
 * // Consultar recetas públicas
 * const { data, error } = await supabase
 *   .from('recipes')
 *   .select('*')
 *   .eq('is_public', true);
 * 
 * // Autenticar usuario
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * 
 * // Subir imagen
 * const { data, error } = await supabase.storage
 *   .from('recipe-images')
 *   .upload('image.jpg', file);
 * ```
 */
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      // Persistir sesión en localStorage
      persistSession: true,
      // Auto-refresh de tokens
    autoRefreshToken: true,
    // Detectar cambios de sesión
    detectSessionInUrl: true,
  },
  // Configuración global para todas las queries
  global: {
    headers: {
      'x-app-name': 'tastebook-pro',
    },
  },
  // Configuración de realtime
  realtime: {
    // Parámetros para reconexión automática
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Helper para obtener la sesión actual del usuario.
 * 
 * @returns Promise con la sesión del usuario o null si no está autenticado
 * 
 * @example
 * ```typescript
 * const session = await getCurrentSession();
 * if (session) {
 *   console.log('Usuario autenticado:', session.user.email);
 * }
 * ```
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error al obtener sesión:', error);
    return null;
  }
  
  return session;
}

/**
 * Helper para obtener el usuario actual.
 * 
 * @returns Promise con el usuario o null si no está autenticado
 * 
 * @example
 * ```typescript
 * const user = await getCurrentUser();
 * if (user) {
 *   console.log('ID del usuario:', user.id);
 * }
 * ```
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
  
  return user;
}

/**
 * Helper para verificar si un usuario está autenticado.
 * 
 * @returns Promise<boolean> - true si el usuario está autenticado
 * 
 * @example
 * ```typescript
 * if (await isAuthenticated()) {
 *   // Mostrar contenido protegido
 * } else {
 *   // Redirigir a login
 * }
 * ```
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return session !== null;
}

/**
 * Helper para cerrar sesión.
 * 
 * @example
 * ```typescript
 * await signOut();
 * navigate('/login');
 * ```
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
}

/**
 * Tipo: Usuario de Supabase Auth
 */
export type SupabaseUser = Awaited<ReturnType<typeof getCurrentUser>>;

/**
 * Tipo: Sesión de Supabase Auth
 */
export type SupabaseSession = Awaited<ReturnType<typeof getCurrentSession>>;
