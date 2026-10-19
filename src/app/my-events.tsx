/**
 * « Mes événements » (depuis le Profil) : les événements créés par l'utilisateur connecté.
 */
import { useTranslation } from 'react-i18next';

import { EventListPage } from '@/components/events/EventListPage';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';

export default function MyEventsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { events } = useEvents();

  // On garde seulement les événements dont l'utilisateur est le créateur
  const myEvents = events.filter((event) => event.createdBy === user?.id);

  return (
    <EventListPage title={t('profile.menu.myEvents')} events={myEvents} emptyText={t('lists.emptyMine')} />
  );
}
