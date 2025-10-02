import React from 'react';

interface NameValidationProps {
  name: string;
  className?: string;
}

export const NameValidation: React.FC<NameValidationProps> = ({ 
  name, 
  className = "" 
}) => {
  // No mostrar nada si no hay nombre
  if (!name) return null;

  const trimmedName = name.trim();
  const isValidLength = trimmedName.length >= 2;
  const hasValidChars = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(trimmedName); // Permite letras, espacios y caracteres acentuados

  const getValidationMessage = () => {
    if (!isValidLength) {
      return {
        isValid: false,
        message: "El nombre debe tener al menos 2 caracteres"
      };
    }
    if (!hasValidChars) {
      return {
        isValid: false,
        message: "El nombre solo puede contener letras y espacios"
      };
    }
    return {
      isValid: true,
      message: "Nombre válido"
    };
  };

  const validation = getValidationMessage();

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center space-x-2 text-xs">
        {validation.isValid ? (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            <span className="text-green-600 dark:text-green-400 font-medium">
              {validation.message}
            </span>
          </>
        ) : (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 flex-shrink-0" />
            <span className="text-red-600 dark:text-red-400">
              {validation.message}
            </span>
          </>
        )}
      </div>
    </div>
  );
};