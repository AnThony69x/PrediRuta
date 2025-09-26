"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setErr(error.message);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-white border p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center">Iniciar Sesión</h1>

        <div className="space-y-2">
          <label className="text-sm">Correo</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Contraseña</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded py-2"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-sm text-center">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-blue-600 underline">
            Regístrate
          </Link>
        </p>
      </form>
    </main>
  );
}