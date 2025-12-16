# 🇪🇨 Coordenadas de Ecuador para PrediRuta

## ✅ TomTom Traffic API - Cobertura en Ecuador

**CONFIRMADO:** TomTom Traffic API funciona perfectamente en Ecuador, incluyendo todas las ciudades principales.

### 📍 Coordenadas principales de Ecuador

#### Ciudades principales:

| Ciudad | Latitud | Longitud | Zoom recomendado |
|--------|---------|----------|------------------|
| **Manta** | -0.95 | -80.72 | 13 |
| Quito | -0.22 | -78.51 | 12 |
| Guayaquil | -2.19 | -79.88 | 12 |
| Cuenca | -2.90 | -79.00 | 13 |
| Ambato | -1.24 | -78.62 | 13 |
| Machala | -3.26 | -79.96 | 13 |
| Santo Domingo | -0.25 | -79.17 | 13 |
| Portoviejo | -1.05 | -80.45 | 13 |
| Loja | -3.99 | -79.20 | 13 |
| Esmeraldas | 0.97 | -79.65 | 13 |

#### Coordenadas específicas de Manta (por defecto):

```javascript
// Frontend (Next.js)
const MANTA_CENTER = [-0.95, -80.72]; // [lat, lon] formato Leaflet

// Backend (Python)
MANTA_LAT = -0.95
MANTA_LON = -80.72
```

### 🛣️ Principales vías en Manta

```javascript
// Avenida principal Manta
const AV_MANTA = {
  start: [-0.9397, -80.7234],
  end: [-0.9668, -80.7089]
};

// Vía Manta - Montecristi
const VIA_MONTECRISTI = {
  start: [-0.9500, -80.7200],
  end: [-1.0500, -80.6500]
};

// Vía a la playa (Murciélago)
const VIA_MURCIELAGO = {
  start: [-0.9450, -80.7300],
  end: [-0.9350, -80.7400]
};
```

### 🚦 Tipos de datos disponibles con TomTom en Ecuador

✅ **Lo que SÍ funciona:**
- Velocidad actual (currentSpeed)
- Velocidad de flujo libre (freeFlowSpeed)
- Nivel de congestión (calculado por ratio)
- Confianza del dato (confidence)
- Funciona en carreteras principales
- Funciona en avenidas urbanas

⚠️ **Limitaciones:**
- Cobertura variable en calles secundarias
- Menor densidad de datos vs. Europa/USA
- Actualizaciones cada 1-2 minutos (no tiempo real puro)

### 📊 API Endpoint de TomTom

```bash
# Consulta para Manta, Ecuador
curl "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=-0.95,-80.72&unit=KMPH&key=TU_API_KEY"
```

**Respuesta esperada:**
```json
{
  "flowSegmentData": {
    "frc": "FRC3",
    "currentSpeed": 45,
    "freeFlowSpeed": 65,
    "currentTravelTime": 234,
    "freeFlowTravelTime": 175,
    "confidence": 0.87,
    "roadClosure": false
  }
}
```

### 🗺️ Formato de coordenadas

**TomTom API:** `lat,lon` (punto decimal)
```
-0.95,-80.72
```

**Leaflet (React):** `[lat, lon]` (array)
```javascript
[-0.95, -80.72]
```

**Supabase PostGIS:** `ST_Point(lon, lat)` (⚠️ orden invertido)
```sql
ST_SetSRID(ST_Point(-80.72, -0.95), 4326)
```

### 🔧 Configuración actual del sistema

**Frontend (.env.local):**
```env
NEXT_PUBLIC_MAP_BASE_URL=https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png
NEXT_PUBLIC_TOMTOM_MAP_KEY=UXWFqfD5OZdfV2FC3VMDbkAOMq7l0nvK
```

**Backend (.env):**
```env
TRAFFIC_PROVIDER=tomtom
TRAFFIC_API_KEY=TU_API_KEY_AQUI
```

**Componente de mapa:**
```typescript
// src/components/map/traffic-map-inner.tsx
export function TrafficMapInner({
  center = [-0.95, -80.72], // Manta, Ecuador por defecto
  zoom = 13,
  ...
})
```

**Componente de tráfico cercano:**
```typescript
// src/components/traffic-nearby.tsx
const mantaCoords = { lat: -0.95, lon: -80.72 }; // Fallback a Manta
```

### 📱 Ejemplo de uso en producción

```typescript
// Consultar tráfico en tiempo real para Manta
const response = await fetch(
  `${BACKEND_URL}/api/v1/traffic/status?lat=-0.95&lon=-80.72`
);

const data = await response.json();
console.log(data);
// {
//   "provider": "tomtom",
//   "point": {"lat": -0.95, "lon": -80.72},
//   "currentSpeed": 42.5,
//   "freeFlowSpeed": 60.0,
//   "confidence": 0.85,
//   "hasTraffic": true,
//   "congestionLevel": "moderate"
// }
```

### 🎯 Recomendaciones

1. **Usar Manta como ubicación por defecto** - Mejor cobertura que zonas rurales
2. **Cachear resultados** - Backend tiene TTL de 30 segundos por defecto
3. **Manejar errores gracefully** - No todos los puntos tienen cobertura
4. **Zoom apropiado** - Nivel 13 es ideal para ciudades medianas como Manta
5. **Actualizar cada 60 segundos** - Balance entre frescura y consumo de API

### 🔗 Referencias

- TomTom Traffic API Docs: https://developer.tomtom.com/traffic-api/documentation
- Leaflet Docs: https://leafletjs.com/
- PostGIS Geography: https://postgis.net/docs/geography.html
