/**
 * Layout du groupe (tabs) : la barre d'onglets en bas de l'écran.
 * Chaque <Tabs.Screen> correspond à un fichier du dossier (tabs).
 */
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('tabs.calendar'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: t('tabs.create'),
          tabBarIcon: ({ color, size }) => <Ionicons name="add" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
