import React from 'react';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ 
  password, 
  className = "" 
}) => {
  const requirements: PasswordRequirement[] = [
    {
      label: "Al menos 8 caracteres",
      test: (pwd) => pwd.length >= 8,
      met: password.length >= 8
    },
    {
      label: "Una letra minúscula",
      test: (pwd) => /[a-z]/.test(pwd),
      met: /[a-z]/.test(password)
    },
    {
      label: "Una letra mayúscula", 
      test: (pwd) => /[A-Z]/.test(pwd),
      met: /[A-Z]/.test(password)
    },
    {
      label: "Un número",
      test: (pwd) => /\d/.test(pwd),
      met: /\d/.test(password)
    },
    {
      label: "Un carácter especial (@$!%*?&)",
      test: (pwd) => /[@$!%*?&]/.test(pwd),
      met: /[@$!%*?&]/.test(password)
    }
  ];

  const metRequirements = requirements.filter(req => req.met).length;
  const totalRequirements = requirements.length;
  const strengthPercentage = (metRequirements / totalRequirements) * 100;
  
  const getStrengthLevel = () => {
    if (metRequirements <= 1) return { level: "Muy débil", color: "bg-red-500", textColor: "text-red-600" };
    if (metRequirements <= 2) return { level: "Débil", color: "bg-orange-500", textColor: "text-orange-600" };
    if (metRequirements <= 3) return { level: "Regular", color: "bg-yellow-500", textColor: "text-yellow-600" };
    if (metRequirements <= 4) return { level: "Buena", color: "bg-blue-500", textColor: "text-blue-600" };
    return { level: "Muy segura", color: "bg-green-500", textColor: "text-green-600" };
  };

  const strengthInfo = getStrengthLevel();
  const unmetRequirements = requirements.filter(req => !req.met);

  // No mostrar nada si no hay contraseña
  if (!password) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Barra de progreso */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Seguridad de la contraseña
          </span>
          <span className={`text-xs font-semibold ${strengthInfo.textColor} dark:opacity-90`}>
            {strengthInfo.level}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ease-out ${strengthInfo.color}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>

      {/* Alertas de requisitos faltantes */}
      {unmetRequirements.length > 0 && (
        <div className="space-y-1">
          {unmetRequirements.map((requirement, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 text-xs"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 flex-shrink-0" />
              <span className="text-red-600 dark:text-red-400">
                {requirement.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje de éxito cuando todos los requisitos se cumplen */}
      {metRequirements === totalRequirements && (
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
          <span className="text-green-600 dark:text-green-400 font-medium">
            ¡Contraseña segura!
          </span>
        </div>
      )}
    </div>
  );
};