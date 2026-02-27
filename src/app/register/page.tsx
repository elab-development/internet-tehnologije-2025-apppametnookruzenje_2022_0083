"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
     
        setError(data.message || "Korisnik sa ovim email-om već postoji.");
        setEmail(""); 
        setPassword("");
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("Greška u povezivanju sa serverom.");
    }
  };

  return (
    <main className="flex justify-center pt-12 px-4">
     <div className="fixed inset-0 w-full h-full overflow-hidden">
  <Image
    src="/pozadina2.jpg"
    alt="Background"
    fill
    priority
    className="object-cover"
  />

  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />

  <div className="relative z-10 flex items-center justify-center h-full px-4">
    <div className="w-full max-w-md rounded-2xl p-7 shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white">
      <h1 className="text-2xl font-bold mb-1">Registracija</h1>

      <p className="text-sm text-white/70 mb-5">
        Kreirajte nalog kako biste mogli da upravljate pametnim okruženjem.
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-400/40 text-red-200 px-4 py-2 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleRegister}>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="npr. ime@email.com"
            className="mt-2 w-full rounded-xl bg-white/20 border border-white/30 px-4 py-3 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-[#00c2ff]"
          />
        </div>

        <div>
          <label className="block font-medium">Lozinka</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Unesite lozinku"
            className="mt-2 w-full rounded-xl bg-white/20 border border-white/30 px-4 py-3 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-[#00c2ff]"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 rounded-xl bg-[#00c2ff] text-black py-3 font-semibold hover:bg-[#00e0ff] transition"
        >
          Registruj se
        </button>
      </form>

      <p className="text-sm mt-4 text-white/70">
        Već imaš nalog?{" "}
        <Link href="/login" className="font-semibold text-[#00c2ff] hover:underline">
          Prijavi se
        </Link>
      </p>
    </div>
  </div>
</div>
    </main>
  );
}