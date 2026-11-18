"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { compagnon } from "@/content/data";

/* --------------------------------------------------------------------------
   Ymir : personnage original au style anime, dessiné en SVG (longs cheveux
   blonds, tunique crème, écharpe rouge assortie au site).
   Squelette articulé (hanches, genoux, épaules, coudes), expressions,
   regard qui suit la souris, marche, course, gestes au repos, saut avec
   anticipation, et on peut l'attraper puis le lâcher (gravité).
   -------------------------------------------------------------------------- */

type Etat =
  | "repos"
  | "marche"
  | "course"
  | "regarde"
  | "etire"
  | "assis"
  | "baille"
  | "sommeil"
  | "salut"
  | "accroupi"
  | "saut"
  | "atterrit"
  | "porte"
  | "chute"
  | "grimpe" // saut jusqu'à la barre de navigation flottante
  | "perche" // assise sur la barre
  | "invoque"; // « Grand Terrassement »

type Expression = "neutre" | "joie" | "surprise" | "dort" | "baille";
type Bulle = { texte: string; cote: "centre" | "gauche" | "droite" };
type Poussiere = { id: number; x: number; sens: 1 | -1 };

const CLE_STOCKAGE = "compagnon-masque";
const VITESSE_MARCHE = 78; // px/s
const VITESSE_COURSE = 230; // px/s
const DISTANCE_COURSE = 320; // au-delà, il court
const GRAVITE = 2600; // px/s²
const IMPULSION_SAUT = 680; // px/s
const SOMMEIL_APRES = 18_000; // ms d'inactivité
const PERCHOIR_TOP = 108; // position (px) de la barre quand Ymir est assise dessus
const HANCHES_ASSISE = 115 / 150; // hauteur des hanches, en position assise, dans le dessin
const DUREE_GRIMPE = 850; // ms
const PAUSE_TERRASSEMENT = 120_000; // au plus un Grand Terrassement spontané toutes les 2 min

/** États où Ymir peut légitimement être en l'air. */
const ETATS_EN_L_AIR: Etat[] = ["saut", "chute", "grimpe", "perche", "porte", "sommeil", "baille", "accroupi"];

const hasard = (min: number, max: number) => min + Math.random() * (max - min);

