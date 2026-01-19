# PrediRuta 2.0 - Documentación de API

## Tabla de Contenidos

1. [Introducción](#introduccion)
2. [Autenticación](#autenticacion)
3. [Endpoints](#endpoints)
4. [Modelos de Datos](#modelos-de-datos)
5. [Códigos de Error](#codigos-de-error)
6. [Ejemplos](#ejemplos)

---

## 1. Introducción

### URL Base

```
Producción: https://api.prediruta.com/v1
Desarrollo: http://localhost:8000/api/v1
```

### Formato de Respuesta

Todas las respuestas están en formato JSON:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

### Versionado

La API usa versionado en la URL. La versión actual es `v1`.

---

## 2. Autenticación

### Bearer Token

Incluye el token de autenticación en el header:

```http
Authorization: Bearer {tu_token_aqui}
```

### Obtener Token

**POST** `/auth/login`

```json
{
  "email": "usuario@ejemplo.com",
  "password": "tu_contraseña"
}
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "usuario@ejemplo.com",
      "name": "Usuario"
    }
  }
}
```

---

## 3. Endpoints

### 3.1. Rutas

#### Calcular Ruta

**POST** `/routes/calculate`

Calcula la ruta óptima entre origen y destino.

**Headers:**
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "origin": {
    "lat": -0.9536,
    "lng": -80.7389
  },
  "destination": {
    "lat": -0.9580,
    "lng": -80.7120
  },
  "preferences": {
    "avoid_tolls": false,
    "avoid_highways": false,
    "optimize_for": "time"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "id": "route_uuid",
        "distance": 4520,
        "duration": 780,
        "polyline": "encoded_polyline",
        "traffic_level": "moderate",
        "eta": "2026-01-19T14:30:00Z",
        "steps": [...]
      }
    ],
    "alternatives": [...]
  }
}
```

#### Historial de Rutas

**GET** `/routes/history`

Obtiene el historial de rutas del usuario.

**Parámetros de consulta:**
- `page` (int): Página (default: 1)
- `limit` (int): Resultados por página (default: 20)
- `from_date` (string): Fecha inicio (ISO 8601)
- `to_date` (string): Fecha fin (ISO 8601)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "routes": [...],
    "pagination": {
      "total": 145,
      "page": 1,
      "pages": 8,
      "per_page": 20
    }
  }
}
```

### 3.2. Tráfico

#### Estado del Tráfico

**GET** `/traffic/current`

Obtiene el estado actual del tráfico en una zona.

**Parámetros:**
```
?lat=-0.9536&lng=-80.7389&radius=5000
```

- `lat` (float): Latitud
- `lng` (float): Longitud
- `radius` (int): Radio en metros (max: 10000)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2026-01-19T12:00:00Z",
    "location": {
      "lat": -0.9536,
      "lng": -80.7389
    },
    "traffic_level": "moderate",
    "congestion_percentage": 45,
    "average_speed": 35,
    "incidents": [
      {
        "type": "accident",
        "severity": "medium",
        "description": "Accidente en Av. Principal",
        "location": {...}
      }
    ]
  }
}
```

#### Predicción de Tráfico

**GET** `/traffic/prediction`

Predice el estado del tráfico para una fecha y hora futura.

**Parámetros:**
```
?lat=-0.9536&lng=-80.7389&datetime=2026-01-20T08:00:00Z
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "prediction": {
      "datetime": "2026-01-20T08:00:00Z",
      "traffic_level": "heavy",
      "confidence": 0.87,
      "congestion_percentage": 72,
      "estimated_speed": 18
    }
  }
}
```

### 3.3. Geocodificación

#### Geocodificar Dirección

**GET** `/geocoding/forward`

Convierte dirección en coordenadas.

**Parámetros:**
```
?address=Av 4 de Noviembre, Manta, Ecuador
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "address": "Av 4 de Noviembre, Manta",
        "coordinates": {
          "lat": -0.9580,
          "lng": -80.7120
        },
        "confidence": 0.95
      }
    ]
  }
}
```

#### Geocodificación Inversa

**GET** `/geocoding/reverse`

Convierte coordenadas en dirección.

**Parámetros:**
```
?lat=-0.9536&lng=-80.7389
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "address": "Av. Principal, Manta, Ecuador",
    "components": {
      "street": "Av. Principal",
      "city": "Manta",
      "state": "Manabí",
      "country": "Ecuador",
      "postal_code": "130201"
    }
  }
}
```

### 3.4. Usuario

#### Obtener Perfil

**GET** `/user/profile`

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Usuario Ejemplo",
    "preferences": {...},
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

#### Actualizar Perfil

**PATCH** `/user/profile`

**Body:**
```json
{
  "name": "Nuevo Nombre",
  "preferences": {
    "language": "es",
    "theme": "dark"
  }
}
```

### 3.5. Chatbot

#### Enviar Mensaje

**POST** `/chat/message`

**Body:**
```json
{
  "message": "¿Cómo está el tráfico?",
  "session_id": "session_uuid"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "response": "El tráfico actual está moderado...",
    "session_id": "session_uuid",
    "suggestions": [
      "Ver rutas alternativas",
      "Consultar predicción"
    ]
  }
}
```

---

## 4. Modelos de Datos

### Route

```typescript
interface Route {
  id: string;
  origin: Coordinates;
  destination: Coordinates;
  distance: number; // metros
  duration: number; // segundos
  traffic_level: TrafficLevel;
  polyline: string;
  steps: Step[];
  created_at: string; // ISO 8601
}
```

### TrafficLevel

```typescript
type TrafficLevel = "free" | "moderate" | "heavy" | "severe";
```

### Coordinates

```typescript
interface Coordinates {
  lat: number; // -90 a 90
  lng: number; // -180 a 180
}
```

---

## 5. Códigos de Error

### Códigos HTTP

- `200` - OK
- `201` - Creado
- `400` - Solicitud incorrecta
- `401` - No autorizado
- `403` - Prohibido
- `404` - No encontrado
- `429` - Demasiadas solicitudes
- `500` - Error del servidor

### Formato de Error

```json
{
  "success": false,
  "error": {
    "code": "INVALID_COORDINATES",
    "message": "Las coordenadas proporcionadas son inválidas",
    "details": {...}
  }
}
```

### Códigos de Error Comunes

- `AUTH_REQUIRED` - Autenticación requerida
- `INVALID_TOKEN` - Token inválido o expirado
- `RATE_LIMIT_EXCEEDED` - Límite de solicitudes excedido
- `INVALID_COORDINATES` - Coordenadas inválidas
- `ROUTE_NOT_FOUND` - Ruta no encontrada
- `SERVICE_UNAVAILABLE` - Servicio temporalmente no disponible

---

## 6. Ejemplos

### Ejemplo Python

```python
import requests

