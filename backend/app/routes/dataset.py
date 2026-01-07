"""
API Routes para Dataset de Tráfico Ecuador
==========================================

Endpoints para consultar datos históricos de tráfico
del dataset de Ecuador.

Endpoints:
- GET /api/v1/dataset/summary - Resumen del dataset
- GET /api/v1/dataset/provincias - Lista de provincias
- GET /api/v1/dataset/ciudades - Lista de ciudades
- GET /api/v1/dataset/stats/{ciudad} - Estadísticas por ciudad
- GET /api/v1/dataset/hourly - Estadísticas por hora
- GET /api/v1/dataset/nearby - Datos cercanos a coordenadas
- GET /api/v1/dataset/peak-hours - Horas pico
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any

from app.services.dataset_loader import get_traffic_dataset


router = APIRouter(prefix="/api/v1/dataset", tags=["Dataset Ecuador"])


@router.get("/summary")
async def get_dataset_summary() -> Dict[str, Any]:
    """
    Obtiene un resumen general del dataset de tráfico de Ecuador.
    
    Retorna:
    - Total de registros
    - Provincias disponibles
    - Rango de fechas
    - Estadísticas de velocidad
    """
    dataset = get_traffic_dataset()
    
    if not dataset.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="Dataset no disponible. Coloca el archivo CSV en backend/data/trafico_ecuador.csv"
        )
    
    return dataset.get_summary()


@router.get("/provincias")
async def get_provincias() -> Dict[str, Any]:
    """
    Obtiene la lista de provincias disponibles en el dataset.
    """
    dataset = get_traffic_dataset()
    
    if not dataset.is_loaded:
        raise HTTPException(status_code=503, detail="Dataset no disponible")
    
    provincias = dataset.get_provincias()
    
    return {
        "total": len(provincias),
        "provincias": provincias
    }


@router.get("/ciudades")
async def get_ciudades(
    provincia: Optional[str] = Query(None, description="Filtrar por provincia")
) -> Dict[str, Any]:
    """
    Obtiene la lista de ciudades, opcionalmente filtradas por provincia.
    
    Parámetros:
    - provincia: (opcional) Filtrar ciudades por provincia
    
    Retorna:
    - Array de objetos con: nombre, provincia, registros
    """
    dataset = get_traffic_dataset()
    
    if not dataset.is_loaded:
        raise HTTPException(status_code=503, detail="Dataset no disponible")
    
    # Obtener ciudades
    ciudades_nombres = dataset.get_ciudades(provincia)
    
    # Enriquecer con información adicional
    ciudades_detalle = []
    df = dataset._df
    
    for ciudad in ciudades_nombres:
        ciudad_df = df[df['CIUDAD_OPER'].str.upper() == ciudad.upper()]
        if len(ciudad_df) > 0:
            provincia_ciudad = str(ciudad_df['PROVINCIA_C'].iloc[0])
            registros = int(len(ciudad_df))
            
            ciudades_detalle.append({
                "nombre": str(ciudad),
                "provincia": provincia_ciudad,
                "registros": registros
            })
    
    # Ordenar por número de registros (descendente)
    ciudades_detalle.sort(key=lambda x: x['registros'], reverse=True)
    
    return {
        "provincia": str(provincia) if provincia else "todas",
        "total": int(len(ciudades_detalle)),
        "ciudades": ciudades_detalle
    }


@router.get("/stats/{ciudad}")
async def get_city_stats(ciudad: str) -> Dict[str, Any]:
    """
    Obtiene estadísticas de tráfico para una ciudad específica.
    
    Parámetros:
    - ciudad: Nombre de la ciudad (ej: CUENCA, MANTA, QUITO)
    
    Retorna:
    - Velocidad promedio, máxima, mínima
    - Total de registros
    - Ubicaciones monitoreadas
    """
    dataset = get_traffic_dataset()
    
    if not dataset.is_loaded:
        raise HTTPException(status_code=503, detail="Dataset no disponible")
    
    stats = dataset.get_stats_by_city(ciudad)
    
    if "error" in stats:
        raise HTTPException(status_code=404, detail=stats["error"])
    
    return stats


@router.get("/hourly")
async def get_hourly_stats(
    ciudad: Optional[str] = Query(None, description="Filtrar por ciudad")
) -> Dict[str, Any]:
    """
    Obtiene estadísticas de tráfico agrupadas por hora del día.
    Útil para identificar patrones horarios.
    
    Parámetros:
    - ciudad: (opcional) Filtrar por ciudad específica
    """
    dataset = get_traffic_dataset()
    
    if not dataset.is_loaded:
        raise HTTPException(status_code=503, detail="Dataset no disponible")
    
    stats = dataset.get_stats_by_hour(ciudad)
    
    return {
        "ciudad": ciudad or "todas",
        "datos": stats
    }


@router.get("/nearby")
async def get_nearby_traffic(
    lat: float = Query(..., description="Latitud del punto central"),
    lon: float = Query(..., description="Longitud del punto central"),
    radio: float = Query(5.0, ge=0.5, le=50.0, description="Radio de búsqueda en km")
) -> Dict[str, Any]:
    """
    Obtiene datos de tráfico cercanos a una coordenada.
    
    Parámetros:
    - lat: Latitud (ej: -2.90 para Cuenca)
    - lon: Longitud (ej: -79.00 para Cuenca)
    - radio: Radio de búsqueda en km (default: 5km)
    
    Ejemplo Ecuador:
    - Cuenca: lat=-2.90, lon=-79.00
    - Manta: lat=-0.95, lon=-80.72
    - Quito: lat=-0.22, lon=-78.51
    """
    dataset = get_traffic_dataset()
    
    if not dataset.is_loaded:
        raise HTTPException(status_code=503, detail="Dataset no disponible")
    
    data = dataset.get_nearby_data(lat, lon, radio)
    
    return {
        "centro": {"lat": lat, "lon": lon},
        "radio_km": radio,
        "total_puntos": len(data),
        "datos": data
    }


@router.get("/peak-hours")
async def get_peak_hours(
    ciudad: Optional[str] = Query(None, description="Filtrar por ciudad")
) -> Dict[str, Any]:
    """
    Identifica las horas pico y horas fluidas basadas en los datos históricos.
    
    Parámetros:
    - ciudad: (opcional) Filtrar por ciudad específica
    
    Retorna:
    - Horas con mayor congestión (menor velocidad)
    - Horas con menor congestión (mayor velocidad)
    """
    dataset = get_traffic_dataset()
    
    if not dataset.is_loaded:
        raise HTTPException(status_code=503, detail="Dataset no disponible")
    
    peak = dataset.get_peak_hours(ciudad)
    
    if not peak:
        raise HTTPException(
            status_code=404, 
            detail=f"No hay datos suficientes para {ciudad or 'analizar'}"
        )
    
    return {
        "ciudad": ciudad or "todas",
        **peak
    }


@router.get("/velocidades")
async def get_velocidades_por_zona(
    provincia: Optional[str] = Query(None, description="Filtrar por provincia"),
    ciudad: Optional[str] = Query(None, description="Filtrar por ciudad"),
    limit: int = Query(50, ge=1, le=500, description="Límite de resultados")
) -> Dict[str, Any]:
    """
    Obtiene velocidades registradas con detalle de ubicación.
    Útil para mapas de calor y visualizaciones.
    """
    dataset = get_traffic_dataset()
    
    if not dataset.is_loaded:
        raise HTTPException(status_code=503, detail="Dataset no disponible")
    
    df = dataset._df.copy()
    
    if provincia:
        df = df[df['PROVINCIA_C'].str.upper() == provincia.upper()]
    if ciudad:
        df = df[df['CIUDAD_OPER'].str.upper() == ciudad.upper()]
    
    # Agrupar por ubicación
    grouped = df.groupby(['UBICACION_EXCESO', 'LATITUD', 'LONGITUD', 'CIUDAD_OPER', 'PROVINCIA_C']).agg({
        'VELOCIDAD': ['mean', 'min', 'max', 'count']
    }).reset_index()
    
    grouped.columns = ['ubicacion', 'lat', 'lon', 'ciudad', 'provincia', 
                       'velocidad_promedio', 'velocidad_min', 'velocidad_max', 'registros']
    
    # Ordenar por cantidad de registros (más datos = más relevante)
    grouped = grouped.sort_values('registros', ascending=False).head(limit)
    
    resultados = []
    for _, row in grouped.iterrows():
        vel_prom = row['velocidad_promedio']
        resultados.append({
            "ubicacion": row['ubicacion'],
            "lat": float(row['lat']) if row['lat'] else None,
            "lon": float(row['lon']) if row['lon'] else None,
            "ciudad": row['ciudad'],
            "provincia": row['provincia'],
            "velocidad_promedio": round(vel_prom, 1),
            "velocidad_min": int(row['velocidad_min']),
            "velocidad_max": int(row['velocidad_max']),
            "registros": int(row['registros']),
            "nivel_trafico": dataset.get_traffic_level(vel_prom)
        })
    
    return {
        "filtros": {
            "provincia": provincia,
            "ciudad": ciudad
        },
        "total": len(resultados),
        "datos": resultados
    }
