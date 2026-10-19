/**
 * Transforme un code météo « WMO » (renvoyé par Open-Meteo) en type de temps simple.
 * Chaque type a une icône et une traduction (weather.clear, weather.rain...).
 * Liste officielle des codes : https://open-meteo.com/en/docs (section « WMO Weather interpretation codes »)
 */

export type WeatherType = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';

/** Code WMO → type de temps. */
export function getWeatherType(code: number): WeatherType {
  if (code === 0) return 'clear'; // ciel dégagé
  if (code <= 3) return 'cloudy'; // 1, 2, 3 : peu à très nuageux
  if (code <= 48) return 'fog'; // 45, 48 : brouillard
  if (code <= 67) return 'rain'; // 51 à 67 : bruine et pluie
  if (code <= 77) return 'snow'; // 71 à 77 : neige
  if (code <= 82) return 'rain'; // 80 à 82 : averses
  if (code <= 86) return 'snow'; // 85, 86 : averses de neige
  return 'storm'; // 95 à 99 : orage
}

/** Nom de l'icône Ionicons pour chaque type de temps. */
export const WEATHER_ICONS = {
  clear: 'sunny-outline',
  cloudy: 'partly-sunny-outline',
  fog: 'cloud-outline',
  rain: 'rainy-outline',
  snow: 'snow-outline',
  storm: 'thunderstorm-outline',
} as const;
