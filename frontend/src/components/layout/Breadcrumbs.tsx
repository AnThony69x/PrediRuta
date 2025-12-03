'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

// Mapeo de rutas a etiquetas legibles
const ROUTE_LABELS: Record<string, string> = {
  '/': 'Inicio',
  '/dashboard': 'Dashboard',
  '/rutas': 'Rutas',
  '/predicciones': 'Predicciones',
  '/perfil': 'Perfil',
  '/configuracion': 'Configuración',
  '/ayuda': 'Ayuda',
  '/docs': 'Documentación',
  '/historial': 'Historial',
  '/notificaciones': 'Notificaciones',
  '/login': 'Iniciar Sesión',
  '/register': 'Registro',
  '/politica-privacidad': 'Política de Privacidad',
  '/terminos-y-condiciones': 'Términos y Condiciones',
};

export function Breadcrumbs({ hideBreadcrumbs = false }) {
  const pathname = usePathname();

  // No mostrar breadcrumbs en la página de inicio, páginas de auth, o cuando sidebar está cerrado
  if (hideBreadcrumbs || pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return null;
  }

  // Construir array de segmentos de ruta
  const segments = pathname.split('/').filter(Boolean);
  
  // Construir breadcrumb items
  const breadcrumbItems = [
    { label: 'Inicio', path: '/', isHome: true },
    ...segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      const label = ROUTE_LABELS[path] || segment.charAt(0).toUpperCase() + segment.slice(1);
      return { label, path, isHome: false };
    }),
  ];

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="px-4 py-2 bg-white/10 backdrop-blur-sm border-t border-white/10"
    >
      <ol className="flex items-center gap-2 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight 
                  className="w-4 h-4 text-white/60" 
                  aria-hidden="true"
                />
              )}
              
              {isLast ? (
                <span 
                  className="flex items-center gap-1.5 text-white font-medium"
                  aria-current="page"
                >
                  {item.isHome ? (
                    <Home className="w-4 h-4" aria-hidden="true" />
                  ) : null}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="
                    flex items-center gap-1.5 text-white/80 
                    hover:text-white hover:underline 
                    transition-colors
                    focus:outline-none focus:text-white focus:underline
                  "
                >
                  {item.isHome ? (
                    <Home className="w-4 h-4" aria-hidden="true" />
                  ) : null}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
