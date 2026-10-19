/**
 * Écran d'inscription
 */
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text>{t('auth.register.title')}</Text>

      {/* Lien vers l'écran de connexion */}
      <Link href="/login">{t('auth.tabs.login')}</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
});
