# 🚀 Guía de Despliegue en Vercel

## 📋 Pre-requisitos

✅ Backend desplegado en Railway: `prediruta-backend-production.up.railway.app`  
✅ ChatAgent desplegado en Railway: `prediruta-chatagent-production.up.railway.app`  
⚠️ Cuenta de Mapbox con token API  
⚠️ Cuenta de Supabase configurada  

## 🔧 Paso 1: Preparar Variables de Entorno

Necesitas los siguientes datos antes de desplegar:

### Mapbox (REQUERIDO)
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`: Token público de https://account.mapbox.com/

### Supabase (REQUERIDO)
- `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave anónima pública

## 🌐 Paso 2: Desplegar en Vercel

### Opción A: Desde GitHub (Recomendado)

1. **Sube el código a GitHub:**
   ```bash
   git add .
   git commit -m "chore: prepare for Vercel deployment"
   git push origin main
   ```

2. **Importa en Vercel:**
   - Ve a https://vercel.com/new
   - Selecciona tu repositorio
   - Framework Preset: **Next.js** (autodetectado)
   - Root Directory: `frontend`
   - Click en **Deploy**

### Opción B: Desde CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

## ⚙️ Paso 3: Configurar Variables de Entorno en Vercel

⚠️ **IMPORTANTE: Las claves API NUNCA se suben a GitHub. Solo se configuran en Vercel.**

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Añade las siguientes variables (para **Production, Preview y Development**):

### Variables del Sistema (URLs Públicas)
```
NEXT_PUBLIC_BACKEND_API_URL=https://prediruta-backend-production.up.railway.app
BACKEND_API_URL=https://prediruta-backend-production.up.railway.app
NEXT_PUBLIC_CHATAGENT_URL=https://prediruta-chatagent-production.up.railway.app
NODE_ENV=production
```

### Variables Privadas (⚠️ OBTEN TUS PROPIAS CLAVES)

#### Mapbox (REQUERIDO)
1. Ve a https://account.mapbox.com/access-tokens/
2. Crea un token público con restricciones de URL
3. Añade en Vercel:
```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=[TU_TOKEN_AQUI]
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
```

#### Supabase (REQUERIDO)
1. Ve a tu proyecto en https://supabase.com/dashboard
2. Settings → API
3. Copia "Project URL" y "anon public" key
4. Añade en Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=[TU_URL_AQUI]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[TU_KEY_AQUI]
```

## 🔄 Paso 4: Re-desplegar

Después de configurar las variables, haz un nuevo despliegue:
- **Automático**: Vercel redesplega al hacer push
- **Manual**: Deployments → Click en los ⋯ → Redeploy

## ✅ Paso 5: Verificar

1. Abre tu URL de Vercel (ejemplo: `https://predi-ruta.vercel.app`)
2. Verifica que el mapa cargue correctamente
3. Prueba la funcionalidad de rutas
4. Prueba el asistente de chat

## 🐛 Solución de Problemas

### Error: "Mapbox token is required"
→ Verifica que `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` esté configurado en Vercel

### Error: "Failed to fetch routes"
→ Verifica que el backend de Railway esté funcionando:
  https://prediruta-backend-production.up.railway.app/docs

### Error: "ChatAgent no responde"
→ Verifica que el ChatAgent de Railway esté funcionando:
  https://prediruta-chatagent-production.up.railway.app/docs

### Error de CORS
→ Verifica que las URLs en `vercel.json` coincidan con las de Railway

## 📝 Comandos Útiles

```bash
# Ver logs en tiempo real
vercel logs <deployment-url> --follow

# Ver información del proyecto
vercel inspect <deployment-url>

# Eliminar un despliegue
vercel remove <deployment-url>
```

## 🔗 URLs del Sistema

- **Frontend**: https://tu-app.vercel.app
- **Backend**: https://prediruta-backend-production.up.railway.app
- **ChatAgent**: https://prediruta-chatagent-production.up.railway.app

---

**¿Necesitas ayuda?** Revisa la documentación en `frontend/VERCEL_DEPLOYMENT.md`
