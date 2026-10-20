/**
 * Logo de l'app : un carré vert-bleu avec une feuille, suivi du nom « EventEase ».
 * Utilisé en haut de la connexion / inscription et de l'accueil.
 */
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';

export function Logo() {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <View style={styles.square}>
        <Ionicons name="leaf" size={14} color={colors.peach} />
      </View>
      <Text style={styles.appName}>{t('common.appName')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', // le carré et le nom côte à côte
    alignItems: 'center',
    gap: spacing.sm,
  },
  square: {
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
});
