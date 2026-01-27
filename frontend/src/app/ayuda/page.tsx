"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  HelpCircle, 
  Search, 
  Mail, 
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Book,
  Video,
  FileText
} from "lucide-react";

interface FAQ {
  id: number;
  pregunta: string;
  respuesta: string;
  categoria: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    categoria: "General",
    pregunta: "¿Qué es PrediRuta 2.0?",
    respuesta: "PrediRuta 2.0 es un sistema inteligente de predicción de tráfico que utiliza inteligencia artificial para ayudarte a planificar las mejores rutas. Analiza datos en tiempo real de tráfico, condiciones meteorológicas y patrones históricos para ofrecerte predicciones precisas y rutas optimizadas."
  },
  {
    id: 2,
    categoria: "General",
    pregunta: "¿Cómo funciona la predicción de tráfico?",
    respuesta: "Nuestro sistema utiliza algoritmos de machine learning que analizan millones de datos históricos de tráfico, patrones de congestión, eventos especiales, condiciones meteorológicas y más de 50 variables para predecir con precisión el estado del tráfico en cualquier momento y lugar."
  },
  {
    id: 3,
    categoria: "Rutas",
    pregunta: "¿Cómo calculo una ruta óptima?",
    respuesta: "Ve a la sección 'Rutas', ingresa tu origen y destino, y haz clic en 'Calcular Ruta'. El sistema te mostrará varias opciones de ruta con información sobre distancia, tiempo estimado, tráfico actual y peajes. Puedes personalizar las preferencias (evitar peajes, autopistas, etc.) en la configuración."
  },
  {
    id: 4,
    categoria: "Rutas",
    pregunta: "¿Puedo guardar mis rutas favoritas?",
    respuesta: "Sí, todas las rutas que calcules se guardan automáticamente en tu historial (si tienes activada esta opción en Configuración > Privacidad). Podrás acceder a ellas desde la sección 'Historial' y marcar tus favoritas para acceso rápido."
  },
  {
    id: 5,
    categoria: "Predicciones",
    pregunta: "¿Qué tan precisas son las predicciones?",
    respuesta: "Nuestro sistema tiene una precisión promedio del 87% en predicciones a corto plazo (1-2 horas) y del 75% en predicciones a largo plazo (hasta 7 días). La precisión aumenta en áreas urbanas con más datos históricos disponibles."
  },
  {
    id: 6,
    categoria: "Predicciones",
    pregunta: "¿Puedo ver predicciones de días futuros?",
    respuesta: "Sí, en la sección 'Predicciones' puedes seleccionar cualquier fecha y hora futuras (hasta 7 días) para ver las predicciones de tráfico. Esto te permite planificar tus viajes con anticipación."
  },
  {
    id: 7,
    categoria: "Cuenta",
    pregunta: "¿Cómo cambio mi contraseña?",
    respuesta: "Ve a 'Perfil', desplázate hasta la sección de seguridad y haz clic en 'Cambiar contraseña'. Deberás ingresar tu contraseña actual y la nueva contraseña dos veces para confirmar el cambio."
  },
  {
    id: 8,
    categoria: "Cuenta",
    pregunta: "¿Cómo cambio el idioma de la interfaz?",
    respuesta: "Puedes cambiar el idioma desde 'Configuración > Idioma y Región' o usando el selector de idioma en la esquina superior derecha de la pantalla. Actualmente soportamos Español e Inglés."
  },
  {
    id: 9,
    categoria: "Notificaciones",
    pregunta: "¿Cómo activo las alertas de tráfico?",
    respuesta: "Ve a 'Configuración > Notificaciones' y activa 'Alertas de tráfico'. Puedes elegir recibir notificaciones por email, push en el navegador, o ambas. También puedes configurar alertas específicas para rutas guardadas o zonas de interés."
  },
  {
    id: 10,
    categoria: "Notificaciones",
    pregunta: "¿Puedo personalizar qué notificaciones recibo?",
    respuesta: "Sí, en 'Configuración > Notificaciones' puedes activar o desactivar individualmente: notificaciones por email, notificaciones push, alertas de tráfico, alertas de accidentes, y más. Tendrás control total sobre qué información recibes."
  },
  {
    id: 11,
    categoria: "Privacidad",
    pregunta: "¿Qué datos se almacenan sobre mí?",
    respuesta: "Almacenamos únicamente: tu email, nombre, preferencias de configuración, historial de rutas consultadas (si lo autorizas) y datos de uso anónimos para mejorar el servicio. NO vendemos ni compartimos tus datos personales con terceros. Consulta nuestra Política de Privacidad para más detalles."
  },
  {
    id: 12,
    categoria: "Privacidad",
    pregunta: "¿Puedo eliminar mi historial de rutas?",
    respuesta: "Sí, ve a 'Historial' y haz clic en 'Eliminar todo el historial'. También puedes eliminar rutas individuales. Si desactivas 'Guardar historial' en Configuración, las nuevas búsquedas no se almacenarán."
  }
];

