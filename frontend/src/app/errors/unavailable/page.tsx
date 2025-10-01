'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Unavailable() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 dark:from-gray-900 dark:via-orange-900 dark:to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Service Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-1/4 left-1/4 w-16 h-16 text-white/10 animate-float" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/>
        </svg>
        <svg className="absolute top-1/2 right-1/3 w-12 h-12 text-white/10 animate-float animation-delay-1000" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,3L2,12H5V20H19V12H22L12,3M12,8.75A2.25,2.25 0 0,1 14.25,11A2.25,2.25 0 0,1 12,13.25A2.25,2.25 0 0,1 9.75,11A2.25,2.25 0 0,1 12,8.75Z"/>
        </svg>
        <svg className="absolute bottom-1/4 left-1/2 w-20 h-20 text-white/10 animate-float animation-delay-3000" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
        </svg>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center h-screen w-full px-4 sm:px-6 text-center overflow-hidden">
        <div className="w-full">
          {/* 503 Number with Gradient */}
          <div className="mb-4 w-full flex justify-center items-center">
            <h1 className="big-503 font-black bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse text-center"
                style={{
                  letterSpacing: '-0.05em'
                }}>
              503
            </h1>
          </div>

          {/* Main Message */}
          <div className="mb-6 space-y-3 px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              🚧 Servicio no disponible
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-lg mx-auto leading-relaxed px-2">
              PrediRuta está temporalmente fuera de servicio.
              <br className="hidden sm:block" />
              Estamos trabajando para restablecer el servicio lo antes posible.
            </p>
          </div>

          {/* Decorative Maintenance Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-2xl animate-pulse">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <button
              onClick={() => window.location.reload()}
              className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl text-sm sm:text-base"
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

          {/* Status Message */}
          <div className="mt-8 px-4">
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Si el problema persiste, puedes contactarnos en soporte@prediruta.com
            </p>
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
        
        .big-503 {
          font-size: 80px !important;
          line-height: 70px !important;
        }
        
        @media (min-width: 640px) {
          .big-503 {
            font-size: 100px !important;
            line-height: 90px !important;
          }
        }
        
        @media (min-width: 768px) {
          .big-503 {
            font-size: 120px !important;
            line-height: 110px !important;
          }
        }
        
        @media (min-width: 1024px) {
          .big-503 {
            font-size: 140px !important;
            line-height: 130px !important;
          }
        }
        
        @media (min-width: 1280px) {
          .big-503 {
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