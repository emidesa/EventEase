@AGENTS.md

# EventEase

Prototype d'application mobile (projet d'école, 4 jours) pour l'association fictive EventEase : les membres consultent des événements, en créent et gèrent leur participation. Le cahier des charges impose React Native + React Navigation, une persistance locale et un code clair et commenté.

## Suivi d'avancement : `avancement.md`

- **Avant toute tâche**, lire `avancement.md` (racine du projet) pour connaître l'état actuel, ce qui a été fait et la prochaine étape.
- **À la fin de chaque tâche**, le compléter :
  - mettre à jour la section « État actuel » et cocher la checklist ;
  - ajouter une entrée en bas du « Journal » avec la date, ce qui a été fait, l'explication (le pourquoi, en termes simples) et les fichiers modifiés.
- Ce fichier est local et ignoré par git : ne jamais l'ajouter à un commit.

## Fonctionnalités

Obligatoires (8 pts sur 20, à terminer avant tout bonus) :
- Inscription / connexion simplifiées, sans backend (utilisateurs stockés en local).
- Liste des événements (titre, description, date).
- Création / modification / suppression d'un événement.
- Marquer un événement comme « participé ».
- Persistance locale avec AsyncStorage.

Bonus : calendrier (`react-native-calendars`), météo du jour de l'événement (API **Open-Meteo** : gratuite, sans clé, prévisions sur 16 jours ; le cahier cite OpenWeather « par exemple »), thème / icônes / splash screen, lieu + géolocalisation (`expo-location`) pour afficher la distance.

Choix pour les bonus :
- Lieu : l'utilisateur tape une adresse dans le formulaire ; à l'enregistrement, `Location.geocodeAsync` la transforme en coordonnées. Adresse introuvable → l'événement est enregistré avec le nom du lieu mais sans coordonnées (pas de distance ni de météo).
- Distance : position du téléphone (`requestForegroundPermissionsAsync` + `getCurrentPositionAsync`), calcul dans `utils/distance.ts` (formule de Haversine). Permission refusée → distance masquée.
- Météo : seulement si l'événement a des coordonnées et a lieu dans les 16 prochains jours ; sinon la section est masquée.
- Ajout au calendrier du téléphone : `expo-calendar`, importé depuis **`expo-calendar/legacy`** (la nouvelle API « Calendar@next » n'est pas disponible dans Expo Go). `createEventInCalendarAsync` ouvre la fenêtre native « Nouvel événement » pré-remplie (pas d'autorisation sur iOS 17+ ni sur Android ; sur iOS plus ancien, `requestCalendarPermissionsAsync` puis nouvel essai). Code dans `services/calendar.ts`.
- Images de catégorie : `assets/images/categories/atelier.jpg`, `conference.jpg`, `sortie.jpg` (photos libres de droits), affichées avec `Image` de React Native.

## Stack

- Expo SDK 57, TypeScript, Expo Router (basé sur React Navigation, ce qui répond à la contrainte du cahier des charges).
- npm (`package-lock.json`) : utiliser `npx`, pas `bunx`.
- `@react-native-async-storage/async-storage`, `@react-native-community/datetimepicker`, `react-native-calendars`, `expo-location` sont déjà installés.
- `example/` contient l'ancien template Expo, conservé pour référence uniquement : ne pas l'importer ni le modifier.

## Architecture visée

