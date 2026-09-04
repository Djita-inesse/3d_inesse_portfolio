import Reveal from "./Reveal";
import Section from "./Section";
import { contact, site } from "@/content/data";

export default function Contact() {
  return (
    <Section id="contact" label="Contact">
      <Reveal>
        <p className="contact__dispo">{contact.availability}</p>

        <div className="contact__coordonnees">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span className="contact__telephone">{site.phone}</span>
        </div>

        <a className="bouton-plein" href={`mailto:${site.email}`}>
          {contact.cta}
        </a>
      </Reveal>
    </Section>
  );
}
