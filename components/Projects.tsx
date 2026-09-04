import Figure from "./Figure";
import Reveal from "./Reveal";
import Section from "./Section";
import { projects } from "@/content/data";

export default function Projects() {
  return (
    <Section id="projets" label="Projets">
      {/* Chaque projet a sa propre observation : ils sont trop eloignes
          verticalement pour qu'un decalage entre eux ait du sens. */}
      {projects.map((project) => (
        <Reveal key={project.number} as="article" className="projet">
          <span className="projet__numero">{project.number}</span>

          <div className="projet__entete">
            <h3 className="projet__titre">{project.title}</h3>
            <span className="projet__annee">{project.year}</span>
          </div>

          <p className="projet__contexte">{project.context}</p>

          <ul className="projet__points">
            {project.points.map((point) => (
              <li key={point} className="puce">
                {point}
              </li>
            ))}
          </ul>

          <p className="projet__stack">{project.stack.join(" · ")}</p>

          <Figure
            src={project.image}
            alt={`${project.title} — ${project.imageCaption}`}
            caption={project.imageCaption}
            variant="projet"
            width={1080}
            height={432}
          />
        </Reveal>
      ))}
    </Section>
  );
}