export default function Compagnon() {
  const [monte, setMonte] = useState(false);
  const [masque, setMasque] = useState(false);
  const [etat, setEtatAffiche] = useState<Etat>("repos");
  const [expression, setExpressionAffichee] = useState<Expression>("neutre");
  const [regardeGauche, setRegardeGauche] = useState(false);
  const [bulle, setBulle] = useState<Bulle | null>(null);
  const [salto, setSalto] = useState(false);
  const [poussieres, setPoussieres] = useState<Poussiere[]>([]);
  const [terrassement, setTerrassement] = useState(false);

  const racine = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const x = useRef(0);
  const y = useRef(0); // hauteur au-dessus du sol
  const vy = useRef(0);
  const cible = useRef(0);
  const etatRef = useRef<Etat>("repos");
  const gaucheRef = useRef(false);
  const prochaineAction = useRef(0);
  const finEtat = useRef(0);
  const apresEtat = useRef<(() => void) | null>(null);
  const derniereActivite = useRef(0);
  const souris = useRef<{ x: number; y: number; t: number } | null>(null);
  const parle = useRef(false);
  const minuterieBulle = useRef<number | undefined>(undefined);
  const minuterieExpression = useRef<number | undefined>(undefined);
  const clics = useRef(0);
  const reduit = useRef(false);
  const glisse = useRef<{ id: number; x0: number; y0: number; deplace: boolean } | null>(null);
  const ignoreClic = useRef(false);
  const derniereBouffee = useRef(0);
  const idPoussiere = useRef(0);
  const perchee = useRef(false);
  const grimpe = useRef<{ t0: number; x0: number; x1: number; y1: number } | null>(null);
  const dernierTerrassement = useRef(-PAUSE_TERRASSEMENT);
  const minuterieClic = useRef<number | undefined>(undefined);

  /* ---------------------------------------------------------------- outils */

  const largeur = () => racine.current?.offsetWidth ?? 84;
  const hauteur = () => svg.current?.getBoundingClientRect().height ?? 126;

  const setEtat = useCallback((suivant: Etat, duree?: number, ensuite?: () => void) => {
    etatRef.current = suivant;
    setEtatAffiche(suivant);
    finEtat.current = duree ? performance.now() + duree : 0;
    apresEtat.current = ensuite ?? null;
  }, []);

  const setExpression = useCallback((exp: Expression, duree?: number) => {
    setExpressionAffichee(exp);
    window.clearTimeout(minuterieExpression.current);
    if (duree) {
      minuterieExpression.current = window.setTimeout(() => setExpressionAffichee("neutre"), duree);
    }
  }, []);

  const tourner = useCallback((gauche: boolean) => {
    if (gauche === gaucheRef.current) return;
    gaucheRef.current = gauche;
    setRegardeGauche(gauche);
  }, []);

  const souffler = useCallback((sens: 1 | -1) => {
    const id = ++idPoussiere.current;
    setPoussieres((liste) => [...liste.slice(-6), { id, x: x.current + largeur() / 2, sens }]);
    window.setTimeout(() => setPoussieres((liste) => liste.filter((p) => p.id !== id)), 650);
  }, []);

  /** Bulle de dialogue ; Ymir s’arrête pendant qu’elle parle. */
  const dire = useCallback(
    (texte: string, duree = 3800) => {
      const l = window.innerWidth;
      const cote = x.current < 130 ? "gauche" : x.current > l - 200 ? "droite" : "centre";
      parle.current = true;
      const e = etatRef.current;
      if (e === "marche" || e === "course") setEtat("repos");
      setBulle({ texte, cote });
      window.clearTimeout(minuterieBulle.current);
      minuterieBulle.current = window.setTimeout(() => {
        setBulle(null);
        parle.current = false;
        prochaineAction.current = performance.now() + hasard(1200, 2500);
      }, duree);
    },
    [setEtat]
  );

  /* ------------------------------------- perchoir sur la barre flottante */

  const quitterPerchoir = useCallback(() => {
    perchee.current = false;
    grimpe.current = null;
    delete document.documentElement.dataset.perchoir;
  }, []);

  /** Saute de la barre et retombe au sol (la gravité fait le reste). */
  const descendre = useCallback(() => {
    if (!perchee.current) return;
    quitterPerchoir();
    vy.current = 260;
    setExpression("joie", 1200);
    setEtat("chute");
  }, [quitterPerchoir, setEtat, setExpression]);

  /** Grimpe s'asseoir sur le coin droit de la barre flottante, si elle est affichée. */
  const monterSurBarre = useCallback(() => {
    const barre = document.querySelector<HTMLElement>(".barre--visible .barre__inner");
    if (!barre || reduit.current) return false;
    const r = barre.getBoundingClientRect();
    const l = largeur();
    const max = window.innerWidth - l - 8;
    const x1 = Math.min(Math.max(r.right - l * 0.4, 8), max);
    // La barre descend à PERCHOIR_TOP ; les hanches se posent sur son bord haut
    const y1 = window.innerHeight - (PERCHOIR_TOP + 6) - hauteur() * (1 - HANCHES_ASSISE);
    perchee.current = true;
    document.documentElement.dataset.perchoir = "1";
    tourner(x1 < x.current);
    setExpression("joie", 1400);
    setEtat("accroupi", 160, () => {
      grimpe.current = { t0: performance.now(), x0: x.current, x1, y1 };
      setEtat("grimpe");
    });
    return true;
  }, [setEtat, setExpression, tourner]);

  /* ------------------------------------------------ Grand Terrassement */

  const invoquer = useCallback(() => {
    const e = etatRef.current;
    if (["porte", "grimpe", "saut", "chute", "invoque", "accroupi"].includes(e)) return;
    if (perchee.current) {
      descendre();
      return;
    }
    dernierTerrassement.current = performance.now();
    tourner(false);
    setExpression("joie");
    dire(compagnon.titans.appel, 3600);
    setEtat("invoque", 4300, () => {
      setExpression("neutre");
      setEtat("repos");
      prochaineAction.current = performance.now() + 4000;
      dire(compagnon.titans.fin, 3400);
    });
    if (!reduit.current) {
      window.setTimeout(() => {
        if (etatRef.current !== "invoque") return;
        setTerrassement(true);
        document.documentElement.classList.add("terrassement");
      }, 700);
    }
  }, [descendre, dire, setEtat, setExpression, tourner]);

  /* -------------------------------------------------------------- actions */

  const choisirAction = useCallback(() => {
    const maintenant = performance.now();
    const max = window.innerWidth - largeur() - 8;
    const s = souris.current;
    const r = Math.random();

    // Parfois, elle grimpe sur la barre de navigation (si elle est affichée)
    if (r < 0.14 && monterSurBarre()) return;
    // Très rarement, et pas plus d'une fois toutes les 2 minutes : les titans
    if (r > 0.975 && maintenant - dernierTerrassement.current > PAUSE_TERRASSEMENT) {
      invoquer();
      return;
    }

    if (r < 0.55) {
      cible.current =
        s && Date.now() - s.t < 4000
          ? Math.min(Math.max(s.x - largeur() / 2, 8), max)
          : hasard(8, max);
      const distance = Math.abs(cible.current - x.current);
      tourner(cible.current < x.current);
      setEtat(distance > DISTANCE_COURSE ? "course" : "marche");
      return;
    }
    const retour = () => {
      setEtat("repos");
      prochaineAction.current = performance.now() + hasard(1500, 4000);
    };
    if (r < 0.7) {
      setEtat("regarde", 2600, retour);
    } else if (r < 0.82) {
      setExpression("joie", 2000);
      setEtat("etire", 2200, retour);
    } else if (r < 0.94) {
      setEtat("assis", hasard(6000, 10000), retour);
    } else {
      setExpression("joie", 1500);
      setEtat("salut", 1500, retour);
    }
    prochaineAction.current = maintenant + 99_999; // l'action en cours décide de la suite
  }, [invoquer, monterSurBarre, setEtat, setExpression, tourner]);

  const sauter = useCallback(
    (avecSalto: boolean) => {
      if (reduit.current) return;
      setExpression("surprise");
      setSalto(avecSalto);
      setEtat("accroupi", 130, () => {
        vy.current = IMPULSION_SAUT * (avecSalto ? 1.15 : 1);
        y.current = 0.1;
        setEtat("saut");
      });
    },
    [setEtat, setExpression]
  );

  const atterrir = useCallback(() => {
    souffler(1);
    souffler(-1);
    setSalto(false);
    setExpression("joie", 1400);
    setEtat("atterrit", 220, () => {
      setEtat("repos");
      prochaineAction.current = performance.now() + hasard(1500, 3000);
    });
  }, [setEtat, setExpression, souffler]);

  /* ------------------------------------------------- montage et préférences */

  useEffect(() => {
    try {
      if (localStorage.getItem(CLE_STOCKAGE) === "1") setMasque(true);
    } catch {
      /* stockage indisponible : on affiche Ymir */
    }
    reduit.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const depart = reduit.current ? window.innerWidth - 110 : window.innerWidth * hasard(0.55, 0.85);
    x.current = depart;
    cible.current = depart;
    derniereActivite.current = Date.now();
    prochaineAction.current = performance.now() + 3000;
    setMonte(true);
  }, []);

  /* -------------------------------------------------- boucle d'animation */

  useEffect(() => {
    if (!monte || masque) return;
    let image = 0;
    let avant = performance.now();

    const tour = (maintenant: number) => {
      const dt = Math.min((maintenant - avant) / 1000, 0.05);
      avant = maintenant;
      const e = etatRef.current;
      const l = largeur();
      const max = window.innerWidth - l - 8;

      // Fin d'un état temporisé
      if (finEtat.current && maintenant >= finEtat.current) {
        finEtat.current = 0;
        const suite = apresEtat.current;
        apresEtat.current = null;
        suite?.();
      }

      // Gravité (saut, chute après avoir été lâché)
      if ((e === "saut" || e === "chute") && !glisse.current) {
        vy.current -= GRAVITE * dt;
        y.current += vy.current * dt;
        if (y.current <= 0) {
          y.current = 0;
          vy.current = 0;
          atterrir();
        }
      }

      // Saut en arc jusqu'à la barre
      if (e === "grimpe" && grimpe.current) {
        const g = grimpe.current;
        const p = Math.min(1, (maintenant - g.t0) / DUREE_GRIMPE);
        x.current = g.x0 + (g.x1 - g.x0) * p;
        y.current = g.y1 * p + Math.sin(Math.PI * p) * 90;
        if (p >= 1) {
          grimpe.current = null;
          y.current = g.y1;
          setExpression("joie", 1500);
          setEtat("perche", hasard(10_000, 15_000), descendre);
          dire(compagnon.perche[Math.floor(Math.random() * compagnon.perche.length)], 3400);
        }
      }

      // Si la barre disparaît (retour en haut de page), elle redescend
      if (perchee.current && e === "perche" && !document.querySelector(".barre--visible")) {
        descendre();
      }

      // Garde-fou : jamais en lévitation hors des états prévus pour
      if (y.current > 0 && !glisse.current && !ETATS_EN_L_AIR.includes(etatRef.current)) {
        if (perchee.current) {
          setEtat("perche", hasard(5000, 9000), descendre);
        } else {
          vy.current = 0;
          setEtat("chute");
        }
      }

      // Fin du tremblement si le Grand Terrassement a été interrompu
      if (etatRef.current !== "invoque" && document.documentElement.classList.contains("terrassement")) {
        document.documentElement.classList.remove("terrassement");
        setTerrassement(false);
      }

      // Déplacement
      if (!reduit.current && (e === "marche" || e === "course")) {
        const ecart = cible.current - x.current;
        const vitesse = e === "course" ? VITESSE_COURSE : VITESSE_MARCHE;
        if (Math.abs(ecart) < 2) {
          setEtat("repos");
          prochaineAction.current = maintenant + hasard(1800, 5000);
        } else {
          x.current += Math.sign(ecart) * Math.min(Math.abs(ecart), vitesse * dt);
          tourner(ecart < 0);
          if (e === "course" && maintenant - derniereBouffee.current > 170) {
            derniereBouffee.current = maintenant;
            souffler(ecart < 0 ? 1 : -1);
          }
        }
      } else if (
        !reduit.current &&
        e === "repos" &&
        !parle.current &&
        maintenant > prochaineAction.current
      ) {
        choisirAction();
      }

      // Sommeil après inactivité (bâillement d'abord), au sol ou sur la barre
      if (
        (e === "repos" || e === "assis" || e === "regarde" || e === "perche") &&
        !parle.current &&
        Date.now() - derniereActivite.current > SOMMEIL_APRES
      ) {
        setExpression("baille");
        setEtat("baille", 1500, () => {
          setExpression("dort");
          setEtat("sommeil");
        });
      }

      // Regard qui suit la souris
      const el = racine.current;
      if (el) {
        const s = souris.current;
        let rx = 0;
        let ry = 0;
        if (s && e !== "sommeil" && e !== "baille") {
          const centreX = x.current + l / 2;
          const centreY = window.innerHeight - y.current - hauteur() * 0.72;
          rx = Math.max(-1, Math.min(1, (s.x - centreX) / 280));
          ry = Math.max(-1, Math.min(1, (s.y - centreY) / 280));
          // Au repos, il se tourne vers la souris
          if (e === "repos" && Math.abs(s.x - centreX) > 60) tourner(s.x < centreX);
        }
        if (gaucheRef.current) rx = -rx;
        el.style.setProperty("--regard-x", rx.toFixed(3));
        el.style.setProperty("--regard-y", ry.toFixed(3));
        el.style.setProperty("--saut", `${y.current.toFixed(1)}px`);
        el.style.setProperty("--ombre", Math.max(0.35, 1 - y.current / 220).toFixed(3));

        x.current = Math.min(Math.max(x.current, 8), max);
        el.style.transform = `translate3d(${x.current.toFixed(1)}px, ${(-y.current).toFixed(1)}px, 0)`;
      }

      image = requestAnimationFrame(tour);
    };

    image = requestAnimationFrame(tour);
    return () => {
      cancelAnimationFrame(image);
      quitterPerchoir();
      document.documentElement.classList.remove("terrassement");
    };
  }, [monte, masque, atterrir, choisirAction, descendre, dire, quitterPerchoir, setEtat, setExpression, souffler, tourner]);

  /* ---------------------------------------------- clignements aléatoires */

  useEffect(() => {
    if (!monte || masque) return;
    let minuterie: number | undefined;
    const cligner = () => {
      const el = racine.current;
      if (el) {
        el.classList.add("compagnon--cligne");
        window.setTimeout(() => el.classList.remove("compagnon--cligne"), 140);
        // Parfois un double clignement
        if (Math.random() < 0.2) {
          window.setTimeout(() => {
            el.classList.add("compagnon--cligne");
            window.setTimeout(() => el.classList.remove("compagnon--cligne"), 120);
          }, 260);
        }
      }
      minuterie = window.setTimeout(cligner, hasard(2200, 5500));
    };
    minuterie = window.setTimeout(cligner, 1800);
    return () => window.clearTimeout(minuterie);
  }, [monte, masque]);

  /* -------------------------------- activité : réveil, position de la souris */

  useEffect(() => {
    if (!monte || masque) return;
    const activite = () => {
      derniereActivite.current = Date.now();
      const e = etatRef.current;
      if (e === "sommeil" || e === "baille") {
        setExpression("surprise", 900);
        setEtat("repos");
        prochaineAction.current = performance.now() + 2500;
        dire(compagnon.reveil, 2600);
      }
    };
    const bouge = (event: PointerEvent) => {
      souris.current = { x: event.clientX, y: event.clientY, t: Date.now() };
      activite();
    };
    window.addEventListener("pointermove", bouge, { passive: true });
    window.addEventListener("scroll", activite, { passive: true });
    window.addEventListener("keydown", activite);
    return () => {
      window.removeEventListener("pointermove", bouge);
      window.removeEventListener("scroll", activite);
      window.removeEventListener("keydown", activite);
    };
  }, [monte, masque, dire, setEtat, setExpression]);

  /* ------------------------------ une réplique par section, à la première vue */

  useEffect(() => {
    if (!monte || masque || typeof IntersectionObserver === "undefined") return;
    const dejaVues = new Set<string>();
    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          const id = entree.target.id;
          if (!entree.isIntersecting || dejaVues.has(id)) continue;
          dejaVues.add(id);
          const replique = compagnon.sections[id];
          if (!replique) continue;
          const e = etatRef.current;
          if (["porte", "saut", "chute", "grimpe", "invoque"].includes(e)) continue;
          setExpression("joie", 2000);
          if (!perchee.current) setEtat("salut", 1500, () => setEtat("repos"));
          dire(replique);
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    const depart = window.setTimeout(() => {
      Object.keys(compagnon.sections).forEach((id) => {
        const section = document.getElementById(id);
        if (section) observateur.observe(section);
      });
    }, 1200);
    return () => {
      window.clearTimeout(depart);
      observateur.disconnect();
    };
  }, [monte, masque, dire, setEtat, setExpression]);

  /* ------------------------------------------- attraper, lâcher, cliquer */

  const surAppui = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (reduit.current || event.button !== 0) return;
    glisse.current = { id: event.pointerId, x0: event.clientX, y0: event.clientY, deplace: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const surDeplacement = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const g = glisse.current;
    if (!g || g.id !== event.pointerId) return;
    if (!g.deplace) {
      if (Math.hypot(event.clientX - g.x0, event.clientY - g.y0) < 8) return;
      g.deplace = true;
      vy.current = 0;
      quitterPerchoir();
      setSalto(false);
      setExpression("surprise");
      setEtat("porte");
      dire(compagnon.attrape, 2400);
    }
    // On le tient par le col
    x.current = event.clientX - largeur() / 2;
    y.current = Math.max(0, window.innerHeight - event.clientY - hauteur() * 0.62);
    derniereActivite.current = Date.now();
  };

  const surRelache = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const g = glisse.current;
    if (!g || g.id !== event.pointerId) return;
    glisse.current = null;
    if (!g.deplace) return; // simple clic : géré par onClick
    ignoreClic.current = true;
    if (y.current > 2) {
      vy.current = 0;
      setEtat("chute");
    } else {
      y.current = 0;
      atterrir();
    }
    window.setTimeout(() => dire(compagnon.lache, 2000), 350);
  };

  /** Clic simple : saut (ou descente si elle est sur la barre). */
  const actionClic = () => {
    const e = etatRef.current;
    if (["saut", "chute", "accroupi", "grimpe", "invoque"].includes(e)) return;
    if (perchee.current) {
      descendre();
      dire(compagnon.lache, 2000);
      return;
    }
    clics.current += 1;
    const avecSalto = clics.current % 4 === 0;
    sauter(avecSalto);
    dire(avecSalto ? compagnon.salto : compagnon.clics[(clics.current - 1) % compagnon.clics.length], 2600);
  };

  /** Un clic attend 240 ms : un second clic entre-temps = double-clic = titans. */
  const surClic = () => {
    if (ignoreClic.current) {
      ignoreClic.current = false;
      return;
    }
    derniereActivite.current = Date.now();
    if (minuterieClic.current !== undefined) {
      window.clearTimeout(minuterieClic.current);
      minuterieClic.current = undefined;
      invoquer();
      return;
    }
    minuterieClic.current = window.setTimeout(() => {
      minuterieClic.current = undefined;
      actionClic();
    }, 240);
  };

  /* ------------------------------------------------------ masquer, rappeler */

  const masquer = () => {
    quitterPerchoir();
    y.current = 0;
    setEtat("repos");
    setMasque(true);
    setBulle(null);
    try {
      localStorage.setItem(CLE_STOCKAGE, "1");
    } catch {
      /* rien à faire */
    }
  };

  const rappeler = () => {
    setMasque(false);
    derniereActivite.current = Date.now();
    try {
      localStorage.removeItem(CLE_STOCKAGE);
    } catch {
      /* rien à faire */
    }
    window.setTimeout(() => dire(compagnon.retour, 2400), 300);
  };

  if (!monte) return null;

  if (masque) {
    return (
      <button type="button" className="compagnon-rappel" onClick={rappeler} aria-label={`Faire revenir ${compagnon.nom}`}>
        <svg viewBox="0 0 40 40" width="26" height="26" aria-hidden="true">
          <path d="M6 18Q4 32 7 39H33Q36 32 34 18Z" fill="#e8bf5f" stroke="#6b4a1a" strokeWidth="1.2" />
          <path d="M9 20Q9 33 20 36Q31 33 31 20Q31 9 20 9Q9 9 9 20Z" fill="#fff1e4" stroke="#111" strokeWidth="2" />
          <path d="M7 22Q6 5 20 5Q34 5 33 22L30 16L28 23L25 13Q22 11 20.2 9Q18 11 15 13L12 23L10 16Z" fill="#e8bf5f" stroke="#6b4a1a" strokeWidth="1.2" strokeLinejoin="round" />
          <ellipse cx="15.5" cy="24" rx="2.2" ry="3" fill="#4f7a94" stroke="#111" strokeWidth="1" />
          <ellipse cx="24.5" cy="24" rx="2.2" ry="3" fill="#4f7a94" stroke="#111" strokeWidth="1" />
        </svg>
      </button>
    );
  }

  const classes = [
    "compagnon",
    `compagnon--${etat}`,
    `exp-${expression}`,
    regardeGauche ? "compagnon--gauche" : "",
    salto ? "compagnon--salto" : "",
    bulle ? "compagnon--parle" : "",
    perchee.current ? "compagnon--perchee" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className="sumi-poussieres" aria-hidden="true">
        {poussieres.map((p) => (
          <span key={p.id} className="sumi-poussiere" style={{ left: p.x, ["--sens" as string]: p.sens }} />
        ))}
      </div>

      {terrassement ? (
        <div className="terrassement-sfx" aria-hidden="true">
          <span>BOUM</span>
          <span>BOUM</span>
          <span>DOUM…</span>
        </div>
      ) : null}

      <div
        ref={racine}
        className={classes}
        style={{ transform: `translate3d(${x.current.toFixed(1)}px, ${(-y.current).toFixed(1)}px, 0)` }}
      >
        {bulle ? (
          <p className={`compagnon__bulle compagnon__bulle--${bulle.cote}`} role="status">
            {bulle.texte}
          </p>
        ) : null}

        {etat === "sommeil" ? (
          <span className="compagnon__zzz" aria-hidden="true">
            z<span>z</span>
            <span>z</span>
          </span>
        ) : null}

        <span className="compagnon__ombre" aria-hidden="true" />

        <button
          type="button"
          className="compagnon__corps"
          onClick={surClic}
          onPointerDown={surAppui}
          onPointerMove={surDeplacement}
          onPointerUp={surRelache}
          onPointerCancel={surRelache}
          aria-label={`${compagnon.nom}, le compagnon du site. Cliquer pour le faire sauter, glisser pour le déplacer.`}
        >
          <Personnage ref={svg} />
        </button>

        <button type="button" className="compagnon__masquer" onClick={masquer} aria-label={`Masquer ${compagnon.nom}`}>
          ×
        </button>
      </div>
    </>
  );
}

