# 🐛 REPORTE DE BUGS - PrediRuta 2.0

**Fecha:** 2024-01-XX  
**Sistema:** PrediRuta - Predicción y Optimización de Rutas  
**Stack:** Next.js 14, React 18, TypeScript, TailwindCSS, Supabase  
**Auditor:** GitHub Copilot AI  

---

## 📊 RESUMEN DE BUGS

| Categoría | Críticos | Altos | Medios | Bajos | Total |
|-----------|----------|-------|--------|-------|-------|
| Navegación | 2 | 2 | 1 | 0 | 5 |
| Diseño | 0 | 1 | 2 | 1 | 4 |
| Funcionalidad | 1 | 0 | 2 | 0 | 3 |
| Accesibilidad | 0 | 1 | 0 | 1 | 2 |
| Rendimiento | 0 | 0 | 1 | 0 | 1 |
| **TOTAL** | **3** | **4** | **6** | **2** | **15** |

---

## 🔴 BUGS CRÍTICOS (3)

### BUG-001: Falta Componente Header Reutilizable
**Severidad:** 🔴 CRÍTICA  
**Categoría:** Navegación  
**Prioridad:** P0 (Debe solucionarse inmediatamente)

**Descripción:**
No existe un componente `Header` centralizado. Cada página implementa su propia barra de navegación con estilos y funcionalidad diferentes:
- Landing page (`page.tsx`): Header con "PrediRuta", Login, Register
- Dashboard (`dashboard/page.tsx`): Header con saludo, avatar, botón de cerrar sesión

**Impacto:**
- ❌ Inconsistencia visual entre páginas
- ❌ Código duplicado (mantenibilidad baja)
- ❌ Usuarios confundidos por navegación diferente
- ❌ Difícil agregar features globales (búsqueda, breadcrumbs)

**Archivos Afectados:**
```
frontend/src/app/page.tsx (línea 8-27)
frontend/src/app/dashboard/page.tsx (línea 67-95)
frontend/src/components/layout/ (carpeta vacía)
```

