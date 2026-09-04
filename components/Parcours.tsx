import Reveal from "./Reveal";
import Section from "./Section";
import { education, experience, languages } from "@/content/data";
import type { TimelineEntry } from "@/content/data";

const Timeline = ({ entries }: { entries: TimelineEntry[] }) => (
  <ul className="parcours__liste">
    {entries.map((entry, index) => (
      <Reveal
        key={`${entry.role}-${entry.dates}`}
        as="li"
        className="parcours__ligne"
        delay={index * 60}
      >
        <div>
          <p className="parcours__role">{entry.role}</p>
          <p className="parcours__lieu">{entry.place}</p>
        </div>
        <span className="parcours__dates">{entry.dates}</span>
      </Reveal>
    ))}
  </ul>
);

export default function Parcours() {
  return (
    <Section id="parcours" label="Parcours">
      <Reveal>
        <h3 className="parcours__titre">Expérience</h3>
      </Reveal>
      <Timeline entries={experience} />

      <Reveal>
        <h3 className="parcours__titre parcours__titre--second">Formation</h3>
      </Reveal>
      <Timeline entries={education} />

      <Reveal>
        <h3 className="parcours__titre parcours__titre--second">
          Langues et certifications
        </h3>
        <ul className="langues">
          {languages.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
