/**
 * Petites fonctions de vérification des formulaires.
 */

/** Vérifie qu'un email a une forme correcte : quelque chose @ quelque chose . quelque chose */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/** Longueur minimale du mot de passe */
export const PASSWORD_MIN_LENGTH = 6;
