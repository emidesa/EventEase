/**
 * Mise en page commune aux écrans de connexion et d'inscription :
 * l'en-tête, puis une carte avec le sélecteur, le surtitre, le sous-titre et le formulaire.
 * Le formulaire est passé en "children" (ce qu'on met entre <AuthScreen> et </AuthScreen>).
 */
import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import { AuthHeader } from './AuthHeader';
import { AuthSwitch } from './AuthSwitch';

type AuthScreenProps = {
  active: 'login' | 'register';
  overline: string; // texte en majuscules, centré (ex. « HEUREUX DE VOUS REVOIR »)
  subtitle: string; // petite phrase centrée en dessous
  children: ReactNode;
};

export function AuthScreen({ active, overline, subtitle, children }: AuthScreenProps) {
  return (
    // Remonte le contenu quand le clavier s'ouvre, pour que les champs restent visibles (iPhone)
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ScrollView : on peut faire défiler si l'écran est petit */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" // un appui sur un bouton marche même clavier ouvert
      >
        <AuthHeader />

        <View style={styles.card}>
          <AuthSwitch active={active} />

          <View style={styles.titleBlock}>
            <Text style={styles.overline}>{overline}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: -spacing.lg, // la carte remonte un peu sur l'en-tête
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    gap: spacing.lg, // espace entre chaque élément de la carte (sélecteur, titre, champs, bouton)
  },
  titleBlock: {
    marginTop: spacing.sm, // un peu d'air entre le sélecteur et le surtitre
    gap: spacing.md, // espace entre le surtitre et le sous-titre
  },
  overline: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: colors.primary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
