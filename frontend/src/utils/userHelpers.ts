import type { User } from '@supabase/supabase-js';

/**
 * Obtiene el nombre para mostrar de un usuario, priorizando el nombre completo sobre el email
 */
export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) {
    return 'Usuario';
  }

  // Prioridad: full_name > display_name > name > email > 'Usuario'
  const displayName = 
    user.user_metadata?.full_name || 
    user.user_metadata?.display_name || 
    user.user_metadata?.name || 
    user.email || 
    'Usuario';

  return displayName;
}

/**
 * Obtiene solo el primer nombre del usuario
 */
export function getUserFirstName(user: User | null | undefined): string {
  const fullName = getUserDisplayName(user);
  
  // Si es un email, retornar la parte antes del @
  if (fullName.includes('@')) {
    return fullName.split('@')[0] || 'Usuario';
  }
  
  // Si es un nombre completo, retornar solo el primer nombre
  return fullName.split(' ')[0] || 'Usuario';
}

/**
 * Verifica si el usuario tiene un nombre real (no solo email)
 */
export function userHasRealName(user: User | null | undefined): boolean {
  if (!user) return false;
  
  const hasFullName = !!(user.user_metadata?.full_name || user.user_metadata?.display_name || user.user_metadata?.name);
  return hasFullName;
}