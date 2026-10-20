/**
 * Raccourcis de navigation utilisés sur plusieurs écrans.
 */
import { router } from 'expo-router';

/** Ouvre le détail d'un événement (écran src/app/event/[id].tsx). */
export function openEventDetail(eventId: string) {
  router.push({ pathname: '/event/[id]', params: { id: eventId } });
}
