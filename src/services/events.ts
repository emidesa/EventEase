/**
 * Gestion des événements (CRUD = Créer, Lire, Modifier, Supprimer), sans serveur :
 * les événements sont enregistrés dans le téléphone.
 *
 * Chaque fonction suit le même schéma :
 *   1. on lit la liste enregistrée
 *   2. on la modifie
 *   3. on enregistre la nouvelle liste
 *   4. on la renvoie, pour que l'écran puisse se mettre à jour
 */
import * as Crypto from 'expo-crypto';

import { Event, EventFormData } from '@/types/event';
import { getEvents, saveEvents } from './storage';

/** Lit tous les événements. */
export async function loadEvents(): Promise<Event[]> {
  const events = await getEvents();

  // Premier lancement : rien n'est encore enregistré
  if (events === null) {
    return [];
  }

  return events;
}

/** Crée un nouvel événement. L'utilisateur qui le crée devient son créateur. */
export async function createEvent(data: EventFormData, userId: string): Promise<Event[]> {
  const events = await loadEvents();

  const newEvent: Event = {
    ...data, // recopie tous les champs du formulaire (titre, description, dates, catégorie...)
    id: Crypto.randomUUID(),
    participants: [],
    createdBy: userId,
  };

  const newEvents = [...events, newEvent]; // l'ancienne liste + le nouvel événement
  await saveEvents(newEvents);
  return newEvents;
}

/** Modifie un événement existant (on remplace ses champs par ceux du formulaire). */
export async function updateEvent(eventId: string, data: EventFormData): Promise<Event[]> {
  const events = await loadEvents();

  // map : on parcourt la liste et on remplace seulement l'événement qui a le bon id
  const newEvents = events.map((event) => {
    if (event.id === eventId) {
      return { ...event, ...data }; // on garde id, participants et créateur, on remplace le reste
    }
    return event;
  });

  await saveEvents(newEvents);
  return newEvents;
}

/** Supprime un événement. */
export async function deleteEvent(eventId: string): Promise<Event[]> {
  const events = await loadEvents();

  // filter : on garde tous les événements SAUF celui qui a cet id
  const newEvents = events.filter((event) => event.id !== eventId);

  await saveEvents(newEvents);
  return newEvents;
}

/**
 * Participer / ne plus participer à un événement.
 * Si l'utilisateur participe déjà, on le retire ; sinon, on l'ajoute.
 */
export async function toggleParticipation(eventId: string, userId: string): Promise<Event[]> {
  const events = await loadEvents();

  const newEvents = events.map((event) => {
    if (event.id !== eventId) {
      return event;
    }

    const isParticipating = event.participants.includes(userId);

    if (isParticipating) {
      // On retire l'utilisateur de la liste
      return { ...event, participants: event.participants.filter((id) => id !== userId) };
    }
    // On ajoute l'utilisateur à la liste
    return { ...event, participants: [...event.participants, userId] };
  });

  await saveEvents(newEvents);
  return newEvents;
}
