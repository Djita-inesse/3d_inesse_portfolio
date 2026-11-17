import Image from "next/image";

import Reveal from "@/components/Reveal";
import { profil } from "@/content/data";

export default function Manifeste() {
  return (
    <section id="profil" className="section section--noire">
      <div className="enveloppe section__pile section__pile--48">
        <Reveal as="p" className="surtitre">
          {profil.kicker}
        </Reveal>

        <div className="profil">
          <div className="profil__portrait">
            <Reveal className="portrait">
              <Image
                src={profil.portrait.src}
                alt={profil.portrait.alt}
                fill
                sizes="(max-width: 760px) 100vw, 320px"
              />
            </Reveal>
            <Reveal className="bloc-sombre bloc-sombre--univers" delay={80}>
              <p className="etiquette etiquette--11">{profil.universe.kicker}</p>
              <p className="bloc-sombre__titre">{profil.universe.title}</p>
              <p className="bloc-sombre__texte">{profil.universe.text}</p>
            </Reveal>
          </div>

          <div className="profil__contenu">
            <Reveal as="h2" className="titre-72 titre--blanc">
              <span>{profil.title[0]}</span>
              <span>{profil.title[1]}</span>
            </Reveal>
            <Reveal as="p" className="profil__pitch" delay={80}>
              {profil.text}
            </Reveal>

            <ol className="methode">
              {profil.steps.map((step, index) => (
                <Reveal as="li" key={step.number} className="methode__etape" delay={140 + index * 80}>
                  <span className="methode__numero">{step.number}</span>
                  <span className="methode__titre">{step.title}</span>
                  <span className="methode__texte">{step.text}</span>
                </Reveal>
              ))}
            </ol>

            <Reveal className="bloc-sombre bloc-sombre--culture" delay={200}>
              <div className="bloc-sombre__corps">
                <p className="etiquette etiquette--11">{profil.culture.kicker}</p>
                <p className="bloc-sombre__culture">{profil.culture.text}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
