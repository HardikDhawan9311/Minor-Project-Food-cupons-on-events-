import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [mealDays, setMealDays] = useState([]); // { date: "...", meals: [{meal_name, meal_time}] }
  const [selectedDate, setSelectedDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(1); // enabled/disabled flag

  // Fetch event + meals
  useEffect(() => {
    fetch(`http://localhost:5000/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data.event);
        setMealDays(data.meals); // dynamic meals structure
        setStatus(data.event.enabled);
        setLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  }, [id]);

  // Toggle event enabled/disabled
  const toggleEvent = () => {
    fetch(`http://localhost:5000/events/${id}/toggle`, { method: "PUT" })
      .then((res) => res.json())
      .then(() => {
        setStatus(status === 1 ? 0 : 1);
      })
      .catch((err) => console.error("Toggle Error:", err));
  };

  if (loading) return <p className="text-gray-400 p-8">Loading...</p>;
  if (!event) return <p className="text-gray-400 p-8">Event not found</p>;

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
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option value="">Select a date</option>

          {mealDays.map((day) => (
            <option key={day.date} value={day.date}>
              {day.date}
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

          {mealDays
            .filter((d) => d.date === selectedDate)
            .map((day) => (
              <div key={day.date} className="space-y-2 text-gray-300">
                
                {/* Dynamic Rendering of All Meals */}
                {day.meals.length === 0 && (
                  <p className="text-gray-400">No meals scheduled for this date.</p>
                )}

                {day.meals.map((meal, index) => (
                  <p key={index}>
                    <b>{meal.meal_name}:</b> {meal.meal_time}
                  </p>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
