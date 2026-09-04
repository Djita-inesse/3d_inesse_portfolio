"use client";

type Theme = "light" | "dark";

/**
 * Bascule de theme.
 *
 * Aucun etat React : le theme courant vit sur l'attribut data-theme de <html>,
 * pose avant le premier rendu par le script inline du layout. On le lit au clic
 * et on l'inverse. Cela evite un effet de synchronisation au montage — et donc
 * un rendu en cascade — tout en restant correct si l'utilisateur change son
 * reglage systeme entre deux visites.
 */
export default function ThemeToggle() {
  const toggle = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next: Theme = current === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", next);

    try {
      localStorage.setItem("theme", next);
    } catch {
      // Navigation privee ou stockage bloque : le choix vaut pour la session.
    }
  };

  return (
    <button
      type="button"
      className="bouton-theme"
      onClick={toggle}
      aria-label="Basculer entre le thème clair et le thème sombre"
    >
      Thème
    </button>
  );
}
