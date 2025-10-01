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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Card de Predicciones */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Predicciones</h3>
                    <p className="text-blue-100">Predice el tráfico</p>
                  </div>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 bg-white/20 border-white/30 text-white hover:bg-white/30"
                  onClick={() => window.location.href = "/predicciones"}
                >
                  Ir a Predicciones
                </Button>
              </div>

              {/* Card de Rutas */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Rutas</h3>
                    <p className="text-green-100">Optimiza tus rutas</p>
                  </div>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 bg-white/20 border-white/30 text-white hover:bg-white/30"
                  onClick={() => window.location.href = "/rutas"}
                >
                  Gestionar Rutas
                </Button>
              </div>

              {/* Card de Perfil */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Perfil</h3>
                    <p className="text-purple-100">Configura tu cuenta</p>
                  </div>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 bg-white/20 border-white/30 text-white hover:bg-white/30"
                  onClick={() => window.location.href = "/profile"}
                >
                  Ver Perfil
                </Button>
              </div>
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