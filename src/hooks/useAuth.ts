/**
 * Hook pour accéder à l'utilisateur connecté depuis n'importe quel écran.
 * Exemple : const { user, signOut } = useAuth();
 */
import { useContext } from 'react';

import { AuthContext } from '@/context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);

  // Si on oublie d'entourer l'app avec <AuthProvider>, on affiche une erreur claire
  if (context === null) {
    throw new Error('useAuth doit être utilisé à l’intérieur de <AuthProvider>');
  }

  return context;
}
