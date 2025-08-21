import React, { useEffect, useState } from "react";
import API from "../services/api";
import SeatMap from "../components/seatmap";

function PublicView() {
  const [seats, setSeats] = useState([]);
  const [freeSeats, setFreeSeats] = useState(0);

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

  useEffect(() => {
    // Update the free seats count whenever the seats array changes
    const count = seats.filter(seat => seat.status === 'free').length;
    setFreeSeats(count);
  }, [seats]);

  return (
    <div>
      <h2>Library Seat Availability</h2>
      <p>Free Seats: {freeSeats}</p>
      <SeatMap seats={seats} />
    </div>
  );
}

export default PublicView;