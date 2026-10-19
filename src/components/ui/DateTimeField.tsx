/**
 * Champ pour choisir une date ET une heure avec le sélecteur NATIF du téléphone.
 * Le champ affiche la valeur (« dim. 24 mai 2026 · 14:00 ») ; on appuie dessus pour la changer :
 * - iPhone : une fenêtre s'ouvre en bas de l'écran avec le calendrier natif et l'heure dessus,
 *   et un bouton « OK » pour la fermer
 * - Android : la fenêtre du calendrier s'ouvre, puis celle de l'horloge
 *
 * Exemple : <DateTimeField label="Début" value={start} onChange={setStart} />
 */
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';
import { formatFullDate, formatTime } from '@/utils/date';

type DateTimeFieldProps = {
  label: string;
  value: Date;
  onChange: (newValue: Date) => void;
  minimumDate?: Date; // les jours avant cette date ne sont pas sélectionnables
  error?: string;
};

export function DateTimeField({ label, value, onChange, minimumDate, error }: DateTimeFieldProps) {
  const { t, i18n } = useTranslation();

  // iPhone : la fenêtre du calendrier est-elle ouverte ?
  const [isOpen, setIsOpen] = useState(false);

  // Texte affiché dans le champ : « dimanche 24 mai 2026 · 14:00 »
  const isoValue = value.toISOString();
  const displayedValue = `${formatFullDate(isoValue)} · ${formatTime(isoValue)}`;

  // Android : pas de calendrier + heure en un seul écran, on ouvre donc deux fenêtres à la suite
  function openAndroidPicker() {
    // 1. On choisit le jour...
    DateTimePickerAndroid.open({
      value,
      mode: 'date',
      minimumDate,
      onValueChange: (_event, selectedDay) => {
        // 2. ...puis l'heure, en partant du jour choisi
        DateTimePickerAndroid.open({
          value: selectedDay,
          mode: 'time',
          is24Hour: i18n.language === 'fr', // 24 h en français, AM/PM en anglais
          onValueChange: (_event2, selectedDateTime) => onChange(selectedDateTime),
        });
      },
    });
  }

  function handlePress() {
    if (Platform.OS === 'ios') {
      setIsOpen(true);
    } else {
      openAndroidPicker();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* Le champ fermé : il affiche la date et l'heure choisies */}
      <Pressable style={[styles.field, error ? styles.fieldError : null]} onPress={handlePress}>
        <Text style={styles.fieldText}>{displayedValue}</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* iPhone : fenêtre en bas de l'écran avec le calendrier natif (date + heure) */}
      {Platform.OS === 'ios' ? (
        <Modal visible={isOpen} transparent animationType="slide">
          {/* Le fond gris : un appui dessus ferme aussi la fenêtre */}
          <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)} />

          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <DateTimePicker
              value={value}
              mode="datetime"
              display="inline" // le calendrier avec la ligne de l'heure
              minimumDate={minimumDate}
              locale={i18n.language === 'en' ? 'en-US' : 'fr-FR'}
              accentColor={colors.primary}
              themeVariant="light" // toujours lisible, même si le téléphone est en mode sombre
              onValueChange={(_event, selectedDate) => onChange(selectedDate)}
            />
            <Button title={t('common.ok')} onPress={() => setIsOpen(false)} />
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.small,
    color: colors.text,
  },
  field: {
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  fieldText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.text,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.danger,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // noir transparent à 30 %
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  sheetTitle: {
    fontFamily: fonts.title,
    fontSize: fontSizes.heading - 6,
    color: colors.text,
    textAlign: 'center',
  },
});
