const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const Student = require("../models/student"); // Import Student model

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
  const { username, password } = req.body; // username here will be the roll number

  console.log("Login Attempt:", { username, password }); // Log incoming data

  try {
    let authenticatedUser = null;
    let userRole = null;

    // 🔹 Attempt Admin Login First
    // Check hardcoded admin
    if (username === "101" && password === "123456") {
      console.log("Attempting hardcoded admin login");
      authenticatedUser = { id: "hardcoded_admin_id", username: "admin_default", adminId: "101" };
      userRole = "admin";
    } else {
      // Check DB admins using adminId
      const admin = await Admin.findOne({ adminId: username });
      if (admin) {
        console.log("Found admin:", admin.username, "with Admin ID:", admin.adminId);
        const isMatch = await admin.comparePassword(password);
        console.log("Admin password match result:", isMatch);
        if (isMatch) {
          authenticatedUser = admin;
          userRole = "admin";
        } else {
          // If adminId found but password doesn't match, it's an invalid admin login
          return res.status(400).json({ message: "Invalid credentials for Admin" });
        }
      }
    }

    // 🔹 If not authenticated as Admin, attempt Student Login
    if (!authenticatedUser) {
      const student = await Student.findOne({ studentId: username }); // Find by studentId
      if (student) {
        console.log("Found student:", student.username, "with Student ID:", student.studentId);
        const isStudentMatch = await student.comparePassword(password);
        console.log("Student password match result:", isStudentMatch);
        if (isStudentMatch) {
          authenticatedUser = student;
          userRole = "student";
        } else {
          // If studentId found but password doesn't match, it's an invalid student login
          return res.status(400).json({ message: "Invalid credentials for Student" });
        }
      } else {
        // If username (rollNo) doesn't match any admin or student ID
        return res.status(400).json({ message: "User not found or Invalid credentials" });
      }
    }

    // Generate token and respond based on role
    let tokenPayload;
    if (userRole === "admin") {
      tokenPayload = { id: authenticatedUser._id || authenticatedUser.id, role: "admin", adminId: authenticatedUser.adminId };
    } else if (userRole === "student") {
      tokenPayload = { id: authenticatedUser._id, role: "student", studentId: authenticatedUser.studentId };
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: authenticatedUser._id || authenticatedUser.id,
        username: authenticatedUser.username,
        role: userRole,
        ...(userRole === "admin" && { adminId: authenticatedUser.adminId }),
        ...(userRole === "student" && { studentId: authenticatedUser.studentId }),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Student Registration
router.post("/register", async (req, res) => {
  const { username, studentId, password } = req.body; // Destructure studentId

  console.log("Register Attempt:", { username, studentId, password }); // Log incoming data

  try {
    let student = await Student.findOne({ username });
    if (student) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if studentId already exists
    const existingStudentId = await Student.findOne({ studentId });
    if (existingStudentId) {
      return res.status(400).json({ message: "Student ID already exists" });
    }

    student = new Student({ username, studentId, password }); // Pass studentId to constructor
    console.log("Before Save - Hashed Password:", student.password); // Log hashed password before save
    await student.save();

    res.status(201).json({ message: "Student registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
