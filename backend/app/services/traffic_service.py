import os
import time
from typing import Any, Dict, Optional, Tuple

import httpx
from app.config.mapbox import mapbox_config
from app.services.mapbox_directions import get_route_with_traffic


# Caché en memoria muy simple con TTL
_cache: Dict[str, Dict[str, Any]] = {}
_TTL_SECONDS = int(os.getenv("TRAFFIC_CACHE_TTL", "30"))


def _cache_key(lat: float, lon: float) -> str:
    # Redondeo para evitar demasiadas claves; ~100 m de precisión
    return f"{round(lat, 4)}:{round(lon, 4)}"


async def get_traffic_status_for_point(lat: float, lon: float) -> Dict[str, Any]:
    """
    Obtiene el estado del tráfico para un punto específico usando Mapbox.
    
    ✅ FUNCIONA EN ECUADOR (incluyendo Manta, Quito, Guayaquil)
    
    Mapbox proporciona información de tráfico global incluyendo:
    - Datos de tráfico en tiempo real
    - Velocidades actuales vs flujo libre
    - Niveles de congestión
    - Compatible con todas las ciudades principales de Ecuador
    
    Ejemplo de coordenadas Ecuador:
    - Manta: lat=-0.95, lon=-80.72
    - Quito: lat=-0.22, lon=-78.51
    - Guayaquil: lat=-2.19, lon=-79.88
    
    Nota: Mapbox proporciona datos de tráfico principalmente a través de:
    1. Directions API con perfil "driving-traffic"
    2. Vector tiles con capa de tráfico
    
    Para un punto específico, calculamos una ruta corta alrededor del punto
    para obtener información de congestión.
    """
    
    # Validar configuración
    valid, message = mapbox_config.validate()
    if not valid:
        return {"status": "unavailable", "code": 428, "message": message}

    key = _cache_key(lat, lon)
    now = time.time()
    cached = _cache.get(key)
    if cached and (now - cached["t"]) < _TTL_SECONDS:
        return cached["v"]

    # Estrategia: Crear una ruta corta alrededor del punto para obtener datos de tráfico
    # Offset pequeño (~500m) en diferentes direcciones
    offset = 0.005  # Aproximadamente 500 metros
    
    # Punto inicial (el punto consultado)
    start = (lon, lat)
    # Punto final (ligeramente al norte)
    end = (lon, lat + offset)
    
    try:
        # Obtener ruta con información de tráfico
        route_data = await get_route_with_traffic(start, end, alternatives=False)
        
        if route_data.get("status") != "ok":
            return {
                "status": "unavailable",
                "code": route_data.get("code", 503),
                "message": f"No se pudo obtener datos de tráfico: {route_data.get('message', 'Error desconocido')}",
            }
        
        # Extraer información de la ruta
        routes = route_data.get("routes", [])
        if not routes:
            return {
                "status": "unavailable",
                "code": 404,
                "message": "No hay datos de tráfico disponibles para este punto",
            }
        
        route = routes[0]
        legs = route.get("legs", [])
        
        if not legs:
            return {
                "status": "unavailable",
                "code": 404,
                "message": "No hay información de segmentos para esta ruta",
            }
        
        leg = legs[0]
        annotation = leg.get("annotation", {})
        
        # Obtener velocidades y congestión
        speeds = annotation.get("speed", [])
        congestion_levels = annotation.get("congestion", [])
        duration = leg.get("duration", 0)
        distance = leg.get("distance", 0)
        
        # Calcular velocidad promedio actual
        current_speed = None
        if distance > 0 and duration > 0:
            # Velocidad en km/h
            current_speed = (distance / duration) * 3.6
        
        # Determinar nivel de congestión promedio
        congestion_level = "unknown"
        if congestion_levels:
            # Mapbox devuelve: low, moderate, heavy, severe
            # Contar ocurrencias
            congestion_counts = {}
            for level in congestion_levels:
                congestion_counts[level] = congestion_counts.get(level, 0) + 1
            
            # Nivel más común
            congestion_level = max(congestion_counts.items(), key=lambda x: x[1])[0] if congestion_counts else "unknown"
        
        # Estimar velocidad de flujo libre (aproximación)
        # En flujo libre, típicamente se viaja a velocidad límite o cercana
        # Para Ecuador: ~60-80 km/h en vías urbanas principales
        free_flow_speed = current_speed * 1.5 if current_speed else 60.0
        
        # Mapear congestion_level a valores numéricos para compatibilidad
        congestion_map = {
            "low": 0.2,
            "moderate": 0.5,
            "heavy": 0.7,
            "severe": 0.9,
            "unknown": 0.0,
        }
        
        result = {
            "status": "ok",
            "provider": "mapbox",
            "currentSpeed": round(current_speed, 1) if current_speed else None,
            "freeFlowSpeed": round(free_flow_speed, 1),
            "confidence": 1.0 if congestion_levels else 0.5,
            "roadClosure": False,
            "congestionLevel": congestion_level,
            "congestionValue": congestion_map.get(congestion_level, 0.0),
            "coordinates": {"lat": lat, "lon": lon},
        }
        
        # Guardar en cache
        _cache[key] = {"t": now, "v": result}
        return result
        
    except Exception as e:
        error_result = {
            "status": "unavailable",
            "code": 500,
            "message": f"Error al obtener tráfico: {str(e)}",
        }
        return error_result


async def get_traffic_for_route(
    coordinates: list[Tuple[float, float]]
) -> Dict[str, Any]:
    """
    Obtiene información detallada de tráfico para una ruta completa.
    
    Args:
        coordinates: Lista de tuplas (longitud, latitud) que forman la ruta
    
    Returns:
        Información de tráfico segmentada por la ruta
    """
    
    if not coordinates or len(coordinates) < 2:
        return {
            "status": "error",
            "code": 400,
            "message": "Se requieren al menos 2 coordenadas",
        }
    
    try:
        from app.services.mapbox_directions import get_directions
        
        # Obtener ruta con datos de tráfico
        route_data = await get_directions(
            coordinates=coordinates,
            profile="driving-traffic",
            alternatives=False,
            annotations=["duration", "distance", "speed", "congestion"],
        )
        
        if route_data.get("status") != "ok":
            return route_data
        
        routes = route_data.get("routes", [])
        if not routes:
            return {
                "status": "error",
                "code": 404,
                "message": "No se encontró ruta",
            }
        
        route = routes[0]
        
        return {
            "status": "ok",
            "provider": "mapbox",
            "route": route,
            "total_distance": route.get("distance"),
            "total_duration": route.get("duration"),
        }
        
    except Exception as e:
        return {
            "status": "error",
            "code": 500,
            "message": f"Error: {str(e)}",
        }
