const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();


router.put("/:id/role", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { role } = req.body;

    if (!Number.isFinite(userId)) {
      return res.status(400).json({ message: "Neispravan id korisnika" });
    }
    if (!role) {
      return res.status(400).json({ message: "Nedostaje role u body-ju" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "Korisnik nije pronađen" });

    const roleEntity = await prisma.role.findUnique({ where: { name: role } });
    if (!roleEntity) return res.status(400).json({ message: "Nepostojeća uloga" });

 
    if (req.user.id === userId) {
      return res.status(400).json({ message: "Ne možete menjati svoju ulogu" });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { roleId: roleEntity.id },
      select: { id: true, email: true, role: { select: { name: true } } },
    });

    return res.json({ message: "Uloga je promenjena", user: updated });
  } catch (e) {
    return res.status(500).json({ message: "Greška na serveru" });
  }
});

module.exports = router;
