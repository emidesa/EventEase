/**
 * Onglet Calendrier : le calendrier du mois (librairie react-native-calendars),
 * avec un point sous les jours qui ont des événements, puis les événements du jour choisi.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventCard } from '@/components/events/EventCard';
import { colors, fonts, fontSizes, radius, spacing, textStyles } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { useUserLocation } from '@/hooks/useUserLocation';
import '@/i18n/calendarLocales'; // noms des mois et des jours en français / anglais
import { toDateKey } from '@/utils/date';
import { sortByDate } from '@/utils/events';
import { openEventDetail } from '@/utils/navigation';

export default function CalendarScreen() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { events } = useEvents();
  const userPosition = useUserLocation(); // position du téléphone, pour la distance

  // Le jour choisi, au format "AAAA-MM-JJ" (aujourd'hui au départ)
  const [selectedDay, setSelectedDay] = useState(toDateKey(new Date()));

  // 1. Les jours à marquer d'un point : { "2026-05-24": { marked: true, dotColor: ... }, ... }
  const markedDates: { [day: string]: { marked?: boolean; dotColor?: string; selected?: boolean } } =
    {};
  for (const event of events) {
    markedDates[toDateKey(new Date(event.date))] = { marked: true, dotColor: colors.accent };
  }
  // Le jour choisi : on garde son point s'il en a un, et on l'entoure
  markedDates[selectedDay] = { ...markedDates[selectedDay], selected: true };

  // 2. Les événements du jour choisi, du plus tôt au plus tard
  const dayEvents = sortByDate(
    events.filter((event) => toDateKey(new Date(event.date)) === selectedDay),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* FlatList : la liste des événements du jour ; le titre et le calendrier sont en en-tête */}
      <FlatList
        data={dayEvents}
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
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[textStyles.screenTitle, styles.centered]}>{t('calendar.title')}</Text>

            <View style={styles.calendarCard}>
              <Calendar
                key={i18n.language} // recrée le calendrier quand la langue change
                current={selectedDay} // le mois affiché au départ
                firstDay={1} // la semaine commence le lundi
                enableSwipeMonths // glisser pour changer de mois
                onDayPress={(day: DateData) => setSelectedDay(day.dateString)}
                markedDates={markedDates}
                // Couleurs et polices de l'app
                theme={{
                  calendarBackground: colors.surface,
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: colors.surface,
                  todayTextColor: colors.accent,
                  dayTextColor: colors.text,
                  textDisabledColor: colors.border,
                  textSectionTitleColor: colors.textMuted,
                  monthTextColor: colors.text,
                  arrowColor: colors.primary,
                  textDayFontFamily: fonts.regular,
                  textMonthFontFamily: fonts.title,
                  textDayHeaderFontFamily: fonts.medium,
                }}
              />
            </View>
          </View>
        }
        // Affiché quand le jour choisi n'a aucun événement
        ListEmptyComponent={<Text style={styles.empty}>{t('calendar.empty')}</Text>}
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
    gap: spacing.md, // espace entre le titre et le calendrier
  },
  centered: {
    textAlign: 'center',
  },
  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    overflow: 'hidden',
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
