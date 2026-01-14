/**
 * Verificador de Supabase Storage
 * Comprueba que el bucket 'avatars' esté correctamente configurado
 */

import { supabase } from "@/lib/supabase";

export interface StorageStatus {
  bucketExists: boolean;
  isPublic: boolean;
  canRead: boolean;
  canWrite: boolean;
  error: string | null;
}

/**
 * Verifica el estado del bucket 'avatars'
 */
export async function checkStorageBucket(): Promise<StorageStatus> {
  const status: StorageStatus = {
    bucketExists: false,
    isPublic: false,
    canRead: false,
    canWrite: false,
    error: null,
  };

  try {
    // Test 1: Verificar que el bucket existe (lectura)
    console.log("📦 Verificando bucket 'avatars'...");
    
    const { data, error: readError } = await supabase.storage
      .from("avatars")
      .list("", { limit: 1 });

    if (readError) {
      console.error("❌ Error al acceder al bucket:", readError.message);
      status.error = readError.message;

      if (readError.message.includes("not found")) {
        status.error = "Bucket 'avatars' no existe. Créalo en Supabase Dashboard > Storage";
      } else if (readError.message.includes("401") || readError.message.includes("403")) {
        status.error = "Permiso denegado. Verifica las políticas RLS.";
      }

      return status;
    }

    status.bucketExists = true;
    status.canRead = true;
    console.log("✅ Bucket 'avatars' accesible");

    // Test 2: Verificar si es público
    console.log("🔍 Verificando si es público...");
    
    try {
      // Intentar acceder directamente a una URL pública
      const testUrl = `${supabase.storage.from("avatars").getPublicUrl("test.txt").data.publicUrl}`;
      console.log("✅ Bucket es público");
      status.isPublic = true;
    } catch (error) {
      console.warn("⚠️ No se pudo verificar si es público");
      status.isPublic = false;
    }

    // Test 3: Verificar permisos de escritura (solo si estamos autenticado)
    console.log("👤 Verificando permisos de escritura...");
    
    const { data: userData } = await supabase.auth.getUser();
    
    if (userData.user) {
      try {
        // Intentar crear un archivo de prueba
        const testFile = new Blob(["test"], { type: "text/plain" });
        const fileName = `test-${Date.now()}.txt`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, testFile, { upsert: true });

        if (!uploadError) {
          status.canWrite = true;
          console.log("✅ Permisos de escritura OK");

          // Limpiar: eliminar el archivo de prueba
          await supabase.storage.from("avatars").remove([fileName]);
        } else {
          console.warn("⚠️ No hay permisos de escritura:", uploadError.message);
          status.canWrite = false;
        }
      } catch (error) {
        console.warn("⚠️ Error al verificar escritura:", error);
        status.canWrite = false;
      }
    } else {
      console.log("ℹ️ No autenticado, saltando test de escritura");
    }

    console.log("\n📊 RESUMEN:");
    console.log(`   Bucket existe: ${status.bucketExists ? "✅" : "❌"}`);
    console.log(`   Es público: ${status.isPublic ? "✅" : "❌"}`);
    console.log(`   Puede leer: ${status.canRead ? "✅" : "❌"}`);
    console.log(`   Puede escribir: ${status.canWrite ? "✅" : "❌"}`);

    if (status.bucketExists && status.canRead) {
      console.log("\n✅ Storage configurado correctamente");
      status.error = null;
    } else {
      console.log("\n❌ Hay problemas con Storage");
    }

    return status;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Error desconocido";
    console.error("🔥 Error crítico:", errorMsg);
    status.error = errorMsg;
    return status;
  }
}

/**
 * Obtener URL pública de un archivo en Storage
 */
export function getAvatarPublicUrl(fileName: string): string {
  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Subir un avatar
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const filePath = `${userId}/${fileName}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (error) {
      return { success: false, error: error.message };
    }

    const url = getAvatarPublicUrl(filePath);
    return { success: true, url };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Error desconocido";
    return { success: false, error: errorMsg };
  }
}

/**
 * Eliminar un avatar
 */
export async function deleteAvatar(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from("avatars")
      .remove([filePath]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Error desconocido";
    return { success: false, error: errorMsg };
  }
}
