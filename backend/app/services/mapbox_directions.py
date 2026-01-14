"""
Servicio de Directions API de Mapbox

Este módulo proporciona funcionalidades para:
- Calcular rutas óptimas entre puntos
- Obtener rutas alternativas
- Calcular tiempos estimados y distancias
- Considerar tráfico en tiempo real
"""

import os
import time
from typing import Any, Dict, List, Optional, Tuple
import httpx
from app.config.mapbox import mapbox_config, TRAFFIC_PROFILES


# Cache simple para rutas
_route_cache: Dict[str, Dict[str, Any]] = {}
_CACHE_TTL = 300  # 5 minutos para rutas


def _cache_key(coordinates: List[Tuple[float, float]], profile: str) -> str:
    """Generar clave de cache para ruta"""
    coords_str = ";".join([f"{round(lon, 5)},{round(lat, 5)}" for lon, lat in coordinates])
    return f"{profile}:{coords_str}"


async def get_directions(
    coordinates: List[Tuple[float, float]],
    profile: str = "driving-traffic",
    alternatives: bool = True,
    steps: bool = True,
    geometries: str = "geojson",
    overview: str = "full",
    annotations: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """
    Obtener direcciones entre múltiples puntos usando Mapbox Directions API
    
    Args:
        coordinates: Lista de tuplas (longitud, latitud) para los waypoints
        profile: Perfil de ruta (driving-traffic, driving, walking, cycling)
        alternatives: Si debe devolver rutas alternativas
        steps: Si debe incluir instrucciones paso a paso
        geometries: Formato de geometría (geojson, polyline, polyline6)
        overview: Nivel de detalle de geometría (full, simplified, false)
        annotations: Datos adicionales a incluir (duration, distance, speed, congestion)
    
    Returns:
        Diccionario con rutas, distancias, tiempos y geometría
        
    Ejemplo de uso:
        coordinates = [(-80.72, -0.95), (-79.88, -2.19)]  # Manta -> Guayaquil
        result = await get_directions(coordinates)
        
    Documentación:
        https://docs.mapbox.com/api/navigation/directions/
    """
    
    # Validar configuración
    valid, message = mapbox_config.validate()
    if not valid:
        return {
            "status": "error",
            "code": 428,
            "message": message,
        }
    
    # Verificar cache
    cache_key = _cache_key(coordinates, profile)
    cached = _route_cache.get(cache_key)
    if cached and (time.time() - cached["t"]) < _CACHE_TTL:
        return cached["v"]
    
    # Construir URL
    coords_str = ";".join([f"{lon},{lat}" for lon, lat in coordinates])
    url = f"{mapbox_config.directions_url}/{profile}/{coords_str}"
    
    # Parámetros de la solicitud
    params = {
        "access_token": mapbox_config.access_token,
        "alternatives": "true" if alternatives else "false",
        "steps": "true" if steps else "false",
        "geometries": geometries,
        "overview": overview,
    }
    
    # Agregar anotaciones si se especifican
    if annotations:
        params["annotations"] = ",".join(annotations)
    else:
        # Por defecto incluir datos de tráfico
        params["annotations"] = "duration,distance,speed,congestion"
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, params=params)
            
            if response.status_code != 200:
                error_detail = response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text
                return {
                    "status": "error",
                    "code": response.status_code,
                    "message": f"Error de Mapbox Directions API: {error_detail}",
                }
            
            data = response.json()
            
            # Procesar respuesta
            if not data.get("routes"):
                return {
                    "status": "error",
                    "code": 404,
                    "message": "No se encontraron rutas para los puntos especificados",
                }
            
            # Formatear resultado
            result = {
                "status": "ok",
                "provider": "mapbox",
                "routes": [
                    {
                        "distance": route.get("distance"),  # Metros
                        "duration": route.get("duration"),  # Segundos
                        "geometry": route.get("geometry"),  # GeoJSON
                        "legs": [
                            {
                                "distance": leg.get("distance"),
                                "duration": leg.get("duration"),
                                "steps": leg.get("steps", []) if steps else [],
                                "annotation": leg.get("annotation", {}),
                            }
                            for leg in route.get("legs", [])
                        ],
                        "weight": route.get("weight"),
                        "weight_name": route.get("weight_name"),
                    }
                    for route in data.get("routes", [])
                ],
                "waypoints": data.get("waypoints", []),
            }
            
            # Guardar en cache
            _route_cache[cache_key] = {"t": time.time(), "v": result}
            
            return result
            
    except httpx.RequestError as e:
        return {
            "status": "error",
            "code": 503,
            "message": f"Error de conexión con Mapbox: {str(e)}",
        }
    except Exception as e:
        return {
            "status": "error",
            "code": 500,
            "message": f"Error interno: {str(e)}",
        }


async def get_route_with_traffic(
    start: Tuple[float, float],
    end: Tuple[float, float],
    alternatives: bool = True,
) -> Dict[str, Any]:
    """
    Obtener ruta con información de tráfico en tiempo real
    
    Args:
        start: Tupla (longitud, latitud) del punto inicial
        end: Tupla (longitud, latitud) del punto final
        alternatives: Si debe devolver rutas alternativas
    
    Returns:
        Diccionario con ruta principal y alternativas con datos de tráfico
    """
    return await get_directions(
        coordinates=[start, end],
        profile="driving-traffic",
        alternatives=alternatives,
        annotations=["duration", "distance", "speed", "congestion"],
    )


async def get_matrix(
    coordinates: List[Tuple[float, float]],
    profile: str = "driving-traffic",
    sources: Optional[List[int]] = None,
    destinations: Optional[List[int]] = None,
) -> Dict[str, Any]:
    """
    Obtener matriz de distancias/tiempos entre múltiples puntos usando Mapbox Matrix API
    
    Args:
        coordinates: Lista de tuplas (longitud, latitud)
        profile: Perfil de ruta
        sources: Índices de puntos origen (None = todos)
        destinations: Índices de puntos destino (None = todos)
    
    Returns:
        Matriz de distancias y duraciones
        
    Documentación:
        https://docs.mapbox.com/api/navigation/matrix/
    """
    
    # Validar configuración
    valid, message = mapbox_config.validate()
    if not valid:
        return {"status": "error", "code": 428, "message": message}
    
    # Construir URL
    coords_str = ";".join([f"{lon},{lat}" for lon, lat in coordinates])
    url = f"https://api.mapbox.com/directions-matrix/v1/mapbox/{profile}/{coords_str}"
    
    # Parámetros
    params = {
        "access_token": mapbox_config.access_token,
    }
    
    if sources:
        params["sources"] = ";".join(map(str, sources))
    if destinations:
        params["destinations"] = ";".join(map(str, destinations))
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, params=params)
            
            if response.status_code != 200:
                error_detail = response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text
                return {
                    "status": "error",
                    "code": response.status_code,
                    "message": f"Error de Mapbox Matrix API: {error_detail}",
                }
            
            data = response.json()
            
            return {
                "status": "ok",
                "provider": "mapbox",
                "durations": data.get("durations", []),  # Matriz de tiempos (segundos)
                "distances": data.get("distances", []),  # Matriz de distancias (metros)
                "destinations": data.get("destinations", []),
                "sources": data.get("sources", []),
            }
            
    except httpx.RequestError as e:
        return {"status": "error", "code": 503, "message": f"Error de conexión: {str(e)}"}
    except Exception as e:
        return {"status": "error", "code": 500, "message": f"Error interno: {str(e)}"}
