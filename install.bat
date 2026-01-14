@echo off
REM Script de instalación de dependencias para PrediRuta 2.0 (Windows)

echo ==================================================
echo 🚀 PrediRuta 2.0 - Instalación de Dependencias
echo ==================================================
echo.

REM Verificar Node.js
echo Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado
    echo ℹ️  Instala Node.js desde https://nodejs.org/ ^(versión 18 o superior^)
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js instalado: %NODE_VERSION%

REM Verificar Python
echo.
echo Verificando Python...
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python no está instalado
    echo ℹ️  Instala Python desde https://www.python.org/ ^(versión 3.10 o superior^)
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✅ Python instalado: %PYTHON_VERSION%

REM Instalar dependencias del backend
echo.
echo ==================================================
echo 📦 Instalando dependencias del Backend...
echo ==================================================
cd backend

if not exist "venv" (
    echo ℹ️  Creando entorno virtual...
    python -m venv venv
    echo ✅ Entorno virtual creado
)

echo ℹ️  Activando entorno virtual...
call venv\Scripts\activate.bat

echo ℹ️  Instalando dependencias Python...
python -m pip install --upgrade pip
pip install -r requirements.txt
echo ✅ Dependencias del backend instaladas

REM Verificar .env
if not exist ".env" (
    echo ⚠️  .env no encontrado, copiando desde .env.example
    copy .env.example .env
    echo ℹ️  Edita backend\.env y configura MAPBOX_ACCESS_TOKEN
)

cd ..

REM Instalar dependencias del frontend
echo.
echo ==================================================
echo 📦 Instalando dependencias del Frontend...
echo ==================================================
cd frontend

echo ℹ️  Instalando dependencias Node...
call npm install
echo ✅ Dependencias del frontend instaladas

REM Verificar .env.local
if not exist ".env.local" (
    echo ⚠️  .env.local no encontrado, copiando desde .env.example
    copy .env.example .env.local
    echo ℹ️  Edita frontend\.env.local y configura NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
)

cd ..

REM Resumen
echo.
echo ==================================================
echo ✅ Instalación Completa
echo ==================================================
echo.
echo ℹ️  Próximos pasos:
echo.
echo 1. Obtener token de Mapbox:
echo    - Crear cuenta en https://account.mapbox.com/
echo    - Ir a 'Access tokens'
echo    - Copiar token público ^(comienza con 'pk.''^)
echo.
echo 2. Configurar Backend:
echo    - Editar backend\.env
echo    - Agregar: MAPBOX_ACCESS_TOKEN=tu_token_aqui
echo.
echo 3. Configurar Frontend:
echo    - Editar frontend\.env.local
echo    - Agregar: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_token_aqui
echo.
echo 4. Iniciar Backend:
echo    cd backend
echo    venv\Scripts\activate
echo    uvicorn app.main:app --reload
echo.
echo 5. Iniciar Frontend ^(en otra terminal^):
echo    cd frontend
echo    npm run dev
echo.
echo 6. Abrir en navegador:
echo    http://localhost:3000
echo.
echo ✅ ¡Todo listo para empezar! 🎉

pause
