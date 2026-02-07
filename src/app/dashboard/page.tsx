"use client";
import { useState } from "react";
export default function DashboardPage() {
const [lightOn, setLightOn] = useState(false);
const [temperature, setTemperature] = useState(22);


  return (
    <main>
  <h1>Dashboard</h1>
  <p>Pregled pametnog okruženja</p>

  <h2>Svetlo u dnevnoj sobi</h2>
  

  <p>
    Status: {lightOn ? "Uključeno" : "Isključeno"}
  </p>

  <button onClick={() => setLightOn(!lightOn)}>
    {lightOn ? "Isključi svetlo" : "Uključi svetlo"}
  </button>

  <h3>Klima uređaj</h3>

<p>Temperatura: {temperature}°C</p>
<p>Dozvoljeni opseg: 16°C – 30°C</p>

<button
  onClick={() => {
    if (temperature < 30) {
      setTemperature(temperature + 1);
    }
  }}
>
  Povećaj temperaturu
</button>

<button
  onClick={() => {
    if (temperature > 16) {
      setTemperature(temperature - 1);
    }
  }}
>
  Smanji temperaturu
</button>

</main>
  );
}