/**
 * Layout racine : c'est le premier composant affiché par l'app.
 * Il charge les polices, donne accès à l'utilisateur connecté (AuthProvider)
 * et choisit quoi afficher : les écrans de connexion ou l'application.
 */
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
} from '@expo-google-fonts/dm-serif-display';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

import { AuthProvider } from '@/context/AuthContext';
import { EventsProvider } from '@/context/EventsContext';
import { useAuth } from '@/hooks/useAuth';
import { loadSavedLanguage } from '@/i18n';

// On garde le splash screen affiché jusqu'à ce que tout soit prêt
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
  });

  // Chargement de la langue choisie dans le Profil (si l'utilisateur en a choisi une)
  const [languageLoaded, setLanguageLoaded] = useState(false);

  useEffect(() => {
    loadSavedLanguage().finally(() => setLanguageLoaded(true));
  }, []);

  if (!fontsLoaded || !languageLoaded) {
    return null;
  }

  return (
    // EventsProvider est À L'INTÉRIEUR d'AuthProvider, car il a besoin de l'utilisateur connecté
    <AuthProvider>
      <EventsProvider>
        <RootNavigator />
      </EventsProvider>
    </AuthProvider>
  );
}

/** Choisit les écrans accessibles selon que l'utilisateur est connecté ou non. */
function RootNavigator() {
  const { user, isLoading } = useAuth();

  // Quand la session a été vérifiée, on peut cacher le splash screen
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Écrans accessibles seulement si l'utilisateur est connecté */}
      <Stack.Protected guard={user !== null}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="event/[id]" />
      </Stack.Protected>

      {/* Écrans accessibles seulement si personne n'est connecté */}
      <Stack.Protected guard={user === null}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
