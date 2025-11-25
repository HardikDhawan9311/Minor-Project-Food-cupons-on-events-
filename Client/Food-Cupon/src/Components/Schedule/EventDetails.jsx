import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [mealDays, setMealDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(1);

  // Fetch event + meals on page load
  useEffect(() => {
    fetch(`http://localhost:5000/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data.event);
        setMealDays(data.meals);
        setStatus(data.event.enabled);
        setLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  }, [id]);

  // 🟢 Fetch meals again when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      fetch(`http://localhost:5000/events/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setMealDays(data.meals);
        })
        .catch((err) => console.error("Error fetching meals:", err));
    }
  }, [selectedDate, id]);

  // Toggle event enabled/disabled
  const toggleEvent = () => {
    fetch(`http://localhost:5000/events/${id}/toggle`, { method: "PUT" })
      .then((res) => res.json())
      .then(() => {
        setStatus(status === 1 ? 0 : 1);
      })
      .catch((err) => console.error("Toggle Error:", err));
  };

  // Generate dates between start and end
  const getDateRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const last = new Date(end);

    while (current <= last) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  if (loading) return <p className="text-gray-400 p-8">Loading...</p>;
  if (!event) return <p className="text-gray-400 p-8">Event not found</p>;

  const allDates = getDateRange(event.start_date, event.end_date);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{event.event_name}</h1>

        <button
          onClick={toggleEvent}
          className={`px-4 py-2 rounded-lg font-semibold transition 
            ${status === 1 ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
        >
          {status === 1 ? "Disable Event" : "Enable Event"}
        </button>
      </div>

      {/* Event Status Badge */}
      <div className="mb-6">
        <span
          className={`px-3 py-1 text-sm rounded-lg 
            ${status === 1 ? "bg-green-600" : "bg-red-600"}`}
        >
          {status === 1 ? "Event Active — QR Allowed" : "Event Disabled — QR Blocked"}
        </span>
      </div>

      {/* Event Dates */}
      <p className="text-gray-300 mb-6">
        <b>Start:</b> {event.start_date} &nbsp; | &nbsp;
        <b>End:</b> {event.end_date}
      </p>

      {/* Date Dropdown */}
      <div className="mb-6">
        <label className="font-semibold">Select Date:</label>
        <select
          className="ml-3 p-2 bg-gray-800 rounded border border-gray-700"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option value="">Select a date</option>
          {allDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {/* Meal Display */}
      {selectedDate && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 w-full md:w-2/3">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">
            Meal Schedule for {selectedDate}
          </h2>

          {mealDays.some((d) => d.date.slice(0, 10) === selectedDate) ? (
            mealDays
              .filter((d) => d.date.slice(0, 10) === selectedDate)
              .map((day) => (
                <div key={day.date} className="space-y-3 text-gray-300">
                  {day.meals.map((meal, index) => (
                    <div
                      key={index}
                      className="flex justify-between bg-gray-700 p-3 rounded-lg border border-gray-600"
                    >
                      <span className="font-semibold">{meal.meal_name}</span>
                      <span>{meal.start_time?.slice(0,5)} - {meal.end_time?.slice(0,5)}</span>
                    </div>
                  ))}
                </div>
              ))
          ) : (
            <p className="text-gray-400">No meals scheduled for this date.</p>
          )}
        </div>
      )}
    </div>
  );
}
