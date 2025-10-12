import os
from typing import Optional

from supabase import create_client, Client

_supabase_client: Optional[Client] = None


def get_supabase() -> Client:
	global _supabase_client
	if _supabase_client is not None:
		return _supabase_client

	url = os.getenv("SUPABASE_URL")
	service_key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")
	if not url or not service_key:
		raise RuntimeError("Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en el entorno")

	_supabase_client = create_client(url, service_key)
	return _supabase_client

