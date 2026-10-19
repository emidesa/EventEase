/**
 * Carte d'un événement dans la liste « Prochains rendez-vous » :
 * bloc date à gauche, puis catégorie, titre, description, horaire, lieu et badge « Je participe ».
 * Un événement passé est affiché grisé.
 */
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';
import { Event } from '@/types/event';
import { formatDayNumber, formatMonthShort, formatTimeRange, isPast } from '@/utils/date';

type EventCardProps = {
  event: Event;
  isParticipating: boolean; // l'utilisateur connecté participe-t-il ?
  onPress: () => void;
};

export function EventCard({ event, isParticipating, onPress }: EventCardProps) {
  const { t } = useTranslation();
  const past = isPast(event.endDate);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, past && styles.past, pressed && styles.pressed]}
    >
      {/* Bloc date : « 24 MAI » */}
      <View style={styles.dateBlock}>
        <Text style={styles.day}>{formatDayNumber(event.date)}</Text>
        <Text style={styles.month}>{formatMonthShort(event.date)}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.category}>
          {past ? t('events.past') : t(`categories.${event.category}`)}
        </Text>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>

        {/* Horaire */}
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.infoText}>{formatTimeRange(event.date, event.endDate)}</Text>
        </View>

        {/* Lieu (seulement s'il y en a un) */}
        {event.location ? (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.infoText}>{event.location.name}</Text>
          </View>
        ) : null}

        {/* Badge « Je participe » (seulement si l'utilisateur participe) */}
        {isParticipating ? (
          <View style={styles.participatingBadge}>
            <Ionicons name="checkmark" size={14} color={colors.primary} />
            <Text style={styles.participatingText}>{t('events.participating')}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // bloc date à gauche, contenu à droite
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  past: {
    opacity: 0.5, // événement terminé : grisé
  },
  pressed: {
    opacity: 0.8,
  },
  dateBlock: {
    width: 56,
    height: 64,
    borderRadius: radius.input,
    backgroundColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    fontFamily: fonts.title,
    fontSize: fontSizes.heading - 6,
    color: colors.text,
  },
  month: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.overline - 2,
    textTransform: 'uppercase',
    color: colors.text,
  },
  content: {
    flex: 1, // prend toute la place restante
    gap: spacing.xs,
  },
  category: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.overline - 2,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.body,
    color: colors.text,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small - 1,
    color: colors.textMuted,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small - 2,
    color: colors.textMuted,
  },
  participatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // le badge ne prend que la largeur de son contenu
    gap: spacing.xs,
    marginTop: spacing.xs,
    backgroundColor: colors.mint,
    borderRadius: radius.input - 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  participatingText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.small - 2,
    color: colors.primary,
  },
});
