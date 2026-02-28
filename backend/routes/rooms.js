const requireRole = require("../middleware/requireRole");
const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Lista soba
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Vraća listu soba
 */

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
        isActive: !device.isActive,
      },
    });

    res.json({ device: updatedDevice });
  } catch (err) {
    console.error("Toggle device error:", err);
    res.status(500).json({ message: "Greška pri promeni statusa uređaja" });
  }
});

router.post("/", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Naziv sobe je obavezan" });
    }

    const created = await prisma.room.create({
      data: { name: String(name).trim() },
    });

    return res.status(201).json({ message: "Soba dodata", room: created });
  } catch (err) {
    return res.status(500).json({ message: "Greška pri dodavanju sobe" });
  }
});

router.patch("/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Neispravan ID sobe" });
    }
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Naziv sobe je obavezan" });
    }

    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      return res.status(404).json({ message: "Soba nije pronađena" });
    }

    const updated = await prisma.room.update({
      where: { id },
      data: { name: String(name).trim() },
    });

    return res.json({ message: "Soba izmenjena", room: updated });
  } catch (err) {
    return res.status(500).json({ message: "Greška pri izmeni sobe" });
  }
});

router.delete("/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Neispravan ID sobe" });
    }

    const room = await prisma.room.findUnique({
      where: { id },
      include: { devices: true },
    });

    if (!room) {
      return res.status(404).json({ message: "Soba nije pronađena" });
    }

    if (room.devices.length > 0) {
      return res.status(400).json({ message: "Ne možeš obrisati sobu koja ima uređaje" });
    }

    await prisma.room.delete({ where: { id } });

    return res.json({ message: "Soba obrisana" });
  } catch (err) {
    return res.status(500).json({ message: "Greška pri brisanju sobe" });
  }
});

module.exports = router;
