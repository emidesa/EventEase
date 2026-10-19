/**
 * « Événements enregistrés » (depuis le Profil) : les événements mis en favori avec le cœur.
 */
import { useTranslation } from 'react-i18next';

import { EventListPage } from '@/components/events/EventListPage';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';

export default function SavedEventsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { events } = useEvents();

  // On garde seulement les événements dont l'id est dans les favoris de l'utilisateur
  const savedEvents = events.filter((event) => user?.favorites.includes(event.id));

  return (
    <EventListPage
      title={t('profile.menu.savedEvents')}
      events={savedEvents}
      emptyText={t('lists.emptySaved')}
    />
  );
}
