/**
 * Grande carte « Notre sélection » de l'accueil : met en avant le prochain événement.
 * (Les images de catégorie arriveront plus tard : pour l'instant, fond vert-bleu.)
 */
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';
import { Event } from '@/types/event';
import { formatDayNumber, formatMonthShort } from '@/utils/date';

type FeaturedEventCardProps = {
  event: Event;
  onPress: () => void;
};

export function FeaturedEventCard({ event, onPress }: FeaturedEventCardProps) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {/* Rond décoratif */}
      <View style={styles.circle} />

      {/* En haut : badge « Notre sélection » à gauche, date à droite */}
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{t('home.featuredBadge')}</Text>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{formatDayNumber(event.date)}</Text>
          <Text style={styles.dateText}>{formatMonthShort(event.date)}</Text>
        </View>
      </View>

      {/* En bas : titre et flèche */}
      <View style={styles.bottomRow}>
        <View style={styles.texts}>
          <Text style={styles.overline}>{t(`categories.${event.category}`)}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
        </View>
        <View style={styles.arrow}>
          <Ionicons name="chevron-forward" size={18} color={colors.text} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 190,
    borderRadius: radius.card + 4,
    backgroundColor: colors.primary,
    padding: spacing.md,
    justifyContent: 'space-between', // le haut en haut, le bas en bas
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
  },
  circle: {
    position: 'absolute',
    right: -40,
    bottom: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.accent,
    opacity: 0.25,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.overline - 2,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  dateBadge: {
    backgroundColor: colors.accent,
    borderRadius: radius.input,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  dateText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.overline - 2,
    textTransform: 'uppercase',
    color: colors.surface,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  overline: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.overline - 2,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.mint,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.heading - 4,
    lineHeight: fontSizes.heading,
    color: colors.surface,
  },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
