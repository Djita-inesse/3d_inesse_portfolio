import Image from "next/image";

import Reveal from "@/components/Reveal";
import { arsenal } from "@/content/data";

export default function Arsenal() {
  return (
    <section id="arsenal" className="section">
      <div className="enveloppe section__pile section__pile--48">
        <Reveal as="p" className="surtitre surtitre--etroit">
          {arsenal.kicker}
        </Reveal>

        <div className="arsenal">
          <div className="arsenal__gauche">
            <Reveal as="h2" className="titre-72">
              {arsenal.title}
            </Reveal>

            <div className="arsenal__groupes">
              {arsenal.groups.map((group, index) => (
                <Reveal key={group.title} className="arsenal__groupe" delay={index * 70}>
                  <h3>{group.title}</h3>
                  <p>{group.text}</p>
                </Reveal>
              ))}
            </div>

            <ul className="puces">
              {arsenal.pills.map((pill, index) => (
                <Reveal as="li" key={pill} className="puce puce--noire" delay={index * 30}>
                  {pill}
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="arsenal__droite">
            <Reveal className="visuel-gojo">
              <Image
                src={arsenal.visual.src}
                alt={arsenal.visual.alt}
                fill
                sizes="(max-width: 1100px) 100vw, 520px"
              />
            </Reveal>
            <Reveal className="legende" delay={80}>
              <div>
                <p className="legende__titre">{arsenal.visual.title}</p>
                <p className="legende__texte">{arsenal.visual.text}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
