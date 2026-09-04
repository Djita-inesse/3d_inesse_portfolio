import Reveal from "./Reveal";
import Section from "./Section";
import { stackGroups } from "@/content/data";

export default function Stack() {
  return (
    <Section id="stack" label="Stack">
      <div className="stack">
        {stackGroups.map((group, index) => (
          <Reveal key={group.title} delay={index * 60}>
            <h3 className="stack__titre">{group.title}</h3>

            <ul className="stack__liste">
              {group.items.map((item) => (
                <li key={item.label} className="techno">
                  {/* Pastille en CSS pur : aucune image, aucune bibliotheque d'icones. */}
                  <span className="pastille" aria-hidden="true">
                    {item.code}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
