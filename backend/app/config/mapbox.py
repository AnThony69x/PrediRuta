"""
Configuración centralizada de Mapbox para el backend

Este módulo gestiona toda la configuración de Mapbox, incluyendo:
- Tokens de acceso
- URLs de APIs
- Configuración de límites
- Validación de configuración
"""

import os
from typing import Dict, Any, List, Tuple
from dataclasses import dataclass


@dataclass
class MapboxConfig:
    """Configuración de Mapbox"""
    
    # Token de acceso
    access_token: str
    
    # URLs de APIs
    directions_url: str = "https://api.mapbox.com/directions/v5/mapbox"
    geocoding_url: str = "https://api.mapbox.com/geocoding/v5/mapbox.places"
    static_images_url: str = "https://api.mapbox.com/styles/v1"
    static_tiles_url: str = "https://api.mapbox.com/v4"
    
    # Configuración de cache
    cache_ttl: int = 30  # segundos
    
    # Límites del plan gratuito (para monitoreo)
    map_loads_limit: int = 50000      # 50K cargas de mapa web/mes
    static_tiles_limit: int = 200000   # 200K tiles estáticos/mes
    static_images_limit: int = 50000   # 50K imágenes estáticas/mes
    mobile_mau_limit: int = 25000      # 25K usuarios activos móviles/mes
    
    def validate(self) -> Tuple[bool, str]:
        """Validar configuración"""
        if not self.access_token:
            return False, "Token de Mapbox no configurado. Configura MAPBOX_ACCESS_TOKEN en .env"
        
        if self.access_token == "your-mapbox-access-token-here":
            return False, "Token de Mapbox es el valor por defecto. Configura un token válido en .env"
        
        return True, "Mapbox configurado correctamente"


def get_mapbox_config() -> MapboxConfig:
    """Obtener configuración de Mapbox desde variables de entorno"""
    return MapboxConfig(
        access_token=os.getenv("MAPBOX_ACCESS_TOKEN", ""),
        cache_ttl=int(os.getenv("TRAFFIC_CACHE_TTL", "30")),
    )


# Instancia global de configuración
mapbox_config = get_mapbox_config()


# Coordenadas de ciudades importantes de Ecuador
ECUADOR_CITIES: List[Dict[str, Any]] = [
    {"name": "Manta, Manabí", "coords": [-0.95, -80.72], "zoom": 14},
    {"name": "Quito, Pichincha", "coords": [-0.22, -78.51], "zoom": 12},
    {"name": "Guayaquil, Guayas", "coords": [-2.19, -79.88], "zoom": 12},
    {"name": "Cuenca, Azuay", "coords": [-2.90, -79.00], "zoom": 13},
    {"name": "Portoviejo, Manabí", "coords": [-1.05, -80.45], "zoom": 13},
    {"name": "Ambato, Tungurahua", "coords": [-1.24, -78.62], "zoom": 13},
    {"name": "Santo Domingo", "coords": [-0.25, -79.17], "zoom": 13},
    {"name": "Machala, El Oro", "coords": [-3.26, -79.96], "zoom": 13},
]


# Perfiles de tráfico para Directions API
TRAFFIC_PROFILES = {
    "driving": "driving-traffic",     # Conducción con tráfico
    "driving_fast": "driving",        # Conducción sin tráfico
    "walking": "walking",             # Caminando
    "cycling": "cycling",             # Ciclismo
}


# Colores para niveles de tráfico
TRAFFIC_COLORS = {
    "free": "#22c55e",       # Verde - flujo libre
    "moderate": "#eab308",   # Amarillo - moderado  
    "heavy": "#f97316",      # Naranja - pesado
    "severe": "#dc2626",     # Rojo - severo
}
