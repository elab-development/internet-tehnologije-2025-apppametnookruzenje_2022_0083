"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Room = {
  id: number;
  name: string;
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRooms() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:4000/api/rooms", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data?.message ?? "Greška pri učitavanju prostorija");
          return;
        }

        setRooms(data.rooms ?? []);
      } catch {
        setError("Ne mogu da se povežem sa backendom");
      } finally {
        setLoading(false);
      }
    }

    loadRooms();
  }, []);

  return (
    <main>
      <h1 style={{ marginBottom: 12 }}>Prostorije</h1>

      {loading && <p>Učitavanje...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && rooms.length === 0 && <p>Nema prostorija.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {rooms.map((r) => (
          <div key={r.id} className="device-card">
            <h3 style={{ margin: 0 }}>{r.name}</h3>
            <Link href={`/rooms/${r.id}`}>Otvori</Link>
          </div>
        ))}
      </div>
    </main>
  );
}

