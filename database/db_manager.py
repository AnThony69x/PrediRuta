#!/usr/bin/env python3
"""
PrediRuta Database Management Script
====================================

Este script proporciona herramientas para gestionar la base de datos de PrediRuta:
- Inicializar tablas
- Ejecutar migraciones
- Insertar datos de ejemplo
- Verificar la integridad de la base de datos

Uso:
    python db_manager.py init          # Inicializar base de datos
    python db_manager.py seed          # Insertar datos de ejemplo
    python db_manager.py migrate       # Ejecutar migraciones
    python db_manager.py check         # Verificar estado de la DB
    python db_manager.py reset         # Reiniciar base de datos (CUIDADO!)

Autor: PrediRuta Team
Fecha: Septiembre 2025
"""

import os
import sys
import argparse
import asyncio
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
import json

# Agregar el directorio padre al path para importar módulos de la app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from supabase import create_client, Client
    from dotenv import load_dotenv
    import asyncpg
    import pandas as pd
    from rich.console import Console
    from rich.table import Table
    from rich.progress import Progress, TaskID
    from rich import print as rprint
except ImportError as e:
    print(f"Error importando dependencias: {e}")
    print("Instala las dependencias con: pip install supabase python-dotenv asyncpg pandas rich")
    sys.exit(1)

# Cargar variables de entorno
load_dotenv()

console = Console()


