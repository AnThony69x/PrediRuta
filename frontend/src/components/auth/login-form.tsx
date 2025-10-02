"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Verificar si hay un mensaje de registro exitoso
  useEffect(() => {
    const registrationMessage = sessionStorage.getItem('registrationSuccess');
    if (registrationMessage) {
      setSuccessMsg(registrationMessage);
      // Limpiar el mensaje del sessionStorage después de mostrarlo
      sessionStorage.removeItem('registrationSuccess');
    }
  }, []);

  // Función para validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    // Validar email
    if (!validateEmail(email)) {
      setErr("Por favor ingresa un correo electrónico válido");
      return;
    }

    // Validar contraseña
    if (!password.trim()) {
      setErr("La contraseña es requerida");
      return;
    }

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
      {successMsg && <Alert type="success">{successMsg}</Alert>}
      <Input
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        placeholder="tu-email@ejemplo.com"
      />
      <PasswordInput
        label="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        placeholder="Ingresa tu contraseña"
      />
      <Button loading={loading} full type="submit">
        Iniciar sesión
      </Button>
      <Separator label="o" />
      <OAuthButton provider="google" full />
      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
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