"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/toaster";
import {
  Settings,
  Bell,
  Shield,
  Route,
  Globe,
  Moon,
  Sun,
  Save,
  AlertCircle,
  Check,
  Database,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

interface ConfiguracionData {
  // Notificaciones
  notificacionesEmail: boolean;
  notificacionesPush: boolean;
  alertasTrafico: boolean;
  alertasAccidentes: boolean;
  
  // Preferencias de rutas
  evitarPeajes: boolean;
  evitarAutopistas: boolean;
  rutaMasRapida: boolean;
  mostrarAlternativas: boolean;
  
  // Idioma y región
  idioma: string;
  unidadDistancia: 'km' | 'mi';
  formatoHora: '12h' | '24h';
  
  // Privacidad
  guardarHistorial: boolean;
  compartirUbicacion: boolean;
  analiticasAnonimas: boolean;
  
  // Apariencia
  modoOscuro: boolean;
  tamanoTexto: 'pequeño' | 'mediano' | 'grande';
}

export default function ConfiguracionPage() {
  const { user, applyDarkMode } = useAuth();
  const toast = useToast();
  
  const [config, setConfig] = useState<ConfiguracionData>({
    notificacionesEmail: true,
    notificacionesPush: false,
    alertasTrafico: true,
    alertasAccidentes: true,
    evitarPeajes: false,
    evitarAutopistas: false,
    rutaMasRapida: true,
    mostrarAlternativas: true,
    idioma: 'es',
    unidadDistancia: 'km',
    formatoHora: '24h',
    guardarHistorial: true,
    compartirUbicacion: false,
    analiticasAnonimas: true,
    modoOscuro: false,
    tamanoTexto: 'mediano'
  });

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const [mostrarResetConfirmacion, setMostrarResetConfirmacion] = useState(false);

  // Cargar configuración inicial desde localStorage
  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    const isDark = currentTheme === 'dark';
    
    setConfig(prev => ({
      ...prev,
      modoOscuro: isDark
    }));
  }, []);

  // Cargar configuración al montar
  useEffect(() => {
    cargarConfiguracion();
  }, [user]);

  // No aplicar automáticamente, solo cuando el usuario cambie manualmente
  // El ThemeProvider ya maneja la aplicación del tema

  const cargarConfiguracion = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error al cargar configuración:', fetchError);
        return;
      }

      if (data?.preferences) {
        // Cargar configuración pero mantener el modo oscuro del localStorage
        const currentTheme = localStorage.getItem('theme');
        const isDark = currentTheme === 'dark';
        
        setConfig(prevConfig => ({
          ...prevConfig,
          ...data.preferences.configuracion,
          modoOscuro: isDark // Siempre usar el valor de localStorage
        }));
      }
    } catch (err) {
      console.error('Error inesperado al cargar configuración:', err);
    }
  };

  const handleChange = <K extends keyof ConfiguracionData>(
    campo: K,
    valor: ConfiguracionData[K]
  ) => {
    setConfig(prev => ({ ...prev, [campo]: valor }));
    setCambiosPendientes(true);
    
    // Aplicar modo oscuro inmediatamente cuando cambia
    if (campo === 'modoOscuro') {
      applyDarkMode(valor as boolean);
    }
  };

  const guardarConfiguracion = async () => {
    if (!user) {
      setError('Debes iniciar sesión para guardar la configuración');
      return;
    }

    setGuardando(true);
    setError('');
    setMensaje('');

    try {
      // Actualizar en la base de datos
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          preferences: {
            configuracion: config,
            idioma: config.idioma,
            modo_oscuro: config.modoOscuro
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setMensaje('✅ Configuración guardada correctamente');
      toast.success("Configuración guardada", "Todos tus cambios han sido guardados exitosamente.");
      setCambiosPendientes(false);

    } catch (err: any) {
      setError(`❌ Error al guardar: ${err.message}`);
      toast.error("Error al guardar", err.message);
    } finally {
      setGuardando(false);
    }
  };

  const resetearConfiguracion = () => {
    setConfig({
      notificacionesEmail: true,
      notificacionesPush: false,
      alertasTrafico: true,
      alertasAccidentes: true,
      evitarPeajes: false,
      evitarAutopistas: false,
      rutaMasRapida: true,
      mostrarAlternativas: true,
      idioma: 'es',
      unidadDistancia: 'km',
      formatoHora: '24h',
      guardarHistorial: true,
      compartirUbicacion: false,
      analiticasAnonimas: true,
      modoOscuro: false,
      tamanoTexto: 'mediano'
    });
    setCambiosPendientes(true);
    setMostrarResetConfirmacion(false);
    toast.info("Configuración restablecida", "Los valores han sido restablecidos a los predeterminados.");
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <Settings className="w-8 h-8 mr-3" />
            Configuración
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personaliza tu experiencia en PrediRuta según tus preferencias
          </p>
        </div>

        {/* Mensajes */}
        {mensaje && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <p className="text-green-700 dark:text-green-300 text-sm">{mensaje}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Sección: Notificaciones */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notificaciones
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Notificaciones por correo</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Recibe actualizaciones en tu email</p>
                </div>
                <button
                  onClick={() => handleChange('notificacionesEmail', !config.notificacionesEmail)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    config.notificacionesEmail ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.notificacionesEmail ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Notificaciones push</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Alertas en tiempo real en el navegador</p>
                </div>
                <button
                  onClick={() => handleChange('notificacionesPush', !config.notificacionesPush)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    config.notificacionesPush ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.notificacionesPush ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Alertas de tráfico</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Notificaciones sobre congestión en rutas guardadas</p>
                </div>
                <button
                  onClick={() => handleChange('alertasTrafico', !config.alertasTrafico)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    config.alertasTrafico ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.alertasTrafico ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Alertas de accidentes</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Notificaciones sobre incidentes en tiempo real</p>
                </div>
                <button
                  onClick={() => handleChange('alertasAccidentes', !config.alertasAccidentes)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    config.alertasAccidentes ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.alertasAccidentes ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Sección: Preferencias de Rutas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Route className="w-5 h-5 mr-2" />
                Preferencias de Rutas
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Evitar peajes</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Preferir rutas sin peajes por defecto</p>
                </div>
                <button
                  onClick={() => handleChange('evitarPeajes', !config.evitarPeajes)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    config.evitarPeajes ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.evitarPeajes ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Evitar autopistas</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Preferir carreteras convencionales</p>
                </div>
                <button
                  onClick={() => handleChange('evitarAutopistas', !config.evitarAutopistas)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    config.evitarAutopistas ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.evitarAutopistas ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Ruta más rápida</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Priorizar tiempo sobre distancia</p>
                </div>
                <button
                  onClick={() => handleChange('rutaMasRapida', !config.rutaMasRapida)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    config.rutaMasRapida ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.rutaMasRapida ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Mostrar rutas alternativas</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ver múltiples opciones de ruta</p>
                </div>
                <button
                  onClick={() => handleChange('mostrarAlternativas', !config.mostrarAlternativas)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    config.mostrarAlternativas ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.mostrarAlternativas ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Sección: Idioma y Región */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Idioma y Región
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Idioma de la interfaz
                </label>
                <select
                  value={config.idioma}
                  onChange={e => handleChange('idioma', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="es">🇪🇸 Español</option>
                  <option value="en">🇺🇸 English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unidad de distancia
                </label>
                <select
                  value={config.unidadDistancia}
                  onChange={e => handleChange('unidadDistancia', e.target.value as 'km' | 'mi')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="km">Kilómetros (km)</option>
                  <option value="mi">Millas (mi)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Formato de hora
                </label>
                <select
                  value={config.formatoHora}
                  onChange={e => handleChange('formatoHora', e.target.value as '12h' | '24h')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="24h">24 horas (14:30)</option>
                  <option value="12h">12 horas (2:30 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección: Privacidad y Datos */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacidad y Datos
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Guardar historial de rutas</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Almacenar tus búsquedas y rutas anteriores</p>
                </div>
                <button
                  onClick={() => handleChange('guardarHistorial', !config.guardarHistorial)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    config.guardarHistorial ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.guardarHistorial ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Compartir ubicación</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Permitir acceso a tu ubicación para mejores predicciones</p>
                </div>
                <button
                  onClick={() => handleChange('compartirUbicacion', !config.compartirUbicacion)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    config.compartirUbicacion ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.compartirUbicacion ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Analíticas anónimas</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ayudar a mejorar el servicio con datos anónimos</p>
                </div>
                <button
                  onClick={() => handleChange('analiticasAnonimas', !config.analiticasAnonimas)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    config.analiticasAnonimas ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.analiticasAnonimas ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Sección: Apariencia */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                {config.modoOscuro ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
                Apariencia
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Modo oscuro</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Interfaz con colores oscuros para reducir fatiga visual</p>
                </div>
                <button
                  onClick={() => handleChange('modoOscuro', !config.modoOscuro)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    config.modoOscuro ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.modoOscuro ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamaño de texto
                </label>
                <select
                  value={config.tamanoTexto}
                  onChange={e => handleChange('tamanoTexto', e.target.value as 'pequeño' | 'mediano' | 'grande')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="pequeño">Pequeño</option>
                  <option value="mediano">Mediano (recomendado)</option>
                  <option value="grande">Grande</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={guardarConfiguracion}
              disabled={guardando || !cambiosPendientes}
              className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                guardando || !cambiosPendientes
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg'
              }`}
            >
              {guardando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{cambiosPendientes ? 'Guardar cambios' : 'Sin cambios'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setMostrarResetConfirmacion(true)}
              className="sm:w-auto px-6 py-3 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Restablecer valores predeterminados
            </button>
          </div>
        </div>

        {/* Modal de confirmación de reset */}
        {mostrarResetConfirmacion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Restablecer configuración?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Todos los ajustes volverán a los valores predeterminados. Esta acción no se puede deshacer.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={resetearConfiguracion}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Sí, restablecer
                </button>
                <button
                  onClick={() => setMostrarResetConfirmacion(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

