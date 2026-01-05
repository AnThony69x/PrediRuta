"""
Script de prueba para verificar el funcionamiento del ChatAgent.
Ejecuta este script después de iniciar el servidor para probar la API.
"""
import requests
import json


def test_health():
    """Prueba el endpoint de health check."""
    print("🔍 Probando health check...")
    try:
        response = requests.get("http://localhost:8001/api/v1/health")
        if response.status_code == 200:
            print("✅ Health check exitoso:")
            print(json.dumps(response.json(), indent=2, ensure_ascii=False))
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Error al conectar: {e}")
    print()


def test_chat(question: str):
    """Prueba el endpoint de chat con una pregunta."""
    print(f"💬 Pregunta: {question}")
    try:
        response = requests.post(
            "http://localhost:8001/api/v1/chat",
            json={"question": question},
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 200:
            answer = response.json().get("answer", "")
            print(f"✅ Respuesta:")
            print(f"{answer}")
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error al conectar: {e}")
    print()


def test_root():
    """Prueba el endpoint raíz."""
    print("🏠 Probando endpoint raíz...")
    try:
        response = requests.get("http://localhost:8001/")
        if response.status_code == 200:
            print("✅ Endpoint raíz exitoso:")
            print(json.dumps(response.json(), indent=2, ensure_ascii=False))
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Error al conectar: {e}")
    print()


if __name__ == "__main__":
    print("=" * 60)
    print("🤖 PRUEBAS DEL CHATAGENT - PREDIRUTA")
    print("=" * 60)
    print()
    
    # Probar health check
    test_health()
    
    # Probar endpoint raíz
    test_root()
    
    # Probar preguntas de ejemplo
    questions = [
        "¿Qué vía es más recomendable para ir de Tarqui al Centro?",
        "¿A qué hora hay menos tráfico en la Av. Malecón?",
        "¿Cuál es la mejor ruta para ir del Mall del Pacífico al aeropuerto?"
    ]
    
    for question in questions:
        test_chat(question)
    
    print("=" * 60)
    print("✅ Pruebas completadas")
    print("=" * 60)
