const express = require("express");

const router = express.Router();
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Provera rada servera
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server je aktivan
 */

router.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend radi" });
});

module.exports = router;
