"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? "Login nije uspeo");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch {
      setError("Greška pri povezivanju sa backendom");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex justify-center pt-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md shadow-lg p-7">
        
        <h1 className="text-2xl font-bold mb-1">Login</h1>
        <p className="text-sm text-gray-700 mb-5">
          Prijavite se na nalog kako biste pristupili dashboard-u.
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              placeholder="npr. ime@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300/70 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block font-medium">Lozinka</label>
            <input
              type="password"
              placeholder="Unesite lozinku"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300/70 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block font-medium">Uloga</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300/70 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="PARENT">RODITELJ</option>
              <option value="CHILD">DETE</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-indigo-900 text-white py-3 font-semibold hover:bg-indigo-800 transition disabled:opacity-60"
          >
            {loading ? "Prijava..." : "Prijavi se"}
          </button>
        </form>

        <p className="text-sm mt-4">
          Nemaš nalog?{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-900 hover:underline"
          >
            Registruj se
          </Link>
        </p>

      </div>
    </main>
  );
}

