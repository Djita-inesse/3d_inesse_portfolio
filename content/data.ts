/**
 * ---------------------------------------------------------------------------
 * CONTENU DU SITE
 * ---------------------------------------------------------------------------
 * Source unique de vérité, alignée mot pour mot sur la maquette Figma
 * « Portfolio – Desktop » (frame Desktop 1440).
 *
 * IMAGES : public/figma/ (exportées depuis la maquette)
 * PDF    : public/cv-fullstack.pdf et public/cv-gestion-projet.pdf
 */

export type NavItem = { id: string; label: string };

export const site = {
  name: "Inesse Djita",
  legalName: "Inesse Carelle Djita Fokong",
  role: "Développeuse full stack · Product Owner",
  roleLong:
    "Développeuse full stack · Product Owner / cheffe de projet digital",
  email: "inesdjita@gmail.com",
  phone: "+33 7 80 89 39 89",
  phoneHref: "tel:+33780893989",
  github: "https://github.com/Djita-inesse",
  githubLabel: "github.com/Djita-inesse",
  linkedin: "https://www.linkedin.com/in/inesse-carelle-djita-fokong-028372241/",
  linkedinLabel: "linkedin.com/in/inesse-carelle-djita-fokong",
  url: "https://djitainesse.vercel.app",
  urlLabel: "djitainesse.vercel.app",
  cvFullstack: "/cv-fullstack.pdf",
  cvGestion: "/cv-gestion-projet.pdf",
  description:
    "Portfolio d'Inesse Djita, développeuse full stack et Product Owner. Interfaces React et Next.js, sites WordPress, publication d'applications mobiles. Recherche une alternance full stack à Nantes, avec mobilité en France.",
} as const;

export type Cv = {
  id: "fullstack" | "gestion";
  title: string;
  subtitle: string;
  /** null tant que le PDF n'est pas déposé dans public/ */
  file: string | null;
  preview: string | null;
  downloadName: string;
};

export const cvs: Cv[] = [
  {
    id: "fullstack",
    title: "CV Full Stack",
    subtitle: "React, Next.js, TypeScript, Node.js, PHP",
    file: "/cv-fullstack.pdf",
    preview: "/cv-fullstack-apercu.png",
    downloadName: "CV_Inesse_Djita_Fokong_Full_Stack.pdf",
  },
  {
    id: "gestion",
    title: "CV Gestion de projet",
    subtitle: "Product Owner · cheffe de projet digital",
    file: "/cv-gestion-projet.pdf",
    preview: "/cv-gestion-projet-apercu.png",
    downloadName: "CV_Inesse_Djita_Fokong_Gestion_de_projet.pdf",
  },
];

export const navItems: NavItem[] = [
  { id: "accueil", label: "Accueil" },
  { id: "profil", label: "Profil" },
  { id: "arsenal", label: "Arsenal" },
  { id: "parcours", label: "Parcours" },
  { id: "projets", label: "Projets" },
  { id: "contact", label: "Contact" },
];

/* ----------------------------------------------------------------- 01 ---- */

export const hero = {
  ribbon: "JE RECHERCHE UNE ALTERNANCE",
  title: ["INESSE", "DJITA"],
  subtitle: "DÉVELOPPEUSE FULL STACK · PRODUCT OWNER",
  bio: "Profil hybride technique et produit : je conçois des interfaces React / Next.js et des sites WordPress sur mesure, et je pilote des applications mobiles jusqu’à leur publication sur Google Play et l’App Store. Trois ans d’expérience, en agence, en stage et en indépendante. Je recherche une alternance full stack à partir de septembre 2027 à Nantes, avec mobilité dans toute la France.",
  ctaProjects: "DÉCOUVRIR LES PROJETS",
  ctaCv: "VOIR LES CV",
};

export const headline = ["FRONT-END D'ABORD,", "PRODUIT TOUJOURS."];

export const pitch =
  "Interfaces React / Next.js, sites WordPress sur mesure et pilotage d’applications mobiles jusqu’à leur publication. Trois ans d’expérience, en agence, en stage et en indépendante.";

export const alternance = {
  kicker: "RECHERCHE",
  badge: "ALT",
  title: "ALTERNANCE",
  text: "Développement full stack · Nantes et mobilité France · à partir de septembre 2027. Rythme à définir avec l'employeur.",
};

export type Stat = { kicker: string; value: string; label: string };

export const stats: Stat[] = [
  { kicker: "PRATIQUE", value: "3", label: "ans d’expérience" },
  { kicker: "PO", value: "2", label: "produits pilotés" },
  { kicker: "DISPO", value: "ALT", label: "en recherche" },
];

export const passion = {
  badge: "ANI",
  title: ["MA PASSION :", "LES ANIMES"],
  detail: ["SNK · JJK", "Demon Slayer"],
};

