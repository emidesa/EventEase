/**
 * Page « liste d'événements » avec un bouton retour et un titre.
 * Utilisée par « Mes événements » et « Événements enregistrés » (même affichage, listes différentes).
 */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventCard } from '@/components/events/EventCard';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { Event } from '@/types/event';

type EventListPageProps = {
  title: string;
  events: Event[];
  emptyText: string; // texte affiché quand la liste est vide
};

export function EventListPage({ title, events, emptyText }: EventListPageProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Les événements triés par date, le plus proche en premier
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* En-tête : bouton retour + titre */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel={t('common.back')}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>{title}</Text>
        </View>

        {sortedEvents.length === 0 ? <Text style={styles.empty}>{emptyText}</Text> : null}

        {sortedEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isParticipating={user ? event.participants.includes(user.id) : false}
            onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })}
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
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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
