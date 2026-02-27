"use client";

import { useEffect, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

type LogItem = {
  id: number;
  message: string;
  createdAt: string;
  device?: { id: number; name: string } | null;
};

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setIsLoggedIn(false);
    return;
  }

  setIsLoggedIn(true);

  fetch(`${BACKEND_URL}/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async (res) => {
      const data = await res.json().catch(() => null);
      if (!res.ok) return null;
      return data;
    })
    .then((data) => {
      setEmail(String(data?.user?.email || ""));
      setRole(String(data?.user?.role || ""));
    })
    .catch(() => {});
}, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingLogs(true);
    fetch(`${BACKEND_URL}/api/me/logs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) return { logs: [] };
        return data;
      })
      .then((data) => setLogs(Array.isArray(data?.logs) ? data.logs : []))
      .finally(() => setLoadingLogs(false));
  }, []);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setErr("Nisi ulogovana.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/me/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErr(data?.message || "Greška.");
        return;
      }

      setMsg(data?.message || "Šifra je promenjena.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setSaving(false);
    }
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString();
  }
  if (isLoggedIn === false) {
  return (
    <main style={{ padding: 40, textAlign: "center" }}>
      <h1>Niste ulogovani</h1>
    </main>
  );
}

  return (
  <main style={{ maxWidth: 1200, margin: "30px auto", padding: 16 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 14 }}>
      Moj profil
    </h1>

    {/* GRID: levo (profil + sifra), desno (logovi) */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr",
        gap: 16,
        alignItems: "start",
      }}
    >
      {/* LEVA KOLONA */}
      <div style={{ display: "grid", gap: 16 }}>
        {/* Moj profil kartica */}
        <section
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            padding: 14,
            background: "rgba(255,255,255,0.75)",
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div>
              <span style={{ opacity: 0.7 }}>Email: </span>
              <b>{email || "-"}</b>
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>Rola: </span>
              <b>{role || "-"}</b>
            </div>
          </div>
        </section>

        {/* Promena šifre kartica */}
        <section
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            padding: 14,
            background: "rgba(255,255,255,0.75)",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
            Promena šifre
          </h2>

          <form
            onSubmit={changePassword}
            style={{ display: "grid", gap: 10, maxWidth: 420 }}
          >
            <input
              type="password"
              placeholder="Trenutna šifra"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />
            <input
              type="password"
              placeholder="Nova šifra"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />
            <input
              type="password"
              placeholder="Potvrdi novu šifru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid #171a6b",
                background: "#171a6b",
                color: "white",
                cursor: "pointer",
              }}
            >
              {saving ? "Menjam..." : "Promeni šifru"}
            </button>

            {err && <div style={{ color: "crimson" }}>{err}</div>}
            {msg && <div style={{ color: "green" }}>{msg}</div>}
          </form>
        </section>
      </div>

      {/* DESNA KOLONA: LOGOVI */}
      <section
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 12,
          padding: 14,
          background: "rgba(255,255,255,0.75)",
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
          Istorija izmena uređaja
        </h2>

        {loadingLogs ? (
          <div>Učitavam...</div>
        ) : logs.length === 0 ? (
          <div>Nema logova.</div>
        ) : (
          // samo OVAJ deo se skroluje, ne cela stranica
          <div
            style={{
              display: "grid",
              gap: 10,
              maxHeight: "520px",
              overflowY: "auto",
              paddingRight: 6,
            }}
          >
            {logs.map((l) => (
              <div
                key={l.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 10,
                  padding: 12,
                  background: "rgba(255,255,255,0.7)",
                }}
              >
                <div style={{ fontWeight: 700 }}>{l.message}</div>
                <div style={{ opacity: 0.7, fontSize: 13 }}>
                  {formatDate(l.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  </main>
);
}