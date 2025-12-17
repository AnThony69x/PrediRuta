'use client';

import { useState, useRef, useEffect } from 'react';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { LanguageSelector } from './LanguageSelector';
import { Breadcrumbs } from './Breadcrumbs';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { UserAvatar } from '../ui/user-avatar';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Menu, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  showSearch?: boolean;
  showBreadcrumbs?: boolean;
  sidebarOpen?: boolean;
}

export function Header({ 
  onMenuClick, 
  showSearch = true, 
  showBreadcrumbs = true,
  sidebarOpen = true
}: HeaderProps) {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-blue-800 dark:via-cyan-800 dark:to-indigo-800 shadow-lg">
      {/* Barra principal de navegación */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Lado izquierdo: Menú hamburguesa + Logo + Búsqueda */}
          <div className="flex items-center gap-4 flex-1">
            {/* Botón de menú (visible en móvil y desktop si hay sidebar) */}
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="
                  p-2 rounded-lg 
                  text-white hover:bg-white/10 
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-white/50
                  lg:hidden
                "
                aria-label="Abrir menú de navegación"
                title="Alt+S para alternar menú"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Logo */}
            <Logo size="md" showText={true} />

            {/* Barra de búsqueda - oculta en móvil pequeño */}
            {showSearch && (
              <div className="hidden md:block flex-1 max-w-xl">
                <SearchBar />
              </div>
            )}
          </div>

          {/* Lado derecho: Idioma + Theme + Usuario/Auth */}
          <div className="flex items-center gap-3">
            {/* Selector de idioma */}
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            {/* Toggle de tema oscuro */}
            <ThemeToggle />

            {/* Usuario autenticado o botones de auth */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Menú desplegable de usuario */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="group hidden sm:flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <UserAvatar user={user} size="sm" showName={false} />
                    <span className="text-sm text-white/90 group-hover:text-white hidden lg:block">
                      {user.user_metadata?.full_name?.split(' ')[0] || 'Usuario'}
                    </span>
                  </button>

                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/perfil"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Mi Perfil</span>
                        </Link>
                        <Link
                          href="/configuracion"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Configuración</span>
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t('header.logout')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Menú móvil simple */}
                <div className="sm:hidden">
                  <UserAvatar user={user} size="sm" showName={false} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="
                    px-3 py-1.5 text-sm font-medium text-white 
                    hover:text-cyan-200 dark:hover:text-cyan-300 
                    hover:scale-105 transition-all duration-300
                    hidden sm:block
                  "
                >
                  {t('header.login')}
                </Link>
                <Link 
                  href="/register" 
                  className="
                    px-4 py-1.5 text-sm font-medium 
                    text-blue-600 dark:text-blue-400 
                    bg-white dark:bg-gray-800 
                    rounded-full 
                    hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 
                    dark:hover:from-gray-700 dark:hover:to-gray-600 
                    hover:text-blue-700 dark:hover:text-blue-300 
                    hover:scale-105 transform transition-all duration-300 
                    shadow-md
                  "
                >
                  {t('header.register')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Barra de búsqueda móvil (debajo del header principal) */}
        {showSearch && (
          <div className="md:hidden mt-3">
            <SearchBar />
          </div>
        )}
      </div>
    </header>
  );
}
