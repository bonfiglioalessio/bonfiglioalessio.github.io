import Buttons from "../Buttons";
import "./intro.scss";

const Intro = () => {
  return (
    <section id="intro">
      <h3 className="drop-shadow-2xl">
        <strong>Hello everyone!</strong> I am a class of <strong>'98</strong>{" "}
        boy born in San Remo.
      </h3>
      <p className="drop-shadow-2xl">
        Since childhood I've been super enthusiast about web development and <strong>technology</strong>.<br></br>I attended <strong>liceo artistico</strong> in the branch of multimediale, later i
        continued my studies by taking specialised courses in <strong>Web Design</strong> and <strong>Web Programming</strong>.
      </p>
      <Buttons
        href={["#experiences", "#contact"]}
        text={["Experiences", "Contact me"]}
      />
    </section>
  );
};

export default Intro;
