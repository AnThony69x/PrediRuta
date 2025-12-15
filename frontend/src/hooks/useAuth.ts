'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  // Función para aplicar modo oscuro globalmente
  const applyDarkMode = (isDark: boolean) => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  };

  // Nota: El tema oscuro ahora es manejado por ThemeProvider y useTheme
  // applyDarkMode solo se usa para sincronizar con preferencias de usuario autenticado

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setAuthState({ user: null, loading: false, isAuthenticated: false });
          return;
        }

        if (session?.user) {
          // Establecer cookies para el middleware con múltiples nombres para compatibilidad
          const accessToken = session.access_token;
          const refreshToken = session.refresh_token;
          
          // Configurar cookies con 24 horas de duración para mayor persistencia
          const maxAge = 24 * 60 * 60; // 24 horas en segundos
          document.cookie = `sb-access-token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          document.cookie = `supabase-auth-token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          document.cookie = `sb-auth-token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          
          if (refreshToken) {
            document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          }
          
          if (session.user.user_metadata?.role) {
            document.cookie = `user-role=${session.user.user_metadata.role}; path=/; max-age=${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          }

          // Para usuarios de Google OAuth que no tienen full_name en metadata, usar el nombre del proveedor
          if (!session.user.user_metadata?.full_name && session.user.user_metadata?.full_name !== session.user.user_metadata?.display_name) {
            const displayName = session.user.user_metadata?.name || 
                               session.user.user_metadata?.display_name ||
                               session.user.user_metadata?.full_name;
            
            if (displayName && displayName !== session.user.email) {
              // Actualizar los metadatos del usuario si viene de OAuth y tiene un nombre
              supabase.auth.updateUser({
                data: {
                  full_name: displayName,
                  display_name: displayName
                }
              });
            }
          }

          setAuthState({
            user: session.user,
            loading: false,
            isAuthenticated: true,
          });
          
          // Aplicar preferencias de modo oscuro desde el perfil si están disponibles
          if (session.user.user_metadata?.preferences?.modo_oscuro !== undefined) {
            applyDarkMode(session.user.user_metadata.preferences.modo_oscuro);
          }
        } else {
          // Limpiar cookies si no hay sesión
          document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'supabase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'sb-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          
          setAuthState({ user: null, loading: false, isAuthenticated: false });
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setAuthState({ user: null, loading: false, isAuthenticated: false });
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Solo logear eventos importantes, no INITIAL_SESSION
        if (event !== 'INITIAL_SESSION') {
          console.log('Auth state changed:', event, session?.user?.id);
        }

        if (session?.user) {
          // Establecer cookies para el middleware con múltiples nombres para compatibilidad
          const accessToken = session.access_token;
          const refreshToken = session.refresh_token;
          
          // Configurar cookies con 24 horas de duración para mayor persistencia
          const maxAge = 24 * 60 * 60; // 24 horas en segundos
          document.cookie = `sb-access-token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          document.cookie = `supabase-auth-token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          document.cookie = `sb-auth-token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          
          if (refreshToken) {
            document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          }
          
          if (session.user.user_metadata?.role) {
            document.cookie = `user-role=${session.user.user_metadata.role}; path=/; max-age=${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          }

          // Para usuarios de Google OAuth que no tienen full_name en metadata, usar el nombre del proveedor
          if (!session.user.user_metadata?.full_name && event === 'SIGNED_IN') {
            const displayName = session.user.user_metadata?.name || 
                               session.user.user_metadata?.display_name ||
                               session.user.user_metadata?.full_name;
            
            if (displayName && displayName !== session.user.email) {
              // Actualizar los metadatos del usuario si viene de OAuth y tiene un nombre
              supabase.auth.updateUser({
                data: {
                  full_name: displayName,
                  display_name: displayName
                }
              });
            }
          }

          setAuthState({
            user: session.user,
            loading: false,
            isAuthenticated: true,
          });

          // NO redirigir automáticamente - respetar la página actual
          // La redirección solo ocurrirá en el componente de login explícitamente
        } else {
          // Limpiar cookies si no hay sesión
          document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'supabase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'sb-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

          setAuthState({ user: null, loading: false, isAuthenticated: false });

          // Solo redirigir al logout explícito, no por cambios de pestaña o recargas
          if (event === 'SIGNED_OUT') {
            setTimeout(() => {
              router.push('/');
            }, 100);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Limpieza local inmediata de cookies para asegurar estado consistente
      document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'supabase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'sb-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      // Actualizar estado local inmediatamente
      setAuthState({ user: null, loading: false, isAuthenticated: false });

      // Redirigir explícitamente al inicio para mejorar UX
      try {
        router.push('/');
      } catch (pushError) {
        // En entornos donde router.push pueda fallar silenciosamente, solo loguear
        console.warn('Redirect after signOut failed:', pushError);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const checkPermission = (requiredRole: string): boolean => {
    if (!authState.user) return false;
    
    const userRole = authState.user.user_metadata?.role;
    
    // Jerarquía de roles
    const roleHierarchy = {
      'user': 0,
      'moderator': 1,
      'admin': 2,
      'super_admin': 3
    };

    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
  };

  const requireAuth = (redirectTo = '/unauthorized') => {
    useEffect(() => {
      if (!authState.loading && !authState.isAuthenticated) {
        router.push(redirectTo);
      }
    }, [authState.loading, authState.isAuthenticated, redirectTo]);
  };

  const requirePermission = (requiredRole: string, redirectTo = '/forbidden') => {
    useEffect(() => {
      if (!authState.loading && authState.isAuthenticated && !checkPermission(requiredRole)) {
        router.push(redirectTo);
      }
    }, [authState.loading, authState.isAuthenticated, requiredRole, redirectTo]);
  };

  return {
    ...authState,
    signOut,
    checkPermission,
    requireAuth,
    requirePermission,
    applyDarkMode, // Nueva función para controlar modo oscuro globalmente
  };
};