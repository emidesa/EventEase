/**
 * Ce fichier est le seul qui parle à AsyncStorage (le stockage local du téléphone).
 * Les autres fichiers appellent ces fonctions au lieu d'utiliser AsyncStorage directement.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Event } from '@/types/event';
import { User } from '@/types/user';

// Les "clés" sont les noms sous lesquels on range les données dans le téléphone
const USERS_KEY = '@eventease/users';
const SESSION_KEY = '@eventease/session';
const LANGUAGE_KEY = '@eventease/language';
const EVENTS_KEY = '@eventease/events';

// ---------- Utilisateurs ----------

/** Récupère la liste de tous les comptes créés. */
export async function getUsers(): Promise<User[]> {
  try {
    const json = await AsyncStorage.getItem(USERS_KEY);

    // Si rien n'a encore été enregistré, on renvoie une liste vide
    if (json === null) {
      return [];
    }

    // AsyncStorage ne stocke que du texte : on retransforme le texte en tableau
    return JSON.parse(json);
  } catch (error) {
    console.log('Erreur lors de la lecture des utilisateurs', error);
    return [];
  }
}

/** Enregistre la liste complète des comptes. */
export async function saveUsers(users: User[]): Promise<void> {
  // On transforme le tableau en texte avant de l'enregistrer
  const json = JSON.stringify(users);
  await AsyncStorage.setItem(USERS_KEY, json);
}

// ---------- Session (utilisateur connecté) ----------

/** Récupère l'id de l'utilisateur connecté, ou null si personne n'est connecté. */
export async function getSessionUserId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(SESSION_KEY);
  } catch (error) {
    console.log('Erreur lors de la lecture de la session', error);
    return null;
  }
}

/** Enregistre l'id de l'utilisateur qui vient de se connecter. */
export async function saveSessionUserId(userId: string): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, userId);
}

/** Supprime la session (déconnexion). */
export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

// ---------- Langue choisie ----------

/** Récupère la langue choisie dans le Profil ("fr" ou "en"), ou null si aucun choix. */
export async function getSavedLanguage(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LANGUAGE_KEY);
  } catch (error) {
    console.log('Erreur lors de la lecture de la langue', error);
    return null;
  }
}

/** Enregistre la langue choisie. */
export async function saveLanguage(language: string): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
}

// ---------- Événements ----------

/**
 * Récupère la liste des événements.
 * Renvoie null si aucun événement n'a jamais été enregistré (premier lancement de l'app) :
 * ça permettra d'ajouter les événements de démo à ce moment-là.
 */
export async function getEvents(): Promise<Event[] | null> {
  try {
    const json = await AsyncStorage.getItem(EVENTS_KEY);

    if (json === null) {
      return null;
    }

    return JSON.parse(json);
  } catch (error) {
    console.log('Erreur lors de la lecture des événements', error);
    return [];
  }
}

/** Enregistre la liste complète des événements. */
export async function saveEvents(events: Event[]): Promise<void> {
  const json = JSON.stringify(events);
  await AsyncStorage.setItem(EVENTS_KEY, json);
}
