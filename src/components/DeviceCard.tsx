type DeviceCardProps = {
  title: string;
  status: string;
  children: React.ReactNode;
};

export default function DeviceCard({ title, status, children }: DeviceCardProps) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "16px" }}>
      <h3>{title}</h3>
      <p>Status: {status}</p>
      {children}
    </div>
  );
}
