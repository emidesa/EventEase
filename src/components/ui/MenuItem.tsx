/**
 * Ligne de menu cliquable : un texte à gauche et une flèche › à droite (comme sur la maquette).
 */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';

type MenuItemProps = {
  label: string;
  onPress: () => void;
};

export function MenuItem({ label, onPress }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // texte à gauche, flèche à droite
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.body,
    color: colors.text,
  },
});
