import Reveal from "./Reveal";
import Section from "./Section";
import { codeIntro, repositories, site } from "@/content/data";

export default function CodeSection() {
  return (
    <Section id="code" label="Code">
      <Reveal>
        <a
          className="code__lien"
          href={site.github}
          target="_blank"
          rel="noreferrer"
        >
          {site.githubLabel}
        </a>
        <p className="code__intro">{codeIntro}</p>
      </Reveal>

      <ul className="depots">
        {repositories.map((repository, index) => (
          <Reveal
            key={repository.name}
            as="li"
            className="depot"
            delay={(index + 1) * 60}
          >
            <span className="depot__nom">{repository.name}</span>
            <span className="depot__description">{repository.description}</span>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
