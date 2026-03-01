const cors = require('cors');
const helmet = require("helmet");
const express = require("express");

const usersRoutes = require("./routes/users");
const environmentRoutes = require("./routes/environment");

require("dotenv").config();



const healthRoutes = require("./routes/health");
const authRoutes = require("./routes/auth");
const meRoutes = require("./routes/me");
const roomsRoutes = require("./routes/rooms");
const devicesRoutes = require("./routes/devices");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");


const app = express();
const isTest = process.env.NODE_ENV === "test";
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); 
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(helmet({ contentSecurityPolicy: false }));

app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/devices", devicesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/environment", environmentRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err, req, res, next) => {
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS blokirao zahtev" });
  }
  next(err);
});



const PORT = process.env.PORT || 4000;

if (!isTest) {
  app.listen(PORT, () => {
    console.log(`API radi na portu ${PORT}`);
  });
}


module.exports = app;

