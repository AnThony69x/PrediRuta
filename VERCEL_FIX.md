# Corrección de Errores de Despliegue en Vercel

## Problemas Corregidos

### 1. ❌ Fuente OpenDyslexic No Disponible
**Error**: La fuente OpenDyslexic no existe en Google Fonts, causando errores de parsing CSS.

**Solución Aplicada**:
- ✅ Eliminada la importación de OpenDyslexic de `layout.jsx`
- ✅ Eliminado el @import de OpenDyslexic de `accessibility.css`
- ✅ Reemplazada por Comic Sans MS (fuente nativa disponible en todos los sistemas)
- ✅ Funcionalidad de accesibilidad mantenida

### 2. ❌ Módulo react-leaflet No Encontrado
**Error**: `Cannot find module 'react-leaflet' or its corresponding type declarations`

**Solución Aplicada**:
- ✅ Agregado `react-leaflet: ^4.2.1` a dependencies
- ✅ Agregado `leaflet: ^1.9.4` a dependencies
- ✅ Agregado `@types/leaflet: ^1.9.8` a devDependencies

## Pasos para Redesplegar

### Opción 1: Desde Tu Repositorio Local

```bash
# 1. Instalar las nuevas dependencias
cd frontend
npm install

# 2. Probar el build localmente
npm run build

# 3. Si el build es exitoso, hacer commit y push
git add .
git commit -m "fix: corregir errores de despliegue en Vercel"
git push origin main
```

### Opción 2: Redesplegar en Vercel

Una vez que hayas hecho push de los cambios:

1. Ve a tu proyecto en Vercel Dashboard
2. El despliegue se iniciará automáticamente
3. O presiona "Redeploy" en el último deployment

### Verificación Local Antes de Desplegar

```bash
cd frontend

# Verificar instalación
npm install

# Verificar build
npm run build

# Si todo está bien, deberías ver:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
```

## Cambios Realizados

### 📝 Archivos Modificados:

1. **frontend/package.json**
   - Agregadas dependencias: `react-leaflet`, `leaflet`
   - Agregadas devDependencies: `@types/leaflet`

2. **frontend/src/app/layout.jsx**
   - Eliminada carga de fuente OpenDyslexic

3. **frontend/src/styles/accessibility.css**
   - Eliminado @import de OpenDyslexic
   - Actualizada clase `.dyslexia-font` para usar Comic Sans MS

## Verificaciones Post-Despliegue

Después del despliegue exitoso, verifica:

- [ ] El sitio carga correctamente
- [ ] Las fuentes se ven bien
- [ ] La funcionalidad de accesibilidad funciona (cambio de fuente para dislexia)
- [ ] Los mapas se renderizan correctamente
- [ ] No hay errores en la consola del navegador

## Notas Adicionales

### Sobre Comic Sans MS
Comic Sans MS es una fuente nativa disponible en:
- ✅ Windows
- ✅ macOS
- ✅ La mayoría de sistemas Linux
- ✅ Dispositivos móviles iOS y Android

Es una alternativa común para usuarios con dislexia porque:
- Las letras tienen formas distintivas
- Espaciado natural entre caracteres
- No tiene serifas (sans-serif)

### Sobre react-leaflet
El componente `traffic-map-inner.tsx` usa react-leaflet para mapas interactivos.
Si no necesitas este componente, considera:
- Eliminarlo completamente
- O usar solo Mapbox GL (como en otros componentes del proyecto)

## Soporte

Si encuentras algún problema después del despliegue:

1. Revisa los logs en Vercel Dashboard
2. Ejecuta `npm run build` localmente para replicar errores
3. Verifica que todas las variables de entorno estén configuradas en Vercel

## Estado

✅ Correcciones aplicadas
⏳ Pendiente: Commit y push al repositorio
⏳ Pendiente: Redespliegue en Vercel
