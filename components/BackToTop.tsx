"use client";

import { useEffect, useState } from "react";

/** Apparait au-dela de 600px de defilement. Angles vifs, sans ombre. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className={`retour-haut${visible ? " retour-haut--visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5" />
      </svg>
    </button>
  );
}
