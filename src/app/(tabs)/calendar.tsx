/**
 * Onglet Calendrier : le calendrier du mois (librairie react-native-calendars),
 * avec un point sous les jours qui ont des événements, puis les événements du jour choisi.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventCard } from '@/components/events/EventCard';
import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import '@/i18n/calendarLocales'; // noms des mois et des jours en français / anglais
import { toDateKey } from '@/utils/date';

export default function CalendarScreen() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { events } = useEvents();

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
  const dayEvents = events
    .filter((event) => toDateKey(new Date(event.date)) === selectedDay)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('calendar.title')}</Text>

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

        {/* Les événements du jour choisi */}
        {dayEvents.length === 0 ? <Text style={styles.empty}>{t('calendar.empty')}</Text> : null}

        {dayEvents.map((event) => (
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
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.heading,
    color: colors.text,
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
