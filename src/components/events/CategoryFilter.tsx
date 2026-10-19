/**
 * Filtres par catégorie : une rangée de puces « Tout / Ateliers / Conférences / Sorties ».
 * On peut faire défiler la rangée sur le côté si l'écran est petit.
 */
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { spacing } from '@/constants/theme';
import { EVENT_CATEGORIES, EventCategory } from '@/types/event';

// "all" = pas de filtre, on affiche toutes les catégories
export type CategoryFilterValue = EventCategory | 'all';

type CategoryFilterProps = {
  selected: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
};

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal // défilement de gauche à droite
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Chip label={t('categories.all')} selected={selected === 'all'} onPress={() => onChange('all')} />

      {/* Une puce par catégorie, à partir de la liste EVENT_CATEGORIES */}
      {EVENT_CATEGORIES.map((category) => (
        <Chip
          key={category} // React a besoin d'une "key" unique pour chaque élément d'une liste
          label={t(`categories.${category}`)}
          selected={selected === category}
          onPress={() => onChange(category)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
});
