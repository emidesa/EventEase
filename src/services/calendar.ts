/**
 * Ajout d'un événement dans le calendrier du téléphone (Calendrier d'Apple, Agenda Google...).
 * On ouvre la fenêtre native « Nouvel événement », déjà remplie : l'utilisateur n'a plus qu'à valider.
 *
 * On utilise l'ancienne API "expo-calendar/legacy" : c'est celle qui est incluse dans Expo Go
 * (la nouvelle API d'expo-calendar n'y est pas encore disponible).
 */
import * as Calendar from 'expo-calendar/legacy';

import { Event } from '@/types/event';

/**
 * Ce qui s'est passé dans la fenêtre du téléphone :
 * - "added" : l'événement a bien été ajouté (seulement sur iPhone)
 * - "canceled" : l'utilisateur a annulé (seulement sur iPhone)
 * - "unknown" : on ne sait pas (Android ne le dit pas)
 * - "denied" : l'accès au calendrier a été refusé
 */
export type AddToCalendarResult = 'added' | 'canceled' | 'unknown' | 'denied';

/** Ouvre la fenêtre « Nouvel événement » du téléphone avec les infos de l'événement. */
export async function addToPhoneCalendar(event: Event): Promise<AddToCalendarResult> {
  // Les infos à pré-remplir dans la fenêtre du téléphone
  const eventData = {
    title: event.title,
    startDate: new Date(event.date),
    endDate: new Date(event.endDate),
    location: event.location?.name,
    notes: event.description,
  };

  try {
    // iOS 17 et plus, Android : pas besoin d'autorisation pour cette fenêtre
    const result = await Calendar.createEventInCalendarAsync(eventData);
    return getResult(result.action);
  } catch {
    // iOS plus ancien : il faut d'abord demander l'accès au calendrier, puis réessayer
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      return 'denied';
    }
    const result = await Calendar.createEventInCalendarAsync(eventData);
    return getResult(result.action);
  }
}

/** Traduit la réponse du téléphone ("saved", "canceled", "done"...) en résultat simple. */
function getResult(action: string): AddToCalendarResult {
  if (action === 'saved') {
    return 'added';
  }
  if (action === 'canceled' || action === 'deleted') {
    return 'canceled';
  }
  return 'unknown'; // "done" sur Android : on ne sait pas si l'utilisateur a validé
}
