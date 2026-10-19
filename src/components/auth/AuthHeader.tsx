/**
 * En-tête des écrans de connexion et d'inscription :
 * le logo, le nom de l'app et la phrase d'accroche, sur fond vert d'eau avec des ronds décoratifs.
 */
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';

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
        <View style={styles.logo}>
          <Ionicons name="leaf" size={14} color={colors.peach} />
        </View>
        <Text style={styles.appName}>{t('common.appName')}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: radius.input,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.large,
    color: colors.text,
  },
  tagline: {
    fontFamily: fonts.title,
    fontSize: fontSizes.heading,
    lineHeight: fontSizes.heading + 4, // hauteur de ligne un peu plus grande que le texte
    color: colors.primary,
  },
});
