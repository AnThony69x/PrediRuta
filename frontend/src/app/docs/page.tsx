"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Book, 
  FileText, 
  Code, 
  Download,
  Eye,
  Network,
  Users,
  Shield,
  CheckCircle
} from "lucide-react";

export default function DocsPage() {
  const [seccionActiva, setSeccionActiva] = useState('guia-usuario');

  const secciones = [
    { id: 'guia-usuario', nombre: 'Gu\u00eda de Usuario', icono: Book },
    { id: 'diagramas', nombre: 'Diagramas UML', icono: Network },
    { id: 'api', nombre: 'Documentaci\u00f3n API', icono: Code },
    { id: 'accesibilidad', nombre: 'Informe de Accesibilidad', icono: Eye },
    { id: 'descargas', nombre: 'Descargas', icono: Download },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <FileText className="w-8 h-8 mr-3" />
            Documentaci\u00f3n T\u00e9cnica
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gu\u00edas, manuales y documentaci\u00f3n t\u00e9cnica del sistema PrediRuta 2.0
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de navegaci\u00f3n */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sticky top-24">
              <nav className="space-y-2">
                {secciones.map(seccion => {
                  const Icono = seccion.icono;
                  return (
                    <button
                      key={seccion.id}
                      onClick={() => setSeccionActiva(seccion.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        seccionActiva === seccion.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icono className="w-5 h-5" />
                      <span className="font-medium text-sm">{seccion.nombre}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              
              {seccionActiva === 'guia-usuario' && (
                <div className="prose dark:prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Gu\u00eda de Usuario</h2>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">1. Introducci\u00f3n</h3>
                  <p>PrediRuta 2.0 es un sistema inteligente de predicci\u00f3n de tr\u00e1fico que utiliza IA para optimizar tus rutas.</p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">2. Primeros Pasos</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Reg\u00edstrate o inicia sesi\u00f3n en el sistema</li>
                    <li>Completa tu perfil en la secci\u00f3n "Perfil"</li>
                    <li>Configura tus preferencias en "Configuraci\u00f3n"</li>
                    <li>Activa las notificaciones para recibir alertas</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">3. C\u00f3mo Calcular Rutas</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Ve a la secci\u00f3n "Rutas"</li>
                    <li>Ingresa tu origen y destino</li>
                    <li>Ajusta las preferencias (evitar peajes, etc.)</li>
                    <li>Haz clic en "Calcular Ruta"</li>
                    <li>Selecciona la ruta que mejor se adapte a tus necesidades</li>
                  </ol>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">4. Predicciones de Tr\u00e1fico</h3>
                  <p>Accede a predicciones precisas seleccionando zona, fecha y hora en la secci\u00f3n "Predicciones".</p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Consejo:</strong> Consulta el historial para ver tus rutas m\u00e1s frecuentes y ahorrar tiempo.
                    </p>
                  </div>
                </div>
              )}

              {seccionActiva === 'diagramas' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Diagramas del Sistema</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Network className="w-5 h-5 mr-2 text-blue-600" />
                        Arquitectura General
                      </h3>
                      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-8 aspect-video flex items-center justify-center">
                        <img 
                          src="/docs/diagramas/arquitectura_general.jpg" 
                          alt="Arquitectura" 
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<p class="text-gray-500">Diagrama de arquitectura no disponible</p>';
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                        Diagrama que muestra la arquitectura de microservicios del sistema.
                      </p>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Casos de Uso</h3>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Consultar ruta \u00f3ptima</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Ver predicciones de tr\u00e1fico</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Gestionar perfil de usuario</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Configurar notificaciones</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {seccionActiva === 'api' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Documentaci\u00f3n de API</h2>
                  
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold mb-2">Base URL</h3>
                    <code className="bg-gray-800 text-green-400 px-3 py-1 rounded">
                      https://api.prediruta.com/v1
                    </code>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">Endpoints Principales</h3>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">GET</span>
                        <code className="text-sm">/rutas/calcular</code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Calcula la ruta \u00f3ptima entre dos puntos
                      </p>
                      <h4 className="font-semibold text-sm mb-2">Par\u00e1metros:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li><code>origen</code> (string, requerido)</li>
                        <li><code>destino</code> (string, requerido)</li>
                        <li><code>evitar_peajes</code> (boolean, opcional)</li>
                      </ul>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">POST</span>
                        <code className="text-sm">/predicciones/consultar</code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Obtiene predicciones de tr\u00e1fico para una zona y hora espec\u00edfica
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {seccionActiva === 'accesibilidad' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Informe de Accesibilidad</h2>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Shield className="w-8 h-8 text-green-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-green-900 dark:text-green-300">
                          Cumplimiento WCAG 2.2 Nivel AA
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          Sistema totalmente accesible
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">Caracter\u00edsticas de Accesibilidad</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Navegaci\u00f3n por teclado</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Atajos de teclado (Alt+1-8) para navegaci\u00f3n r\u00e1pida
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Contraste de colores</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ratio de contraste 4.5:1 para texto normal, 3:1 para texto grande
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Lectores de pantalla</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Etiquetas ARIA y sem\u00e1ntica HTML5 correcta
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Responsive Design</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Optimizado para dispositivos de 320px a 1440px
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {seccionActiva === 'descargas' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Descargas</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                      href="#"
                      className="flex items-center space-x-4 p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group"
                    >
                      <FileText className="w-10 h-10 text-blue-600 group-hover:text-blue-700" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Manual de Usuario</h3>
                        <p className="text-sm text-gray-500">PDF - 2.4 MB</p>
                      </div>
                      <Download className="w-5 h-5 ml-auto text-gray-400 group-hover:text-gray-600" />
                    </a>

                    <a
                      href="#"
                      className="flex items-center space-x-4 p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group"
                    >
                      <Code className="w-10 h-10 text-green-600 group-hover:text-green-700" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Documentaci\u00f3n API</h3>
                        <p className="text-sm text-gray-500">PDF - 1.8 MB</p>
                      </div>
                      <Download className="w-5 h-5 ml-auto text-gray-400 group-hover:text-gray-600" />
                    </a>

                    <a
                      href="#"
                      className="flex items-center space-x-4 p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group"
                    >
                      <Network className="w-10 h-10 text-purple-600 group-hover:text-purple-700" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Diagramas UML</h3>
                        <p className="text-sm text-gray-500">ZIP - 3.1 MB</p>
                      </div>
                      <Download className="w-5 h-5 ml-auto text-gray-400 group-hover:text-gray-600" />
                    </a>

                    <a
                      href="#"
                      className="flex items-center space-x-4 p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group"
                    >
                      <Shield className="w-10 h-10 text-orange-600 group-hover:text-orange-700" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Informe WCAG 2.2</h3>
                        <p className="text-sm text-gray-500">PDF - 1.2 MB</p>
                      </div>
                      <Download className="w-5 h-5 ml-auto text-gray-400 group-hover:text-gray-600" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
