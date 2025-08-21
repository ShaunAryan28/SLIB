// backend/routes/seatroutes.js
const express = require("express");
const router = express.Router();
const Seat = require("../models/seat");
const jwt = require("jsonwebtoken");
const Student = require("../models/student"); // Import Student model

// ✅ Middleware: Check if user is admin
function verifyAdmin(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// 📌 GET all seats (public)
router.get("/", async (req, res) => {
  try {
    const seats = await Seat.find({});
    res.json(seats); // Always return an array
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching seats" });
  }
});

// 📌 Assign a seat (Admin only)
router.post("/assign", verifyAdmin, async (req, res) => {
  try {
    const { seat_id, student_id } = req.body;

    // 1. Verify student_id exists in the Student collection
    const student = await Student.findOne({ studentId: student_id });
    if (!student) {
      return res.status(404).json({ message: `Student with Roll No. ${student_id} not found.` });
    }

    // Check if student is already occupying a seat
    const existingOccupiedSeat = await Seat.findOne({ student_id });
    if (existingOccupiedSeat && existingOccupiedSeat.seat_id !== seat_id) {
      return res.status(400).json({ message: `Student ${student_id} is already occupying seat ${existingOccupiedSeat.seat_id}.` });
    }

    const seat = await Seat.findOne({ seat_id });
    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    if (seat.status === "occupied") {
      return res.status(400).json({ message: "Seat already occupied" });
    }

    seat.status = "occupied";
    seat.student_id = student_id;
    await seat.save();

    res.json({ message: "Seat assigned successfully", seat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error assigning seat" });
  }
});

// 📌 Free a seat (Admin only)
router.post("/free", verifyAdmin, async (req, res) => {
  try {
    const { seat_id } = req.body;

    const seat = await Seat.findOne({ seat_id });
    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    seat.status = "free";
    seat.student_id = null;
    await seat.save();

    res.json({ message: "Seat freed successfully", seat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error freeing seat" });
  }
});

// 📌 Clear all seats (Admin only)
router.post("/clear-all", verifyAdmin, async (req, res) => {
  try {
    await Seat.updateMany({ status: "occupied" }, { status: "free", student_id: null });
    res.json({ message: "All occupied seats have been cleared." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error clearing all seats" });
  }
});

module.exports = router;
