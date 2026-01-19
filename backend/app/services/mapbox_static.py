"""
Servicio de mapas estáticos de Mapbox

Este módulo proporciona funcionalidades para:
- Generar imágenes estáticas de mapas
- Incluir marcadores y rutas en imágenes
- Exportar mapas para reportes y documentos
"""

from typing import Any, Dict, List, Optional, Tuple
import httpx
from app.config.mapbox import mapbox_config


async def generate_static_image(
    longitude: float,
    latitude: float,
    zoom: int = 13,
    width: int = 600,
    height: int = 400,
    style: str = "streets-v12",
    markers: Optional[List[Dict[str, Any]]] = None,
    path: Optional[Dict[str, Any]] = None,
    bearing: float = 0,
    pitch: float = 0,
    retina: bool = False,
) -> Dict[str, Any]:
    """
    Generar imagen estática de un mapa con Mapbox Static Images API
    
    Args:
        longitude: Longitud del centro
        latitude: Latitud del centro
        zoom: Nivel de zoom (0-20)
        width: Ancho de la imagen (máx 1280px)
        height: Alto de la imagen (máx 1280px)
        style: Estilo del mapa (streets-v12, outdoors-v12, satellite-v9, etc.)
        markers: Lista de marcadores a incluir
        path: Ruta a dibujar en el mapa
        bearing: Rotación del mapa (0-359)
        pitch: Inclinación del mapa (0-60)
        retina: Si debe generar imagen @2x (mayor resolución)
    
    Returns:
        URL de la imagen estática generada
        
    Ejemplo de marcadores:
        markers = [
            {"longitude": -80.72, "latitude": -0.95, "color": "red", "label": "A"},
            {"longitude": -79.88, "latitude": -2.19, "color": "blue", "label": "B"},
        ]
        
    Ejemplo de path:
        path = {
            "coordinates": [(-80.72, -0.95), (-79.88, -2.19)],
            "stroke_width": 5,
            "stroke_color": "0000ff",
            "stroke_opacity": 0.8,
        }
        
    Documentación:
        https://docs.mapbox.com/api/maps/static-images/
    """
    
    # Validar configuración
    valid, message = mapbox_config.validate()
    if not valid:
        return {"status": "error", "code": 428, "message": message}
    
    # Validar dimensiones
    if width > 1280 or height > 1280:
        return {
            "status": "error",
            "code": 400,
            "message": "Las dimensiones máximas son 1280x1280px",
        }
    
    # Construir overlays (marcadores y rutas)
    overlays = []
    
    # Agregar marcadores
    if markers:
        for marker in markers:
            marker_str = f"pin-s"  # Tamaño pequeño
            
            if marker.get("label"):
                marker_str += f"-{marker['label']}"
            else:
                marker_str += ""
            
            if marker.get("color"):
                color = marker["color"].replace("#", "")
                marker_str += f"+{color}"
            
            marker_str += f"({marker['longitude']},{marker['latitude']})"
            overlays.append(marker_str)
    
    # Agregar ruta
    if path:
        path_str = "path"
        
        # Configuración de estilo
        if path.get("stroke_width"):
            path_str += f"-{path['stroke_width']}"
        
        if path.get("stroke_color"):
            color = path["stroke_color"].replace("#", "")
            path_str += f"+{color}"
        
        if path.get("stroke_opacity"):
            opacity = int(path["stroke_opacity"] * 100)
            path_str += f"-{opacity}"
        
        # Coordenadas
        coords = path.get("coordinates", [])
        if coords:
            path_str += "("
            path_str += ",".join([f"{lon} {lat}" for lon, lat in coords])
            path_str += ")"
            overlays.append(path_str)
    
    # Construir URL
    overlay_str = ",".join(overlays) if overlays else ""
    
    size_suffix = "@2x" if retina else ""
    size_str = f"{width}x{height}{size_suffix}"
    
    if overlay_str:
        url = f"{mapbox_config.static_images_url}/mapbox/{style}/static/{overlay_str}/{longitude},{latitude},{zoom},{bearing},{pitch}/{size_str}"
    else:
        url = f"{mapbox_config.static_images_url}/mapbox/{style}/static/{longitude},{latitude},{zoom},{bearing},{pitch}/{size_str}"
    
    # Agregar token
    image_url = f"{url}?access_token={mapbox_config.access_token}"
    
    return {
        "status": "ok",
        "provider": "mapbox",
        "image_url": image_url,
        "width": width * (2 if retina else 1),
        "height": height * (2 if retina else 1),
        "format": "png",
    }


async def generate_route_image(
    coordinates: List[Tuple[float, float]],
    width: int = 800,
    height: int = 600,
    style: str = "streets-v12",
    markers: bool = True,
) -> Dict[str, Any]:
    """
    Generar imagen estática de una ruta completa
    
    Args:
        coordinates: Lista de coordenadas (lon, lat) que forman la ruta
        width: Ancho de la imagen
        height: Alto de la imagen
        style: Estilo del mapa
        markers: Si debe incluir marcadores en inicio y fin
    
    Returns:
        URL de la imagen con la ruta dibujada
    """
    
    if not coordinates or len(coordinates) < 2:
        return {
            "status": "error",
            "code": 400,
            "message": "Se requieren al menos 2 coordenadas para dibujar una ruta",
        }
    
    # Calcular centro y zoom óptimo basado en bounding box
    lons = [coord[0] for coord in coordinates]
    lats = [coord[1] for coord in coordinates]
    
    center_lon = (min(lons) + max(lons)) / 2
    center_lat = (min(lats) + max(lats)) / 2
    
    # Calcular zoom basado en la extensión de la ruta (simplificado)
    lon_diff = max(lons) - min(lons)
    lat_diff = max(lats) - min(lats)
    max_diff = max(lon_diff, lat_diff)
    
    # Fórmula aproximada para calcular zoom
    if max_diff > 5:
        zoom = 8
    elif max_diff > 2:
        zoom = 10
    elif max_diff > 1:
        zoom = 11
    elif max_diff > 0.5:
        zoom = 12
    elif max_diff > 0.1:
        zoom = 13
    else:
        zoom = 14
    
    # Preparar marcadores
    markers_list = None
    if markers:
        markers_list = [
            {"longitude": coordinates[0][0], "latitude": coordinates[0][1], "color": "green", "label": "A"},
            {"longitude": coordinates[-1][0], "latitude": coordinates[-1][1], "color": "red", "label": "B"},
        ]
    
    # Preparar ruta
    path = {
        "coordinates": coordinates,
        "stroke_width": 5,
        "stroke_color": "0074D9",
        "stroke_opacity": 0.8,
    }
    
    return await generate_static_image(
        longitude=center_lon,
        latitude=center_lat,
        zoom=zoom,
        width=width,
        height=height,
        style=style,
        markers=markers_list,
        path=path,
    )


async def generate_traffic_snapshot(
    longitude: float,
    latitude: float,
    zoom: int = 14,
    width: int = 800,
    height: int = 600,
) -> Dict[str, Any]:
    """
    Generar snapshot de tráfico en una ubicación específica
    
    Args:
        longitude: Longitud del centro
        latitude: Latitud del centro
        zoom: Nivel de zoom
        width: Ancho de la imagen
        height: Alto de la imagen
    
    Returns:
        URL de la imagen con información de tráfico
    """
    
    # Usar estilo de navegación que incluye información de tráfico
    return await generate_static_image(
        longitude=longitude,
        latitude=latitude,
        zoom=zoom,
        width=width,
        height=height,
        style="navigation-day-v1",  # Estilo con información de tráfico
    )
