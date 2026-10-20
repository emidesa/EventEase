/**
 * Configuration de la traduction (i18next).
 * Importé une seule fois au démarrage (dans le layout racine) : il suffit ensuite d'utiliser
 * `const { t } = useTranslation()` dans les composants.
 */
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { getSavedLanguage, saveLanguage } from '@/services/storage';

import en from './locales/en.json';
import fr from './locales/fr.json';

/** Les deux langues de l'app. */
export type Language = 'fr' | 'en';

/** Langue du téléphone si c'est l'anglais, sinon le français (langue par défaut). */
function getDeviceLanguage(): Language {
  const code = getLocales()[0]?.languageCode; // ex. "fr", "en", "es"...
  if (code === 'en') {
    return 'en';
  }
  return 'fr';
}

// i18n.use() est la méthode officielle pour brancher react-i18next
i18n.use(initReactI18next).init({
  // Les textes de chaque langue (fichiers fr.json et en.json)
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: getDeviceLanguage(), // langue au démarrage
  fallbackLng: 'fr', // si un texte manque en anglais, on affiche la version française
  // React échappe déjà le texte affiché : pas besoin que i18next le fasse aussi
  interpolation: { escapeValue: false },
});

/**
 * Au démarrage : si l'utilisateur a déjà choisi une langue dans le Profil, on l'utilise
 * à la place de celle du téléphone.
 */
export async function loadSavedLanguage(): Promise<void> {
  const savedLanguage = await getSavedLanguage(); // "fr", "en", ou null si aucun choix

  if (savedLanguage === 'fr' || savedLanguage === 'en') {
    await i18n.changeLanguage(savedLanguage);
  }
}

/** Change la langue de l'app et retient ce choix pour les prochains lancements. */
export async function changeAppLanguage(language: Language): Promise<void> {
  await i18n.changeLanguage(language); // tous les textes t('...') se mettent à jour
  await saveLanguage(language);
}

export default i18n;
