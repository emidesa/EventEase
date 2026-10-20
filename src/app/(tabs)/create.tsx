/**
 * Onglet « + » : création d'un nouvel événement.
 * L'écran affiche le titre et le formulaire ; à l'envoi, il crée l'événement puis revient à l'accueil.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventForm } from '@/components/events/EventForm';
import { colors, spacing, textStyles } from '@/constants/theme';
import { useEvents } from '@/hooks/useEvents';
import { EventFormData } from '@/types/event';

export default function CreateScreen() {
  const { t } = useTranslation();
  const { addEvent } = useEvents();

  // Changer la "key" d'un composant le recrée à neuf : on s'en sert pour vider le formulaire
  const [formKey, setFormKey] = useState(0);

  async function handleCreate(data: EventFormData) {
    await addEvent(data);
    setFormKey(formKey + 1); // formulaire vidé pour la prochaine création
    Alert.alert(t('create.success'));
    router.navigate('/'); // retour à l'accueil, où le nouvel événement apparaît
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={textStyles.overline}>{t('create.overline')}</Text>
            <Text style={textStyles.screenTitle}>{t('create.title')}</Text>
          </View>

          <EventForm key={formKey} submitLabel={t('form.submitCreate')} onSubmit={handleCreate} />
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
});
