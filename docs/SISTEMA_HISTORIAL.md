# 📚 Sistema de Historial de Rutas - PrediRuta 2.0

## 📋 Descripción

Sistema completo para almacenar y gestionar el historial de rutas consultadas por los usuarios. Incluye persistencia local (localStorage) y en la nube (Supabase), con sincronización automática.

## 🎯 Características

### ✨ Funcionalidades Principales

- **Guardado automático**: Cada ruta consultada se guarda automáticamente en el historial
- **Almacenamiento dual**: Los datos se guardan tanto en localStorage (offline) como en Supabase (online)
- **Sincronización inteligente**: Combina datos locales y remotos sin duplicados
- **Filtros avanzados**: Filtra por fecha (hoy, semana, mes) y por ciudad
- **Estadísticas**: Visualiza métricas agregadas (km totales, tiempo ahorrado, etc.)
- **Exportación CSV**: Descarga tu historial completo en formato CSV
- **Gestión individual**: Elimina rutas específicas o todo el historial
- **Asociado al usuario**: Cada usuario ve solo su propio historial

### 📁 Archivos Creados

```
frontend/src/
├── lib/
│   └── history-service.ts          # Servicio principal de historial
├── hooks/
│   └── useHistory.ts               # Hook React para gestión de historial
└── app/
    ├── historial/page.tsx          # Página actualizada con datos reales
    └── rutas/page.tsx              # Integración de guardado automático

database/
└── historial_schema.sql            # Script SQL para crear tablas en Supabase
```

## 🚀 Instalación y Configuración

### 1. Crear las tablas en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor** en el menú lateral
3. Crea una nueva query
4. Copia y pega todo el contenido de `database/historial_schema.sql`
5. Ejecuta el script
6. Verifica en **Table Editor** que se crearon las tablas:
   - `historial_rutas`
   - `historial_predicciones`

### 2. Verificar las políticas RLS

Las políticas de Row Level Security (RLS) están incluidas en el script SQL. Asegúrate de que:

- ✅ RLS está habilitado en ambas tablas
- ✅ Los usuarios solo pueden ver, insertar y eliminar sus propios registros
- ✅ Las políticas están activas

### 3. Uso en el Frontend

El sistema ya está integrado y funcionando. No requiere configuración adicional.

## 📖 Uso

### Guardado Automático

Cada vez que un usuario consulta una ruta en `/rutas`, la información se guarda automáticamente:

```typescript
// Se ejecuta automáticamente después de calcular rutas
await guardarRutaEnHistorial({
  origen: "Mi ubicación",
  destino: "Aeropuerto",
  distancia: 15.5,        // km
  duracion: 25,           // minutos
  tiempoAhorrado: 8,      // minutos
  trafico: 'fluido',      // 'fluido' | 'moderado' | 'congestionado'
  coordenadasOrigen: { lat: -2.0, lng: -79.0 },
  coordenadasDestino: { lat: -2.1, lng: -79.1 }
});
```

### Visualización del Historial

Los usuarios pueden ver su historial en `/historial` con tres vistas:

1. **📍 Rutas**: Lista detallada de todas las rutas consultadas
2. **📊 Predicciones**: Historial de predicciones de tráfico (futuro)
3. **📈 Estadísticas**: Métricas agregadas y análisis

### Filtros Disponibles

- **Por fecha**: Todas, Hoy, Esta semana, Este mes
- **Por ciudad**: Buscar por origen o destino

### Acciones Disponibles

- **Exportar**: Descarga el historial en formato CSV
- **Eliminar todo**: Limpia todo el historial (confirmación requerida)
- **Eliminar individual**: Elimina una ruta específica

## 🔧 API del Servicio

### `history-service.ts`

```typescript
// Guardar una ruta
await guardarRutaEnHistorial(ruta);

// Obtener historial de rutas con filtros
const rutas = await obtenerHistorialRutas({ 
  fecha: 'semana', 
  ciudad: 'Quito' 
});

// Obtener estadísticas
const stats = await obtenerEstadisticas();

// Eliminar una ruta específica
await eliminarRuta(rutaId);

// Eliminar todo el historial
await eliminarTodoElHistorial();

// Exportar a CSV
await exportarHistorialCSV();
```

### Hook `useHistory`

```typescript
function MiComponente() {
  const {
    // Estados
    rutas,
    predicciones,
    estadisticas,
    loading,
    error,
    
    // Acciones
    cargarRutas,
    agregarRuta,
    eliminarRutaPorId,
    limpiarHistorial,
    exportarCSV,
    actualizarFiltros,
    recargar,
    
    // Utilidades
    totalRutas,
    tieneHistorial
  } = useHistory({ autoLoad: true });

  // Tu código aquí
}
```

## 🗃️ Estructura de Datos

### Interfaz RutaHistorial

