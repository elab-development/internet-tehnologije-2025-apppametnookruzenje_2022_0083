const express = require("express");
const cors = require("cors");
const usersRoutes = require("./routes/users");


require("dotenv").config();



const healthRoutes = require("./routes/health");
const authRoutes = require("./routes/auth");
const meRoutes = require("./routes/me");
const roomsRoutes = require("./routes/rooms");
const devicesRoutes = require("./routes/devices");






const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/devices", devicesRoutes);
app.use("/api/users", usersRoutes);






const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API radi na http://localhost:${PORT}`);
});
