# 📘 Documentación del Sistema PrediRuta 2.0

Esta documentación describe la arquitectura, componentes y funcionamiento del sistema **PrediRuta 2.0**, una plataforma avanzada para la predicción y análisis de tráfico vehicular utilizando Inteligencia Artificial.

---

## 🏗️ Arquitectura del Sistema

El sistema sigue una arquitectura moderna basada en microservicios y componentes desacoplados, optimizada para escalabilidad y rendimiento en tiempo real.

### Diagrama de Arquitectura

```mermaid
graph TD
    User[Usuario / Navegador Web] -->|HTTP/HTTPS| Frontend[Frontend (Next.js + TailwindCSS)]
    Frontend -->|API REST| Backend[Backend (FastAPI - Servicio IA)]
    Backend -->|Consultas/Almacenamiento| DB[(Base de Datos Supabase PostgreSQL)]
    Backend -->|Datos en tiempo real| ExtAPI[APIs Externas (Google Maps Traffic)]
```

### Flujo de Datos
1.  **Usuario**: Interactúa con la interfaz web para solicitar rutas o ver el estado del tráfico.
2.  **Frontend**: Procesa la solicitud y la envía al Backend mediante API REST.
3.  **Backend**:
    *   Recibe la solicitud.
    *   Consulta datos históricos en la **Base de Datos**.
    *   Obtiene datos en tiempo real de **APIs Externas** (Google Maps).
    *   Procesa la información con modelos de IA para generar predicciones.
4.  **Respuesta**: El Backend devuelve los datos procesados al Frontend para su visualización.

---

## 🧩 Componentes Principales

### 1. Frontend (`/frontend`)
Interfaz de usuario moderna y responsiva.

*   **Tecnologías**: Next.js 14 (App Router), React 18, TailwindCSS, TypeScript.
*   **Autenticación**: Supabase Auth.
*   **Estructura Clave**:
    *   `src/app/`: Rutas de la aplicación (Dashboard, Rutas, Predicciones).
    *   `src/components/`: Componentes reutilizables (UI, Mapas, Auth).
    *   `src/lib/`: Utilidades y clientes (Supabase, i18n).
    *   `src/middleware.ts`: Protección de rutas y redirección.

### 2. Backend (`/backend`)
Núcleo lógico y de procesamiento de datos.

*   **Tecnologías**: Python 3.11+, FastAPI, Uvicorn, Pandas, Scikit-learn (para IA).
*   **Funciones**:
    *   API RESTful para el frontend.
    *   Servicios de IA para predicción de tráfico.
    *   Gestión de usuarios y datos.
*   **Estructura Clave**:
    *   `app/main.py`: Punto de entrada.
    *   `app/routes/`: Endpoints de la API (`trafico`, `prediccion`).
    *   `app/services/`: Lógica de negocio (`traffic_service`, `ia_service`).
    *   `app/models/`: Modelos de datos Pydantic.

### 3. Base de Datos (`/database`)
Almacenamiento persistente y relacional.

*   **Tecnología**: PostgreSQL (gestionado por Supabase).
*   **Tablas Principales**:
    *   `user_profiles`: Información de usuarios.
    *   `traffic_data`: Datos históricos de tráfico.
    *   `traffic_predictions`: Resultados de los modelos de IA.
    *   `road_segments`: Información geoespacial de las vías.
*   **Herramientas**:
    *   `db_manager.py`: Script CLI para inicializar, sembrar y gestionar la BD.
    *   `init_db.sql`: Script SQL maestro para la creación del esquema.

---

## 🚀 Instalación y Configuración

### Prerrequisitos
*   Docker y Docker Compose (recomendado).
*   Python 3.11+ y Node.js 22+.
*   Cuenta en Supabase y Google Cloud Platform (para API Keys).

### Pasos de Instalación

#### 1. Base de Datos
Configura las variables de entorno en `.env` con tus credenciales de Supabase y ejecuta:
```bash
cd database
pip install -r requirements.txt
python db_manager.py init  # Crea las tablas
python db_manager.py seed  # Inserta datos de prueba
```

#### 2. Backend
```bash
cd backend
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # o venv\Scripts\activate en Windows
pip install -r requirements.txt

# Ejecutar servidor
uvicorn app.main:app --reload
```

#### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## ✨ Funcionalidades Clave

1.  **Predicción de Tráfico**: Utiliza algoritmos de ML para estimar la congestión futura basada en datos históricos y condiciones actuales.
2.  **Gestión de Rutas**: Permite a los usuarios buscar, guardar y optimizar rutas de desplazamiento.
3.  **Historial**: Registro detallado de consultas y viajes realizados por el usuario.
4.  **Accesibilidad**: Interfaz adaptada con opciones de alto contraste y tamaño de texto (Widget de accesibilidad).
5.  **Internacionalización (i18n)**: Soporte completo para Español e Inglés en toda la plataforma.

---

## 🔒 Seguridad

*   **Autenticación**: Manejada vía Supabase con soporte para OAuth y correo/contraseña.
*   **Protección de Rutas**: Middleware en Next.js para asegurar páginas privadas (`/dashboard`, `/perfil`).
*   **Variables de Entorno**: Gestión segura de claves API y secretos de base de datos.
