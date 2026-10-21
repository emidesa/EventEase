/**
 * Champ de saisie réutilisable : un libellé au-dessus, le champ, et un message d'erreur en dessous.
 */
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'words' | 'sentences';
  multiline?: boolean; // true = champ sur plusieurs lignes (ex. description)
};

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
}: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, multiline ? styles.inputMultiline : null, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        multiline={multiline}
      />

      {/* Le message d'erreur ne s'affiche que s'il y en a un */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm, // espace entre le libellé, le champ et l'erreur
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.small,
    color: colors.text,
  },
  input: {
    height: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.text,
  },
  inputMultiline: {
    height: 110,
    paddingTop: spacing.md,
    textAlignVertical: 'top', // Android : le texte commence en haut du champ
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.danger,
  },
});
