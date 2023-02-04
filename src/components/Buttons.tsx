const Buttons = (props: { href: string[]; text: string[] }) => {
  const { href, text } = props;
  return (
    <div className="flex items-center gap-3">
      <button>
        <a href={href[0]}>{text[0]}</a>
      </button>

      <button className="!border-black">
        <a href={href[1]} className="text-light">
          {text[1]}
        </a>
      </button>
    </div>
  );
};

export default Buttons;
