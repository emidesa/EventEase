/**
 * Bouton réutilisable de l'app.
 * Deux styles : "primary" (fond vert-bleu, texte blanc) et "secondary" (fond blanc, bordure).
 */
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary'; // le "?" veut dire que c'est optionnel
  loading?: boolean; // affiche une roue de chargement à la place du texte
};

export function Button({ title, onPress, variant = 'primary', loading = false }: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={loading} // on ne peut pas appuyer deux fois pendant le chargement
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed, // légèrement transparent quand on appuie
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.surface : colors.primary} />
      ) : (
        <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
  },
  primaryText: {
    color: colors.surface,
  },
  secondaryText: {
    color: colors.text,
  },
});
