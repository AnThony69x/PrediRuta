'use client';

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
import { Menu } from 'lucide-react';

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
                <Link href="/perfil" className="group hidden sm:block">
                  <div className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 transition-colors">
                    <UserAvatar user={user} size="sm" showName={false} />
                    <span className="text-sm text-white/90 group-hover:text-white hidden lg:block">
                      {user.user_metadata?.full_name?.split(' ')[0] || 'Usuario'}
                    </span>
                  </div>
                </Link>
                
                <Button
                  variant="outline"
                  onClick={signOut}
                  className="
                    hidden sm:flex
                    border-white/30 dark:border-white/30 
                    bg-white/10 dark:bg-white/10
                    text-white dark:text-white 
                    hover:bg-white/20 dark:hover:bg-white/20 
                    hover:border-white/50 dark:hover:border-white/50
                    text-xs px-3 py-1
                    font-medium
                    shadow-sm
                  "
                >
                  {t('header.logout')}
                </Button>

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
