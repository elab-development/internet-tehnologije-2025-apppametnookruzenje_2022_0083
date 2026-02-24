const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/room/:roomId", requireAuth, async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    if (Number.isNaN(roomId)) {
      return res.status(400).json({ message: "Neispravan ID sobe" });
    }

    const devices = await prisma.device.findMany({
      where: { roomId },
      orderBy: { id: "asc" },
    });

    return res.json({ devices });
  } catch (err) {
    console.error("GET /api/devices/room/:roomId error:", err);
    return res.status(500).json({ message: "Greška pri učitavanju uređaja" });
  }
});

router.put("/:id/toggle", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Neispravan ID uređaja" });
    }

    const device = await prisma.device.findUnique({ where: { id } });
    if (!device) {
      return res.status(404).json({ message: "Uređaj nije pronađen" });
    }

    const updatedDevice = await prisma.device.update({
      where: { id },
      data: { isActive: !device.isActive },
    });

    return res.json({ device: updatedDevice });
  } catch (err) {
    console.error("PUT /api/devices/:id/toggle error:", err);
    return res.status(500).json({ message: "Greška pri promeni statusa uređaja" });
  }
});

router.put("/:id/temperature", requireAuth, requireRole("PARENT", "ADMIN"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const temperature = Number(req.body?.temperature);

    if (Number.isNaN(id) || Number.isNaN(temperature)) {
      return res.status(400).json({ message: "Neispravni podaci" });
    }

    if (temperature < 16 || temperature > 30) {
      return res.status(400).json({ message: "Temperatura mora biti između 16 i 30" });
    }

    const updated = await prisma.device.update({
      where: { id },
      data: { temperature },
    });

    return res.json({ device: updated });
  } catch (err) {
    console.error("PUT /api/devices/:id/temperature error:", err);
    return res.status(500).json({ message: "Greška pri promeni temperature" });
  }
});

module.exports = router;