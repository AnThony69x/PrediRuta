'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

function AuthCallbackContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Obtener el código de autorización de la URL
        const code = searchParams.get('code');
        console.log('Código recibido:', code);
        
        if (code) {
          // Intercambiar el código por una sesión
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Error en el callback de autenticación:', error);
            setError('Error al procesar la autenticación: ' + error.message);
            return;
          }

          console.log('Datos de sesión:', data);

          if (data?.session?.user) {
            console.log('Usuario autenticado:', data.session.user.email);
            setTimeout(() => {
              router.push('/dashboard');
            }, 1000);
            return;
          }
        }

        // Si no hay código, verificar si hay una sesión activa
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error al obtener sesión:', sessionError);
          setError('Error al verificar la sesión');
          return;
        }

        console.log('Sesión actual:', session);
        
        if (session?.user) {
          console.log('Sesión activa encontrada, redirigiendo...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          console.log('No hay sesión activa, redirigiendo al login');
          setTimeout(() => {
            router.push('/login?error=auth_failed');
          }, 2000);
        }
      } catch (err) {
        console.error('Error inesperado:', err);
        setError('Error inesperado durante la autenticación');
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [router, searchParams, supabase.auth]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">Error de autenticación</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-cyan-900 to-blue-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mb-6 animate-spin">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Procesando autenticación</h1>
          <p className="text-gray-300 mb-6">
            Estamos completando tu inicio de sesión con Google...
          </p>
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animation-delay-200"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animation-delay-400"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
