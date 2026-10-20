/**
 * Petites fonctions sur le texte.
 */

export function getInitials(name: string): string {
  const words = name.trim().split(' '); // "Léa Bernard" → ["Léa", "Bernard"]
  const firstLetter = words[0].charAt(0); // split renvoie toujours au moins un mot
  const lastLetter = words.length > 1 ? words[words.length - 1].charAt(0) : '';

  return (firstLetter + lastLetter).toUpperCase();
}

/** Renvoie le prénom (le premier mot du nom) : "Léa Bernard" → "Léa". */
export function getFirstName(name: string): string {
  return name.trim().split(' ')[0];
}
