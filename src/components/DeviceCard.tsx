type DeviceCardProps = {
  title: string;
  status: string;
  children: React.ReactNode;
  titleClassName?: string;
};

export default function DeviceCard({
  title,
  status,
  children,
  titleClassName = "", 
}: DeviceCardProps) {
  return (
    <div className="device-card">
      <h3 className={titleClassName}>{title}</h3>
      <p>Status: {status}</p>
      {children}
    </div>
  );
}
