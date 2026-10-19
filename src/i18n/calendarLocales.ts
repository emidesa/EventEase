/**
 * Noms des mois et des jours pour le calendrier (librairie react-native-calendars).
 * Cette librairie n'utilise pas i18next : elle a son propre réglage de langue, LocaleConfig.
 * Il suffit d'importer ce fichier une fois : il enregistre le français et l'anglais,
 * puis garde la langue du calendrier identique à celle de l'app.
 */
import { LocaleConfig } from 'react-native-calendars';

import i18n from './index';

LocaleConfig.locales.fr = {
  monthNames: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ],
  monthNamesShort: [
    'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
    'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
  ],
  // Ces listes commencent toujours par dimanche (même si on affiche lundi en premier)
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  today: "Aujourd'hui",
};

LocaleConfig.locales.en = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  today: 'Today',
};

// Langue du calendrier = langue de l'app : au démarrage, puis à chaque changement de langue
LocaleConfig.defaultLocale = i18n.language;

i18n.on('languageChanged', (language) => {
  LocaleConfig.defaultLocale = language;
});
