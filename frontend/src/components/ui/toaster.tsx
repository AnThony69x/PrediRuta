"use client";

import * as React from "react";
import { Toast, ToastType } from "./toast";

interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToasterContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  security: (title: string, description?: string) => void;
}

const ToasterContext = React.createContext<ToasterContextValue | undefined>(undefined);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastData, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Métodos de ayuda para cada tipo
  const success = React.useCallback((title: string, description?: string) => {
    addToast({ type: "success", title, description });
  }, [addToast]);

  const error = React.useCallback((title: string, description?: string) => {
    addToast({ type: "error", title, description });
  }, [addToast]);

  const warning = React.useCallback((title: string, description?: string) => {
    addToast({ type: "warning", title, description });
  }, [addToast]);

  const info = React.useCallback((title: string, description?: string) => {
    addToast({ type: "info", title, description });
  }, [addToast]);

  const security = React.useCallback((title: string, description?: string) => {
    addToast({ type: "security", title, description, duration: 7000 });
  }, [addToast]);

  return (
    <ToasterContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info, security }}>
      {children}
      <div 
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-atomic="false"
      >
        <div className="flex flex-col gap-2 pointer-events-auto">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={removeToast} />
          ))}
        </div>
      </div>
    </ToasterContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToasterContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de ToasterProvider");
  }
  return context;
}
