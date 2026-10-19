/**
 * Onglet Profil : affiche l'utilisateur connecté et permet de se déconnecter.
 */
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>

      {/* Après la déconnexion, Stack.Protected renvoie automatiquement vers la connexion */}
      <Button title={t('profile.logout')} onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
