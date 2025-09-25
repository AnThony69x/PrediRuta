from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, predictions
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

app = FastAPI(
    title="PrediRuta API",
    description="Sistema de predicción de tráfico vehicular con IA",
    version="1.0.0",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(predictions.router, prefix="/api", tags=["Predictions"])

@app.get("/")
async def root():
    return {"message": "PrediRuta API - Sistema de predicción de tráfico vehicular"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)