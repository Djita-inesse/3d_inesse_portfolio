import Image from "next/image";

import CvButton from "@/components/CvButton";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import {
  alternance,
  characters,
  hero,
  headline,
  passion,
  pitch,
  stats,
} from "@/content/data";

export default function Hero() {
  return (
    <section id="accueil" className="s-accueil">
      <div className="enveloppe">
        <div className="intro">
          <div className="intro__gauche">
            <Reveal className="ruban">
              <img className="ruban__forme" src="/figma/ruban.svg" alt="" width={250} height={64} />
              <span className="ruban__texte">{hero.ribbon}</span>
            </Reveal>

            <Reveal as="h1" className="hero__titre" delay={60}>
              <span>{hero.title[0]}</span>
              <span>{hero.title[1]}</span>
            </Reveal>

            <Reveal as="p" className="hero__sous-titre" delay={120}>
              {hero.subtitle}
            </Reveal>

            <Reveal as="p" className="hero__bio" delay={180}>
              {hero.bio}
            </Reveal>

            <Reveal className="hero__actions" delay={240}>
              <a className="bouton bouton--plein bouton--decouvrir" href="#projets" aria-label="Découvrir les projets">
                <img src="/figma/bouton-decouvrir.svg" alt="" width={211.828} height={13.572} />
              </a>
              <CvButton className="bouton bouton--contour bouton--cv">{hero.ctaCv}</CvButton>
            </Reveal>
          </div>

          <div className="intro__droite">
            <Reveal as="article" className="carte" delay={80}>
              <div className="carte__tete">
                <p className="etiquette">PROFIL</p>
              </div>
              <h2 className="carte__titre">
                <span>{headline[0]}</span>
                <span>{headline[1]}</span>
              </h2>
              <p className="carte__texte">{pitch}</p>
            </Reveal>

            <Reveal as="article" className="carte carte--noire" delay={160}>
              <div className="carte__tete">
                <p className="etiquette etiquette--accent">{alternance.kicker}</p>
              </div>
              <p className="carte__titre carte__titre--blanc">{alternance.title}</p>
              <p className="carte__texte carte__texte--sable">{alternance.text}</p>
              <ul className="stats stats--hero">
                {stats.map((stat) => (
                  <li key={stat.kicker} className="stat">
                    <span className="stat__valeur">{stat.value}</span>
                    <span className="stat__label">{stat.label}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <div className="galerie">
          <Reveal className="galerie__passion">
            <p className="galerie__titre">
              <span>{passion.title[0]}</span>
              <span>{passion.title[1]}</span>
            </p>
            <p className="galerie__detail">
              <span>{passion.detail[0]}</span>
              <span>{passion.detail[1]}</span>
            </p>
          </Reveal>

          {characters.map((character, index) => (
            <Reveal key={character.name} className="galerie__item" delay={index * 70}>
              <Parallax speed={character.speed}>
                <figure
                  className={character.light ? "perso perso--clair" : "perso"}
                  style={{ height: character.height }}
                >
                  <Image
                    src={character.src}
                    alt={character.name}
                    fill
                    sizes="(max-width: 760px) 45vw, 200px"
                  />
                </figure>
              </Parallax>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
