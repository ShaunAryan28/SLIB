import React from "react";

function SeatMap({ seats, onSeatClick, selectedSeatId }) {
  //console.log("SeatMap props: ", { onSeatClick, selectedSeatId }); // Add this line
  
  // seats should be an array of objects: { seat_id, status }

  const rows = 8;   // library rows
  const cols = 12;  // library columns

  // create empty grid with placeholders
  const seatGrid = [];
  for (let r = 0; r < rows; r++) {
    const rowSeats = [];
    for (let c = 0; c < cols; c++) {
      const seatId = `R${r + 1}C${c + 1}`; // Seat naming: R1C1, R1C2, etc.
      const seat = seats.find((s) => s.seat_id === seatId);

      rowSeats.push(
        <div
          key={seatId}
          style={{
            width: "50px",
            height: "50px",
            margin: "4px",
            backgroundColor: seat?.status === "occupied"
              ? "red"
              : (selectedSeatId === seatId ? "yellow" : "green"), // Highlight selected
            color: "white",
            fontSize: "0.7rem", /* Smaller font size for responsiveness */
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            cursor: "pointer",
            flexShrink: 0, /* Prevent seats from shrinking too much */
            minWidth: "40px", /* Minimum width for smaller screens */
            minHeight: "40px", /* Minimum height for smaller screens */
            maxWidth: "50px", /* Maximum width for larger screens */
            maxHeight: "50px", /* Maximum height for larger screens */
            flexBasis: "calc(100% / 12 - 8px)", /* Distribute seats evenly in a row, considering margin */
          }}
          onClick={() => onSeatClick && onSeatClick(seatId)} // Conditionally call onClick
        >
          {seatId}
        </div>
      );
    }
    seatGrid.push(
      <div key={r} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}> {/* Ensure row wraps and centers */}
        {rowSeats}
      </div>
    );
  }

  return (
    <div className="seatmap-container">
      <h3>Library Seat Map (8 x 12)</h3>
      {seatGrid}
    </div>
  );
}

export default SeatMap;
