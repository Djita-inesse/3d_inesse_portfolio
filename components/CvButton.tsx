"use client";

import type { ReactNode } from "react";

import type { Cv } from "@/content/data";

export const CV_OPEN_EVENT = "cv:ouvrir";

export type CvOpenDetail = { id?: Cv["id"] };

/**
 * Bouton qui ouvre la fenêtre des CV. Sans `cv`, il propose le choix entre
 * les deux CV ; avec `cv`, il ouvre directement l'aperçu de celui-ci.
 */
export default function CvButton({
  cv,
  className,
  children,
}: {
  cv?: Cv["id"];
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent<CvOpenDetail>(CV_OPEN_EVENT, { detail: { id: cv } })
        )
      }
    >
      {children}
    </button>
  );
}
