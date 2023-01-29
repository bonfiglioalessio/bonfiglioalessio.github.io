import "./intro.scss";

const Intro = () => {
  return (
    <section id="intro">
      <h2><span>Ciao a tutti!</span> Sono un ragazzo di classe <span>'98</span> nato a Sanremo.</h2>
      <p>
        Finito il liceo artistico, il mio pane quotidiano iniziava ad essere il
        codice su <span>Visual Studio Code</span> e lo strumento “ispeziona elemento” di
        Chrome.
      </p>
      <button>
        <a href="#">Scopri le mie skill</a>
      </button>
    </section>
  );
};

export default Intro;
