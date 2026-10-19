/**
 * Onglet Profil : en-tête (« Membre depuis » + titre), avatar et nom, statistiques,
 * menu, choix de la langue et déconnexion.
 * Les statistiques et le menu seront branchés sur les vrais événements au jour 2.
 */
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanguageSelector } from '@/components/profile/LanguageSelector';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { Avatar } from '@/components/ui/Avatar';
import { MenuItem } from '@/components/ui/MenuItem';
import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  // Normalement impossible (l'onglet n'est accessible que connecté), mais TypeScript veut qu'on le gère
  if (!user) {
    return null;
  }

  // Année d'inscription, ex. 2026 (les anciens comptes n'ont pas de date : on n'affiche rien)
  const memberSinceYear = user.createdAt ? new Date(user.createdAt).getFullYear() : null;

  // En attendant les écrans du jour 2
  function showComingSoon() {
    Alert.alert(t('common.comingSoon'));
  }

  return (
    // SafeAreaView : évite d'écrire sous l'heure et la batterie du téléphone
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* En-tête */}
        <View style={styles.header}>
          {memberSinceYear ? (
            <Text style={styles.overline}>
              {t('profile.memberSince', { year: memberSinceYear })}
            </Text>
          ) : null}
          <Text style={styles.screenTitle}>{t('profile.title')}</Text>
        </View>

        {/* Avatar, nom et email */}
        <View style={styles.identity}>
          <Avatar name={user.name} size={88} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Statistiques (0 pour l'instant, calculées au jour 2) */}
        <ProfileStats participations={0} creations={0} />

        {/* Menu */}
        <View style={styles.menu}>
          <MenuItem label={t('profile.menu.myEvents')} onPress={showComingSoon} />
          <MenuItem label={t('profile.menu.savedEvents')} onPress={showComingSoon} />
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
  overline: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.overline,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  screenTitle: {
    fontFamily: fonts.title,
    fontSize: fontSizes.heading,
    color: colors.text,
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
