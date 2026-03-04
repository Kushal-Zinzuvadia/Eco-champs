const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(require("cors")({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("EcoChamps backend is running 🟢");
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/logs", require("./routes/logs"));
app.use("/api/users", userRoutes);
app.use("/api/challenges", require("./routes/challenges"));
app.use("/api/leaderboard", require("./routes/leaderboard"));
app.use("/api/community", require("./routes/community"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
