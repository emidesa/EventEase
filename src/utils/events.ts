/**
 * Petites fonctions sur les listes d'événements.
 */
import { Event } from '@/types/event';

/**
 * Renvoie les événements triés par date, du plus proche au plus lointain.
 * [...events] fait une copie : sort() modifierait sinon la liste d'origine.
 */
export function sortByDate(events: Event[]): Event[] {
  return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
