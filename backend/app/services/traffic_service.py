import os
import time
from typing import Any, Dict, Optional

import httpx


# Caché en memoria muy simple con TTL
_cache: Dict[str, Dict[str, Any]] = {}
_TTL_SECONDS = int(os.getenv("TRAFFIC_CACHE_TTL", "30"))


def _cache_key(lat: float, lon: float) -> str:
    # Redondeo para evitar demasiadas claves; ~100 m de precisión
    return f"{round(lat, 4)}:{round(lon, 4)}"


async def get_traffic_status_for_point(lat: float, lon: float) -> Dict[str, Any]:
    provider = os.getenv("TRAFFIC_PROVIDER", "tomtom").lower()
    if provider not in ("tomtom",):
        return {"status": "unavailable", "code": 503, "message": f"Proveedor no soportado: {provider}"}

    api_key = os.getenv("TRAFFIC_API_KEY")
    if not api_key:
        return {"status": "unavailable", "code": 428, "message": "Falta TRAFFIC_API_KEY en el backend"}

    key = _cache_key(lat, lon)
    now = time.time()
    cached = _cache.get(key)
    if cached and (now - cached["t"]) < _TTL_SECONDS:
        return cached["v"]

    # TomTom Traffic Flow Segment Data API v4
    # Intento 1: absolute; Fallback: relative0 si absolute falla (planes que no incluyen absolute)
    endpoints = [
        ("absolute", "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json"),
        ("relative0", "https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json"),
    ]
    params = {"point": f"{lat},{lon}", "unit": "KMPH", "key": api_key}

    async with httpx.AsyncClient(timeout=10.0) as client:
        last_error = None
        for mode, url in endpoints:
            try:
                resp = await client.get(url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    break
                else:
                    error_body = resp.text[:500]  # Más detalle
                    last_error = {
                        "status": "unavailable",
                        "code": resp.status_code,
                        "message": f"TomTom {mode} HTTP {resp.status_code}: {error_body}",
                    }
                    # Log para debugging
                    print(f"❌ TomTom {mode} falló: {resp.status_code} - {error_body}")
            except httpx.RequestError as e:
                last_error = {"status": "unavailable", "code": 503, "message": f"Error de red: {e}"}
                print(f"❌ Error de red en TomTom {mode}: {e}")
        else:
            # Ningún endpoint funcionó
            return last_error or {"status": "unavailable", "code": 502, "message": "Proveedor TomTom no disponible"}

    # TomTom response shape (simplificado):
    # {
    #   "flowSegmentData": {
    #       "frc": "FRC3",
    #       "currentSpeed": 45,
    #       "freeFlowSpeed": 65,
    #       "confidence": 0.98,
    #       ...
    #   }
    # }
    fsd: Optional[Dict[str, Any]] = data.get("flowSegmentData") if isinstance(data, dict) else None
    if not fsd:
        return {"status": "unavailable", "code": 502, "message": "Respuesta TomTom sin flowSegmentData"}

    result = {
        "status": "ok",
        "provider": "tomtom",
        "currentSpeed": fsd.get("currentSpeed"),
        "freeFlowSpeed": fsd.get("freeFlowSpeed"),
        "confidence": fsd.get("confidence"),
        "raw": data,
    }

    _cache[key] = {"t": now, "v": result}
    return result
