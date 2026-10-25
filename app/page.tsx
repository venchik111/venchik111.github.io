import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Effects } from "@/components/Effects";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Projects } from "@/components/Projects";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <About />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <Effects />
    </>
  );
}
