"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  /** Fraction du défilement appliquée en translation (0.1 = 10 %). */
  speed?: number;
  className?: string;
};

/**
 * Fait remonter son contenu à mesure du défilement (effet de profondeur),
 * jusqu'à sa position finale au centre de l'écran.
 * Désactivé sous prefers-reduced-motion.
 */
export default function Parallax({ children, speed = 0.08, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      // Le contenu part plus bas et remonte jusqu'à sa place quand il atteint
      // le centre de l'écran : jamais de vide sous les cartes alignées en bas.
      const shift = Math.max(0, offset * speed);
      node.style.setProperty("--parallax", `${shift.toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed]);

  return (
    <div ref={ref} className={["parallax", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
