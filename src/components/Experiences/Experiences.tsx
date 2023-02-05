const Experiences = () => {
  return (
    <section id="experiences">
      <h3 className="py-4 border-b drop-shadow-2xl">Work Experiences ✨</h3>
      <p className="drop-shadow-2xl">Wonderful companies I worked with.</p>

      <ul className="list-[disclosure-closed]">
        <li className="relative">
          <h4 className="m-0 drop-shadow-2xl">AdKaora <small>- Mondadori Media</small></h4>
          <p className="m-0 text-sm drop-shadow-2xl">
            3 yrs <small>/ present</small>
          </p>
          <hr className="my-3 shadow-2xl" />
          <p className="m-0 text-sm drop-shadow-2xl">Frontend Developer - Milan, Italy</p>
          <img src="/experiences/mondadori.svg" className="absolute right-0 m-0 top-4 drop-shadow-2xl" width={50} alt="" />
        </li>
      </ul>

      <p className="drop-shadow-2xl">.. what the next ?</p>
    </section>
  );
};

export default Experiences;
