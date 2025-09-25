from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predicciones, rutas
from app.config import settings

# Crear instancia de FastAPI
app = FastAPI(
    title="PrediRuta API",
    description="API para predicción de tráfico vehicular con IA",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://prediruta.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(predicciones.router, prefix="/api/v1", tags=["Predicciones"])
app.include_router(rutas.router, prefix="/api/v1", tags=["Rutas"])

# Ruta de prueba
@app.get("/")
async def root():
    return {
        "message": "PrediRuta API funcionando correctamente",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health check
@app.get("/health")
async def health_check():
    return {"status": "OK", "service": "PrediRuta Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)