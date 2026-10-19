/**
 * Détail d'un événement : infos (date, horaire, lieu, organisateur, description),
 * bouton « Je participe », et pour le créateur seulement : Modifier / Supprimer.
 * [id] dans le nom du fichier = un paramètre de l'adresse : /event/seed-1 → id = "seed-1".
 */
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EventDetailHeader } from '@/components/events/EventDetailHeader';
import { EventInfoRow } from '@/components/events/EventInfoRow';
import { OrganizerRow } from '@/components/events/OrganizerRow';
import { Button } from '@/components/ui/Button';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { useOrganizerName } from '@/hooks/useOrganizerName';
import { addToPhoneCalendar } from '@/services/calendar';
import { formatFullDate, formatTimeRange, isPast } from '@/utils/date';

export default function EventDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>(); // on lit l'id dans l'adresse
  const { user, toggleFavorite } = useAuth();
  const { events, toggleParticipation, removeEvent } = useEvents();

  const event = events.find((e) => e.id === id);
  const organizerName = useOrganizerName(event ? event.createdBy : '');

  // L'événement n'existe pas (ou vient d'être supprimé)
  if (!event || !user) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.text}>{t('events.notFound')}</Text>
        <Button title={t('common.back')} variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  const eventId = event.id;
  const isCreator = event.createdBy === user.id; // seul le créateur peut modifier / supprimer
  const isParticipating = event.participants.includes(user.id);
  const past = isPast(event.endDate);

  // Ajout au calendrier du téléphone (fenêtre native « Nouvel événement »)
  const currentEvent = event; // copie qui garde le type « Event » (sans undefined) dans la fonction
  async function handleAddToCalendar() {
    const result = await addToPhoneCalendar(currentEvent);

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
          await removeEvent(eventId);
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <EventDetailHeader
        isFavorite={user.favorites.includes(eventId)}
        onToggleFavorite={() => toggleFavorite(eventId)}
      />

      <View style={styles.card}>
        <Text style={styles.category}>{t(`categories.${event.category}`)}</Text>
        <Text style={styles.title}>{event.title}</Text>

        <EventInfoRow
          icon="calendar-outline"
          title={formatFullDate(event.date)}
          subtitle={formatTimeRange(event.date, event.endDate)}
        />
        {event.location ? <EventInfoRow icon="location-outline" title={event.location.name} /> : null}

        <View style={styles.divider} />
        <OrganizerRow name={organizerName} />
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>{t('events.about')}</Text>
        <Text style={styles.text}>{event.description}</Text>

        <Text style={styles.participants}>
          {t('events.participantsCount', { count: event.participants.length })}
        </Text>

        {/* Participation : impossible si l'événement est terminé */}
        {past ? (
          <Text style={styles.text}>{t('events.eventEnded')}</Text>
        ) : (
          <Button
            title={isParticipating ? t('events.participationConfirmed') : t('events.participate')}
            variant={isParticipating ? 'secondary' : 'primary'}
            onPress={() => toggleParticipation(eventId)}
          />
        )}

        {/* Ajouter l'événement dans le calendrier du téléphone (seulement s'il n'est pas terminé) */}
        {past ? null : (
          <Button
            title={t('events.addToCalendar')}
            variant="secondary"
            onPress={handleAddToCalendar}
          />
        )}

        {/* Actions réservées au créateur */}
        {isCreator ? (
          <View style={styles.ownerActions}>
            <Button
              title={t('events.edit')}
              variant="secondary"
              onPress={() => router.push({ pathname: '/event/edit/[id]', params: { id: eventId } })}
            />
            <Button title={t('events.delete')} variant="danger" onPress={confirmDelete} />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  card: {
    flex: 1,
    marginTop: -spacing.lg, // la carte remonte sur le bandeau
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
    gap: spacing.md,
  },
  category: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.overline,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.heading,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    fontFamily: fonts.title,
    fontSize: fontSizes.large + 2,
    color: colors.text,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    lineHeight: fontSizes.small + 6,
    color: colors.textMuted,
  },
  participants: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.small,
    color: colors.primary,
  },
  ownerActions: {
    gap: spacing.sm,
  },
});
