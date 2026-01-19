@echo off
REM ========================================
REM   Preparar para Redespliegue en Vercel
REM ========================================

echo.
echo ================================================
echo    Limpiando cache y preparando deployment
echo ================================================
echo.

cd /d "%~dp0"

REM Paso 1: Eliminar carpeta .next
echo [1/5] Eliminando cache de Next.js...
if exist ".next" (
    rmdir /s /q ".next"
    echo       OK - Cache eliminado
) else (
    echo       OK - No habia cache
)

REM Paso 2: Eliminar carpeta out
echo [2/5] Eliminando carpeta out...
if exist "out" (
    rmdir /s /q "out"
    echo       OK - Out eliminado
) else (
    echo       OK - No habia out
)

REM Paso 3: Verificar que no hay referencias a OpenDyslexic
echo [3/5] Verificando archivos...
findstr /s /i "OpenDyslexic" "src\*.jsx" "src\*.tsx" "src\*.css" 2>nul
if errorlevel 1 (
    echo       OK - No hay referencias a OpenDyslexic
) else (
    echo       ADVERTENCIA: Se encontraron referencias a OpenDyslexic
    echo       Por favor, revisa los archivos manualmente
    pause
)

REM Paso 4: Crear archivo de version para forzar rebuild
echo [4/5] Creando marca de version...
echo BUILD_TIME=%date% %time% > .buildinfo
echo       OK - Marca creada

REM Paso 5: Instrucciones
echo.
echo [5/5] Preparacion completa
echo.
echo ================================================
echo    SIGUIENTE PASO: Subir cambios a Git
echo ================================================
echo.
echo Ejecuta los siguientes comandos:
echo.
echo   cd ..
echo   git add .
echo   git commit -m "fix: eliminar completamente OpenDyslexic y actualizar docs"
echo   git push origin main
echo.
echo Vercel detectara los cambios y hara un nuevo despliegue.
echo.
echo IMPORTANTE: En Vercel, ve a tu proyecto y:
echo   1. Settings ^> General ^> Build ^& Development Settings
echo   2. Haz clic en "Clear Build Cache"
echo   3. Luego haz "Redeploy" desde Deployments
echo.
pause
