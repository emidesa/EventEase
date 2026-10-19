/**
 * Météo du jour d'un événement, avec l'API gratuite Open-Meteo (https://open-meteo.com).
 * Pas besoin de compte ni de clé. Les prévisions vont jusqu'à 16 jours à l'avance.
 */

export type DailyWeather = {
  code: number; // code météo « WMO » (0 = ciel dégagé, 61 = pluie faible...)
  maxTemperature: number; // en °C
  minTemperature: number; // en °C
};

/**
 * Récupère la météo prévue pour un jour et un lieu.
 * @param dateKey le jour, au format "AAAA-MM-JJ"
 * Renvoie null si la météo est indisponible (pas de réseau, date trop lointaine...).
 */
export async function getDailyWeather(
  latitude: number,
  longitude: number,
  dateKey: string,
): Promise<DailyWeather | null> {
  // L'adresse de l'API, avec nos paramètres
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${latitude}&longitude=${longitude}` +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
    '&timezone=auto' + // le jour est calculé dans le fuseau horaire du lieu
    `&start_date=${dateKey}&end_date=${dateKey}`;

  try {
    const response = await fetch(url); // on appelle l'API
    const data = await response.json(); // on lit la réponse (du JSON)

    // L'API renvoie { error: true } si la date est trop lointaine
    if (!response.ok || data.error) {
      return null;
    }

    // La réponse contient des listes (une valeur par jour) : on a demandé un seul jour, donc [0]
    return {
      code: data.daily.weather_code[0],
      maxTemperature: Math.round(data.daily.temperature_2m_max[0]), // 12.2 → 12
      minTemperature: Math.round(data.daily.temperature_2m_min[0]),
    };
  } catch (error) {
    // Pas de réseau, par exemple
    console.log('Météo indisponible', error);
    return null;
  }
}
