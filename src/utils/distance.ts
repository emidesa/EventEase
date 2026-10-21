/**
 * Calcul et affichage de la distance entre l'utilisateur et un événement.
 */
import { EventLocation } from '@/types/event';
import { Coordinates } from '@/types/location';
import { getLocale } from './date';

const EARTH_RADIUS_KM = 6371; // rayon moyen de la Terre

/** Convertit des degrés en radians (les fonctions Math.sin / Math.cos utilisent des radians). */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Distance « à vol d'oiseau » entre deux points GPS, en kilomètres.
 * C'est la formule de Haversine : elle tient compte du fait que la Terre est ronde.
 */
export function getDistanceKm(from: Coordinates, to: Coordinates): number {
  const deltaLatitude = toRadians(to.latitude - from.latitude);
  const deltaLongitude = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(deltaLongitude / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

/** Met une distance en forme : "850 m" (moins d'1 km) ou "1,2 km" ("1.2 km" en anglais). */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  // toLocaleString écrit le nombre à la façon du pays : virgule en français, point en anglais
  return `${km.toLocaleString(getLocale(), { maximumFractionDigits: 1 })} km`;
}

/**
 * Distance déjà mise en forme entre l'utilisateur et le lieu d'un événement,
 * ou null si on ne peut pas la calculer (position inconnue, lieu sans coordonnées).
 */
export function getEventDistanceText(
  userPosition: Coordinates | null,
  location: EventLocation | undefined,
): string | null {
  if (!userPosition || location?.latitude === undefined || location.longitude === undefined) {
    return null;
  }

  const km = getDistanceKm(userPosition, {
    latitude: location.latitude,
    longitude: location.longitude,
  });
  return formatDistance(km);
}
