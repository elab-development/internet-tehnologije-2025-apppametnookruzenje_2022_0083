type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline";
  type?: "button" | "submit";
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
}: ButtonProps) {
  const base =
    "px-6 py-3 rounded-xl font-semibold transition duration-300";

  const styles =
    variant === "primary"
      ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/30"
      : "border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10";

  return (
    <button type={type} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}