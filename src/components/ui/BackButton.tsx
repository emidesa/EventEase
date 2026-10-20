/**
 * Bouton rond « retour » (flèche ‹) : revient à l'écran précédent.
 * Utilisé en haut du détail d'un événement et des listes du profil.
 */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

import { colors } from '@/constants/theme';

export function BackButton() {
  const { t } = useTranslation();

  return (
    <Pressable
      style={styles.button}
      onPress={() => router.back()}
      accessibilityLabel={t('common.back')} // lu par le lecteur d'écran (le bouton n'a pas de texte)
    >
      <Ionicons name="chevron-back" size={20} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20, // la moitié de la taille = un rond
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
