# Mini CMS

Mini CMS développé dans le cadre d'un TP BUT MMI (AdonisJS). Objectif : permettre à un administrateur de gérer des pages de contenu (créer, modifier, publier, organiser dans un menu) et aux visiteurs de consulter les pages publiées sur un site public.

## Fonctionnalités

**Site public**

- Liste des pages publiées (titre + extrait) sur la page d'accueil
- Affichage d'une page publiée (`/mon-slug`), 404 si brouillon ou inexistante
- Menu de navigation basé sur les pages marquées "afficher dans le menu", trié par ordre
- Contenu des pages écrit en Markdown et rendu en HTML

**Back-office** (`/admin`, connexion requise)

- Tableau de bord : compteurs (pages publiées, brouillons, utilisateurs), derniers contenus modifiés
- CRUD complet des pages : création, édition, suppression (avec confirmation), publier/dépublier en un clic
- Slug généré automatiquement depuis le titre s'il est laissé vide
- Recherche par titre, filtre par statut et par auteur, tri par date
- Médiathèque : upload d'images, texte alternatif, renommage, suppression, réutilisation d'une même image comme couverture sur plusieurs pages
- Gestion des comptes (admin uniquement) : rôles Administrateur / Éditeur, création/modification/suppression de comptes

**Auth**

- Connexion/déconnexion par session, pas d'inscription publique
- Compte admin créé via un seeder (identifiants lus dans `.env`)
- Un éditeur ne peut pas accéder à la gestion des comptes (403)

## Technologies

- [AdonisJS 7](https://adonisjs.com) (Node.js ≥ 24)
- [Lucid ORM](https://lucid.adonisjs.com) + SQLite (`better-sqlite3`)
- [VineJS](https://vinejs.dev) pour la validation, messages d'erreur traduits en français
- [Edge.js](https://edgejs.dev) pour les vues
- [Tailwind CSS v4](https://tailwindcss.com) + [Alpine.js](https://alpinejs.dev)
- [marked](https://marked.js.org) pour le rendu Markdown → HTML

## Installation

Prérequis : Node.js ≥ 24 (un fichier `.nvmrc` est fourni : `nvm use`).

```bash
npm install
```

Copier le fichier d'environnement et compléter les variables (voir ci-dessous) :

```bash
cp .env.example .env
node ace generate:key
```

Éditer `.env` et renseigner au minimum `APP_KEY` (généré par la commande précédente) et les identifiants admin :

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
```

Lancer les migrations puis le seeder (crée le compte admin) :

```bash
node ace migration:run
node ace db:seed
```

Démarrer le serveur de développement :

```bash
npm run dev
```

Le site est accessible sur `http://localhost:3333`, le back-office sur `http://localhost:3333/admin` (identifiants = ceux renseignés dans `.env`).

## Variables d'environnement

Voir `.env.example`. Les variables `ADMIN_EMAIL` / `ADMIN_PASSWORD` sont lues par `database/seeders/admin_user_seeder.ts` : relancer `node ace db:seed` après les avoir modifiées pour mettre à jour le compte admin (le seeder peut être relancé sans dupliquer le compte).

## Workflow Git

`main` est la branche de production. Le développement se fait sur `develop`, avec une branche dédiée par tâche (`1/models-migrations`, `2/auth-admin`, etc.), mergée dans `develop` une fois testée.

## Utilisation de l'IA

- **Outils utilisés** : Claude (Claude Code), déboguer en conditions réelles (navigateur piloté) et discuter des choix techniques (structure des routes, validation, modèle de données).

- **Avantages constatés** : mise en place rapide des parties répétitives (migrations, CRUD, validation VineJS), bonne connaissance des conventions AdonisJS/Lucid, aide précieuse pour traduire les messages d'erreur et tester chaque fonctionnalité en direct avant de passer à la suivante.

- **Difficultés rencontrées** : certaines suppositions de l'IA se sont révélées fausses et ont nécessité une vérification manuelle (comportement de SQLite avec les booléens, portée des variables dans les composants Edge). La demande de fonctionnalités bonus en cours de route a aussi demandé de cadrer précisément le périmètre pour ne pas perdre de temps.

- **Erreurs corrigées** : un bug où le style du bouton principal ne s'affichait pas (écrasé par une valeur existante dans le composant), une requête SQL comparant un booléen JS (`true`) à un entier SQLite (`1`) qui empêchait le menu de s'afficher, une variable non transmise à un layout Edge isolé, et l'absence de contrainte `ON DELETE SET NULL` appliquée par SQLite (gérée manuellement dans le code).
