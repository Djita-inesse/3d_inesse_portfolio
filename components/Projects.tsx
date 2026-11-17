import Image from "next/image";

import Reveal from "@/components/Reveal";
import { also, projects, projectsIntro } from "@/content/data";

/**
 * Chaque projet est une planche de manga : une grande case pour la capture,
 * puis une case « récit » (contexte, ce que j'ai fait) et une case « bulle »
 * qui porte le résultat clé. Le côté de la bulle alterne d'un projet à l'autre.
 */
export default function Projects() {
  return (
    <section id="projets" className="section section--noire section--trame">
      <div className="enveloppe section__pile section__pile--32">
        <Reveal as="p" className="surtitre">
          {projectsIntro.kicker}
        </Reveal>
        <Reveal as="h2" className="titre-72 titre--blanc">
          {projectsIntro.title}
        </Reveal>

        <div className="planches-manga">
          {projects.map((project, index) => (
            <article
              key={project.number}
              className={index % 2 ? "manga manga--inverse" : "manga"}
              aria-labelledby={`projet-${project.number}`}
            >
              <Reveal className="case case--capture">
                <div className="case__image" style={{ aspectRatio: project.imageRatio }}>
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 1440px) 100vw, 1280px"
                  />
                </div>
                <span className="case__numero" aria-hidden="true">
                  {project.number}
                </span>
              </Reveal>

              <Reveal className="case case--recit" delay={80}>
                <p className="case__kicker">{project.kicker}</p>
                <h3 id={`projet-${project.number}`} className="case__titre">
                  {project.title}
                </h3>

                <div className="recit">
                  <div>
                    <p className="recit__etiquette">Contexte</p>
                    <p className="recit__texte">{project.context}</p>
                  </div>
                  <div>
                    <p className="recit__etiquette">Ce que j’ai fait</p>
                    <ul className="recit__liste">
                      {project.did.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="case__stack">{project.stack.join(" · ")}</p>

                {project.href ? (
                  <a className="case__lien" href={project.href} target="_blank" rel="noreferrer">
                    {project.hrefLabel} <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </Reveal>

              <Reveal className="case case--bulle" delay={160}>
                <p className="bulle">
                  <span className="bulle__chiffre">{project.result.figure}</span>
                  <span className="bulle__label">{project.result.label}</span>
                </p>
              </Reveal>
            </article>
          ))}
        </div>

        <Reveal className="autres">
          <p className="autres__kicker">{also.kicker}</p>
          <ul className="autres__liste">
            {also.items.map((item) => (
              <li key={item.title} className="autres__item">
                <span className="autres__titre">{item.title}</span>
                <span className="autres__texte">{item.text}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
