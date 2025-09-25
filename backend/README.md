# PrediRuta Backend 🚦🤖

Backend API REST con FastAPI para el sistema de predicción de tráfico vehicular PrediRuta.

## 📋 Descripción

Este backend proporciona:
- **API REST** para consultas de tráfico y predicciones
- **Modelos de IA** para análisis de patrones de tráfico
- **Integración con Supabase** para almacenamiento de datos
- **Procesamiento en tiempo real** de datos de tráfico
- **Endpoints** para el frontend y aplicaciones móviles

## 🏗️ Estructura del Proyecto

```
backend/
│
├── app/                           # Aplicación principal
│   ├── __init__.py               # Hace que sea un paquete Python
│   ├── main.py                   # Punto de entrada FastAPI
│   ├── config.py                 # Configuración y variables de entorno
│   ├── database.py               # Conexión a Supabase/PostgreSQL
│   │
│   ├── api/                      # Rutas de la API
│   │   ├── __init__.py
│   │   ├── routes/               # Endpoints organizados
│   │   │   ├── __init__.py
│   │   │   ├── trafico.py       # Rutas de tráfico
│   │   │   ├── prediccion.py    # Rutas de predicción IA
│   │   │   └── rutas.py         # Rutas de navegación
│   │   └── dependencies.py      # Dependencias compartidas
│   │
│   ├── models/                   # Modelos de datos (Pydantic)
│   │   ├── __init__.py
│   │   ├── trafico.py           # Modelos de tráfico
│   │   ├── prediccion.py        # Modelos de predicción
│   │   └── usuario.py           # Modelos de usuario
│   │
│   ├── services/                 # Lógica de negocio
│   │   ├── __init__.py
│   │   ├── trafico_service.py   # Servicio de tráfico
│   │   ├── ia_service.py        # Servicio de IA/ML
│   │   └── maps_service.py      # Servicio de Google Maps
│   │
│   └── utils/                    # Utilidades
│       ├── __init__.py
│       ├── helpers.py           # Funciones auxiliares
│       └── constants.py         # Constantes del sistema
│
├── tests/                        # Pruebas unitarias
│   ├── __init__.py
│   └── test_api.py
│
├── data/                         # Datos para ML
│   ├── historico/               # Datos históricos
│   └── modelos/                 # Modelos entrenados
│
├── requirements.txt              # Dependencias Python
├── Dockerfile                    # Imagen Docker
├── .env.example                  # Ejemplo de variables de entorno
├── .gitignore                    # Archivos a ignorar
├── README.md                     # Documentación
└── main.py                       # Punto de entrada
```

## ⚙️ Tecnologías Utilizadas

- **Python 3.13.7** - Lenguaje principal
- **FastAPI** - Framework web asíncrono
- **Uvicorn** - Servidor ASGI
- **Supabase** - Base de datos PostgreSQL
- **scikit-learn** - Machine Learning
- **Pandas & NumPy** - Procesamiento de datos
- **Pydantic** - Validación de datos
- **Docker** - Contenedorización

## 🚀 Instalación y Configuración

### Requisitos Previos
- Python 3.13.7+
- pip (gestor de paquetes)
- Git

### Instalación Local

1. **Clonar y navegar al directorio**
```bash
git clone https://github.com/AnThony69x/PrediRuta.git
cd PrediRuta/backend
```

2. **Crear entorno virtual**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

4. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env con tus credenciales
```

5. **Ejecutar el servidor**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Instalación con Docker

```bash
# Construir imagen
docker build -t prediruta-backend .

# Ejecutar contenedor
docker run -p 8000:8000 --env-file .env prediruta-backend
```

## 📊 Endpoints Principales

### Salud del Sistema
- `GET /health` - Estado del backend
- `GET /info` - Información de la aplicación

### Predicciones de Tráfico
- `POST /api/v1/predicciones/ruta` - Predecir tráfico en ruta específica
- `GET /api/v1/predicciones/zona/{zona_id}` - Predicción por zona
- `POST /api/v1/predicciones/tiempo-real` - Análisis en tiempo real

### Datos de Tráfico
- `GET /api/v1/trafico/historico` - Datos históricos
- `POST /api/v1/trafico/actualizar` - Actualizar datos de tráfico
- `GET /api/v1/trafico/zonas` - Listar zonas monitoreadas

## 🧪 Pruebas

```bash
# Ejecutar todas las pruebas
pytest

# Ejecutar con coverage
pytest --cov=app tests/

# Ejecutar pruebas específicas
pytest tests/test_main.py -v
```

## 📝 Variables de Entorno

Crear archivo `.env` con las siguientes variables:

```env
# Configuración de la aplicación
APP_NAME=PrediRuta Backend
DEBUG=True
HOST=0.0.0.0
PORT=8000

# Supabase
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_key

# Google Maps API
GOOGLE_MAPS_API_KEY=tu_api_key

# JWT
JWT_SECRET_KEY=tu_jwt_secret_super_segura
```

## 🐳 Docker

```bash
# Construcción
docker build -t prediruta-backend .

# Ejecución
docker run -d \
  --name prediruta-backend \
  -p 8000:8000 \
  --env-file .env \
  prediruta-backend

# Ver logs
docker logs prediruta-backend