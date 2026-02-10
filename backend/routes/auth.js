const express = require("express");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();


 
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


    const user = await prisma.user.create({
      data: {
        email,
        password,
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


router.post("/login", async (req, res) => {
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


    if (password !== user.password) {
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
