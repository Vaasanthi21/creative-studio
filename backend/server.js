require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const companyRoutes = require("./routes/company.routes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Creative Studio OS backend is running");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend API is working",
    status: "success",
  });
});

app.use("/api/companies", companyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});