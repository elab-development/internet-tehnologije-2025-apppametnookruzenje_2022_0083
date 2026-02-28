const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");


const { geocodeCity } = require("./services/external/nominatim.service");
const { fetchWeather } = require("./services/external/openMeteoWeather.service");
const { fetchAirQuality } = require("./services/external/openMeteoAir.service");
const { buildRecommendations } = require("./services/recommendations/environmentRecommendations");


router.get("/", requireAuth, async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ message: "city je obavezan" });

    const geo = await geocodeCity(city);
    if (!geo) return res.status(404).json({ message: "Grad nije pronađen" });

    const [weather, air] = await Promise.all([
      fetchWeather(geo.lat, geo.lon),
      fetchAirQuality(geo.lat, geo.lon),
    ]);

    const weatherCurrent = weather?.current ?? null;

    const airHourly = air?.hourly ?? null;
    const airCurrent = airHourly
      ? {
          pm2_5: airHourly.pm2_5?.[0] ?? null,
          pm10: airHourly.pm10?.[0] ?? null,
          nitrogen_dioxide: airHourly.nitrogen_dioxide?.[0] ?? null,
          ozone: airHourly.ozone?.[0] ?? null,
        }
      : null;

    const recommendations = buildRecommendations({ weatherCurrent, airCurrent });

    res.json({
      city: String(city),
      location: geo,
      weather: { current: weatherCurrent },
      air: { current: airCurrent },
      recommendations,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message ?? "Greška" });
  }
});

module.exports = router;