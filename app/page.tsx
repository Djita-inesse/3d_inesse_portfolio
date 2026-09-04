import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import CodeSection from "@/components/CodeSection";
import Stack from "@/components/Stack";
import Parcours from "@/components/Parcours";
import Also from "@/components/Also";
import Contact from "@/components/Contact";

export default function Page() {
  return (
    <main id="contenu">
      <Hero />
      <Projects />
      <CodeSection />
      <Stack />
      <Parcours />
      <Also />
      <Contact />
    </main>
  );
}
