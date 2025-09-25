"""
PrediRuta Backend - Sistema de Predicción de Tráfico Vehicular
Punto de entrada principal de la aplicación FastAPI
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import uvicorn

from app.api.api import api_router
from app.core.config import settings

# Crear instancia de FastAPI
app = FastAPI(
    title="PrediRuta API",
    description="Sistema web de predicción del tráfico vehicular con Inteligencia Artificial",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS para permitir conexiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://prediruta.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas de la API
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    """Redireccionar a la documentación de la API"""
    return RedirectResponse(url="/docs")

@app.get("/health")
async def health_check():
    """Endpoint para verificar el estado del servidor"""
    return {
        "status": "OK",
        "message": "PrediRuta Backend está funcionando correctamente",
        "version": "1.0.0"
    }

# Solo para desarrollo local (no usar en producción)
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )