# 📊 Datasets de Tráfico Ecuador - PrediRuta

## Ubicación de Archivos

Coloca tu archivo CSV de tráfico en esta carpeta:

```
backend/data/
├── README.md
├── trafico_ecuador.csv    ← TU ARCHIVO AQUÍ
└── processed/             ← Datos procesados (generado automáticamente)
```

## Formato Esperado del CSV

El archivo debe tener las siguientes columnas:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `PROVINCIA_C` | Código de provincia | AZUAY, MANABI, PICHINCHA |
| `CIUDAD_OPER` | Ciudad de operación | CUENCA, MANTA, QUITO |
| `IDENTIFICACION` | ID del segmento vial | CUENCA_1, MANTA_5 |
| `TIPO_OPERACION` | Tipo de vía | INTER PROVINCIAL, URBANA |
| `LATITUD` | Latitud (decimal negativo) | -2.895025 |
| `LONGITUD` | Longitud (decimal negativo) | -78.9803933 |
| `UBICACION_EXCESO` | Nombre de ubicación | CUENCA, CUE CHORDELEG |
| `CIUDAD_EXCESO` | Ciudad donde ocurrió | CHORDELEG |
| `PROVINCIA_EXCESO` | Provincia | AZUAY |
| `FECHA_ALERTA` | Fecha (DD/MM/YYYY) | 4/2/2022 |
| `HORA_ALERTA` | Hora (HH:MM:SS) | 12:20:34 |
| `VELOCIDAD` | Velocidad registrada km/h | 103 |
| `TIPO_EXCESO` | Clasificación | CUARTA_CLASE |

## Cómo Cargar los Datos

1. Coloca tu archivo CSV como `trafico_ecuador.csv`
2. Ejecuta el script de carga:

```bash
cd backend
python -m app.services.dataset_loader
```

## Provincias Soportadas

El sistema detectará automáticamente las provincias disponibles:
- 🏔️ AZUAY (Cuenca, Chordeleg, Girón, etc.)
- 🌊 MANABI (Manta, Portoviejo, etc.)
- 🏛️ PICHINCHA (Quito, etc.)
- 🌴 GUAYAS (Guayaquil, etc.)
- Y más...

## Notas Importantes

- Los datos son **históricos** (2022) - útiles para análisis y predicciones
- Son **alertas de velocidad** - reflejan patrones de tráfico
- Se pueden usar para:
  - Entrenar modelos ML de predicción
  - Analizar patrones por hora/día
  - Identificar zonas de alta velocidad/congestión
  - Alimentar el ChatAgent con datos reales
