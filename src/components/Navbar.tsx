"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  }

  return (
    <nav
      style={{
        display: "flex",
        gap: 16,
        alignItems: "center",
        padding: "12px 20px",
        background: "#1d1f7a",
        color: "white",
      }}
    >
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

          <button
            onClick={handleLogout}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white",
              padding: "6px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
