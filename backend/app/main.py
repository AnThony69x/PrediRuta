from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Routers opcionales existentes
try:
    from app.routes import auth, predictions  # type: ignore
except Exception:
    auth = None
    predictions = None

from app.routes import traffic

# Mapbox APIs
try:
    from app.routes import mapbox
except Exception as e:
    mapbox = None
    print(f"⚠️ Error importando rutas de Mapbox: {e}")

# Dataset de tráfico Ecuador
try:
    from app.routes import dataset
    from app.routes import predictions_real
    from app.routes import routes_history_real
except Exception as e:
    dataset = None
    predictions_real = None
    routes_history_real = None
    print(f"⚠️ Error importando rutas de dataset: {e}")

# Cargar variables de entorno
load_dotenv()

app = FastAPI(
    title="PrediRuta API",
    description="Sistema de predicción de tráfico vehicular con IA",
    version="1.0.0",
)

# Configurar CORS
origins: list[str]
origins_env = os.getenv("CORS_ORIGINS")
frontend_origin = os.getenv("FRONTEND_ORIGIN") or "http://localhost:3000"
if origins_env:
    # Permitir formato JSON o CSV sencillo
    try:
        import json
        parsed = json.loads(origins_env)
        if isinstance(parsed, list):
            origins = [str(x) for x in parsed]
        else:
            raise ValueError()
    except Exception:
        origins = [x.strip() for x in origins_env.split(",") if x.strip()]
        if not origins:
            origins = [frontend_origin]
else:
    # Orígenes permitidos por defecto (incluye null para archivos locales)
    origins = [
        frontend_origin,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "null"  # Para archivos HTML locales (file://)
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes para desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
if auth is not None:
    app.include_router(auth.router, prefix="/auth", tags=["Authentication"])  # type: ignore
if predictions is not None:
    app.include_router(predictions.router, prefix="/api", tags=["Predictions"])  # type: ignore

# Tráfico
app.include_router(traffic.router)

# Mapbox APIs
if mapbox is not None:
    app.include_router(mapbox.router)

# Dataset Ecuador (datos históricos)
if dataset is not None:
    app.include_router(dataset.router)

# Predicciones con datos reales
if predictions_real is not None:
    app.include_router(predictions_real.router)

# Rutas e Historial con datos reales
if routes_history_real is not None:
    app.include_router(routes_history_real.router_routes)
    app.include_router(routes_history_real.router_history)

@app.get("/")
async def root():
    return {"message": "PrediRuta API - Sistema de predicción de tráfico vehicular"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)