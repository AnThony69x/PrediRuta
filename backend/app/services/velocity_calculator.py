"""
Calculador de Velocidades Recomendadas
=======================================

Calcula velocidades seguras basadas en:
- Datos históricos de excesos de velocidad
- Normativa ecuatoriana de límites de velocidad
- Tipo de zona (urbana, perimetral, carretera)
- Tipo de vehículo (liviano, pesado)

Límites de velocidad según normativa de Ecuador:
- Zonas urbanas: 50-60 km/h (livianos), 40-50 km/h (pesados)
- Vías perimetrales: 90 km/h (livianos), 70 km/h (pesados)
- Carreteras rectas: 100 km/h (livianos)
- Carreteras curvas: 60 km/h (livianos)
"""

from typing import Dict, List, Any
import numpy as np


class VelocityCalculator:
    """Calcula velocidades recomendadas basadas en datos históricos y normativa"""
    
    # Límites de velocidad según normativa ecuatoriana
    SPEED_LIMITS = {
        "urbana_liviano": {"min": 50, "max": 60, "promedio": 55},
        "urbana_pesado": {"min": 40, "max": 50, "promedio": 45},
        "perimetral_liviano": {"min": 80, "max": 90, "promedio": 85},
        "perimetral_pesado": {"min": 60, "max": 70, "promedio": 65},
        "carretera_recta": {"min": 90, "max": 100, "promedio": 95},
        "carretera_curva": {"min": 50, "max": 60, "promedio": 55},
        "autopista": {"min": 90, "max": 120, "promedio": 100}
    }
    
    @staticmethod
    def classify_zone_type(velocidad_historica: float) -> str:
        """
        Clasifica el tipo de zona según velocidad histórica promedio
        
        Args:
            velocidad_historica: Velocidad promedio del dataset (100-149 km/h)
            
        Returns:
            Tipo de zona: urbana, perimetral, carretera, autopista
        """
        if velocidad_historica < 70:
            return "urbana"
        elif velocidad_historica < 90:
            return "perimetral"
        elif velocidad_historica < 110:
            return "carretera"
        else:
            return "autopista"
    
    @staticmethod
    def calculate_recommended_speed(
        velocidad_historica: float,
        tipo_vehiculo: str = "liviano",
        factor_seguridad: float = 0.85
    ) -> Dict[str, float]:
        """
        Calcula velocidad recomendada basada en datos históricos
        
        Args:
            velocidad_historica: Velocidad del dataset (excesos detectados)
            tipo_vehiculo: "liviano" o "pesado"
            factor_seguridad: Factor de reducción (0.85 = 15% menos que el límite)
            
        Returns:
            Dict con velocidad recomendada, mínima, máxima y límite legal
        """
        # El dataset contiene excesos (100-149 km/h = velocidades ALTAS)
        # Necesitamos calcular la velocidad RECOMENDADA (más baja y segura)
        
        # Clasificar tipo de zona
        zona = VelocityCalculator.classify_zone_type(velocidad_historica)
        
        # Obtener límite según zona y vehículo
        if zona == "urbana":
            key = f"urbana_{tipo_vehiculo}"
        elif zona == "perimetral":
            key = f"perimetral_{tipo_vehiculo}"
        elif zona == "carretera":
            key = "carretera_recta"
        else:
            key = "autopista"
        
        limite = VelocityCalculator.SPEED_LIMITS.get(
            key, 
            {"min": 50, "max": 90, "promedio": 70}
        )
        
        # Calcular velocidad recomendada (con factor de seguridad)
        velocidad_recomendada = limite["promedio"] * factor_seguridad
        
        return {
            "velocidad_recomendada": round(velocidad_recomendada, 1),
            "velocidad_minima": float(limite["min"]),
            "velocidad_maxima": float(limite["max"]),
            "limite_legal": float(limite["promedio"]),
            "tipo_zona": str(zona),
            "velocidad_historica": float(velocidad_historica),
            "factor_seguridad": float(factor_seguridad)
        }
    
    @staticmethod
    def adjust_hourly_velocities(
        hourly_data: List[Dict[str, Any]],
        tipo_vehiculo: str = "liviano"
    ) -> List[Dict[str, Any]]:
        """
        Ajusta velocidades históricas por hora a velocidades recomendadas
        
        Args:
            hourly_data: Lista de {hora, velocidad_promedio, confianza}
            tipo_vehiculo: "liviano" o "pesado"
            
        Returns:
            Lista ajustada con velocidades recomendadas
        """
        adjusted = []
        
        for item in hourly_data:
            vel_hist = item.get('velocidad_promedio', 100)
            
            # Calcular velocidad recomendada
            calc = VelocityCalculator.calculate_recommended_speed(
                vel_hist, 
                tipo_vehiculo
            )
            
            # Agregar variación por hora del día
            hora = int(item['hora'].split(':')[0])
            
            # Horas pico (7-9, 12-14, 18-20): más congestión = menor velocidad
            if hora in [7, 8, 9, 12, 13, 14, 18, 19, 20]:
                factor_hora = 0.85  # 15% más lento
            # Horas normales
            elif hora in [10, 11, 15, 16, 17, 21, 22]:
                factor_hora = 0.95
            # Madrugada/noche: menos tráfico = más rápido
            else:
                factor_hora = 1.0
            
            velocidad_final = calc["velocidad_recomendada"] * factor_hora
            
            adjusted.append({
                "hora": item['hora'],
                "velocidad": round(velocidad_final, 1),
                "confianza": item.get('confianza', 0.5),
                "limite_legal": calc["limite_legal"],
                "tipo_zona": calc["tipo_zona"]
            })
        
        return adjusted
    
    @staticmethod
    def get_zone_description(tipo_zona: str) -> str:
        """Retorna descripción del tipo de zona"""
        descriptions = {
            "urbana": "Zona Urbana (Avenidas principales)",
            "perimetral": "Vía Perimetral (Autopistas urbanas)",
            "carretera": "Carretera Interprovincial",
            "autopista": "Autopista de Alta Velocidad"
        }
        return descriptions.get(tipo_zona, "Zona Desconocida")
