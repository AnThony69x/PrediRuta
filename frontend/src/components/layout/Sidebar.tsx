'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Map, 
  TrendingUp, 
  Clock,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Bot
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface MenuItem {
  id: number;
  label: string;
  href: string;
  icon: any;
  shortcut: string;
  description?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function Sidebar({ isOpen, onToggle, className = '' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  // Ítems del menú con traducciones dinámicas
  const MENU_ITEMS: MenuItem[] = [
    { 
      id: 1, 
      label: t('sidebar.dashboard'), 
      href: '/dashboard', 
      icon: Home, 
      shortcut: '1',
      description: t('sidebar.dashboard.desc')
    },
    { 
      id: 2, 
      label: t('sidebar.routes'), 
      href: '/rutas', 
      icon: Map, 
      shortcut: '2',
      description: t('sidebar.routes.desc')
    },
    { 
      id: 3, 
      label: t('sidebar.predictions'), 
      href: '/predicciones', 
      icon: TrendingUp, 
      shortcut: '3',
      description: t('sidebar.predictions.desc')
    },
    { 
      id: 4, 
      label: t('sidebar.history'), 
      href: '/historial', 
      icon: Clock, 
      shortcut: '4',
      description: t('sidebar.history.desc')
    },
    { 
      id: 5, 
      label: t('sidebar.assistant'), 
      href: '#', 
      icon: Bot, 
      shortcut: '5',
      description: t('sidebar.assistant.desc')
    },
  ];

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+S: Toggle sidebar
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onToggle();
      }
      
      // Alt+1-5: Navegar directamente a secciones
      if (e.altKey && /^[1-5]$/.test(e.key)) {
        e.preventDefault();
        const item = MENU_ITEMS.find(i => i.shortcut === e.key);
        if (item) {
          if (item.href === '#') {
            // Asistente Virtual - mostrar alerta temporal
            alert('El asistente virtual se integrará próximamente con IA avanzada.');
          } else {
            router.push(item.href);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onToggle, router]);

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="
            fixed inset-0 bg-black/50 z-30 
            lg:hidden
          "
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] z-40
          bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-16'}
          ${className}
        `}
        aria-label="Navegación principal"
        aria-hidden={!isOpen}
      >
        <nav className="h-full flex flex-col p-4">
          {/* Menú principal */}
          <ul className="space-y-2 flex-1" role="menu">
            {MENU_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <li key={item.id} role="none">
                  {item.href === '#' ? (
                    <button
                      type="button"
                      onClick={() => {
                        alert('El asistente virtual se integrará próximamente con IA avanzada.');
                      }}
                      role="menuitem"
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg 
                        transition-all duration-200
                        group relative w-full text-left
                        text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        ${!isOpen ? 'justify-center' : ''}
                      `}
                      title={`${item.label} (Alt+${item.shortcut})`}
                    >
                      {/* Icono */}
                      <Icon 
                        className="w-5 h-5 shrink-0 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                      />
                      
                      {/* Texto y atajo (visible cuando está expandido) */}
                      {isOpen && (
                        <>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {item.label}
                            </p>
                            {item.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <kbd 
                            className="
                              hidden lg:inline-flex items-center justify-center
                              px-1.5 py-0.5 
                              text-xs font-mono 
                              bg-gray-200 dark:bg-gray-700 
                              text-gray-600 dark:text-gray-300
                              rounded
                              opacity-0 group-hover:opacity-100
                              transition-opacity
                            "
                          >
                            Alt+{item.shortcut}
                          </kbd>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      role="menuitem"
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg 
                        transition-all duration-200
                        group relative
                        ${!isOpen ? 'justify-center' : ''}
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 text-blue-700 dark:text-blue-300 shadow-sm' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      `}
                      title={`${item.label} (Alt+${item.shortcut})`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Icono */}
                      <Icon 
                        className={`
                          w-5 h-5 shrink-0
                          ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}
                        `}
                        aria-hidden="true"
                      />
                      
                      {/* Texto y atajo (visible cuando está expandido) */}
                      {isOpen && (
                        <>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${isActive ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                              {item.label}
                            </p>
                            {item.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <kbd 
                            className="
                              hidden lg:inline-flex items-center justify-center
                              px-1.5 py-0.5 
                              text-xs font-mono 
                              bg-gray-200 dark:bg-gray-700 
                              text-gray-600 dark:text-gray-300
                              rounded
                              opacity-0 group-hover:opacity-100
                              transition-opacity
                            "
                          >
                            Alt+{item.shortcut}
                          </kbd>
                        </>
                      )}

                      {/* Indicador de activo */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 dark:bg-blue-400 rounded-r" />
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Sección de ayuda en la parte inferior */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/ayuda"
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${!isOpen ? 'justify-center' : ''}
              `}
            >
              <HelpCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              {isOpen && <span className="text-sm">{t('sidebar.help')}</span>}
            </Link>
          </div>
        </nav>

        {/* Botón de toggle (visible solo en desktop) */}
        <button
          onClick={onToggle}
          className="
            hidden lg:flex
            absolute -right-3 top-6 
            items-center justify-center
            w-6 h-6 
            bg-blue-600 dark:bg-blue-500
            text-white 
            rounded-full 
            shadow-lg
            hover:bg-blue-700 dark:hover:bg-blue-600
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-colors
            z-50
          "
          aria-label={isOpen ? 'Contraer menú lateral' : 'Expandir menú lateral'}
          title="Alt+S para alternar"
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          )}
        </button>

        {/* Ayuda de atajos (tooltip al pasar el mouse cuando está colapsado) */}
        {!isOpen && (
          <div className="hidden lg:block absolute left-full ml-2 top-20 w-48 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg p-3 shadow-xl">
              <p className="font-semibold mb-2">Atajos de teclado:</p>
              <ul className="space-y-1">
                <li><kbd className="bg-gray-700 px-1 rounded">Alt+S</kbd> Toggle menú</li>
                <li><kbd className="bg-gray-700 px-1 rounded">Alt+1-5</kbd> Navegación rápida</li>
              </ul>
            </div>
          </div>
        )}
      </aside>

      {/* Espaciador para el contenido principal (solo desktop) */}
      <div 
        className={`
          hidden lg:block
          transition-all duration-300
          ${isOpen ? 'w-64' : 'w-16'}
        `}
        aria-hidden="true"
      />
    </>
  );
}
