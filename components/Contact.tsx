import CvButton from "@/components/CvButton";
import Reveal from "@/components/Reveal";
import { contact, footer, site } from "@/content/data";

export default function Contact() {
  return (
    <section id="contact" className="section section--contact">
      <div className="enveloppe contact">
        <Reveal as="h2" className="contact__titre">
          <span>{contact.title[0]}</span>
          <span>
            {contact.title[1].replace(/\.$/, "")}
            <span className="accent">.</span>
          </span>
        </Reveal>

        <Reveal className="contact__coordonnees" delay={80}>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.phoneHref}>{site.phone}</a>
        </Reveal>

        <div className="contact__cartes">
          <Reveal className="contact__carte" delay={0}>
            <p className="contact__etiquette">GitHub</p>
            <a href={site.github} target="_blank" rel="noreferrer">
              {site.githubLabel}
            </a>
            <a className="contact__secondaire" href={site.url}>
              {site.urlLabel}
            </a>
          </Reveal>
          <Reveal className="contact__carte" delay={80}>
            <p className="contact__etiquette">LinkedIn</p>
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              {site.linkedinLabel}
            </a>
          </Reveal>
          <Reveal className="contact__carte" delay={160}>
            <p className="contact__etiquette">Disponibilité</p>
            <p>{contact.availability}</p>
          </Reveal>
        </div>

        <Reveal className="contact__actions" delay={120}>
          <a className="bouton bouton--plein bouton--50" href={`mailto:${site.email}`}>
            {contact.cta}
          </a>
          <CvButton cv="fullstack" className="bouton bouton--contour bouton--50">
            {contact.cvFullstack}
          </CvButton>
          <CvButton cv="gestion" className="bouton bouton--contour bouton--50">
            {contact.cvGestion}
          </CvButton>
          <a className="bouton bouton--contour bouton--50" href={site.url}>
            {contact.portfolio}
          </a>
        </Reveal>

        <footer className="pied">
          <p>
            © {new Date().getFullYear()} {site.legalName} · Nantes
          </p>
          <p>{footer.languages}</p>
          <p>
            <a href={site.url}>{site.urlLabel}</a>
            {" · "}
            <a href={site.github} target="_blank" rel="noreferrer">
              {site.githubLabel}
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
}
