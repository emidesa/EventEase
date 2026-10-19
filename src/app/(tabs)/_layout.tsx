/**
 * Layout du groupe (tabs) : la barre d'onglets en bas de l'écran.
 * On utilise la barre native du téléphone (NativeTabs) : effet « Liquid Glass » sur iOS 26,
 * barre Material sur Android. Chaque <NativeTabs.Trigger> correspond à un fichier du dossier (tabs).
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTranslation } from 'react-i18next';

import { colors, fonts, fontSizes } from '@/constants/theme';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <NativeTabs
      tintColor={colors.primary} // couleur de l'onglet sélectionné
      // Couleur des icônes : gris pour les onglets normaux, vert-bleu pour l'onglet sélectionné
      iconColor={{ default: colors.textMuted, selected: colors.primary }}
      labelStyle={{ fontFamily: fonts.medium, fontSize: fontSizes.overline }}
    >
      {/*
        Icônes fines en contour :
        - src = icône Ionicons transformée en image (utilisée sur iPhone). On n'utilise pas les
          SF Symbols, car iOS les affiche automatiquement en version remplie (« en gras ») dans la barre.
        - md = icône Material (utilisée sur Android, déjà en contour).
        - renderingMode="template" : iOS recolore l'image avec iconColor
          (sinon il garde la couleur d'origine de l'image, qui est blanche).
      */}
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={Ionicons} name="home-outline" />}
          md="home"
          renderingMode="template"
        />
        <NativeTabs.Trigger.Label>{t('tabs.home')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calendar">
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={Ionicons} name="calendar-outline" />}
          md="calendar_month"
          renderingMode="template"
        />
        <NativeTabs.Trigger.Label>{t('tabs.calendar')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="create">
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={Ionicons} name="add-circle-outline" />}
          md="add_circle"
          renderingMode="template"
        />
        <NativeTabs.Trigger.Label>{t('tabs.create')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={Ionicons} name="person-outline" />}
          md="person"
          renderingMode="template"
        />
        <NativeTabs.Trigger.Label>{t('tabs.profile')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
