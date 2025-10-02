import React from 'react';

interface PasswordMatchProps {
  password: string;
  confirmPassword: string;
  className?: string;
}

export const PasswordMatch: React.FC<PasswordMatchProps> = ({ 
  password, 
  confirmPassword, 
  className = "" 
}) => {
  // No mostrar nada si no hay contraseñas
  if (!password || !confirmPassword) return null;

  const passwordsMatch = password === confirmPassword;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center space-x-2 text-xs">
        {passwordsMatch ? (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            <span className="text-green-600 dark:text-green-400 font-medium">
              Las contraseñas coinciden
            </span>
          </>
        ) : (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 flex-shrink-0" />
            <span className="text-red-600 dark:text-red-400">
              Las contraseñas no coinciden
            </span>
          </>
        )}
      </div>
    </div>
  );
};