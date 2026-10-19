/**
 * Types liés aux utilisateurs.
 * Les comptes sont stockés en local : on ne garde jamais le mot de passe en clair, seulement son hash.
 */
export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  favorites: string[];
};

/**
 * Utilisateur sans son hash de mot de passe : c'est ce qu'on expose au reste de l'app.
 * Omit<User, 'passwordHash'> = le type User sans le champ passwordHash.
 */
export type PublicUser = Omit<User, 'passwordHash'>;
