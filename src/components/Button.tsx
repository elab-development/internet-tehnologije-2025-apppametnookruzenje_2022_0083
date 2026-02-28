type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  disabled?: boolean;   
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,   
}: ButtonProps) {
  const base =
    "px-6 py-3 rounded-xl font-semibold transition duration-300";

  const styles =
  variant === "primary"
    ? "bg-cyan-500 text-black hover:bg-cyan-400"
    : "border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10";

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}  
      className={`${base} ${styles} ${disabledStyles}`}
    >
      {children}
    </button>
  );
}