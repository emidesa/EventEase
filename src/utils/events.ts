/**
 * Petites fonctions sur les listes d'événements.
 */
import { Event } from '@/types/event';
import { PublicUser } from '@/types/user';

/**
 * Renvoie les événements triés par date, du plus proche au plus lointain.
 * [...events] fait une copie : sort() modifierait sinon la liste d'origine.
 */
export function sortByDate(events: Event[]): Event[] {
  return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/** true si l'utilisateur participe à l'événement. */
export function isParticipant(event: Event, user: PublicUser | null): boolean {
  // user peut être null une fraction de seconde pendant la déconnexion
  return user !== null && event.participants.includes(user.id);
}
