"use client";
import { useState } from "react";
import DeviceCard from "@/components/DeviceCard";


export default function DashboardPage() {
const [lightOn, setLightOn] = useState(false);
const [temperature, setTemperature] = useState(22);
const [doorLocked, setDoorLocked] = useState(true);


  return (
    <main>
  <h1>Dashboard</h1>
  <p>Pregled pametnog okruženja</p>

 <DeviceCard
  title="Svetlo u dnevnoj sobi"
  status={lightOn ? "Uključeno" : "Isključeno"}
>
  <button onClick={() => setLightOn(!lightOn)}>
    {lightOn ? "Isključi svetlo" : "Uključi svetlo"}
  </button>
</DeviceCard>

  <DeviceCard
  title="Klima uređaj"
  status={`${temperature}°C`}
>
  <button
    onClick={() => {
      if (temperature < 30) setTemperature(temperature + 1);
    }}
  >
    Povećaj temperaturu
  </button>

  <button
    onClick={() => {
      if (temperature > 16) setTemperature(temperature - 1);
    }}
  >
    Smanji temperaturu
  </button>

  <p>Dozvoljeni opseg: 16°C – 30°C</p>
</DeviceCard>

<DeviceCard
  title="Pametna brava"
  status={doorLocked ? "Zaključano" : "Otključano"}
>
  <button onClick={() => setDoorLocked(!doorLocked)}>
    {doorLocked ? "Otključaj" : "Zaključaj"}
  </button>
</DeviceCard>

</main>
  );
}