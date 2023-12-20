import React from "react";

const AvailableSlots = ({ availableSlots, handleSlotSelect }) => {
  return (
    <div>
      <h2>Available Slots</h2>
      <ul className="list-group">
        {availableSlots.map((slot) => (
          <li
            key={slot._id}
            onClick={() => handleSlotSelect(slot)}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              {new Date(slot.date).toLocaleTimeString()} -{" "}
              {new Date(slot.endDateTime).toLocaleTimeString()}
            </span>
            <button
              className="btn btn-primary"
              onClick={() => handleSlotSelect(slot)}
            >
              Book
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableSlots;
