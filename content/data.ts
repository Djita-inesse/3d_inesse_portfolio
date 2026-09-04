/**
 * ---------------------------------------------------------------------------
 * CONTENU DU SITE
 * ---------------------------------------------------------------------------
 * Source unique de verite : aucun texte n'est ecrit en dur dans les composants.
 *
 * A COMPLETER (voir README) :
 *   - site.phone          numero de telephone
 *   - site.linkedin       URL exacte du profil
 *   - site.url            domaine de production
 *   - profile.portrait    photo de profil (260x320)
 *   - projects[].image    captures d'ecran des projets (ratio 5:2)
 *   - repositories[3]     nom du depot API a epingler
 *   - /public/cv-inesse-djita.pdf
 */

export type NavItem = { id: string; label: string };

export const site = {
  name: "Inesse Djita",
  role: "Développeuse full stack",
  email: "inesdjita@gmail.com",
  phone: "[numéro à confirmer]",
  github: "https://github.com/Djita-inesse",
  githubLabel: "github.com/Djita-inesse",
  linkedin: "https://www.linkedin.com/in/inesse-djita/",
  cv: "/cv-inesse-djita.pdf",
  url: "https://inesse-djita.vercel.app",
  description:
    "Portfolio d'Inesse Djita, développeuse full stack. Interfaces React et Next.js sur API back-end, mise en production web et mobile. Recherche un stage full stack à Nantes ou en Île-de-France.",
} as const;

export const navItems: NavItem[] = [
  { id: "projets", label: "Projets" },
  { id: "code", label: "Code" },
  { id: "stack", label: "Stack" },
  { id: "parcours", label: "Parcours" },
  { id: "contact", label: "Contact" },
];

export const profile = {
  intro:
    "Je construis des interfaces React/Next.js sur des API back-end, et j'accompagne les produits jusqu'à leur mise en production — y compris la publication sur Google Play et l'App Store. Quatre ans de pratique, en agence puis à mon compte.",
  availability: "Recherche un stage full stack — Master 1, Ynov Campus Nantes.",
  portrait: null as string | null,
  portraitAlt: "Portrait d'Inesse Djita, développeuse full stack",
};

export type Project = {
  number: string;
  title: string;
  year: string;
  context: string;
  points: string[];
  stack: string[];
  image: string | null;
  imageCaption: string;
};

export const projects: Project[] = [
  {
    number: "01",
    title: "2LN Learning Institute",
    year: "2026",
    context: "Plateforme de formation RH — refonte complète, en production.",
    points: [
      "Front Next.js 16 / React 19 / TypeScript / Tailwind adossé à une API Django REST.",
      "Cinq parcours de diagnostic en formulaires multi-étapes avec restitution des résultats.",
      "Accès conditionné au paiement : contrôle côté serveur, intégration WooCommerce et PHP sur mesure.",
      "Plus de 50 utilisateurs en production.",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind",
      "Django REST",
      "WooCommerce",
      "PHP",
    ],
    image: null,
    imageCaption: "Parcours de diagnostic — écran de restitution",
  },
  {
    number: "02",
    title: "G-Buy",
    year: "2026",
    context:
      "Plateforme d'achat groupé — gbuy-cm.com — projet personnel, en production.",
    points: [
      "Conception du produit, développement et exploitation commerciale de bout en bout.",
      "Tunnel d'acquisition : campagnes Facebook, redirection WhatsApp, calendrier éditorial.",
      "Itérations de conversion pilotées par les retours réels des utilisateurs.",
    ],
    stack: ["Développement", "e-commerce", "acquisition"],
    image: null,
    imageCaption: "Page d'accueil et tunnel de commande",
  },
  {
    number: "03",
    title: "Publication d'applications mobiles",
    year: "2024 – 2026",
    context: "Missions de mise en production sur Google Play et l'App Store.",
    points: [
      "Sendo — Product Owner : cadrage fonctionnel, priorisation du backlog et suivi des développements jusqu'à la publication sur les deux stores.",
      "LuvNote — mise en conformité d'une application de rencontre avec les politiques Google Play : classification du contenu, cohérence de marque, réécriture de la fiche store. Publication débloquée.",
      "MadBeauty — production automatisée des visuels stores en Python/Pillow, dont les captures iPhone au format 6,9 pouces aux spécifications App Store Connect.",
    ],
    stack: ["Google Play", "App Store", "Product ownership", "Python"],
    image: null,
    imageCaption: "Fiches store Google Play et App Store",
  },
  {
    number: "04",
    title: "Sites clients livrés",
    year: "2025 – 2026",
    context:
      "Intégration et mise en ligne de sites clients, du maquettage à la production.",
    points: [
      "Sinequanone Engineering — sinequanone-engineering.fr — bureau d'études en planification. Une trentaine de pages sous WordPress/Elementor : 11 activités, 9 fiches de formation, FAQ, carrière, formulaires avec validation sans rechargement, version anglaise.",
      "ADEPA Santé — adepasante.org — association loi 1901 (France, Cameroun, Luxembourg). Parcours d'entrée par besoin, ressources, agenda, dons, blog, conformité RGPD.",
      "Dayness Cosmetics — dayness-cosmetics.fr — boutique Shopify : deux gammes, routines groupées, module de diagnostic, programme d'affiliation, checkout multi-pays et boutique bilingue.",
    ],
    stack: [
      "WordPress",
      "Elementor",
      "Shopify",
      "PHP",
      "JavaScript",
      "SEO technique",
    ],
    image: null,
    imageCaption: "Trois sites livrés — vue d'ensemble",
  },
];

