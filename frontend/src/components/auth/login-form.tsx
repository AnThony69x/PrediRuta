"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { OAuthButton } from "@/components/ui/oauth-button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { FieldHelper } from "@/components/ui/field-helper";
import { HelpPanel } from "@/components/ui/help-panel";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

export const LoginForm = () => {
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estados para el bloqueo de seguridad
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  
  // Refs para evitar múltiples notificaciones
  const hasShownLockNotification = useRef(false);
  const hasShownUnlockNotification = useRef(false);

  // Verificar si hay un mensaje de registro exitoso y estado de bloqueo
  useEffect(() => {
    const registrationMessage = sessionStorage.getItem('registrationSuccess');
    if (registrationMessage) {
      setSuccessMsg(registrationMessage);
      toast.success(t('auth.registrationSuccess'), registrationMessage);
      // Limpiar el mensaje del sessionStorage después de mostrarlo
      sessionStorage.removeItem('registrationSuccess');
    }

    // Verificar si hay un bloqueo activo en localStorage
    const storedLockoutEnd = localStorage.getItem('loginLockoutEnd');
    const storedAttempts = localStorage.getItem('loginFailedAttempts');
    
    if (storedAttempts) {
      setFailedAttempts(parseInt(storedAttempts, 10));
    }

    if (storedLockoutEnd) {
      const lockoutEnd = parseInt(storedLockoutEnd, 10);
      const now = Date.now();
      
      if (lockoutEnd > now) {
        setIsLocked(true);
        setLockoutEndTime(lockoutEnd);
        setRemainingTime(Math.ceil((lockoutEnd - now) / 1000));
        
        // Mostrar notificación solo una vez
        if (!hasShownLockNotification.current) {
          hasShownLockNotification.current = true;
          const minutes = Math.ceil((lockoutEnd - now) / 60000);
          const message = t('auth.accountLockedMessage').replace('{attempts}', MAX_ATTEMPTS.toString());
          toast.security(t('auth.accountLockedTitle'), `${message} ${t('auth.timeRemaining').replace('{time}', minutes.toString())}`);
        }
      } else {
        // El bloqueo ha expirado, limpiar
        localStorage.removeItem('loginLockoutEnd');
        localStorage.removeItem('loginFailedAttempts');
      }
    }
  }, [toast, t]);

  // Temporizador para el desbloqueo
  useEffect(() => {
    if (!isLocked || !lockoutEndTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeLeft = Math.ceil((lockoutEndTime - now) / 1000);

      if (timeLeft <= 0) {
        // Desbloquear
        setIsLocked(false);
        setFailedAttempts(0);
        setLockoutEndTime(null);
        setRemainingTime(0);
        localStorage.removeItem('loginLockoutEnd');
        localStorage.removeItem('loginFailedAttempts');
        setErr(null);
        
        // Mostrar notificación de desbloqueo solo una vez
        if (!hasShownUnlockNotification.current) {
          hasShownUnlockNotification.current = true;
          toast.info(t('auth.accountUnlocked'), t('auth.accountUnlockedMessage'));
        }
        
        // Resetear flags para el próximo bloqueo
        hasShownLockNotification.current = false;
      } else {
        setRemainingTime(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, lockoutEndTime, toast]);

  // Función para validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    // Verificar si está bloqueado
    if (isLocked) {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      const timeMessage = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      const errorMessage = t('auth.accountLockedWait').replace('{time}', timeMessage);
      setErr(errorMessage);
      toast.security(t('auth.accountLockedTitle'), errorMessage);
      return;
    }

    // Validar email
    if (!validateEmail(email)) {
      setErr(t('auth.invalidEmail'));
      toast.warning(t('auth.emailInvalid'), t('auth.emailInvalidMessage'));
      return;
    }

    // Validar contraseña
    if (!password.trim()) {
      setErr(t('auth.passwordRequired'));
      toast.warning(t('auth.passwordRequired'), t('auth.passwordRequiredMessage'));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    
    if (error) {
      // Incrementar intentos fallidos
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      localStorage.setItem('loginFailedAttempts', newFailedAttempts.toString());

      if (newFailedAttempts >= MAX_ATTEMPTS) {
        // Bloquear cuenta
        const lockoutEnd = Date.now() + LOCKOUT_DURATION;
        setIsLocked(true);
        setLockoutEndTime(lockoutEnd);
        setRemainingTime(Math.ceil(LOCKOUT_DURATION / 1000));
        localStorage.setItem('loginLockoutEnd', lockoutEnd.toString());
        const errorMessage = t('auth.tooManyAttempts');
        setErr(errorMessage);
        toast.security(t('auth.accountLockedTitle'), errorMessage);
      } else {
        const attemptsLeft = MAX_ATTEMPTS - newFailedAttempts;
        const errorMessage = t('auth.invalidCredentials').replace('{attempts}', attemptsLeft.toString());
        setErr(errorMessage);
        toast.error(t('auth.loginFailed'), errorMessage);
      }
      return;
    }
    
    // Login exitoso, limpiar intentos fallidos
    setFailedAttempts(0);
    localStorage.removeItem('loginFailedAttempts');
    localStorage.removeItem('loginLockoutEnd');
    toast.success(t('auth.loginSuccess'), t('auth.loginSuccessMessage'));
    router.push("/dashboard");
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5">
        {err && <Alert type="error">{err}</Alert>}
        {successMsg && <Alert type="success">{successMsg}</Alert>}
        
        {/* Alerta de bloqueo */}
        {isLocked && (
          <Alert type="error">
            <div className="flex flex-col gap-2">
              <p className="font-semibold">{t('auth.accountLockedTitle')}</p>
              <p className="text-sm">
                {t('auth.accountLockedMessage').replace('{attempts}', MAX_ATTEMPTS.toString())}
              </p>
              <p className="text-sm font-medium">
                {t('auth.timeRemaining').replace('{time}', `${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}`)}
              </p>
            </div>
          </Alert>
        )}

        {/* Campo de email con tooltip de ayuda */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t('auth.email')}
            </label>
            <Tooltip content={t('auth.emailTooltip')} position="right" />
          </div>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder={t('auth.emailPlaceholder')}
            disabled={isLocked}
          />
          {!email && (
            <FieldHelper type="info">
              {t('auth.emailHelper')}
            </FieldHelper>
          )}
        </div>

        {/* Campo de contraseña con tooltip de ayuda */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t('auth.password')}
            </label>
            <Tooltip content={t('auth.passwordTooltip')} position="right" />
          </div>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder={t('auth.passwordPlaceholder')}
            disabled={isLocked}
          />
          {failedAttempts > 0 && !isLocked && (
            <FieldHelper type="error">
              {t('auth.attemptsLeft').replace('{attempts}', (MAX_ATTEMPTS - failedAttempts).toString())}
            </FieldHelper>
          )}
        </div>

        <Button loading={loading} full type="submit" disabled={isLocked}>
          {isLocked ? t('auth.accountLocked') : t('auth.loginButton')}
        </Button>
        <Separator label={t('auth.orContinueWith')} />
        <OAuthButton provider="google" full disabled={isLocked} />
        <div className="text-center">
          <Link
            href="/forgot-password"
            className={`text-sm text-blue-600 hover:underline dark:text-blue-400 ${isLocked ? 'pointer-events-none opacity-50' : ''}`}
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>
        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          {t('auth.noAccount')}{" "}
          <Link
            className={`text-blue-600 hover:underline dark:text-blue-400 ${isLocked ? 'pointer-events-none opacity-50' : ''}`}
            href="/register"
          >
            {t('auth.signUp')}
          </Link>
        </p>
      </form>
      
      {/* Panel de ayuda contextual */}
      <HelpPanel context="login" />
    </>
  );
};