```
src/
├── app/                 écrans uniquement (Expo Router)
│   ├── _layout.tsx      providers + redirection (auth) / (tabs) selon la session
│   ├── (auth)/          login.tsx, register.tsx
│   ├── (tabs)/          index.tsx (accueil), calendar.tsx, create.tsx (bouton « + »), profile.tsx
│   └── event/           [id].tsx (détail), form.tsx (création / modification)
├── components/          composants d'interface réutilisables
│   ├── ui/              briques génériques : Button, TextField, Chip, Avatar, Logo, BackButton…
│   └── events/          composants métier : EventCard, EventList, ParticipateButton…
├── hooks/               hooks personnalisés : useAuth, useEvents, useEvent(id), useWeather, useDistance…
├── context/             AuthContext, EventsContext (état global + actions)
├── services/            storage.ts (accès AsyncStorage), weather.ts, location.ts
├── types/               types partagés (Event, User)
├── utils/               petites fonctions pures (date.ts, distance.ts, events.ts, navigation.ts…)
├── data/                seed.ts : événements de démo
├── i18n/                index.ts (configuration i18next), locales/fr.json, locales/en.json
└── constants/           thème (couleurs, espacements)
```

Les écrans ne lisent ni n'écrivent jamais AsyncStorage directement : ils passent par les contexts, qui passent par `services/storage.ts`.

## Découpage en composants et hooks

L'objectif est un code bien découpé, où chaque fichier a une seule responsabilité :

- **Écrans (`src/app/`)** : ils assemblent des composants et appellent des hooks. Un écran ne contient ni logique métier, ni appel à AsyncStorage ou à une API, ni gros blocs de JSX répétés. S'il dépasse ~100 lignes, c'est qu'il faut extraire quelque chose.
- **Composants (`src/components/`)** : dès qu'un morceau d'interface se répète ou forme un bloc logique (une carte, un champ de formulaire, un bouton stylé), il devient un composant. Il reçoit ses données par props typées (`type Props = {...}`) et remonte les actions par callbacks (`onPress`, `onChange`). Les composants de `ui/` ne connaissent pas le métier (aucune référence à `Event` ou `User`).
- **Hooks (`src/hooks/`)** : toute logique avec état ou effet (chargement, appel API, calcul dérivé, géolocalisation) va dans un hook `useXxx`. Les écrans consomment les contexts via `useAuth()` et `useEvents()`, jamais via `useContext` directement.
- **Services (`src/services/`)** : fonctions pures sans React (stockage, appels HTTP, calcul de distance), donc faciles à tester et à réutiliser.
- Un composant ou un hook par fichier, avec le même nom que ce qu'il exporte (`EventCard.tsx`, `useWeather.ts`).

## Modèle de données

```ts
type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  favorites: string[];       // ids des événements enregistrés (cœur)
  createdAt?: string;        
};
type EventCategory = 'atelier' | 'conference' | 'sortie';
type Event = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;              // début, ISO 8601
  endDate: string;           // fin, ISO 8601 (affiché « 14:00 – 17:00 »)
  location?: { name: string; latitude: number; longitude: number };
  participants: string[];
  createdBy: string;
};
```

Libellés affichés des catégories : Ateliers, Conférences, Sorties. Chaque catégorie a une image associée dans `assets/images/categories/` (pas d'image choisie par l'utilisateur).

## Design (maquette `EventEase-Maquette.pdf`)

