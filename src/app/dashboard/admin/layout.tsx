"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const nav = [
  { href: "/dashboard/admin/users", label: "Korisnici", icon: "/icons/users.svg" },
  { href: "/dashboard/admin/devices", label: "Uređaji", icon: "/icons/devices.svg" },
  { href: "/dashboard/admin/rooms", label: "Sobe", icon: "/icons/rooms.svg" },
  { href: "/dashboard", label: "Nazad", icon: "/icons/dashboard.svg" },
];

  return (
    <div className="min-h-screen flex bg-[#f7efe6]">
      <main className="flex-1 p-8 pr-32">{children}</main>

      <aside className="fixed right-8 top-1/2 -translate-y-1/2">
  <div className="w-16 rounded-3xl bg-[#171a6b] flex flex-col items-center gap-3 py-4">
    {nav.map((item) => {
      const active = pathname === item.href;

      return (
        <Link
          key={item.href}
          href={item.href}
          title={item.label}
          className={[
            "w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition",
            active ? "bg-white/25 text-white" : "text-white/90 hover:bg-white/20",
          ].join(" ")}
        >
          <Image
            src={item.icon}
            alt={item.label}
            width={24}
            height={24}
            className="opacity-90"
            />
        </Link>
      );
    })}
  </div>
</aside>
    </div>
  );
}