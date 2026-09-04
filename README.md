# Portfolio — Inesse Djita

Portfolio personnel en **Next.js 16 (App Router) + TypeScript**, page unique,
rendu statique, destiné à Vercel.

Mise en page de type document professionnel : hiérarchie par la typographie,
filets de 1px et espace blanc. Pas de dégradés, d'ombres portées, d'angles
arrondis, de badges colorés ni de cartes flottantes.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script          | Rôle                                     |
| --------------- | ---------------------------------------- |
| `npm run dev`   | serveur de développement                 |
| `npm run build` | build de production                      |
| `npm start`     | sert le build de production              |
| `npm run lint`  | ESLint (config `next/core-web-vitals`)   |

## Structure

```
app/
  layout.tsx      métadonnées, polices, script anti-flash du thème, en-tête/pied
  page.tsx        assemblage des sections
  globals.css     tokens, grille, styles de toutes les sections
  icon.svg        favicon
components/
  Header.tsx      en-tête collé + scrollspy (IntersectionObserver)
  ThemeToggle.tsx bascule de thème (sans état React, lit data-theme)
  BackToTop.tsx   bouton flottant au-delà de 600px de défilement
  Reveal.tsx      l'unique mécanique d'animation d'entrée
  Section.tsx     gabarit étiquette 150px + contenu fluide
  Figure.tsx      cadre d'image, avec état "placeholder" légendé
  Hero / Projects / CodeSection / Stack / Parcours / Also / Contact / Footer
content/
  data.ts         TOUT le contenu du site
```

## Modifier le contenu

Aucun texte n'est écrit en dur dans les composants : tout vit dans
[`content/data.ts`](content/data.ts), typé.

- `site` — nom, rôle, e-mail, téléphone, liens GitHub / LinkedIn / CV, URL de prod
- `navItems` — ancres de l'en-tête (chaque `id` doit exister sur une `<Section>`)
- `profile` — paragraphe de positionnement, phrase de disponibilité, portrait
- `projects` — les 4 blocs numérotés
- `repositories` — dépôts épinglés de la section Code
- `stackGroups` — les 3 colonnes et leurs monogrammes de 2 lettres
- `experience` / `education` / `languages` — la section Parcours
- `alsoItems`, `contact` — sections Aussi et Contact

## Design system

Tokens CSS sur `:root` dans `app/globals.css`, thème clair par défaut.

| Token           | Clair     | Sombre    |
| --------------- | --------- | --------- |
| `--fond`        | `#FAF9F7` | `#141110` |
| `--encre`       | `#1A1A1A` | `#F2EEE8` |
| `--encre-douce` | `#5A544E` | `#A39C93` |
| `--filet`       | `#DCD6CE` | `#332E29` |
| `--brique`      | `#B4482E` | `#D9663F` |
| `--sur-brique`  | `#FFFFFF` | `#141110` |
| `--surface`     | `#EFEBE4` | `#1E1A18` |

La brique est réservée aux liens, aux puces, aux numéros de projet et à l'unique
bouton plein.

Le thème bascule via `data-theme` sur `<html>`, mémorisé dans `localStorage`,
initialisé depuis `prefers-color-scheme`. Un script inline dans le `<head>` le
pose avant le premier rendu pour éviter le flash. Sans JavaScript, une requête
`prefers-color-scheme` prend le relais.

Grille : 1440px de large, 180px de marge, 1080px de contenu. Sections en deux
colonnes (étiquette 150px, gouttière 56px). Ruptures à 1080px et 720px ; sur
mobile, marges de 24px et H1 à 40px.

Typographie : Archivo (titres, étiquettes) et Source Serif 4 (corps), chargées
via `next/font` — pas de requête vers Google Fonts au runtime.

## Animations

Une seule mécanique, dans `Reveal.tsx` : `opacity` 0→1 et `translateY` 16px→0,
400ms ease-out, `IntersectionObserver` à 15%, une seule fois, 60ms de décalage
entre les enfants d'une liste. Survol des liens 150ms, bascule de thème 200ms.

`prefers-reduced-motion: reduce` désactive tout en CSS — le contenu est alors
visible immédiatement, sans attendre l'hydratation.

## À compléter avant la mise en ligne

Ces éléments sont des placeholders explicites, signalés en tête de
`content/data.ts` :

- [ ] `site.phone` — numéro de téléphone (affiché tel quel : `[numéro à confirmer]`)
- [ ] `site.linkedin` — vérifier l'URL exacte du profil
- [ ] `site.url` — domaine de production (sert aux métadonnées Open Graph)
- [ ] `profile.portrait` — photo 260×320, à déposer dans `public/`
- [ ] `projects[].image` — captures d'écran au ratio 5:2, à déposer dans `public/`
- [ ] `repositories[3].name` — nom du dépôt API à épingler
- [ ] `public/cv-inesse-djita.pdf` — le CV ; sans ce fichier, les liens « CV » sont morts

Tant qu'une image vaut `null`, son cadre affiche sa légende — c'est l'état
représenté sur les maquettes. Renseigner le chemin suffit à la faire apparaître,
au même format, via `next/image`.

## Déploiement

Vercel détecte Next.js automatiquement. La page est pré-rendue statiquement au
build (`○ Static` dans la sortie de `next build`) : aucune donnée dynamique,
aucun cookie, aucune API.
