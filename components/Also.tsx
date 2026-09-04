import Reveal from "./Reveal";
import Section from "./Section";
import { alsoItems } from "@/content/data";

export default function Also() {
  return (
    <Section id="aussi" label="Aussi">
      <ul className="liste-puces">
        {alsoItems.map((item, index) => (
          <Reveal key={item} as="li" className="puce" delay={index * 60}>
            {item}
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
