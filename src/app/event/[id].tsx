/**
 * Détail d'un événement : infos (date, horaire, lieu, météo, organisateur, description),
 * puis les boutons d'action (composant EventActions).
 * [id] dans le nom du fichier = un paramètre de l'adresse : /event/seed-1 → id = "seed-1".
 */
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EventActions } from '@/components/events/EventActions';
import { EventDetailHeader } from '@/components/events/EventDetailHeader';
import { EventInfoRow } from '@/components/events/EventInfoRow';
import { OrganizerRow } from '@/components/events/OrganizerRow';
import { Button } from '@/components/ui/Button';
import { colors, fonts, fontSizes, spacing, textStyles } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { useOrganizerName } from '@/hooks/useOrganizerName';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useWeather } from '@/hooks/useWeather';
import { formatFullDate, formatTimeRange } from '@/utils/date';
import { getEventDistanceText } from '@/utils/distance';
import { getWeatherType, WEATHER_ICONS } from '@/utils/weather';

export default function EventDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>(); // on lit l'id dans l'adresse
  const { user, toggleFavorite } = useAuth();
  const { events } = useEvents();

  const event = events.find((e) => e.id === id);
  const organizerName = useOrganizerName(event ? event.createdBy : '');
  const weather = useWeather(event); // null tant qu'il n'y a pas de météo à afficher
  const userPosition = useUserLocation(); // position du téléphone, pour la distance

  // L'événement n'existe pas (ou vient d'être supprimé)
  if (!event || !user) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.text}>{t('events.notFound')}</Text>
        <Button title={t('common.back')} variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  const eventId = event.id;
  const distance = getEventDistanceText(userPosition, event.location); // ex. "1,2 km", ou null

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <EventDetailHeader
        isFavorite={user.favorites.includes(eventId)}
        onToggleFavorite={() => toggleFavorite(eventId)}
      />

      <View style={styles.card}>
        <Text style={[textStyles.overline, styles.category]}>{t(`categories.${event.category}`)}</Text>
        <Text style={textStyles.screenTitle}>{event.title}</Text>

        <EventInfoRow
          icon="calendar-outline"
          title={formatFullDate(event.date)}
          subtitle={formatTimeRange(event.date, event.endDate)}
        />
        {event.location ? (
          <EventInfoRow
            icon="location-outline"
            title={event.location.name}
            subtitle={distance ? t('events.distanceFromYou', { distance }) : undefined}
          />
        ) : null}

        {/* Météo du jour (Open-Meteo) : affichée seulement si elle est disponible */}
        {weather ? (
          <EventInfoRow
            icon={WEATHER_ICONS[getWeatherType(weather.code)]}
            title={t(`weather.${getWeatherType(weather.code)}`)}
            subtitle={t('weather.temperatures', {
              max: weather.maxTemperature,
              min: weather.minTemperature,
            })}
          />
        ) : null}

        <View style={styles.divider} />
        <OrganizerRow name={organizerName} />
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>{t('events.about')}</Text>
        <Text style={styles.text}>{event.description}</Text>

        <Text style={styles.participants}>
          {t('events.participantsCount', { count: event.participants.length })}
        </Text>

        {/* Participer, ajouter au calendrier, modifier / supprimer (pour le créateur) */}
        <EventActions event={event} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  card: {
    flex: 1,
    marginTop: -spacing.lg, // la carte remonte sur le bandeau
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
    gap: spacing.md,
  },
  category: {
    color: colors.accent, // la catégorie est en corail (le reste vient de textStyles.overline)
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    fontFamily: fonts.title,
    fontSize: fontSizes.large + 2,
    color: colors.text,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    lineHeight: fontSizes.small + 6,
    color: colors.textMuted,
  },
  participants: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.small,
    color: colors.primary,
  },
});
