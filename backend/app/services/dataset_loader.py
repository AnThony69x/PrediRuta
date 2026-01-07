"""
Dataset Loader para Tráfico de Ecuador
=======================================

Carga y procesa el dataset CSV de tráfico de Ecuador.
Proporciona funciones para consultar datos históricos por:
- Provincia
- Ciudad
- Hora del día
- Fecha
- Coordenadas (proximidad)

Autor: PrediRuta Team
"""

import os
import pandas as pd
from datetime import datetime, time
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path
import json

# Ruta al directorio de datos
DATA_DIR = Path(__file__).parent.parent.parent / "data"
CSV_FILE = DATA_DIR / "trafico_ecuador.csv"
CACHE_FILE = DATA_DIR / "processed" / "traffic_cache.json"


class TrafficDataset:
    """Clase para manejar el dataset de tráfico de Ecuador"""
    
    _instance = None
    _df: Optional[pd.DataFrame] = None
    
    def __new__(cls):
        """Singleton para evitar cargar el CSV múltiples veces"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._df is None:
            self.load_data()
    
    def load_data(self) -> bool:
        """Carga el dataset CSV"""
        if not CSV_FILE.exists():
            print(f"⚠️ Archivo no encontrado: {CSV_FILE}")
            print(f"   Coloca tu archivo CSV en: {DATA_DIR}/trafico_ecuador.csv")
            return False
        
        try:
            # Intentar diferentes encodings y separadores
            for encoding in ['utf-8', 'latin-1', 'cp1252']:
                try:
                    # El CSV usa ; como separador y , para decimales
                    self._df = pd.read_csv(
                        CSV_FILE, 
                        encoding=encoding,
                        sep=';',
                        decimal=',',
                        on_bad_lines='skip'  # Ignorar líneas malformadas
                    )
                    break
                except UnicodeDecodeError:
                    continue
            
            if self._df is None:
                print("❌ No se pudo leer el archivo CSV con ningún encoding")
                return False
            
            # Normalizar nombres de columnas
            self._df.columns = self._df.columns.str.strip().str.upper().str.replace('_OPERADORA', '_OPER')
            
            # Renombrar columnas para consistencia
            column_mapping = {
                'PROVINCIA_OPER': 'PROVINCIA_C',
                'CIUDAD_OPER': 'CIUDAD_OPER',
                'IDENTIFICACION_OPER': 'IDENTIFICACION',
                'TIPO_OPER': 'TIPO_OPERACION'
            }
            self._df.rename(columns=column_mapping, inplace=True)
            
            # Procesar columnas de fecha y hora
            self._process_datetime()
            
            # Limpiar coordenadas
            self._clean_coordinates()
            
            print(f"✅ Dataset cargado: {len(self._df)} registros")
            print(f"   Provincias: {self._df['PROVINCIA_C'].nunique()}")
            print(f"   Ciudades: {self._df['CIUDAD_OPER'].nunique()}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error cargando dataset: {e}")
            return False
    
    def _process_datetime(self):
        """Procesa las columnas de fecha y hora"""
        try:
            # Convertir fecha
            if 'FECHA_ALERTA' in self._df.columns:
                self._df['FECHA'] = pd.to_datetime(
                    self._df['FECHA_ALERTA'], 
                    format='%d/%m/%Y',
                    errors='coerce'
                )
                self._df['DIA_SEMANA'] = self._df['FECHA'].dt.dayofweek
                self._df['MES'] = self._df['FECHA'].dt.month
            
            # Extraer hora
            if 'HORA_ALERTA' in self._df.columns:
                self._df['HORA'] = pd.to_datetime(
                    self._df['HORA_ALERTA'], 
                    format='%H:%M:%S',
                    errors='coerce'
                ).dt.hour
                
        except Exception as e:
            print(f"⚠️ Error procesando fechas: {e}")
    
    def _clean_coordinates(self):
        """Limpia y valida coordenadas"""
        if 'LATITUD' in self._df.columns:
            self._df['LATITUD'] = pd.to_numeric(self._df['LATITUD'], errors='coerce')
        if 'LONGITUD' in self._df.columns:
            self._df['LONGITUD'] = pd.to_numeric(self._df['LONGITUD'], errors='coerce')
    
    @property
    def is_loaded(self) -> bool:
        """Verifica si el dataset está cargado"""
        return self._df is not None and len(self._df) > 0
    
    def get_provincias(self) -> List[str]:
        """Obtiene lista de provincias disponibles"""
        if not self.is_loaded:
            return []
        return sorted(self._df['PROVINCIA_C'].dropna().unique().tolist())
    
    def get_ciudades(self, provincia: Optional[str] = None) -> List[str]:
        """Obtiene ciudades, opcionalmente filtradas por provincia"""
        if not self.is_loaded:
            return []
        
        df = self._df
        if provincia:
            df = df[df['PROVINCIA_C'].str.upper() == provincia.upper()]
        
        return sorted(df['CIUDAD_OPER'].dropna().unique().tolist())
    
    def get_stats_by_city(self, ciudad: str) -> Dict[str, Any]:
        """Obtiene estadísticas de tráfico por ciudad"""
        if not self.is_loaded:
            return {}
        
        df = self._df[self._df['CIUDAD_OPER'].str.upper() == ciudad.upper()]
        
        if len(df) == 0:
            return {"error": f"No hay datos para {ciudad}"}
        
        return {
            "ciudad": ciudad,
            "total_registros": len(df),
            "velocidad_promedio": round(df['VELOCIDAD'].mean(), 2),
            "velocidad_max": df['VELOCIDAD'].max(),
            "velocidad_min": df['VELOCIDAD'].min(),
            "ubicaciones": df['UBICACION_EXCESO'].nunique(),
            "provincias": df['PROVINCIA_C'].unique().tolist()
        }
    
    def get_stats_by_hour(self, ciudad: Optional[str] = None) -> List[Dict[str, Any]]:
        """Obtiene estadísticas agrupadas por hora del día"""
        if not self.is_loaded:
            return []
        
        df = self._df
        if ciudad:
            df = df[df['CIUDAD_OPER'].str.upper() == ciudad.upper()]
        
        if 'HORA' not in df.columns:
            return []
        
        stats = df.groupby('HORA').agg({
            'VELOCIDAD': ['mean', 'count', 'std'],
        }).reset_index()
        
        stats.columns = ['hora', 'velocidad_promedio', 'registros', 'desviacion']
        
        return [
            {
                "hora": f"{int(row['hora']):02d}:00",
                "velocidad_promedio": round(row['velocidad_promedio'], 1),
                "registros": int(row['registros']),
                "confianza": min(1.0, row['registros'] / 100)  # Mayor muestra = más confianza
            }
            for _, row in stats.iterrows()
        ]
    
    def get_traffic_level(self, velocidad: float, velocidad_limite: float = 50) -> str:
        """Determina el nivel de tráfico basado en velocidad"""
        ratio = velocidad / velocidad_limite
        
        if ratio >= 0.9:
            return "fluido"
        elif ratio >= 0.6:
            return "moderado"
        elif ratio >= 0.4:
            return "congestionado"
        else:
            return "severo"
    
    def get_nearby_data(
        self, 
        lat: float, 
        lon: float, 
        radio_km: float = 5.0
    ) -> List[Dict[str, Any]]:
        """
        Obtiene datos de tráfico cercanos a una coordenada.
        Usa la fórmula de Haversine simplificada.
        """
        if not self.is_loaded:
            return []
        
        # Aproximación: 1 grado ≈ 111 km
        delta = radio_km / 111.0
        
        df = self._df[
            (self._df['LATITUD'].between(lat - delta, lat + delta)) &
            (self._df['LONGITUD'].between(lon - delta, lon + delta))
        ]
        
        if len(df) == 0:
            return []
        
        # Agrupar por ubicación
        grouped = df.groupby(['UBICACION_EXCESO', 'LATITUD', 'LONGITUD']).agg({
            'VELOCIDAD': ['mean', 'count'],
        }).reset_index()
        
        grouped.columns = ['ubicacion', 'lat', 'lon', 'velocidad_promedio', 'registros']
        
        return [
            {
                "ubicacion": row['ubicacion'],
                "lat": row['lat'],
                "lon": row['lon'],
                "velocidad_promedio": round(row['velocidad_promedio'], 1),
                "registros": int(row['registros']),
                "nivel_trafico": self.get_traffic_level(row['velocidad_promedio'])
            }
            for _, row in grouped.iterrows()
        ]
    
    def get_peak_hours(self, ciudad: Optional[str] = None) -> Dict[str, Any]:
        """Identifica horas pico basadas en los datos"""
        if not self.is_loaded:
            return {}
        
        df = self._df
        if ciudad:
            df = df[df['CIUDAD_OPER'].str.upper() == ciudad.upper()]
        
        if 'HORA' not in df.columns or len(df) == 0:
            return {}
        
        hourly = df.groupby('HORA')['VELOCIDAD'].agg(['mean', 'count'])
        
        # Horas con menor velocidad = más congestión
        min_speed_hours = hourly.nsmallest(3, 'mean').index.tolist()
        max_speed_hours = hourly.nlargest(3, 'mean').index.tolist()
        
        return {
            "horas_pico": [f"{h:02d}:00" for h in min_speed_hours],
            "horas_fluidas": [f"{h:02d}:00" for h in max_speed_hours],
            "velocidad_pico": round(hourly.loc[min_speed_hours, 'mean'].mean(), 1),
            "velocidad_fluida": round(hourly.loc[max_speed_hours, 'mean'].mean(), 1)
        }
    
    def get_summary(self) -> Dict[str, Any]:
        """Resumen general del dataset"""
        if not self.is_loaded:
            return {"error": "Dataset no cargado"}
        
        return {
            "total_registros": len(self._df),
            "provincias": self.get_provincias(),
            "total_provincias": len(self.get_provincias()),
            "total_ciudades": self._df['CIUDAD_OPER'].nunique(),
            "rango_fechas": {
                "inicio": str(self._df['FECHA'].min())[:10] if 'FECHA' in self._df.columns else None,
                "fin": str(self._df['FECHA'].max())[:10] if 'FECHA' in self._df.columns else None,
            },
            "velocidad_stats": {
                "promedio": round(self._df['VELOCIDAD'].mean(), 1),
                "max": int(self._df['VELOCIDAD'].max()),
                "min": int(self._df['VELOCIDAD'].min()),
            }
        }


# Instancia global del dataset
traffic_dataset = TrafficDataset()


def get_traffic_dataset() -> TrafficDataset:
    """Obtiene la instancia del dataset de tráfico"""
    return traffic_dataset


# Para testing directo
if __name__ == "__main__":
    dataset = get_traffic_dataset()
    
    if dataset.is_loaded:
        print("\n📊 Resumen del Dataset:")
        print(json.dumps(dataset.get_summary(), indent=2, ensure_ascii=False))
        
        print("\n🏙️ Provincias disponibles:")
        for prov in dataset.get_provincias():
            ciudades = dataset.get_ciudades(prov)
            print(f"  - {prov}: {len(ciudades)} ciudades")
    else:
        print("\n⚠️ Para cargar el dataset:")
        print(f"   1. Coloca tu CSV en: {CSV_FILE}")
        print("   2. Ejecuta: python -m app.services.dataset_loader")
