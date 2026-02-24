"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

type Device = {
  id: number;
  name: string;
  isActive: boolean;
  temperature: number;
};

export default function RoomDetailsPage() {
  const params = useParams();

  const roomIdRaw = (params as any)?.id as string | string[] | undefined;
  const roomId = Array.isArray(roomIdRaw) ? roomIdRaw[0] : roomIdRaw;

  const [devices, setDevices] = useState<Device[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [openAcId, setOpenAcId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isChild = userRole === "CHILD";

  const loadDevices = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Nisi ulogovana (token ne postoji).");
        return;
      }

      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUserRole(parsed?.role ?? null);
        } catch {
          setUserRole(null);
        }
      }

      const res = await fetch(`http://localhost:4000/api/devices/room/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? "Greška pri učitavanju uređaja");
        return;
      }

      const receivedDevices: Device[] =
        data?.devices ?? data?.room?.devices ?? (Array.isArray(data) ? data : []);

      setDevices(receivedDevices);

      setOpenAcId((prev) => {
        if (prev == null) return null;
        const stillOn = receivedDevices.some(
          (x) => x.id === prev && x.isActive && x.name.toLowerCase().includes("klima")
        );
        return stillOn ? prev : null;
      });
    } catch {
      setError("Ne mogu da se povežem sa backendom.");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  async function toggleDevice(id: number) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`http://localhost:4000/api/devices/${id}/toggle`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.message ?? "Greška pri promeni statusa uređaja");
        return;
      }

      loadDevices();
    } catch {
      alert("Greška pri promeni statusa uređaja");
    }
  }

  async function updateTemperature(deviceId: number, temperature: number) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`http://localhost:4000/api/devices/${deviceId}/temperature`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ temperature }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.message ?? "Greška pri promeni temperature");
        return;
      }

      loadDevices();
    } catch {
      alert("Ne mogu da promenim temperaturu");
    }
  }

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const selectedAc =
    openAcId == null
      ? null
      : devices.find(
          (x) =>
            x.id === openAcId &&
            x.isActive &&
            x.name.toLowerCase().includes("klima")
        ) ?? null;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Uređaji u prostoriji</h1>

      {loading && <p>Učitavanje uređaja iz baze...</p>}
      {error && <p className="text-red-500 font-bold bg-red-50 p-3 rounded-lg">{error}</p>}

      {!loading && !error && devices.length === 0 && (
        <p className="text-gray-500">
          Ova soba je trenutno prazna. Dodajte uređaje.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((d) => {
          const isAc = d.name.toLowerCase().includes("klima");

          return (
            <div
              key={d.id}
              className="border p-5 rounded-2xl shadow-sm bg-white border-gray-200"
            >
              <h3 className="text-lg font-semibold">{d.name}</h3>

              <p className="text-sm text-gray-500 mb-4">
                Status:{" "}
                <span
                  className={
                    d.isActive ? "text-green-600 font-bold" : "text-red-600 font-bold"
                  }
                >
                  {d.isActive ? "UKLJUČEN" : "ISKLJUČEN"}
                </span>
              </p>

              <button
                onClick={() => toggleDevice(d.id)}
                className={`w-full py-2 rounded-xl font-medium transition ${
                  d.isActive
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                }`}
              >
                {d.isActive ? "Isključi" : "Uključi"}
              </button>

              {isAc && d.isActive && (
                <button
                  onClick={() => setOpenAcId(d.id)}
                  className="mt-2 w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
                >
                  Podesi temperaturu
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedAc && (
        <div className="mt-6 border rounded-2xl p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">{selectedAc.name}</h2>
              <p className="text-gray-500 text-sm">Kontrola temperature</p>
            </div>

            <button
              onClick={() => setOpenAcId(null)}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            >
              Zatvori
            </button>
          </div>

          <div className="text-sm text-gray-600">Trenutna temperatura:</div>
          <div className="text-4xl font-bold mb-6">{selectedAc.temperature}°C</div>

          <input
            type="range"
            min={16}
            max={30}
            value={selectedAc.temperature}
            disabled={isChild}
            onChange={(e) => {
              const next = Number(e.target.value);
              setDevices((prev) =>
                prev.map((x) => (x.id === selectedAc.id ? { ...x, temperature: next } : x))
              );
            }}
            onMouseUp={(e) => {
              const next = Number((e.target as HTMLInputElement).value);
              if (!isChild) updateTemperature(selectedAc.id, next);
            }}
            onTouchEnd={(e) => {
              const next = Number((e.target as HTMLInputElement).value);
              if (!isChild) updateTemperature(selectedAc.id, next);
            }}
            className="w-full"
          />

          <div className="mt-3 flex justify-between text-sm text-gray-500">
            <span>16°C</span>
            <span>30°C</span>
          </div>

          {isChild && (
            <p className="mt-4 text-sm text-gray-500">
              Možeš da vidiš podešavanja, ali ne možeš da menjaš temperaturu.
            </p>
          )}
        </div>
      )}
    </main>
  );
}