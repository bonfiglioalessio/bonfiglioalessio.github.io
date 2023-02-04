const Footer = () => {
  type Social = {
    name: string;
    url: string;
  };

  const Social: Social[] = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/alessio-bonfiglio/",
    },
    {
      name: "Dev",
      url: "https://dev.to/bonfiglioalessio",
    },
    {
      name: "Github",
      url: "https://github.com/bonfiglioalessio",
    },
  ];

  return (
    <footer className="px-9 relative prose-stone dark:prose-invert prose-lg lg:prose-xl pt-20 pb-36">
      <hr className="mb-1 text-light w-1/3" />
      <ul className="flex items-center m-0 p-0 gap-5">
        {Social.map(({ name, url }) => (
          <li key={name} className="p-0">
            <a href={url} target="_blank">{name}</a>
          </li>
        ))}
      </ul>

      <small className="text-light absolute bottom-10 right-3 m-0">Built with Vite, React and Tailwind</small>
      <small className="text-light absolute bottom-3 right-3 m-0">with love and much coffee ❤️</small>
    </footer>
  );
};

export default Footer;
