'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Log error for debugging
    console.error('Error 500:', error);
  }, [error]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 dark:from-gray-900 dark:via-red-900 dark:to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Error Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-1/4 left-1/4 w-16 h-16 text-white/10 animate-float" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
        </svg>
        <svg className="absolute top-1/2 right-1/3 w-12 h-12 text-white/10 animate-float animation-delay-1000" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"/>
        </svg>
        <svg className="absolute bottom-1/4 left-1/2 w-20 h-20 text-white/10 animate-float animation-delay-3000" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
        </svg>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center h-screen w-full px-4 sm:px-6 text-center overflow-hidden">
        <div className="w-full">
          {/* 500 Number with Gradient */}
          <div className="mb-4 w-full flex justify-center items-center">
            <h1 className="big-500 font-black bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-pulse text-center"
                style={{
                  letterSpacing: '-0.05em'
                }}>
              500
            </h1>
          </div>

          {/* Main Message */}
          <div className="mb-6 space-y-3 px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              🚨 Error interno del servidor
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-lg mx-auto leading-relaxed px-2">
              Algo salió mal en nuestro sistema.
              <br className="hidden sm:block" />
              Nuestro equipo ha sido notificado y está trabajando en una solución.
            </p>
            {error.digest && (
              <p className="text-xs text-red-300 opacity-70 mt-2">
                ID del error: {error.digest}
              </p>
            )}
          </div>

          {/* Decorative Error Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-2xl animate-pulse">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <button
              onClick={reset}
              className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-full hover:from-red-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Intentar de nuevo
              </span>
            </button>

            <Link
              href="/"
              className="group px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
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
        
        .big-500 {
          font-size: 80px !important;
          line-height: 70px !important;
        }
        
        @media (min-width: 640px) {
          .big-500 {
            font-size: 100px !important;
            line-height: 90px !important;
          }
        }
        
        @media (min-width: 768px) {
          .big-500 {
            font-size: 120px !important;
            line-height: 110px !important;
          }
        }
        
        @media (min-width: 1024px) {
          .big-500 {
            font-size: 140px !important;
            line-height: 130px !important;
          }
        }
        
        @media (min-width: 1280px) {
          .big-500 {
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