'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Unauthorized() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 dark:from-gray-900 dark:via-blue-900 dark:to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Authentication Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-1/4 left-1/4 w-16 h-16 text-white/10 animate-float" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16.5V16.5H7.5V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
        </svg>
        <svg className="absolute top-1/2 right-1/3 w-12 h-12 text-white/10 animate-float animation-delay-1000" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
        </svg>
        <svg className="absolute bottom-1/4 left-1/2 w-20 h-20 text-white/10 animate-float animation-delay-3000" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"/>
        </svg>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center h-screen w-full px-4 sm:px-6 text-center overflow-hidden">
        <div className="w-full">
          {/* 401 Number with Gradient */}
          <div className="mb-4 w-full flex justify-center items-center">
            <h1 className="big-401 font-black bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-pulse text-center"
                style={{
                  letterSpacing: '-0.05em'
                }}>
              401
            </h1>
          </div>

          {/* Main Message */}
          <div className="mb-6 space-y-3 px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              🔐 Acceso no autorizado
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-lg mx-auto leading-relaxed px-2">
              Necesitas iniciar sesión para acceder a esta página.
              <br className="hidden sm:block" />
              Por favor, autentícate para continuar con PrediRuta.
            </p>
          </div>

          {/* Decorative Lock Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-2xl animate-bounce">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16.5V16.5H7.5V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <Link
              href="/login"
              className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Iniciar sesión
              </span>
            </Link>

            <Link
              href="/register"
              className="group px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Crear cuenta
              </span>
            </Link>

            <Link
              href="/"
              className="group px-6 py-3 sm:px-8 sm:py-4 bg-transparent text-gray-300 font-medium rounded-full hover:text-white hover:bg-white/5 transition-all duration-300 text-sm sm:text-base"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Volver al inicio
              </span>
            </Link>
          </div>
        </div>
      </main>

      {/* Custom Styles */}
      <style jsx global>{`
        html, body {
          height: 100%;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        
        #__next {
          height: 100%;
        }
        
        .big-401 {
          font-size: 80px !important;
          line-height: 70px !important;
        }
        
        @media (min-width: 640px) {
          .big-401 {
            font-size: 100px !important;
            line-height: 90px !important;
          }
        }
        
        @media (min-width: 768px) {
          .big-401 {
            font-size: 120px !important;
            line-height: 110px !important;
          }
        }
        
        @media (min-width: 1024px) {
          .big-401 {
            font-size: 140px !important;
            line-height: 130px !important;
          }
        }
        
        @media (min-width: 1280px) {
          .big-401 {
            font-size: 160px !important;
            line-height: 150px !important;
          }
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
}