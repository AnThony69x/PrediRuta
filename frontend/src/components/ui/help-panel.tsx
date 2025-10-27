"use client";

import React, { useState } from "react";
import { X, HelpCircle, Shield, Mail, Key, Lock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpPanelProps {
  context: "login" | "register" | "forgot-password" | "profile";
}

const helpContent = {
  login: {
    title: "Ayuda para Iniciar Sesión",
    items: [
      {
        icon: Mail,
        title: "Correo electrónico",
        content: "Usa el mismo correo con el que te registraste. Debe ser un email válido.",
      },
      {
        icon: Key,
        title: "Contraseña",
        content: "Ingresa tu contraseña. Si la olvidaste, usa el enlace 'Olvidaste tu contraseña'.",
      },
      {
        icon: Shield,
        title: "Seguridad",
        content: "Por seguridad, tienes 3 intentos. Después de eso, tu cuenta se bloqueará temporalmente por 5 minutos.",
      },
      {
        icon: Lock,
        title: "Cuenta bloqueada",
        content: "Si tu cuenta está bloqueada, espera el tiempo indicado o contacta a soporte.",
      },
    ],
  },
  register: {
    title: "Ayuda para Registro",
    items: [
      {
        icon: Mail,
        title: "Correo electrónico",
        content: "Usa un correo válido. Recibirás un email de verificación para activar tu cuenta.",
      },
      {
        icon: Key,
        title: "Contraseña segura",
        content: "Mínimo 8 caracteres, incluyendo: mayúsculas, minúsculas, números y caracteres especiales (@$!%*?&).",
      },
      {
        icon: FileText,
        title: "Términos y condiciones",
        content: "Debes aceptar los términos para crear tu cuenta. Puedes leerlos antes de aceptar haciendo clic en los enlaces.",
      },
      {
        icon: Shield,
        title: "Privacidad",
        content: "Tus datos están protegidos. Lee nuestra política de privacidad para más información.",
      },
    ],
  },
  "forgot-password": {
    title: "Ayuda para Recuperar Contraseña",
    items: [
      {
        icon: Mail,
        title: "Email de recuperación",
        content: "Ingresa tu correo registrado. Recibirás un enlace para restablecer tu contraseña.",
      },
      {
        icon: Lock,
        title: "Revisa tu correo",
        content: "El enlace es válido por 1 hora. Si no lo recibes, revisa tu carpeta de spam o correo no deseado.",
      },
      {
        icon: Key,
        title: "Nueva contraseña",
        content: "Crea una contraseña segura diferente a la anterior para mayor seguridad.",
      },
    ],
  },
  profile: {
    title: "Ayuda para Perfil",
    items: [
      {
        icon: Key,
        title: "Cambiar contraseña",
        content: "Recomendamos cambiar tu contraseña cada 3 meses por seguridad.",
      },
      {
        icon: Shield,
        title: "Verificación de email",
        content: "Si cambias tu email, deberás verificarlo nuevamente para mantener la seguridad de tu cuenta.",
      },
      {
        icon: Mail,
        title: "Notificaciones",
        content: "Configura tus preferencias de notificaciones para recibir alertas importantes.",
      },
    ],
  },
};

export function HelpPanel({ context }: HelpPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const content = helpContent[context];

  return (
    <>
      {/* Botón flotante de ayuda */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label="Abrir ayuda"
        title="¿Necesitas ayuda?"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      {/* Panel lateral de ayuda */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 transition-transform duration-300 ease-in-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {content.title}
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Cerrar ayuda"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Contenido de ayuda */}
          <div className="space-y-4">
            {content.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg border border-blue-100 dark:border-gray-600"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Consejos adicionales */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Consejos de seguridad
            </h3>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
              <li>Nunca compartas tu contraseña con nadie</li>
              <li>Usa contraseñas únicas para cada sitio</li>
              <li>Verifica siempre la URL antes de ingresar datos</li>
            </ul>
          </div>

          {/* Footer con contacto */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              ¿Aún necesitas ayuda?
            </p>
            <div className="space-y-2">
              <a
                href="mailto:soporte@prediruta.com"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                📧 soporte@prediruta.com
              </a>
              <a
                href="tel:+15551234567"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                📱 +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay oscuro cuando está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
