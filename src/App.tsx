import Logo from "./components/Logo/Logo";
import Hero from "./components/Hero/Hero";
import Intro from "./components/Intro/Intro";
import Skills from "./components/Skills/Skills";
import Project from "./components/Project/Project";
import Experiences from "./components/Experiences/Experiences";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading ? (
        <>
        <div className="loader-container">
          <div className="spinner"></div>
          <img src="/logo_white.svg" width={180} alt="" />
        </div>
        <Logo />
        <Hero />
        <Intro />
        <Skills />
        <Project />
        <Experiences />
        <Contact />
        <Footer />
        </>
      ) : (
        <>
          <Logo />
          <Hero />
          <Intro />
          <Skills />
          <Project />
          <Experiences />
          <Contact />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
