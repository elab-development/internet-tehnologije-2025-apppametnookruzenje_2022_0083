"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const BACKEND_URL = "http://localhost:4000";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (!token) {
      setRole(null);
      return;
    }

    fetch(`${BACKEND_URL}/api/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) return null;
        return data;
      })
      .then((data) => {
        const r = String(data?.user?.role || "").toUpperCase();
        setRole(r || null);
        setEmail(data?.user?.email || null);
      })
      .catch(() => {
        setRole(null);
      });
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setRole(null);
    setEmail(null);
    router.push("/");
  }

  return (
    <nav
  style={{
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    background: "#171a6b",
    color: "white",
  }}
>
  <div style={{ flex: 1 }} />

  <div style={{ display: "flex", gap: 16 }}>
    <Link href="/" style={{ color: "white", fontWeight: 600 }}>
      Home
    </Link>

    {!isLoggedIn ? (
      <>
        <Link href="/login" style={{ color: "white" }}>
          Login
        </Link>
        <Link href="/register" style={{ color: "white" }}>
          Register
        </Link>
      </>
    ) : (
      <>
        <Link href="/dashboard" style={{ color: "white" }}>
          Dashboard
        </Link>
        <Link href="/rooms" style={{ color: "white" }}>
          Rooms
        </Link>

        {role === "ADMIN" && (
          <Link href="/dashboard/admin/users" style={{ color: "white" }}>
            Admin
          </Link>
        )}
      </>
    )}
  </div>

  <div
  style={{
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    minWidth: 260,
  }}
>
  {email && (
    <span
      style={{
        opacity: 0.95,
        fontSize: 14,
        whiteSpace: "nowrap",
      }}
    >
      {email}
    </span>
  )}

  {isLoggedIn && (
    <button
      onClick={handleLogout}
      style={{
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.25)",
        color: "white",
        padding: "6px 12px",
        borderRadius: 6,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      Logout
    </button>
  )}
</div>
</nav>
  );
}