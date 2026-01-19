@echo off
REM ========================================
REM   Limpiar Cache y Reconstruir Frontend
REM ========================================

echo.
echo ================================================
echo    Limpiando cache de Next.js y npm
echo ================================================
echo.

cd /d "%~dp0frontend"

REM Eliminar carpeta .next
if exist ".next" (
    echo [1/5] Eliminando carpeta .next...
    rmdir /s /q ".next"
    echo       OK - Carpeta .next eliminada
) else (
    echo [1/5] No hay carpeta .next para eliminar
)

REM Eliminar carpeta out
if exist "out" (
    echo [2/5] Eliminando carpeta out...
    rmdir /s /q "out"
    echo       OK - Carpeta out eliminada
) else (
    echo [2/5] No hay carpeta out para eliminar
)

REM Eliminar carpeta node_modules
if exist "node_modules" (
    echo [3/5] Eliminando node_modules...
    rmdir /s /q "node_modules"
    echo       OK - node_modules eliminados
) else (
    echo [3/5] No hay node_modules para eliminar
)

REM Eliminar package-lock.json
if exist "package-lock.json" (
    echo [4/5] Eliminando package-lock.json...
    del /f /q "package-lock.json"
    echo       OK - package-lock.json eliminado
) else (
    echo [4/5] No hay package-lock.json para eliminar
)

echo.
echo ================================================
echo    Instalando dependencias limpias
echo ================================================
echo.

echo [5/5] Ejecutando npm install...
call npm install

if errorlevel 1 (
    echo.
    echo [ERROR] Fallo la instalacion de dependencias
    pause
    exit /b 1
)

echo.
echo ================================================
echo    Probando build local
echo ================================================
echo.

call npm run build

if errorlevel 1 (
    echo.
    echo [ERROR] Fallo el build
    echo.
    echo Revisa los errores arriba y corrigelos antes de desplegar.
    pause
    exit /b 1
)

echo.
echo ================================================
echo    Limpieza y Build Exitosos!
echo ================================================
echo.
echo Ahora puedes:
echo   1. Hacer commit de los cambios:
echo      git add .
echo      git commit -m "fix: corregir errores de build"
echo      git push origin main
echo.
echo   2. O redesplegar en Vercel manualmente
echo.
pause
