import React from "react";

const BookingForm = ({ bookingInfo, handleBooking, handleInputChange }) => {
  return (
    <div>
      <h2 className="mt-4">Book Selected Slot</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="text"
            className="form-control"
            value={bookingInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            value={bookingInfo.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number:</label>
          <input
            type="text"
            className="form-control"
            value={bookingInfo.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Purpose:</label>
          <input
            type="text"
            className="form-control"
            value={bookingInfo.purpose}
            onChange={(e) => handleInputChange("purpose", e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleBooking}
        >
          Book Slot
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