export type Character = {
  name: string;
  src: string;
  height: number;
  /** Fond derrière l'illustration (Levi est sur fond blanc). */
  light?: boolean;
  /** Vitesse de parallaxe relative. */
  speed: number;
};

export const characters: Character[] = [
  { name: "Mikasa Ackerman", src: "/figma/snk-mikasa.png", height: 260, speed: 0.06 },
  { name: "Satoru Gojo", src: "/figma/jjk-gojo.png", height: 240, speed: 0.1 },
  { name: "Tanjiro Kamado", src: "/figma/ds-tanjiro.png", height: 220, speed: 0.04 },
  { name: "Levi Ackerman", src: "/figma/snk-levi.png", height: 260, light: true, speed: 0.08 },
  { name: "Nezuko Kamado", src: "/figma/ds-nezuko.png", height: 220, speed: 0.12 },
  { name: "Yuji Itadori", src: "/figma/jjk-itadori.png", height: 240, speed: 0.05 },
];

/* ----------------------------------------------------------------- 02 ---- */

export const profil = {
  kicker: "PROFIL",
  title: ["TECHNIQUE", "ET PRODUIT."],
  text: "Je construis des interfaces React / Next.js / TypeScript sur back-end Node.js ou PHP, et j’ai tenu le rôle de Product Owner en équipe Agile / Scrum. Mon bagage de développeuse me permet de dialoguer avec les équipes, d’estimer la charge et de recetter les livrables.",
  steps: [
    {
      number: "01",
      title: "Cadrer",
      text: "Recueil des besoins, cahier des charges, user stories, priorisation du backlog.",
    },
    {
      number: "02",
      title: "Construire",
      text: "React, Next.js, TypeScript, Node.js, PHP, WordPress, Flutter.",
    },
    {
      number: "03",
      title: "Livrer",
      text: "Recette, conformité Google Play et App Store, mise en production.",
    },
  ],
  portrait: { src: "/figma/snk-levi.png", alt: "Illustration au trait de Levi Ackerman" },
  universe: {
    kicker: "UNIVERS PERSONNEL",
    title: "Levi Ackerman",
    text: "J’aime les anime, en particulier Shingeki no Kyojin. Cet univers fait partie de ma personnalité, à côté du développement et du produit.",
  },
  culture: {
    kicker: "ANIME & CULTURE",
    text: "En dehors des projets, je suis passionnée d’anime : L’Attaque des Titans, Jujutsu Kaisen et Demon Slayer.",
    badge: "SNK",
  },
};

/* ----------------------------------------------------------------- 03 ---- */

export const arsenal = {
  kicker: "COMPÉTENCES TECHNIQUES & PRODUIT",
  title: "ARSENAL",
  groups: [
    {
      title: "FRONT-END & MOBILE",
      text: "React.js · Next.js App Router · TypeScript · JavaScript · HTML5 / CSS3 · Tailwind CSS · Flutter · Responsive design",
    },
    {
      title: "BACK-END & DONNÉES",
      text: "Node.js · SQL · Firebase Firestore & Auth · PHP · WordPress / WooCommerce · Shopify · API REST · Django REST",
    },
    {
      title: "DESIGN, QUALITÉ & OUTILS",
      text: "Figma · Adobe Illustrator · Git & GitHub · Vitest · Playwright · Agile Scrum · SEO technique · Google Play · App Store",
    },
    {
      title: "IA & VEILLE",
      text: "Claude au quotidien : développement, revue, débogage et tests. Veille LLM et agents IA.",
    },
  ],
  pills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "PHP",
    "Laravel",
    "WordPress",
    "Flutter",
    "Figma",
    "Jira",
    "Firebase",
    "MySQL",
    "Shopify",
    "Tailwind CSS",
    "Vitest",
    "Playwright",
    "SEO technique",
  ],
  visual: {
    src: "/figma/jjk-gojo.png",
    alt: "Illustration de Satoru Gojo, extension du territoire",
    title: "Satoru Gojo",
    text: "Extension du territoire · Jujutsu Kaisen",
    badge: "JJK",
  },
};

/* ----------------------------------------------------------------- 04 ---- */

export type TimelineEntry = {
  dates: string;
  /** Mention affichée à côté des dates (ex. « EN COURS »). */
  status?: string;
  title: string;
  lines: string[];
};

