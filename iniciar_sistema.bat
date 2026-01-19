@echo off
REM ========================================
REM   PrediRuta - Iniciar Sistema Completo
REM ========================================

echo.
echo ================================================
echo    PrediRuta - Iniciando Sistema Completo
echo ================================================
echo.

REM Cambiar al directorio raiz del proyecto
cd /d "%~dp0"

REM Verificar si existen los directorios necesarios
if not exist "backend" (
    echo [ERROR] No se encontro el directorio backend
    pause
    exit /b 1
)

if not exist "frontend" (
    echo [ERROR] No se encontro el directorio frontend
    pause
    exit /b 1
)

if not exist "ChatAgent" (
    echo [ERROR] No se encontro el directorio ChatAgent
    pause
    exit /b 1
)

echo.
echo ================================================
echo    OPCION DE INICIO
echo ================================================
echo.
echo Selecciona como deseas iniciar el sistema:
echo.
echo 1. Docker Compose (Recomendado - Frontend + Backend)
echo 2. Manual (Ventanas separadas - Backend + Frontend + ChatAgent)
echo 3. Solo Backend
echo 4. Solo Frontend
echo 5. Solo ChatAgent
echo 6. Backend + ChatAgent
echo 7. Frontend + ChatAgent
echo 8. Salir
echo.
set /p opcion="Selecciona una opcion (1-8): "

if "%opcion%"=="1" goto docker_compose
if "%opcion%"=="2" goto manual_completo
if "%opcion%"=="3" goto solo_backend
if "%opcion%"=="4" goto solo_frontend
if "%opcion%"=="5" goto solo_chatagent
if "%opcion%"=="6" goto backend_chatagent
if "%opcion%"=="7" goto frontend_chatagent
if "%opcion%"=="8" goto salir

echo.
echo [ERROR] Opcion no valida
pause
exit /b 1

:docker_compose
echo.
echo ================================================
echo    Iniciando con Docker Compose
echo ================================================
echo.
echo NOTA: Esto iniciara Frontend y Backend
echo Para el ChatAgent, ejecuta manualmente: ChatAgent\start.bat
echo.
echo Presiona cualquier tecla para continuar o Ctrl+C para cancelar...
pause >nul
docker-compose up --build
goto fin

:manual_completo
echo.
echo ================================================
echo    Iniciando Sistema Manual Completo
echo ================================================
echo.
echo Se abriran 3 ventanas:
echo   1. Backend (Puerto 8000)
echo   2. Frontend (Puerto 3000)
echo   3. ChatAgent (Puerto 8001)
echo.
timeout /t 2 >nul

REM Iniciar Backend
echo [1/3] Iniciando Backend...
start "PrediRuta - Backend" cmd /k "cd /d %~dp0backend && iniciar_backend.bat"
timeout /t 3 >nul

REM Iniciar Frontend
echo [2/3] Iniciando Frontend...
start "PrediRuta - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 >nul

REM Iniciar ChatAgent
echo [3/3] Iniciando ChatAgent...
start "PrediRuta - ChatAgent" cmd /k "cd /d %~dp0ChatAgent && start.bat"
timeout /t 2 >nul

echo.
echo ================================================
echo    Sistema Iniciado Correctamente
echo ================================================
echo.
echo URLs del sistema:
echo   - Frontend:  http://localhost:3000
echo   - Backend:   http://localhost:8000
echo   - Backend API Docs: http://localhost:8000/docs
echo   - ChatAgent: http://localhost:8001
echo   - ChatAgent API Docs: http://localhost:8001/docs
echo.
echo Para detener el sistema, cierra cada ventana.
echo.
pause
goto fin

:solo_backend
echo.
echo ================================================
echo    Iniciando Solo Backend
echo ================================================
echo.
cd backend
call iniciar_backend.bat
goto fin

:solo_frontend
echo.
echo ================================================
echo    Iniciando Solo Frontend
echo ================================================
echo.
cd frontend

REM Verificar si existen node_modules
if not exist "node_modules" (
    echo [ADVERTENCIA] No se encontraron las dependencias de Node.js
    echo Instalando dependencias...
    call npm install
)

echo.
echo Iniciando servidor en http://localhost:3000
echo.
call npm run dev
goto fin

:solo_chatagent
echo.
echo ================================================
echo    Iniciando Solo ChatAgent
echo ================================================
echo.
cd ChatAgent
call start.bat
goto fin

:backend_chatagent
echo.
echo ================================================
echo    Iniciando Backend + ChatAgent
echo ================================================
echo.
echo Se abriran 2 ventanas:
echo   1. Backend (Puerto 8000)
echo   2. ChatAgent (Puerto 8001)
echo.
timeout /t 2 >nul

echo [1/2] Iniciando Backend...
start "PrediRuta - Backend" cmd /k "cd /d %~dp0backend && iniciar_backend.bat"
timeout /t 3 >nul

echo [2/2] Iniciando ChatAgent...
start "PrediRuta - ChatAgent" cmd /k "cd /d %~dp0ChatAgent && start.bat"
timeout /t 2 >nul

echo.
echo ================================================
echo    Servicios Iniciados
echo ================================================
echo.
echo URLs:
echo   - Backend:   http://localhost:8000
echo   - Backend API Docs: http://localhost:8000/docs
echo   - ChatAgent: http://localhost:8001
echo   - ChatAgent API Docs: http://localhost:8001/docs
echo.
pause
goto fin

:frontend_chatagent
echo.
echo ================================================
echo    Iniciando Frontend + ChatAgent
echo ================================================
echo.
echo Se abriran 2 ventanas:
echo   1. Frontend (Puerto 3000)
echo   2. ChatAgent (Puerto 8001)
echo.
timeout /t 2 >nul

echo [1/2] Iniciando Frontend...
start "PrediRuta - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 >nul

echo [2/2] Iniciando ChatAgent...
start "PrediRuta - ChatAgent" cmd /k "cd /d %~dp0ChatAgent && start.bat"
timeout /t 2 >nul

echo.
echo ================================================
echo    Servicios Iniciados
echo ================================================
echo.
echo URLs:
echo   - Frontend:  http://localhost:3000
echo   - ChatAgent: http://localhost:8001
echo   - ChatAgent API Docs: http://localhost:8001/docs
echo.
pause
goto fin

:salir
echo.
echo Saliendo...
exit /b 0

:fin
echo.
echo ================================================
echo    Proceso finalizado
echo ================================================
echo.
