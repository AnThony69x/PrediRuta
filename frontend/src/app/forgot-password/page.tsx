"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailExists = async (email: string) => {
    try {
      // Intentar hacer un reset password - Supabase no revelará si el email existe o no
      // pero podemos hacer una validación básica
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      // Supabase siempre retorna éxito por seguridad, incluso si el email no existe
      // Esto previene ataques de enumeración de usuarios
      return { exists: true, error: null };
    } catch (err) {
      return { exists: false, error: "Error verificando el email" };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setChecking(true);
    setError("");
    setMessage("");

    // Validar formato del email
    if (!validateEmail(email)) {
      setError("Por favor ingresa un email válido");
      setLoading(false);
      setChecking(false);
      return;
    }

    try {
      // Verificar y enviar email de recuperación
      const { exists, error: checkError } = await checkEmailExists(email);
      
      if (checkError) {
        setError(checkError);
      } else {
        setEmailSent(true);
        setMessage("Te hemos enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada y spam.");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 p-8 rounded-2xl shadow-2xl border border-emerald-200 dark:border-gray-700 w-full max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">📧</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-4">
              Email Enviado
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {message}
            </p>
            <div className="space-y-4">
              <Link
                href="/login"
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-block text-center"
              >
                Volver al Login
              </Link>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                  setMessage("");
                }}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
              >
                Enviar otro email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 p-8 rounded-2xl shadow-2xl border border-emerald-200 dark:border-gray-700 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            No te preocupes, te ayudamos a recuperarla
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-emerald-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              placeholder="tu@email.com"
            />
          </div>

          {checking && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
                <div className="text-blue-700 dark:text-blue-400 text-sm">
                  Verificando email...
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <span className="text-red-400 mr-3">⚠️</span>
                <div className="text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              </div>
            </div>
          )}

          {message && !emailSent && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
              <div className="flex">
                <span className="text-emerald-400 mr-3">✅</span>
                <div className="text-emerald-700 dark:text-emerald-400 text-sm">
                  {message}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || checking}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              "Enviar enlace de recuperación"
            )}
          </button>
        </form>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <h3 className="text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Instrucciones:
          </h3>
          <ul className="text-sm text-emerald-800 dark:text-emerald-200 space-y-1">
            <li>• Ingresa el email de tu cuenta</li>
            <li>• Recibirás un enlace de recuperación</li>
            <li>• Haz clic en el enlace del email</li>
            <li>• Crea una nueva contraseña</li>
          </ul>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            ¿Recordaste tu contraseña?{" "}
            <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
              Iniciar sesión
            </Link>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium">
              Regístrate aquí
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/" 
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}