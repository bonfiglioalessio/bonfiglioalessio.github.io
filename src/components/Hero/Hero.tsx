import "./hero.scss";

const Hero = () => {
  return (
    <section id="hero">
      <img className="absolute bottom-0 m-0 md:bottom-[-18vh] md:right-12" src="/ab.png" alt="" />
      <div className="title">
        <h1>Alessio Bonfiglio</h1>
        <div className="drop-shadow-2xl">
          <p className="mb-0">FRONTEND DEVELOPER</p>
          <p className="mt-0 text-sm">HYBRID / REMOTE</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
