/**
 * Onglet Profil : en-tête (« Membre depuis » + titre), avatar et nom, statistiques,
 * menu (« Mes événements », « Événements enregistrés »), choix de la langue et déconnexion.
 */
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanguageSelector } from '@/components/profile/LanguageSelector';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { Avatar } from '@/components/ui/Avatar';
import { MenuItem } from '@/components/ui/MenuItem';
import { colors, fonts, fontSizes, radius, spacing, textStyles } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { events } = useEvents();

  // Après « Se déconnecter », user passe à null alors que l'écran est encore affiché une fraction
  // de seconde (le temps que Stack.Protected montre la connexion) : on n'affiche rien plutôt que planter
  if (!user) {
    return null;
  }

  // Année d'inscription, ex. 2026 (les anciens comptes n'ont pas de date : on n'affiche rien)
  const memberSinceYear = user.createdAt ? new Date(user.createdAt).getFullYear() : null;

  // Statistiques : on compte les événements auxquels l'utilisateur participe, et ceux qu'il a créés
  const participationsCount = events.filter((event) => event.participants.includes(user.id)).length;
  const creationsCount = events.filter((event) => event.createdBy === user.id).length;

  return (
    // SafeAreaView : évite d'écrire sous l'heure et la batterie du téléphone
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* En-tête */}
        <View style={styles.header}>
          {memberSinceYear ? (
            <Text style={textStyles.overline}>
              {t('profile.memberSince', { year: memberSinceYear })}
            </Text>
          ) : null}
          <Text style={textStyles.screenTitle}>{t('profile.title')}</Text>
        </View>

        {/* Avatar, nom et email */}
        <View style={styles.identity}>
          <Avatar name={user.name} size={88} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <ProfileStats participations={participationsCount} creations={creationsCount} />

        {/* Menu */}
        <View style={styles.menu}>
          <MenuItem label={t('profile.menu.myEvents')} onPress={() => router.push('/my-events')} />
          <MenuItem
            label={t('profile.menu.savedEvents')}
            onPress={() => router.push('/saved-events')}
          />
        </View>

        {/* Langue */}
        <View style={styles.card}>
          <LanguageSelector />
        </View>

        {/* Déconnexion : Stack.Protected renvoie automatiquement vers la connexion */}
        <Pressable onPress={signOut} style={styles.logout}>
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </Pressable>
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
  header: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  identity: {
    alignItems: 'center', // centre l'avatar et les textes
    gap: spacing.sm,
  },
  name: {
    fontFamily: fonts.title,
    fontSize: fontSizes.heading,
    color: colors.text,
  },
  email: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  menu: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  logout: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  logoutText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.small,
    color: colors.danger,
  },
});
