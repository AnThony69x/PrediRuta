/**
 * Componente: Estado del Storage
 * Muestra si el bucket 'avatars' está configurado correctamente
 */

"use client";

import { useEffect, useState } from "react";
import { checkStorageBucket, type StorageStatus } from "@/lib/storage-utils";

export const StorageStatusIndicator = () => {
  const [status, setStatus] = useState<StorageStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStorage = async () => {
      setLoading(true);
      const result = await checkStorageBucket();
      setStatus(result);
      setLoading(false);
    };

    checkStorage();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm text-slate-600 dark:text-slate-400">
        🔍 Verificando Storage...
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const allOk =
    status.bucketExists && status.canRead && status.isPublic;

  if (allOk && process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div
      className={`p-4 rounded-lg border ${
        allOk
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-xl">{allOk ? "✅" : "❌"}</div>
        <div className="flex-1">
          <h3 className={`font-semibold mb-2 ${
            allOk
              ? "text-green-900 dark:text-green-100"
              : "text-red-900 dark:text-red-100"
          }`}>
            {allOk ? "Storage Configurado" : "Storage No Configurado"}
          </h3>

          <div className="space-y-1 text-sm">
            <div className={allOk ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}>
              <span>{status.bucketExists ? "✅" : "❌"}</span> Bucket 'avatars' existe
            </div>
            <div className={allOk ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}>
              <span>{status.isPublic ? "✅" : "❌"}</span> Es público
            </div>
            <div className={allOk ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}>
              <span>{status.canRead ? "✅" : "❌"}</span> Puede leer
            </div>
            <div className={allOk ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}>
              <span>{status.canWrite ? "✅" : "❌"}</span> Puede escribir
            </div>
          </div>

          {status.error && (
            <p className="mt-3 text-sm text-red-700 dark:text-red-300 font-mono bg-red-100 dark:bg-red-900/30 p-2 rounded">
              {status.error}
            </p>
          )}

          {!allOk && (
            <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-900 dark:text-white mb-2">
                🔧 Solución:
              </p>
              <ol className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-decimal list-inside">
                <li>Ve a Supabase Dashboard → Storage</li>
                <li>Crea un nuevo bucket llamado "avatars"</li>
                <li>Marca "Make it public"</li>
                <li>Configura políticas RLS para permitir lectura/escritura</li>
                <li>Recarga esta página</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
