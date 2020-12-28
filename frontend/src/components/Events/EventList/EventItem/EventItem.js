import React from "react";
import "./eventitem.css";

const EventItem = ({
  eventId,
  title,
  userId,
  creatorId,
  price,
  date,
  onDetail,
}) => {
  return (
    <React.Fragment>
      <li key={eventId} className="event-list-item">
        <div>
          <h1>{title}</h1>
          <h2>
            {price} - {new Date(date).toLocaleDateString()}
          </h2>
        </div>
        <div>
          {userId === creatorId ? (
            <p>You are the owner of this event</p>
          ) : (
            <button className="btn" onClick={() => onDetail(eventId)}>
              View Details
            </button>
          )}
        </div>
      </li>
    </React.Fragment>
  );
};

export default EventItem;