export const codeIntro =
  "Dépôts épinglés, chacun avec un README décrivant le projet, la stack et la procédure de lancement.";

export type Repository = { name: string; description: string };

export const repositories: Repository[] = [
  {
    name: "portfolio",
    description: "Ce site — Next.js, TypeScript, rendu statique",
  },
  {
    name: "gbuy-platform",
    description: "Plateforme d'achat groupé — front et back",
  },
  {
    name: "2ln-diagnostics",
    description: "Formulaires multi-étapes et restitution de résultats",
  },
  {
    name: "[projet API]",
    description: "API REST, base de données, authentification, tests Vitest",
  },
];

export type Tech = { code: string; label: string };
export type StackGroup = { title: string; items: Tech[] };

export const stackGroups: StackGroup[] = [
  {
    title: "Front & mobile",
    items: [
      { code: "RE", label: "React.js" },
      { code: "NX", label: "Next.js (App Router)" },
      { code: "TS", label: "TypeScript" },
      { code: "H5", label: "HTML5" },
      { code: "C3", label: "CSS3" },
      { code: "TW", label: "Tailwind CSS" },
      { code: "FL", label: "Flutter" },
      { code: "RD", label: "Responsive design" },
    ],
  },
  {
    title: "Back-end & données",
    items: [
      { code: "ND", label: "Node.js" },
      { code: "SQ", label: "SQL" },
      { code: "FB", label: "Firebase (Firestore, Auth)" },
      { code: "AP", label: "API REST" },
      { code: "PH", label: "PHP" },
      { code: "WP", label: "WordPress" },
      { code: "SH", label: "Shopify" },
    ],
  },
  {
    title: "Qualité & outils",
    items: [
      { code: "GH", label: "Git & GitHub" },
      { code: "VI", label: "Vitest" },
      { code: "PW", label: "Playwright" },
      { code: "AG", label: "Agile / Scrum" },
      { code: "SE", label: "SEO technique" },
      { code: "GP", label: "Google Play" },
      { code: "AS", label: "App Store" },
    ],
  },
];

export type TimelineEntry = {
  role: string;
  place: string;
  dates: string;
};

export const experience: TimelineEntry[] = [
  {
    role: "Développeuse web — freelance",
    place: "À mon compte — Douala, Cameroun",
    dates: "depuis mars 2025",
  },
  {
    role: "Développeuse web junior — stage professionnel (13 mois)",
    place: "Franchise IT — Douala, Cameroun",
    dates: "janv. 2024 – févr. 2025",
  },
  {
    role: "Développeuse web",
    place: "JSC-Market — Douala, Cameroun",
    dates: "juin 2022 – févr. 2023",
  },
];

export const education: TimelineEntry[] = [
  {
    role: "Master 1 — Développement Full Stack",
    place: "Ynov Campus — Nantes",
    dates: "depuis sept. 2026",
  },
  {
    role: "Master 1 — Systèmes d'information & Génie logiciel",
    place: "Douala",
    dates: "2025 – juin 2026",
  },
  {
    role: "Licence professionnelle — Génie logiciel",
    place: "Institut Universitaire de la Côte — Douala",
    dates: "2024 – 2025",
  },
  {
    role: "BTS — Développement d'applications web",
    place: "Institut Universitaire de la Côte — Douala",
    dates: "sept. 2021 – mai 2023",
  },
];

export const languages = [
  "Français — langue de travail, DALF C1",
  "Anglais — professionnel",
  "Certification Coursera : UX, Figma et agilité",
];

export const alsoItems = [
  "SFT Construction CM — site vitrine et portfolio en React, galerie filtrable de douze projets.",
  "PEMBO — refonte du site e-commerce d'un distributeur de fournitures (Douala).",
  "TALENTIIS — cahier des charges d'une plateforme LMS : cinq rôles, parcours de paiement, planning.",
  "Maquettage et prototypage sous Figma — conception des interfaces en amont du développement, sur mes projets clients.",
];

export const contact = {
  availability:
    "Disponible pour un stage full stack à Nantes ou en Île-de-France.",
  cta: "Me contacter",
};
