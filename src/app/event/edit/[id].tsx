/**
 * Modification d'un événement : le même formulaire que la création (EventForm),
 * mais pré-rempli avec les valeurs actuelles. Réservé au créateur de l'événement.
 */
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventForm } from '@/components/events/EventForm';
import { Button } from '@/components/ui/Button';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { EventFormData } from '@/types/event';

export default function EditEventScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { events, editEvent } = useEvents();

  const event = events.find((e) => e.id === id);

  // Sécurité : événement introuvable, ou l'utilisateur n'en est pas le créateur
  if (!event || !user || event.createdBy !== user.id) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('events.notFound')}</Text>
          <Button title={t('common.back')} variant="secondary" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const eventId = event.id;

  async function handleSave(data: EventFormData) {
    await editEvent(eventId, data);
    router.back(); // retour au détail, qui affiche déjà les nouvelles valeurs
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.overline}>{t('edit.overline')}</Text>
            <Text style={styles.title}>{t('edit.title')}</Text>
          </View>

          {/* Le même formulaire que la création, rempli avec les valeurs de l'événement */}
          <EventForm
            initialValues={{
              title: event.title,
              description: event.description,
              category: event.category,
              date: event.date,
              endDate: event.endDate,
              location: event.location,
            }}
            submitLabel={t('form.submitEdit')}
            onSubmit={handleSave}
          />

          <Button title={t('common.cancel')} variant="secondary" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
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
    color: colors.text,
    textAlign: 'center',
  },
});
