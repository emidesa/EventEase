/**
 * Hook qui récupère la position actuelle du téléphone (une fois, quand l'écran s'affiche).
 * Exemple : const userPosition = useUserLocation();  → null tant que la position n'est pas connue
 * ou si l'utilisateur a refusé l'autorisation (la distance est alors simplement cachée).
 */
import { useEffect, useState } from 'react';

import { getUserPosition } from '@/services/location';
import { Coordinates } from '@/types/location';

export function useUserLocation(): Coordinates | null {
  const [position, setPosition] = useState<Coordinates | null>(null);

  useEffect(() => {
    getUserPosition().then(setPosition);
  }, []); // [] = une seule fois, à l'affichage de l'écran

  return position;
}