export const parcours = {
  title: "PARCOURS",
  experience: {
    kicker: "EXPÉRIENCE",
    entries: [
      {
        dates: "Nov. 2026 – avr. 2027",
        status: "EN COURS",
        title: "Stagiaire développeuse web et marketing digital · Inspire Academy",
        lines: [
          "Biarritz · Sites WordPress et nouvelle plateforme e-learning, SEO de la marque Inspire Bridge (site multilingue FR / ES / EN).",
        ],
      },
      {
        dates: "Mars 2025 →",
        title: "Freelance, développeuse et Product Owner/cheffe de projet digital",
        lines: [
          "À distance · Développement full stack, pilotage Agile, recette et publication web / mobile.",
        ],
      },
      {
        dates: "Janv. 2024 – févr. 2025",
        title: "Développeuse web junior · Franchise IT",
        lines: [
          "Douala · WordPress / PHP sur mesure, maquettes Figma / Illustrator et Firebase.",
        ],
      },
      {
        dates: "Juin 2022 – févr. 2023",
        title: "Stage · JSC-Market",
        lines: [
          "Douala · Interfaces React, API tierces et collaboration avec les designers.",
        ],
      },
    ] as TimelineEntry[],
  },
  education: {
    kicker: "FORMATION",
    entries: [
      {
        dates: "Sept. 2026 →",
        title: "Master Développement Full Stack M1",
        lines: ["Ynov Campus Nantes · M1 en cours"],
      },
      {
        dates: "2025 – juin 2026",
        title: "Master 1 Systèmes d'information et génie logiciel",
        lines: ["IUC Douala"],
      },
      {
        dates: "2021 – 2025",
        title: "Licence professionnelle & BTS",
        lines: [
          "IUC Douala",
          "2024–2025 · Licence professionnelle Génie logiciel, en alternance chez Franchise IT.",
          "Sept. 2021 – mai 2023 · BTS Développement d'applications web.",
        ],
      },
    ] as TimelineEntry[],
  },
};

/* ----------------------------------------------------------------- 05 ---- */

export type Project = {
  number: string;
  kicker: string;
  title: string;
  context: string;
  did: string[];
  /** Le résultat clé, mis en avant dans une bulle. */
  result: { figure: string; label: string };
  stack: string[];
  href?: string;
  hrefLabel?: string;
  image: string;
  imageAlt: string;
  imageRatio: string;
};

export const projectsIntro = {
  kicker: "RÉALISATIONS EN PRODUCTION",
  title: "PROJETS",
};

export const projects: Project[] = [
  {
    number: "01",
    kicker: "Plateforme de formation · 2026 · en production",
    title: "2LN LEARNING INSTITUTE",
    context: "Refonte complète d’une plateforme de formation RH.",
    did: [
      "Front-end Next.js 16, React 19, TypeScript et Tailwind CSS, connecté à une API Django REST.",
      "5 parcours de diagnostic multi-étapes avec restitution, à accès conditionné au paiement.",
      "Paiement côté serveur, WooCommerce et PHP sur mesure.",
    ],
    result: { figure: "50+", label: "utilisateurs en production" },
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind", "Django REST", "WooCommerce", "PHP"],
    href: "https://2lnlearninginstitute.com",
    hrefLabel: "2lnlearninginstitute.com",
    image: "/figma/projet-2ln.png",
    imageAlt: "Capture réelle de 2LN Learning Institute : page des familles de diagnostic",
    imageRatio: "1750 / 762",
  },
  {
    number: "02",
    kicker: "Plateforme e-commerce · 2026 · en production",
    title: "G-BUY",
    context: "Plateforme d’achat groupé : projet personnel conçu, développé et exploité de bout en bout.",
    did: [
      "Conception produit et développement full stack.",
      "Acquisition Facebook → WhatsApp et calendrier éditorial.",
      "Itérations de conversion selon les retours réels.",
    ],
    result: { figure: "A → Z", label: "conçu, développé et exploité" },
    stack: ["Développement", "E-commerce", "Acquisition"],
    href: "https://gbuy-cm.com",
    hrefLabel: "gbuy-cm.com",
    image: "/figma/projet-gbuy.png",
    imageAlt: "Capture réelle de G-Buy : produits vedettes de la boutique",
    imageRatio: "1750 / 762",
  },
  {
    number: "03",
    kicker: "Product ownership · 2024–2026",
    title: "PUBLICATION APPS MOBILES",
    context: "Product Owner sur trois applications mobiles, jusqu’à leur publication sur les stores.",
    did: [
      "Sendo : cadrage, backlog et user stories pour une équipe de 8, suivi jusqu’à Google Play et l’App Store.",
      "LuvNote : mise en conformité Google Play (classification, cohérence de marque, fiche store réécrite), publication débloquée.",
      "MadBeauty : automatisation des visuels stores, captures iPhone 6,9 pouces aux spécifications App Store Connect.",
    ],
    result: { figure: "40+", label: "user stories livrées" },
    stack: ["Google Play", "App Store", "Product Ownership", "Recette & tests"],
    image: "/figma/projet-apps-mobiles.png",
    imageAlt: "Capture réelle de la fiche Google Play de l'application Sendo",
    imageRatio: "1750 / 762",
  },
  {
    number: "04",
    kicker: "Sites clients · 2025–2026 · en production",
    title: "SITES CLIENTS LIVRÉS",
    context: "Une sélection de sites livrés pour des clients aux besoins très différents.",
    did: [
      "Sinequanone Engineering : ~30 pages WordPress / Elementor, 11 activités, 9 fiches formation, formulaires validés sans rechargement, version anglaise.",
      "ADEPA Santé : association France / Cameroun / Luxembourg, parcours par besoin, agenda, dons, blog, RGPD.",
      "Dayness Cosmetics : Shopify, 2 gammes, routines, diagnostic, affiliation, checkout multi-pays, bilingue.",
    ],
    result: { figure: "3+", label: "sites clients en production" },
    stack: ["WordPress", "Elementor", "Shopify", "PHP", "SEO technique"],
    image: "/figma/projet-sites-clients.png",
    imageAlt: "Captures réelles de trois sites clients livrés",
    imageRatio: "1750 / 762",
  },
];

