'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { HelpCircle, BookOpen, Mail } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* System info */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              PrediRuta
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('footer.systemName')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {t('footer.version')} 2.0
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Enlaces Rápidos
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/ayuda"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                {t('footer.help')}
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                {t('footer.documentation')}
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                {t('footer.contact')}
              </Link>
            </nav>
          </div>

          {/* Legal info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Información Legal
            </h4>
            <div className="space-y-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                © {currentYear} PrediRuta
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('footer.rights')}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 my-6"></div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
          <p>
            Desarrollado con tecnología de predicción basada en IA
          </p>
          <div className="flex gap-4">
            <Link 
              href="/privacidad" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacidad
            </Link>
            <Link 
              href="/terminos" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
