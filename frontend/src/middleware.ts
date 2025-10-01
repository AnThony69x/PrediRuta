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
  '/forgot-password', // Recuperar contraseña
  '/reset-password',  // Resetear contraseña
  '/docs',       // Documentación - Acceso a guías
  '/ayuda',      // Ayuda - Resolver dudas
  '/404',        // Error - Página no encontrada
  '/500',        // Error interno del servidor
  '/unauthorized',  // Error 401
  '/forbidden',     // Error 403
  '/not-found',     // Alias para 404
  '/test-error',    // Para pruebas
  '/auth/callback', // Callback de autenticación
  '/auth/confirm', // Confirmación de email
  '/auth/sign-up', // Registro alternativo
  '/auth/sign-in', // Login alternativo
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

  // Para rutas protegidas, permitir acceso y dejar que el cliente maneje la autenticación
  // Esto evita problemas de cookies y timing
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