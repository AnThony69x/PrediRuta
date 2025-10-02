"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { OAuthButton } from "@/components/ui/oauth-button";
import { Separator } from "@/components/ui/separator";
import { PasswordStrength } from "@/components/ui/password-strength";
import { PasswordMatch } from "@/components/ui/password-match";
import { EmailValidation } from "@/components/ui/email-validation";
import { NameValidation } from "@/components/ui/name-validation";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const RegisterForm = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Función para validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar contraseña
  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: "La contraseña debe tener mínimo 8 caracteres" };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: "La contraseña debe contener al menos una letra minúscula" };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: "La contraseña debe contener al menos una letra mayúscula" };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: "La contraseña debe contener al menos un número" };
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return { isValid: false, message: "La contraseña debe contener al menos un carácter especial (@$!%*?&)" };
    }
    return { isValid: true };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    // Validar nombre completo
    if (!fullName.trim()) {
      setErr("El nombre completo es requerido");
      return;
    }
    if (fullName.trim().length < 2) {
      setErr("El nombre debe tener al menos 2 caracteres");
      return;
    }

    // Validar email
    if (!validateEmail(email)) {
      setErr("Por favor ingresa un correo electrónico válido");
      return;
    }

    // Validar contraseña
    const passwordValidation = validatePassword(pass1);
    if (!passwordValidation.isValid) {
      setErr(passwordValidation.message || "Contraseña inválida");
      return;
    }

    // Verificar que las contraseñas coincidan
    if (pass1 !== pass2) {
      setErr("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: pass1,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: fullName.trim(),
          display_name: fullName.trim()
        }
      }
    });
    setLoading(false);
    if (error) return setErr(error.message);
    
    // Mostrar mensaje de éxito
    setMsg("Registro exitoso. Revisa tu correo y confirma para continuar.");
    
    // Esperar 3 segundos y luego redireccionar al login con el mensaje
    setTimeout(() => {
      // Guardar el mensaje en sessionStorage para mostrarlo en el login
      sessionStorage.setItem('registrationSuccess', 'Registro exitoso. Revisa tu correo y confirma para continuar.');
      router.push('/login');
    }, 3000); // Espera 3 segundos antes de redireccionar
  };

  // Verificar si el formulario es válido para habilitar el botón
  const isFormValid = () => {
    const trimmedName = fullName.trim();
    const nameValid = trimmedName.length >= 2 && /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(trimmedName);
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(pass1).isValid;
    const passwordsMatch = pass1 === pass2 && pass2.length > 0;
    
    return nameValid && emailValid && passwordValid && passwordsMatch;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {err && <Alert type="error">{err}</Alert>}
      {msg && <Alert type="success">{msg}</Alert>}
      <div className="space-y-3">
        <Input
          label="Nombre completo"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
          placeholder="Ej: Juan Pérez"
        />
        <NameValidation name={fullName} />
      </div>
      <div className="space-y-3">
        <Input
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="tu-email@ejemplo.com"
        />
        <EmailValidation email={email} />
      </div>
      <div className="space-y-3">
        <PasswordInput
          label="Contraseña"
          value={pass1}
          onChange={(e) => setPass1(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Crea una contraseña segura"
        />
        <PasswordStrength password={pass1} />
      </div>
      <div className="space-y-3">
        <PasswordInput
          label="Confirmar contraseña"
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Confirma tu contraseña"
        />
        <PasswordMatch password={pass1} confirmPassword={pass2} />
      </div>
      <Button 
        loading={loading} 
        full 
        type="submit"
      >
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