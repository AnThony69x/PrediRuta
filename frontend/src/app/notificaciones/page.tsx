"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Bell, 
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  MapPin,
  Settings,
  Trash2
} from "lucide-react";

interface Notificacion {
  id: number;
  tipo: 'alerta' | 'info' | 'exito';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  zona?: string;
}

const notificacionesMock: Notificacion[] = [
  {
    id: 1,
    tipo: 'alerta',
    titulo: 'Congesti\u00f3n detectada',
    mensaje: 'Tr\u00e1fico denso en M-30 direcci\u00f3n sur. Tiempo estimado: +15 minutos.',
    fecha: '2025-10-28 08:45',
    leida: false,
    zona: 'M-30 Sur'
  },
  {
    id: 2,
    tipo: 'info',
    titulo: 'Predicci\u00f3n actualizada',
    mensaje: 'Nuevas predicciones disponibles para tu ruta habitual Madrid Centro - Aeropuerto.',
    fecha: '2025-10-28 07:30',
    leida: false
  },
  {
    id: 3,
    tipo: 'exito',
    titulo: 'Ruta optimizada',
    mensaje: 'Se encontr\u00f3 una ruta 8 minutos m\u00e1s r\u00e1pida para tu destino.',
    fecha: '2025-10-27 18:20',
    leida: true
  },
  {
    id: 4,
    tipo: 'alerta',
    titulo: 'Accidente reportado',
    mensaje: 'Incidente en A-2 km 15. Velocidad reducida a 30 km/h.',
    fecha: '2025-10-27 14:10',
    leida: true,
    zona: 'A-2 km 15'
  },
  {
    id: 5,
    tipo: 'info',
    titulo: 'Mantenimiento programado',
    mensaje: 'El sistema estar\u00e1 en mantenimiento ma\u00f1ana de 03:00 a 04:00 AM.',
    fecha: '2025-10-26 20:00',
    leida: true
  }
];

export default function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState(notificacionesMock);
  const [filtro, setFiltro] = useState<'todas' | 'no-leidas'>('todas');

  const notificacionesFiltradas = filtro === 'todas' 
    ? notificaciones 
    : notificaciones.filter(n => !n.leida);

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  const marcarComoLeida = (id: number) => {
    setNotificaciones(notificaciones.map(n => 
      n.id === id ? { ...n, leida: true } : n
    ));
  };

  const marcarTodasLeidas = () => {
    setNotificaciones(notificaciones.map(n => ({ ...n, leida: true })));
  };

  const eliminarNotificacion = (id: number) => {
    setNotificaciones(notificaciones.filter(n => n.id !== id));
  };

  const eliminarTodasLeidas = () => {
    setNotificaciones(notificaciones.filter(n => !n.leida));
  };

  const getIcono = (tipo: string) => {
    switch(tipo) {
      case 'alerta': return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'info': return <Info className="w-6 h-6 text-blue-600" />;
      case 'exito': return <CheckCircle className="w-6 h-6 text-green-600" />;
      default: return <Bell className="w-6 h-6 text-gray-600" />;
    }
  };

  const getColorFondo = (tipo: string, leida: boolean) => {
    const opacidad = leida ? '50' : '100';
    switch(tipo) {
      case 'alerta': return `bg-red-${opacidad} border-red-200`;
      case 'info': return `bg-blue-${opacidad} border-blue-200`;
      case 'exito': return `bg-green-${opacidad} border-green-200`;
      default: return `bg-gray-${opacidad} border-gray-200`;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <Bell className="w-8 h-8 mr-3" />
            Notificaciones
            {noLeidas > 0 && (
              <span className="ml-3 px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full">
                {noLeidas} nuevas
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Alertas de tr\u00e1fico, predicciones y actualizaciones del sistema
          </p>
        </div>

        {/* Acciones */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setFiltro('todas')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'todas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Todas ({notificaciones.length})
            </button>
            <button
              onClick={() => setFiltro('no-leidas')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'no-leidas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              No le\u00eddas ({noLeidas})
            </button>
          </div>

          <div className="flex space-x-2">
            {noLeidas > 0 && (
              <button
                onClick={marcarTodasLeidas}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
              >
                Marcar todas como le\u00eddas
              </button>
            )}
            <button
              onClick={eliminarTodasLeidas}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar le\u00eddas</span>
            </button>
            <a
              href="/configuracion"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Configurar</span>
            </a>
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="space-y-4">
          {notificacionesFiltradas.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No hay notificaciones
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {filtro === 'todas' 
                  ? 'No tienes ninguna notificaci\u00f3n en este momento.'
                  : 'No tienes notificaciones sin leer.'
                }
              </p>
            </div>
          ) : (
            notificacionesFiltradas.map(notif => (
              <div
                key={notif.id}
                className={`rounded-xl shadow-sm border p-6 transition-all duration-200 ${
                  notif.leida 
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-75' 
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getIcono(notif.tipo)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                          {notif.titulo}
                        </h3>
                        {!notif.leida && (
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                            Nueva
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {notif.mensaje}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(notif.fecha).toLocaleString('es-ES')}</span>
                        </div>
                        {notif.zona && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{notif.zona}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {!notif.leida && (
                      <button
                        onClick={() => marcarComoLeida(notif.id)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Marcar le\u00edda
                      </button>
                    )}
                    <button
                      onClick={() => eliminarNotificacion(notif.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
