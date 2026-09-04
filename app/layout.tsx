import type { Metadata, Viewport } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { site } from "@/content/data";

import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--police-titres",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--police-corps",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.role}`,
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#141110" },
  ],
};

/**
 * Pose data-theme avant le premier rendu : sans ce script, la page s'afficherait
 * une fraction de seconde dans le mauvais theme (flash).
 */
const scriptTheme = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${archivo.variable} ${sourceSerif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTheme }} />
        {/* Sans JavaScript, l'animation d'entree ne se declenche jamais :
            le contenu doit rester visible. */}
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>
      </head>
      <body>
        <a className="lien-evitement" href="#contenu">
          Aller au contenu
        </a>
        <Header />
        {children}
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
