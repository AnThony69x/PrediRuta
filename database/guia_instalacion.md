# 📊 Scripts de Base de Datos - PrediRuta

Este directorio contiene todos los scripts necesarios para configurar y gestionar la base de datos de PrediRuta en Supabase PostgreSQL.

## 📁 Archivos Incluidos

### 🗃️ `init_db.sql`
**Script principal de inicialización de la base de datos**

- ✅ Crea todas las tablas necesarias del sistema
- ✅ Configura índices para optimización de consultas
- ✅ Establece políticas de seguridad (RLS - Row Level Security)
- ✅ Crea triggers y funciones auxiliares
- ✅ Define vistas para consultas comunes
- ✅ Incluye comentarios de documentación

**Tablas creadas:**
- `user_profiles` - Perfiles de usuario extendidos
- `road_segments` - Segmentos de carretera con datos geográficos
- `traffic_data` - Datos históricos y en tiempo real de tráfico
- `traffic_predictions` - Predicciones generadas por IA
- `favorite_routes` - Rutas favoritas de usuarios
- `route_queries` - Log de consultas de rutas
- `route_options` - Opciones de ruta para cada consulta
- `ml_models` - Metadatos de modelos de machine learning
- `system_logs` - Logs del sistema
- `api_usage` - Métricas de uso de la API

### 🐍 `db_manager.py`
**Script de gestión automatizada de la base de datos**

Herramienta CLI para administrar la base de datos con las siguientes funciones:

```bash
# Comandos disponibles
python db_manager.py init      # Inicializar base de datos
python db_manager.py seed      # Insertar datos de ejemplo
python db_manager.py check     # Verificar estado de la DB
python db_manager.py backup    # Crear backup de datos
python db_manager.py reset     # Reiniciar DB (¡CUIDADO!)
```

**Características:**
- ✅ Interfaz colorida con progress bars (Rich library)
- ✅ Validación de conexión a Supabase
- ✅ Verificación del estado de las tablas
- ✅ Backup automático de datos importantes
- ✅ Inserción de datos de ejemplo
- ✅ Manejo de errores robusto

### 📍 `sample_data_ecuador.sql`
**Datos de ejemplo específicos para Ecuador**

Script con datos realistas basados en las principales ciudades y carreteras ecuatorianas:

- 🏙️ **Ciudades incluidas:** Quito, Guayaquil, Cuenca, Manta, Ambato
- 🛣️ **Carreteras:** Panamericana, autopistas urbanas, avenidas principales
- 📈 **Datos de tráfico:** Patrones históricos de 7 días con horas pico
- 🤖 **Predicciones:** Datos simulados para próximas 48 horas
- 📊 **Consultas populares:** Rutas frecuentes entre puntos de interés

**Patrones de tráfico simulados:**
- **Horas pico:** 07:00-09:00 y 17:00-19:00 (días laborales)
- **Fin de semana:** Tráfico más fluido
- **Tipos de vía:** Diferente comportamiento según highway/arterial/collector
- **Condiciones climáticas:** Factores meteorológicos aleatorios

## 🚀 Guía de Uso

### 1. Configuración Inicial

**Antes de ejecutar los scripts, asegúrate de tener configuradas las variables de entorno:**

```bash
# En tu archivo .env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu_supabase_service_key  # Usar SERVICE_KEY para operaciones admin
```

### 2. Instalación de Dependencias

```bash
# Para el script Python
pip install supabase python-dotenv asyncpg pandas rich

# O instalar desde requirements.txt del backend
cd ../
pip install -r requirements.txt
```

### 3. Inicialización de la Base de Datos

#### Opción A: Usando el script Python (Recomendado)

```bash
# 1. Inicializar la base de datos
python database/db_manager.py init

# 2. Verificar que todo esté correcto
python database/db_manager.py check

# 3. Insertar datos de ejemplo
python database/db_manager.py seed
```

#### Opción B: Usando SQL directamente

```bash
# En el dashboard de Supabase, ir a SQL Editor y ejecutar:
# 1. init_db.sql (completo)
# 2. sample_data_ecuador.sql (opcional, para datos de ejemplo)
```

### 4. Verificación del Estado

```bash
# Verificar que todas las tablas existen y tienen datos
python database/db_manager.py check
```

El comando mostrará una tabla como esta:

```
┌─────────────────────┬────────┬───────────┐
│ Tabla               │ Existe │ Registros │
├─────────────────────┼────────┼───────────┤
│ user_profiles       │ ✅     │ 0         │
│ road_segments       │ ✅     │ 23        │
│ traffic_data        │ ✅     │ 3864      │
│ traffic_predictions │ ✅     │ 200       │
│ favorite_routes     │ ✅     │ 0         │
│ route_queries       │ ✅     │ 5         │
│ route_options       │ ✅     │ 5         │
│ ml_models           │ ✅     │ 1         │
│ system_logs         │ ✅     │ 5         │
│ api_usage           │ ✅     │ 0         │
└─────────────────────┴────────┴───────────┘
```

