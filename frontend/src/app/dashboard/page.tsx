"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="p-6 space-y-4 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Dashboard
            </h1>
            
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                ¡Bienvenido a PrediRuta!
              </h2>
              <p className="text-blue-800 dark:text-blue-200">
                Sesión iniciada como: <strong>{user?.email || "Desconocido"}</strong>
              </p>
              {user?.user_metadata?.role && (
                <p className="text-blue-800 dark:text-blue-200 mt-1">
                  Rol: <strong>{user.user_metadata.role}</strong>
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={signOut}
                className="px-8 py-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}