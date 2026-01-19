/**
 * Hook personalizado para gestionar el historial de rutas y predicciones
 */

import { useState, useEffect, useCallback } from 'react';
import {
  RutaHistorial,
  PrediccionHistorial,
  EstadisticasHistorial,
  obtenerHistorialRutas,
  obtenerHistorialPredicciones,
  obtenerEstadisticas,
  guardarRutaEnHistorial,
  guardarPrediccionEnHistorial,
  eliminarRuta,
  eliminarTodoElHistorial,
  exportarHistorialCSV,
} from '@/lib/history-service';

interface UseHistoryOptions {
  autoLoad?: boolean;
  filtroInicial?: {
    fecha?: 'todas' | 'hoy' | 'semana' | 'mes';
    ciudad?: string;
    zona?: string;
  };
}

export const useHistory = (options: UseHistoryOptions = {}) => {
  const { autoLoad = true, filtroInicial } = options;

  const [rutas, setRutas] = useState<RutaHistorial[]>([]);
  const [predicciones, setPredicciones] = useState<PrediccionHistorial[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasHistorial | null>(null);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState(filtroInicial || {});

  /**
   * Carga el historial de rutas
   */
  const cargarRutas = useCallback(async (filtrosPersonalizados?: typeof filtros) => {
    try {
      setLoading(true);
      setError(null);
      const filtrosAplicar = filtrosPersonalizados || filtros;
      const data = await obtenerHistorialRutas(filtrosAplicar);
      setRutas(data);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al cargar historial de rutas';
      setError(mensaje);
      console.error('Error en cargarRutas:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  /**
   * Carga el historial de predicciones
   */
  const cargarPredicciones = useCallback(async (filtrosPersonalizados?: typeof filtros) => {
    try {
      setLoading(true);
      setError(null);
      const filtrosAplicar = filtrosPersonalizados || filtros;
      const data = await obtenerHistorialPredicciones(filtrosAplicar);
      setPredicciones(data);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al cargar historial de predicciones';
      setError(mensaje);
      console.error('Error en cargarPredicciones:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  /**
   * Carga las estadísticas del historial
   */
  const cargarEstadisticas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerEstadisticas();
      setEstadisticas(data);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al cargar estadísticas';
      setError(mensaje);
      console.error('Error en cargarEstadisticas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Guarda una nueva ruta en el historial
   */
  const agregarRuta = useCallback(async (
    ruta: Omit<RutaHistorial, 'id' | 'fecha' | 'userId'>
  ): Promise<RutaHistorial | null> => {
    try {
      const nuevaRuta = await guardarRutaEnHistorial(ruta);
      // Recargar el historial después de agregar
      await cargarRutas();
      return nuevaRuta;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al guardar ruta';
      setError(mensaje);
      console.error('Error en agregarRuta:', err);
      return null;
    }
  }, [cargarRutas]);

  /**
   * Guarda una nueva predicción en el historial
   */
  const agregarPrediccion = useCallback(async (
    prediccion: Omit<PrediccionHistorial, 'id' | 'fecha' | 'userId'>
  ): Promise<PrediccionHistorial | null> => {
    try {
      const nuevaPrediccion = await guardarPrediccionEnHistorial(prediccion);
      await cargarPredicciones();
      return nuevaPrediccion;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al guardar predicción';
      setError(mensaje);
      console.error('Error en agregarPrediccion:', err);
      return null;
    }
  }, [cargarPredicciones]);

  /**
   * Elimina una ruta específica
   */
  const eliminarRutaPorId = useCallback(async (id: string): Promise<boolean> => {
    try {
      await eliminarRuta(id);
      // Actualizar el estado local inmediatamente
      setRutas(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al eliminar ruta';
      setError(mensaje);
      console.error('Error en eliminarRutaPorId:', err);
      return false;
    }
  }, []);

  /**
   * Elimina todo el historial
   */
  const limpiarHistorial = useCallback(async (): Promise<boolean> => {
    try {
      await eliminarTodoElHistorial();
      setRutas([]);
      setPredicciones([]);
      setEstadisticas(null);
      return true;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al limpiar historial';
      setError(mensaje);
      console.error('Error en limpiarHistorial:', err);
      return false;
    }
  }, []);

  /**
   * Exporta el historial a CSV
   */
  const exportarCSV = useCallback(async (): Promise<boolean> => {
    try {
      await exportarHistorialCSV();
      return true;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al exportar historial';
      setError(mensaje);
      console.error('Error en exportarCSV:', err);
      return false;
    }
  }, []);

  /**
   * Actualiza los filtros y recarga los datos
   */
  const actualizarFiltros = useCallback((nuevosFiltros: typeof filtros) => {
    setFiltros(nuevosFiltros);
  }, []);

  /**
   * Recarga todos los datos del historial
   */
  const recargar = useCallback(async () => {
    await Promise.all([
      cargarRutas(),
      cargarPredicciones(),
      cargarEstadisticas(),
    ]);
  }, [cargarRutas, cargarPredicciones, cargarEstadisticas]);

  // Cargar datos inicialmente si autoLoad está activado
  useEffect(() => {
    if (autoLoad) {
      recargar();
    }
  }, [autoLoad]); // Solo ejecutar al montar el componente

  // Recargar cuando cambien los filtros
  useEffect(() => {
    if (autoLoad && Object.keys(filtros).length > 0) {
      cargarRutas();
      cargarPredicciones();
    }
  }, [filtros, autoLoad]); // Ahora cargarRutas y cargarPredicciones son dependencias

  return {
    // Estados
    rutas,
    predicciones,
    estadisticas,
    loading,
    error,
    filtros,

    // Acciones
    cargarRutas,
    cargarPredicciones,
    cargarEstadisticas,
    agregarRuta,
    agregarPrediccion,
    eliminarRutaPorId,
    limpiarHistorial,
    exportarCSV,
    actualizarFiltros,
    recargar,

    // Utilidades
    totalRutas: rutas.length,
    totalPredicciones: predicciones.length,
    tieneHistorial: rutas.length > 0 || predicciones.length > 0,
  };
};

export default useHistory;
