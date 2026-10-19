/**
 * Bouton réutilisable de l'app.
 * Trois styles : "primary" (fond vert-bleu, texte blanc), "secondary" (fond blanc, bordure)
 * et "danger" (fond blanc, texte et bordure rouges : pour supprimer).
 */
import { ActivityIndicator, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger'; // le "?" veut dire que c'est optionnel
  loading?: boolean; // affiche une roue de chargement à la place du texte
};

export function Button({ title, onPress, variant = 'primary', loading = false }: ButtonProps) {
  const isPrimary = variant === 'primary';

  // On choisit le style du fond et du texte selon la variante
  // ViewStyle / TextStyle : on dit à TypeScript que ces variables contiendront "un style"
  let buttonStyle: ViewStyle = styles.secondary;
  let textStyle: TextStyle = styles.secondaryText;
  if (variant === 'primary') {
    buttonStyle = styles.primary;
    textStyle = styles.primaryText;
  } else if (variant === 'danger') {
    buttonStyle = styles.danger;
    textStyle = styles.dangerText;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={loading} // on ne peut pas appuyer deux fois pendant le chargement
      style={({ pressed }) => [
        styles.button,
        buttonStyle,
        pressed && styles.pressed, // légèrement transparent quand on appuie
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.surface : colors.primary} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
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
  danger: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.danger,
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
  dangerText: {
    color: colors.danger,
  },
});
