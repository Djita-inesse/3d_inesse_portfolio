import Image from "next/image";

type FigureProps = {
  src: string | null;
  alt: string;
  /** Legende affichee dans le cadre tant qu'aucune image n'est fournie. */
  caption: string;
  variant: "projet" | "portrait";
  width: number;
  height: number;
};

/**
 * Cadre d'image a angles vifs. Tant que `src` vaut null, le cadre affiche sa
 * legende — c'est l'etat represente sur les maquettes. Des qu'une image est
 * renseignee dans content/data.ts, elle prend sa place au meme format.
 */
export default function Figure({
  src,
  alt,
  caption,
  variant,
  width,
  height,
}: FigureProps) {
  return (
    <figure className={`figure figure--${variant}`}>
      {src ? (
        <Image
          className="figure__image"
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={variant === "portrait" ? "260px" : "(max-width: 1080px) 100vw, 1080px"}
        />
      ) : (
        <div className="figure__vide">{caption}</div>
      )}
    </figure>
  );
}
