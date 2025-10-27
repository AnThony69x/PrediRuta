"""
Script de prueba para validar endpoint de tráfico con TomTom.
Ejecutar desde el directorio backend:
    python test_traffic.py
"""
import asyncio
import sys
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

from app.services.traffic_service import get_traffic_status_for_point

async def main():
    # Mostrar configuración
    print(f"🔧 Configuración:")
    print(f"  TRAFFIC_PROVIDER: {os.getenv('TRAFFIC_PROVIDER', 'NO CONFIGURADO')}")
    print(f"  TRAFFIC_API_KEY: {'✓ Configurada' if os.getenv('TRAFFIC_API_KEY') else '✗ FALTA'}")
    print()
    
    # Punto de prueba: Madrid, España (Gran Vía - zona con excelente cobertura TomTom)
    lat, lon = 40.4200, -3.7025  # Gran Vía, Madrid
    
    print(f"🚗 Probando detección de tráfico para punto ({lat}, {lon}) - Madrid, España")
    print("=" * 60)
    
    result = await get_traffic_status_for_point(lat, lon)
    
    print(f"\n📊 Resultado:")
    print(f"  Status: {result.get('status')}")
    print(f"  Provider: {result.get('provider')}")
    print(f"  Current Speed: {result.get('currentSpeed')} km/h")
    print(f"  Free Flow Speed: {result.get('freeFlowSpeed')} km/h")
    print(f"  Confidence: {result.get('confidence')}")
    
    if result.get('status') == 'unavailable':
        print(f"\n❌ Error: {result.get('message')} (code: {result.get('code')})")
        print("\n🔍 Posibles causas:")
        print("  1. TRAFFIC_API_KEY inválida o expirada")
        print("  2. Plan de TomTom sin acceso a Traffic Flow API")
        print("  3. Punto sin cobertura de datos de tráfico")
        print("\n💡 Solución:")
        print("  - Verifica tu API key en https://developer.tomtom.com/")
        print("  - Asegúrate de tener acceso a 'Traffic Flow Segment Data' en tu plan")
        return 1
    else:
        print("\n✅ ¡Detección de tráfico funcionando correctamente!")
        return 0

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
