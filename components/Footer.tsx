import { site } from "@/content/data";

export default function Footer() {
  return (
    <footer className="shell">
      <div className="pied">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>

        <nav className="pied__liens" aria-label="Liens externes">
          <a href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={site.cv} download>
            CV
          </a>
        </nav>
      </div>
    </footer>
  );
}
