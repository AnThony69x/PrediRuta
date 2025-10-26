"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Mail, Lock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info" | "security";

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles = {
  success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
  error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100",
  warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100",
  info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
  security: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100",
};

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  security: Shield,
};

export function Toast({ id, type, title, description, duration = 5000, onClose }: ToastProps) {
  const Icon = toastIcons[type];

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-full min-w-[320px] max-w-md",
        toastStyles[type]
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-1">
        <p className="font-semibold text-sm leading-tight">{title}</p>
        {description && <p className="text-xs opacity-90 leading-relaxed">{description}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 rounded"
        aria-label="Cerrar notificación"
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
