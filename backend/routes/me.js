const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  res.json({ message: "Ulogovan korisnik", user: req.user });
});

module.exports = router;
