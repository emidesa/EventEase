# EventEase

Application mobile pour l'association **EventEase**, qui organise des conférences, des ateliers et des sorties. Les membres et les bénévoles peuvent **consulter les événements**, **en créer** et **gérer leur participation**.

Prototype réalisé en 4 jours avec **React Native**, **Expo** et **TypeScript**.

---

## Fonctionnalités

**Demandées par le cahier des charges**
- Inscription et connexion, sans serveur : les comptes sont stockés sur le téléphone.
- Liste des événements : titre, description, date et horaire.
- Création, modification et suppression d'un événement. Seul le créateur peut modifier ou supprimer, et la suppression est confirmée.
- « Je participe » : marquer un événement comme participé, avec un compteur de participants.
- Persistance locale avec **AsyncStorage** : les données restent après la fermeture de l'app.

**Bonus**
- **Calendrier** du mois (`react-native-calendars`), avec les événements du jour choisi.
- **Météo** du jour de l'événement avec l'API **Open-Meteo**, gratuite et sans clé.
- **Lieu et distance** : l'adresse est transformée en coordonnées (géocodage), puis la distance est calculée depuis la position du téléphone.
- **Design** fidèle à la maquette : thème, polices, icônes, barre d'onglets native, splash screen.

**En plus**
- Traduction **français / anglais**, avec un choix de langue dans le Profil.
- **Favoris** et liste des événements enregistrés.
- **Catégories** (ateliers, conférences, sorties) et filtres sur l'accueil.
- **Ajout au calendrier du téléphone** (Calendrier d'Apple, Agenda Google).
- **Profil** : statistiques, mes événements, déconnexion.

---

## Lancer le projet

### Prérequis

- **Node.js 22.13** ou plus récent.
- L'application **Expo Go** sur un téléphone (App Store ou Google Play), compatible avec le **SDK 57**.
- Le téléphone et l'ordinateur sur le **même réseau Wi-Fi**.

### Installation

```bash
git clone https://github.com/emidesa/EventEase.git
cd EventEase
npm install
```

### Démarrage

```bash
npx expo start
```

Scanne ensuite le **QR code** affiché dans le terminal : avec l'appareil photo sur iPhone, ou depuis Expo Go sur Android.

Si le téléphone ne se connecte pas (Wi-Fi d'école filtré, par exemple), essaie `npx expo start --tunnel`.

### Premier lancement

- Crée un compte depuis l'écran **Inscription** : il n'y a pas de compte par défaut.
- **7 événements de démonstration** sont ajoutés automatiquement au premier lancement, avec des dates calculées à partir d'aujourd'hui.
- Accepte la demande de **localisation** pour voir les distances. Si tu la refuses, l'app fonctionne quand même, sans afficher la distance.

### Vérifier le code

```bash
npx tsc --noEmit   # vérifie les types TypeScript
npx expo lint      # vérifie la qualité du code (ESLint)
```

---

## Pourquoi Expo Router ?

Le cahier des charges demande d'utiliser **React Navigation** pour gérer les écrans. Ce projet utilise **Expo Router**, qui est **construit sur React Navigation** :

- les navigateurs `Stack` (pile d'écrans) et `Tabs` (onglets) d'Expo Router **sont** ceux de React Navigation ;
- Expo Router ajoute une seule chose : la **navigation par fichiers**. Chaque fichier du dossier `src/app/` devient automatiquement un écran, au lieu de déclarer chaque écran à la main avec `createNativeStackNavigator()`.

| Fichier | Écran |
|---|---|
| `src/app/(auth)/login.tsx` | `/login` |
| `src/app/(tabs)/index.tsx` | l'accueil `/` |
| `src/app/event/[id].tsx` | le détail d'un événement, `/event/123` |

**Pourquoi ce choix :**
1. **C'est la solution recommandée par Expo**, et celle des nouveaux projets Expo.
2. **Moins de code à maintenir** : il n'y a pas de liste d'écrans à tenir à jour, puisque l'arborescence des fichiers **est** la navigation.
3. **La protection des écrans est simple** : `Stack.Protected` n'affiche l'application que si l'utilisateur est connecté, et la connexion sinon. Il n'y a aucune redirection à écrire à la main.
4. **Les routes sont typées** : une adresse d'écran mal écrite est signalée par TypeScript.

Les **groupes** entre parenthèses (`(auth)`, `(tabs)`) rangent les écrans sans changer leur adresse, et donnent à chaque groupe sa propre navigation : une pile pour la connexion, des onglets pour l'application.

---

## Architecture

Le code est organisé **en couches**, chacune avec un seul rôle :

```
src/
├── app/          les écrans (un fichier = un écran, grâce à Expo Router)
├── components/   les composants réutilisables (boutons, champs, cartes d'événement…)
├── hooks/        la logique avec état : useAuth, useEvents, useWeather, useUserLocation…
├── context/      l'état partagé : AuthContext (utilisateur connecté), EventsContext (événements)
├── services/     la logique sans React : stockage, authentification, CRUD, météo, localisation
├── utils/        les petites fonctions : dates, distance, tri
├── types/        les types TypeScript : User, Event
├── i18n/         la traduction (fr.json, en.json)
├── data/         les événements de démonstration
└── constants/    le thème : couleurs, polices, espacements
```

- Les **écrans** affichent et assemblent des composants.
- Les **contextes** gardent l'état partagé, et les écrans y accèdent avec `useAuth()` et `useEvents()`.
- Les **services** font le travail. **Un seul fichier**, `services/storage.ts`, accède à AsyncStorage.

**Sécurité (prototype) :** les mots de passe ne sont jamais enregistrés en clair, seulement leur empreinte **SHA-256** (`expo-crypto`). Sans serveur, c'est une sécurité de démonstration, pas de production.

---

## Technologies

| Outil | Rôle |
|---|---|
| React Native + Expo (SDK 57) | l'application mobile |
| TypeScript | le typage du code |
| Expo Router (React Navigation) | la navigation |
| AsyncStorage | le stockage local |
| i18next | la traduction français / anglais |
| react-native-calendars | le calendrier |
| expo-location | le géocodage et la position |
| expo-calendar | l'ajout au calendrier du téléphone |
| expo-crypto | le hachage des mots de passe |
| Open-Meteo | l'API météo |

---

## Limites connues

- Les données sont stockées **sur le téléphone** : elles ne sont pas partagées entre les membres. Il faudrait un serveur pour ça.
- Le **splash screen** personnalisé ne s'affiche pas dans **Expo Go**, qui montre son propre écran de chargement. Il apparaît dans une version compilée de l'application.
- La **météo** n'est disponible que pour les événements des 16 prochains jours (la limite d'Open-Meteo).
