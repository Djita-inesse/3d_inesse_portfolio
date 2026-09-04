"use client";

import { useEffect, useState } from "react";

import ThemeToggle from "./ThemeToggle";
import { navItems, site } from "@/content/data";

/**
 * En-tete colle. Le scrollspy suit la section la plus haute encore visible :
 * une seule ancre est marquee active a la fois, meme quand deux sections se
 * chevauchent dans le viewport.
 */
export default function Header() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);

    if (sections.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }

        const current = navItems.find((item) => visible.has(item.id));
        setActive(current ? current.id : "");
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="entete">
      <div className="shell entete__inner">
        <a className="entete__nom" href="#top">
          {site.name}
        </a>

        <nav className="entete__nav" aria-label="Navigation principale">
          {navItems.map((item) => (
            <a
              key={item.id}
              className="entete__lien"
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
            >
              {item.label}
            </a>
          ))}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
