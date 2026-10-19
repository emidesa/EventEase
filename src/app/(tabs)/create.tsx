/**
 * Onglet « + » : création d'un événement 
 */
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export default function CreateScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text>{t('tabs.create')}</Text>
      <Text>{t('common.comingSoon')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
