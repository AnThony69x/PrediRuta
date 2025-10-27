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
    origins = [frontend_origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

@app.get("/")
async def root():
    return {"message": "PrediRuta API - Sistema de predicción de tráfico vehicular"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)