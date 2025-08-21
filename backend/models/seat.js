const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seat_id: { type: String, required: true, unique: true },
  status: { type: String, enum: ["free", "occupied"], default: "free" },
  student_id: { type: String, default: null }
});

// Check if model already exists before compiling to prevent OverwriteModelError
module.exports = mongoose.models.Seat || mongoose.model("Seat", seatSchema);
