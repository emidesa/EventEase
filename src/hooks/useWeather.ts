/**
 * Hook qui récupère la météo du jour d'un événement.
 * Exemple : const weather = useWeather(event);  → null tant qu'il n'y a pas de météo à afficher
 *
 * On ne demande rien si :
 * - l'événement n'a pas de coordonnées GPS (lieu absent ou introuvable)
 * - l'événement est passé
 * - l'événement a lieu dans plus de 16 jours (limite des prévisions d'Open-Meteo)
 */
import { useEffect, useState } from 'react';

import { DailyWeather, getDailyWeather } from '@/services/weather';
import { Event } from '@/types/event';
import { isPast, toDateKey } from '@/utils/date';

const MAX_FORECAST_DAYS = 16;

export function useWeather(event: Event | undefined): DailyWeather | null {
  const [weather, setWeather] = useState<DailyWeather | null>(null);

  // Les infos dont on a besoin (undefined si l'événement ou ses coordonnées n'existent pas)
  const latitude = event?.location?.latitude;
  const longitude = event?.location?.longitude;
  const date = event?.date;
  const endDate = event?.endDate;

  useEffect(() => {
    if (latitude === undefined || longitude === undefined || !date || !endDate) {
      return; // pas de coordonnées : pas de météo
    }
    if (isPast(endDate)) {
      return; // événement terminé
    }

    // Nombre de jours entre aujourd'hui et l'événement
    const daysUntilEvent = (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (daysUntilEvent > MAX_FORECAST_DAYS) {
      return; // trop loin pour une prévision
    }

    // On appelle l'API ; quand la réponse arrive (.then), on la garde dans l'état
    getDailyWeather(latitude, longitude, toDateKey(new Date(date))).then(setWeather);

    // On efface l'ancienne météo, sinon elle resterait affichée après une modification.
    return () => setWeather(null);
  }, [latitude, longitude, date, endDate]); // on recommence si le lieu ou la date changent

  return weather;
}
