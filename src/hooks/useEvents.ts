/**
 * Hook pour accéder aux événements depuis n'importe quel écran.
 * Exemple : const { events, addEvent, toggleParticipation } = useEvents();
 */
import { useContext } from 'react';

import { EventsContext } from '@/context/EventsContext';

export function useEvents() {
  const context = useContext(EventsContext);

  // Si on oublie d'entourer l'app avec <EventsProvider>, on affiche une erreur claire
  if (context === null) {
    throw new Error('useEvents doit être utilisé à l’intérieur de <EventsProvider>');
  }

  return context;
}
