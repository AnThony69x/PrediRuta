/**
 * Servicio de Historial de Rutas y Predicciones
 * Maneja el almacenamiento local y sincronización con Supabase
 */

import { supabase } from '@/lib/supabase';

export interface RutaHistorial {
  id: string;
  fecha: string;
  origen: string;
  destino: string;
  distancia: number;
  duracion: number;
  tiempoAhorrado: number;
  trafico: 'fluido' | 'moderado' | 'congestionado';
  userId?: string;
  coordenadasOrigen?: { lat: number; lng: number };
  coordenadasDestino?: { lat: number; lng: number };
}

export interface PrediccionHistorial {
  id: string;
  fecha: string;
  zona: string;
  horaConsulta: string;
  precisionReal: number;
  congestionPredicha: number;
  userId?: string;
}

export interface EstadisticasHistorial {
  totalRutas: number;
  totalKm: number;
  totalTiempoAhorrado: number;
  precisionPromedio: number;
  rutasMasFrecuentes: Array<{ origen: string; destino: string; count: number }>;
}

const STORAGE_KEYS = {
  RUTAS: 'prediruta_historial_rutas',
  PREDICCIONES: 'prediruta_historial_predicciones',
};

/**
 * Obtiene las claves de storage específicas para un usuario
 */
const getStorageKeys = (userId?: string) => {
  if (!userId) {
    // Si no hay usuario, usar claves genéricas (para compatibilidad)
    return STORAGE_KEYS;
  }
  return {
    RUTAS: `${STORAGE_KEYS.RUTAS}_${userId}`,
    PREDICCIONES: `${STORAGE_KEYS.PREDICCIONES}_${userId}`,
  };
};

/**
 * Limpia el localStorage de otros usuarios (mantiene solo el actual)
 */
