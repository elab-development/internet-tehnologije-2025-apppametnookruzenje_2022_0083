const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

const devices = [
  { id: 1, name: "Svetlo", roomId: 1, status: false },
  { id: 2, name: "Klima", roomId: 1, status: true },
  { id: 3, name: "TV", roomId: 2, status: false }
];

router.get("/", requireAuth, (req, res) => {
  res.json({ devices });
});

router.get("/room/:roomId", requireAuth, (req, res) => {
  const roomId = Number(req.params.roomId);
  const roomDevices = devices.filter(d => d.roomId === roomId);

  res.json({ devices: roomDevices });
});

router.put("/:id/toggle", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const device = devices.find(d => d.id === id);

  if (!device) {
    return res.status(404).json({ message: "Uredjaj nije pronadjen" });
  }

  device.status = !device.status;
  res.json({ device });
});

module.exports = router;
