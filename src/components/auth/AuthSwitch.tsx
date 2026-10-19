/**
 * Sélecteur « Connexion | Inscription » en haut des formulaires.
 * L'onglet actif est sur fond blanc ; appuyer sur l'autre ouvre l'écran correspondant.
 */
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';

type AuthSwitchProps = {
  active: 'login' | 'register'; // l'écran sur lequel on est
};

export function AuthSwitch({ active }: AuthSwitchProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.option, active === 'login' ? styles.optionActive : null]}
        // replace (et pas push) : on remplace l'écran au lieu d'en empiler un nouveau
        onPress={() => router.replace('/login')}
      >
        <Text style={[styles.text, active === 'login' ? styles.textActive : null]}>
          {t('auth.tabs.login')}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.option, active === 'register' ? styles.optionActive : null]}
        onPress={() => router.replace('/register')}
      >
        <Text style={[styles.text, active === 'register' ? styles.textActive : null]}>
          {t('auth.tabs.register')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: radius.input,
    padding: spacing.xs,
  },
  option: {
    flex: 1, // les deux options prennent la même largeur
    paddingVertical: spacing.sm,
    borderRadius: radius.input - 4,
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: colors.surface,
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  textActive: {
    color: colors.primary,
  },
});
