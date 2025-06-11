const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();
connectDB();

app.use(express.json());
app.use(require("cors")());

app.get("/", (req, res) => {
  res.send("EcoChamps backend is running 🟢");
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/logs", require("./routes/logs"));
app.use("/api/users", userRoutes);
app.use("/api/challenges", require("./routes/challenges"));
app.use("/api/leaderboard", require("./routes/leaderboard"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
