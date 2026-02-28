"use client";

import { useState } from "react";
import DeviceCard from "@/components/DeviceCard";
import Button from "../../components/Button";

type EnvironmentResponse = {
  city: string;
  location: { displayName: string; lat: number; lon: number };
  weather: { current: any | null };
  air: { current: any | null };
  recommendations: {
    acRecommendation?: { suggestedSetpointC: number; reason: string };
    ventilationRecommendation?: string;
    outsideRecommendation?: string;
    airSummary?: {
      level: string;
      message: string;
      pm2_5: number | null;
      pm10: number | null;
    };
  };
};

export default function DashboardPage() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EnvironmentResponse | null>(null);

  async function handleFetch() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Niste ulogovani. Ulogujte se ponovo.");
        return;
      }

      const res = await fetch(
        `http://localhost:4000/api/environment?city=${encodeURIComponent(city)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setError(json?.message ?? "Greška pri učitavanju podataka");
        return;
      }

      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Greška pri povezivanju sa backendom");
    } finally {
      setLoading(false);
    }
  }

  const weather = data?.weather?.current ?? null;
  const air = data?.air?.current ?? null;

  return (
    <main>
      {/*<h1>Dashboard</h1>
      <p>Pregled pametnog okruženja</p>*/}

      
      <DeviceCard title="Pretraga lokacije" status="Unesi grad za prikaz podataka">
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="npr. Pančevo, Beograd..."
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              minWidth: 260,
            }}
          />
          <Button onClick={handleFetch} disabled={!city || loading}>
            {loading ? "Učitavam..." : "Prikaži"}
          </Button>
        </div>

        {error && <p style={{ marginTop: 10, color: "#b91c1c" }}>{error}</p>}

        {data?.location && (
          <p style={{ marginTop: 10, opacity: 0.8 }}>
            Lokacija: {data.location.displayName} (lat: {data.location.lat}, lon:{" "}
            {data.location.lon})
          </p>
        )}
      </DeviceCard>

      
      <DeviceCard
        title="Vremenska prognoza (trenutno)"
        status={weather?.temperature_2m != null ? `${weather.temperature_2m}°C` : "—"}
      >
        <p>Temperatura: {weather?.temperature_2m ?? "—"} °C</p>
        <p>Vlažnost: {weather?.relative_humidity_2m ?? "—"} %</p>
        <p>Vetar: {weather?.wind_speed_10m ?? "—"} km/h</p>
      </DeviceCard>

      
      <DeviceCard
        title="Kvalitet vazduha (trenutno)"
        status={data?.recommendations?.airSummary?.level ?? "—"}
      >
        <p>PM2.5: {air?.pm2_5 ?? "—"} µg/m³</p>
        <p>PM10: {air?.pm10 ?? "—"} µg/m³</p>
        <p>NO2: {air?.nitrogen_dioxide ?? "—"} µg/m³</p>
        <p>O3: {air?.ozone ?? "—"} µg/m³</p>

        {data?.recommendations?.airSummary?.message && (
          <p style={{ marginTop: 10 }}>
            {data.recommendations.airSummary.message}
          </p>
        )}
      </DeviceCard>

      
      <DeviceCard title="Smart preporuke" status="Automatski predlog na osnovu spoljašnjih uslova">
        <p>
          <b>Preporučena temperatura klime:</b>{" "}
          {data?.recommendations?.acRecommendation?.suggestedSetpointC ?? "—"}°C
        </p>
        {data?.recommendations?.acRecommendation?.reason && (
          <p style={{ opacity: 0.85 }}>{data.recommendations.acRecommendation.reason}</p>
        )}

        <p style={{ marginTop: 10 }}>
          <b>Provetravanje:</b>{" "}
          {data?.recommendations?.ventilationRecommendation ?? "—"}
        </p>

        <p style={{ marginTop: 10 }}>
          <b>Izlazak napolje:</b>{" "}
          {data?.recommendations?.outsideRecommendation ?? "—"}
        </p>
      </DeviceCard>
    </main>
  );
}
