import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  label: string;
  children: ReactNode;
};

/**
 * Gabarit de section : etiquette de 150px a gauche, contenu fluide a droite,
 * separes par une gouttiere de 56px, avec un filet de 1px en separation.
 * Passe sur une seule colonne sous 720px.
 *
 * L'animation d'entree n'est pas posee ici : chaque section enveloppe ses
 * propres blocs dans <Reveal> pour pouvoir echelonner ses enfants.
 */
export default function Section({ id, label, children }: SectionProps) {
  return (
    <section id={id} className="shell section" aria-labelledby={`${id}-titre`}>
      <h2 id={`${id}-titre`} className="section__etiquette">
        {label}
      </h2>

      <div className="section__contenu">{children}</div>
    </section>
  );
}
