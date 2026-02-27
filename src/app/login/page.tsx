"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? "Login nije uspeo");
        return;
      }

      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("auth-changed"));

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }


      router.push("/dashboard");
    } catch {
      setError("Greška pri povezivanju sa backendom");
    } finally {
      setLoading(false);
    }
  }

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

          <div className="w-full max-w-md rounded-2xl p-7 shadow-2xl 
          bg-white/10 backdrop-blur-lg border border-white/20 text-white">

            <h1 className="text-2xl font-bold mb-1">Login</h1>

            <p className="text-sm text-white/70 mb-5">
              Prijavite se na nalog kako biste pristupili dashboard-u.
            </p>

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

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
                  className="mt-2 w-full rounded-xl bg-white/20 border border-white/30 px-4 py-3 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-[#00c2ff]"
                />
              </div>

              <div>
                <label className="block font-medium">Lozinka</label>
                <input
                  type="password"
                  placeholder="Unesite lozinku"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-white/20 border border-white/30 px-4 py-3 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-[#00c2ff]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-xl bg-[#1095e8] text-white py-3 font-semibold hover:bg-[#0d7fc6] transition"
              >
                {loading ? "Prijava..." : "Prijavi se"}
              </button>
            </form>

            <p className="text-sm mt-4 text-white/70">
              Nemaš nalog?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#00c2ff] hover:underline"
              >
                Registruj se
              </Link>
            </p>

          </div>

        </div>
      </div>
    </main>
  );
}

