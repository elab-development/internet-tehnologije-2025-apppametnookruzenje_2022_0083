const express = require("express");

const router = express.Router();

/*router.get("/register", (req, res) => {
  res.json({ message: "Register endpoint postoji" });
});*/


router.post("/register", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Nedostaju podaci" });
  }

  res.json({
    message: "Korisnik registrovan",
    user: {
      email,
      role: role || "PARENT"
    }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Nedostaju podaci" });
  }

  res.json({
    message: "Uspešna prijava",
    user: {
      email,
      role: "PARENT"
    },
    token: "fake-jwt-token"
  });
});

module.exports = router;
