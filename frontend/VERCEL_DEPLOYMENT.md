# Guía de Despliegue en Vercel

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Repositorio Git (GitHub, GitLab, o Bitbucket)
3. Variables de entorno configuradas

## 🚀 Pasos para Desplegar

### 1. Preparar el Repositorio

Asegúrate de que tu código esté en un repositorio Git y todos los cambios estén confirmados:

```bash
git add .
git commit -m "Preparar para despliegue en Vercel"
git push origin main
```

### 2. Importar Proyecto en Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en **"Add New..."** → **"Project"**
3. Importa tu repositorio Git
4. Selecciona el directorio `frontend` como raíz del proyecto

### 3. Configurar el Proyecto

#### Framework Preset
Vercel detectará automáticamente **Next.js**

#### Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

#### Root Directory
- Marca la opción **"Root Directory"** y selecciona `frontend`

### 4. Variables de Entorno

En la sección **Environment Variables**, agrega las siguientes variables:

#### Variables Públicas (expuestas al navegador)

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
NEXT_PUBLIC_BACKEND_API_URL=https://tu-backend-desplegado.com
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps
```

#### Variables Privadas (solo server-side)

```
BACKEND_API_URL=https://tu-backend-desplegado.com
NODE_ENV=production
```

**Nota**: Asegúrate de agregar estas variables para los tres ambientes:
- ✅ Production
- ✅ Preview
- ✅ Development

### 5. Desplegar

Haz clic en **"Deploy"** y espera a que Vercel construya y despliegue tu aplicación.

## 🔄 Despliegues Automáticos

Vercel configurará automáticamente:

- **Production**: Cada push a la rama `main` → despliega a producción
- **Preview**: Cada push a otras ramas o PR → crea un preview deployment

## 📝 Configuración Post-Despliegue

### 1. Actualizar URLs Permitidas en Supabase

1. Ve a tu [Supabase Dashboard](https://supabase.com/dashboard)
2. Proyecto → Settings → Authentication → URL Configuration
3. Agrega tu dominio de Vercel a:
   - **Site URL**: `https://tu-app.vercel.app`
   - **Redirect URLs**: 
     - `https://tu-app.vercel.app/**`
     - `https://*.vercel.app/**` (para previews)

### 2. Configurar CORS en el Backend

Asegúrate de que tu backend permita requests desde tu dominio de Vercel:

```python
# En tu backend FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tu-app.vercel.app",
        "https://*.vercel.app",  # Para previews
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Configurar Dominio Personalizado (Opcional)

1. En Vercel Dashboard → tu proyecto → Settings → Domains
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones de Vercel

## 🔧 Solución de Problemas

### Error de Build

Si el build falla, verifica:

```bash
# Prueba el build localmente
npm run build

# Verifica las dependencias
npm install
```

### Variables de Entorno No Funcionan

- Las variables que comienzan con `NEXT_PUBLIC_` se exponen al navegador
- Las variables sin ese prefijo solo están disponibles en el servidor
- Reinicia el deployment después de cambiar variables de entorno

### Problemas con el Backend

- Verifica que `NEXT_PUBLIC_BACKEND_API_URL` apunte al backend desplegado
- Asegúrate de que el backend tenga CORS configurado correctamente
- Usa HTTPS para el backend en producción

## 📊 Monitoreo

### Analytics

Vercel proporciona analytics automáticos:
- Dashboard → tu proyecto → Analytics

### Logs

Ver logs de runtime:
- Dashboard → tu proyecto → Deployments → [selecciona deployment] → Runtime Logs

## 🔄 Actualizar Deployment

### Desde Git

```bash
git add .
git commit -m "Actualización"
git push origin main
```

Vercel desplegará automáticamente.

### Redeploy Manual

1. Ve a Vercel Dashboard → tu proyecto → Deployments
2. Selecciona un deployment anterior
3. Haz clic en el menú (...) → "Redeploy"

## 🌐 URLs del Proyecto

Después del despliegue tendrás:

- **Production**: `https://tu-proyecto.vercel.app`
- **Preview Deployments**: `https://tu-proyecto-git-[branch].vercel.app`
- **Deployment URLs**: URLs únicas para cada deployment

## 💡 Mejores Prácticas

1. **Nunca commitees archivos `.env.local`** - usa variables de entorno de Vercel
2. **Usa Preview Deployments** para probar cambios antes de producción
3. **Configura dominios personalizados** para producción
4. **Habilita Branch Protection** en GitHub para revisiones de código
5. **Monitorea los Analytics** regularmente
6. **Configura notificaciones** en Integrations → Notifications

## 🔗 Enlaces Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Variables de Entorno](https://vercel.com/docs/environment-variables)
- [Dominios Personalizados](https://vercel.com/docs/custom-domains)

## 📞 Soporte

Si encuentras problemas:
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Next.js Discussions](https://github.com/vercel/next.js/discussions)
- [Documentación de PrediRuta](../README.md)
