/**
 * En-tête du détail d'un événement : un bandeau de couleur
 * avec un bouton retour rond en haut à gauche et un cœur (favori) en haut à droite.
 */
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/BackButton';
import { colors, spacing } from '@/constants/theme';

type EventDetailHeaderProps = {
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function EventDetailHeader({ isFavorite, onToggleFavorite }: EventDetailHeaderProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets(); // pour ne pas placer les boutons sous l'heure / l'encoche

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      {/* Ronds décoratifs */}
      <View style={styles.circleAccent} />
      <View style={styles.circleMint} />

      {/* Boutons : retour à gauche, cœur à droite */}
      <View style={styles.buttonsRow}>
        <BackButton />

        <Pressable
          style={styles.roundButton}
          onPress={onToggleFavorite}
          accessibilityLabel={isFavorite ? t('events.removeFavorite') : t('events.addFavorite')}
        >
          {/* Cœur rempli et corail si l'événement est en favori, sinon cœur vide */}
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? colors.accent : colors.text}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 220,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  circleAccent: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.accent,
    opacity: 0.3,
  },
  circleMint: {
    position: 'absolute',
    bottom: 10,
    left: -40,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.mint,
    opacity: 0.2,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // un bouton à gauche, l'autre à droite
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
