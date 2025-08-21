require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const cors = require("cors");

const Seat = require("./models/seat"); // Import Seat model



const app = express();

app.use(cors());

app.use(express.json());



// Import routes

const authRoutes = require("./routes/authroutes");

const seatRoutes = require("./routes/seatroutes"); // Import seatroutes



// MongoDB connection

mongoose.connect(process.env.MONGO_URI, {

  useNewUrlParser: true,

useUnifiedTopology: true

})

.then(() => {

  console.log("✅ Connected to MongoDB");

  // Initialize seats if not already present

  initializeSeats();

})

.catch(err => console.error("❌ MongoDB connection error:", err));



const initializeSeats = async () => {

  const rows = 8;

  const cols = 12;

  const seatsToCreate = [];



  for (let r = 0; r < rows; r++) {

    for (let c = 0; c < cols; c++) {

      const seatId = `R${r + 1}C${c + 1}`;

      seatsToCreate.push({ seat_id: seatId, status: "free", student_id: null });

    }

  }



  try {

    for (const seatData of seatsToCreate) {

      // Use findOneAndUpdate with upsert to create if not exists, or do nothing if it does

      await Seat.findOneAndUpdate(

        { seat_id: seatData.seat_id },

        { $setOnInsert: { status: seatData.status, student_id: seatData.student_id } },

        { upsert: true, new: true, setDefaultsOnInsert: true }

      );

    }

    console.log("✅ Seats initialized or already exist in DB");

  } catch (err) {

    console.error("❌ Error initializing seats:", err);

  }

};



// Example route

// app.get("/api/seats", (req, res) => {

//   res.json({ message: "Seats route working!" });

// });



// Use auth routes

app.use("/api/auth", authRoutes);



// Use seat routes

app.use("/api/seats", seatRoutes); // Mount seat routes



// Start server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));