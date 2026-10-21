/**
 * Puce en forme de pilule, sélectionnable.
 * Utilisée pour les filtres de catégorie, la catégorie du formulaire et le choix de la langue.
 */
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable style={[styles.chip, selected ? styles.chipSelected : null]} onPress={onPress}>
      <Text style={[styles.text, selected ? styles.textSelected : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  textSelected: {
    color: colors.surface,
  },
});
