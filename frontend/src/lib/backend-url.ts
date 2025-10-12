// Utilidad para obtener y normalizar la URL del backend desde variables de entorno
// Corrige casos comunes como valores ":8000" o sin protocolo

export function normalizeBackendUrl(raw?: string): string {
  let url = (raw || "").trim();
  if (!url) return "http://localhost:8000";

  // Si empieza con ":8000" o solo puerto, anteponer localhost
  if (/^:\d+/.test(url)) {
    url = `http://localhost${url}`;
  }

  // Si no tiene protocolo, añadir http://
  if (!/^https?:\/\//i.test(url)) {
    url = `http://${url}`;
  }

  // Quitar barra final
  url = url.replace(/\/$/, "");
  return url;
}

export function getBackendUrl(): string {
  const env = (process.env.NEXT_PUBLIC_BACKEND_API_URL || "").trim();
  const normalized = normalizeBackendUrl(env);
  return normalized || "http://localhost:8000";
}
