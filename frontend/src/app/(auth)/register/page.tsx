"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    
    if (password !== confirmPassword) {
      setErr("Las contraseñas no coinciden");
      return;
    }
    
    if (password.length < 6) {
      setErr("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    setLoading(false);
    if (error) return setErr(error.message);
    setMsg("Registro exitoso. Revisa tu correo para confirmar la cuenta.");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-white border p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center">Crear Cuenta</h1>

        <div className="space-y-2">
          <label className="text-sm font-medium">Correo Electrónico</label>
          <input
            type="email"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contraseña</label>
          <input
            type="password"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirmar Contraseña</label>
          <input
            type="password"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        {err && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{err}</p>}
        {msg && <p className="text-green-600 text-sm bg-green-50 p-2 rounded">{msg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Creando cuenta..." : "Crear Cuenta"}
        </button>

        <p className="text-sm text-center">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 underline hover:text-blue-800">
            Inicia sesión
          </Link>
        </p>
      </form>
    </main>
  );
}