/* ==========================================================================
   Le dessin d'Ymir. Repère : viewBox 100 × 150, sol à y = 146, regard vers
   la droite (visage de trois quarts). Environ 3,6 têtes de haut.
   Pivots : hanches (45.5|55.5, 96), genoux (y 119), épaules (36|64, 62),
   coudes (y 80), cou (50, 56).
   Style : cel-shading (aplats d'ombre nets, lumière venant d'en haut à
   gauche), traits de couleur assortie, plus épais sur la silhouette.
   ========================================================================== */

const TRAIT = "#24170f";
const PEAU = "#fff0e2";
const PEAU_OMBRE = "#f3cdb5";
const PEAU_OMBRE_2 = "#e2a991";
const PEAU_TRAIT = "#7a4634";
const JOUES = "#ff8a80";
const CILS = "#1e130d";
const ROUGE = "#d4342a";
const ROUGE_OMBRE = "#9e2219";
const ROUGE_LUMIERE = "#ee6b5d";
const CHEVEUX = "#efc86a";
const CHEVEUX_OMBRE = "#cf9c42";
const CHEVEUX_OMBRE_2 = "#a8742a";
const CHEVEUX_LUMIERE = "#fdeebb";
const CHEVEUX_TRAIT = "#6b4512";
const TUNIQUE = "#f4ecdd";
const TUNIQUE_OMBRE = "#dac9ac";
const TUNIQUE_OMBRE_2 = "#bba783";
const CUIR = "#6e4528";
const CUIR_OMBRE = "#4a2c17";
const CUIR_LUMIERE = "#94653b";
const COLLANT = "#3b2d25";
const COLLANT_OMBRE = "#2a1f19";
const BOTTE = "#4d3322";
const BOTTE_OMBRE = "#33210f";
const SEMELLE = "#1b120c";

