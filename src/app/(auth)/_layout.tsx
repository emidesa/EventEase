/**
 * Layout du groupe (auth) : les écrans de connexion et d'inscription,
 * empilés les uns sur les autres (Stack), sans barre de titre.
 */
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
