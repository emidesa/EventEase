/**
 * Détail d'un événement (version provisoire : le vrai écran arrive à l'étape 2.6).
 * [id] dans le nom du fichier = un paramètre de l'adresse : /event/seed-1 → id = "seed-1".
 */
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import { useEvents } from '@/hooks/useEvents';

export default function EventDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>(); // on lit l'id dans l'adresse
  const { events } = useEvents();

  const event = events.find((e) => e.id === id);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event ? event.title : t('events.notFound')}</Text>
      <Text style={styles.text}>{t('common.comingSoon')}</Text>
      <Button title={t('common.back')} variant="secondary" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.heading,
    color: colors.text,
    textAlign: 'center',
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