/** Contour du visage, de trois quarts vers la droite, menton fin. */
const VISAGE =
  "M37 28.5C37 39.5 40.5 46 45.6 49.6Q49 52 51.8 51.6Q55 51 57.8 48C61.8 43.6 64.4 38 64.4 28.5C64.4 18.5 58 13.8 50.7 13.8C43.4 13.8 37 18.5 37 28.5Z";

function Bras({ cote }: { cote: "arriere" | "avant" }) {
  const c = cote === "avant" ? 64 : 36;
  const devant = cote === "avant";
  const manche = devant ? TUNIQUE : TUNIQUE_OMBRE;
  const mancheOmbre = devant ? TUNIQUE_OMBRE : TUNIQUE_OMBRE_2;
  const peau = devant ? PEAU : PEAU_OMBRE;
  const peauOmbre = devant ? PEAU_OMBRE : PEAU_OMBRE_2;
  return (
    <g className={`sumi-bras sumi-bras--${cote}`}>
      {/* Manche légèrement bouffante à l'épaule */}
      <path
        d={`M${c - 4.4} 60.6Q${c - 5.3} 71 ${c - 3.9} 81.2H${c + 3.9}Q${c + 5.1} 71 ${c + 4.4} 60.6Q${c} 56 ${c - 4.4} 60.6Z`}
        fill={manche}
        stroke={TRAIT}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d={`M${c + 1.2} 57.9Q${c + 4.1} 58.6 ${c + 4.4} 60.6Q${c + 5.1} 71 ${c + 3.9} 81.2H${c + 1.4}Q${c + 2.9} 70 ${c + 1.2} 57.9Z`} fill={mancheOmbre} />
      <path d={`M${c - 2.4} 73.6Q${c - 0.2} 75.4 ${c + 2.4} 73.4M${c - 3.2} 64Q${c - 1.6} 66.6 ${c - 2.6} 69.6`} stroke={mancheOmbre} strokeWidth="0.6" fill="none" strokeLinecap="round" />
      <g className={`sumi-avant-bras sumi-avant-bras--${cote}`}>
        <path d={`M${c - 3.8} 79.2L${c - 3.2} 92.4H${c + 3.2}L${c + 3.8} 79.2Z`} fill={manche} stroke={TRAIT} strokeWidth="1" strokeLinejoin="round" />
        <path d={`M${c + 1.2} 79.2H${c + 3.8}L${c + 3.2} 92.4H${c + 1}Z`} fill={mancheOmbre} />
        {/* Main : paume, pouce vers l'avant, doigts suggérés */}
        <path
          d={`M${c - 2.7} 94.4Q${c - 3.5} 98.6 ${c - 2.2} 101.7Q${c - 0.5} 103.5 ${c + 1.3} 102.6Q${c + 2.9} 101.4 ${c + 2.7} 98.6L${c + 3.7} 97.4Q${c + 3.9} 95.8 ${c + 2.5} 95.6V94.4Z`}
          fill={peau}
          stroke={PEAU_TRAIT}
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        <path d={`M${c + 1.1} 98Q${c + 2.4} 100.8 ${c + 1.3} 102.6Q${c + 2.9} 101.4 ${c + 2.7} 98.6Z`} fill={peauOmbre} />
        <path d={`M${c - 0.9} 99.4L${c - 0.5} 101.9M${c + 0.7} 99.2L${c + 0.9} 101.6`} stroke={PEAU_TRAIT} strokeWidth="0.4" strokeLinecap="round" />
        {/* Brassard de cuir lacé */}
        <path d={`M${c - 3.6} 90.4H${c + 3.6}L${c + 3.3} 95.2H${c - 3.3}Z`} fill={CUIR} stroke={TRAIT} strokeWidth="0.8" strokeLinejoin="round" />
        <path d={`M${c - 3.1} 91.3H${c + 3.1}`} stroke={CUIR_LUMIERE} strokeWidth="0.5" />
        <path d={`M${c - 1} 91.6L${c + 1} 94M${c + 1} 91.6L${c - 1} 94`} stroke="#c9a77c" strokeWidth="0.45" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Jambe({ cote }: { cote: "arriere" | "avant" }) {
  const c = cote === "avant" ? 55.5 : 45.5;
  const ombre = cote === "arriere";
  const collant = ombre ? COLLANT_OMBRE : COLLANT;
  const botte = ombre ? BOTTE_OMBRE : BOTTE;
  return (
    <g className={`sumi-cuisse sumi-cuisse--${cote}`}>
      <path
        d={`M${c - 4.1} 92H${c + 4.1}Q${c + 4.4} 108 ${c + 3.5} 121.2H${c - 3.5}Q${c - 4.5} 108 ${c - 4.1} 92Z`}
        fill={collant}
        stroke={TRAIT}
        strokeWidth="0.9"
      />
      {!ombre && <path d={`M${c - 2.7} 100Q${c - 3.1} 110 ${c - 2.5} 118`} stroke="#5d4a3d" strokeWidth="0.7" fill="none" strokeLinecap="round" />}
      <g className={`sumi-tibia sumi-tibia--${cote}`}>
        {/* Botte montante à revers */}
        <path d={`M${c - 3.9} 117H${c + 3.9}L${c + 3.4} 137H${c - 3.7}Z`} fill={botte} stroke={TRAIT} strokeWidth="0.9" strokeLinejoin="round" />
        <path d={`M${c + 1.4} 117H${c + 3.9}L${c + 3.4} 137H${c + 1.2}Z`} fill={BOTTE_OMBRE} opacity={ombre ? 0.5 : 1} />
        {!ombre && <path d={`M${c - 2.5} 121.5V134`} stroke="#7a5638" strokeWidth="0.6" strokeLinecap="round" />}
        <path d={`M${c + 0.5} 124.4L${c + 2.9} 125.6M${c + 0.5} 127.8L${c + 2.9} 129M${c + 0.5} 131.2L${c + 2.9} 132.4`} stroke="#b08a60" strokeWidth="0.5" strokeLinecap="round" />
        <path
          d={`M${c - 4.6} 115.4Q${c} 114 ${c + 4.6} 115.4L${c + 4.3} 120.2Q${c} 119.2 ${c - 4.3} 120.2Z`}
          fill={ombre ? CUIR_OMBRE : CUIR}
          stroke={TRAIT}
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
        {!ombre && <path d={`M${c - 3.8} 116.2Q${c} 115.1 ${c + 2} 115.6`} stroke={CUIR_LUMIERE} strokeWidth="0.6" fill="none" />}
        {/* Pied, pointe vers l'avant */}
        <path
          d={`M${c - 3.7} 135H${c + 3.4}Q${c + 4.3} 138.6 ${c + 6.6} 139.8Q${c + 10.6} 140.8 ${c + 10.9} 143.4V144.4H${c - 4.5}L${c - 4.7} 139.6Z`}
          fill={botte}
          stroke={TRAIT}
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {!ombre && <path d={`M${c + 4.6} 140.4Q${c + 7.8} 140.6 ${c + 9.6} 141.8`} stroke="#7a5638" strokeWidth="0.6" fill="none" strokeLinecap="round" />}
        <path d={`M${c - 3.6} 135.6H${c + 3.4}`} stroke={CUIR_LUMIERE} strokeWidth="0.7" opacity={ombre ? 0.4 : 0.9} />
        <path d={`M${c - 4.7} 144H${c + 10.9}Q${c + 11} 146 ${c + 9.6} 146H${c - 4.7}Z`} fill={SEMELLE} stroke={TRAIT} strokeWidth="0.7" strokeLinejoin="round" />
      </g>
    </g>
  );
}

type PropsOeil = { cx: number; cy: number; w: number; h: number; o: 1 | -1; id: string };

/** Œil d'anime : sclère découpée, iris en dégradé, reflets, cils épais. `o` : côté extérieur. */
function Oeil({ cx, cy, w, h, o, id }: PropsOeil) {
  const X = (dx: number) => (cx + o * dx).toFixed(2);
  const sclere = `M${X(-w)} ${cy - 0.6}Q${X(-w)} ${cy - h} ${cx} ${cy - h}Q${X(w + 0.2)} ${cy - h} ${X(w)} ${cy - 0.4}Q${X(w - 0.5)} ${cy + h * 0.86} ${cx} ${cy + h * 0.9}Q${X(-w + 0.4)} ${cy + h * 0.86} ${X(-w)} ${cy - 0.6}Z`;
  return (
    <>
      <g className="sumi-oeil">
        <clipPath id={id}>
          <path d={sclere} />
        </clipPath>
        <path d={sclere} fill="#fffdf8" />
        <g clipPath={`url(#${id})`}>
          <g className="sumi-iris">
            <ellipse cx={cx} cy={cy + 0.7} rx={w * 0.8} ry={h * 0.9} fill="url(#sumi-degrade-iris)" stroke="#16293a" strokeWidth="0.55" />
            <path
              d={`M${cx - w * 0.6} ${cy + 1.8}Q${cx} ${cy + h * 0.95} ${cx + w * 0.6} ${cy + 1.8}Q${cx} ${cy + 3.4} ${cx - w * 0.6} ${cy + 1.8}Z`}
              fill="#c4e4f2"
              opacity="0.8"
            />
            <ellipse cx={cx} cy={cy + 0.9} rx={w * 0.32} ry={h * 0.4} fill="#0e1b25" />
            {/* Reflets : la lumière vient d'en haut à gauche pour les deux yeux */}
            <ellipse cx={cx - w * 0.3} cy={cy - h * 0.28} rx={w * 0.27} ry={h * 0.28} fill="#fff" />
            <circle cx={cx + w * 0.36} cy={cy + h * 0.5} r={w * 0.13} fill="#fff" />
            <circle cx={cx + w * 0.3} cy={cy - h * 0.3} r={w * 0.08} fill="#fff" opacity="0.85" />
          </g>
          {/* Ombre portée de la paupière */}
          <path d={`M${cx - w - 1} ${cy - h - 1}H${cx + w + 1}V${cy - h + 2}Q${cx} ${cy - h + 3.4} ${cx - w - 1} ${cy - h + 2}Z`} fill="#3d5d79" opacity="0.3" />
        </g>
        {/* Cils supérieurs : épais, avec deux pointes vers l'extérieur */}
        <path
          d={`M${X(-w - 0.3)} ${cy - 0.1}Q${X(-w)} ${cy - h - 0.5} ${cx} ${cy - h - 0.7}Q${X(w)} ${cy - h - 0.5} ${X(w + 1.2)} ${cy - 1.5}L${X(w + 2.5)} ${cy - 2.7}L${X(w + 1.4)} ${cy - 0.9}L${X(w + 2.1)} ${cy + 0.2}L${X(w + 0.5)} ${cy - 0.1}Q${X(w - 0.4)} ${cy - h + 1.1} ${cx} ${cy - h + 0.7}Q${X(-w + 0.8)} ${cy - h + 0.9} ${X(-w - 0.3)} ${cy - 0.1}Z`}
          fill={CILS}
        />
        {/* Double paupière et cils inférieurs */}
        <path d={`M${X(-w * 0.5)} ${cy - h - 1.6}Q${X(w * 0.4)} ${cy - h - 2.3} ${X(w + 0.4)} ${cy - h + 0.2}`} stroke={PEAU_TRAIT} strokeWidth="0.45" fill="none" strokeLinecap="round" />
        <path d={`M${X(w * 0.05)} ${cy + h * 0.92}Q${X(w * 0.7)} ${cy + h * 0.72} ${X(w + 0.3)} ${cy + 0.5}`} stroke="#5a3628" strokeWidth="0.5" fill="none" strokeLinecap="round" />
      </g>
      <path
        className="sumi-oeil-joie"
        d={`M${cx - w} ${cy + 1.6}Q${cx} ${cy - 3.6} ${cx + w} ${cy + 1.6}M${X(w - 0.2)} ${cy + 0.6}L${X(w + 1.4)} ${cy - 0.4}`}
        stroke={CILS}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="sumi-oeil-ferme"
        d={`M${cx - w} ${cy + 0.2}Q${cx} ${cy + 3.4} ${cx + w} ${cy + 0.2}M${X(w - 0.4)} ${cy + 1}L${X(w + 1.3)} ${cy + 1.9}`}
        stroke={CILS}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

function Personnage({ ref }: { ref: React.Ref<SVGSVGElement> }) {
  return (
    <svg ref={ref} className="compagnon__svg" viewBox="0 0 100 150" width="84" height="126" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sumi-degrade-iris" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c3244" />
          <stop offset="0.45" stopColor="#406a86" />
          <stop offset="1" stopColor="#9fc7dc" />
        </linearGradient>
      </defs>

      <g className="sumi-silhouette">
        {/* Longs cheveux, derrière le corps : mèches terminées en pointe */}
        <g className="sumi-cheveux-dos">
          <path
            d="M35.8 25Q32 46 31.6 70Q31.4 88 29.8 101.6Q31.6 101.4 33.2 100.4Q34 104 35.6 105.6Q37 102.6 38.4 101.6Q40.2 105.6 42.6 107.2Q43.8 103.8 45.8 102.6Q48 106.4 50.4 107.6Q52.2 104 54.6 102.6Q56.4 105.6 58 106.4Q59.4 103 61.6 101.6Q63.4 104.4 65.2 105Q66 102.4 66.8 100.4Q68.6 101.4 70.4 101.6Q68.8 88 68.6 70Q68.2 46 64.4 25Z"
            fill={CHEVEUX}
            stroke={CHEVEUX_TRAIT}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path d="M58 30Q64.6 52 63.8 103.4Q64.6 104.4 65.2 105Q66 102.4 66.8 100.4Q68.6 101.4 70.4 101.6Q68.8 88 68.6 70Q68.2 46 64.4 25Z" fill={CHEVEUX_OMBRE} />
          <path d="M44 62Q46 84 45.8 102.6Q48 106.4 50.4 107.6Q52.2 104 54.6 102.6Q54.2 84 56 62Z" fill={CHEVEUX_OMBRE_2} opacity="0.5" />
          <g stroke={CHEVEUX_OMBRE} strokeWidth="0.6" fill="none" strokeLinecap="round">
            <path d="M34.6 50Q33.2 76 33.4 99" />
            <path d="M38.8 58Q38 82 38.6 100" />
            <path d="M61.6 58Q62.2 82 61.4 100" />
          </g>
        </g>

        {/* Pan d'écharpe : trois segments en chaîne, qui ondulent */}
        <g className="sumi-echarpe sumi-echarpe--1">
          <path d="M41 56.4Q34 59.6 27 60.6L27.6 67.6Q34.6 66.8 41 63.8Z" fill={ROUGE} stroke={TRAIT} strokeWidth="1" strokeLinejoin="round" />
          <path d="M41 61Q34 64.4 27.4 64.9L27.6 67.6Q34.6 66.8 41 63.8Z" fill={ROUGE_OMBRE} />
          <path d="M39 58.4Q34 60.6 29 61.6" stroke={ROUGE_LUMIERE} strokeWidth="0.6" fill="none" strokeLinecap="round" />
          <g className="sumi-echarpe sumi-echarpe--2">
            <path d="M27.6 60.6Q22 61.6 16.6 60.8L17.1 67.6Q22.3 68 27.7 67.6Z" fill={ROUGE} stroke={TRAIT} strokeWidth="1" strokeLinejoin="round" />
            <path d="M27.5 64.9Q22 65.7 16.9 65.1L17.1 67.6Q22.3 68 27.7 67.6Z" fill={ROUGE_OMBRE} />
            <g className="sumi-echarpe sumi-echarpe--3">
              <path d="M16.9 60.8Q13.6 61.2 10.6 61.3L10.9 67.4Q13.9 67.6 17.2 67.6Z" fill={ROUGE} stroke={TRAIT} strokeWidth="1" strokeLinejoin="round" />
              <path d="M14.2 61.1L14.4 67.6M12.8 61.2L13 67.5" stroke="#f3e2c6" strokeWidth="0.55" />
              {/* Franges */}
              <path d="M10.7 62L7.6 61.4M10.7 63.6L7.2 63.4M10.8 65.2L7.4 65.6M10.9 66.8L8 67.6" stroke={ROUGE_OMBRE} strokeWidth="0.9" strokeLinecap="round" />
            </g>
          </g>
        </g>

        <Bras cote="arriere" />
        <Jambe cote="arriere" />
        <Jambe cote="avant" />

        {/* Tunique-robe ajustée à la taille */}
        <g className="sumi-torse">
          <g className="sumi-pan-manteau">
            <path
              d="M40.4 85.6H59.6Q63.4 99 67.8 115.2Q64.2 117.6 61 116.8Q57.2 119 53.6 118Q50 119.6 46.4 118Q42.8 119 39 116.8Q35.8 117.6 32.2 115.2Q36.6 99 40.4 85.6Z"
              fill={TUNIQUE}
              stroke={TRAIT}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path d="M55.6 86H59.6Q63.4 99 67.8 115.2Q64.2 117.6 61 116.8Q59.4 101 55.6 86Z" fill={TUNIQUE_OMBRE} />
            <path d="M50.4 90Q51.6 104 53.6 118Q50 119.6 48.6 118.8Q50.6 104 50.4 90Z" fill={TUNIQUE_OMBRE} opacity="0.75" />
            <g stroke={TUNIQUE_OMBRE_2} strokeWidth="0.55" fill="none" strokeLinecap="round">
              <path d="M45.6 90Q44 104 46.4 118" />
              <path d="M41.6 96L38.6 116" />
              <path d="M57.6 94Q59.4 106 61 116.6" />
            </g>
            {/* Galon brodé au bas de la robe */}
            <path d="M33.2 112.4Q42 115.6 50 115.6Q58 115.6 66.8 112.4" stroke={ROUGE} strokeWidth="1.1" fill="none" />
            <path d="M33.7 110.6Q42 113.6 50 113.6Q58 113.6 66.3 110.6" stroke={CUIR} strokeWidth="0.45" fill="none" strokeDasharray="1 0.8" />
          </g>
          {/* Corsage */}
          <path
            d="M37 59.6Q50 55.8 63 59.6Q64.6 64.4 63 70.4Q60.4 77.6 59.6 86.4H40.4Q39.6 77.6 37 70.4Q35.4 64.4 37 59.6Z"
            fill={TUNIQUE}
            stroke={TRAIT}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M55.8 58Q61 58.6 63 59.6Q64.6 64.4 63 70.4Q60.4 77.6 59.6 86.4H55.6Q57.8 76 56.8 68Q56.2 62 55.8 58Z" fill={TUNIQUE_OMBRE} />
          <path d="M41.6 72.6Q45.6 74.8 49.4 73.4M51.6 73.4Q55 74.8 58 72.6" stroke={TUNIQUE_OMBRE_2} strokeWidth="0.55" fill="none" strokeLinecap="round" />
          <path d="M44 77Q44.6 81.6 44.2 85M56 77Q55.4 81.6 55.8 85" stroke={TUNIQUE_OMBRE} strokeWidth="0.6" fill="none" strokeLinecap="round" />
          {/* Encolure en V lacée */}
          <path d="M47.3 60.4L50.4 70.2L53.5 60.4Z" fill={PEAU_OMBRE} stroke={TRAIT} strokeWidth="0.6" strokeLinejoin="round" />
          <path d="M47.9 62.4L52.9 64.2M52.9 62.4L47.9 64.2M48.6 65.4L52.2 67M52.2 65.4L48.6 67" stroke={CUIR} strokeWidth="0.6" strokeLinecap="round" />
          {/* Ceinture de cuir nouée, pans qui tombent */}
          <path d="M39.8 84Q50 85.6 60.2 84L60.4 88.6Q50 90.2 39.6 88.6Z" fill={CUIR} stroke={TRAIT} strokeWidth="0.8" strokeLinejoin="round" />
          <path d="M40.2 84.9Q50 86.4 59.8 84.9" stroke={CUIR_LUMIERE} strokeWidth="0.55" fill="none" />
          <path d="M44.8 88.4L42.9 99.4L44.8 98.4L46.5 88.6ZM46.6 88.4L48 97.6L49.6 96.6L47.8 88.4Z" fill={CUIR} stroke={TRAIT} strokeWidth="0.7" strokeLinejoin="round" />
          <ellipse cx="46.3" cy="86.9" rx="2.1" ry="1.9" fill={CUIR_OMBRE} stroke={TRAIT} strokeWidth="0.7" />
          <path d="M45.4 86.2Q46.2 85.6 47.2 86" stroke={CUIR_LUMIERE} strokeWidth="0.5" fill="none" strokeLinecap="round" />
        </g>

        {/* Col d'écharpe enroulé */}
        <path d="M40.4 55.2Q50 60.6 60.6 54.8Q62.6 58.4 61.8 61.8Q50 67.2 39.4 62Q38.6 58.4 40.4 55.2Z" fill={ROUGE} stroke={TRAIT} strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M57.4 57.6Q60.8 56.8 61.8 61.8Q57 64.4 52.2 65Q56.6 62 57.4 57.6Z" fill={ROUGE_OMBRE} />
        <path d="M41.6 60Q50 64.2 58.4 59.8" stroke={ROUGE_OMBRE} strokeWidth="0.75" fill="none" strokeLinecap="round" />
        <path d="M42.2 57.2Q46.6 59.6 51.4 59.6" stroke={ROUGE_LUMIERE} strokeWidth="0.75" fill="none" strokeLinecap="round" />
        <path d="M43.4 56.4L42.2 62.6" stroke={ROUGE_OMBRE} strokeWidth="0.6" strokeLinecap="round" />

        {/* Tête */}
        <g className="sumi-tete">
          <g className="sumi-tete-regard">
            {/* Arrière de la chevelure, autour du visage */}
            <path
              d="M35.2 24Q32.4 40 33.6 56L37.4 53.4L40.6 55.6Q44 51 47 50H54.4Q57.6 51 61 55.6L64.2 53.4L68 56Q69.6 40 66.6 24Q60 11.8 50.6 11.8Q41.2 11.8 35.2 24Z"
              fill={CHEVEUX_OMBRE}
              stroke={CHEVEUX_TRAIT}
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Cou */}
            <path d="M46.6 45.5L46.8 57.6Q50.6 59.6 54.6 57.6L54.4 45.5Z" fill={PEAU} stroke={PEAU_TRAIT} strokeWidth="0.8" />
            <path d="M46.7 48.6Q50.6 54 54.5 48.6V54.6Q50.6 57 46.7 54.4Z" fill={PEAU_OMBRE} />
            {/* Visage de trois quarts, menton fin */}
            <clipPath id="sumi-visage">
              <path d={VISAGE} />
            </clipPath>
            <path d={VISAGE} fill={PEAU} />
            <g clipPath="url(#sumi-visage)" fill={PEAU_OMBRE}>
              <path d="M62.8 34Q62 41.6 58.8 46.2Q56.4 49.6 53.4 51.2Q57.4 50.4 60 46.4Q63.4 41.4 63.6 34Z" />
              {/* Ombre portée de la frange sur le front */}
              <path d="M37.4 33Q38.6 31 39.4 29.6Q40.2 32.4 40.8 35.6Q42.8 31.4 44.2 26.4Q45.2 28.2 46.2 31.6Q46.4 24.2 50.8 18.6H52.4Q57.2 24.4 58.4 32.4Q60.4 29.8 61 26.2Q62.8 30.2 63.4 35.8Q64 33 66 31V14H36Z" />
            </g>
            <path d={VISAGE} fill="none" stroke={PEAU_TRAIT} strokeWidth="1.1" />

            {/* Joues roses à hachures */}
            <ellipse cx="42.2" cy="43.6" rx="3.1" ry="1.35" fill={JOUES} opacity="0.32" />
            <ellipse cx="59.6" cy="43.2" rx="2.4" ry="1.2" fill={JOUES} opacity="0.32" />
            <path d="M40.6 44.3L41.3 43M42 44.3L42.7 43M43.4 44.3L44.1 43M58.6 43.9L59.2 42.7M60 43.9L60.6 42.7" stroke="#ec7368" strokeWidth="0.4" strokeLinecap="round" />

            <Oeil cx={44.2} cy={37.2} w={4.5} h={5.2} o={-1} id="sumi-oeil-g" />
            <Oeil cx={58.4} cy={37.2} w={3.9} h={5} o={1} id="sumi-oeil-d" />

            {/* Sourcils fins et clairs */}
            <g className="sumi-sourcils" stroke="#9a7032" strokeWidth="0.85" strokeLinecap="round" fill="none">
              <path d="M40.2 30.4Q43.4 29 47.2 30" />
              <path d="M55.4 30Q58.6 29 61.4 30.4" />
            </g>

            {/* Nez discret */}
            <path d="M53.6 41.8L52.6 44.1L53.9 44.3" stroke={PEAU_TRAIT} strokeWidth="0.55" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M52.8 41.4L52.4 42.8" stroke="#fff" strokeWidth="0.45" strokeLinecap="round" opacity="0.9" />

            {/* Bouches selon l'expression */}
            <g className="sumi-bouche sumi-bouche--neutre">
              <path d="M49.8 47.2Q51.7 48 53.6 46.9" stroke="#6b3226" strokeWidth="0.75" fill="none" strokeLinecap="round" />
              <path d="M50.9 48.7Q51.7 49 52.5 48.6" stroke={PEAU_OMBRE_2} strokeWidth="0.5" fill="none" strokeLinecap="round" />
            </g>
            <g className="sumi-bouche sumi-bouche--joie">
              <path d="M49 46.5Q51.6 47.4 54.2 46.3Q53.6 50.2 51.6 50.4Q49.6 50.2 49 46.5Z" fill="#8a2a22" stroke="#4e1a12" strokeWidth="0.6" strokeLinejoin="round" />
              <path d="M50.1 49.3Q51.6 48.2 53.1 49.2Q51.6 50.5 50.1 49.3Z" fill="#ef7f74" />
            </g>
            <ellipse className="sumi-bouche sumi-bouche--o" cx="51.7" cy="48" rx="1.3" ry="1.7" fill="#6e1c16" stroke="#4e1a12" strokeWidth="0.6" />
            <ellipse className="sumi-bouche sumi-bouche--baille" cx="51.7" cy="48.4" rx="2.1" ry="2.7" fill="#6e1c16" stroke="#4e1a12" strokeWidth="0.6" />
            <ellipse className="sumi-bouche sumi-bouche--parle" cx="51.7" cy="47.8" rx="1.7" ry="1.2" fill="#6e1c16" stroke="#4e1a12" strokeWidth="0.6" />

            {/* Mèches latérales qui encadrent le visage */}
            <path
              d="M37.2 25Q33 36 33.2 48Q33.4 58 31.4 67.8L34.6 63.8L35.6 66.4Q37 56 37.4 46Q37.8 36 39.6 28.6Z"
              fill={CHEVEUX}
              stroke={CHEVEUX_TRAIT}
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
            <path d="M35.8 34Q34.8 46 35 58" stroke={CHEVEUX_OMBRE} strokeWidth="0.55" fill="none" strokeLinecap="round" />
            {/* Petit lien rouge au bout de la mèche */}
            <path d="M32.6 59.4L36.6 60.2L36.4 62.2L32.2 61.4Z" fill={ROUGE} stroke={TRAIT} strokeWidth="0.55" strokeLinejoin="round" />
            <path
              d="M63.4 25Q67.4 36 67.4 48Q67.6 58 69.8 66.6L66.8 62.8L65.8 65.4Q64.6 56 63.8 46Q63 36 61.2 28.6Z"
              fill={CHEVEUX_OMBRE}
              stroke={CHEVEUX_TRAIT}
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
            <path d="M64.8 33Q66 44 66.2 56" stroke={CHEVEUX} strokeWidth="0.7" fill="none" strokeLinecap="round" />

            {/* Frange rideau, raie au milieu */}
            <path
              d="M34.8 35Q32 13 50.6 11Q69 13 66.8 35Q65.6 30.6 64.8 27.4Q64.4 31 62.6 34Q62 28.4 60.2 24.4Q59.6 28 57.6 30.6Q56.4 22.6 51.6 16.8Q50.8 16.4 50 16.8Q45.6 22.4 45.4 29.8Q44.4 26.4 43.4 24.6Q42 29.6 40 33.8Q39.4 30.6 38.6 27.8Q37 31.6 34.8 35Z"
              fill={CHEVEUX}
              stroke={CHEVEUX_TRAIT}
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            {/* Ombre nette côté droit */}
            <path d="M51.6 16.8Q56.4 22.6 57.6 30.6Q59.6 28 60.2 24.4Q62 28.4 62.6 34Q64.4 31 64.8 27.4Q65.6 30.6 66.8 35Q68.4 20 60 14.4Q55.6 15 51.6 16.8Z" fill={CHEVEUX_OMBRE} />
            {/* Séparations entre les mèches */}
            <path d="M43.4 24.6Q44 19.4 47.4 15.4M38.6 27.8Q38.8 21.6 42.6 16.6M60.2 24.4Q59.4 19.2 55.6 15.6M64.8 27.4Q64.4 21.4 60.6 16.8" stroke={CHEVEUX_TRAIT} strokeWidth="0.5" fill="none" strokeLinecap="round" opacity="0.75" />
            {/* Reflet en anneau, typique des anime */}
            <path d="M37.6 22.8Q42 16.2 49.4 14.2L49.8 15.6L47.8 16.6L48.8 17.4Q43 18.8 39.6 23.8L38.8 22.4Z" fill={CHEVEUX_LUMIERE} />
            <path d="M52.6 14.3Q59.2 15.6 63.4 21.6L62.4 22.6L61.6 21.4Q58.2 18.2 53.4 17L54.4 16.2Z" fill={CHEVEUX_LUMIERE} opacity="0.55" />
            <path d="M41.2 18.6Q43.8 16.4 46.4 15.6" stroke="#fff" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.8" />
            {/* Mèche rebelle sur le dessus */}
            <path d="M50.4 11.6Q52.4 6.6 57 7.2Q53.4 8.4 52.2 11.6Z" fill={CHEVEUX} stroke={CHEVEUX_TRAIT} strokeWidth="0.7" strokeLinejoin="round" />
          </g>
        </g>

        <Bras cote="avant" />
      </g>
    </svg>
  );
}
