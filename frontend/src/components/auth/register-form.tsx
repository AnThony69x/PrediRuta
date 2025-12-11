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
import { useToast } from "@/components/ui/toaster";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const RegisterForm = () => {
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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
      return { isValid: false, message: t('auth.passwordMinLength') };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: t('auth.passwordLowercase') };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: t('auth.passwordUppercase') };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: t('auth.passwordNumber') };
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return { isValid: false, message: t('auth.passwordSpecialChar') };
    }
    return { isValid: true };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    // Validar nombre completo
    if (!fullName.trim()) {
      setErr(t('auth.fullNameRequired'));
      toast.warning(t('auth.nameRequired'), t('auth.nameRequiredMessage'));
      return;
    }
    if (fullName.trim().length < 2) {
      setErr(t('auth.fullNameTooShort'));
      toast.warning(t('auth.nameTooShort'), t('auth.nameTooShortMessage'));
      return;
    }

    // Validar email
    if (!validateEmail(email)) {
      setErr(t('auth.invalidEmail'));
      toast.warning(t('auth.emailInvalid'), t('auth.emailInvalidMessage'));
      return;
    }

    // Validar contraseña
    const passwordValidation = validatePassword(pass1);
    if (!passwordValidation.isValid) {
      setErr(passwordValidation.message || t('auth.invalidEmail'));
      toast.warning(t('auth.passwordWeak'), passwordValidation.message || t('auth.passwordWeakMessage'));
      return;
    }

    // Verificar que las contraseñas coincidan
    if (pass1 !== pass2) {
      setErr(t('auth.passwordsNoMatch'));
      toast.error(t('auth.passwordsNoMatch'), t('auth.passwordsNoMatchMessage'));
      return;
    }

    // Validar aceptación de términos
    if (!acceptedTerms) {
      setErr(t('auth.termsNotAccepted'));
      toast.warning(t('auth.termsNotAcceptedTitle'), t('auth.termsNotAcceptedMessage'));
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
    if (error) {
      setErr(error.message);
      toast.error(t('auth.registrationError'), error.message);
      return;
    }
    
    // Mostrar mensaje de éxito
    setMsg(t('auth.checkEmailAndConfirm'));
    toast.success(t('auth.registrationSuccessTitle'), t('auth.registrationSuccessFullMessage'));
    
    // Esperar 3 segundos y luego redireccionar al login con el mensaje
    setTimeout(() => {
      // Guardar el mensaje en sessionStorage para mostrarlo en el login
      sessionStorage.setItem('registrationSuccess', t('auth.checkEmailAndConfirm'));
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
    
    return nameValid && emailValid && passwordValid && passwordsMatch && acceptedTerms;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {err && <Alert type="error">{err}</Alert>}
      {msg && <Alert type="success">{msg}</Alert>}
      <div className="space-y-3">
        <Input
          label={t('auth.fullName')}
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
          placeholder={t('auth.fullNamePlaceholder')}
        />
        <NameValidation name={fullName} />
      </div>
      <div className="space-y-3">
        <Input
          label={t('auth.email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder={t('auth.emailPlaceholder')}
        />
        <EmailValidation email={email} />
      </div>
      <div className="space-y-3">
        <PasswordInput
          label={t('auth.password')}
          value={pass1}
          onChange={(e) => setPass1(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder={t('auth.createPasswordPlaceholder')}
        />
        <PasswordStrength password={pass1} />
      </div>
      <div className="space-y-3">
        <PasswordInput
          label={t('auth.confirmPassword')}
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder={t('auth.confirmPasswordPlaceholder')}
        />
        <PasswordMatch password={pass1} confirmPassword={pass2} />
      </div>
      
      {/* Checkbox de términos y condiciones */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          required
        />
        <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
          {t('auth.acceptTerms')}{" "}
          <Link
            href="/terminos-y-condiciones"
            target="_blank"
            className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
          >
            {t('auth.termsAndConditions')}
          </Link>
          {" "}{t('auth.and')}{" "}
          <Link
            href="/politica-privacidad"
            target="_blank"
            className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
          >
            {t('auth.privacyPolicy')}
          </Link>
        </label>
      </div>
      
      <Button 
        loading={loading} 
        full 
        type="submit"
        disabled={!isFormValid()}
      >
        {t('auth.createAccountButton')}
      </Button>
      <Separator label={t('auth.orContinueWith')} />
      <OAuthButton provider="google" full />
      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        {t('auth.alreadyHaveAccount')}{" "}
        <Link
          className="text-blue-600 hover:underline dark:text-blue-400"
          href="/login"
        >
          {t('auth.signInLink')}
        </Link>
      </p>
    </form>
  );
};