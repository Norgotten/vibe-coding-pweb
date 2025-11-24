const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const reportRoutes = require("./routes/reportRoutes");
const authRoutes = require("./routes/authRoutes"); // <--- ini

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ message: "KoMpor API nyala 😎" });
});

// auth
app.use("/api/auth", authRoutes);
// report
app.use("/api/reports", reportRoutes);

app.listen(PORT, () => {
  console.log(`Server KoMpor jalan di http://localhost:${PORT}`);
});
