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

export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'fr';

export const resources = {
  fr: { translation: fr },
  en: { translation: en },
} as const;

/** Vérifie qu'un code de langue (ex. venant du téléphone ou du stockage) est géré par l'app. */
export function isSupportedLanguage(code: string | null | undefined): code is Language {
  return SUPPORTED_LANGUAGES.includes(code as Language);
}

/** Langue du téléphone si elle est gérée, sinon le français. */
function getDeviceLanguage(): Language {
  const code = getLocales()[0]?.languageCode;
  return isSupportedLanguage(code) ? code : DEFAULT_LANGUAGE;
}

// i18n.use() est la méthode officielle pour brancher react-i18next 
i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  // React échappe déjà le texte affiché : pas besoin que i18next le fasse aussi
  interpolation: { escapeValue: false },
});

/**
 * Au démarrage : si l'utilisateur a déjà choisi une langue dans le Profil, on l'utilise
 * à la place de celle du téléphone.
 */
export async function loadSavedLanguage(): Promise<void> {
  const savedLanguage = await getSavedLanguage();

  if (isSupportedLanguage(savedLanguage)) {
    await i18n.changeLanguage(savedLanguage);
  }
}

/** Change la langue de l'app et retient ce choix pour les prochains lancements. */
export async function changeAppLanguage(language: Language): Promise<void> {
  await i18n.changeLanguage(language); // tous les textes t('...') se mettent à jour
  await saveLanguage(language);
}

export default i18n;
