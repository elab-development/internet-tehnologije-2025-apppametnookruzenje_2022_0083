const rateLimit = require("express-rate-limit");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Previše pokušaja prijave. Pokušajte kasnije." },
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registracija korisnika
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: nova@gmail.com
 *               password:
 *                 type: string
 *                 example: test123
 *               roleName:
 *                 type: string
 *                 example: PARENT
 *     responses:
 *       201:
 *         description: Uspešna registracija
 *       409:
 *         description: Korisnik već postoji
 */

router.post("/register", async (req, res) => {
  try {
    const { email, password, roleName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Nedostaju podaci" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "Korisnik već postoji" });
    }


    const role =
      (roleName &&
        (await prisma.role.findUnique({ where: { name: roleName } }))) ||
      (await prisma.role.findUnique({ where: { name: "PARENT" } }));

    if (!role) {
      return res.status(400).json({
        message: "Rola ne postoji u bazi (proveri seed Role tabele)",
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId: role.id,
      },
      include: { role: true },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Korisnik registrovan",
      token,
      user: { id: user.id, email: user.email, role: user.role.name },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Greška na serveru" });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login korisnika
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: sara@gmail.com
 *               password:
 *                 type: string
 *                 example: sara
 *     responses:
 *       200:
 *         description: Uspešan login
 *       401:
 *         description: Pogrešan email ili lozinka
 */

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Nedostaju podaci" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

 
    if (!user) {
      return res.status(401).json({ message: "Pogrešan email ili lozinka" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Pogrešan email ili lozinka" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Uspešna prijava",
      token,
      user: { id: user.id, email: user.email, role: user.role.name },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Greška na serveru" });
  }
});


router.post("/logout", (req, res) => {
  return res.json({ message: "Logout uspešan" });
});

module.exports = router;


