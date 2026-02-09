"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Device = {
  id: number;
  name: string;
  status: boolean;
};

export default function RoomDetailsPage() {
  const params = useParams();
  const roomId = params.id;

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDevices() {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:4000/api/devices/room/${roomId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? "Greška pri učitavanju uređaja");
        return;
      }

      setDevices(data.devices ?? []);
    } catch {
      setError("Ne mogu da se povežem sa backendom");
    } finally {
      setLoading(false);
    }
  }

  async function toggleDevice(id: number) {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:4000/api/devices/${id}/toggle`, {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      loadDevices();
    } catch {}
  }

  useEffect(() => {
    loadDevices();
  }, [roomId]);

  return (
    <main>
      <h1>Uređaji u prostoriji</h1>

      {loading && <p>Učitavanje...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && devices.length === 0 && (
        <p>Nema uređaja u ovoj prostoriji.</p>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {devices.map((d) => (
          <div key={d.id} className="device-card">
            <h3 style={{ margin: 0 }}>{d.name}</h3>
            <p>Status: {d.status ? "Uključen" : "Isključen"}</p>
            <button onClick={() => toggleDevice(d.id)}>
                {d.status ? "Isključi":"Uključi"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
