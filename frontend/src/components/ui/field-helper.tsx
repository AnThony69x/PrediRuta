import React from "react";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldHelperProps {
  type?: "info" | "success" | "error";
  children: React.ReactNode;
  className?: string;
}

export function FieldHelper({ type = "info", children, className }: FieldHelperProps) {
  const icons = {
    info: Info,
    success: CheckCircle,
    error: AlertCircle,
  };

  const styles = {
    info: "text-blue-600 dark:text-blue-400",
    success: "text-green-600 dark:text-green-400",
    error: "text-red-600 dark:text-red-400",
  };

  const Icon = icons[type];

  return (
    <div className={cn("flex items-start gap-2 mt-1.5", className)}>
      <Icon className={cn("h-4 w-4 flex-shrink-0 mt-0.5", styles[type])} />
      <p className={cn("text-sm", styles[type])}>{children}</p>
    </div>
  );
}
