import Link from "next/link";
import { Header } from "../components/layout/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
      {/* Header unificado - sin búsqueda ni breadcrumbs en landing */}
      <Header showSearch={false} showBreadcrumbs={false} />

      {/* Contenido principal */}
      <main id="main-content" className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          {/* Ícono de carro con IA */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Carro */}
              <svg 
                className="w-20 h-20 sm:w-24 sm:h-24 text-blue-600 dark:text-blue-400" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
              {/* Badge IA con animación */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                IA
              </div>
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-blue-400 dark:bg-blue-600 opacity-20 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 px-4">
            Optimiza tus rutas con IA
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Sistema inteligente de predicción de tráfico y optimización de rutas 
            que te ayuda a llegar más rápido a tu destino.
          </p>
          
          {/* Botones de acción principales */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link 
              href="/register" 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 dark:hover:from-blue-600 dark:hover:to-cyan-600 hover:scale-105 transform transition-all duration-300 text-base sm:text-lg font-medium text-center shadow-lg hover:shadow-xl"
            >
              Comenzar Gratis
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-3 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full hover:from-blue-50 hover:to-cyan-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-105 transform transition-all duration-300 text-base sm:text-lg font-medium text-center shadow-md hover:shadow-lg"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
        
        {/* Características principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center border border-blue-100 dark:border-blue-800">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-white">Predicción Inteligente</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Algoritmos avanzados que predicen el tráfico en tiempo real 
              para optimizar tus rutas.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-cyan-50 dark:from-gray-800 dark:to-cyan-900/50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center border border-cyan-100 dark:border-cyan-800">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-white">Rutas Optimizadas</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Encuentra las mejores rutas considerando tráfico, distancia 
              y tiempo de viaje.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center border border-blue-100 dark:border-blue-800 lg:col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-white">Dashboard Completo</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Visualiza estadísticas detalladas de tus viajes y 
              mejora tu planificación.
            </p>
          </div>
        </div>

        {/* Sección Predicción Inteligente */}
        <section className="mt-16 sm:mt-24 py-12 sm:py-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  Predicción Inteligente de Tráfico
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Nuestros algoritmos de inteligencia artificial analizan patrones de tráfico históricos, 
                  eventos en tiempo real y condiciones climáticas para predecir el flujo vehicular.
                </p>
                  <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Análisis en Tiempo Real</h4>
                      <p className="text-gray-600 dark:text-gray-300">Procesamiento continuo de datos de tráfico actuales</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Aprendizaje Automático</h4>
                      <p className="text-gray-600 dark:text-gray-300">El sistema mejora sus predicciones con cada viaje</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Precisión del 95%</h4>
                      <p className="text-gray-600 dark:text-gray-300">Predicciones altamente confiables para tu planificación</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 dark:from-blue-900/50 dark:via-indigo-900/50 dark:to-purple-800/50 rounded-2xl p-8 h-80 flex items-center justify-center shadow-lg border border-blue-200 dark:border-blue-700">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-blue-700 dark:text-blue-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="text-blue-700 dark:text-blue-300 font-bold text-lg">IA en Acción</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Rutas Optimizadas */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-cyan-50 via-teal-50 to-emerald-50 dark:from-gray-800 dark:via-cyan-900/30 dark:to-teal-900/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <div className="bg-gradient-to-br from-cyan-100 via-teal-100 to-emerald-200 dark:from-cyan-900/50 dark:via-teal-900/50 dark:to-emerald-800/50 rounded-2xl p-8 h-80 flex items-center justify-center shadow-lg border border-cyan-200 dark:border-cyan-700">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-cyan-700 dark:text-cyan-300 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-cyan-700 dark:text-cyan-300 font-bold text-lg">Rutas Inteligentes</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 dark:from-cyan-600 dark:to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  Rutas Optimizadas para Cada Situación
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Calculamos múltiples rutas alternativas considerando todos los factores que afectan tu viaje, 
                  desde el tráfico hasta las preferencias personales.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Múltiples Opciones</h4>
                      <p className="text-gray-600 dark:text-gray-300">Ruta más rápida, más corta o más económica</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Evita Congestiones</h4>
                      <p className="text-gray-600 dark:text-gray-300">Actualización automática ante cambios de tráfico</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Personalización</h4>
                      <p className="text-gray-600 dark:text-gray-300">Adapta las rutas según tus preferencias de conducción</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Dashboard Completo */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-violet-900/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 dark:from-purple-600 dark:to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  Dashboard de Análisis Avanzado
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Obtén insights detallados sobre tus patrones de viaje, ahorra tiempo y combustible 
                  con estadísticas personalizadas y recomendaciones inteligentes.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Estadísticas Detalladas</h4>
                      <p className="text-gray-600 dark:text-gray-300">Tiempo ahorrado, combustible y emisiones reducidas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Historial de Viajes</h4>
                      <p className="text-gray-600 dark:text-gray-300">Registro completo con métricas de rendimiento</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Reportes Personalizados</h4>
                      <p className="text-gray-600 dark:text-gray-300">Exporta datos para análisis empresarial o personal</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-gradient-to-br from-purple-100 via-violet-100 to-indigo-200 dark:from-purple-900/50 dark:via-violet-900/50 dark:to-indigo-800/50 rounded-2xl p-8 h-80 flex items-center justify-center shadow-lg border border-purple-200 dark:border-purple-700">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-purple-700 dark:text-purple-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-purple-700 dark:text-purple-300 font-bold text-lg">Analytics Avanzados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Beneficios Adicionales */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8">
              Más que una App de Rutas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-xl p-6 text-white hover:bg-opacity-20 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <svg className="w-12 h-12 mx-auto mb-4 text-blue-200 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-xl font-semibold mb-3 text-blue-200">Velocidad</h3>
                <p className="text-blue-100">
                  Reduce hasta un 30% el tiempo de viaje con nuestras predicciones inteligentes
                </p>
              </div>
              <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-xl p-6 text-white hover:bg-opacity-20 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <svg className="w-12 h-12 mx-auto mb-4 text-cyan-200 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <h3 className="text-xl font-semibold mb-3 text-cyan-200">Ahorro</h3>
                <p className="text-blue-100">
                  Optimiza el consumo de combustible y reduce costos operativos
                </p>
              </div>
              <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-xl p-6 text-white hover:bg-opacity-20 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <svg className="w-12 h-12 mx-auto mb-4 text-blue-200 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-3 text-blue-200">Sostenibilidad</h3>
                <p className="text-blue-100">
                  Contribuye al medio ambiente reduciendo emisiones de CO₂
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Final */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              ¿Listo para Optimizar tus Rutas?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Únete a miles de usuarios que ya están ahorrando tiempo y dinero 
              con PrediRuta. Comienza tu prueba gratuita hoy mismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 text-white rounded-full hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:via-indigo-600 dark:hover:to-purple-600 hover:scale-105 transform transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                Comenzar Ahora - Gratis
              </Link>
              <Link 
                href="/login" 
                className="px-8 py-4 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-105 transform transition-all duration-300 text-lg font-medium shadow-md hover:shadow-lg"
              >
                Ver Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}