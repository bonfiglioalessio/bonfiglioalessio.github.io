import Projects from "./ProjectList";

const Project = () => {
  return (
    <section>
      <h3 className="border-b py-4 drop-shadow-2xl">Projects ✨</h3>
      <p className="drop-shadow-2xl">
        I've build many projects using different technologies. Here are some of
        my favorite works
      </p>

      <div className="space-y-6 md:max-w-xl">
        {Projects.map((props) => {
          const { key, name, image, technology, link } = props;
          return (
            <div
              key={key}
              className="border border-[#c7c7c7] backdrop-blur-3xl dark:bg-dark/50 bg-light/20 p-2 m-0 relative flex flex-col items-start h-[160px] justify-end  shadow-2xl"
            >
              <img
                src={image}
                width={image.includes("unique") ? 110 : 70}
                className="drop-shadow-2xl mx-0 my-3 !rounded-none absolute top-1 right-5 "
                alt=""
              />
              <h4 className="m-0 drop-shadow-2xl">{name}</h4>
              <ul className="flex items-center flex-wrap p-0 gap-1 mb-2">
                {technology.map((name, index) => {
                  return (
                    <li
                      key={index}
                      className="p-0 m-0 flex flex-wrap items-center gap-1 drop-shadow-2xl"
                    >
                      {index !== 0 && <small>-</small>}
                      <small>{name}</small>
                    </li>
                  );
                })}
              </ul>
              {link ? (
                <a href={link} target="_blank" className="p-1">
                  <small>
                    Vai al sito <span className="text-xl pl-1">👉</span>
                  </small>
                </a>
              ) : (
                <a className="p-1">
                  <small>
                    Work in progress.. <span className="text-xl pl-1">🔧</span>
                  </small>
                </a>
              )}
            </div>
          );
        })}
      </div>

      <p>and this one...</p>
    </section>
  );
};

export default Project;