**Reproducir:**
1. Ir a landing page (http://localhost:3000)
2. Hacer login y navegar a dashboard
3. Observar headers completamente diferentes

**Solución Propuesta:**
```typescript
// frontend/src/components/layout/Header.tsx
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { LanguageSelector } from './LanguageSelector';
import { Breadcrumbs } from './Breadcrumbs';
import { UserMenu } from './UserMenu';

export function Header({ showSearch = true, showBreadcrumbs = true }) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          {showSearch && <SearchBar />}
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <UserMenu />
        </div>
      </div>
      {showBreadcrumbs && <Breadcrumbs />}
    </header>
  );
}
```

**Integración en layout.jsx:**
```jsx
import { Header } from "@/components/layout/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <ToasterProvider>
          {children}
          <AccessibilityWidget />
        </ToasterProvider>
      </body>
    </html>
  );
}
```

**Estado:** ⏳ PENDIENTE  
**Estimación:** 6 horas  

---

### BUG-002: Falta Componente Sidebar de Navegación
**Severidad:** 🔴 CRÍTICA  
**Categoría:** Navegación  
**Prioridad:** P0

**Descripción:**
No existe sidebar de navegación. La especificación requiere un menú lateral expandible/colapsable con:
- ❌ Navegación jerárquica (Dashboard, Rutas, Predicciones, Perfil)
- ❌ Atajos de teclado (Alt+S para toggle, Alt+1-5 para navegar)
- ❌ Indicador de página activa
- ❌ Responsive (drawer en móvil)

**Impacto:**
- ❌ Usuario no puede navegar eficientemente (>3 clics para funciones comunes)
- ❌ No cumple requisito de usabilidad ISO 9241-11
- ❌ Navegación por teclado limitada (accesibilidad)
- ❌ Mala experiencia en escritorio (espacio desperdiciado)

**Archivos Afectados:**
```
frontend/src/components/layout/ (no existe Sidebar.tsx)
frontend/src/app/layout.jsx (no integra Sidebar)
```

**Reproducir:**
1. Abrir dashboard
2. Intentar navegar a "Predicciones" → requiere scroll + búsqueda
3. No hay menú lateral persistente

**Solución Propuesta:**
```typescript
// frontend/src/components/layout/Sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Map, TrendingUp, User, Settings } from 'lucide-react';

const MENU_ITEMS = [
  { id: 1, label: 'Dashboard', href: '/dashboard', icon: Home, shortcut: '1' },
  { id: 2, label: 'Rutas', href: '/rutas', icon: Map, shortcut: '2' },
  { id: 3, label: 'Predicciones', href: '/predicciones', icon: TrendingUp, shortcut: '3' },
  { id: 4, label: 'Perfil', href: '/perfil', icon: User, shortcut: '4' },
  { id: 5, label: 'Configuración', href: '/configuracion', icon: Settings, shortcut: '5' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+S: Toggle sidebar
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      
      // Alt+1-5: Navegar
      if (e.altKey && /^[1-5]$/.test(e.key)) {
        e.preventDefault();
        const item = MENU_ITEMS.find(i => i.shortcut === e.key);
        if (item) window.location.href = item.href;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <aside 
      className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] z-40
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300
        ${isOpen ? 'w-64' : 'w-16'}
      `}
      aria-label="Navegación principal"
    >
      <nav className="p-4">
        <ul className="space-y-2">
          {MENU_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                  title={`${item.label} (Alt+${item.shortcut})`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isOpen && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      <kbd className="text-xs opacity-50">Alt+{item.shortcut}</kbd>
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-4 w-6 h-6 bg-blue-600 text-white rounded-full"
        aria-label="Expandir/colapsar menú"
        title="Alt+S"
      >
        {isOpen ? '‹' : '›'}
      </button>
    </aside>
  );
}
```

**Estado:** ⏳ PENDIENTE  
**Estimación:** 8 horas  

---

### BUG-003: Barra de Búsqueda No Implementada
**Severidad:** 🔴 CRÍTICA  
**Categoría:** Funcionalidad  
**Prioridad:** P0

**Descripción:**
La especificación de usabilidad requiere barra de búsqueda en el header para buscar destinos/rutas. Actualmente no existe.

**Impacto:**
- ❌ Feature core del sistema faltante
- ❌ Usuario no puede buscar direcciones rápidamente
- ❌ Aumenta clics necesarios para planificar ruta (>5 clics)
- ❌ Mala experiencia comparada con apps de navegación (Google Maps, Waze)

**Archivos Afectados:**
```
frontend/src/components/layout/ (no existe SearchBar.tsx)
```

**Solución Propuesta:**
```typescript
// frontend/src/components/layout/SearchBar.tsx
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = async (value: string) => {
    setQuery(value);
    
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    // TODO: Integrar con TomTom Search API o Nominatim
    // const results = await fetch(`/api/geocode?q=${value}`);
    setSuggestions(['Resultado 1', 'Resultado 2']); // Mock
  };

  return (
    <div className="relative w-96">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Buscar destino o ruta..."
          className="
            w-full pl-10 pr-4 py-2 
            bg-white/90 dark:bg-gray-800/90 
            border border-white/20 
            rounded-full
            focus:outline-none focus:ring-2 focus:ring-white/50
            text-sm
          "
          aria-label="Buscar destino"
        />
      </div>

      {/* Autocomplete dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {suggestions.map((item, i) => (
            <li 
              key={i}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Estado:** ⏳ PENDIENTE  
**Estimación:** 12 horas (incluye integración con API de geocodificación)  

---

## 🟠 BUGS ALTOS (4)

### BUG-004: Breadcrumbs/Indicador de Ubicación Faltante
**Severidad:** 🟠 ALTA  
**Categoría:** Navegación  
**Prioridad:** P1

**Descripción:**
Usuario no tiene indicador visual de su ubicación en la jerarquía de navegación. No hay breadcrumbs como "Inicio > Dashboard > Tráfico".

**Impacto:**
- ❌ WCAG 2.2: No cumple criterio 2.4.8 (Location)
- ❌ Usuarios se desorientan en navegación profunda
- ❌ Difícil volver a niveles superiores

**Archivos Afectados:**
```
frontend/src/components/layout/Header.tsx (no existe)
```

**Solución Propuesta:**
```typescript
// frontend/src/components/layout/Breadcrumbs.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Inicio',
  '/dashboard': 'Dashboard',
  '/rutas': 'Rutas',
  '/predicciones': 'Predicciones',
  '/perfil': 'Perfil',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (pathname === '/') return null; // No breadcrumbs en home

  return (
    <nav aria-label="Breadcrumb" className="px-4 py-2 bg-white/10">
      <ol className="flex items-center gap-2 text-sm text-white/80">
        <li>
          <Link href="/" className="hover:text-white">
            Inicio
          </Link>
        </li>
        {segments.map((segment, i) => {
          const path = `/${segments.slice(0, i + 1).join('/')}`;
          const label = ROUTE_LABELS[path] || segment;
          const isLast = i === segments.length - 1;

          return (
            <li key={path} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              {isLast ? (
                <span className="text-white font-medium" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link href={path} className="hover:text-white">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

**Estado:** ⏳ PENDIENTE  
**Estimación:** 3 horas  

---

### BUG-005: Selector de Idioma No Funcional
**Severidad:** 🟠 ALTA  
**Categoría:** Navegación  
**Prioridad:** P1

**Descripción:**
Existe dropdown de idioma en dashboard pero solo cambia estado local. No afecta al contenido de la app.

**Código Actual (no funcional):**
```typescript
// dashboard/page.tsx línea 297
function LanguageSelect() {
  const [lang, setLang] = useState("es");
  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)} // Solo cambia estado local
      aria-label="Seleccionar idioma"
      className="..."
    >
      <option value="es">Español</option>
      <option value="en">English</option>
    </select>
  );
}
```

**Impacto:**
- ❌ Feature que no funciona confunde a usuarios
- ❌ Usuarios no hispanohablantes no pueden usar la app
- ❌ No cumple requisito de internacionalización

**Solución Propuesta:**
```bash
# Instalar next-intl
npm install next-intl
```

```typescript
// i18n/config.ts
export const locales = ['es', 'en'] as const;
export const defaultLocale = 'es' as const;

// i18n/messages/es.json
{
  "header": {
    "title": "PrediRuta",
    "login": "Iniciar sesión",
    "register": "Registrarse"
  },
  "dashboard": {
    "welcome": "Hola {name}",
    "traffic": "Tráfico",
    "routes": "Rutas"
  }
}

// i18n/messages/en.json
{
  "header": {
    "title": "PrediRuta",
    "login": "Log in",
    "register": "Sign up"
  },
  "dashboard": {
    "welcome": "Hello {name}",
    "traffic": "Traffic",
    "routes": "Routes"
  }
}

// components/layout/LanguageSelector.tsx
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    // Cambiar idioma preservando la ruta actual
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="..."
    >
      <option value="es">🇪🇸 ES</option>
      <option value="en">🇬🇧 EN</option>
    </select>
  );
}
```

**Estado:** ⏳ PENDIENTE  
**Estimación:** 16 horas (incluye traducir todo el contenido)  

---

### BUG-006: Logo del Sistema Faltante
**Severidad:** 🟠 ALTA  
**Categoría:** Diseño  
**Prioridad:** P1

**Descripción:**
Header muestra solo texto "PrediRuta". No hay logo/imagen de marca.

**Código Actual:**
```jsx
// page.tsx línea 10
<h1 className="text-xl sm:text-2xl font-bold text-white">PrediRuta</h1>
```

**Impacto:**
- ❌ Identidad visual débil
- ❌ Menor reconocimiento de marca
- ❌ Aspecto menos profesional

**Solución Propuesta:**
```typescript
// components/layout/Logo.tsx
import Image from 'next/image';
import Link from 'next/link';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
  };

  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.png" // Usuario debe proveer imagen
        alt="PrediRuta"
        {...dimensions[size]}
        priority
      />
      <span className="text-xl font-bold text-white">PrediRuta</span>
    </Link>
  );
}
```

**Nota:** Usuario preguntó si puede pasar imagen → esperar logo del cliente.

**Estado:** ⏳ PENDIENTE (esperando imagen)  
**Estimación:** 2 horas  

---

### BUG-007: Skip Links para Teclado Faltantes
**Severidad:** 🟠 ALTA  
**Categoría:** Accesibilidad  
**Prioridad:** P1

**Descripción:**
No hay enlaces de "Saltar al contenido" para usuarios de teclado/screen readers.

**Impacto:**
- ❌ WCAG 2.2: No cumple criterio 2.4.1 (Bypass Blocks)
- ❌ Usuarios con discapacidad deben tabular 20+ veces para llegar al contenido

**Solución Propuesta:**
```jsx
// app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* Skip links - visible solo con Tab */}
        <a
          href="#main-content"
          className="
            sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
            bg-blue-600 text-white px-4 py-2 rounded z-[9999]
          "
        >
          Saltar al contenido principal
        </a>
        <a
          href="#sidebar"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 bg-blue-600 text-white px-4 py-2 rounded z-[9999]"
        >
          Ir al menú
        </a>

        <Header />
        <Sidebar />
        
        <main id="main-content" tabIndex={-1}>
          <ToasterProvider>
            {children}
            <AccessibilityWidget />
          </ToasterProvider>
        </main>
      </body>
    </html>
  );
}
```

**Estado:** ⏳ PENDIENTE  
**Estimación:** 2 horas  

---

## 🟡 BUGS MEDIOS (6)

### BUG-008: Footer Institucional Faltante
**Severidad:** 🟡 MEDIA  
**Categoría:** Navegación  
**Prioridad:** P2

**Descripción:**
No existe footer con información institucional, enlaces legales, contacto.

**Solución Propuesta:**
```typescript
// components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Columna 1: Acerca de */}
        <div>
          <h3 className="text-white font-bold mb-4">Acerca de PrediRuta</h3>
          <p className="text-sm">
            Sistema inteligente de predicción de tráfico y optimización de rutas.
          </p>
        </div>

        {/* Columna 2: Enlaces rápidos */}
        <div>
          <h3 className="text-white font-bold mb-4">Enlaces</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/rutas">Rutas</Link></li>
            <li><Link href="/predicciones">Predicciones</Link></li>
            <li><Link href="/perfil">Perfil</Link></li>
          </ul>
        </div>

        {/* Columna 3: Soporte */}
        <div>
          <h3 className="text-white font-bold mb-4">Soporte</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/ayuda">Centro de ayuda</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
            <li><a href="mailto:soporte@prediruta.com">soporte@prediruta.com</a></li>
          </ul>
        </div>

        {/* Columna 4: Legal */}
        <div>
          <h3 className="text-white font-bold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/politica-privacidad">Privacidad</Link></li>
            <li><Link href="/terminos-y-condiciones">Términos</Link></li>
            <li><Link href="/cookies">Cookies</Link></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} PrediRuta. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
