/**
 * Inscription et connexion, sans serveur : les comptes sont enregistrés dans le téléphone.
 * En cas de problème, on lance une erreur dont le message est un code ("emailTaken"...).
 * L'écran traduit ensuite ce code avec t('errors.' + code).
 */
import * as Crypto from 'expo-crypto';

import { PublicUser, User } from '@/types/user';
import { getUsers, saveUsers } from './storage';

/** Transforme un mot de passe en "hash" (une suite de caractères impossible à relire). */
async function hashPassword(password: string): Promise<string> {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

/** Enlève le hash du mot de passe avant de donner l'utilisateur au reste de l'app. */
function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    favorites: user.favorites,
    createdAt: user.createdAt,
  };
}

/** Crée un nouveau compte et le renvoie. */
export async function register(name: string, email: string, password: string): Promise<PublicUser> {
  const users = await getUsers();

  // On met l'email en minuscules et sans espaces, pour que "Lea@Mail.fr " = "lea@mail.fr"
  const cleanEmail = email.trim().toLowerCase();

  // On vérifie qu'aucun compte n'utilise déjà cet email
  const existingUser = users.find((user) => user.email === cleanEmail);
  if (existingUser) {
    throw new Error('emailTaken');
  }

  const newUser: User = {
    id: Crypto.randomUUID(), // identifiant unique généré automatiquement
    name: name.trim(),
    email: cleanEmail,
    passwordHash: await hashPassword(password),
    favorites: [],
    createdAt: new Date().toISOString(), // date et heure actuelles, ex. "2026-10-19T14:30:00.000Z"
  };

  // On ajoute le nouveau compte à la liste, puis on enregistre la liste
  users.push(newUser);
  await saveUsers(users);

  return toPublicUser(newUser);
}

/** Vérifie l'email et le mot de passe, et renvoie l'utilisateur s'ils sont corrects. */
export async function login(email: string, password: string): Promise<PublicUser> {
  const users = await getUsers();
  const cleanEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email === cleanEmail);

  // On ne peut pas "relire" un hash : on hache le mot de passe tapé et on compare les deux hash
  const passwordHash = await hashPassword(password);

  // Même erreur si l'email n'existe pas ou si le mot de passe est faux :
  // ainsi, on ne révèle pas quels emails ont un compte
  if (!user || user.passwordHash !== passwordHash) {
    throw new Error('invalidCredentials');
  }

  return toPublicUser(user);
}

/** Retrouve un utilisateur à partir de son id (utilisé au démarrage pour la session). */
export async function getUserById(userId: string): Promise<PublicUser | null> {
  const users = await getUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return null;
  }
  return toPublicUser(user);
}

/**
 * Ajoute un événement aux favoris de l'utilisateur, ou le retire s'il y est déjà.
 * Renvoie l'utilisateur mis à jour.
 */
export async function toggleFavorite(userId: string, eventId: string): Promise<PublicUser | null> {
  const users = await getUsers();

  // 1. On retrouve l'utilisateur
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return null;
  }

  // 2. On ajoute ou on retire l'événement de ses favoris
  const isFavorite = user.favorites.includes(eventId);
  const updatedUser: User = {
    ...user,
    favorites: isFavorite
      ? user.favorites.filter((id) => id !== eventId) // déjà en favori : on le retire
      : [...user.favorites, eventId], // pas encore en favori : on l'ajoute
  };

  // 3. On remplace l'ancien utilisateur par le nouveau dans la liste, puis on enregistre
  const newUsers = users.map((u) => (u.id === userId ? updatedUser : u));
  await saveUsers(newUsers);

  return toPublicUser(updatedUser);
}
