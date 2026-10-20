/**
 * En-tête de l'accueil : le logo, « BONJOUR, LÉA » et le titre
 * « Quel moment allons-nous partager ? » avec le mot « partager » en italique corail.
 */
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Logo } from '@/components/ui/Logo';
import { colors, fonts, fontSizes, spacing, textStyles } from '@/constants/theme';

type HomeHeaderProps = {
  firstName: string;
};

export function HomeHeader({ firstName }: HomeHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Logo + nom de l'app */}
      <View style={styles.logoRow}>
        <Logo />
      </View>

      <Text style={textStyles.overline}>{t('home.greeting', { name: firstName })}</Text>

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
    marginBottom: spacing.md, // espace entre le logo et « BONJOUR »
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
