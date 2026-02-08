const express = require("express");
const cors = require("cors");
require("dotenv").config();

const healthRoutes = require("./routes/health");
const authRoutes = require("./routes/auth");
const meRoutes = require("./routes/me");


const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API radi na http://localhost:${PORT}`);
});
