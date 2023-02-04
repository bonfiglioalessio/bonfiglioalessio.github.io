import Buttons from "../Buttons";
import "./intro.scss";

const Intro = () => {
  return (
    <section id="intro">
      <h2>
        <span>Ciao a tutti!</span> Sono un ragazzo di classe <span>'98</span>{" "}
        nato a Sanremo.
      </h2>
      <p>
        Fin da piccolino super appassionato dello sviluppo web e della{" "}
        <span>tecnologia</span>.<br></br>Ho frequentato il{" "}
        <span>liceo artistico</span> nel ramo del multimediale, successivamente
        ho continuato gli studi frequentando corsi specializzati per{" "}
        <span>Web Design</span> e <span>Web programming</span>.
      </p>
      <Buttons href={["#", "#"]} text={["Scopri i miei progetti", "Contatti"]} />
    </section>
  );
};

export default Intro;
