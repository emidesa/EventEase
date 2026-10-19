/**
 * Contexte des événements : il garde la liste des événements en mémoire et la partage
 * avec tous les écrans (Accueil, Calendrier, Détail, Profil...).
 * Les écrans n'utilisent pas ce fichier directement : ils passent par le hook useEvents().
 */
import { createContext, ReactNode, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import * as eventsService from '@/services/events';
import { Event, EventFormData } from '@/types/event';

// Ce que le contexte met à disposition des écrans
type EventsContextType = {
  events: Event[];
  isLoading: boolean; // true pendant le chargement des événements au démarrage
  addEvent: (data: EventFormData) => Promise<void>;
  editEvent: (eventId: string, data: EventFormData) => Promise<void>;
  removeEvent: (eventId: string) => Promise<void>;
  toggleParticipation: (eventId: string) => Promise<void>;
};

export const EventsContext = createContext<EventsContextType | null>(null);

type EventsProviderProps = {
  children: ReactNode;
};

/** Composant qui entoure l'app pour lui donner accès aux événements. */
export function EventsProvider({ children }: EventsProviderProps) {
  const { user } = useAuth(); // on a besoin de l'utilisateur connecté (créateur, participant)

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Au démarrage : on lit les événements enregistrés dans le téléphone
  useEffect(() => {
    async function load() {
      const savedEvents = await eventsService.loadEvents();
      setEvents(savedEvents);
      setIsLoading(false);
    }

    load();
  }, []);

  // Chaque action appelle le service, qui renvoie la nouvelle liste,
  // puis on met à jour l'état : tous les écrans se réaffichent automatiquement.

  async function addEvent(data: EventFormData) {
    if (!user) return; // sécurité : il faut être connecté pour créer un événement
    const newEvents = await eventsService.createEvent(data, user.id);
    setEvents(newEvents);
  }

  async function editEvent(eventId: string, data: EventFormData) {
    const newEvents = await eventsService.updateEvent(eventId, data);
    setEvents(newEvents);
  }

  async function removeEvent(eventId: string) {
    const newEvents = await eventsService.deleteEvent(eventId);
    setEvents(newEvents);
  }

  async function toggleParticipation(eventId: string) {
    if (!user) return;
    const newEvents = await eventsService.toggleParticipation(eventId, user.id);
    setEvents(newEvents);
  }

  return (
    <EventsContext.Provider
      value={{ events, isLoading, addEvent, editEvent, removeEvent, toggleParticipation }}
    >
      {children}
    </EventsContext.Provider>
  );
}
