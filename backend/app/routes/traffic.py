from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any, List, Tuple
import asyncio

from app.services.traffic_service import get_traffic_status_for_point


router = APIRouter(prefix="/api/v1/traffic", tags=["Traffic"])


def parse_bbox(bbox: str):
    try:
        parts = [float(x) for x in bbox.split(",")]
        if len(parts) != 4:
            raise ValueError()
        west, south, east, north = parts
        if west >= east or south >= north:
            raise ValueError()
        return west, south, east, north
    except Exception:
        raise HTTPException(status_code=400, detail="Parámetro bbox inválido. Formato: west,south,east,north")


@router.get("/status")
async def traffic_status(
    bbox: Optional[str] = Query(None, description="Caja delimitadora west,south,east,north"),
    lat: Optional[float] = Query(None, description="Latitud del punto a consultar"),
    lon: Optional[float] = Query(None, description="Longitud del punto a consultar"),
    threshold: float = Query(0.8, ge=0.1, le=1.0, description="Umbral (0-1) para considerar tráfico: speed < freeFlow*threshold"),
) -> Dict[str, Any]:
    """
    Devuelve el estado de tráfico para el centro del bbox o para un punto (lat,lon).
    Respuesta ejemplo:
    {
      "provider": "tomtom",
      "point": {"lat": -12.05, "lon": -77.04},
      "currentSpeed": 21.5,
      "freeFlowSpeed": 45.2,
      "confidence": 0.87,
      "hasTraffic": true,
      "congestionLevel": "moderate",
      "bbox": [west,south,east,north]
    }
    """

    if bbox:
        west, south, east, north = parse_bbox(bbox)
        lat0 = (south + north) / 2.0
        lon0 = (west + east) / 2.0
        bbox_list = [west, south, east, north]

        # Muestreo: centro + 4 esquinas
        points: List[Tuple[float, float]] = [
            (lat0, lon0),
            (north, east),
            (north, west),
            (south, east),
            (south, west),
        ]

        results = await asyncio.gather(*(get_traffic_status_for_point(la, lo) for la, lo in points))

        valid = [r for r in results if r.get("status") == "ok" and r.get("currentSpeed") is not None and r.get("freeFlowSpeed")]
        if not valid:
            # Si todos fallan, devolver el primer error
            first = results[0] if results else {"status": "unavailable", "code": 502, "message": "Sin resultados"}
            raise HTTPException(status_code=first.get("code", 503), detail=first.get("message", "Proveedor no disponible"))

        # Agregación: promediar velocidades; nivel por peor ratio
        avg_current = sum(v.get("currentSpeed", 0) for v in valid) / len(valid)
        avg_free = sum(v.get("freeFlowSpeed", 0) for v in valid) / len(valid)
        worst_ratio = min((v.get("currentSpeed", 0) / v.get("freeFlowSpeed", 1)) for v in valid)
        conf = max((v.get("confidence", 0) or 0) for v in valid)
        provider = valid[0].get("provider")

        current, freeflow = avg_current, avg_free
    else:
        if lat is None or lon is None:
            raise HTTPException(status_code=400, detail="Proporcione bbox o lat y lon")
        lat0, lon0 = lat, lon
        bbox_list = None

        status = await get_traffic_status_for_point(lat0, lon0)
        if status.get("status") == "unavailable":
            raise HTTPException(status_code=status.get("code", 503), detail=status.get("message", "Proveedor no disponible"))
        current = status.get("currentSpeed")
        freeflow = status.get("freeFlowSpeed")
        conf = status.get("confidence")
        provider = status.get("provider")
        if current is None or freeflow is None or freeflow <= 0:
            raise HTTPException(status_code=502, detail="Respuesta del proveedor incompleta")
        worst_ratio = current / freeflow if freeflow > 0 else 1

    has_traffic = current < freeflow * threshold

    # Clasificación sencilla del nivel de congestión según worst_ratio
    ratio = worst_ratio
    if ratio >= 0.9:
        level = "free"
    elif ratio >= 0.7:
        level = "moderate"
    elif ratio >= 0.5:
        level = "heavy"
    else:
        level = "severe"

    return {
        "provider": provider,
        "point": {"lat": lat0, "lon": lon0},
        "currentSpeed": current,
        "freeFlowSpeed": freeflow,
        "confidence": conf,
        "hasTraffic": has_traffic,
        "congestionLevel": level,
        "bbox": bbox_list,
    }
