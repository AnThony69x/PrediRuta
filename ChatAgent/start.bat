@echo off
echo ========================================
echo   ChatAgent - PrediRuta
echo   Iniciando servidor...
echo ========================================
echo.

REM Activar entorno virtual si existe
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate
    echo Entorno virtual activado
) else (
    echo ADVERTENCIA: No se encontro entorno virtual
    echo Creando entorno virtual...
    python -m venv venv
    call venv\Scripts\activate
    echo Instalando dependencias...
    pip install -r requirements.txt
)

echo.
echo Iniciando servidor en http://localhost:8001
echo Documentacion en http://localhost:8001/docs
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

uvicorn app.main:app --reload --port 8001
