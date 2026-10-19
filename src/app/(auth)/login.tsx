/**
 * Écran de connexion 
 */
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text>{t('auth.login.title')}</Text>

      {/* Lien vers l'écran d'inscription */}
      <Link href="/register">{t('auth.tabs.register')}</Link>
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
