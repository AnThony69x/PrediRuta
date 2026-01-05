"""
Test de diagnóstico para la API de Gemini
Ejecutar con: python test_gemini_diagnostic.py
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Cargar variables de entorno
load_dotenv()

print("=" * 70)
print("🔍 DIAGNÓSTICO DE GEMINI API")
print("=" * 70)
print()

# Test 1: Verificar API Key
print("Test 1: Verificando API Key...")
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    print(f"✅ API Key encontrada: {api_key[:20]}...{api_key[-5:]}")
else:
    print("❌ API Key NO encontrada en .env")
    exit(1)

print()

# Test 2: Configurar Gemini
print("Test 2: Configurando Gemini...")
try:
    genai.configure(api_key=api_key)
    print("✅ Gemini configurado correctamente")
except Exception as e:
    print(f"❌ Error al configurar Gemini: {e}")
    exit(1)

print()

# Test 3: Listar modelos disponibles
print("Test 3: Listando modelos disponibles...")
try:
    models = genai.list_models()
    print("✅ Modelos disponibles:")
    for model in models:
        if 'generateContent' in model.supported_generation_methods:
            print(f"   - {model.name}")
except Exception as e:
    print(f"❌ Error al listar modelos: {e}")

print()

# Test 4: Probar con gemini-1.5-flash
print("Test 4: Probando modelo gemini-1.5-flash...")
try:
    model = genai.GenerativeModel("gemini-1.5-flash")
    print("✅ Modelo gemini-1.5-flash inicializado")
    
    print("   Enviando pregunta de prueba...")
    response = model.generate_content("¿Cuál es la capital de Ecuador?")
    
    if response and response.text:
        print("✅ Respuesta recibida:")
        print(f"   {response.text}")
    else:
        print("⚠️  Respuesta vacía")
        
except Exception as e:
    print(f"❌ Error con gemini-1.5-flash: {e}")
    print()
    
    # Test alternativo con gemini-1.5-pro
    print("Test 4b: Intentando con gemini-1.5-pro...")
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        print("✅ Modelo gemini-1.5-pro inicializado")
        
        print("   Enviando pregunta de prueba...")
        response = model.generate_content("¿Cuál es la capital de Ecuador?")
        
        if response and response.text:
            print("✅ Respuesta recibida:")
            print(f"   {response.text}")
        else:
            print("⚠️  Respuesta vacía")
            
    except Exception as e2:
        print(f"❌ Error con gemini-1.5-pro: {e2}")
        print()
        
        # Test alternativo con gemini-pro
        print("Test 4c: Intentando con gemini-pro...")
        try:
            model = genai.GenerativeModel("gemini-pro")
            print("✅ Modelo gemini-pro inicializado")
            
            print("   Enviando pregunta de prueba...")
            response = model.generate_content("¿Cuál es la capital de Ecuador?")
            
            if response and response.text:
                print("✅ Respuesta recibida:")
                print(f"   {response.text}")
            else:
                print("⚠️  Respuesta vacía")
                
        except Exception as e3:
            print(f"❌ Error con gemini-pro: {e3}")

print()

# Test 5: Probar contexto de Manta
print("Test 5: Probando con pregunta sobre Manta...")
try:
    # Usar el modelo que funcionó
    available_models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
    
    for model_name in available_models:
        try:
            model = genai.GenerativeModel(model_name)
            prompt = """
            Eres un experto en movilidad urbana de Manta, Ecuador.
            Pregunta: ¿Qué vía es más recomendable para ir de Tarqui al Centro?
            """
            
            response = model.generate_content(prompt)
            
            if response and response.text:
                print(f"✅ Modelo {model_name} funcionó correctamente")
                print(f"   Respuesta: {response.text[:200]}...")
                break
        except Exception as e:
            print(f"⚠️  {model_name} falló: {str(e)[:50]}...")
            continue
    
except Exception as e:
    print(f"❌ Error en test de Manta: {e}")

print()
print("=" * 70)
print("✅ DIAGNÓSTICO COMPLETADO")
print("=" * 70)
