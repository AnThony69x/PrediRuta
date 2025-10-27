import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación (el middleware será menos agresivo)
const protectedRoutes = [
  // '/dashboard', // Permitir que el dashboard maneje su propia autenticación
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
  '/dashboard',  // Dashboard - Protegido del lado del cliente
  '/forgot-password', // Recuperar contraseña
  '/reset-password',  // Resetear contraseña
  '/terminos-y-condiciones', // Términos y Condiciones
  '/politica-privacidad',    // Política de Privacidad
  '/docs',       // Documentación - Acceso a guías
  '/ayuda',      // Ayuda - Resolver dudas
  '/404',        // Error - Página no encontrada
  '/500',        // Error interno del servidor
  '/callback',      // Callback de autenticación en (auth)
  '/errors/not-found',     // Error 404 específico
  '/errors/error',         // Error 500 específico
  '/errors/unauthorized',  // Error 401
  '/errors/forbidden',     // Error 403
  '/errors/unavailable',   // Error 502/503
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
    const tokenCookie = req.cookies.get('sb-access-token') || 
                       req.cookies.get('supabase-auth-token') ||
                       req.cookies.get('sb-auth-token') ||
                       req.cookies.get('supabase.auth.token') ||
                       req.cookies.get('sb-refresh-token');
    
    const token = tokenCookie?.value;
    
    // Si no hay token válido, redirigir a página 401 (No autorizado)
    if (!token || token.length < 10) {
      return NextResponse.redirect(new URL('/errors/unauthorized', req.url));
    }

    // Token válido encontrado, continuar con la verificación

    // Para rutas de admin, hacer verificación adicional
    if (isAdminRoute) {
      const userRole = req.cookies.get('user-role')?.value;
      const isAdmin = userRole === 'admin' || userRole === 'super_admin';

      if (!isAdmin) {
        return NextResponse.redirect(new URL('/errors/forbidden', req.url));
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
        return NextResponse.redirect(new URL('/errors/forbidden', req.url));
      }
    }
  }

  // Verificar si la ruta existe en nuestras rutas conocidas
  const allKnownRoutes = [...publicRoutes, ...protectedRoutes, ...adminRoutes];
  const isKnownRoute = allKnownRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Si la ruta no existe en nuestras rutas definidas y no es una ruta de sistema, redirigir a 404
  if (!isKnownRoute && 
      !pathname.startsWith('/_next/') && 
      !pathname.startsWith('/api/') && 
      !pathname.includes('.') &&
      pathname !== '/favicon.ico') {
    return NextResponse.redirect(new URL('/errors/not-found', req.url));
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