Toujours suivre la maquette. Les valeurs sont centralisées dans `constants/theme.ts` : aucune couleur, taille de police ou police écrite en dur dans un composant. Les styles de texte communs (`textStyles.overline` pour les surtitres, `textStyles.screenTitle` pour les titres d'écran) sont aussi dans le thème : ne pas les recopier, les réutiliser (`style={[textStyles.overline, styles.monAjustement]}`).

Pas de doublon : un morceau de code utilisé à plusieurs endroits va dans un composant (`components/ui/`) ou une fonction (`utils/`) — ex. `sortByDate`, `openEventDetail`, `getLocale`, `Logo`, `BackButton`.

Couleurs :

| Rôle | Valeur | Usage |
|---|---|---|
| `primary` | `#1F5F63` | boutons principaux, onglet actif, carte mise en avant, surtitres |
| `accent` | `#E07F62` | bouton « + », libellé de catégorie, mots mis en valeur |
| `background` | `#F4F3EE` | fond des écrans |
| `surface` | `#FFFFFF` | cartes, champs de saisie |
| `mint` | `#E3EDEA` | en-tête de l'authentification, badges, icônes de détail |
| `lavender` / `peach` / `sage` | `#E4DEF2` / `#F2D3C7` / `#DCE8E2` | avatars à initiales, bloc de date des cartes |
| `text` / `textMuted` | `#1A2B30` / `#7A8589` | titres / descriptions et libellés |
| `danger` | `#C8553D` | « Se déconnecter », suppression, erreurs |

Polices (`@expo-google-fonts/dm-serif-display` et `@expo-google-fonts/dm-sans`, chargées au démarrage avant de masquer le splash screen) :
- **DM Serif Display** pour les titres d'écran et les titres d'événement (« Bienvenue. », « Fresque du climat »).
- **DM Sans** pour tout le reste (textes, boutons, champs, onglets).

Style :
- Coins très arrondis (cartes et boutons ~16, champs ~12, puces en pilule), cartes blanches avec ombre légère.
- Surtitres en petites majuscules espacées au-dessus des titres (« BONJOUR, LÉA », « À PROXIMITÉ », « ATELIERS »).
- Avatars : initiales sur fond pastel. Cartes d'événement : bloc date (jour + mois) à gauche.
- Icônes fines (style contour).

Écrans et navigation :
- 4 onglets : **Accueil**, **Calendrier**, **+** (ouvre la création), **Profil**, tous alignés. La barre est la barre native du système (`NativeTabs` de `expo-router/unstable-native-tabs`) : Liquid Glass sur iOS 26, Material sur Android. Icônes fines en contour (SF Symbols `sf` / Material `md`), sans variante remplie quand l'onglet est sélectionné. L'onglet actif est signalé par la couleur `primary`. Écart assumé avec la maquette : pas de carré corail surélevé pour le « + ».
- Connexion et inscription partagent le même en-tête (logo, « Des moments simples. Des liens qui restent. ») et un sélecteur « Connexion | Inscription ». L'inscription demande prénom et nom, email, mot de passe et l'acceptation des conditions.
- Accueil : « Bonjour, [prénom] », filtres par catégorie, événement mis en avant (prochain événement), liste « Prochains rendez-vous ».
- Détail : image de catégorie en en-tête, bouton retour et cœur, date et horaires, lieu et distance, organisateur, « À propos », bouton de participation.
- Calendrier : vue mensuelle, puis agenda du jour sélectionné.
- Profil : avatar à initiales, statistiques (participations, créations), « Mes événements », « Événements enregistrés », sélecteur de langue FR / EN (puces en pilule), « Se déconnecter ».

**Éléments de la maquette volontairement retirés** (ne pas les ajouter) : connexion Google / Apple, « Mot de passe oublié », notifications (cloche), badge de ville, recherche, bouton de filtres avancés, brouillons, onglet Communauté, « Contacter » l'organisateur, « Modifier mon profil », « Préférences », « Aide & confidentialité », statistique « Contacts ».

## Stockage

- Clés AsyncStorage centralisées dans `services/storage.ts` : `@eventease/users`, `@eventease/session` (id de l'utilisateur connecté), `@eventease/events`, `@eventease/language` (langue choisie).
- Valeurs sérialisées en JSON. Une lecture qui échoue ou une clé absente renvoie une valeur par défaut (tableau vide, `null`) au lieu de faire planter l'app.
- Ids générés avec `Crypto.randomUUID()` d'`expo-crypto` (à installer via `npx expo install expo-crypto`).

## Règles métier

- Seul le créateur d'un événement (`createdBy`) peut le modifier ou le supprimer : les boutons sont masqués pour les autres.
- Tout utilisateur connecté peut participer ou annuler sa participation (bascule de son id dans `participants`).
- Tout utilisateur connecté peut enregistrer un événement en favori (cœur sur le détail) ; ses favoris sont listés dans le profil (« Événements enregistrés »).
- Filtres par catégorie sur l'accueil : Tout, Ateliers, Conférences, Sorties.
- L'heure de fin doit être postérieure à l'heure de début.
- Liste triée par date croissante. Les événements passés restent visibles mais grisés.
- Suppression toujours précédée d'une confirmation (`Alert.alert`).
- Inscription : email unique, champs obligatoires vérifiés avant l'enregistrement, messages d'erreur traduits (FR / EN).

## Traduction (i18n)

- Langues : **français** (par défaut et langue de repli) et **anglais**.
- Librairies : `i18next` + `react-i18next` pour les traductions, `expo-localization` pour lire la langue du téléphone.
- **Aucun texte affiché écrit en dur** dans un composant : tout passe par `const { t } = useTranslation()` et une clé (`t('auth.login.title')`). Cela vaut aussi pour les messages d'erreur, les `Alert`, les titres d'onglets et les libellés de catégories.
- Traductions dans `src/i18n/locales/fr.json` et `en.json`, avec les mêmes clés, regroupées par écran ou domaine (`common`, `auth`, `tabs`, `events`, `calendar`, `profile`, `errors`). Toute clé ajoutée dans un fichier est ajoutée dans l'autre.
- Variables avec l'interpolation (`t('home.greeting', { name })` → « Bonjour, {{name}} ») et pluriels avec `count`, jamais par concaténation de chaînes.
- Choix de la langue : au premier lancement, la langue du téléphone (`getLocales()`) si c'est `fr` ou `en`, sinon `fr`. L'utilisateur peut la changer depuis le Profil (sélecteur FR / EN). Son choix est enregistré sous la clé `@eventease/language` et prime ensuite sur celle du téléphone.
- Les services ne traduisent pas : ils renvoient des codes d'erreur (ex. `AuthError` avec `code: 'emailTaken'`), traduits par l'interface (`t('errors.emailTaken')`).
- Les données saisies par les utilisateurs (titres, descriptions) ne sont pas traduites. Les données de démo sont en français.

## Dates

- Stockées en ISO 8601, jamais en texte formaté.
- Affichage via les fonctions de `utils/date.ts`, basées sur `Intl` / `toLocaleDateString` avec la **langue courante** (`i18n.language`), donc « 24 mai 2026 » en français et « May 24, 2026 » en anglais. Aucun formatage de date ailleurs.

## États et cas d'erreur

- Chaque écran qui charge des données gère trois états : chargement, vide (ex. « Aucun événement pour le moment ») et erreur.
- Les bonus ne bloquent jamais l'app : permission de localisation refusée, clé API absente ou pas de réseau → la section météo ou distance est simplement masquée ou affiche un court message. On gardera l'option de repartir dans les reglages du téléphone pour modifier si nécessaire.

## Sécurité (prototype)

- Pas de backend : les comptes sont stockés en local. Les mots de passe ne sont jamais stockés en clair, seulement leur hash SHA-256 (`Crypto.digestStringAsync` d'`expo-crypto`).

## Données de démo

- Au premier lancement (clé `@eventease/events` absente), les événements de `data/seed.ts` sont enregistrés pour que la démo ne parte pas d'une liste vide.

## Dépendances et Expo Go

- L'app doit tourner dans Expo Go : uniquement des modules du SDK Expo ou des librairies en pur JavaScript.
- Ne pas ajouter de dépendance sans demander d'abord. Toujours installer avec `npx expo install`.

## Git

- Rappel de faire des petits commits en français, un par fonctionnalité (ex. « Ajout du formulaire de création d'événement »), pour que l'historique montre l'avancement. Mais ne jamais le faire soi même.

## Conventions

- Textes de l'interface en français et en anglais, toujours via i18n (voir « Traduction »).
- Commentaires en français : un en-tête court par fichier pour expliquer son rôle, plus des commentaires sur la logique non évidente
- Composants fonctionnels et hooks, styles via `StyleSheet.create`.