```

**Estado:** ⏳ PENDIENTE  
**Estimación:** 4 horas  

---

### BUG-009: Contraste de Colores Insuficiente
**Severidad:** 🟡 MEDIA  
**Categoría:** Diseño  
**Prioridad:** P2

**Descripción:**
Textos sobre gradientes pueden no cumplir WCAG AA (4.5:1 ratio).

**Ubicaciones a Auditar:**
- `page.tsx`: Botones sobre gradientes azules
- `page.tsx`: Textos en secciones con `from-blue-50`
- `dashboard/page.tsx`: Textos sobre cards con gradientes

**Solución:**
1. Instalar herramienta:
```bash
npm install -D axe-core @axe-core/react
```

2. Auditoría manual:
   - Usar DevTools > Lighthouse > Accessibility
   - Usar extensión Axe DevTools
   - Verificar ratio con https://webaim.org/resources/contrastchecker/

3. Ajustar colores según resultados

**Estado:** ⏳ PENDIENTE  
**Estimación:** 6 horas (auditoría + correcciones)  

---

### BUG-010: Scroll Vertical Excesivo
**Severidad:** 🟡 MEDIA  
**Categoría:** Diseño  
**Prioridad:** P2

**Descripción:**
Landing page tiene 380+ líneas de contenido vertical. Usuarios deben hacer >5 scrolls para ver todo.

**Solución:**
- Condensar secciones repetitivas
- Usar tabs o accordions para beneficios
- Mover contenido secundario a páginas internas
- Priorizar "above the fold"

**Estado:** ⏳ PENDIENTE  
**Estimación:** 4 horas  

---

### BUG-011: Mensajes de Bienvenida No Personalizados
**Severidad:** 🟡 MEDIA  
**Categoría:** Funcionalidad  
**Prioridad:** P2

**Descripción:**
Dashboard solo muestra "Hola {nombre}". No usa hora del día, preferencias, clima, etc.

**Solución:**
```typescript
function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Buenos días, ${name}`;
  if (hour < 19) return `Buenas tardes, ${name}`;
  return `Buenas noches, ${name}`;
}
```

