const Skills = () => {
  type Skills = {
    icon: string;
    name: string;
  };

  const skills: Skills[] = [
    {
      icon: "html",
      name: "HTML",
    },
    {
      icon: "css",
      name: "CSS",
    },
    {
      icon: "scss",
      name: "SCSS",
    },
    {
      icon: "js",
      name: "Javascript",
    },
    {
      icon: "vue",
      name: "Vue",
    },
    {
      icon: "nuxt",
      name: "Nuxt",
    },
    {
      icon: "react",
      name: "React",
    },
    {
      icon: "tailwind",
      name: "TailwindCSS",
    },
    {
      icon: "next",
      name: "Next.js",
    },
    {
      icon: "git",
      name: "Git",
    },
  ];

  return (
    <section>
      <h3 className="border-b py-4 drop-shadow-2xl">Technical Skills 🚀</h3>
      <p className="drop-shadow-2xl">
        I'm doing this for almost 3 years from now, and I have learned a lot of
        things through this journey.
      </p>
      <ul className="flex flex-wrap items-center gap-4 p-0">
        {skills.map((skill, index) => {
          const { icon, name } = skill;
          return (
            <button
              key={index}
              className="border border-[#c7c7c7] backdrop-blur-3xl dark:bg-dark/50 bg-light/20 p-2 m-0 min-w-[65px] text-center flex items-center gap-2 shadow-2xl cursor-text"
            >
              <img src={`/skills/${icon}.svg`} className="m-0" width={28} height={28} alt="" />
              <p className="m-0 p-0">{name}</p>
            </button>
          );
        })}
      </ul>
    </section>
  );
};

export default Skills;