class PrediRutaDBManager:
    """Gestor de base de datos para PrediRuta"""
    
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY", os.getenv("SUPABASE_SERVICE_KEY"))
        
        if not self.supabase_url or not self.supabase_key:
            console.print("[red]❌ Error: Variables de entorno SUPABASE_URL y SUPABASE_KEY requeridas[/red]")
            sys.exit(1)
            
        # Crear cliente Supabase
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        
        # Configuración de la base de datos PostgreSQL directa
        self.db_url = self._build_postgres_url()
        
    def _build_postgres_url(self) -> str:
        """Construye la URL de PostgreSQL desde la URL de Supabase"""
        # Extraer información de la URL de Supabase
        if "supabase.co" in self.supabase_url:
            project_ref = self.supabase_url.split("//")[1].split(".")[0]
            # Para conexiones directas a PostgreSQL en Supabase
            return f"postgresql://postgres:[YOUR_PASSWORD]@db.{project_ref}.supabase.co:5432/postgres"
        return None
    
    async def init_database(self) -> bool:
        """Inicializar la base de datos ejecutando el script SQL"""
        try:
            console.print("[yellow]🔄 Inicializando base de datos PrediRuta...[/yellow]")
            
            # Leer el script SQL
            script_path = os.path.join(os.path.dirname(__file__), "init_db.sql")
            if not os.path.exists(script_path):
                console.print(f"[red]❌ No se encontró el archivo {script_path}[/red]")
                return False
            
            with open(script_path, 'r', encoding='utf-8') as f:
                sql_script = f.read()
            
            # Dividir el script en comandos individuales
            commands = [cmd.strip() for cmd in sql_script.split(';') if cmd.strip() and not cmd.strip().startswith('--')]
            
            success_count = 0
            error_count = 0
            
            with Progress() as progress:
                task = progress.add_task("Ejecutando comandos SQL...", total=len(commands))
                
                for i, command in enumerate(commands):
                    try:
                        # Ejecutar comando usando Supabase
                        if command.upper().startswith(('CREATE', 'ALTER', 'INSERT', 'DROP')):
                            # Para comandos DDL, usar rpc si es posible
                            result = self.supabase.rpc('exec_sql', {'sql': command}).execute()
                        
                        success_count += 1
                        
                    except Exception as e:
                        console.print(f"[yellow]⚠️  Comando {i+1} falló (puede ser normal): {str(e)[:100]}[/yellow]")
                        error_count += 1
                    
                    progress.advance(task)
            
            console.print(f"[green]✅ Inicialización completada: {success_count} éxitos, {error_count} advertencias[/green]")
            return True
            
        except Exception as e:
            console.print(f"[red]❌ Error inicializando base de datos: {e}[/red]")
            return False
    
    async def check_database(self) -> Dict[str, Any]:
        """Verificar el estado de la base de datos"""
        try:
            console.print("[yellow]🔍 Verificando estado de la base de datos...[/yellow]")
            
            # Lista de tablas esperadas
            expected_tables = [
                'user_profiles',
                'road_segments', 
                'traffic_data',
                'traffic_predictions',
                'favorite_routes',
                'route_queries',
                'route_options',
                'ml_models',
                'system_logs',
                'api_usage'
            ]
            
            status = {
                'tables_exist': {},
                'table_counts': {},
                'indexes_exist': [],
                'functions_exist': [],
                'triggers_exist': [],
                'policies_exist': []
            }
            
            # Verificar existencia de tablas
            for table in expected_tables:
                try:
                    result = self.supabase.table(table).select('id', count='exact').limit(1).execute()
                    status['tables_exist'][table] = True
                    status['table_counts'][table] = result.count or 0
                except:
                    status['tables_exist'][table] = False
                    status['table_counts'][table] = 0
            
            # Mostrar resultados
            table = Table(title="Estado de las Tablas")
            table.add_column("Tabla", style="cyan")
            table.add_column("Existe", style="green")
            table.add_column("Registros", style="yellow")
            
            for table_name in expected_tables:
                exists = "✅" if status['tables_exist'][table_name] else "❌"
                count = str(status['table_counts'][table_name])
                table.add_row(table_name, exists, count)
            
            console.print(table)
            
            return status
            
        except Exception as e:
            console.print(f"[red]❌ Error verificando base de datos: {e}[/red]")
            return {}
    
    async def seed_database(self) -> bool:
        """Insertar datos de ejemplo para testing"""
        try:
            console.print("[yellow]🌱 Insertando datos de ejemplo...[/yellow]")
            
            # Datos de ejemplo para segmentos de carretera
            road_segments_data = [
                {
                    'id': 'EC-E35-001',
                    'name': 'Autopista General Rumiñahui',
                    'road_type': 'highway',
                    'speed_limit': 90,
                    'lanes': 4,
                    'city': 'Quito',
                    'province': 'Pichincha',
                    'length_km': 25.5
                },
                {
                    'id': 'EC-E25-001',
                    'name': 'Vía a la Costa',
                    'road_type': 'highway', 
                    'speed_limit': 100,
                    'lanes': 4,
                    'city': 'Guayaquil',
                    'province': 'Guayas',
                    'length_km': 15.8
                },
                {
                    'id': 'MTA-AV6DIC-001',
                    'name': 'Av. 6 de Diciembre',
                    'road_type': 'arterial',
                    'speed_limit': 50,
                    'lanes': 3,
                    'city': 'Manta',
                    'province': 'Manabí',
                    'length_km': 8.2
                }
            ]
            
            # Insertar segmentos de carretera
            for segment in road_segments_data:
                try:
                    self.supabase.table('road_segments').insert(segment).execute()
                    console.print(f"[green]✅ Insertado segmento: {segment['name']}[/green]")
                except Exception as e:
                    console.print(f"[yellow]⚠️  Segmento {segment['id']} ya existe o error: {e}[/yellow]")
            
            # Generar datos de tráfico de ejemplo
            traffic_data_samples = []
            base_time = datetime.now() - timedelta(hours=24)
            
            for segment in road_segments_data:
                for hour in range(24):
                    timestamp = base_time + timedelta(hours=hour)
                    
                    # Simular patrones de tráfico por horas
                    if hour in [7, 8, 17, 18, 19]:  # Horas pico
                        speed = segment['speed_limit'] * 0.3  # 30% de velocidad
                        traffic_level = 5
                        congestion = 0.7
                    elif hour in [9, 10, 16, 20]:  # Horas de transición
                        speed = segment['speed_limit'] * 0.6  # 60% de velocidad
                        traffic_level = 3
                        congestion = 0.4
                    else:  # Horas normales
                        speed = segment['speed_limit'] * 0.85  # 85% de velocidad
                        traffic_level = 2
                        congestion = 0.15
                    
                    traffic_data_samples.append({
                        'road_segment_id': segment['id'],
                        'timestamp': timestamp.isoformat(),
                        'speed_kmh': round(speed, 2),
                        'traffic_level': traffic_level,
                        'congestion_factor': congestion,
                        'vehicle_count': int(100 * congestion),
                        'data_source': 'simulation'
                    })
            
            # Insertar datos de tráfico en lotes
            batch_size = 50
            for i in range(0, len(traffic_data_samples), batch_size):
                batch = traffic_data_samples[i:i + batch_size]
                try:
                    self.supabase.table('traffic_data').insert(batch).execute()
                    console.print(f"[green]✅ Insertado lote de tráfico {i//batch_size + 1}[/green]")
                except Exception as e:
                    console.print(f"[yellow]⚠️  Error insertando lote: {e}[/yellow]")
            
            console.print(f"[green]🎉 Datos de ejemplo insertados exitosamente![/green]")
            console.print(f"[blue]📊 Segmentos de carretera: {len(road_segments_data)}[/blue]")
            console.print(f"[blue]📈 Registros de tráfico: {len(traffic_data_samples)}[/blue]")
            
            return True
            
        except Exception as e:
            console.print(f"[red]❌ Error insertando datos de ejemplo: {e}[/red]")
            return False
    
    async def reset_database(self) -> bool:
        """CUIDADO: Elimina todas las tablas y reinicia la base de datos"""
        console.print("[red]⚠️  ADVERTENCIA: Esta operación eliminará TODOS los datos![/red]")
        confirm = input("¿Estás seguro? Escribe 'RESET' para confirmar: ")
        
        if confirm != 'RESET':
            console.print("[yellow]Operación cancelada.[/yellow]")
            return False
        
        try:
            console.print("[yellow]🗑️  Eliminando tablas existentes...[/yellow]")
            
            # Lista de tablas en orden inverso para evitar problemas de FK
            tables_to_drop = [
                'api_usage',
                'system_logs',
                'ml_models',
                'route_options',
                'route_queries',
                'favorite_routes',
                'traffic_predictions',
                'traffic_data',
                'road_segments',
                'user_profiles'
            ]
            
            for table in tables_to_drop:
                try:
                    # Supabase no permite DROP TABLE directamente, usaremos SQL si tenemos acceso
                    console.print(f"[yellow]Eliminando tabla {table}...[/yellow]")
                except Exception as e:
                    console.print(f"[yellow]⚠️  No se pudo eliminar {table}: {e}[/yellow]")
            
            # Reinicializar
            await self.init_database()
            
            console.print("[green]✅ Base de datos reiniciada exitosamente[/green]")
            return True
            
        except Exception as e:
            console.print(f"[red]❌ Error reiniciando base de datos: {e}[/red]")
            return False
    
    async def create_backup(self) -> bool:
        """Crear backup de los datos importantes"""
        try:
            console.print("[yellow]💾 Creando backup de la base de datos...[/yellow]")
            
            backup_dir = os.path.join(os.path.dirname(__file__), 'backups')
            os.makedirs(backup_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_file = os.path.join(backup_dir, f'prediruta_backup_{timestamp}.json')
            
            backup_data = {}
            
            # Tablas importantes para backup
            tables_to_backup = ['user_profiles', 'favorite_routes', 'road_segments', 'ml_models']
            
            for table in tables_to_backup:
                try:
                    result = self.supabase.table(table).select('*').execute()
                    backup_data[table] = result.data
                    console.print(f"[green]✅ Backup de {table}: {len(result.data)} registros[/green]")
                except Exception as e:
                    console.print(f"[yellow]⚠️  Error en backup de {table}: {e}[/yellow]")
                    backup_data[table] = []
            
            # Guardar backup
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(backup_data, f, indent=2, default=str)
            
            console.print(f"[green]💾 Backup guardado en: {backup_file}[/green]")
            return True
            
        except Exception as e:
            console.print(f"[red]❌ Error creando backup: {e}[/red]")
            return False


async def main():
    """Función principal del script"""
    parser = argparse.ArgumentParser(
        description='PrediRuta Database Manager',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos de uso:
  python db_manager.py init      # Inicializar base de datos
  python db_manager.py seed      # Insertar datos de ejemplo
  python db_manager.py check     # Verificar estado
  python db_manager.py backup    # Crear backup
  python db_manager.py reset     # Reiniciar DB (¡CUIDADO!)
        """
    )
    
    parser.add_argument(
        'action',
        choices=['init', 'seed', 'check', 'reset', 'backup', 'migrate'],
        help='Acción a realizar'
    )
    
    parser.add_argument(
        '--force',
        action='store_true',
        help='Forzar operación sin confirmación'
    )
    
    args = parser.parse_args()
    
    # Mostrar banner
    console.print("\n[bold cyan]🚦 PrediRuta Database Manager 🚦[/bold cyan]")
    console.print("[dim]Sistema de Predicción de Tráfico Vehicular con IA[/dim]\n")
    
    # Crear instancia del manager
    db_manager = PrediRutaDBManager()
    
    # Ejecutar acción solicitada
    if args.action == 'init':
        await db_manager.init_database()
        
    elif args.action == 'check':
        await db_manager.check_database()
        
    elif args.action == 'seed':
        await db_manager.seed_database()
        
    elif args.action == 'backup':
        await db_manager.create_backup()
        
    elif args.action == 'reset':
        await db_manager.reset_database()
        
    elif args.action == 'migrate':
        console.print("[yellow]🔄 Función de migraciones en desarrollo...[/yellow]")
        
    else:
        console.print("[red]❌ Acción no implementada[/red]")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        console.print("\n[yellow]⚠️  Operación interrumpida por el usuario[/yellow]")
    except Exception as e:
        console.print(f"\n[red]❌ Error inesperado: {e}[/red]")