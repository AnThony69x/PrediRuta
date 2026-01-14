"""
Servicio de Geocoding de Mapbox

Este módulo proporciona funcionalidades para:
- Geocodificación directa (dirección -> coordenadas)
- Geocodificación inversa (coordenadas -> dirección)
- Búsqueda de lugares
- Autocompletado de direcciones
"""

import time
from typing import Any, Dict, List, Optional, Tuple
import httpx
from app.config.mapbox import mapbox_config


# Cache simple
_geocode_cache: Dict[str, Dict[str, Any]] = {}
_CACHE_TTL = 3600  # 1 hora para geocoding


def _cache_key(query: str, reverse: bool = False) -> str:
    """Generar clave de cache"""
    prefix = "rev" if reverse else "fwd"
    return f"{prefix}:{query.lower()}"


async def geocode_forward(
    query: str,
    country: Optional[str] = "EC",  # Ecuador por defecto
    types: Optional[List[str]] = None,
    limit: int = 5,
    language: str = "es",
) -> Dict[str, Any]:
    """
    Geocodificación directa: convertir dirección o lugar en coordenadas
    
    Args:
        query: Dirección o nombre del lugar a buscar
        country: Código ISO de país para filtrar (EC = Ecuador)
        types: Tipos de resultados (place, address, poi, neighborhood, etc.)
        limit: Número máximo de resultados
        language: Idioma de los resultados (es, en)
    
    Returns:
        Lista de lugares con coordenadas y detalles
        
    Ejemplo:
        result = await geocode_forward("Av. 4 de Noviembre, Manta")
        
    Documentación:
        https://docs.mapbox.com/api/search/geocoding/
    """
    
    # Validar configuración
    valid, message = mapbox_config.validate()
    if not valid:
        return {"status": "error", "code": 428, "message": message}
    
    # Verificar cache
    cache_key = _cache_key(query, False)
    cached = _geocode_cache.get(cache_key)
    if cached and (time.time() - cached["t"]) < _CACHE_TTL:
        return cached["v"]
    
    # Construir URL
    url = f"{mapbox_config.geocoding_url}/{query}.json"
    
    # Parámetros
    params = {
        "access_token": mapbox_config.access_token,
        "limit": limit,
        "language": language,
    }
    
    if country:
        params["country"] = country
    
    if types:
        params["types"] = ",".join(types)
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            
            if response.status_code != 200:
                error_detail = response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text
                return {
                    "status": "error",
                    "code": response.status_code,
                    "message": f"Error de Mapbox Geocoding API: {error_detail}",
                }
            
            data = response.json()
            
            # Formatear resultados
            result = {
                "status": "ok",
                "provider": "mapbox",
                "query": query,
                "results": [
                    {
                        "name": feature.get("text"),
                        "place_name": feature.get("place_name"),
                        "coordinates": {
                            "longitude": feature.get("center", [None, None])[0],
                            "latitude": feature.get("center", [None, None])[1],
                        },
                        "bbox": feature.get("bbox"),  # Bounding box
                        "place_type": feature.get("place_type", []),
                        "relevance": feature.get("relevance"),
                        "address": feature.get("address"),
                        "context": feature.get("context", []),  # Información jerárquica (ciudad, región, etc.)
                    }
                    for feature in data.get("features", [])
                ],
            }
            
            # Guardar en cache
            _geocode_cache[cache_key] = {"t": time.time(), "v": result}
            
            return result
            
    except httpx.RequestError as e:
        return {"status": "error", "code": 503, "message": f"Error de conexión: {str(e)}"}
    except Exception as e:
        return {"status": "error", "code": 500, "message": f"Error interno: {str(e)}"}


async def geocode_reverse(
    longitude: float,
    latitude: float,
    types: Optional[List[str]] = None,
    language: str = "es",
) -> Dict[str, Any]:
    """
    Geocodificación inversa: convertir coordenadas en dirección
    
    Args:
        longitude: Longitud
        latitude: Latitud
        types: Tipos de resultados a buscar
        language: Idioma de los resultados
    
    Returns:
        Información del lugar en esas coordenadas
        
    Ejemplo:
        result = await geocode_reverse(-80.72, -0.95)  # Manta
        
    Documentación:
        https://docs.mapbox.com/api/search/geocoding/#reverse-geocoding
    """
    
    # Validar configuración
    valid, message = mapbox_config.validate()
    if not valid:
        return {"status": "error", "code": 428, "message": message}
    
    # Verificar cache
    query_str = f"{round(longitude, 6)},{round(latitude, 6)}"
    cache_key = _cache_key(query_str, True)
    cached = _geocode_cache.get(cache_key)
    if cached and (time.time() - cached["t"]) < _CACHE_TTL:
        return cached["v"]
    
    # Construir URL
    url = f"{mapbox_config.geocoding_url}/{longitude},{latitude}.json"
    
    # Parámetros
    params = {
        "access_token": mapbox_config.access_token,
        "language": language,
    }
    
    if types:
        params["types"] = ",".join(types)
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            
            if response.status_code != 200:
                error_detail = response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text
                return {
                    "status": "error",
                    "code": response.status_code,
                    "message": f"Error de Mapbox Geocoding API: {error_detail}",
                }
            
            data = response.json()
            
            if not data.get("features"):
                return {
                    "status": "ok",
                    "provider": "mapbox",
                    "coordinates": {"longitude": longitude, "latitude": latitude},
                    "result": None,
                    "message": "No se encontró información para estas coordenadas",
                }
            
            # Tomar el primer resultado (más relevante)
            feature = data["features"][0]
            
            result = {
                "status": "ok",
                "provider": "mapbox",
                "coordinates": {"longitude": longitude, "latitude": latitude},
                "result": {
                    "name": feature.get("text"),
                    "place_name": feature.get("place_name"),
                    "place_type": feature.get("place_type", []),
                    "address": feature.get("address"),
                    "context": feature.get("context", []),
                },
            }
            
            # Guardar en cache
            _geocode_cache[cache_key] = {"t": time.time(), "v": result}
            
            return result
            
    except httpx.RequestError as e:
        return {"status": "error", "code": 503, "message": f"Error de conexión: {str(e)}"}
    except Exception as e:
        return {"status": "error", "code": 500, "message": f"Error interno: {str(e)}"}


async def search_places(
    query: str,
    proximity: Optional[Tuple[float, float]] = None,  # (longitude, latitude)
    bbox: Optional[Tuple[float, float, float, float]] = None,  # (min_lon, min_lat, max_lon, max_lat)
    country: Optional[str] = "EC",
    limit: int = 10,
) -> Dict[str, Any]:
    """
    Buscar lugares (POIs, direcciones, etc.) con filtros avanzados
    
    Args:
        query: Texto a buscar
        proximity: Coordenadas (lon, lat) para priorizar resultados cercanos
        bbox: Bounding box para limitar búsqueda
        country: Código ISO de país
        limit: Número máximo de resultados
    
    Returns:
        Lista de lugares encontrados
    """
    
    params_extra = {}
    
    if proximity:
        params_extra["proximity"] = f"{proximity[0]},{proximity[1]}"
    
    if bbox:
        params_extra["bbox"] = f"{bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]}"
    
    # Reutilizar geocode_forward con parámetros adicionales
    result = await geocode_forward(query, country=country, limit=limit)
    
    return result