```typescript
interface RutaHistorial {
  id: string;
  fecha: string;                    // ISO 8601
  origen: string;
  destino: string;
  distancia: number;                // km
  duracion: number;                 // minutos
  tiempoAhorrado: number;           // minutos
  trafico: 'fluido' | 'moderado' | 'congestionado';
  userId?: string;                  // UUID del usuario
  coordenadasOrigen?: { lat: number; lng: number };
  coordenadasDestino?: { lat: number; lng: number };
}
```

### Tablas en Supabase

**historial_rutas**
```sql
- id (TEXT, PK)
- user_id (UUID, FK -> auth.users)
- fecha (TIMESTAMP)
- origen (TEXT)
- destino (TEXT)
- distancia (DECIMAL)
- duracion (INTEGER)
- tiempo_ahorrado (INTEGER)
- trafico (TEXT)
- coordenadas_origen (JSONB)
- coordenadas_destino (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔒 Seguridad

- **RLS activado**: Row Level Security protege los datos
- **Autenticación requerida**: Solo usuarios autenticados pueden acceder
- **Aislamiento de datos**: Cada usuario solo ve su propio historial
- **Validaciones**: Checks en la base de datos para integridad

## 📊 Rendimiento

### Optimizaciones Implementadas

- ✅ Índices en columnas frecuentemente consultadas
- ✅ Límite de 100 registros en localStorage
- ✅ Carga lazy y paginación preparada
- ✅ Sincronización inteligente sin duplicados
- ✅ Triggers para actualización automática de timestamps

### Límites Recomendados

- **localStorage**: Máximo 100 rutas recientes
- **Supabase**: Sin límite (considera limpiar historial antiguo)
- **Sugerencia**: Ejecutar `limpiar_historial_antiguo(90)` trimestralmente

## 🐛 Solución de Problemas

### El historial no se guarda

1. Verifica que el usuario esté autenticado
2. Revisa la consola del navegador para errores
3. Confirma que las tablas existen en Supabase
4. Verifica las políticas RLS

### No se muestran los datos

1. Abre las DevTools y revisa la pestaña Application > Local Storage
2. Verifica la conexión con Supabase
3. Confirma que el `user_id` coincide con el usuario autenticado
4. Revisa los filtros aplicados

### Error de permisos en Supabase

1. Ve a **Authentication > Policies** en Supabase
2. Verifica que las políticas estén activas
3. Confirma que RLS está habilitado
4. Intenta reejecutar el script SQL de políticas

## 🔄 Sincronización

### Flujo de Datos

```
Usuario consulta ruta
       ↓
Guardado en localStorage (inmediato)
       ↓
Guardado en Supabase (si autenticado)
       ↓
Al cargar: Combina ambas fuentes
       ↓
Muestra en interfaz
```

### Resolución de Conflictos

- Los registros se identifican por ID único
- No se permiten duplicados (deduplicación por ID)
- localStorage tiene prioridad para datos recientes
- Supabase es la fuente de verdad a largo plazo

## 📈 Métricas y Análisis

El sistema calcula automáticamente:

- 📍 Total de rutas consultadas
- 🛣️ Kilómetros totales recorridos
- ⏱️ Tiempo total ahorrado
- 🎯 Precisión promedio de predicciones
- 🔥 Rutas más frecuentes

## 🚀 Próximas Mejoras

- [ ] Paginación infinita
- [ ] Búsqueda por texto completo
- [ ] Filtros avanzados (por distancia, duración)
- [ ] Gráficos de tendencias
- [ ] Comparación de rutas
- [ ] Compartir rutas con otros usuarios
- [ ] Favoritos y etiquetas personalizadas

## 📞 Soporte

Si encuentras problemas:

1. Revisa la consola del navegador
2. Verifica la configuración de Supabase
3. Consulta los logs del servidor
4. Abre un issue en el repositorio

---

## ✅ Checklist de Implementación

- [x] Crear servicio de historial (`history-service.ts`)
- [x] Crear hook personalizado (`useHistory.ts`)
- [x] Actualizar página de historial (`historial/page.tsx`)
- [x] Integrar guardado automático (`rutas/page.tsx`)
- [x] Crear schema de base de datos (`historial_schema.sql`)
- [x] Documentar el sistema (este README)

## 🎉 ¡Todo listo!

El sistema de historial está completamente funcional. Los usuarios ahora pueden:

1. ✅ Consultar rutas y que se guarden automáticamente
2. ✅ Ver su historial completo en `/historial`
3. ✅ Filtrar por fecha y ciudad
4. ✅ Ver estadísticas agregadas
5. ✅ Exportar a CSV
6. ✅ Eliminar rutas individuales o todo el historial
7. ✅ Sincronización automática con Supabase

---

**Desarrollado para PrediRuta 2.0** 🚦🗺️
