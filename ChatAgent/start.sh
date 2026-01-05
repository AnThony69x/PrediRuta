#!/bin/bash

echo "========================================"
echo "  ChatAgent - PrediRuta"
echo "  Iniciando servidor..."
echo "========================================"
echo ""

# Activar entorno virtual si existe
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "Entorno virtual activado"
else
    echo "ADVERTENCIA: No se encontró entorno virtual"
    echo "Creando entorno virtual..."
    python3 -m venv venv
    source venv/bin/activate
    echo "Instalando dependencias..."
    pip install -r requirements.txt
fi

echo ""
echo "Iniciando servidor en http://localhost:8001"
echo "Documentación en http://localhost:8001/docs"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

uvicorn app.main:app --reload --port 8001
