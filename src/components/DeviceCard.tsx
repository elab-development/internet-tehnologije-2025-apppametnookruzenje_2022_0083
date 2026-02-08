type DeviceCardProps = {
  title: string;
  status: string;
  children: React.ReactNode;
};

export default function DeviceCard({ title, status, children }: DeviceCardProps) {
  return (
    <div  className="device-card" >
      <h3>{title}</h3>
      <p>Status: {status}</p>
      {children}
    </div>
  );
}
