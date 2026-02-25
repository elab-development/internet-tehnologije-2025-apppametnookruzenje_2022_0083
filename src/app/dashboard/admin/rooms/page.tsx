"use client";

import { useEffect, useMemo, useState } from "react";

type Room = {
  id: number;
  name: string;
  devices?: { id: number }[];
};

const BACKEND_URL = "http://localhost:4000";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [filter, setFilter] = useState("");
  const [newName, setNewName] = useState("");

  const [editName, setEditName] = useState("");

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
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
      const msg = (data && (data.message || data.error)) || `Greška ${res.status}`;
      throw new Error(msg);
    }

    return data;
  };

  const loadRooms = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const me = await api("/api/me");
      const myRole = String(me?.user?.role || "").toUpperCase();
      if (myRole !== "ADMIN") {
        setError("Nemaš admin pristup.");
        setRooms([]);
        setLoading(false);
        return;
      }

      const data = await api("/api/rooms");
      const list = Array.isArray(data) ? data : data?.rooms;
      if (!Array.isArray(list)) throw new Error("Neispravan format za sobe.");

      setRooms(list);
    } catch (e: any) {
      setError(e?.message || "Greška pri učitavanju.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rooms;
    return rooms.filter((r) => String(r.name).toLowerCase().includes(q) || String(r.id).includes(q));
  }, [rooms, filter]);

  const addRoom = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (!newName.trim()) throw new Error("Unesi naziv sobe.");

      const res = await api("/api/rooms", {
        method: "POST",
        body: JSON.stringify({ name: newName.trim() }),
      });

      const created = res?.room;
      if (!created) throw new Error("Soba je dodata, ali odgovor nije očekivan.");

      setRooms((prev) => [...prev, created].sort((a, b) => a.id - b.id));
      setNewName("");

      setSuccessMsg("Soba je dodata.");
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (e: any) {
      setError(e?.message || "Greška pri dodavanju.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (room: Room) => {
    setEditingId(room.id);
    setEditName(room.name);
    setError(null);
    setSuccessMsg(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (id: number) => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (!editName.trim()) throw new Error("Naziv sobe ne može biti prazan.");

      const res = await api(`/api/rooms/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name: editName.trim() }),
      });

      const updated = res?.room;
      if (!updated) throw new Error("Izmena je uspešna, ali odgovor nije očekivan.");

      setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, name: updated.name } : r)));
      setEditingId(null);
      setEditName("");

      setSuccessMsg("Soba je izmenjena.");
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (e: any) {
      setError(e?.message || "Greška pri izmeni.");
    } finally {
      setSaving(false);
    }
  };

  const deleteRoom = async (id: number) => {
    const ok = window.confirm("Da li si sigurna da želiš da obrišeš sobu?");
    if (!ok) return;

    setDeletingId(id);
    setError(null);
    setSuccessMsg(null);

    try {
      await api(`/api/rooms/${id}`, { method: "DELETE" });
      setRooms((prev) => prev.filter((r) => r.id !== id));

      setSuccessMsg("Soba je obrisana.");
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (e: any) {
      setError(e?.message || "Greška pri brisanju.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sobe</h1>
 
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

      <div className="rounded-2xl border border-black/10 bg-white/50 backdrop-blur-md p-5 mb-6">
        <div className="font-semibold mb-4">Dodaj sobu</div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full md:w-96 rounded-xl border border-black/10 bg-white/70 px-4 py-2 outline-none"
            placeholder="npr. Dnevna soba"
          />
          <button
            onClick={addRoom}
            disabled={saving || loading}
            className={[
              "rounded-xl px-4 py-2 font-medium transition",
              saving || loading ? "bg-black/20 text-black/60" : "bg-[#171a6b] text-white hover:opacity-95",
            ].join(" ")}
          >
            {saving ? "Dodavanje..." : "Dodaj"}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Pretraga soba..."
          className="w-full md:w-96 rounded-xl border border-black/10 bg-white/70 px-4 py-2 outline-none"
        />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white/50 backdrop-blur-md overflow-hidden">
        <div className="px-5 py-4 border-b border-black/10 font-semibold">Lista soba</div>

        {loading ? (
          <div className="p-5">Učitavanje...</div>
        ) : filtered.length === 0 ? (
          <div className="p-5">Nema soba za prikaz.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-black/70">
                <tr className="border-b border-black/10">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Naziv</th>
                  <th className="px-5 py-3">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const isEditing = editingId === r.id;
                  const isDeleting = deletingId === r.id;

                  return (
                    <tr key={r.id} className="border-b border-black/5">
                      <td className="px-5 py-3 font-medium">{r.id}</td>

                      <td className="px-5 py-3">
                        {isEditing ? (
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full max-w-md rounded-xl border border-black/10 bg-white/70 px-4 py-2 outline-none"
                          />
                        ) : (
                          r.name
                        )}
                      </td>

                      <td className="px-5 py-3">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(r.id)}
                              disabled={saving}
                              className={[
                                "rounded-xl px-4 py-2 font-medium transition",
                                saving ? "bg-black/20 text-black/60" : "bg-[#171a6b] text-white hover:opacity-95",
                              ].join(" ")}
                            >
                              Sačuvaj
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="rounded-xl px-4 py-2 font-medium bg-white/70 hover:bg-white border border-black/10"
                            >
                              Otkaži
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(r)}
                              className="rounded-xl px-4 py-2 font-medium bg-white/70 hover:bg-white border border-black/10"
                            >
                              Preimenuj
                            </button>
                            <button
                              onClick={() => deleteRoom(r.id)}
                              disabled={isDeleting}
                              className={[
                                "rounded-xl px-4 py-2 font-medium transition",
                                isDeleting ? "bg-black/20 text-black/60" : "bg-red-600 text-white hover:opacity-95",
                              ].join(" ")}
                            >
                              {isDeleting ? "Brisanje..." : "Obriši"}
                            </button>
                          </div>
                        )}
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