const Buttons = (props: { href: string[]; text: string[] }) => {
  const { href, text } = props;
  return (
    <div className="flex items-center gap-3">
      <button className="shadow-2xl">
        <a href={href[0]}>{text[0]}</a>
      </button>

      <button className="dark:!border-black border-none !bg-transparent drop-shadow-2xl">
        <a href={href[1]} className="text-light">
          {text[1]}
        </a>
      </button>
    </div>
  );
};

export default Buttons;
