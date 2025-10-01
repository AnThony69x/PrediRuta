'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  ),
}) => {
  const { loading, isAuthenticated, checkPermission } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <>{fallback}</>;
  }

  // Si no está autenticado, el middleware ya habrá redirigido
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Si se requiere un rol específico, verificar permisos
  if (requiredRole && !checkPermission(requiredRole)) {
    return <>{fallback}</>;
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