/**
 * Choix de la langue de l'app, dans le Profil.
 * Le choix est appliqué tout de suite et enregistré pour les prochains lancements.
 */
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import { changeAppLanguage } from '@/i18n';

export function LanguageSelector() {
  // i18n.language = la langue actuellement affichée ("fr" ou "en")
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('profile.language')}</Text>

      <View style={styles.chips}>
        {/* Les noms de langue ne sont pas traduits : chacun est écrit dans sa propre langue */}
        <Chip
          label="Français"
          selected={i18n.language === 'fr'}
          onPress={() => changeAppLanguage('fr')}
        />
        <Chip
          label="English"
          selected={i18n.language === 'en'}
          onPress={() => changeAppLanguage('en')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // « Langue » et les puces sur la même ligne
    alignItems: 'center', // centrés en hauteur
    justifyContent: 'space-between', // « Langue » à gauche, les puces à droite
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.small,
    color: colors.text,
  },
  chips: {
    flexDirection: 'row', // les deux puces côte à côte
    gap: spacing.sm,
  },
});
