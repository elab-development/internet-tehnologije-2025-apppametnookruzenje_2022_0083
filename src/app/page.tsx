"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";



export default function HomePage() {
const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const sync = () => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  };

  sync();
  window.addEventListener("auth-changed", sync);

  return () => window.removeEventListener("auth-changed", sync);
}, []);
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <Image
        src="/pozadina2.jpg"
        alt="Pametno okruženje"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 h-full w-full flex items-center pl-50 text-white">
        <div className="max-w-3xl text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Pametno okruženje
          </h1>

          <p className="text-white/90 text-lg mb-8">
            Upravljajte pametnim uređajima kao što su svetlo, klima uređaj i
            pametna brava putem modernog web interfejsa.
          </p>

          {!isLoggedIn && (
          <div className="flex justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-[#1095e8] text-black px-6 py-3 font-semibold hover:bg-[#00e0ff] transition"            >
              Prijavi se
            </Link>

            <Link
              href="/register"
              className="rounded-xl border border-[#1095e8] text-[#00c2ff] px-6 py-3 font-semibold hover:bg-[#00c2ff]/10 transition"            >
              Registruj se
            </Link>
          </div>)}
        </div>
      </div>
    </div>
  );
}