BASE_URL = "https://api.prediruta.com/v1"
TOKEN = "tu_token_aqui"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Calcular ruta
route_data = {
    "origin": {"lat": -0.9536, "lng": -80.7389},
    "destination": {"lat": -0.9580, "lng": -80.7120}
}

response = requests.post(
    f"{BASE_URL}/routes/calculate",
    json=route_data,
    headers=headers
)

if response.status_code == 200:
    result = response.json()
    print(f"Distancia: {result['data']['routes'][0]['distance']}m")
    print(f"Duración: {result['data']['routes'][0]['duration']}s")
```

### Ejemplo JavaScript

```javascript
const BASE_URL = "https://api.prediruta.com/v1";
const TOKEN = "tu_token_aqui";

async function calculateRoute(origin, destination) {
  const response = await fetch(`${BASE_URL}/routes/calculate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      origin,
      destination
    })
  });

  const data = await response.json();
  return data.data.routes[0];
}

// Uso
const route = await calculateRoute(
  { lat: -0.9536, lng: -80.7389 },
  { lat: -0.9580, lng: -80.7120 }
);

console.log(`Distancia: ${route.distance}m`);
```

### Ejemplo cURL

```bash
# Login
curl -X POST https://api.prediruta.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "contraseña"
  }'

# Calcular ruta
curl -X POST https://api.prediruta.com/v1/routes/calculate \
  -H "Authorization: Bearer tu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"lat": -0.9536, "lng": -80.7389},
    "destination": {"lat": -0.9580, "lng": -80.7120}
  }'
```

---

## Límites de Tasa (Rate Limits)

- **Límite por IP**: 100 solicitudes/minuto
- **Límite por usuario autenticado**: 1000 solicitudes/hora
- **Límite de tamaño de payload**: 1 MB

**Headers de respuesta:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642608000
```

---

## Webhooks (Próximamente)

Configuración de webhooks para recibir notificaciones:
- Incidentes de tráfico
- Actualizaciones de rutas
- Alertas personalizadas

---

## Soporte

- **Documentación interactiva**: https://api.prediruta.com/docs
- **Email**: api@prediruta.com
- **GitHub**: github.com/prediruta/api-issues

---

**Versión de API**: v1.0.0  
**Última actualización**: Enero 2026

© 2026 PrediRuta. Todos los derechos reservados.
