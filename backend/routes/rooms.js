const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

const rooms = [
  { id: 1, name: "Dnevna soba" },
  { id: 2, name: "Kuhinja" },
  { id: 3, name: "Spavaća soba" }
];

router.get("/", requireAuth, (req, res) => {
  res.json({ rooms });
});

router.get("/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const room = rooms.find(r => r.id === id);

  if (!room) {
    return res.status(404).json({ message: "Prostorija nije pronađena" });
  }

  res.json({ room });
});

module.exports = router;
