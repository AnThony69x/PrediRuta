"""
Punto de entrada principal de la aplicación FastAPI del agente de chat.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import chat
import logging

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Crear aplicación FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Agente de chat experto en movilidad urbana de Manta, Ecuador. Powered by Google Gemini.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(chat.router)


@app.on_event("startup")
async def startup_event():
    """
    Evento que se ejecuta al iniciar la aplicación.
    """
    logger.info(f"Iniciando {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Servidor escuchando en {settings.HOST}:{settings.PORT}")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Evento que se ejecuta al detener la aplicación.
    """
    logger.info(f"Deteniendo {settings.APP_NAME}")


@app.get("/", tags=["root"])
async def root():
    """
    Endpoint raíz de la aplicación.
    
    Returns:
        Información básica sobre el servicio
    """
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "description": "Agente de chat para consultas de movilidad urbana en Manta, Ecuador",
        "endpoints": {
            "chat": "/api/v1/chat",
            "health": "/api/v1/health",
            "docs": "/docs"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
