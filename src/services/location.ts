/**
 * Tout ce qui concerne les lieux et la localisation (expo-location).
 * Géocodage = transformer une adresse en texte en coordonnées GPS (latitude, longitude).
 * C'est le téléphone qui fait la recherche (Apple sur iPhone, Google sur Android) : pas de clé à fournir.
 */
import * as Location from 'expo-location';
import { Platform } from 'react-native';

import { EventLocation } from '@/types/event';

/**
 * Cherche les coordonnées GPS d'une adresse.
 * Renvoie null si l'adresse est introuvable, s'il n'y a pas de réseau ou si l'autorisation est refusée.
 */
export async function geocodeAddress(
  address: string,
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    // Android : le géocodage demande l'autorisation de localisation (pas sur iPhone)
    if (Platform.OS === 'android') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }
    }

    const results = await Location.geocodeAsync(address);

    // Aucun résultat : adresse introuvable
    if (results.length === 0) {
      return null;
    }

    // On prend le premier résultat (le plus probable)
    return { latitude: results[0].latitude, longitude: results[0].longitude };
  } catch (error) {
    console.log('Géocodage impossible', error);
    return null;
  }
}

/**
 * Prépare le lieu d'un événement à partir de ce que l'utilisateur a tapé dans le formulaire.
 * - champ vide → pas de lieu
 * - même adresse qu'avant (modification) → on garde les coordonnées déjà connues
 * - nouvelle adresse → on cherche ses coordonnées (si introuvable, on garde juste le nom)
 */
export async function buildEventLocation(
  placeName: string,
  previousLocation?: EventLocation,
): Promise<EventLocation | undefined> {
  const name = placeName.trim();

  if (name === '') {
    return undefined;
  }

  if (previousLocation && previousLocation.name === name) {
    return previousLocation;
  }

  const coordinates = await geocodeAddress(name);
  if (coordinates === null) {
    return { name }; // le nom seulement : pas de distance ni de météo pour ce lieu
  }

  return { name, latitude: coordinates.latitude, longitude: coordinates.longitude };
}
