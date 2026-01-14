@echo off
REM ========================================
REM   PrediRuta - Iniciar Backend
REM ========================================

echo.
echo ================================================
echo    PrediRuta Backend - Iniciando servidor...
echo ================================================
echo.

REM Cambiar al directorio del backend
cd /d "%~dp0"

REM Verificar si existe el entorno virtual
if not exist "venv\Scripts\activate.bat" (
    echo [ERROR] No se encontro el entorno virtual.
    echo.
    echo Por favor, crea el entorno virtual primero:
    echo    python -m venv venv
    echo    venv\Scripts\activate
    echo    pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

REM Activar el entorno virtual
echo [1/3] Activando entorno virtual...
call venv\Scripts\activate.bat

REM Verificar si existe el archivo .env
if not exist ".env" (
    echo.
    echo [ADVERTENCIA] No se encontro el archivo .env
    echo Se usara la configuracion por defecto.
    echo.
    echo Para configurar el backend:
    echo    1. Copia .env.example a .env
    echo    2. Edita .env con tus credenciales
    echo.
    timeout /t 3 >nul
)

REM Verificar si FastAPI esta instalado
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] FastAPI no esta instalado.
    echo Instalando dependencias...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo.
        echo [ERROR] Fallo la instalacion de dependencias.
        pause
        exit /b 1
    )
)

REM Mostrar informacion
echo.
echo [2/3] Verificando configuracion...
echo    - Directorio: %CD%
echo    - Python: venv\Scripts\python.exe
echo    - Archivo principal: main.py
echo.

REM Iniciar el servidor FastAPI con uvicorn
echo [3/3] Iniciando servidor FastAPI...
echo.
echo ================================================
echo    Servidor corriendo en:
echo    http://localhost:8000
echo    
echo    Documentacion API:
echo    http://localhost:8000/docs
echo    
echo    Presiona Ctrl+C para detener el servidor
echo ================================================
echo.

uvicorn main:app --host 0.0.0.0 --port 8000 --reload

REM Si uvicorn falla, mostrar error
if errorlevel 1 (
    echo.
    echo [ERROR] Fallo al iniciar el servidor.
    echo Verifica que todas las dependencias esten instaladas.
    pause
    exit /b 1
)
