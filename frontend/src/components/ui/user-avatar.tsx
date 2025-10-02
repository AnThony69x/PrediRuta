import type { User } from '@supabase/supabase-js';
import { getUserDisplayName, getUserFirstName } from '@/utils/userHelpers';

interface UserAvatarProps {
  user: User | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md', 
  showName = false 
}) => {
  const displayName = getUserDisplayName(user);
  const firstName = getUserFirstName(user);
  
  // Obtener iniciales del nombre
  const getInitials = (name: string): string => {
    if (name.includes('@')) {
      // Si es email, usar las primeras dos letras
      return name.substring(0, 2).toUpperCase();
    }
    
    const names = name.split(' ').filter(n => n.length > 0);
    if (names.length >= 2 && names[0] && names[1]) {
      return ((names[0]?.[0] ?? '') + (names[1]?.[0] ?? '')).toUpperCase();
    }
    if (names[0]) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return 'U'; // Fallback
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base', 
    lg: 'w-12 h-12 text-lg'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Foto de perfil desde Google OAuth
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <div className="flex items-center space-x-3">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white font-semibold overflow-hidden`}>
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={`Avatar de ${displayName}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si la imagen falla, mostrar iniciales
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextSibling && (target.nextSibling.textContent = getInitials(displayName));
            }}
          />
        ) : (
          <span>{getInitials(displayName)}</span>
        )}
      </div>
      
      {showName && (
        <div className="flex flex-col">
          <span className={`font-medium text-gray-900 dark:text-white ${textSizeClasses[size]}`}>
            {firstName}
          </span>
          {displayName !== firstName && !displayName.includes('@') && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {displayName}
            </span>
          )}
        </div>
      )}
    </div>
  );
};