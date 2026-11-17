import Reveal from "@/components/Reveal";
import { parcours } from "@/content/data";
import type { TimelineEntry } from "@/content/data";

/** Frise verticale : un fil, des points, pas de cartes. */
function Frise({ kicker, entries }: { kicker: string; entries: TimelineEntry[] }) {
  return (
    <div className="parcours__colonne">
      <Reveal as="h3" className="parcours__kicker">
        {kicker}
      </Reveal>
      <ol className="frise">
        {entries.map((entry, index) => (
          <Reveal
            as="li"
            key={entry.title}
            className={entry.status ? "frise__etape frise__etape--actuelle" : "frise__etape"}
            delay={index * 90}
          >
            <span className="frise__point" aria-hidden="true" />
            <p className="etape__dates">
              {entry.dates}
              {entry.status ? <span className="etape__statut">{entry.status}</span> : null}
            </p>
            <p className="etape__titre">{entry.title}</p>
            <div className="etape__texte">
              {entry.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

export default function Parcours() {
  return (
    <section id="parcours" className="section section--parcours">
      <div className="enveloppe section__pile section__pile--24">
        <Reveal as="h2" className="titre-72">
          {parcours.title}
        </Reveal>
        <div className="parcours">
          <Frise {...parcours.experience} />
          <Frise {...parcours.education} />
        </div>
      </div>
    </section>
  );
}
