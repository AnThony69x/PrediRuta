# Guía de Inicio Rápido - PrediRuta 2.0 con Mapbox

## 🚀 Instalación Rápida

### 1. Clonar e Instalar

```bash
# Clonar repositorio
git clone https://github.com/AnThony69x/PrediRuta.git
cd PrediRuta

# Ejecutar script de instalación (Linux/Mac)
chmod +x install.sh
./install.sh

# O en Windows
install.bat
```

### 2. Obtener Token de Mapbox (GRATIS)

1. Ir a https://account.mapbox.com/
2. Crear cuenta gratuita (con GitHub/Google)
3. Ir a **Access tokens** en el dashboard
4. Copiar el **Default public token** (comienza con `pk.`)

### 3. Configurar Backend

```bash
cd backend

# Editar archivo .env
# Agregar tu token:
MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoixxx...

# Validar configuración
python validate_mapbox.py
```

### 4. Configurar Frontend

```bash
cd frontend

# Editar archivo .env.local
# Agregar tu token:
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoixxx...
```

### 5. Iniciar Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. ¡Listo! 🎉

Abrir en navegador: http://localhost:3000

## 📍 Primeros Pasos

### Ver Mapa con Tráfico
1. Ir a Dashboard (http://localhost:3000/dashboard)
2. Seleccionar ciudad de Ecuador
3. Ver tráfico en tiempo real

### Calcular Ruta
1. Usar el selector de ciudades
2. Ver ruta automática en el mapa
3. Información de distancia y tiempo

### Buscar Lugares
1. Usar barra de búsqueda (próximamente)
2. Ver resultados en mapa
3. Obtener coordenadas

## 🛠️ Problemas Comunes

### Token no configurado
```
❌ Error: MAPBOX: Token no configurado
```
**Solución:** Configurar `MAPBOX_ACCESS_TOKEN` en `.env` (backend) y `.env.local` (frontend)

### Puerto ocupado
```
❌ Error: Port 8000 already in use
```
**Solución:** Cambiar puerto o detener proceso existente

### Dependencias faltantes
```
❌ Error: Module not found
```
**Solución:** Ejecutar `install.sh` o instalar manualmente:
```bash
cd backend && pip install -r requirements.txt
cd frontend && npm install
```

## 📚 Más Información

- [README Completo](./README_MAPBOX.md)
- [Documentación de Migración](./MAPBOX_MIGRATION.md)
- [Arquitectura Móvil](./docs/MOBILE_ARCHITECTURE.md)

## 💡 Tips

### Desarrollo Eficiente
- Usar `--reload` en backend para auto-restart
- Usar `npm run dev` en frontend para hot-reload
- Ver logs en ambas terminales

### Testing de APIs
- Swagger UI: http://localhost:8000/docs
- Probar endpoints directamente
- Ver ejemplos de uso

### Optimización
- Cache automático activado (30s para tráfico)
- Límite gratuito: 50K map loads/mes
- Monitorear uso en dashboard de Mapbox

## 🆘 Soporte

- **Issues:** https://github.com/AnThony69x/PrediRuta/issues
- **Documentación Mapbox:** https://docs.mapbox.com/
- **Stack Overflow:** Tag [mapbox]

---

**¿Funciona todo?** ¡Genial! Ahora puedes explorar el [README completo](./README_MAPBOX.md) para funciones avanzadas 🚀
