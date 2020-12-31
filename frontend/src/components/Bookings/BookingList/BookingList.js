import React from "react";
import "./bookinglist.css";

const BookingList = ({ bookings, onDelete }) => {
  return (
    <ul className="bookings-list">
      {bookings.map((booking) => {
        return (
          <li key={booking._id} className="bookings-item">
            <div className="bookings-item-data">
              {booking.event.title} -{" "}
              {new Date(booking.createdAt).toLocaleDateString()}
            </div>
            <div className="bookings-item-actions">
              <button className="btn" onClick={() => onDelete(booking._id)}>
                Cancel
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BookingList;
