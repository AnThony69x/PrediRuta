# PrediRuta 🚦  
Sistema web de predicción del tráfico vehicular con Inteligencia Artificial.  

## 📌 Descripción
**PrediRuta** es un sistema universitario que combina **IA** y **datos de tráfico** para predecir la congestión vehicular y sugerir rutas más rápidas en tiempo real.  
El sistema está compuesto por un **frontend web** y un **backend** con un microservicio de IA.

## 🎯 Objetivos
- Analizar datos históricos y en tiempo real de tráfico vehicular.  
- Entrenar un modelo de predicción basado en Machine Learning.  
- Sugerir rutas rápidas y alternativas para los usuarios.  
- Proveer una interfaz web accesible y fácil de usar.  

## 🏗️ Arquitectura del Proyecto
```
PrediRuta/
│
├── frontend/              # Interfaz Web (Next.js + TailwindCSS)
├── backend/               # API REST con FastAPI (predicciones IA)
├── data/                  # Datos históricos/simulados para el modelo
├── docs/                  # Documentación académica
├── tests/                 # Pruebas unitarias e integración
├── .gitignore             # Archivos a ignorar en Git
├── LICENSE                # Licencia (MIT en español)
├── README.md              # Descripción principal del proyecto
└── docker-compose.yml     # Orquestación de contenedores

```

- **Frontend (Next.js + TailwindCSS + Supabase)** → Vista del usuario, mapas y rutas.  
- **Backend (FastAPI)** → Procesa peticiones, expone el modelo IA y consultas de tráfico.  
- **Base de datos** → Supabase (PostgreSQL en la nube).  
- **Contenedores** → Docker y `docker-compose` para ejecutar el proyecto fácilmente.  

## ⚙️ Tecnologías utilizadas
- **Frontend:** Next.js 13+, TailwindCSS, Supabase Auth/DB.  
- **Backend:** Python 3.13.7, FastAPI, scikit-learn / TensorFlow (para predicciones).  
- **Base de datos:** PostgreSQL (Supabase).  
- **Infraestructura:** Docker & Docker Compose.  

## 🚀 Instalación y ejecución

### 1. Clonar repositorio
```bash
git clone https://github.com/AnThony69x/PrediRuta.git
cd prediruta
```

### 2. Configurar variables de entorno
Crear un archivo `.env` en **frontend/** y **backend/** con las credenciales necesarias (ejemplo: claves de Supabase, API Key de Google Maps).

### 3. Levantar con Docker
```bash
docker-compose up --build
```

### 4. Acceder
- Frontend: [http://localhost:3000](http://localhost:3000)  
- Backend (API): [http://localhost:8000/docs](http://localhost:8000/docs)  

## 📊 Datos utilizados
- **Históricos:** datasets simulados o abiertos de movilidad en Ecuador.  
- **Tiempo real:** integración con la API de **Google Maps Traffic Layer**.  

## 📄 Documentación
Toda la documentación técnica y académica se encuentra en la carpeta `/docs`:
- Diagramas UML.  
- Informe de accesibilidad y usabilidad.  
- Evaluación de arquitectura y despliegue.  

## 👨‍💻 Autores
Proyecto universitario desarrollado por:  
- **Anthony Mejia** 
- **Kristhin Bello** 
- **Jesus Montes** 
- Universidad Laica de Eloy Alfaro de Manabí – Carrera de Ingeniería en Software.  