export const also = {
  kicker: "AUTRES RÉALISATIONS",
  items: [
    { title: "SFT Construction CM", text: "Site vitrine WordPress · thème PHP sur mesure · galerie filtrable 12 projets" },
    { title: "PEMBO", text: "Refonte e-commerce distributeur Douala · PHP / Laravel" },
    { title: "TALENTIIS", text: "Cahier des charges LMS · 5 rôles / paiement / planning" },
  ],
};

/* ----------------------------------------------------------------- 06 ---- */

export type Study = {
  kicker: string;
  title: string;
  text: string;
  stack: string[];
  href: string;
  hrefLabel: string;
  image: string;
  imageAlt: string;
  /** Proportions de la capture (sinon hauteur fixe de la maquette). */
  imageRatio?: string;
  /** Capture prise sur le canevas sombre de Figma. */
  imageDark?: boolean;
};

export const designIntro = {
  kicker: "MAQUETTES & PROTOTYPES FIGMA",
  title: "DESIGN UI-UX",
  text: "Maquettes et prototypes conçus sous Figma. Architecture des écrans, système de composants et parcours complets.",
};

export const studies: Study[] = [
  {
    kicker: "App mobile · mise en relation professionnelle",
    title: "GECAF",
    text: "Application mobile de mise en relation professionnelle : connexion, actualités, forum, messagerie, espace entreprise, appels d'offres et paiement d'adhésion. Architecture complète des écrans et système de composants Figma.",
    stack: ["Figma", "App mobile", "Prototypage"],
    href: "https://www.figma.com/design/JzePxN8ECkdPf52zxhpqTp/GECAF_maquette",
    hrefLabel: "figma.com/design/JzePxN8ECkdPf52zxhpqTp/GECAF_maquette",
    image: "/figma/design-gecaf-planches.png",
    imageAlt:
      "Vue d'ensemble de la maquette Figma GECAF : parcours de connexion et d'inscription, pages de chat, accueil et actualités",
    imageRatio: "2230 / 749",
    imageDark: true,
  },
  {
    kicker: "Plateforme BTP · 3 rôles",
    title: "SMARTBUILD",
    text: "Plateforme BTP à 3 rôles : fournisseur, acheteur, transporteur. Inscription, suivi des commandes, messagerie intégrée. Parcours complets et système de composants.",
    stack: ["Figma", "Web app"],
    href: "https://www.figma.com/design/jC6echsHspdD0bszyUnbuA/smartbuild",
    hrefLabel: "figma.com/design/jC6echsHspdD0bszyUnbuA/smartbuild",
    image: "/figma/design-smartbuild.png",
    imageAlt: "Planche Figma de la plateforme SmartBuild",
    imageRatio: "1120 / 700",
  },
  {
    kicker: "Back-office · gestion",
    title: "DIVEEZ",
    text: "Back-office de gestion : tableau de bord, groupes, demandes, fiches clients, paiements et paramètres. Interface administrative complète.",
    stack: ["Figma", "Back-office"],
    href: "https://www.figma.com/design/8pous9ZnUbd4cXd5sujyCW/diveez",
    hrefLabel: "figma.com/design/8pous9ZnUbd4cXd5sujyCW/diveez",
    image: "/figma/design-diveez.png",
    imageAlt: "Planche Figma du back-office Diveez",
    imageRatio: "1120 / 700",
  },
];

/* ----------------------------------------------------------------- 07 ---- */

export const contact = {
  title: ["PARLONS", "D'UNE ALTERNANCE."],
  availability:
    "Alternance développement full stack dès septembre 2027 · Nantes et mobilité France",
  cta: "ÉCRIRE",
  cvFullstack: "CV FULL STACK",
  cvGestion: "CV GESTION DE PROJET",
  portfolio: "PORTFOLIO EN LIGNE",
};

export const footer = {
  languages:
    "Français : DALF C1 · Anglais : B2 professionnel · Certification Coursera : UX, Figma et agilité",
};
