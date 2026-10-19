/**
 * Onglet Accueil : salutation, filtres par catégorie, événement mis en avant
 * et liste des événements (« Prochains rendez-vous »).
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryFilter, CategoryFilterValue } from '@/components/events/CategoryFilter';
import { EventCard } from '@/components/events/EventCard';
import { FeaturedEventCard } from '@/components/events/FeaturedEventCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { isPast } from '@/utils/date';
import { getFirstName } from '@/utils/text';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { events, isLoading } = useEvents();

  const [category, setCategory] = useState<CategoryFilterValue>('all');

  // 1. On trie les événements par date (le plus proche en premier).
  //    [...events] fait une copie : on ne modifie jamais la liste d'origine.
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // 2. On garde seulement la catégorie choisie (ou tout, si "all")
  const filteredEvents = sortedEvents.filter(
    (event) => category === 'all' || event.category === category,
  );

  // 3. L'événement mis en avant = le premier événement à venir
  const featuredEvent = filteredEvents.find((event) => !isPast(event.endDate));

  // Ouvre le détail d'un événement
  function openEvent(eventId: string) {
    router.push({ pathname: '/event/[id]', params: { id: eventId } });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <HomeHeader firstName={user ? getFirstName(user.name) : ''} />

        <CategoryFilter selected={category} onChange={setCategory} />

        {isLoading ? <ActivityIndicator color={colors.primary} /> : null}

        {featuredEvent ? (
          <FeaturedEventCard event={featuredEvent} onPress={() => openEvent(featuredEvent.id)} />
        ) : null}

        {/* Titre de la liste */}
        <View>
          <Text style={styles.overline}>{t('home.upcomingOverline')}</Text>
          <Text style={styles.sectionTitle}>{t('home.upcomingTitle')}</Text>
        </View>

        {/* Liste vide */}
        {!isLoading && filteredEvents.length === 0 ? (
          <Text style={styles.empty}>{t('home.empty')}</Text>
        ) : null}

        {/* Une carte par événement */}
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isParticipating={user ? event.participants.includes(user.id) : false}
            onPress={() => openEvent(event.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  overline: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.overline,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  sectionTitle: {
    fontFamily: fonts.title,
    fontSize: fontSizes.heading - 6,
    color: colors.text,
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
