# ========================================
#   PrediRuta - Iniciar Backend
# ========================================

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   PrediRuta Backend - Iniciando servidor..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Cambiar al directorio del backend
Set-Location $PSScriptRoot

# Verificar si existe el entorno virtual
if (-not (Test-Path "venv\Scripts\Activate.ps1")) {
    Write-Host "[ERROR] No se encontro el entorno virtual." -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, crea el entorno virtual primero:" -ForegroundColor Yellow
    Write-Host "   python -m venv venv" -ForegroundColor Yellow
    Write-Host "   venv\Scripts\Activate.ps1" -ForegroundColor Yellow
    Write-Host "   pip install -r requirements.txt" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Activar el entorno virtual
Write-Host "[1/3] Activando entorno virtual..." -ForegroundColor Green
& "venv\Scripts\Activate.ps1"

# Verificar si existe el archivo .env
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "[ADVERTENCIA] No se encontro el archivo .env" -ForegroundColor Yellow
    Write-Host "Se usara la configuracion por defecto." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para configurar el backend:" -ForegroundColor Cyan
    Write-Host "   1. Copia .env.example a .env" -ForegroundColor Cyan
    Write-Host "   2. Edita .env con tus credenciales" -ForegroundColor Cyan
    Write-Host ""
    Start-Sleep -Seconds 3
}

# Verificar si FastAPI esta instalado
try {
    & python -c "import fastapi" 2>$null
} catch {
    Write-Host ""
    Write-Host "[ERROR] FastAPI no esta instalado." -ForegroundColor Red
    Write-Host "Instalando dependencias..." -ForegroundColor Yellow
    pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "[ERROR] Fallo la instalacion de dependencias." -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

# Mostrar informacion
Write-Host ""
Write-Host "[2/3] Verificando configuracion..." -ForegroundColor Green
Write-Host "   - Directorio: $PWD" -ForegroundColor Gray
Write-Host "   - Python: venv\Scripts\python.exe" -ForegroundColor Gray
Write-Host "   - Archivo principal: main.py" -ForegroundColor Gray
Write-Host ""

# Iniciar el servidor FastAPI con uvicorn
Write-Host "[3/3] Iniciando servidor FastAPI..." -ForegroundColor Green
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Servidor corriendo en:" -ForegroundColor Green
Write-Host "   http://localhost:8000" -ForegroundColor Yellow
Write-Host "   " -ForegroundColor Green
Write-Host "   Documentacion API:" -ForegroundColor Green
Write-Host "   http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "   " -ForegroundColor Green
Write-Host "   Presiona Ctrl+C para detener el servidor" -ForegroundColor Magenta
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Si uvicorn falla, mostrar error
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Fallo al iniciar el servidor." -ForegroundColor Red
    Write-Host "Verifica que todas las dependencias esten instaladas." -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}
