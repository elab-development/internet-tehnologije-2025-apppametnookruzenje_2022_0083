const bcrypt = require("bcrypt");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const requireAuth = require("../middleware/requireAuth");

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Podaci o trenutno ulogovanom korisniku
 *     tags: [Me]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vraća podatke o korisniku
 *       401:
 *         description: Neautorizovan pristup
 */
router.get("/", requireAuth, (req, res) => {
  res.json({ message: "Ulogovan korisnik", user: req.user });
});

router.get("/logs", requireAuth, async (req, res) => {
  try {
    const userId = Number(req.user?.id || req.user?.userId);
        if (!Number.isFinite(userId)) {
      return res.status(401).json({ message: "Nisi autorizovan." });
    }


    const logs = await prisma.deviceLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { device: { select: { id: true, name: true } } },
    });

    return res.json({ logs });
  } catch (e) {
    return res.status(500).json({ message: "Greška pri učitavanju logova." });
  }
});

/**
 * @swagger
 * /api/me/password:
 *   put:
 *     summary: Promena lozinke korisnika
 *     tags: [Me]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lozinka uspešno promenjena
 *       400:
 *         description: Neispravni podaci
 *       401:
 *         description: Neautorizovan pristup
 */

router.put("/password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Nedostaju podaci." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Nova šifra se ne poklapa." });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: "Nova šifra je prekratka." });
    }

    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Nisi autorizovan." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Korisnik ne postoji." });
    }

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Trenutna šifra nije tačna." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return res.json({ message: "Šifra je uspešno promenjena." });
  } catch (e) {
    return res.status(500).json({ message: "Greška na serveru." });
  }
});

module.exports = router;