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
<button onClick={() => setTemperature(temperature + 1)}>
  Povećaj temperaturu 
</button>

<button onClick={() => setTemperature(temperature - 1)}>
Smanji temperaturu
</button>
</main>
  );
}