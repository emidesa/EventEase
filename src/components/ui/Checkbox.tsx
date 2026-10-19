/**
 * Case à cocher avec un texte à côté.
 */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, spacing } from '@/constants/theme';

type CheckboxProps = {
  checked: boolean;
  onPress: () => void;
  label: string;
};

export function Checkbox({ checked, onPress, label }: CheckboxProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* La case : remplie avec une coche quand elle est cochée */}
      <View style={[styles.box, checked ? styles.boxChecked : null]}>
        {checked ? <Ionicons name="checkmark" size={14} color={colors.surface} /> : null}
      </View>

      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // la case et le texte côte à côte
    alignItems: 'center',
    gap: spacing.sm,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.textMuted,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    flex: 1, // le texte prend la place restante et passe à la ligne si besoin
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
});
