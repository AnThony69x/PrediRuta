# 🤖 ChatAgent - PrediRuta

Agente de chat inteligente para consultas de movilidad urbana en Manta, Ecuador. Powered by Google Gemini.

## 📋 Descripción

ChatAgent es un microservicio que utiliza la API de Google Gemini para responder preguntas sobre movilidad urbana en la ciudad de Manta. El agente está entrenado con contexto específico sobre:

- Avenidas y vías principales de Manta
- Patrones de tráfico típicos
- Zonas comerciales y residenciales
- Horarios pico y de menor congestión
- Rutas alternativas y recomendaciones

## 🚀 Características

- **API REST** con FastAPI
- **Integración con Google Gemini** para respuestas inteligentes
- **Contexto específico** de la ciudad de Manta
- **Documentación automática** con Swagger UI
- **Docker support** para fácil despliegue
- **CORS habilitado** para integración con frontend

## 📁 Estructura del Proyecto

```
ChatAgent/
├── app/
│   ├── main.py                 # Punto de entrada FastAPI
│   ├── api/
│   │   └── routes/
│   │       └── chat.py         # Endpoints del agente
│   ├── core/
│   │   ├── config.py           # Configuración
│   │   ├── gemini_client.py    # Cliente Gemini
│   │   └── prompt.py           # Prompt del agente
│   ├── services/
│   │   └── agent_service.py    # Lógica del agente
│   └── schemas/
│       ├── chat_request.py     # Request schema
│       └── chat_response.py    # Response schema
├── .env                        # Variables de entorno
├── requirements.txt            # Dependencias
├── Dockerfile                  # Docker config
└── README.md                   # Este archivo
```

## 🔧 Instalación

### Requisitos Previos

- Python 3.11+
- API Key de Google Gemini

### Instalación Local

1. **Clonar el repositorio** (si no lo has hecho):
```bash
cd ChatAgent
```

2. **Crear entorno virtual**:
```bash
python -m venv venv
```

3. **Activar entorno virtual**:

Windows:
```bash
.\venv\Scripts\activate
```

Linux/Mac:
```bash
source venv/bin/activate
```

4. **Instalar dependencias**:
```bash
pip install -r requirements.txt
```

5. **Configurar variables de entorno**:

El archivo `.env` ya está configurado con tu API key:
```env
GEMINI_API_KEY=AIzaSyA*****************************
```

## 🏃‍♂️ Ejecución

### Modo Desarrollo

```bash
uvicorn app.main:app --reload --port 8001
```

### Modo Producción

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### Con Docker

1. **Construir la imagen**:
```bash
docker build -t prediruta-chatagent .
```

2. **Ejecutar el contenedor**:
```bash
docker run -p 8001:8001 prediruta-chatagent
```

## 🧪 Probar el Servicio

### Opción 1: Test HTML Interactivo (Recomendado)

Abre el archivo `test_api.html` en tu navegador:

```bash
# Windows
start test_api.html

# Linux/Mac
open test_api.html
```

Este test incluye:
- ✅ Verificación de health check
- ✅ Consulta de información del servicio
- ✅ Test de consulta al agente
- ✅ Demo interactivo para hacer preguntas personalizadas

### Opción 2: Test con Node.js

```bash
node test_connection.js
```

Este script ejecuta automáticamente:
- Health check
- Verificación de endpoints
- Múltiples consultas de prueba
- Validación de manejo de errores

### Opción 3: Test con Python

```bash
python test_agent.py
```

### Opción 4: Test Manual con cURL

Ver ejemplos en la sección "Ejemplos de Uso" más abajo.

## 📡 API Endpoints

### 1. Chat con el Agente

**POST** `/api/v1/chat`

Envía una pregunta al agente y recibe una respuesta.

**Request:**
```json
{
  "question": "¿Qué vía es más recomendable para ir de Tarqui al Centro?"
}
```

**Response:**
```json
{
  "answer": "Para ir de Tarqui al Centro, te recomiendo tomar la Av. 4 de Noviembre..."
}
```

### 2. Health Check

**GET** `/api/v1/health`

Verifica que el servicio está funcionando.

**Response:**
```json
{
  "status": "healthy",
  "service": "PrediRuta Chat Agent",
  "message": "El agente de chat está funcionando correctamente"
}
```

### 3. Información del Servicio

**GET** `/`

Obtiene información básica del servicio.

## 📚 Documentación Interactiva

Una vez que el servicio esté corriendo, puedes acceder a:

- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

## 🧪 Ejemplos de Uso

### Con cURL

```bash
curl -X POST "http://localhost:8001/api/v1/chat" \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"¿A qué hora hay menos tráfico en la Av. Malecón?\"}"
```

### Con Python (requests)

```python
import requests

url = "http://localhost:8001/api/v1/chat"
data = {
    "question": "¿Qué vía es mejor para ir del Mall del Pacífico al centro?"
}

response = requests.post(url, json=data)
print(response.json())
```

### Con JavaScript (fetch)

```javascript
fetch('http://localhost:8001/api/v1/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: '¿Cuál es la mejor ruta para evitar el tráfico en hora pico?'
  })
})
.then(response => response.json())
.then(data => console.log(data.answer));
```

## 🔐 Seguridad

- La API key de Gemini se carga desde variables de entorno
- **IMPORTANTE**: En producción, asegúrate de:
  - No commitear el archivo `.env` al repositorio
  - Configurar CORS solo para orígenes permitidos
  - Usar HTTPS
  - Implementar rate limiting

## 🛠️ Tecnologías Utilizadas

- **FastAPI** - Framework web moderno y rápido
- **Uvicorn** - Servidor ASGI de alto rendimiento
- **Google Gemini** - Modelo de IA para respuestas inteligentes
- **Pydantic** - Validación de datos
- **Python-dotenv** - Gestión de variables de entorno
- **Docker** - Containerización

## 📝 Notas de Desarrollo

### Personalizar el Contexto

Para modificar el contexto del agente, edita el archivo `app/core/prompt.py`. Puedes agregar más información sobre Manta, actualizar patrones de tráfico, etc.

### Agregar Nuevos Endpoints

1. Crea una nueva función en `app/api/routes/chat.py`
2. Define los schemas necesarios en `app/schemas/`
3. Implementa la lógica en `app/services/`

### Logs

El servicio incluye logging configurado. Los logs se mostrarán en la consola con el siguiente formato:
```
2026-01-05 10:30:45 - app.api.routes.chat - INFO - Nueva consulta recibida
```

## 🤝 Integración con PrediRuta

Este microservicio está diseñado para integrarse con el sistema PrediRuta. Puedes consumirlo desde:

- Frontend Next.js
- Aplicación móvil
- Otros microservicios
- APIs externas

## 📄 Licencia

Este proyecto es parte de PrediRuta - Sistema de Predicción de Rutas para Manta, Ecuador.

## 👥 Autor

Desarrollado para el proyecto PrediRuta - Universidad [Tu Universidad]

---

**¿Necesitas ayuda?** Consulta la documentación interactiva en `/docs` cuando el servicio esté corriendo.
