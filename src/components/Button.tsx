type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 12px",
        marginRight: "8px",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
