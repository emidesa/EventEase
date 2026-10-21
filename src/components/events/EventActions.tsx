/**
 * Boutons d'action en bas du détail d'un événement :
 * - « Je participe » / « Participation confirmée ✓ » (ou « Cet événement est terminé »)
 * - « Ajouter à mon calendrier » (calendrier du téléphone)
 * - pour le créateur seulement : « Modifier » et « Supprimer » (avec confirmation)
 */
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { addToPhoneCalendar } from '@/services/calendar';
import { Event } from '@/types/event';
import { isPast } from '@/utils/date';
import { isParticipant } from '@/utils/events';

type EventActionsProps = {
  event: Event;
};

export function EventActions({ event }: EventActionsProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toggleParticipation, removeEvent } = useEvents();

  // « user !== null » : user peut être null une fraction de seconde pendant la déconnexion
  const isCreator = user !== null && event.createdBy === user.id; // seul le créateur peut modifier / supprimer
  const isParticipating = isParticipant(event, user);
  const past = isPast(event.endDate);

  // Ajout au calendrier du téléphone (fenêtre native « Nouvel événement »)
  async function handleAddToCalendar() {
    const result = await addToPhoneCalendar(event);

    // On affiche un message seulement quand on est sûr de ce qui s'est passé
    if (result === 'added') {
      Alert.alert(t('events.calendarAdded'));
    } else if (result === 'denied') {
      Alert.alert(t('events.calendarDenied'));
    }
  }

  // Suppression : on demande d'abord confirmation
  function confirmDelete() {
    Alert.alert(t('events.deleteTitle'), t('events.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('events.delete'),
        style: 'destructive', // bouton rouge sur iPhone
        onPress: async () => {
          router.back(); // on quitte l'écran avant que l'événement disparaisse
          await removeEvent(event.id);
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {/* Événement terminé : plus de participation ni d'ajout au calendrier */}
      {past ? (
        <Text style={styles.ended}>{t('events.eventEnded')}</Text>
      ) : (
        <>
          <Button
            title={isParticipating ? t('events.participationConfirmed') : t('events.participate')}
            variant={isParticipating ? 'secondary' : 'primary'}
            onPress={() => toggleParticipation(event.id)}
          />
          <Button title={t('events.addToCalendar')} variant="secondary" onPress={handleAddToCalendar} />
        </>
      )}

      {/* Actions réservées au créateur */}
      {isCreator ? (
        <>
          <Button
            title={t('events.edit')}
            variant="secondary"
            onPress={() => router.push({ pathname: '/event/edit/[id]', params: { id: event.id } })}
          />
          <Button title={t('events.delete')} variant="danger" onPress={confirmDelete} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  ended: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
});
