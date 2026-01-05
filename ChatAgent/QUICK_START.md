# 🚀 Guía Rápida de Inicio - ChatAgent

## Opción 1: Inicio Rápido (Recomendado)

### Windows
```bash
# Desde la carpeta ChatAgent
start.bat
```

### Linux/Mac
```bash
# Desde la carpeta ChatAgent
chmod +x start.sh
./start.sh
```

El script automáticamente:
1. ✅ Crea el entorno virtual (si no existe)
2. ✅ Instala las dependencias
3. ✅ Inicia el servidor

## Opción 2: Instalación Manual

### 1. Crear y activar entorno virtual

**Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Iniciar el servidor

```bash
uvicorn app.main:app --reload --port 8001
```

## Opción 3: Con Docker

### Construcción y ejecución

```bash
# Construir imagen
docker build -t prediruta-chatagent .

# Ejecutar contenedor
docker run -p 8001:8001 prediruta-chatagent
```

### Con Docker Compose

```bash
docker-compose up -d
```

## 🧪 Probar el Servicio

### 1. Verificar que está corriendo

Abre tu navegador en: **http://localhost:8001**

Deberías ver información sobre el servicio.

### 2. Ver documentación interactiva

**Swagger UI:** http://localhost:8001/docs

Aquí puedes probar todos los endpoints directamente desde el navegador.

### 3. Ejecutar script de prueba

En otra terminal (con el servidor corriendo):

```bash
python test_agent.py
```

Este script probará automáticamente todos los endpoints.

### 4. Prueba manual con cURL

```bash
curl -X POST "http://localhost:8001/api/v1/chat" \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"¿Qué vía es más recomendable para ir de Tarqui al Centro?\"}"
```

## 📊 URLs Importantes

| Servicio | URL |
|----------|-----|
| API Base | http://localhost:8001 |
| Chat Endpoint | http://localhost:8001/api/v1/chat |
| Health Check | http://localhost:8001/api/v1/health |
| Documentación Swagger | http://localhost:8001/docs |
| Documentación ReDoc | http://localhost:8001/redoc |

## 🔧 Solución de Problemas

### Error: "Module not found"
```bash
pip install -r requirements.txt
```

### Error: "Port 8001 already in use"
```bash
# Cambiar el puerto en el comando:
uvicorn app.main:app --reload --port 8002
```

### Error: "GEMINI_API_KEY not found"
```bash
# Verificar que el archivo .env existe y contiene:
GEMINI_API_KEY=AIzaSyAJLeiyisKr52m6UJS3nwTxm5G0lZj14wQ
```

### El agente no responde correctamente
1. Verificar la API key de Gemini
2. Verificar conexión a internet
3. Revisar los logs del servidor

## 📝 Siguientes Pasos

1. ✅ Probar el servicio con diferentes preguntas
2. ✅ Revisar la documentación en `/docs`
3. ✅ Integrar con el frontend de PrediRuta
4. ✅ Personalizar el prompt en `app/core/prompt.py`
5. ✅ Agregar más contexto sobre Manta si es necesario

## 💡 Preguntas de Ejemplo

- "¿Qué vía es más recomendable para ir de Tarqui al Centro?"
- "¿A qué hora hay menos tráfico en la Av. Malecón?"
- "¿Cuál es la mejor ruta para ir del Mall del Pacífico al aeropuerto?"
- "Dame alternativas para evitar el tráfico en hora pico"
- "¿Cuáles son las vías principales de Manta?"

---

**¿Todo funcionando?** 🎉 ¡Excelente! Ahora puedes integrar el ChatAgent con el frontend de PrediRuta.

Ver: `FRONTEND_INTEGRATION_EXAMPLE.tsx` para ejemplos de integración.
