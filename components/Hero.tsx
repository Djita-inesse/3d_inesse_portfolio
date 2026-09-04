import Figure from "./Figure";
import Reveal from "./Reveal";
import { profile, site } from "@/content/data";

export default function Hero() {
  return (
    <div id="top" className="shell hero">
      <Reveal>
        <div className="hero__filet" aria-hidden="true" />

        <h1 className="hero__nom">{site.name}</h1>
        <p className="hero__role">{site.role}</p>

        <p className="hero__intro">{profile.intro}</p>
        <p className="hero__dispo">{profile.availability}</p>

        <p className="hero__liens">
          <a href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={site.cv} download>
            Télécharger le CV (PDF)
          </a>
        </p>
      </Reveal>

      <Reveal delay={60}>
        <Figure
          src={profile.portrait}
          alt={profile.portraitAlt}
          caption="Portrait"
          variant="portrait"
          width={260}
          height={320}
        />
      </Reveal>
    </div>
  );
}
