"use client";

import { useEffect, useMemo, useState } from "react";

type UserRow = {
  id: number;
  email: string;
  role?: { name: string } | null;
  roleName?: string | null;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "PARENT" | "CHILD">("ALL");

  const [selectedRoles, setSelectedRoles] = useState<Record<number, "ADMIN" | "PARENT" | "CHILD">>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  const getUserRoleName = (u: any) => {
  return String(u.role?.name || u.roleName || u.role || "").toUpperCase();
};

  const api = async (path: string, options?: RequestInit) => {
    const token = getToken();
    if (!token) throw new Error("Nisi ulogovana (token ne postoji).");

    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options?.headers || {}),
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const msg =
        (data && (data.message || data.error)) ||
        `Greška ${res.status}`;
      throw new Error(msg);
    }

    return data;
  };

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
        const me = await api("/api/me");
        const myRole = String(me?.user?.role || "").toUpperCase();

        if (myRole !== "ADMIN") {
        setError("Nemaš admin pristup.");
        setUsers([]);
        setLoading(false);
        return;
        }

      const data = await api("/api/users");
      const list = Array.isArray(data) ? data : data?.users;

      if (!Array.isArray(list)) {
        throw new Error("Neispravan format odgovora za korisnike.");
      }

      setUsers(list);

      const initial: Record<number, "ADMIN" | "PARENT" | "CHILD"> = {};
      for (const u of list) {
        const role = getUserRoleName(u);
        if (role === "ADMIN" || role === "PARENT" || role === "CHILD") {
          initial[u.id] = role;
        }
      }
      setSelectedRoles(initial);
    } catch (e: any) {
      setError(e?.message || "Greška pri učitavanju.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();

    return users.filter((u) => {
      const role = getUserRoleName(u);
      const passesRole = roleFilter === "ALL" ? true : role === roleFilter;
      const passesText =
        q.length === 0
          ? true
          : String(u.email || "").toLowerCase().includes(q) ||
            String(u.id).includes(q);

      return passesRole && passesText;
    });
  }, [users, filter, roleFilter]);

  const saveRole = async (userId: number) => {
    setSavingId(userId);
    setError(null);
    setSuccessMsg(null);

    try {
      const newRole = selectedRoles[userId];
      if (!newRole) throw new Error("Izaberi ulogu.");

      await api(`/api/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ roleName: newRole }),
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                role: u.role ? { ...u.role, name: newRole } : { name: newRole },
                roleName: newRole,
              }
            : u
        )
      );

      setSuccessMsg("Uloga je uspešno izmenjena.");
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (e: any) {
      setError(e?.message || "Greška pri čuvanju.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Korisnici</h1>
          <p className="text-sm text-black/70">
            Pregled korisnika i izmena uloge.
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="rounded-xl px-4 py-2 font-medium bg-white/70 hover:bg-white border border-black/10"
        >
          Osveži
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Pretraga po email-u ili ID..."
          className="w-full md:w-80 rounded-xl border border-black/10 bg-white/70 px-4 py-2 outline-none"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="w-full md:w-56 rounded-xl border border-black/10 bg-white/70 px-4 py-2 outline-none"
        >
          <option value="ALL">Sve uloge</option>
          <option value="ADMIN">ADMIN</option>
          <option value="PARENT">PARENT</option>
          <option value="CHILD">CHILD</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-800">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 rounded-xl border border-green-600/30 bg-green-600/10 px-4 py-3 text-green-900">
          {successMsg}
        </div>
      )}

      <div className="rounded-2xl border border-black/10 bg-white/50 backdrop-blur-md overflow-hidden">
        <div className="px-5 py-4 border-b border-black/10 font-semibold">
          Lista korisnika
        </div>

        {loading ? (
          <div className="p-5">Učitavanje...</div>
        ) : filtered.length === 0 ? (
          <div className="p-5">Nema korisnika za prikaz.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-black/70">
                <tr className="border-b border-black/10">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Uloga</th>
                  <th className="px-5 py-3">Akcija</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const currentRole = getUserRoleName(u);
                  const selected = selectedRoles[u.id] || (currentRole as any) || "PARENT";
                  const disabled = savingId === u.id;

                  return (
                    <tr key={u.id} className="border-b border-black/5">
                      <td className="px-5 py-3 font-medium">{u.id}</td>
                      <td className="px-5 py-3">{u.email}</td>
                      <td className="px-5 py-3">
                        <select
                          value={selected}
                          onChange={(e) =>
                            setSelectedRoles((prev) => ({
                              ...prev,
                              [u.id]: e.target.value as any,
                            }))
                          }
                          className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 outline-none"
                          disabled={disabled}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="PARENT">PARENT</option>
                          <option value="CHILD">CHILD</option>
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => saveRole(u.id)}
                          disabled={disabled}
                          className={[
                            "rounded-xl px-4 py-2 font-medium transition",
                            disabled
                              ? "bg-black/20 text-black/60"
                              : "bg-[#171a6b] text-white hover:opacity-95",
                          ].join(" ")}
                        >
                          {disabled ? "Čuvanje..." : "Sačuvaj"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}