/**
 * Bloc « Organisé par » du détail d'un événement : avatar à initiales + nom de l'organisateur.
 */
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';

type OrganizerRowProps = {
  name: string;
};

export function OrganizerRow({ name }: OrganizerRowProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <Avatar name={name} size={44} />
      <View style={styles.texts}>
        <Text style={styles.overline}>{t('events.organizedBy')}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  texts: {
    gap: 2,
  },
  overline: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.overline - 2,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.small,
    color: colors.text,
  },
});
