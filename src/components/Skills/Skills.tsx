const Skills = () => {
  return (
    <section>
      <h3 className="border-b py-4">Competenze tecniche</h3>
      <p>
        Sono un Frontend Developer con 3 anni di esperienza e ho imparato molte cose in questo viaggio
      </p>
      <ul className="flex flex-wrap items-center gap-4 p-0">
        {[
          "HTML",
          "CSS",
          "SCSS",
          "Javascript",
          "React",
          "TailwindCSS",
          "Next.js",
          "Typescript",
          "Redux",
          "Git",
        ].map((skill, index) => (
          <li key={index} className="border p-2 m-0 min-w-[65px] text-center">
            <a href="">{skill}</a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Skills;
