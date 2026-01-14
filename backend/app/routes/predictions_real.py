"""
API Routes para Predicciones con Datos Reales
==============================================

Endpoints que reemplazan los datos mock con datos reales del dataset de Ecuador.
Proporciona predicciones basadas en patrones históricos.

Endpoints para la página /predicciones
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.services.dataset_loader import get_traffic_dataset
from app.services.velocity_calculator import VelocityCalculator


router = APIRouter(prefix="/api/v1/predictions", tags=["Predictions Real"])


@router.get("/velocity-analysis")
async def get_velocity_analysis(
    ciudad: Optional[str] = Query(None, description="Ciudad a analizar"),
    provincia: Optional[str] = Query(None, description="Provincia a analizar"),
    tipo_vehiculo: str = Query("liviano", description="Tipo de vehículo: liviano o pesado")
) -> Dict[str, Any]:
    """
    Análisis de velocidades por hora para gráficos de predicción.
    Reemplaza los datos mock de generateMockData() en predicciones/page.tsx
    
    IMPORTANTE: Convierte velocidades históricas (excesos 100-149 km/h) 
    a velocidades RECOMENDADAS según normativa ecuatoriana.
    
    Retorna:
    - Velocidades recomendadas por hora (para LineChart)
    - Niveles de congestión por zona
    - Confianza de predicción basada en cantidad de datos
    """
    dataset = get_traffic_dataset()
    
    if not dataset.is_loaded:
        raise HTTPException(status_code=503, detail="Dataset no disponible")
    
    # Obtener estadísticas por hora
    hourly_stats = dataset.get_stats_by_hour(ciudad)
    
    if not hourly_stats:
        raise HTTPException(
            status_code=404, 
            detail=f"No hay datos suficientes para {ciudad or 'analizar'}"
        )
    
    # CONVERTIR velocidades históricas (excesos) a velocidades RECOMENDADAS
    velocidades_ajustadas = VelocityCalculator.adjust_hourly_velocities(
        hourly_stats,
        tipo_vehiculo=tipo_vehiculo
    )
    
    if not hourly_stats:
        raise HTTPException(
            status_code=404, 
            detail=f"No hay datos suficientes para {ciudad or 'analizar'}"
        )
    
    # Calcular niveles de congestión por zona
    ciudades_cercanas = []
    if ciudad:
        # Obtener ciudades de la misma provincia
        df = dataset._df
        ciudad_data = df[df['CIUDAD_OPER'].str.upper() == ciudad.upper()].iloc[0] if len(df[df['CIUDAD_OPER'].str.upper() == ciudad.upper()]) > 0 else None
        
        if ciudad_data is not None and 'PROVINCIA_C' in df.columns:
            provincia_ciudad = ciudad_data['PROVINCIA_C']
            ciudades_prov = dataset.get_ciudades(provincia_ciudad)[:5]
            
            for c in ciudades_prov:
                stats = dataset.get_stats_by_city(c)
                if 'error' not in stats:
                    vel_prom = stats['velocidad_promedio']
                    # Congestión inversa a velocidad (menor vel = mayor congestión)
                    congestion = max(0, min(1, (120 - vel_prom) / 120))
                    
                    nivel = "Muy Alta" if congestion >= 0.7 else \
                           "Alta" if congestion >= 0.5 else \
                           "Media" if congestion >= 0.3 else "Baja"
                    
                    color = "text-red-600" if congestion >= 0.7 else \
                           "text-orange-600" if congestion >= 0.5 else \
                           "text-yellow-600" if congestion >= 0.3 else "text-green-600"
                    
                    ciudades_cercanas.append({
                        "zona": str(c),
                        "congestion": float(round(congestion, 2)),
                        "nivel": str(nivel),
                        "color": str(color),
                        "velocidad_promedio": float(vel_prom)
                    })
    
    # Calcular confianza global
    total_registros = sum(h.get('registros', 0) for h in hourly_stats)
    confianza = min(0.95, total_registros / 1000)  # Máximo 95% de confianza
    
    # Obtener tipo de zona predominante
    tipo_zona = velocidades_ajustadas[0].get("tipo_zona", "carretera") if velocidades_ajustadas else "carretera"
    
    return {
        "zona": str(ciudad) if ciudad else "Ecuador",
        "fecha": datetime.now().strftime("%Y-%m-%d"),  # Fecha actual como pronóstico
        "hora": datetime.now().strftime("%H:%M"),
        "velocidades": velocidades_ajustadas,  # Velocidades RECOMENDADAS (ajustadas)
        "congestion": ciudades_cercanas,
        "confianza": float(round(confianza, 2)),
        "ultimaActualizacion": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
        "tipo_datos": "velocidades_recomendadas",
        "tipo_vehiculo": str(tipo_vehiculo),
        "tipo_zona": str(tipo_zona),
        "total_registros": int(total_registros),
        "fuente": "Velocidades recomendadas basadas en normativa ecuatoriana y patrones históricos (Dataset 2022)",
        "nota": "Las velocidades mostradas son RECOMENDACIONES SEGURAS, no los excesos históricos detectados"
    }


@router.get("/congestion-zones")
async def get_congestion_zones(
    provincia: Optional[str] = Query(None, description="Filtrar por provincia"),
    top: int = Query(10, ge=1, le=50, description="Cantidad de zonas a retornar")
) -> Dict[str, Any]:
    """
    Obtiene las zonas con mayor/menor congestión basado en velocidades.
    Útil para mapas de calor y alertas.
    """
    dataset = get_traffic_dataset()
    
    if not dataset.is_loaded:
        raise HTTPException(status_code=503, detail="Dataset no disponible")
    
    df = dataset._df.copy()
    
    if provincia:
        df = df[df['PROVINCIA_C'].str.upper() == provincia.upper()]
    
    # Agrupar por ubicación
    grouped = df.groupby(['UBICACION_EXCESO', 'CIUDAD_OPER', 'PROVINCIA_C', 'LATITUD', 'LONGITUD']).agg({
        'VELOCIDAD': ['mean', 'count', 'std']
    }).reset_index()
    
    grouped.columns = ['ubicacion', 'ciudad', 'provincia', 'lat', 'lon', 'velocidad_promedio', 'registros', 'desviacion']
    
    # Calcular score de congestión (menor velocidad + más datos = mayor congestión)
    grouped['congestion_score'] = (120 - grouped['velocidad_promedio']) * (grouped['registros'] / grouped['registros'].max())
    
    # Top zonas congestionadas
    top_congestion = grouped.nlargest(top, 'congestion_score')
    
    # Top zonas fluidas
    grouped['flujo_score'] = grouped['velocidad_promedio'] * (grouped['registros'] / grouped['registros'].max())
    top_fluido = grouped.nlargest(top, 'flujo_score')
    
    def format_zone(row):
        vel = row['velocidad_promedio']
        return {
            "ubicacion": row['ubicacion'],
            "ciudad": row['ciudad'],
            "provincia": row['provincia'],
            "lat": float(row['lat']) if row['lat'] else None,
            "lon": float(row['lon']) if row['lon'] else None,
            "velocidad_promedio": round(vel, 1),
            "registros": int(row['registros']),
            "nivel_trafico": dataset.get_traffic_level(vel, 60),
            "confianza": min(1.0, row['registros'] / 100)
        }
    
    return {
        "provincia": provincia or "todas",
        "zonas_congestionadas": [format_zone(row) for _, row in top_congestion.iterrows()],
        "zonas_fluidas": [format_zone(row) for _, row in top_fluido.iterrows()]
    }


@router.get("/forecast/{ciudad}")
async def get_traffic_forecast(
    ciudad: str,
    hora: Optional[int] = Query(None, ge=0, le=23, description="Hora objetivo (0-23)")
) -> Dict[str, Any]:
    """
    Pronóstico de tráfico para una ciudad basado en patrones históricos.
    
    Parámetros:
    - ciudad: Nombre de la ciudad
    - hora: (opcional) Hora específica a predecir
    
    Retorna predicción basada en promedios históricos.
    """
    dataset = get_traffic_dataset()
    
    if not dataset.is_loaded:
        raise HTTPException(status_code=503, detail="Dataset no disponible")
    
    # Obtener datos de la ciudad
    df = dataset._df
    ciudad_df = df[df['CIUDAD_OPER'].str.upper() == ciudad.upper()]
    
    if len(ciudad_df) == 0:
        raise HTTPException(status_code=404, detail=f"No hay datos para {ciudad}")
    
    # Si se especifica hora, filtrar
    if hora is not None and 'HORA' in ciudad_df.columns:
        hora_df = ciudad_df[ciudad_df['HORA'] == hora]
        if len(hora_df) == 0:
            raise HTTPException(status_code=404, detail=f"No hay datos para {ciudad} a las {hora}:00")
        
        velocidad_pred = hora_df['VELOCIDAD'].mean()
        registros = len(hora_df)
        nivel = dataset.get_traffic_level(velocidad_pred, 60)
        
        return {
            "ciudad": ciudad,
            "hora_predicha": f"{hora:02d}:00",
            "velocidad_predicha": round(velocidad_pred, 1),
            "nivel_trafico": nivel,
            "confianza": min(0.95, registros / 50),
            "registros_historicos": registros
        }
    
    # Predicción general por hora
    hourly = dataset.get_stats_by_hour(ciudad)
    
    return {
        "ciudad": ciudad,
        "predicciones_por_hora": hourly,
        "resumen": dataset.get_stats_by_city(ciudad),
        "horas_pico": dataset.get_peak_hours(ciudad)
    }
