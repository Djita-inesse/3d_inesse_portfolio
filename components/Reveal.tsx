"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Decalage en ms, pour echelonner les enfants d'une liste (60ms par cran). */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Mecanique d'animation unique du site : opacity 0 -> 1 et translateY 16px -> 0,
 * 400ms ease-out, declenchee une seule fois a 15% de visibilite.
 *
 * `prefers-reduced-motion` est traite entierement en CSS (le contenu est alors
 * visible d'emblee, sans attendre l'hydratation), et une regle <noscript> du
 * layout couvre le cas ou JavaScript est desactive.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Navigateur sans IntersectionObserver : on affiche sans animation.
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("reveal--visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={[className, "reveal", visible ? "reveal--visible" : ""]
        .filter(Boolean)
        .join(" ")}
      style={
        delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined
      }
    >
      {children}
    </Tag>
  );
}
