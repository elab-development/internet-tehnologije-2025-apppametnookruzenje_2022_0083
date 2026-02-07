"use client";
import { useState } from "react";
export default function DashboardPage() {
const [lightOn, setLightOn] = useState(false);
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
</main>
  );
}