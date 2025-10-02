import React from 'react';

interface EmailValidationProps {
  email: string;
  className?: string;
}

export const EmailValidation: React.FC<EmailValidationProps> = ({ 
  email, 
  className = "" 
}) => {
  // No mostrar nada si no hay email
  if (!email) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center space-x-2 text-xs">
        {isValidEmail ? (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            <span className="text-green-600 dark:text-green-400 font-medium">
              Email válido
            </span>
          </>
        ) : (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 flex-shrink-0" />
            <span className="text-red-600 dark:text-red-400">
              Formato de email inválido
            </span>
          </>
        )}
      </div>
    </div>
  );
};