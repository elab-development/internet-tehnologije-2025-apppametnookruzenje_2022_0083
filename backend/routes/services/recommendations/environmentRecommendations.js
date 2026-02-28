function classifyAir(pm25, pm10) {
  if (pm25 == null) return { level: "UNKNOWN", advice: "Nema podataka o PM2.5." };

  if (pm25 < 15) return { level: "GOOD", advice: "Vazduh je dobar." };
  if (pm25 < 35) return { level: "MODERATE", advice: "Vazduh je umeren." };
  return { level: "BAD", advice: "Vazduh je loš." };
}

function suggestVentilation(airLevel) {
  if (airLevel === "BAD")
    return "Ne preporučuje se otvaranje prozora/vrata (zagađen vazduh).";
  if (airLevel === "MODERATE")
    return "Može kratko provetravanje (5–10 min), po mogućstvu kada je manji saobraćaj.";
  return "Preporučuje se provetravanje (10–15 min).";
}

function suggestGoingOutside(airLevel) {
  if (airLevel === "BAD") return "Ne preporučuje se duži boravak napolju.";
  if (airLevel === "MODERATE") return "Može napolje, ali izbegavaj intenzivnu aktivnost.";
  return "Uslovi su dobri za izlazak napolje.";
}

function suggestACSetpoint(outdoorTemp, humidity) {
  if (outdoorTemp == null)
    return { setpoint: 23, reason: "Nema spoljne temperature, koristi default 23°C." };

  if (outdoorTemp >= 30) return { setpoint: 24, reason: "Napolju je veoma toplo, postavi klimu na 24°C." };
  if (outdoorTemp >= 25) return { setpoint: 24, reason: "Napolju je toplo, preporuka 24°C." };
  if (outdoorTemp >= 18) return { setpoint: 23, reason: "Umereno vreme, preporuka 23°C." };
  if (outdoorTemp >= 10) return { setpoint: 22, reason: "Svežije je, preporuka 22°C." };
  return { setpoint: 21, reason: "Hladno je, preporuka 21°C (ne pregrevati)." };
}

function buildRecommendations({ weatherCurrent, airCurrent }) {
  const outdoorTemp = weatherCurrent?.temperature_2m ?? null;
  const humidity = weatherCurrent?.relative_humidity_2m ?? null;

  const pm25 = airCurrent?.pm2_5 ?? null;
  const pm10 = airCurrent?.pm10 ?? null;

  const air = classifyAir(pm25, pm10);
  const ac = suggestACSetpoint(outdoorTemp, humidity);

  return {
    acRecommendation: {
      suggestedSetpointC: ac.setpoint,
      reason: ac.reason,
    },
    ventilationRecommendation: suggestVentilation(air.level),
    outsideRecommendation: suggestGoingOutside(air.level),
    airSummary: {
      level: air.level,
      message: air.advice,
      pm2_5: pm25,
      pm10: pm10,
    },
  };
}

module.exports = { buildRecommendations };