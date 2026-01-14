"""
Rutas API para servicios de Mapbox

Endpoints para:
- Direcciones y rutas
- Geocodificación
- Imágenes estáticas
- Información de tráfico
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Tuple
from pydantic import BaseModel

from app.services.mapbox_directions import get_directions, get_route_with_traffic, get_matrix
from app.services.mapbox_geocoding import geocode_forward, geocode_reverse, search_places
from app.services.mapbox_static import generate_static_image, generate_route_image, generate_traffic_snapshot


router = APIRouter(prefix="/api/mapbox", tags=["mapbox"])


# ==================== MODELOS ====================

class CoordinatesModel(BaseModel):
    longitude: float
    latitude: float


class DirectionsRequest(BaseModel):
    coordinates: List[CoordinatesModel]
    profile: Optional[str] = "driving-traffic"
    alternatives: Optional[bool] = True
    steps: Optional[bool] = True
    annotations: Optional[List[str]] = None


class MarkerModel(BaseModel):
    longitude: float
    latitude: float
    color: Optional[str] = None
    label: Optional[str] = None


class PathModel(BaseModel):
    coordinates: List[Tuple[float, float]]
    stroke_width: Optional[int] = 5
    stroke_color: Optional[str] = "0000ff"
    stroke_opacity: Optional[float] = 0.8


class StaticImageRequest(BaseModel):
    longitude: float
    latitude: float
    zoom: Optional[int] = 13
    width: Optional[int] = 600
    height: Optional[int] = 400
    style: Optional[str] = "streets-v12"
    markers: Optional[List[MarkerModel]] = None
    path: Optional[PathModel] = None
    bearing: Optional[float] = 0
    pitch: Optional[float] = 0
    retina: Optional[bool] = False


# ==================== ENDPOINTS ====================

@router.post("/directions")
async def get_directions_endpoint(request: DirectionsRequest):
    """
    Obtener direcciones entre múltiples puntos
    
    **Perfiles disponibles:**
    - `driving-traffic`: Conducción con tráfico en tiempo real
    - `driving`: Conducción sin considerar tráfico
    - `walking`: Caminando
    - `cycling`: Ciclismo
    
    **Ejemplo de uso:**
    ```json
    {
        "coordinates": [
            {"longitude": -80.72, "latitude": -0.95},
            {"longitude": -79.88, "latitude": -2.19}
        ],
        "profile": "driving-traffic",
        "alternatives": true
    }
    ```
    """
    coords = [(c.longitude, c.latitude) for c in request.coordinates]
    
    result = await get_directions(
        coordinates=coords,
        profile=request.profile or "driving-traffic",
        alternatives=request.alternatives,
        steps=request.steps,
        annotations=request.annotations or ["duration", "distance", "speed", "congestion"],
    )
    
    if result.get("status") == "error":
        raise HTTPException(status_code=result.get("code", 500), detail=result.get("message"))
    
    return result


@router.get("/route")
async def get_route_endpoint(
    start_lon: float = Query(..., description="Longitud del punto inicial"),
    start_lat: float = Query(..., description="Latitud del punto inicial"),
    end_lon: float = Query(..., description="Longitud del punto final"),
    end_lat: float = Query(..., description="Latitud del punto final"),
    alternatives: bool = Query(True, description="Incluir rutas alternativas"),
):
    """
    Obtener ruta con información de tráfico entre dos puntos
    
    **Ejemplo:**
    - Manta a Guayaquil: `/route?start_lon=-80.72&start_lat=-0.95&end_lon=-79.88&end_lat=-2.19`
    """
    result = await get_route_with_traffic(
        start=(start_lon, start_lat),
        end=(end_lon, end_lat),
        alternatives=alternatives,
    )
    
    if result.get("status") == "error":
        raise HTTPException(status_code=result.get("code", 500), detail=result.get("message"))
    
    return result


@router.get("/geocode/forward")
async def geocode_forward_endpoint(
    query: str = Query(..., description="Dirección o lugar a buscar"),
    country: Optional[str] = Query("EC", description="Código ISO del país (EC = Ecuador)"),
    limit: int = Query(5, description="Número máximo de resultados"),
    language: str = Query("es", description="Idioma de los resultados"),
):
    """
    Geocodificación directa: convertir dirección en coordenadas
    
    **Ejemplo:**
    - `/geocode/forward?query=Av. 4 de Noviembre, Manta&country=EC`
    """
    result = await geocode_forward(
        query=query,
        country=country,
        limit=limit,
        language=language,
    )
    
    if result.get("status") == "error":
        raise HTTPException(status_code=result.get("code", 500), detail=result.get("message"))
    
    return result


@router.get("/geocode/reverse")
async def geocode_reverse_endpoint(
    longitude: float = Query(..., description="Longitud"),
    latitude: float = Query(..., description="Latitud"),
    language: str = Query("es", description="Idioma de los resultados"),
):
    """
    Geocodificación inversa: convertir coordenadas en dirección
    
    **Ejemplo:**
    - `/geocode/reverse?longitude=-80.72&latitude=-0.95`
    """
    result = await geocode_reverse(
        longitude=longitude,
        latitude=latitude,
        language=language,
    )
    
    if result.get("status") == "error":
        raise HTTPException(status_code=result.get("code", 500), detail=result.get("message"))
    
    return result


@router.get("/places/search")
async def search_places_endpoint(
    query: str = Query(..., description="Texto a buscar"),
    proximity_lon: Optional[float] = Query(None, description="Longitud para priorizar resultados cercanos"),
    proximity_lat: Optional[float] = Query(None, description="Latitud para priorizar resultados cercanos"),
    country: Optional[str] = Query("EC", description="Código ISO del país"),
    limit: int = Query(10, description="Número máximo de resultados"),
):
    """
    Buscar lugares (POIs, direcciones, etc.)
    
    **Ejemplo:**
    - `/places/search?query=hospital&proximity_lon=-80.72&proximity_lat=-0.95`
    """
    proximity = None
    if proximity_lon is not None and proximity_lat is not None:
        proximity = (proximity_lon, proximity_lat)
    
    result = await search_places(
        query=query,
        proximity=proximity,
        country=country,
        limit=limit,
    )
    
    if result.get("status") == "error":
        raise HTTPException(status_code=result.get("code", 500), detail=result.get("message"))
    
    return result


@router.post("/static/image")
async def generate_static_image_endpoint(request: StaticImageRequest):
    """
    Generar imagen estática de un mapa
    
    **Estilos disponibles:**
    - streets-v12, outdoors-v12, light-v11, dark-v11
    - satellite-v9, satellite-streets-v12
    - navigation-day-v1, navigation-night-v1
    
    **Ejemplo de uso:**
    ```json
    {
        "longitude": -80.72,
        "latitude": -0.95,
        "zoom": 13,
        "width": 800,
        "height": 600,
        "markers": [
            {"longitude": -80.72, "latitude": -0.95, "color": "red", "label": "A"}
        ]
    }
    ```
    """
    markers_list = None
    if request.markers:
        markers_list = [
            {
                "longitude": m.longitude,
                "latitude": m.latitude,
                "color": m.color,
                "label": m.label,
            }
            for m in request.markers
        ]
    
    path_dict = None
    if request.path:
        path_dict = {
            "coordinates": request.path.coordinates,
            "stroke_width": request.path.stroke_width,
            "stroke_color": request.path.stroke_color,
            "stroke_opacity": request.path.stroke_opacity,
        }
    
    result = await generate_static_image(
        longitude=request.longitude,
        latitude=request.latitude,
        zoom=request.zoom or 13,
        width=request.width or 600,
        height=request.height or 400,
        style=request.style or "streets-v12",
        markers=markers_list,
        path=path_dict,
        bearing=request.bearing or 0,
        pitch=request.pitch or 0,
        retina=request.retina or False,
    )
    
    if result.get("status") == "error":
        raise HTTPException(status_code=result.get("code", 500), detail=result.get("message"))
    
    return result


@router.post("/static/route")
async def generate_route_image_endpoint(
    coordinates: List[CoordinatesModel],
    width: int = Query(800, description="Ancho de la imagen"),
    height: int = Query(600, description="Alto de la imagen"),
    style: str = Query("streets-v12", description="Estilo del mapa"),
    markers: bool = Query(True, description="Incluir marcadores de inicio/fin"),
):
    """
    Generar imagen estática de una ruta completa
    
    **Ejemplo de uso:**
    ```json
    {
        "coordinates": [
            {"longitude": -80.72, "latitude": -0.95},
            {"longitude": -79.88, "latitude": -2.19}
        ],
        "width": 800,
        "height": 600
    }
    ```
    """
    coords = [(c.longitude, c.latitude) for c in coordinates]
    
    result = await generate_route_image(
        coordinates=coords,
        width=width,
        height=height,
        style=style,
        markers=markers,
    )
    
    if result.get("status") == "error":
        raise HTTPException(status_code=result.get("code", 500), detail=result.get("message"))
    
    return result


@router.get("/static/traffic-snapshot")
async def generate_traffic_snapshot_endpoint(
    longitude: float = Query(..., description="Longitud del centro"),
    latitude: float = Query(..., description="Latitud del centro"),
    zoom: int = Query(14, description="Nivel de zoom"),
    width: int = Query(800, description="Ancho de la imagen"),
    height: int = Query(600, description="Alto de la imagen"),
):
    """
    Generar snapshot de tráfico en una ubicación específica
    
    **Ejemplo:**
    - `/static/traffic-snapshot?longitude=-80.72&latitude=-0.95&zoom=14`
    """
    result = await generate_traffic_snapshot(
        longitude=longitude,
        latitude=latitude,
        zoom=zoom,
        width=width,
        height=height,
    )
    
    if result.get("status") == "error":
        raise HTTPException(status_code=result.get("code", 500), detail=result.get("message"))
    
    return result


@router.post("/matrix")
async def get_matrix_endpoint(
    coordinates: List[CoordinatesModel],
    profile: str = Query("driving-traffic", description="Perfil de ruta"),
    sources: Optional[List[int]] = Query(None, description="Índices de puntos origen"),
    destinations: Optional[List[int]] = Query(None, description="Índices de puntos destino"),
):
    """
    Obtener matriz de distancias/tiempos entre múltiples puntos
    
    **Ejemplo de uso:**
    ```json
    {
        "coordinates": [
            {"longitude": -80.72, "latitude": -0.95},
            {"longitude": -79.88, "latitude": -2.19},
            {"longitude": -78.51, "latitude": -0.22}
        ],
        "profile": "driving-traffic"
    }
    ```
    """
    coords = [(c.longitude, c.latitude) for c in coordinates]
    
    result = await get_matrix(
        coordinates=coords,
        profile=profile,
        sources=sources,
        destinations=destinations,
    )
    
    if result.get("status") == "error":
        raise HTTPException(status_code=result.get("code", 500), detail=result.get("message"))
    
    return result
