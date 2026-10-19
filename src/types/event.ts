/**
 * Types liés aux événements organisés par l'association.
 */

/** Liste des catégories, utilisée pour les filtres de l'accueil et le formulaire de création. */
export const EVENT_CATEGORIES = ['atelier', 'conference', 'sortie'] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type EventLocation = {
  name: string; // ce que l'utilisateur a tapé, ex. "Maison des Associations, Lyon"
  // Coordonnées GPS trouvées à partir du nom (absentes si l'adresse est introuvable)
  latitude?: number;
  longitude?: number;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  endDate: string;
  location?: EventLocation;
  participants: string[];
  createdBy: string;
};

/**
 * Ce que l'utilisateur remplit dans le formulaire de création / modification.
 * C'est un Event sans les champs gérés automatiquement par l'app (id, participants, créateur).
 */
export type EventFormData = Omit<Event, 'id' | 'participants' | 'createdBy'>;
