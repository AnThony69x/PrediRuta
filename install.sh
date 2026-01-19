#!/usr/bin/env bash

# Script de instalación de dependencias para PrediRuta 2.0

set -e  # Salir si hay error

echo "=================================================="
echo "🚀 PrediRuta 2.0 - Instalación de Dependencias"
echo "=================================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función de éxito
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función de error
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Función de advertencia
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función de información
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar Node.js
echo "Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    success "Node.js instalado: $NODE_VERSION"
else
    error "Node.js no está instalado"
    info "Instala Node.js desde https://nodejs.org/ (versión 18 o superior)"
    exit 1
fi

# Verificar Python
echo ""
echo "Verificando Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    success "Python instalado: $PYTHON_VERSION"
else
    error "Python 3 no está instalado"
    info "Instala Python desde https://www.python.org/ (versión 3.10 o superior)"
    exit 1
fi

# Instalar dependencias del backend
echo ""
echo "=================================================="
echo "📦 Instalando dependencias del Backend..."
echo "=================================================="
cd backend

if [ ! -d "venv" ]; then
    info "Creando entorno virtual..."
    python3 -m venv venv
    success "Entorno virtual creado"
fi

info "Activando entorno virtual..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

info "Instalando dependencias Python..."
pip install --upgrade pip
pip install -r requirements.txt
success "Dependencias del backend instaladas"

# Verificar .env
if [ ! -f ".env" ]; then
    warning ".env no encontrado, copiando desde .env.example"
    cp .env.example .env
    info "Edita backend/.env y configura MAPBOX_ACCESS_TOKEN"
fi

cd ..

# Instalar dependencias del frontend
echo ""
echo "=================================================="
echo "📦 Instalando dependencias del Frontend..."
echo "=================================================="
cd frontend

info "Instalando dependencias Node..."
npm install
success "Dependencias del frontend instaladas"

# Verificar .env.local
if [ ! -f ".env.local" ]; then
    warning ".env.local no encontrado, copiando desde .env.example"
    cp .env.example .env.local
    info "Edita frontend/.env.local y configura NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN"
fi

cd ..

# Resumen
echo ""
echo "=================================================="
echo "✅ Instalación Completa"
echo "=================================================="
echo ""
info "Próximos pasos:"
echo ""
echo "1. Obtener token de Mapbox:"
echo "   - Crear cuenta en https://account.mapbox.com/"
echo "   - Ir a 'Access tokens'"
echo "   - Copiar token público (comienza con 'pk.')"
echo ""
echo "2. Configurar Backend:"
echo "   - Editar backend/.env"
echo "   - Agregar: MAPBOX_ACCESS_TOKEN=tu_token_aqui"
echo ""
echo "3. Configurar Frontend:"
echo "   - Editar frontend/.env.local"
echo "   - Agregar: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_token_aqui"
echo ""
echo "4. Iniciar Backend:"
echo "   cd backend"
echo "   source venv/bin/activate  # Windows: venv\\Scripts\\activate"
echo "   uvicorn app.main:app --reload"
echo ""
echo "5. Iniciar Frontend (en otra terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "6. Abrir en navegador:"
echo "   http://localhost:3000"
echo ""
success "¡Todo listo para empezar! 🎉"
