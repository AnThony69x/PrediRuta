"""
Wrapper para exponer app desde app.main si existe.
Esto evita duplicar configuración y asegura que `uvicorn main:app` funcione.
"""

try:
    from app.main import app  # type: ignore
except Exception as e:
    # Fallback mínimo si app.main no está disponible
    from fastapi import FastAPI

    app = FastAPI(title="PrediRuta API")

    @app.get("/health")
    async def health_check():
        return {"status": "OK", "service": "PrediRuta Backend (fallback)"}