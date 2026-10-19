/**
 * Affichage des dates dans la langue de l'app (français ou anglais).
 * Les dates sont stockées en ISO (« 2026-05-24T12:00:00.000Z ») : ces fonctions les
 * transforment en texte lisible. C'est le SEUL endroit de l'app qui formate des dates.
 */
import i18n from '@/i18n';

/** Langue utilisée pour le format : "fr-FR" ou "en-US". */
function getLocale(): string {
  return i18n.language === 'en' ? 'en-US' : 'fr-FR';
}

/** Le numéro du jour : "24". */
export function formatDayNumber(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(getLocale(), { day: 'numeric' });
}

/** Le mois en abrégé : "mai" (fr) ou "May" (en). */
export function formatMonthShort(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(getLocale(), { month: 'short' });
}

/** La date complète : "samedi 24 mai 2026" (fr) ou "Saturday, May 24, 2026" (en). */
export function formatFullDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(getLocale(), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** L'heure : "14:00" (fr) ou "2:00 PM" (en). */
export function formatTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString(getLocale(), {
    hour: 'numeric', // "14" en français, "2" en anglais (pas "02")
    minute: '2-digit', // toujours deux chiffres : "00"
  });
}

/** L'horaire : "14:00 – 17:00". */
export function formatTimeRange(startIsoDate: string, endIsoDate: string): string {
  return `${formatTime(startIsoDate)} – ${formatTime(endIsoDate)}`;
}

/** true si l'événement est terminé (sa date de fin est avant maintenant). */
export function isPast(endIsoDate: string): boolean {
  return new Date(endIsoDate) < new Date();
}
