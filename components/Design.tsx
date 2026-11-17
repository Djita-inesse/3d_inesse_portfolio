import Image from "next/image";

import Reveal from "@/components/Reveal";
import { designIntro, studies } from "@/content/data";
import type { Study } from "@/content/data";

function Planche({ study, large = false, delay = 0 }: { study: Study; large?: boolean; delay?: number }) {
  return (
    <Reveal as="article" className={large ? "planche planche--large" : "planche"} delay={delay}>
      <div
        className={study.imageDark ? "planche__capture planche__capture--sombre" : "planche__capture"}
        style={study.imageRatio ? { aspectRatio: study.imageRatio, height: "auto" } : undefined}
      >
        <Image
          src={study.image}
          alt={study.imageAlt}
          fill
          sizes={large ? "(max-width: 1440px) 100vw, 1280px" : "(max-width: 900px) 100vw, 640px"}
        />
      </div>
      <div className="planche__corps">
        <div className="planche__tete">
          <div>
            <p className="projet__kicker">{study.kicker}</p>
            <h3 className="planche__titre">{study.title}</h3>
          </div>
          {large ? (
            <a
              className="fleche"
              href={study.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Ouvrir la maquette ${study.title} dans Figma (nouvel onglet)`}
            >
              →
            </a>
          ) : null}
        </div>
        <p className="planche__texte">{study.text}</p>
        <ul className="puces">
          {study.stack.map((item) => (
            <li key={item} className="puce puce--petite puce--beige">
              {item}
            </li>
          ))}
        </ul>
        <a className="planche__lien" href={study.href} target="_blank" rel="noreferrer">
          {study.hrefLabel}
        </a>
      </div>
    </Reveal>
  );
}

export default function Design() {
  const [principale, ...autres] = studies;

  return (
    <section id="design" className="section">
      <div className="enveloppe section__pile section__pile--32">
        <Reveal as="p" className="surtitre">
          {designIntro.kicker}
        </Reveal>
        <Reveal as="h2" className="titre-72">
          {designIntro.title}
        </Reveal>
        <Reveal as="p" className="design__intro" delay={60}>
          {designIntro.text}
        </Reveal>

        <Planche study={principale} large />

        <div className="planches">
          {autres.map((study, index) => (
            <Planche key={study.title} study={study} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
