"""
Test para verificar las variables de entorno del frontend
"""
import os
import sys
from pathlib import Path

# Colores para la terminal
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def load_env_file(file_path):
    """Carga variables de un archivo .env"""
    env_vars = {}
    if not os.path.exists(file_path):
        return env_vars
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            # Ignorar comentarios y líneas vacías
            if line and not line.startswith('#'):
                if '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
    return env_vars

def check_url_format(url, name):
    """Verifica el formato de una URL"""
    if not url:
        return False, "vacía"
    
    if url.startswith('http://localhost') or url.startswith('https://'):
        return True, "válida"
    
    return False, "formato inválido"

def test_frontend_env():
    """Test principal de variables de entorno del frontend"""
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}🧪 TEST DE VARIABLES DE ENTORNO - FRONTEND{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    # Buscar el archivo .env.local del frontend
    frontend_dir = Path(__file__).parent.parent / 'frontend'
    env_local_path = frontend_dir / '.env.local'
    env_production_path = frontend_dir / '.env.production'
    
    # Variables requeridas
    required_vars = {
        'NEXT_PUBLIC_SUPABASE_URL': 'URL de Supabase',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'API Key de Supabase',
        'NEXT_PUBLIC_GOOGLE_CLIENT_ID': 'Google OAuth Client ID',
        'NEXT_PUBLIC_BACKEND_API_URL': 'URL del Backend API',
        'NEXT_PUBLIC_CHATAGENT_URL': 'URL del ChatAgent',
        'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN': 'Token de Mapbox',
        'NEXT_PUBLIC_MAPBOX_STYLE': 'Estilo de Mapbox',
        'NEXT_PUBLIC_MAP_PROVIDER': 'Proveedor del mapa',
        'NEXT_PUBLIC_SITE_URL': 'URL del sitio',
        'NEXT_PUBLIC_APP_URL': 'URL de la aplicación',
    }
    
    # URLs que deben validarse
    url_vars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_BACKEND_API_URL',
        'NEXT_PUBLIC_CHATAGENT_URL',
        'NEXT_PUBLIC_SITE_URL',
        'NEXT_PUBLIC_APP_URL',
    ]
    
    results = {
        'local': {'passed': 0, 'failed': 0, 'warnings': 0},
        'production': {'passed': 0, 'failed': 0, 'warnings': 0}
    }
    
    # Test .env.local
    print(f"{YELLOW}📄 Verificando .env.local{RESET}")
    print(f"   Ruta: {env_local_path}\n")
    
    if not env_local_path.exists():
        print(f"{RED}❌ Archivo .env.local no encontrado{RESET}\n")
        results['local']['failed'] += 1
    else:
        env_local = load_env_file(env_local_path)
        
        for var_name, description in required_vars.items():
            value = env_local.get(var_name)
            
            if not value:
                print(f"{RED}❌ {var_name}{RESET}")
                print(f"   {description}: No definida")
                results['local']['failed'] += 1
            else:
                # Validar URLs
                if var_name in url_vars:
                    is_valid, status = check_url_format(value, var_name)
                    if is_valid:
                        print(f"{GREEN}✅ {var_name}{RESET}")
                        print(f"   {description}: {value}")
                        results['local']['passed'] += 1
                    else:
                        print(f"{RED}❌ {var_name}{RESET}")
                        print(f"   {description}: {value} ({status})")
                        results['local']['failed'] += 1
                else:
                    # Validar longitud mínima para tokens
                    if 'KEY' in var_name or 'TOKEN' in var_name:
                        if len(value) < 20:
                            print(f"{YELLOW}⚠️  {var_name}{RESET}")
                            print(f"   {description}: Token muy corto ({len(value)} caracteres)")
                            results['local']['warnings'] += 1
                        else:
                            print(f"{GREEN}✅ {var_name}{RESET}")
                            print(f"   {description}: {'*' * 20}... ({len(value)} caracteres)")
                            results['local']['passed'] += 1
                    else:
                        print(f"{GREEN}✅ {var_name}{RESET}")
                        print(f"   {description}: {value}")
                        results['local']['passed'] += 1
    
    print(f"\n{YELLOW}📄 Verificando .env.production{RESET}")
    print(f"   Ruta: {env_production_path}\n")
    
    if not env_production_path.exists():
        print(f"{YELLOW}⚠️  Archivo .env.production no encontrado (opcional){RESET}\n")
        results['production']['warnings'] += 1
    else:
        env_production = load_env_file(env_production_path)
        
        # Verificar variables críticas en producción
        production_critical = [
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            'NEXT_PUBLIC_BACKEND_API_URL',
            'NEXT_PUBLIC_CHATAGENT_URL',
            'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN'
        ]
        
        for var_name in production_critical:
            value = env_production.get(var_name)
            description = required_vars[var_name]
            
            if not value:
                print(f"{RED}❌ {var_name}{RESET}")
                print(f"   {description}: No definida")
                results['production']['failed'] += 1
            else:
                # Verificar que NO use localhost en producción
                if 'localhost' in value.lower():
                    print(f"{RED}❌ {var_name}{RESET}")
                    print(f"   {description}: Usa localhost en producción!")
                    results['production']['failed'] += 1
                else:
                    print(f"{GREEN}✅ {var_name}{RESET}")
                    if var_name in url_vars:
                        print(f"   {description}: {value}")
                    else:
                        print(f"   {description}: {'*' * 20}...")
                    results['production']['passed'] += 1
    
    # Resumen final
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}📊 RESUMEN DE RESULTADOS{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    print(f"{YELLOW}🔧 Entorno Local (.env.local):{RESET}")
    print(f"   {GREEN}✅ Pasaron: {results['local']['passed']}{RESET}")
    print(f"   {RED}❌ Fallaron: {results['local']['failed']}{RESET}")
    print(f"   {YELLOW}⚠️  Advertencias: {results['local']['warnings']}{RESET}\n")
    
    print(f"{YELLOW}🚀 Entorno Producción (.env.production):{RESET}")
    print(f"   {GREEN}✅ Pasaron: {results['production']['passed']}{RESET}")
    print(f"   {RED}❌ Fallaron: {results['production']['failed']}{RESET}")
    print(f"   {YELLOW}⚠️  Advertencias: {results['production']['warnings']}{RESET}\n")
    
    # Determinar resultado final
    total_failed = results['local']['failed'] + results['production']['failed']
    
    if total_failed == 0:
        print(f"{GREEN}{'='*60}")
        print(f"✅ TODOS LOS TESTS PASARON CORRECTAMENTE")
        print(f"{'='*60}{RESET}\n")
        return 0
    else:
        print(f"{RED}{'='*60}")
        print(f"❌ TESTS FALLIDOS: {total_failed}")
        print(f"{'='*60}{RESET}\n")
        return 1

if __name__ == '__main__':
    exit_code = test_frontend_env()
    sys.exit(exit_code)
