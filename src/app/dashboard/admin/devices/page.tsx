"use client";

import { useEffect, useMemo, useState } from "react";

type Room = {
  id: number;
  name: string;
};

type Device = {
  id: number;
  name: string;
  isActive?: boolean;
  temperature?: number;
  serialNumber?: string | null;
  roomId: number;
  room?: Room | null;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function AdminDevicesPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [filter, setFilter] = useState("");

  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState<number | "">("");
  const [temperature, setTemperature] = useState<string>("");
  const [serialNumber, setSerialNumber] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const me = await api("/api/me");
      const myRole = String(me?.user?.role || "").toUpperCase();
      if (myRole !== "ADMIN") {
        setError("Nemaš admin pristup.");
        setRooms([]);
        setDevices([]);
        setLoading(false);
        return;
      }

      const roomsRes = await api("/api/rooms");
      const roomsList = Array.isArray(roomsRes) ? roomsRes : roomsRes?.rooms;
      if (!Array.isArray(roomsList)) throw new Error("Neispravan format za sobe.");

      const devRes = await api("/api/devices");
      const devList = Array.isArray(devRes) ? devRes : devRes?.devices;
      if (!Array.isArray(devList)) throw new Error("Neispravan format za uređaje.");

      setRooms(roomsList);
      setDevices(devList);

      if (roomId === "" && roomsList.length > 0) {
        setRoomId(roomsList[0].id);
      }
    } catch (e: any) {
      setError(e?.message || "Greška pri učitavanju.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return devices;

    return devices.filter((d) => {
      return (
        String(d.name || "").toLowerCase().includes(q) ||
        String(d.id).includes(q) ||
        String(d.room?.name || "").toLowerCase().includes(q)
      );
    });
  }, [devices, filter]);

  const handleAdd = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (!name.trim()) throw new Error("Unesi naziv uređaja.");
      if (roomId === "") throw new Error("Izaberi sobu.");

      const body: any = {
        name: name.trim(),
        roomId,
      };

      if (temperature.trim() !== "") body.temperature = Number(temperature);
      if (serialNumber.trim() !== "") body.serialNumber = serialNumber.trim();

      const createdRes = await api("/api/devices", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const created = createdRes?.device;
      if (!created) throw new Error("Uređaj je dodat, ali odgovor nije očekivan.");

      setDevices((prev) => [created, ...prev].sort((a, b) => a.id - b.id));

      setName("");
      setTemperature("");
      setSerialNumber("");

      setSuccessMsg("Uređaj je dodat.");
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (e: any) {
      setError(e?.message || "Greška pri dodavanju.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Da li si sigurna da želiš da obrišeš uređaj?");
    if (!ok) return;

    setDeletingId(id);
    setError(null);
    setSuccessMsg(null);

    try {
      await api(`/api/devices/${id}`, { method: "DELETE" });
      setDevices((prev) => prev.filter((d) => d.id !== id));
      setSuccessMsg("Uređaj je obrisan.");
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (e: any) {
      setError(e?.message || "Greška pri brisanju.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Uređaji</h1>
          {/*<p className="text-sm text-black/70">Dodavanje i brisanje uređaja (ADMIN).</p>*/}
        </div>

        {/*<button
          onClick={loadAll}
          className="rounded-xl px-4 py-2 font-medium bg-white/70 hover:bg-white border border-black/10"
        >
          Osveži
        </button>*/}
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
        <div className="font-semibold mb-4">Dodaj uređaj</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium mb-1">Naziv</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-2 outline-none"
              placeholder="npr. Klima"
            />
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Soba</div>
            <select
              value={roomId}
              onChange={(e) => setRoomId(Number(e.target.value))}
              className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-2 outline-none"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Temperatura (opciono)</div>
            <input
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-2 outline-none"
              placeholder="16 - 30"
            />
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Serijski broj (opciono)</div>
            <input
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-2 outline-none"
              placeholder="npr. SN-123"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleAdd}
            disabled={saving || loading}
            className={[
              "rounded-xl px-4 py-2 font-medium transition",
              saving || loading
                ? "bg-black/20 text-black/60"
                : "bg-[#171a6b] text-white hover:opacity-95",
            ].join(" ")}
          >
            {saving ? "Dodavanje..." : "Dodaj"}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Pretraga po nazivu, sobi ili ID..."
          className="w-full md:w-96 rounded-xl border border-black/10 bg-white/70 px-4 py-2 outline-none"
        />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white/50 backdrop-blur-md overflow-hidden">
        <div className="px-5 py-4 border-b border-black/10 font-semibold">
          Lista uređaja
        </div>

        {loading ? (
          <div className="p-5">Učitavanje...</div>
        ) : filtered.length === 0 ? (
          <div className="p-5">Nema uređaja za prikaz.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-black/70">
                <tr className="border-b border-black/10">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Naziv</th>
                  <th className="px-5 py-3">Soba</th>
                  <th className="px-5 py-3">Aktivan</th>
                  <th className="px-5 py-3">Temperatura</th>
                  <th className="px-5 py-3">Akcija</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const disabled = deletingId === d.id;
                  return (
                    <tr key={d.id} className="border-b border-black/5">
                      <td className="px-5 py-3 font-medium">{d.id}</td>
                      <td className="px-5 py-3">{d.name}</td>
                      <td className="px-5 py-3">{d.room?.name || d.roomId}</td>
                      <td className="px-5 py-3">{d.isActive ? "DA" : "NE"}</td>
                      <td className="px-5 py-3">
                                {String(d.name).toLowerCase().includes("klima")
                                    ? `${d.temperature}°C`
                                    : ""}
                                </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleDelete(d.id)}
                          disabled={disabled}
                          className={[
                            "rounded-xl px-4 py-2 font-medium transition",
                            disabled
                              ? "bg-black/20 text-black/60"
                              : "bg-red-600 text-white hover:opacity-95",
                          ].join(" ")}
                        >
                          {disabled ? "Brisanje..." : "Obriši"}
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