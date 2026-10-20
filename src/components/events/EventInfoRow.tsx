/**
 * Ligne d'information du détail d'un événement : une icône dans un carré vert d'eau,
 * puis un texte principal et un texte secondaire (comme sur la maquette).
 */
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';

/** Les icônes Ionicons utilisées dans le détail (date, lieu, météo). */
export type InfoIcon =
  | 'calendar-outline'
  | 'location-outline'
  | 'sunny-outline'
  | 'partly-sunny-outline'
  | 'cloud-outline'
  | 'rainy-outline'
  | 'snow-outline'
  | 'thunderstorm-outline';

type EventInfoRowProps = {
  icon: InfoIcon;
  title: string;
  subtitle?: string;
};

export function EventInfoRow({ icon, title, subtitle }: EventInfoRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>

      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.input,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.small,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small - 2,
    color: colors.textMuted,
  },
});