export default function AyudaPage() {
  const [busqueda, setBusqueda] = useState('');
  const [preguntaAbierta, setPreguntaAbierta] = useState<number | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todas');
  
  const [formContacto, setFormContacto] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const categorias = ['Todas', ...Array.from(new Set(faqs.map(f => f.categoria)))];

  const faqsFiltradas = faqs.filter(faq => {
    const matchBusqueda = busqueda === '' || 
      faq.pregunta.toLowerCase().includes(busqueda.toLowerCase()) ||
      faq.respuesta.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchCategoria = categoriaSeleccionada === 'Todas' || faq.categoria === categoriaSeleccionada;
    
    return matchBusqueda && matchCategoria;
  });

  const togglePregunta = (id: number) => {
    setPreguntaAbierta(preguntaAbierta === id ? null : id);
  };

  const handleSubmitContacto = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    // Simulación de envío
    await new Promise(resolve => setTimeout(resolve, 1500));

    setMensajeEnviado(true);
    setFormContacto({ nombre: '', email: '', asunto: '', mensaje: '' });
    setEnviando(false);

    setTimeout(() => setMensajeEnviado(false), 5000);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <HelpCircle className="w-10 h-10 mr-3" />
            Centro de Ayuda
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            ¿Tienes dudas? Estamos aquí para ayudarte. Busca en nuestras preguntas frecuentes
            o contáctanos directamente.
          </p>
        </div>

        {/* Búsqueda */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar en preguntas frecuentes..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Filtros de categoría */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categorias.map(categoria => (
            <button
              key={categoria}
              onClick={() => setCategoriaSeleccionada(categoria)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                categoriaSeleccionada === categoria
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sección FAQ */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Preguntas Frecuentes ({faqsFiltradas.length})
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {faqsFiltradas.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No se encontraron preguntas que coincidan con tu búsqueda.
                    </p>
                  </div>
                ) : (
                  faqsFiltradas.map(faq => (
                    <div
                      key={faq.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => togglePregunta(faq.id)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                      >
                        <div className="flex items-start text-left flex-1">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded mr-3 flex-shrink-0">
                            {faq.categoria}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {faq.pregunta}
                          </span>
                        </div>
                        {preguntaAbierta === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
                        )}
                      </button>
                      {preguntaAbierta === faq.id && (
                        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {faq.respuesta}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Recursos y Contacto */}
          <div className="space-y-6">
            {/* Formulario de contacto */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contacto Directo
                </h2>
              </div>
              <div className="p-6">
                {mensajeEnviado ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                    <div className="text-green-600 dark:text-green-400 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="font-medium text-green-800 dark:text-green-300">
                      ¡Mensaje enviado!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      Te responderemos pronto
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitContacto} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={formContacto.nombre}
                        onChange={e => setFormContacto({ ...formContacto, nombre: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formContacto.email}
                        onChange={e => setFormContacto({ ...formContacto, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Asunto *
                      </label>
                      <select
                        value={formContacto.asunto}
                        onChange={e => setFormContacto({ ...formContacto, asunto: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="">Selecciona un asunto</option>
                        <option value="soporte_tecnico">Soporte Técnico</option>
                        <option value="sugerencia">Sugerencia</option>
                        <option value="error">Reportar Error</option>
                        <option value="cuenta">Problemas con cuenta</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mensaje *
                      </label>
                      <textarea
                        value={formContacto.mensaje}
                        onChange={e => setFormContacto({ ...formContacto, mensaje: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Describe tu consulta o problema..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={enviando}
                      className={`w-full px-4 py-3 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                        enviando
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'
                      }`}
                    >
                      {enviando ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Enviar Mensaje</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Información de contacto */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                ¿No encuentras lo que buscas?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Nuestro equipo de soporte está disponible de lunes a viernes de 9:00 a 18:00 (GMT+1)
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  soporte@prediruta.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
