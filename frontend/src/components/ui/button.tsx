import * as React from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "outline" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  full?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600",
  outline:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",
  ghost:
    "text-gray-700 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-200 dark:hover:bg-gray-800"
};

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  variant = "primary",
  loading,
  full,
  ...props
}) => (
  <button
    className={clsx(
      base,
      variants[variant],
      full && "w-full",
      "px-4 py-2",
      className
    )}
    {...props}
  >
    {loading && (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
    )}
    {children}
  </button>
);