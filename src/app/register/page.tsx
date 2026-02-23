"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md shadow-lg p-7">
        
        <h1 className="text-2xl font-bold mb-1">Registracija</h1>
        <p className="text-sm text-gray-700 mb-5">
          Kreirajte nalog kako biste mogli da upravljate pametnim okruženjem.
        </p>

       
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl mb-4 text-sm">
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
              className="mt-2 w-full rounded-xl border border-gray-300/70 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
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
              className="mt-2 w-full rounded-xl border border-gray-300/70 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <button
            type="submit" 
            className="w-full mt-2 rounded-xl bg-indigo-900 text-white py-3 font-semibold hover:bg-indigo-800 transition"
          >
            Registruj se
          </button>
        </form>

        <p className="text-sm mt-4">
          Već imaš nalog?{" "}
          <Link href="/login" className="font-semibold text-indigo-900 hover:underline">
            Prijavi se
          </Link>
        </p>
      </div>
    </main>
  );
}