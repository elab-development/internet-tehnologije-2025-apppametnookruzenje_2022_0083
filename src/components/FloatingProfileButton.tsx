"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function FloatingProfileButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    syncAuth();

    window.addEventListener("auth-changed", syncAuth);

    return () => {
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, []);

  if (!isLoggedIn) return null;

  return (
    <Link
      href="/profile"
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        width: 52,
        height: 52,
        borderRadius: 26,
        background: "#08e3fc",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
        zIndex: 9999,
        border: "1px solid rgba(255,255,255,0.2)",
        fontSize: 22,
      }}
      aria-label="Profil"
      title="Profil"
    >
      👤
    </Link>
  );
}