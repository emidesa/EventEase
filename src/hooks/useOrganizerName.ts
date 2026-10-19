/**
 * Hook qui retrouve le nom de l'organisateur d'un événement à partir de son id.
 * Les événements de démo sont organisés par « l'équipe EventEase » (ce n'est pas un vrai compte).
 * Exemple : const organizerName = useOrganizerName(event.createdBy);
 */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SEED_ORGANIZER_ID } from '@/data/seed';
import { getUserById } from '@/services/auth';

export function useOrganizerName(organizerId: string): string {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  useEffect(() => {
    // Les comptes sont lus dans le téléphone (asynchrone), d'où le useEffect
    async function loadName() {
      const user = await getUserById(organizerId);
      setName(user ? user.name : '');
    }

    if (organizerId !== SEED_ORGANIZER_ID) {
      loadName();
    }
  }, [organizerId]); // on recommence si l'organisateur change

  // Événement de démo : nom fixe, traduit
  if (organizerId === SEED_ORGANIZER_ID) {
    return t('events.organizerTeam');
  }
  return name;
}
