/**
 * Typage des clés de traduction : TypeScript signale une erreur si on écrit t('cle.inexistante').
 * Le fichier français sert de référence.
 */
import 'i18next';

import type fr from './locales/fr.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof fr };
  }
}
