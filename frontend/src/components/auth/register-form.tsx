"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { OAuthButton } from "@/components/ui/oauth-button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (pass1 !== pass2) {
      setErr("Las contraseñas no coinciden");
      return;
    }
    if (pass1.length < 6) {
      setErr("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: pass1,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    setLoading(false);
    if (error) return setErr(error.message);
    setMsg(
      "Registro exitoso. Revisa tu correo y confirma para continuar."
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {err && <Alert type="error">{err}</Alert>}
      {msg && <Alert type="success">{msg}</Alert>}
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
        value={pass1}
        onChange={(e) => setPass1(e.target.value)}
        required
        minLength={6}
        autoComplete="new-password"
      />
      <Input
        label="Confirmar contraseña"
        type="password"
        value={pass2}
        onChange={(e) => setPass2(e.target.value)}
        required
        minLength={6}
        autoComplete="new-password"
      />
      <Button loading={loading} full type="submit">
        Crear cuenta
      </Button>
      <Separator label="o" />
      <OAuthButton provider="google" full />
      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        ¿Ya tienes cuenta?{" "}
        <Link
          className="text-blue-600 hover:underline dark:text-blue-400"
          href="/login"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
};