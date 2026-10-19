/**
 * Thème de l'app, repris de la maquette.
 * Tous les composants viennent chercher leurs couleurs, polices et tailles ici :
 * pour changer une couleur partout, il suffit de la modifier dans ce fichier.
 */

export const colors = {
  primary: '#1F5F63', // vert-bleu foncé : boutons, onglet actif
  accent: '#E07F62', // corail : bouton « + », catégories
  background: '#F4F3EE', // crème : fond des écrans
  surface: '#FFFFFF', // blanc : cartes et champs de saisie
  mint: '#E3EDEA', // vert d'eau : en-tête de connexion, badges
  lavender: '#E4DEF2',
  peach: '#F2D3C7',
  sage: '#DCE8E2',
  text: '#1A2B30', // presque noir : titres
  textMuted: '#7A8589', // gris : descriptions, libellés
  border: '#E2E2DC', // gris clair : bordures des champs
  danger: '#C8553D', // rouge : erreurs, déconnexion
};

// Les noms doivent être les mêmes que dans useFonts (src/app/_layout.tsx)
export const fonts = {
  title: 'DMSerifDisplay_400Regular',
  titleItalic: 'DMSerifDisplay_400Regular_Italic',
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
};

export const fontSizes = {
  overline: 12, // petits surtitres en majuscules
  small: 14, // libellés, erreurs, sous-titres
  body: 16, // texte normal, champs, boutons
  large: 18, // nom de l'app
  heading: 30, // phrase d'accroche de l'en-tête
  title: 34, // titres d'écran
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  input: 12,
  card: 16,
  pill: 999, // très grand = bords complètement arrondis
};
