"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { OAuthButton } from "@/components/ui/oauth-button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (error) return setErr(error.message);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {err && <Alert type="error">{err}</Alert>}
      <Input
        label="Correo"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      <Button loading={loading} full type="submit">
        Iniciar sesión
      </Button>
      <Separator label="o" />
      <OAuthButton provider="google" full />
      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        ¿No tienes cuenta?{" "}
        <Link
          className="text-blue-600 hover:underline dark:text-blue-400"
          href="/register"
        >
          Regístrate
        </Link>
      </p>
    </form>
  );
};