/**
 * Formulaire d'un événement : nom, description, lieu, début et fin, catégorie.
 * Il sert pour la CRÉATION (champs vides) et servira pour la MODIFICATION (champs pré-remplis).
 * Quand tout est valide, il appelle onSubmit avec les données ; c'est l'écran qui décide quoi en faire.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { DateTimeField } from '@/components/ui/DateTimeField';
import { TextField } from '@/components/ui/TextField';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import { buildEventLocation } from '@/services/location';
import { EVENT_CATEGORIES, EventCategory, EventFormData } from '@/types/event';

type EventFormProps = {
  initialValues?: EventFormData; // pour la modification : les valeurs actuelles de l'événement
  submitLabel: string; // texte du bouton : « Créer l'événement » ou « Enregistrer »
  onSubmit: (data: EventFormData) => Promise<void>;
};

/** Valeurs par défaut d'un nouvel événement : demain, de 14:00 à 16:00. */
function getDefaultDate(hours: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + 1); // demain
  date.setHours(hours, 0, 0, 0);
  return date;
}

export function EventForm({ initialValues, submitLabel, onSubmit }: EventFormProps) {
  const { t } = useTranslation();

  // Valeurs du formulaire. "??" = si initialValues n'existe pas, on prend la valeur de droite.
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [placeName, setPlaceName] = useState(initialValues?.location?.name ?? ''); // facultatif
  const [category, setCategory] = useState<EventCategory>(initialValues?.category ?? 'atelier');
  // Début et fin : chacun a un jour ET une heure (choisis dans le calendrier natif)
  const [start, setStart] = useState(
    initialValues ? new Date(initialValues.date) : getDefaultDate(14),
  );
  const [end, setEnd] = useState(
    initialValues ? new Date(initialValues.endDate) : getDefaultDate(16),
  );

  // Messages d'erreur ('' = pas d'erreur)
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [timeError, setTimeError] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    // 1. On transforme les dates en texte ISO, le format enregistré
    const date = start.toISOString();
    const endDate = end.toISOString();

    // 2. On vérifie les champs
    let hasError = false;

    if (title.trim() === '') {
      setTitleError(t('errors.required'));
      hasError = true;
    } else {
      setTitleError('');
    }

    if (description.trim() === '') {
      setDescriptionError(t('errors.required'));
      hasError = true;
    } else {
      setDescriptionError('');
    }

    // Les dates ISO se comparent directement comme du texte (même format)
    if (endDate <= date) {
      setTimeError(t('errors.endBeforeStart'));
      hasError = true;
    } else {
      setTimeError('');
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    // 3. Le lieu : on cherche ses coordonnées GPS à partir de l'adresse tapée (géocodage)
    const location = await buildEventLocation(placeName, initialValues?.location);

    // 4. Tout est bon : on envoie les données à l'écran
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      date,
      endDate,
      location,
    });
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <TextField
        label={t('form.title')}
        placeholder={t('form.titlePlaceholder')}
        value={title}
        onChangeText={setTitle}
        error={titleError}
      />

      <TextField
        label={t('form.description')}
        placeholder={t('form.descriptionPlaceholder')}
        value={description}
        onChangeText={setDescription}
        error={descriptionError}
        multiline
      />

      <TextField
        label={t('form.location')}
        placeholder={t('form.locationPlaceholder')}
        value={placeName}
        onChangeText={setPlaceName}
      />

      {/* Début et fin : un appui ouvre le calendrier natif. En création, pas de jour passé */}
      <DateTimeField
        label={t('form.start')}
        value={start}
        onChange={setStart}
        minimumDate={initialValues ? undefined : new Date()}
      />

      <DateTimeField
        label={t('form.end')}
        value={end}
        onChange={setEnd}
        minimumDate={start} // la fin ne peut pas être un jour avant le début
        error={timeError}
      />

      {/* Catégorie : une puce par catégorie */}
      <View style={styles.categoryBlock}>
        <Text style={styles.label}>{t('form.category')}</Text>
        <View style={styles.chips}>
          {EVENT_CATEGORIES.map((item) => (
            <Chip
              key={item}
              label={t(`categories.${item}`)}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          ))}
        </View>
      </View>

      <Button title={submitLabel} onPress={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  categoryBlock: {
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.small,
    color: colors.text,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap', // passe à la ligne si ça ne tient pas
    gap: spacing.sm,
  },
});
