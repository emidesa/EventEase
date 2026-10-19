/**
 * En-tête du détail d'un événement : un bandeau de couleur (en attendant les images de catégorie)
 * avec un bouton retour rond en haut à gauche.
 */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';

export function EventDetailHeader() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets(); // pour ne pas placer le bouton sous l'heure / l'encoche

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      {/* Ronds décoratifs */}
      <View style={styles.circleAccent} />
      <View style={styles.circleMint} />

      <Pressable
        style={styles.roundButton}
        onPress={() => router.back()}
        accessibilityLabel={t('common.back')}
      >
        <Ionicons name="chevron-back" size={20} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 220,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  circleAccent: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.accent,
    opacity: 0.3,
  },
  circleMint: {
    position: 'absolute',
    bottom: 10,
    left: -40,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.mint,
    opacity: 0.2,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
