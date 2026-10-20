/**
 * Page « liste d'événements » avec un bouton retour et un titre.
 * Utilisée par « Mes événements » et « Événements enregistrés » (même affichage, listes différentes).
 */
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventCard } from '@/components/events/EventCard';
import { BackButton } from '@/components/ui/BackButton';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useUserLocation } from '@/hooks/useUserLocation';
import { Event } from '@/types/event';
import { sortByDate } from '@/utils/events';
import { openEventDetail } from '@/utils/navigation';

type EventListPageProps = {
  title: string;
  events: Event[];
  emptyText: string; // texte affiché quand la liste est vide
};

export function EventListPage({ title, events, emptyText }: EventListPageProps) {
  const { user } = useAuth();
  const userPosition = useUserLocation(); // position du téléphone, pour la distance

  // Les événements triés par date, le plus proche en premier
  const sortedEvents = sortByDate(events);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={sortedEvents}
        keyExtractor={(event) => event.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            // user peut être null une fraction de seconde pendant la déconnexion
            isParticipating={user ? item.participants.includes(user.id) : false}
            userPosition={userPosition}
            onPress={() => openEventDetail(item.id)}
          />
        )}
        // En-tête : bouton retour + titre
        ListHeaderComponent={
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.title}>{title}</Text>
          </View>
        }
        // Affiché quand la liste est vide
        ListEmptyComponent={<Text style={styles.empty}>{emptyText}</Text>}
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
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: fonts.title,
    fontSize: fontSizes.heading - 4,
    color: colors.text,
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    lineHeight: fontSizes.small + 6,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
