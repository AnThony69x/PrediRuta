import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = [
  '/dashboard',
  '/predicciones',
  '/rutas',
  '/profile',
  '/settings'
];

// Rutas que requieren permisos especiales (admin, etc.)
const adminRoutes = [
  '/admin',
  '/admin/users',
  '/admin/settings'
];

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/unauthorized',
  '/forbidden',
  '/not-found',
  '/test-error'
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Si es una ruta pública o de sistema, permitir acceso
  if (publicRoutes.includes(pathname) || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Verificar rutas protegidas
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute || isAdminRoute) {
    // Verificar si hay token de autenticación en las cookies
    const token = req.cookies.get('sb-access-token') || req.cookies.get('supabase-auth-token');
    
    // Si no hay token, redirigir a página 401
    if (!token) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Para rutas de admin, hacer verificación adicional
    if (isAdminRoute) {
      // Aquí podrías hacer una verificación más específica del rol
      // Por ahora, redirigimos a forbidden para demostrar la funcionalidad
      const userRole = req.cookies.get('user-role')?.value;
      const isAdmin = userRole === 'admin' || userRole === 'super_admin';

      if (!isAdmin) {
        return NextResponse.redirect(new URL('/forbidden', req.url));
      }
    }

    // Verificar permisos específicos para ciertas rutas
    if (pathname.startsWith('/rutas/admin') || pathname.startsWith('/predicciones/admin')) {
      const userRole = req.cookies.get('user-role')?.value;
      const hasAdminAccess = userRole === 'admin' || userRole === 'super_admin' || userRole === 'moderator';

      if (!hasAdminAccess) {
        return NextResponse.redirect(new URL('/forbidden', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};