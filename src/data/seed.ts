/**
 * Événements de démo, ajoutés au tout premier lancement de l'app
 * pour que l'accueil ne soit pas vide pendant la démo.
 * Les dates sont calculées à partir d'aujourd'hui : les événements restent donc "à venir".
 */
import { Event } from '@/types/event';

/** Id du créateur des événements de démo (ce n'est pas un vrai compte : le détail affiche « Équipe EventEase »). */
export const SEED_ORGANIZER_ID = 'eventease-team';

/**
 * Renvoie une date au format ISO, dans `days` jours, à l'heure indiquée.
 * Exemple : dateInDays(2, 14, 0) → après-demain à 14h00.
 */
function dateInDays(days: number, hours: number, minutes: number): string {
  const date = new Date(); // aujourd'hui
  date.setDate(date.getDate() + days); // + le nombre de jours
  date.setHours(hours, minutes, 0, 0); // à l'heure voulue
  return date.toISOString();
}

export const SEED_EVENTS: Event[] = [
  {
    id: 'seed-1',
    title: 'Fresque du climat',
    description:
      'Un atelier participatif et accessible à tous pour comprendre les enjeux climatiques, échanger et repartir avec des idées concrètes. Aucun prérequis nécessaire.',
    category: 'atelier',
    date: dateInDays(2, 14, 0),
    endDate: dateInDays(2, 17, 0),
    location: { name: 'Maison Folie Wazemmes', latitude: 50.6247, longitude: 3.049 },
    participants: [],
    createdBy: SEED_ORGANIZER_ID,
  },
  {
    id: 'seed-2',
    title: 'Apéro des bénévoles',
    description:
      'Un moment convivial pour remercier les bénévoles, rencontrer les nouveaux membres et partager les projets de l’association.',
    category: 'sortie',
    date: dateInDays(2, 18, 0),
    endDate: dateInDays(2, 20, 0),
    location: { name: 'Gare Saint-Sauveur', latitude: 50.6272, longitude: 3.0724 },
    participants: [],
    createdBy: SEED_ORGANIZER_ID,
  },
  {
    id: 'seed-3',
    title: 'L’engagement associatif aujourd’hui',
    description:
      'Conférence suivie d’un échange avec des responsables d’associations locales : comment s’engager, à quel rythme, et pourquoi ça compte.',
    category: 'conference',
    date: dateInDays(5, 19, 0),
    endDate: dateInDays(5, 21, 0),
    location: { name: 'Médiathèque Jean Lévy', latitude: 50.6327, longitude: 3.066 },
    participants: [],
    createdBy: SEED_ORGANIZER_ID,
  },
  {
    id: 'seed-4',
    title: 'Atelier zéro déchet',
    description:
      'Fabriquer sa lessive, ses éponges lavables et ses emballages réutilisables. Le matériel est fourni, venez simplement avec votre bonne humeur.',
    category: 'atelier',
    date: dateInDays(9, 10, 0),
    endDate: dateInDays(9, 12, 0),
    location: { name: 'Maison Folie Wazemmes', latitude: 50.6247, longitude: 3.049 },
    participants: [],
    createdBy: SEED_ORGANIZER_ID,
  },
  {
    id: 'seed-5',
    title: 'Balade au parc de la Citadelle',
    description:
      'Une promenade tranquille de deux heures, ouverte à toutes et tous, avec une pause goûter au bord de la Deûle.',
    category: 'sortie',
    date: dateInDays(12, 15, 0),
    endDate: dateInDays(12, 17, 30),
    location: { name: 'Parc de la Citadelle', latitude: 50.6421, longitude: 3.0482 },
    participants: [],
    createdBy: SEED_ORGANIZER_ID,
  },
  {
    id: 'seed-6',
    title: 'Le numérique responsable',
    description:
      'Comment réduire l’impact de nos téléphones et ordinateurs au quotidien ? Une conférence pratique, avec des gestes simples à adopter.',
    category: 'conference',
    date: dateInDays(20, 18, 30),
    endDate: dateInDays(20, 20, 0),
    location: { name: 'Médiathèque Jean Lévy', latitude: 50.6327, longitude: 3.066 },
    participants: [],
    createdBy: SEED_ORGANIZER_ID,
  },
  {
    // Un événement passé, pour montrer l'affichage grisé
    id: 'seed-7',
    title: 'Repair café',
    description:
      'Des bénévoles bricoleurs vous aident à réparer vos petits appareils, vêtements et vélos plutôt que de les jeter.',
    category: 'atelier',
    date: dateInDays(-3, 14, 0),
    endDate: dateInDays(-3, 18, 0),
    location: { name: 'Jardin des Géants', latitude: 50.6429, longitude: 3.0748 },
    participants: [],
    createdBy: SEED_ORGANIZER_ID,
  },
];