## 📋 Consultas de Ejemplo

### Consultar tráfico actual por ciudad

```sql
SELECT * FROM public.traffic_by_city_view;
```

### Ver predicciones futuras

```sql
SELECT 
    rs.name as carretera,
    rs.city,
    tp.target_time,
    tp.predicted_speed,
    tp.predicted_traffic_level,
    tp.confidence_score
FROM public.traffic_predictions tp
JOIN public.road_segments rs ON tp.road_segment_id = rs.id
WHERE tp.target_time > NOW()
ORDER BY tp.target_time;
```

### Rutas más consultadas

```sql
SELECT * FROM public.popular_routes_view;
```

### Segmentos con más congestión

```sql
SELECT 
    rs.name,
    rs.city,
    AVG(td.traffic_level) as avg_traffic_level,
    AVG(td.congestion_factor) as avg_congestion
FROM public.traffic_data td
JOIN public.road_segments rs ON td.road_segment_id = rs.id
WHERE td.timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY rs.id, rs.name, rs.city
HAVING AVG(td.traffic_level) >= 4
ORDER BY avg_traffic_level DESC;
```

## 🔧 Resolución de Problemas

### Error: "Variables de entorno no encontradas"
```bash
# Verificar que el archivo .env existe y tiene las variables correctas
cat backend/.env

# Las variables necesarias son:
# SUPABASE_URL=https://...
# SUPABASE_KEY=eyJ... (usar SERVICE_KEY para operaciones admin)
```

### Error: "No se puede conectar a Supabase"
```bash
# Verificar conectividad
curl -H "apikey: TU_SUPABASE_KEY" "TU_SUPABASE_URL/rest/v1/"
```

### Error: "Permisos insuficientes"
- Asegúrate de usar el `SUPABASE_SERVICE_KEY` (no el anon key)
- En el dashboard de Supabase, verifica que RLS esté configurado correctamente

### Reiniciar la base de datos
```bash
# CUIDADO: Esto eliminará todos los datos
python database/db_manager.py reset

# Alternativamente, eliminar tablas manualmente en Supabase Dashboard
```

## 📊 Estructura de Datos

### Datos Geográficos
- **Sistema de coordenadas:** WGS84 (SRID 4326)
- **Tipos geométricos:** POINT para ubicaciones, LINESTRING para rutas
- **Extensión PostGIS:** Habilitada para consultas geoespaciales

### Políticas de Seguridad (RLS)
- **user_profiles:** Solo acceso a datos propios
- **favorite_routes:** Solo rutas del usuario autenticado
- **route_queries:** Solo consultas propias (o anónimas)
- **Otras tablas:** Acceso público para lectura

### Índices Optimizados
- **Geoespaciales:** Índices GIST para geometrías
- **Temporales:** Índices en timestamps
- **Compuestos:** Combinaciones frecuentes (segment_id + timestamp)

## 📈 Monitoreo y Mantenimiento

### Backup Automático
```bash
# Crear backup de datos importantes
python database/db_manager.py backup
```

### Limpieza de Datos Antiguos
```sql
-- Eliminar datos de tráfico antiguos (más de 30 días)
DELETE FROM public.traffic_data 
WHERE timestamp < NOW() - INTERVAL '30 days';

-- Eliminar logs antiguos (más de 7 días)  
DELETE FROM public.system_logs
WHERE timestamp < NOW() - INTERVAL '7 days';
```

### Actualización de Estadísticas
```sql
-- Actualizar estadísticas de PostgreSQL para mejor rendimiento
ANALYZE public.traffic_data;
ANALYZE public.road_segments;
```

## 🤝 Contribuciones

Para agregar nuevos datos o modificar la estructura:

1. **Modificar esquema:** Editar `init_db.sql`
2. **Agregar datos:** Editar `sample_data_ecuador.sql`  
3. **Actualizar scripts:** Modificar `db_manager.py` según sea necesario
4. **Documentar cambios:** Actualizar este README

## 📝 Notas Importantes

- ⚠️ **Usar SERVICE_KEY:** Para operaciones administrativas
- 🔒 **RLS Habilitado:** Algunas tablas tienen seguridad a nivel de fila
- 🌍 **Datos Geográficos:** Coordenadas en WGS84 (latitud, longitud)
- 📊 **Datos Simulados:** Los datos de ejemplo son para desarrollo, no reales
- 🔄 **Actualizaciones:** Ejecutar migraciones antes de nuevas versiones

---

**PrediRuta Team** | Sistema de Predicción de Tráfico Vehicular con IA  
Universidad Laica Eloy Alfaro de Manabí - Ingeniería en Software