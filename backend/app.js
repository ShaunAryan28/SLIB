const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const seatRoutes = require("./routes/seatroutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/seats", seatRoutes);

module.exports = app;
