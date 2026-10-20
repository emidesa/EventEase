/**
 * En-tête des écrans de connexion et d'inscription :
 * le logo, le nom de l'app et la phrase d'accroche, sur fond vert d'eau avec des ronds décoratifs.
 */
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '@/components/ui/Logo';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';

export function AuthHeader() {
  const { t } = useTranslation();

  // Hauteur de la barre d'état du téléphone (heure, batterie), pour ne pas écrire dessous
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
      {/* Ronds décoratifs */}
      <View style={styles.circlePeach} />
      <View style={styles.circleSage} />

      {/* Logo + nom de l'app */}
      <View style={styles.logoRow}>
        <Logo />
      </View>

      <Text style={styles.tagline}>{t('common.tagline')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.mint,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + spacing.lg, // de la place pour la carte qui remonte par-dessus
    overflow: 'hidden', // les ronds qui dépassent sont coupés
  },
  circlePeach: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.peach,
  },
  circleSage: {
    position: 'absolute',
    bottom: 10,
    left: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.sage,
  },
  logoRow: {
    marginBottom: spacing.xl, // espace entre le logo et la phrase d'accroche
  },
  tagline: {
    fontFamily: fonts.title,
    fontSize: fontSizes.heading,
    lineHeight: fontSizes.heading + 4, // hauteur de ligne un peu plus grande que le texte
    color: colors.primary,
  },
});
