import Hero from "@/components/Hero";
import Manifeste from "@/components/Manifeste";
import Arsenal from "@/components/Arsenal";
import Parcours from "@/components/Parcours";
import Projects from "@/components/Projects";
import Design from "@/components/Design";
import Contact from "@/components/Contact";

export default function Page() {
  return (
    <main id="contenu">
      <Hero />
      <Manifeste />
      <Arsenal />
      <Parcours />
      <Projects />
      <Design />
      <Contact />
    </main>
  );
}
