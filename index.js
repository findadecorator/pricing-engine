const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder (if used)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const pricingRoutes = require("./src/routes/pricing.routes");
const decoratorRoutes = require("./src/routes/decorators.routes");
const messageRoutes = require("./src/routes/messages.routes");
const adsRoutes = require("./src/routes/ads.routes");
const creditsRoutes = require("./src/routes/credits.routes");

app.use("/api/pricing", pricingRoutes);
app.use("/api/decorators", decoratorRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/credits", creditsRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Backend running", timestamp: Date.now() });
});

// Correct Railway port handling
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
