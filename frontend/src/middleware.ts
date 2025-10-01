import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = [
  '/dashboard',
  '/rutas',
  '/predicciones',
  '/perfil'
];

// Rutas que requieren permisos especiales (admin, etc.)
const adminRoutes = [
  '/admin',
  '/admin/users',
  '/admin/settings'
];

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/',           // Inicio - Introducir el sistema
  '/register',   // Registro - Crear cuenta
  '/login',      // Inicio de Sesión - Autenticar usuario
  '/docs',       // Documentación - Acceso a guías
  '/ayuda',      // Ayuda - Resolver dudas
  '/404',        // Error - Página no encontrada
  '/500',        // Error interno del servidor
  '/unauthorized',  // Error 401
  '/forbidden',     // Error 403
  '/not-found',     // Alias para 404
  '/test-error',    // Para pruebas
  '/auth/callback', // Callback de autenticación
  '/auth/401',      // Página de error 401
  '/auth/403'       // Página de error 403
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Si es una ruta pública, de sistema o archivos estáticos, permitir acceso
  if (publicRoutes.includes(pathname) || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/') ||
      pathname.startsWith('/images/') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Verificar rutas protegidas
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute || isAdminRoute) {
    // Verificar si hay token de autenticación en las cookies
    const token = req.cookies.get('sb-access-token') || 
                  req.cookies.get('supabase-auth-token') ||
                  req.cookies.get('sb-auth-token');
    
    // Si no hay token, redirigir a página 401 (No autorizado)
    if (!token) {
      return NextResponse.redirect(new URL('/auth/401', req.url));
    }

    // Para rutas de admin, hacer verificación adicional
    if (isAdminRoute) {
      const userRole = req.cookies.get('user-role')?.value;
      const isAdmin = userRole === 'admin' || userRole === 'super_admin';

      if (!isAdmin) {
        return NextResponse.redirect(new URL('/auth/403', req.url));
      }
    }

    // Verificar permisos específicos para sub-rutas administrativas
    if (pathname.startsWith('/rutas/admin') || 
        pathname.startsWith('/predicciones/admin') ||
        pathname.startsWith('/perfil/admin')) {
      const userRole = req.cookies.get('user-role')?.value;
      const hasAdminAccess = userRole === 'admin' || 
                            userRole === 'super_admin' || 
                            userRole === 'moderator';

      if (!hasAdminAccess) {
        return NextResponse.redirect(new URL('/auth/403', req.url));
      }
    }
  }

  // Si la ruta no existe en nuestras rutas definidas, redirigir a 404
  const allKnownRoutes = [...publicRoutes, ...protectedRoutes, ...adminRoutes];
  const isKnownRoute = allKnownRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (!isKnownRoute && !pathname.startsWith('/_next/') && !pathname.startsWith('/api/')) {
    return NextResponse.redirect(new URL('/404', req.url));
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