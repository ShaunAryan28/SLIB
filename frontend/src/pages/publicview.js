import React, { useEffect, useState } from "react";
import API from "../services/api";
import SeatMap from "../components/seatmap";

function PublicView() {
  const [seats, setSeats] = useState([]);

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
    fetchSeats();
    const interval = setInterval(fetchSeats, 5000); // Poll every 5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Library Seat Availability</h2>
      <SeatMap seats={seats} />
    </div>
  );
}

export default PublicView;
