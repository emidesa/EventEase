/**
 * Onglet Calendrier
 */
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export default function CalendarScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text>{t('tabs.calendar')}</Text>
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
