/**
 * Configuration de la traduction (i18next).
 * Importé une seule fois au démarrage (dans le layout racine) : il suffit ensuite d'utiliser
 * `const { t } = useTranslation()` dans les composants.
 */
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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

export default i18n;
