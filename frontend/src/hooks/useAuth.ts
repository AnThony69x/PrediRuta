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
          
          // Configurar cookies con todas las variantes posibles
          document.cookie = `sb-access-token=${accessToken}; path=/; max-age=3600; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          document.cookie = `supabase-auth-token=${accessToken}; path=/; max-age=3600; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          document.cookie = `sb-auth-token=${accessToken}; path=/; max-age=3600; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          
          if (refreshToken) {
            document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=3600; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          }
          
          if (session.user.user_metadata?.role) {
            document.cookie = `user-role=${session.user.user_metadata.role}; path=/; max-age=3600; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
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
        console.log('Auth state changed:', event, session?.user?.id);

        if (session?.user) {
          // Establecer cookies para el middleware con múltiples nombres para compatibilidad
          const accessToken = session.access_token;
          const refreshToken = session.refresh_token;
          
          // Configurar cookies con todas las variantes posibles
          document.cookie = `sb-access-token=${accessToken}; path=/; max-age=3600; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          document.cookie = `supabase-auth-token=${accessToken}; path=/; max-age=3600; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          document.cookie = `sb-auth-token=${accessToken}; path=/; max-age=3600; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          
          if (refreshToken) {
            document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=3600; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
          }
          
          if (session.user.user_metadata?.role) {
            document.cookie = `user-role=${session.user.user_metadata.role}; path=/; max-age=3600; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
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

          // Redirigir después del login con un pequeño delay para asegurar que las cookies se establezcan
          if (event === 'SIGNED_IN') {
            setTimeout(() => {
              router.push('/dashboard');
            }, 100);
          }
        } else {
          // Limpiar cookies si no hay sesión
          document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'supabase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'sb-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

          setAuthState({ user: null, loading: false, isAuthenticated: false });

          // Redirigir después del logout
          if (event === 'SIGNED_OUT') {
            router.push('/');
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
      // Las cookies se limpiarán automáticamente en el listener
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
  };
};