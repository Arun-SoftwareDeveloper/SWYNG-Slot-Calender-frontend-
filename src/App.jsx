import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Alert } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faVideo,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";

const API_BASE_URL = "https://swing-slot-calender.onrender.com/slots";

const App = () => {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingInfo, setBookingInfo] = useState({
    email: "",
    name: "",
    phoneNumber: "",
    purpose: "",
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showHolidayAlert, setShowHolidayAlert] = useState(false);

  useEffect(() => {
    // Fetch available dates on component mount
    fetch(`${API_BASE_URL}/available-dates`)
      .then((response) => response.json())
      .then((data) => setAvailableDates(data.availableDates))
      .catch((error) =>
        console.error("Error fetching available dates:", error)
      );

    // Fetch available time slots
    fetch(`${API_BASE_URL}/available-time-slots`)
      .then((response) => response.json())
      .then((data) => setAvailableSlots(data.availableTimeSlots))
      .catch((error) =>
        console.error("Error fetching available time slots:", error)
      );
  }, []);

  const handleDateChange = (selectedDate) => {
    setSelectedDate(selectedDate);

    // Check if the selected date is Sunday (0) or Saturday (6)
    const dayOfWeek = selectedDate.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setShowHolidayAlert(true);
      return; // No need to fetch slots for holidays
    }

    setShowHolidayAlert(false);

    // Fetch available slots for the selected date
    fetch(
      `${API_BASE_URL}/available-slots/${
        selectedDate.toISOString().split("T")[0]
      }`
    )
      .then((response) => response.json())
      .then((data) => setAvailableSlots(data.availableSlots))
      .catch((error) =>
        console.error("Error fetching available slots:", error)
      );
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const handleBooking = () => {
    const { email, name, phoneNumber, purpose } = bookingInfo;

    // Validate form fields
    if (!email || !name || !phoneNumber || !purpose) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Check if the slot is already booked
    if (selectedSlot.booked) {
      toast.error("Slot is already booked.");
      setShowBookingModal(false);
      return;
    }

    // Book the selected slot
    fetch(
      `${API_BASE_URL}/book-slot/${selectedDate.toISOString().split("T")[0]}/${
        selectedSlot._id
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, phoneNumber, purpose }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error booking slot");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Slot booked successfully:", data.message);
        // Clear booking form fields
        setBookingInfo({
          email: "",
          name: "",
          phoneNumber: "",
          purpose: "",
        });
        setShowBookingModal(false);
        // Show success toast
        toast.success("Slot booked successfully");
      })
      .catch((error) => {
        console.error("Error booking slot:", error);
        // Show error toast
        toast.error("Error booking slot");
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Slot Booking App</h1>
      <div className="mb-4">
        {/* Discovery Call Information */}
        <div className="additional-container">
          <h2 className="additional-text">
            <FontAwesomeIcon icon={faVideo} className="mr-2" />
            Discovery Call
          </h2>
          <p className="additional-text">Arun Ramasamy</p>
          <p className="additional-text">
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            60 min
          </p>
          <p className="additional-text">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
            Web conferencing details provided upon confirmation.
          </p>
        </div>
        <label className="form-label">Select Date:</label>
        <input
          type="date"
          className="form-control"
          onChange={(e) => handleDateChange(new Date(e.target.value))}
          value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
        />
      </div>

      <div>
        <h2 style={{ color: "dodgerblue" }}>Available Slots</h2>
        {showHolidayAlert && (
          <Alert variant="warning">This day is a holiday!</Alert>
        )}
        <ul className="list-group">
          {availableSlots.map((slot) => (
            <li
              key={slot._id}
              onClick={() => handleSlotSelect(slot)}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                {new Date(slot.date).toLocaleDateString()} -{" "}
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {new Date(slot.endDateTime).toLocaleTimeString()}
              </span>
              <button
                className={`btn btn-primary ${slot.booked ? "disabled" : ""}`}
                onClick={() => handleSlotSelect(slot)}
                disabled={slot.booked}
              >
                {slot.booked ? "Booked" : "Book"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedSlot && (
        <div>
          <Modal
            show={showBookingModal}
            onHide={() => setShowBookingModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Book Slot</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bookingInfo.email}
                    onChange={(e) =>
                      setBookingInfo({
                        ...bookingInfo,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bookingInfo.name}
                    onChange={(e) =>
                      setBookingInfo({
                        ...bookingInfo,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bookingInfo.phoneNumber}
                    onChange={(e) =>
                      setBookingInfo({
                        ...bookingInfo,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Purpose:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bookingInfo.purpose}
                    onChange={(e) =>
                      setBookingInfo({
                        ...bookingInfo,
                        purpose: e.target.value,
                      })
                    }
                  />
                </div>
              </form>{" "}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={handleBooking}
                disabled={selectedSlot.booked}
              >
                Book Slot
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowBookingModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