**Estado:** ⏳ PENDIENTE  
**Estimación:** 2 horas  

---

### BUG-012: Estados de Error/Carga Inconsistentes
**Severidad:** 🟡 MEDIA  
**Categoría:** Funcionalidad  
**Prioridad:** P2

**Descripción:**
Algunos componentes usan spinners, otros no muestran nada durante carga.

**Solución:**
```typescript
// components/ui/loading-state.tsx
export function LoadingState({ message = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}

// components/ui/error-state.tsx
export function ErrorState({ error, retry }: { error: string; retry?: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p className="text-red-700 mb-4">{error}</p>
      {retry && (
        <button onClick={retry} className="px-4 py-2 bg-red-600 text-white rounded">
          Reintentar
        </button>
      )}
    </div>
  );
}
```

**Estado:** ⏳ PENDIENTE  
**Estimación:** 4 horas  

---

### BUG-013: Tiempo de Carga No Medido
**Severidad:** 🟡 MEDIA  
**Categoría:** Rendimiento  
**Prioridad:** P2

**Descripción:**
No hay métricas de rendimiento establecidas. No se puede validar objetivo <2s.

**Solución:**
```bash
# Instalar Lighthouse CI
npm install -D @lhci/cli

# .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000", "http://localhost:3000/dashboard"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "speed-index": ["error", {"maxNumericValue": 3000}],
        "interactive": ["error", {"maxNumericValue": 3500}]
      }
    }
  }
}
```

