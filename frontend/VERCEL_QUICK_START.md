# 🚀 Inicio Rápido - Despliegue en Vercel

## ⚡ Despliegue en 5 minutos

### 1️⃣ Clic en el Botón (Método Más Rápido)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TU_USUARIO/TU_REPO&project-name=prediruta&repository-name=prediruta&root-directory=frontend&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_BACKEND_API_URL,NEXT_PUBLIC_APP_URL)

### 2️⃣ O Importa Manualmente

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio
3. **Root Directory**: selecciona `frontend`
4. Configura las variables de entorno (ver abajo)
5. Haz clic en **Deploy**

## 🔑 Variables de Entorno Requeridas

Copia y pega estas variables en Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
NEXT_PUBLIC_BACKEND_API_URL=https://tu-backend.com
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
```

### Opcionales:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key
BACKEND_API_URL=https://tu-backend.com
NODE_ENV=production
```

## ✅ Pre-Despliegue

Antes de desplegar, ejecuta:

```bash
# Verificar configuración
npm run vercel-check

# Probar build local
npm run build
```

## 📖 Documentación Completa

Para instrucciones detalladas, consulta [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 🔧 Configuración Post-Despliegue

### En Supabase

1. Settings → Authentication → URL Configuration
2. Agrega tu URL de Vercel a **Redirect URLs**

### En tu Backend

Agrega la URL de Vercel a CORS:

```python
allow_origins=[
    "https://tu-app.vercel.app",
    "https://*.vercel.app",
]
```

## 🎯 Siguiente Despliegue

```bash
git add .
git commit -m "Actualización"
git push origin main
```

¡Vercel desplegará automáticamente!

## 💡 Tips

- ✅ Usa ramas para preview deployments
- ✅ Configura un dominio personalizado
- ✅ Habilita Analytics en Vercel
- ✅ Revisa los logs si algo falla

## 🆘 ¿Problemas?

- [Documentación Completa](./VERCEL_DEPLOYMENT.md)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
