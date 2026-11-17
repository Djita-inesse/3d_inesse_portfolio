"use client";

import { useEffect, useRef, useState } from "react";

import CvButton from "@/components/CvButton";
import Logo from "@/components/Logo";
import { navItems, site } from "@/content/data";

/** Icône du menu : deux traits d'inégale longueur qui se croisent en X. */
function MenuIcon() {
  return (
    <span className="burger" aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [floating, setFloating] = useState(false);
  const [active, setActive] = useState<string>(navItems[0].id);
  const staticRef = useRef<HTMLElement>(null);

  // Section courante (scrollspy)
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = navItems.find((item) => visible.has(item.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-35% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // La barre flottante apparaît une fois l'en-tête d'origine sorti de l'écran
  useEffect(() => {
    const node = staticRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setFloating(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Menu ouvert : pas de défilement de la page, fermeture avec Échap
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      // Si la fenêtre des CV vient de s'ouvrir depuis le menu, on garde le blocage
      if (!document.querySelector("dialog[open]")) document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = (onClick?: () => void) =>
    navItems.map((item) => (
      <a
        key={item.id}
        href={`#${item.id}`}
        aria-current={active === item.id ? "true" : undefined}
        onClick={onClick}
      >
        {item.label}
      </a>
    ));

  const menuButton = (
    <button
      className="menu-bouton"
      type="button"
      aria-expanded={open}
      aria-controls="menu-mobile"
      aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      onClick={() => setOpen((value) => !value)}
    >
      <MenuIcon />
    </button>
  );

  return (
    <>
      {/* En-tête d'origine, dans le flux, identique à la maquette */}
      <header ref={staticRef} className="entete">
        <div className="enveloppe entete__inner">
          <a className="marque" href="#accueil">
            <Logo />
            <span className="marque__texte">
              <strong>{site.name}</strong>
              <small>{site.roleLong}</small>
            </span>
          </a>
          <nav className="entete__nav" aria-label="Navigation principale">
            {links()}
          </nav>
          {menuButton}
        </div>
      </header>

      {/* Barre flottante qui suit le défilement */}
      <div className={floating || open ? "barre barre--visible" : "barre"} inert={!floating && !open}>
        <div className="barre__inner">
          <a className="barre__marque" href="#accueil">
            <Logo size={34} inverse />
            <span>{site.name}</span>
          </a>
          <nav className="barre__nav" aria-label="Navigation rapide">
            {navItems.slice(1).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <CvButton className="barre__cv">CV</CvButton>
          {menuButton}
        </div>
      </div>

      {/* Menu plein écran (mobile) */}
      <div id="menu-mobile" className={open ? "rideau rideau--ouvert" : "rideau"} hidden={!open}>
        <nav className="rideau__nav" aria-label="Navigation mobile">
          {navItems.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${100 + index * 45}ms` }}
            >
              <span className="rideau__numero">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="rideau__pied">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.phoneHref}>{site.phone}</a>
          <span onClick={() => setOpen(false)}>
            <CvButton className="bouton bouton--clair bouton--50">VOIR LES CV</CvButton>
          </span>
        </div>
      </div>
    </>
  );
}
