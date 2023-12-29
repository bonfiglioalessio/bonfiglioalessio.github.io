const Experiences = () => {
  const experiences = [
    {
      name: "AdKaora",
      location: "Mondadori Media",
      duration: "3 yrs / July 2023",
      description: "Frontend Developer - Milan, Italy",
      image: "/experiences/mondadori.svg",
    },
    {
      name: "iliad",
      location: "",
      duration: "Present",
      description: "Frontend Developer - Milan, Italy",
      image: "/experiences/iliad.svg",
    }
  ]
  return (
    <section id="experiences">
      <h3 className="py-4 border-b drop-shadow-2xl">Work Experiences ✨</h3>
      <p className="drop-shadow-2xl">Wonderful companies I worked with.</p>

      <ul className="list-[disclosure-closed] md:max-w-md">
        {experiences.map(({ name, location, duration, description, image }) => (
          <li className="relative" key={name}>
            <h4 className="m-0 drop-shadow-2xl">{name} <small className="text-sm">{location}</small></h4>
            <p className="m-0 text-sm drop-shadow-2xl">{duration}</p>
            <hr className="my-3 shadow-2xl" />
            <p className="m-0 text-sm drop-shadow-2xl">{description}</p>
            <img src={image} className="absolute right-0 m-0 top-4 drop-shadow-2xl" width={50} alt="" />
          </li>
        ))}
      </ul>

      <p className="drop-shadow-2xl">.. what the next ?</p>
    </section>
  );
};

export default Experiences;
