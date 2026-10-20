/**
 * Onglet Accueil : salutation, filtres par catégorie, événement mis en avant
 * et liste des événements (« Prochains rendez-vous »).
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryFilter, CategoryFilterValue } from '@/components/events/CategoryFilter';
import { EventCard } from '@/components/events/EventCard';
import { FeaturedEventCard } from '@/components/events/FeaturedEventCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { colors, fonts, fontSizes, spacing, textStyles } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { useUserLocation } from '@/hooks/useUserLocation';
import { isPast } from '@/utils/date';
import { sortByDate } from '@/utils/events';
import { openEventDetail } from '@/utils/navigation';
import { getFirstName } from '@/utils/text';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { events, isLoading } = useEvents();
  const userPosition = useUserLocation(); // position du téléphone, pour la distance

  const [category, setCategory] = useState<CategoryFilterValue>('all');

  // 1. On trie les événements par date (le plus proche en premier)
  const sortedEvents = sortByDate(events);

  // 2. On garde seulement la catégorie choisie (ou tout, si "all")
  const filteredEvents = sortedEvents.filter(
    (event) => category === 'all' || event.category === category,
  );

  // 3. L'événement mis en avant = le premier événement à venir
  const featuredEvent = filteredEvents.find((event) => !isPast(event.endDate));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/*
        FlatList : n'affiche que les cartes visibles à l'écran (plus efficace qu'une ScrollView
        si la liste devient longue). Tout ce qui est au-dessus de la liste va dans ListHeaderComponent.
      */}
      <FlatList
        data={filteredEvents} // la liste à afficher
        keyExtractor={(event) => event.id} // identifiant unique de chaque carte (comme "key")
        renderItem={({ item }) => (
          <EventCard
            event={item}
            // user peut être null une fraction de seconde pendant la déconnexion
            isParticipating={user ? item.participants.includes(user.id) : false}
            userPosition={userPosition}
            onPress={() => openEventDetail(item.id)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <HomeHeader firstName={user ? getFirstName(user.name) : ''} />

            <CategoryFilter selected={category} onChange={setCategory} />

            {isLoading ? <ActivityIndicator color={colors.primary} /> : null}

            {featuredEvent ? (
              <FeaturedEventCard
                event={featuredEvent}
                onPress={() => openEventDetail(featuredEvent.id)}
              />
            ) : null}

            {/* Titre de la liste */}
            <View>
              <Text style={textStyles.overline}>{t('home.upcomingOverline')}</Text>
              <Text style={styles.sectionTitle}>{t('home.upcomingTitle')}</Text>
            </View>
          </View>
        }
        // Affiché à la place de la liste quand elle est vide
        ListEmptyComponent={
          isLoading ? null : <Text style={styles.empty}>{t('home.empty')}</Text>
        }
        contentContainerStyle={styles.content}
      />
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
    gap: spacing.md, // espace entre l'en-tête et chaque carte
  },
  header: {
    gap: spacing.lg, // espace entre les éléments de l'en-tête
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
