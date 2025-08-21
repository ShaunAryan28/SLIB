// frontend/src/components/HelpDesk.js
import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import SeatMap from "../components/seatmap"; // Import SeatMap component

function HelpDesk() {
  const [seatId, setSeatId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]); // Add state for seats
  const [selectedSeatId, setSelectedSeatId] = useState(null); // New state for selected seat

  const fetchSeats = async () => {
    try {
      const res = await API.get("/seats");
      if (Array.isArray(res.data)) {
        setSeats(res.data);
      } else {
        console.error("Seats API did not return an array:", res.data);
        setSeats([]);
      }
    } catch (err) {
      console.error("Error fetching seats:", err);
      setSeats([]);
    }
  };

  useEffect(() => {
    // Note: Global authentication check is now in App.js
    fetchSeats(); // Fetch seats on component mount
    const interval = setInterval(fetchSeats, 5000); // Poll every 5 sec
    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // Empty dependency array means this runs once on mount

  const handleRequest = async (endpoint, payload) => {
    setLoading(true);
    try {
      const res = await API.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(res.data.message);
      fetchSeats(); // Refresh seats after assignment/freeing
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired, please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatId) => {
    setSelectedSeatId(seatId);
    setSeatId(seatId); // Automatically populate the Seat ID input
  };

  const assignSeat = () => {
    if (!selectedSeatId || !studentId) return alert("Seat and Student ID required");
    handleRequest("/seats/assign", { seat_id: selectedSeatId, student_id: studentId });
  };

  const freeSeat = () => {
    if (!selectedSeatId) return alert("Seat ID required");
    handleRequest("/seats/free", { seat_id: selectedSeatId });
  };

  const clearAllSeats = () => {
    if (window.confirm("Are you sure you want to clear all seats?")) {
      handleRequest("/seats/clear-all", {});
    }
  };

  return (
    <div>
      <h2>🔒 Admin Seat Management</h2>
      <div style={{ marginBottom: "20px" }}>
        <SeatMap seats={seats} onSeatClick={handleSeatClick} selectedSeatId={selectedSeatId} />
      </div>
      <div className="helpdesk-controls-container">
        <input
          placeholder="Seat ID"
          value={seatId}
          onChange={(e) => setSeatId(e.target.value)}
          readOnly // Make it read-only as it's populated by click
          className="helpdesk-input helpdesk-spacing"
        />
        <input
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="helpdesk-input helpdesk-spacing"
        />
        <button onClick={assignSeat} disabled={loading} className="helpdesk-button helpdesk-spacing">
          {loading ? "Assigning..." : "Assign Seat"}
        </button>
        <button onClick={freeSeat} className="helpdesk-button helpdesk-spacing" disabled={loading}>
          {loading ? "Freeing..." : "Free Seat"}
        </button>
        <button onClick={clearAllSeats} className="helpdesk-button helpdesk-button-red helpdesk-spacing" disabled={loading}>
          {loading ? "Clearing..." : "Clear All Seats"}
        </button>
      </div>
    </div>
  );
}

export default HelpDesk;
