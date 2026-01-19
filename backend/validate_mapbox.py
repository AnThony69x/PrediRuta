#!/usr/bin/env python3
"""
Script de validación de la configuración de Mapbox

Verifica que:
1. Las variables de entorno estén configuradas
2. El token de Mapbox sea válido
3. Los servicios de Mapbox estén accesibles
"""

import os
import sys
import asyncio
from pathlib import Path

# Agregar el directorio raíz al path
sys.path.insert(0, str(Path(__file__).parent))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("⚠️  python-dotenv no instalado. Ejecuta: pip install python-dotenv")
    sys.exit(1)

from app.config.mapbox import mapbox_config
from app.services.mapbox_directions import get_directions
from app.services.mapbox_geocoding import geocode_forward, geocode_reverse
from app.services.traffic_service import get_traffic_status_for_point


async def validate_configuration():
    """Validar configuración básica"""
    print("\n🔍 Validando configuración de Mapbox...")
    print("=" * 60)
    
    # Verificar token
    if not mapbox_config.access_token:
        print("❌ MAPBOX_ACCESS_TOKEN no configurado")
        print("   Configura la variable en el archivo .env")
        return False
    
    if mapbox_config.access_token == "your-mapbox-access-token-here":
        print("❌ MAPBOX_ACCESS_TOKEN tiene el valor por defecto")
        print("   Configura un token válido en el archivo .env")
        return False
    
    print(f"✅ Token configurado: {mapbox_config.access_token[:20]}...")
    
    # Validar configuración
    valid, message = mapbox_config.validate()
    if not valid:
        print(f"❌ Error de configuración: {message}")
        return False
    
    print(f"✅ {message}")
    return True


async def test_geocoding():
    """Probar servicio de geocodificación"""
    print("\n🗺️  Probando Geocoding...")
    print("-" * 60)
    
    # Forward geocoding
    print("➡️  Geocoding directo: 'Manta, Ecuador'")
    try:
        result = await geocode_forward("Manta, Ecuador", country="EC", limit=1)
        
        if result.get("status") == "ok" and result.get("results"):
            place = result["results"][0]
            coords = place["coordinates"]
            print(f"   ✅ Encontrado: {place['place_name']}")
            print(f"   📍 Coordenadas: {coords['longitude']}, {coords['latitude']}")
        else:
            print(f"   ❌ Error: {result.get('message', 'Sin resultados')}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False
    
    # Reverse geocoding
    print("\n⬅️  Geocoding inverso: Manta (-80.72, -0.95)")
    try:
        result = await geocode_reverse(-80.72, -0.95)
        
        if result.get("status") == "ok" and result.get("result"):
            place = result["result"]
            print(f"   ✅ Encontrado: {place['place_name']}")
        else:
            print(f"   ❌ Error: {result.get('message', 'Sin resultados')}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False
    
    return True


async def test_directions():
    """Probar servicio de direcciones"""
    print("\n🚗 Probando Directions API...")
    print("-" * 60)
    
    # Ruta Manta -> Guayaquil
    print("🛣️  Calculando ruta: Manta → Guayaquil")
    start = (-80.72, -0.95)  # Manta
    end = (-79.88, -2.19)    # Guayaquil
    
    try:
        result = await get_directions(
            coordinates=[start, end],
            profile="driving-traffic",
            alternatives=False,
        )
        
        if result.get("status") == "ok" and result.get("routes"):
            route = result["routes"][0]
            distance_km = route["distance"] / 1000
            duration_min = route["duration"] / 60
            
            print(f"   ✅ Ruta encontrada")
            print(f"   📏 Distancia: {distance_km:.2f} km")
            print(f"   ⏱️  Duración: {duration_min:.0f} minutos")
            
            # Verificar datos de tráfico
            if route.get("legs"):
                leg = route["legs"][0]
                annotation = leg.get("annotation", {})
                if annotation.get("congestion"):
                    print(f"   🚦 Datos de tráfico: ✅ Disponibles")
                else:
                    print(f"   🚦 Datos de tráfico: ⚠️  No disponibles")
        else:
            print(f"   ❌ Error: {result.get('message', 'Sin rutas')}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False
    
    return True


async def test_traffic():
    """Probar servicio de tráfico"""
    print("\n🚦 Probando Traffic Service...")
    print("-" * 60)
    
    # Punto en Manta
    print("📍 Consultando tráfico en Manta (-0.95, -80.72)")
    try:
        result = await get_traffic_status_for_point(-0.95, -80.72)
        
        if result.get("status") == "ok":
            print(f"   ✅ Datos obtenidos")
            print(f"   🚗 Velocidad actual: {result.get('currentSpeed', 'N/A')} km/h")
            print(f"   🟢 Velocidad libre: {result.get('freeFlowSpeed', 'N/A')} km/h")
            print(f"   🔴 Congestión: {result.get('congestionLevel', 'unknown')}")
        elif result.get("status") == "unavailable":
            print(f"   ⚠️  Servicio no disponible: {result.get('message')}")
            print(f"   ℹ️  Esto es normal si no hay datos de tráfico en esta ubicación")
        else:
            print(f"   ❌ Error: {result.get('message', 'Error desconocido')}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False
    
    return True


async def main():
    """Ejecutar todas las validaciones"""
    print("\n" + "=" * 60)
    print("🚀 VALIDACIÓN DE MAPBOX - PrediRuta")
    print("=" * 60)
    
    # Validar configuración
    if not await validate_configuration():
        print("\n❌ Error en la configuración. Por favor, revisa las variables de entorno.")
        return False
    
    # Probar servicios
    results = []
    
    results.append(await test_geocoding())
    results.append(await test_directions())
    results.append(await test_traffic())
    
    # Resumen
    print("\n" + "=" * 60)
    print("📊 RESUMEN")
    print("=" * 60)
    
    total = len(results)
    passed = sum(results)
    
    if passed == total:
        print(f"✅ Todos los tests pasaron ({passed}/{total})")
        print("\n🎉 ¡Mapbox está correctamente configurado!")
        return True
    else:
        print(f"⚠️  Algunos tests fallaron ({passed}/{total})")
        print("\n💡 Revisa los errores anteriores para más detalles")
        return False


if __name__ == "__main__":
    try:
        success = asyncio.run(main())
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Validación cancelada por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Error inesperado: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
