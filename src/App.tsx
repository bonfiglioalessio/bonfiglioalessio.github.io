import Logo from "./components/Logo/Logo";
import Hero from "./components/Hero/Hero";
import Intro from "./components/Intro/Intro";
import Skills from "./components/Skills/Skills";
import Project from "./components/Project/Project";
import Experiences from "./components/Experiences/Experiences";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import ReactGA from 'react-ga';
const TRACKING_ID = "G-WQY4LWRLRC";
ReactGA.initialize(TRACKING_ID);

function App() {
  return (
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
  );
}

export default App;
