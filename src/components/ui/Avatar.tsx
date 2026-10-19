/**
 * Avatar carré aux coins arrondis avec les initiales d'un nom, sur fond pastel (comme sur la maquette).
 * Exemple : <Avatar name="Léa Bernard" size={80} />  → affiche « LB »
 */
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import { getInitials } from '@/utils/text';

type AvatarProps = {
  name: string;
  size?: number;
};

export function Avatar({ name, size = 48 }: AvatarProps) {
  return (
    <View
      style={[
        styles.avatar,
        // La taille dépend de la prop "size", donc on la met ici et pas dans StyleSheet
        // borderRadius = un quart de la taille : carré aux coins arrondis (la moitié ferait un rond)
        { width: size, height: size, borderRadius: size / 4 },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size / 2.5 }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fonts.title,
    color: colors.text,
  },
});
