# PrediRuta Frontend 🚦

Interfaz web de PrediRuta construida con Next.js, TailwindCSS y Supabase. Permite visualizar el estado del tráfico, calcular rutas y consumir el backend de IA (FastAPI).

## 📌 Tecnologías

- Node.js 22.18.0
- Next.js (App Router)
- React 18
- TailwindCSS
- Supabase (Auth/DB)
- (Opcional) Leaflet / React-Leaflet para mapas

## 🗂️ Estructura del proyecto

```
frontend/
├── public/                      # Archivos estáticos
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── app/                     # App Router de Next.js 13+
│   │   ├── globals.css          # Estilos globales (Tailwind)
│   │   ├── layout.tsx           # Layout principal
│   │   ├── page.tsx             # Página de inicio
│   │   ├── (auth)/              # Rutas de autenticación
│   │   ├── dashboard/           # Panel principal
│   │   ├── rutas/               # Pantallas de rutas
│   │   └── predicciones/        # Pantallas de predicciones
│   ├── components/              # Componentes reutilizables
│   │   ├── ui/                  # Botones, inputs, modales, etc.
│   │   ├── layout/              # Header, Sidebar, Footer
│   │   └── maps/                # MapContainer, RouteMap (opcional)
│   ├── lib/                     # Utilidades/SDKs
│   │   ├── supabase.ts          # Cliente de Supabase
│   │   └── api.ts               # Cliente del backend (fetch/axios)
│   ├── hooks/                   # Hooks de React
│   ├── types/                   # Tipos de TypeScript
│   └── styles/                  # Estilos adicionales
├── .env.example                 # Variables de entorno (ejemplo)
├── .env.local                   # Variables locales (¡no subir a Git!)
├── .gitignore
├── Dockerfile                   # Imagen Docker (Node 22.18.0)
├── next.config.js               # Configuración Next.js
├── package.json                 # Scripts y dependencias
├── postcss.config.js
├── tailwind.config.js           # Configuración Tailwind
├── tsconfig.json                # Configuración TypeScript
└── README.md                    # Este archivo
```

## 🔑 Variables de entorno

Crea un archivo `.env.local` (para desarrollo local) basado en este ejemplo:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_publica

# Backend API (cliente - visible en el navegador)
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000

# Backend API (server components / rutas API de Next)
# Nota: En docker-compose ya se inyecta BACKEND_API_URL=http://backend:8000
BACKEND_API_URL=http://localhost:8000

# Google Maps (opcional si usas mapas de Google)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_google_maps
```

Si ejecutas con docker-compose, tu servicio frontend ya recibe:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- BACKEND_API_URL=http://backend:8000

Si necesitas consumir el backend desde el cliente (navegador), usa `NEXT_PUBLIC_BACKEND_API_URL`. Para server components o rutas API de Next, puedes usar `process.env.BACKEND_API_URL`.

## 🧩 Instalación (local)

Requisitos:
- Node.js 22.18.0
- npm 10+

Pasos:

```bash
# Instalar dependencias
npm install

# Desarrollo (http://localhost:3000)
npm run dev

# Type-check (TypeScript)
npm run type-check

# Lint
npm run lint

# Build producción
npm run build

# Arrancar producción
npm run start
```

## 🔗 Conexión con el Backend

Ejemplo de cliente simple (`src/lib/api.ts`) para hacer fetch al backend usando variables de entorno:

```ts
// src/lib/api.ts
const publicBase = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";
const serverBase = process.env.BACKEND_API_URL || publicBase;

// Usa publicBase en componentes cliente y serverBase en server components/API routes
export async function getHealth() {
  const res = await fetch(`${publicBase}/health`, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error("Error consultando /health");
  return res.json();
}
```

Uso en una página (ejemplo):

```tsx
// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("Cargando...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/health`)
      .then(r => r.json())
      .then(d => setStatus(d.status ?? "OK"))
      .catch(() => setStatus("Desconectado"));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">PrediRuta Frontend</h1>
      <p className="mt-2">Backend: {status}</p>
    </main>
  );
}
```

## 🧭 Supabase (cliente básico)

```ts
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

## 🎨 TailwindCSS

Asegúrate de tener en `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Y revisa `tailwind.config.js` para incluir rutas a `src/app`, `src/components`, etc.

## 🐳 Docker

Este proyecto incluye un `Dockerfile` basado en Node 22.18.0. Ejemplos:

- Build y run (sin compose):
```bash
docker build -t prediruta-frontend .
docker run -p 3000:3000 --env-file .env.local prediruta-frontend
```

- Con docker-compose (desde la raíz del monorepo):
```bash
docker-compose up --build
```

El `docker-compose.yml` expone:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000 (accesible desde el frontend en contenedor como http://backend:8000)

## 📜 Scripts (package.json)

- `dev`: levantar entorno de desarrollo
- `build`: compilar para producción
- `start`: iniciar servidor de producción
- `lint`: ejecutar ESLint
- `type-check`: verificación de tipos TypeScript

## 🧪 Pruebas (opcional)

Si decides agregar testing:
- React Testing Library + Jest/Vitest

## 🚀 Despliegue

- Vercel (recomendado para Next.js)
- Docker + VPS / Render

Variables en producción:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BACKEND_API_URL`
- (Opcional) `BACKEND_API_URL` para server components

## 🆘 Problemas comunes

- CORS desde backend: permite `http://localhost:3000` y dominio de producción.
- Variables no definidas: verifica `.env.local` y reinicia `npm run dev`.
- En docker-compose, recuerda que el nombre del servicio backend es `backend` (http://backend:8000).

