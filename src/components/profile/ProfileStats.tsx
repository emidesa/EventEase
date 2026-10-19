/**
 * Statistiques du profil : nombre de participations et nombre d'événements créés,
 * entre deux traits de séparation.
 * Pour l'instant les chiffres valent 0 : ils seront calculés au jour 2 avec les événements.
 */
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, spacing } from '@/constants/theme';

type ProfileStatsProps = {
  participations: number;
  creations: number;
};

export function ProfileStats({ participations, creations }: ProfileStatsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.number}>{participations}</Text>
        <Text style={styles.label}>{t('profile.stats.participations')}</Text>
      </View>

      <View style={styles.stat}>
        <Text style={styles.number}>{creations}</Text>
        <Text style={styles.label}>{t('profile.stats.creations')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // les statistiques côte à côte
    paddingVertical: spacing.md,
    borderTopWidth: 1, // trait au-dessus
    borderBottomWidth: 1, // trait en dessous
    borderColor: colors.border,
  },
  stat: {
    flex: 1, // chaque statistique prend la même largeur
    alignItems: 'center',
    gap: spacing.xs,
  },
  number: {
    fontFamily: fonts.title,
    fontSize: fontSizes.heading,
    color: colors.primary,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
});