**Estado:** ⏳ PENDIENTE  
**Estimación:** 6 horas  

---

## 🔵 BUGS BAJOS (2)

### BUG-014: Duplicación de Estilos de Header
**Severidad:** 🔵 BAJA  
**Categoría:** Diseño  
**Prioridad:** P3

**Descripción:**
Código CSS duplicado en headers de diferentes páginas.

**Solución:**
Se resuelve automáticamente con BUG-001 (Header unificado).

**Estado:** ⏳ PENDIENTE  
**Estimación:** 0 horas (incluido en BUG-001)  

---

### BUG-015: Landmarks ARIA Faltantes
**Severidad:** 🔵 BAJA  
**Categoría:** Accesibilidad  
**Prioridad:** P3

**Descripción:**
Uso de `<div>` genéricos en lugar de elementos semánticos HTML5.

**Solución:**
```jsx
// Antes
<div className="header">...</div>
<div className="content">...</div>

// Después
<header>...</header>
<nav aria-label="Principal">...</nav>
<main>...</main>
<aside>...</aside>
<footer>...</footer>
```

**Estado:** ⏳ PENDIENTE  
**Estimación:** 3 horas  

---

## 📈 PLAN DE CORRECCIÓN

### Sprint 1 (Semana 1) - Bugs Críticos
- [ ] BUG-001: Header reutilizable (6h)
- [ ] BUG-002: Sidebar navegación (8h)
- [ ] BUG-003: Barra de búsqueda (12h)

**Total:** 26 horas → 3-4 días

---

### Sprint 2 (Semana 2) - Bugs Altos
- [ ] BUG-004: Breadcrumbs (3h)
- [ ] BUG-005: Selector idioma funcional (16h)
- [ ] BUG-006: Logo sistema (2h, pendiente imagen)
- [ ] BUG-007: Skip links (2h)

**Total:** 23 horas → 3 días

---

### Sprint 3 (Semana 3) - Bugs Medios
- [ ] BUG-008: Footer (4h)
- [ ] BUG-009: Contraste colores (6h)
- [ ] BUG-010: Reducir scroll (4h)
- [ ] BUG-011: Mensajes personalizados (2h)
- [ ] BUG-012: Estados consistentes (4h)
- [ ] BUG-013: Métricas rendimiento (6h)

**Total:** 26 horas → 3-4 días

---

### Backlog - Bugs Bajos
- [ ] BUG-014: Estilos duplicados (0h, incluido en BUG-001)
- [ ] BUG-015: Landmarks ARIA (3h)

**Total:** 3 horas → 0.5 días

---

## 🎯 MÉTRICAS POST-CORRECCIÓN

### Objetivo: 0 bugs críticos, 0 bugs altos
- Ejecutar todas las pruebas de reproducción
- Validar con Lighthouse (score >90 en todas las categorías)
- Test de usuario real (5 personas)
- Cumplimiento WCAG 2.2 AA (Axe DevTools: 0 errores)

---

**Generado por:** GitHub Copilot AI  
**Próxima revisión:** Después de Sprint 1  
**Versión:** 1.0
