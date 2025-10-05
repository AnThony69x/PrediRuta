'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback = (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Verificando autenticación...</p>
      </div>
    </div>
  ),
}) => {
  const { loading, isAuthenticated, checkPermission } = useAuth();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  useEffect(() => {
    // Dar más tiempo antes de redirigir para evitar redirecciones prematuras
    let redirectTimer: NodeJS.Timeout;
    
    if (!loading && !isAuthenticated) {
      redirectTimer = setTimeout(() => {
        console.log('Usuario no autenticado después de timeout, redirigiendo al login...');
        setShouldRedirect(true);
        router.push('/login');
      }, 2000); // Esperar 2 segundos antes de redirigir
    } else if (isAuthenticated) {
      setShouldRedirect(false);
    }
    
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [loading, isAuthenticated, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <>{fallback}</>;
  }

  // Si no está autenticado y no se ha decidido redirigir aún, mostrar loading
  if (!isAuthenticated && !shouldRedirect) {
    return <>{fallback}</>;
  }

  // Si no está autenticado y ya se decidió redirigir, mostrar mensaje
  if (!isAuthenticated && shouldRedirect) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  // Si se requiere un rol específico, verificar permisos
  if (requiredRole && !checkPermission(requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Acceso denegado</h2>
          <p className="text-gray-600 dark:text-gray-300">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Hook para usar en páginas individuales
export const useRequireAuth = () => {
  const auth = useAuth();
  
  React.useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      // El middleware ya manejará la redirección
      console.log('User not authenticated, middleware will redirect');
    }
  }, [auth.loading, auth.isAuthenticated]);

  return auth;
};

// Hook para requerir permisos específicos
export const useRequirePermission = (requiredRole: string) => {
  const auth = useAuth();
  
  React.useEffect(() => {
    if (!auth.loading && auth.isAuthenticated && !auth.checkPermission(requiredRole)) {
      // El middleware ya manejará la redirección
      console.log(`User doesn't have required role: ${requiredRole}`);
    }
  }, [auth.loading, auth.isAuthenticated, requiredRole, auth.checkPermission]);

  return auth;
};