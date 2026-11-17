/**
 * Monogramme « ID » : un bloc d'encre avec le pli du ruban « Je recherche une
 * alternance » en bas à gauche, pour que le logo et le ruban parlent la même
 * langue. Même dessin que app/icon.svg (favicon).
 */
export default function Logo({ size = 44, inverse = false }: { size?: number; inverse?: boolean }) {
  const fond = inverse ? "#f4f1ea" : "#111111";
  const pli = inverse ? "#bfb3a6" : "#3d3d3d";
  const texte = inverse ? "#111111" : "#ffffff";

  return (
    <svg
      className="logo"
      width={size}
      height={size}
      viewBox="0 0 44 44"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 30H16L20 44L0 30Z" fill={pli} />
      <path d="M10 0H40C42.2 0 44 1.8 44 4V26C44 28.2 42.2 30 40 30H0V10C0 4.5 4.5 0 10 0Z" fill={fond} />
      <text
        x="22"
        y="23"
        textAnchor="middle"
        fill={texte}
        style={{ font: "900 21px var(--titre)", letterSpacing: "0.5px" }}
      >
        ID
      </text>
    </svg>
  );
}
