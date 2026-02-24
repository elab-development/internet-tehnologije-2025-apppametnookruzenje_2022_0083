
const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();


router.get("/", requireAuth, async (req, res) => {
  const rooms = await prisma.room.findMany();
  console.log("ROOMS FROM DB:", rooms);
  res.json({ rooms });
});



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

    res.json({ devices });
  } catch (err) {
    console.error("GET devices by room error:", err);
    res.status(500).json({ message: "Greška pri učitavanju uređaja" });
  }
});



router.put("/:id/toggle", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Neispravan ID uređaja" });
    }

    const device = await prisma.device.findUnique({
      where: { id },
    });

    if (!device) {
      return res.status(404).json({ message: "Uređaj nije pronađen" });
    }

    const updatedDevice = await prisma.device.update({
      where: { id },
      data: {
        status: !device.status,
      },
    });

    res.json({ device: updatedDevice });
  } catch (err) {
    console.error("Toggle device error:", err);
    res.status(500).json({ message: "Greška pri promeni statusa uređaja" });
  }
});


module.exports = router;
