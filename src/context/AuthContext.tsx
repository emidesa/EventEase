/**
 * Contexte d'authentification : il "retient" qui est connecté et le partage avec tous les écrans.
 * Les écrans n'utilisent pas ce fichier directement : ils passent par le hook useAuth().
 */
import { createContext, ReactNode, useEffect, useState } from 'react';

import * as authService from '@/services/auth';
import { clearSession, getSessionUserId, saveSessionUserId } from '@/services/storage';
import { PublicUser } from '@/types/user';

// Ce que le contexte met à disposition des écrans
type AuthContextType = {
  user: PublicUser | null; // l'utilisateur connecté, ou null si personne
  isLoading: boolean; // true pendant qu'on vérifie la session au démarrage
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  toggleFavorite: (eventId: string) => Promise<void>;
};

// Création du contexte (vide au départ, il est rempli par AuthProvider)
export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

/** Composant qui entoure toute l'app pour lui donner accès à l'utilisateur connecté. */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au lancement de l'app : y avait-il quelqu'un de connecté la dernière fois ?
  useEffect(() => {
    async function loadSession() {
      const userId = await getSessionUserId();

      if (userId) {
        const savedUser = await authService.getUserById(userId);
        setUser(savedUser);
      }

      setIsLoading(false);
    }

    loadSession();
  }, []); // [] = on ne le fait qu'une seule fois, au démarrage

  /** Connexion : vérifie les identifiants puis mémorise l'utilisateur. */
  async function signIn(email: string, password: string) {
    const loggedUser = await authService.login(email, password); // lance une erreur si c'est incorrect
    await saveSessionUserId(loggedUser.id);
    setUser(loggedUser);
  }

  /** Inscription : crée le compte puis connecte directement l'utilisateur. */
  async function signUp(name: string, email: string, password: string) {
    const newUser = await authService.register(name, email, password); // lance une erreur si l'email est pris
    await saveSessionUserId(newUser.id);
    setUser(newUser);
  }

  /** Déconnexion : oublie la session et vide l'utilisateur. */
  async function signOut() {
    await clearSession();
    setUser(null);
  }

  /** Favori : ajoute ou retire un événement des favoris de l'utilisateur connecté. */
  async function toggleFavorite(eventId: string) {
    if (!user) return;
    const updatedUser = await authService.toggleFavorite(user.id, eventId);
    setUser(updatedUser); // tous les écrans voient tout de suite le nouveau favori
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}
