import Experience from "@/components/Experience";
import StoryHero from "@/components/sections/StoryHero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Journey from "@/components/sections/Journey";
import Doctors from "@/components/sections/Doctors";
import Timings from "@/components/sections/Timings";
import Gallery from "@/components/sections/Gallery";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import ActionBar from "@/components/ui/ActionBar";
import Cursor from "@/components/ui/Cursor";
import Loader from "@/components/ui/Loader";
import Navbar from "@/components/ui/Navbar";

export default function Home() {
  return (
    <>
      <Loader />
      <Experience />
      <Navbar />
      <main className="relative">
        <StoryHero />
        <About />
        <Services />
        <Journey />
        <Doctors />
        <Timings />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <ActionBar />
      <Cursor />
    </>
  );
}
