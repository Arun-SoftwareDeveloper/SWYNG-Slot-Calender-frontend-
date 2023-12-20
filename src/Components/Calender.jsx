import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Calendar = ({ selectedDate, handleDateChange }) => {
  return (
    <Calendar
      onChange={handleDateChange}
      value={selectedDate}
      className="mb-4"
    />
  );
};

export default Calendar;