const limpiarHistorialOtrosUsuarios = (currentUserId?: string) => {
  try {
    const allKeys = Object.keys(localStorage);
    const historialKeys = allKeys.filter(key => 
      key.startsWith(STORAGE_KEYS.RUTAS) || 
      key.startsWith(STORAGE_KEYS.PREDICCIONES)
    );
    
    if (currentUserId) {
      // Eliminar claves que no pertenecen al usuario actual
      historialKeys.forEach(key => {
        if (!key.endsWith(`_${currentUserId}`)) {
          localStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.warn('Error limpiando historial de otros usuarios:', error);
  }
};

/**
 * Guarda una ruta consultada en el historial
 */
export const guardarRutaEnHistorial = async (ruta: Omit<RutaHistorial, 'id' | 'fecha' | 'userId'>): Promise<RutaHistorial> => {
  try {
    // Obtener usuario autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    const nuevaRuta: RutaHistorial = {
      id: `ruta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fecha: new Date().toISOString(),
      userId: user?.id,
      ...ruta,
    };

    // Limpiar historial de otros usuarios
    limpiarHistorialOtrosUsuarios(user?.id);

    // Guardar en localStorage específico del usuario
    const storageKeys = getStorageKeys(user?.id);
    const historialLocal = obtenerHistorialLocalRutas(user?.id);
    historialLocal.unshift(nuevaRuta);
    
    // Mantener solo los últimos 100 registros en localStorage
    const historialLimitado = historialLocal.slice(0, 100);
    localStorage.setItem(storageKeys.RUTAS, JSON.stringify(historialLimitado));

    // Si hay usuario autenticado, intentar guardar en Supabase
    if (user) {
      try {
        await guardarRutaEnSupabase(nuevaRuta);
      } catch (error) {
        console.warn('No se pudo guardar en Supabase, solo guardado local:', error);
      }
    }

    return nuevaRuta;
  } catch (error) {
    console.error('Error al guardar ruta en historial:', error);
    throw error;
  }
};

/**
 * Guarda una predicción consultada en el historial
 */
export const guardarPrediccionEnHistorial = async (
  prediccion: Omit<PrediccionHistorial, 'id' | 'fecha' | 'userId'>
): Promise<PrediccionHistorial> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const nuevaPrediccion: PrediccionHistorial = {
      id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fecha: new Date().toISOString().split('T')[0] || new Date().toISOString().substring(0, 10),
      userId: user?.id,
      ...prediccion,
    };

    // Limpiar historial de otros usuarios
    limpiarHistorialOtrosUsuarios(user?.id);

    // Guardar en localStorage específico del usuario
    const storageKeys = getStorageKeys(user?.id);
    const historialLocal = obtenerHistorialLocalPredicciones(user?.id);
    historialLocal.unshift(nuevaPrediccion);
    
    const historialLimitado = historialLocal.slice(0, 50);
    localStorage.setItem(storageKeys.PREDICCIONES, JSON.stringify(historialLimitado));

    // Guardar en Supabase si está autenticado
    if (user) {
      try {
        await guardarPrediccionEnSupabase(nuevaPrediccion);
      } catch (error) {
        console.warn('No se pudo guardar predicción en Supabase:', error);
      }
    }

    return nuevaPrediccion;
  } catch (error) {
    console.error('Error al guardar predicción:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de rutas (localStorage + Supabase)
 */
export const obtenerHistorialRutas = async (filtro?: {
  fecha?: 'todas' | 'hoy' | 'semana' | 'mes';
  ciudad?: string;
}): Promise<RutaHistorial[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Limpiar historial de otros usuarios al cargar
    limpiarHistorialOtrosUsuarios(user?.id);
    
    let historial: RutaHistorial[] = [];

    // Primero obtener de localStorage específico del usuario
    const historialLocal = obtenerHistorialLocalRutas(user?.id);
    
    // Solo agregar rutas que pertenezcan al usuario actual
    const rutasDelUsuario = user 
      ? historialLocal.filter(r => !r.userId || r.userId === user.id)
      : historialLocal.filter(r => !r.userId); // Si no hay usuario, solo mostrar rutas sin userId
    
    historial.push(...rutasDelUsuario);

    // Si hay usuario, obtener también de Supabase
    if (user) {
      try {
        const historialRemoto = await obtenerRutasDeSupabase(user.id);
        
        // Combinar y deduplicar por ID
        const idsLocales = new Set(historialLocal.map(r => r.id));
        const rutasNuevas = historialRemoto.filter(r => !idsLocales.has(r.id));
        historial.push(...rutasNuevas);
      } catch (error) {
        console.warn('No se pudo obtener historial de Supabase:', error);
      }
    }

    // Aplicar filtros
    if (filtro?.fecha && filtro.fecha !== 'todas') {
      historial = aplicarFiltroFecha(historial, filtro.fecha);
    }

    if (filtro?.ciudad) {
      historial = historial.filter(
        r => r.origen.toLowerCase().includes(filtro.ciudad!.toLowerCase()) ||
             r.destino.toLowerCase().includes(filtro.ciudad!.toLowerCase())
      );
    }

    // Ordenar por fecha descendente
    historial.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    return historial;
  } catch (error) {
    console.error('Error al obtener historial de rutas:', error);
    return [];
  }
};

/**
 * Obtiene el historial de predicciones
 */
export const obtenerHistorialPredicciones = async (filtro?: {
  fecha?: 'todas' | 'hoy' | 'semana' | 'mes';
  zona?: string;
}): Promise<PrediccionHistorial[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Limpiar historial de otros usuarios
    limpiarHistorialOtrosUsuarios(user?.id);
    
    let historial: PrediccionHistorial[] = [];

    // Obtener de localStorage específico del usuario
    const historialLocal = obtenerHistorialLocalPredicciones(user?.id);
    
    // Solo agregar predicciones que pertenezcan al usuario actual
    const prediccionesDelUsuario = user
      ? historialLocal.filter(p => !p.userId || p.userId === user.id)
      : historialLocal.filter(p => !p.userId);
    
    historial.push(...prediccionesDelUsuario);

    // Obtener de Supabase si está autenticado
    if (user) {
      try {
        const historialRemoto = await obtenerPrediccionesDeSupabase(user.id);
        const idsLocales = new Set(historialLocal.map(p => p.id));
        const prediccionesNuevas = historialRemoto.filter(p => !idsLocales.has(p.id));
        historial.push(...prediccionesNuevas);
      } catch (error) {
        console.warn('No se pudo obtener predicciones de Supabase:', error);
      }
    }

    // Aplicar filtros
    if (filtro?.zona) {
      historial = historial.filter(p => 
        p.zona.toLowerCase().includes(filtro.zona!.toLowerCase())
      );
    }

    historial.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    return historial;
  } catch (error) {
    console.error('Error al obtener historial de predicciones:', error);
    return [];
  }
};

/**
 * Calcula estadísticas del historial
 */
export const obtenerEstadisticas = async (): Promise<EstadisticasHistorial> => {
  const rutas = await obtenerHistorialRutas();
  const predicciones = await obtenerHistorialPredicciones();

  const totalRutas = rutas.length;
  const totalKm = rutas.reduce((sum, r) => sum + r.distancia, 0);
  const totalTiempoAhorrado = rutas.reduce((sum, r) => sum + r.tiempoAhorrado, 0);
  const precisionPromedio = predicciones.length > 0
    ? predicciones.reduce((sum, p) => sum + p.precisionReal, 0) / predicciones.length
    : 0;

  // Calcular rutas más frecuentes
  const rutasMap = new Map<string, number>();
  rutas.forEach(r => {
    const key = `${r.origen}|${r.destino}`;
    rutasMap.set(key, (rutasMap.get(key) || 0) + 1);
  });

  const rutasMasFrecuentes = Array.from(rutasMap.entries())
    .map(([key, count]) => {
      const [origen, destino] = key.split('|');
      return { origen: origen || '', destino: destino || '', count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalRutas,
    totalKm,
    totalTiempoAhorrado,
    precisionPromedio,
    rutasMasFrecuentes,
  };
};

/**
 * Elimina una ruta específica del historial
 */
export const eliminarRuta = async (id: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Eliminar de localStorage específico del usuario
    const storageKeys = getStorageKeys(user?.id);
    const historialLocal = obtenerHistorialLocalRutas(user?.id);
    const historialFiltrado = historialLocal.filter(r => r.id !== id);
    localStorage.setItem(storageKeys.RUTAS, JSON.stringify(historialFiltrado));

    // Eliminar de Supabase si existe
    if (user) {
      try {
        await eliminarRutaDeSupabase(id, user.id);
      } catch (error) {
        console.warn('No se pudo eliminar de Supabase:', error);
      }
    }
  } catch (error) {
    console.error('Error al eliminar ruta:', error);
    throw error;
  }
};

/**
 * Elimina todo el historial
 */
export const eliminarTodoElHistorial = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Limpiar localStorage específico del usuario
    const storageKeys = getStorageKeys(user?.id);
    localStorage.removeItem(storageKeys.RUTAS);
    localStorage.removeItem(storageKeys.PREDICCIONES);

    // Limpiar de Supabase
    if (user) {
      try {
        await eliminarHistorialDeSupabase(user.id);
      } catch (error) {
        console.warn('No se pudo limpiar historial de Supabase:', error);
      }
    }
  } catch (error) {
    console.error('Error al eliminar historial completo:', error);
    throw error;
  }
};

/**
 * Exporta el historial a CSV
 */
export const exportarHistorialCSV = async (): Promise<void> => {
  const rutas = await obtenerHistorialRutas();
  
  const csv = [
    'Fecha,Origen,Destino,Distancia(km),Duración(min),TiempoAhorrado(min),Tráfico',
    ...rutas.map(r => 
      `"${r.fecha}","${r.origen}","${r.destino}",${r.distancia},${r.duracion},${r.tiempoAhorrado},${r.trafico}`
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `historial-prediruta-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Limpia el historial local del usuario actual al cerrar sesión
 * Esta función debe ser llamada desde el hook de autenticación
 */
export const limpiarHistorialLocalAlCerrarSesion = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const storageKeys = getStorageKeys(user.id);
      localStorage.removeItem(storageKeys.RUTAS);
      localStorage.removeItem(storageKeys.PREDICCIONES);
    }
    
    // También limpiar cualquier clave genérica antigua
    localStorage.removeItem(STORAGE_KEYS.RUTAS);
    localStorage.removeItem(STORAGE_KEYS.PREDICCIONES);
  } catch (error) {
    console.warn('Error limpiando historial local al cerrar sesión:', error);
  }
};

// ============================================
// Funciones auxiliares privadas
// ============================================

function obtenerHistorialLocalRutas(userId?: string): RutaHistorial[] {
  try {
    const storageKeys = getStorageKeys(userId);
    const data = localStorage.getItem(storageKeys.RUTAS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function obtenerHistorialLocalPredicciones(userId?: string): PrediccionHistorial[] {
  try {
    const storageKeys = getStorageKeys(userId);
    const data = localStorage.getItem(storageKeys.PREDICCIONES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function aplicarFiltroFecha(rutas: RutaHistorial[], filtro: 'hoy' | 'semana' | 'mes'): RutaHistorial[] {
  const ahora = new Date();
  const inicioDelDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  
  let fechaLimite: Date;
  
  switch (filtro) {
    case 'hoy':
      fechaLimite = inicioDelDia;
      break;
    case 'semana':
      fechaLimite = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'mes':
      fechaLimite = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      return rutas;
  }

  return rutas.filter(r => new Date(r.fecha) >= fechaLimite);
}

// ============================================
// Funciones de integración con Supabase
// ============================================

async function guardarRutaEnSupabase(ruta: RutaHistorial): Promise<void> {
  const { error } = await supabase.from('historial_rutas').insert({
    id: ruta.id,
    user_id: ruta.userId,
    fecha: ruta.fecha,
    origen: ruta.origen,
    destino: ruta.destino,
    distancia: ruta.distancia,
    duracion: ruta.duracion,
    tiempo_ahorrado: ruta.tiempoAhorrado,
    trafico: ruta.trafico,
    coordenadas_origen: ruta.coordenadasOrigen,
    coordenadas_destino: ruta.coordenadasDestino,
  });

  if (error && error.code !== '23505') { // Ignorar duplicados
    throw error;
  }
}

async function guardarPrediccionEnSupabase(prediccion: PrediccionHistorial): Promise<void> {
  const { error } = await supabase.from('historial_predicciones').insert({
    id: prediccion.id,
    user_id: prediccion.userId,
    fecha: prediccion.fecha,
    zona: prediccion.zona,
    hora_consulta: prediccion.horaConsulta,
    precision_real: prediccion.precisionReal,
    congestion_predicha: prediccion.congestionPredicha,
  });

  if (error && error.code !== '23505') {
    throw error;
  }
}

async function obtenerRutasDeSupabase(userId: string): Promise<RutaHistorial[]> {
  const { data, error } = await supabase
    .from('historial_rutas')
    .select('*')
    .eq('user_id', userId)
    .order('fecha', { ascending: false })
    .limit(100);

  if (error) throw error;

  return (data || []).map(r => ({
    id: r.id,
    fecha: r.fecha,
    origen: r.origen,
    destino: r.destino,
    distancia: r.distancia,
    duracion: r.duracion,
    tiempoAhorrado: r.tiempo_ahorrado,
    trafico: r.trafico,
    userId: r.user_id,
    coordenadasOrigen: r.coordenadas_origen,
    coordenadasDestino: r.coordenadas_destino,
  }));
}

async function obtenerPrediccionesDeSupabase(userId: string): Promise<PrediccionHistorial[]> {
  const { data, error } = await supabase
    .from('historial_predicciones')
    .select('*')
    .eq('user_id', userId)
    .order('fecha', { ascending: false })
    .limit(50);

  if (error) throw error;

  return (data || []).map(p => ({
    id: p.id,
    fecha: p.fecha,
    zona: p.zona,
    horaConsulta: p.hora_consulta,
    precisionReal: p.precision_real,
    congestionPredicha: p.congestion_predicha,
    userId: p.user_id,
  }));
}

async function eliminarRutaDeSupabase(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('historial_rutas')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

async function eliminarHistorialDeSupabase(userId: string): Promise<void> {
  const { error: errorRutas } = await supabase
    .from('historial_rutas')
    .delete()
    .eq('user_id', userId);

  const { error: errorPredicciones } = await supabase
    .from('historial_predicciones')
    .delete()
    .eq('user_id', userId);

  if (errorRutas || errorPredicciones) {
    throw new Error('Error al eliminar historial de Supabase');
  }
}
