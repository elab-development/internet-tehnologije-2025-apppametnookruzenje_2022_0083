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
    <main>
      <h1>Login</h1>

      <p>Prijavite se na nalog kako biste pristupili dashboard-u.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            placeholder="npr. ime@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label>Lozinka</label>
          <br />
          <input
            type="password"
            placeholder="Unesite lozinku"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label>Uloga</label>
          <br />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: "8px 10px", marginTop: 6, width: 280, borderRadius: 6 }}
          >
            <option value="PARENT">PARENT</option>
            <option value="CHILD">CHILD</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div style={{ marginTop: "16px" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Prijava..." : "Prijavi se"}
          </button>
        </div>
      </form>

      <p style={{ marginTop: "16px" }}>
        Nemaš nalog? <Link href="/register">Registruj se</Link>
      </p>
    </main>
  );
}
