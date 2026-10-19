/**
 * En-tête de l'accueil : le logo, « BONJOUR, LÉA » et le titre
 * « Quel moment allons-nous partager ? » avec le mot « partager » en italique corail.
 */
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';

type HomeHeaderProps = {
  firstName: string;
};

export function HomeHeader({ firstName }: HomeHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Logo + nom de l'app */}
      <View style={styles.logoRow}>
        <View style={styles.logo}>
          <Ionicons name="leaf" size={14} color={colors.peach} />
        </View>
        <Text style={styles.appName}>{t('common.appName')}</Text>
      </View>

      <Text style={styles.overline}>{t('home.greeting', { name: firstName })}</Text>

      {/*
        Un <Text> dans un <Text> permet de changer le style d'un seul mot.
        La phrase est découpée en 3 traductions pour pouvoir styler le mot du milieu.
      */}
      <Text style={styles.title}>
        {t('home.titleStart')}
        <Text style={styles.titleHighlight}>{t('home.titleHighlight')}</Text>
        {t('home.titleEnd')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
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
  overline: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.overline,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.heading,
    lineHeight: fontSizes.heading + 4,
    color: colors.text,
  },
  titleHighlight: {
    fontFamily: fonts.titleItalic,
    color: colors.accent,
  },
});
