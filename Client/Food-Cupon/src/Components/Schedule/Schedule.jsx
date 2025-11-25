import React, { useEffect, useState } from "react";
import { Calendar, Clock, Pencil } from "lucide-react"; // ⭐ Pencil Icon
import { Link } from "react-router-dom";

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Event Schedule</h1>

        <div className="bg-gray-800 px-4 py-2 rounded-lg shadow-md text-gray-300 text-sm">
          Total Events:{" "}
          <span className="text-purple-400 font-bold">{events.length}</span>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-gray-400">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-400">No events available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 
                         transition-transform duration-200 hover:scale-[1.02] hover:border-purple-500"
            >
              {/* Clickable Title */}
              <Link to={`/schedule/${event.event_id}`} className="block mb-4">
                <h2 className="text-2xl font-semibold text-purple-400 flex items-center gap-2">
                  <Calendar size={22} /> {event.event_name}
                </h2>
              </Link>

              {/* Event Info */}
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-green-400" />
                  <span className="font-semibold">Start:</span>{" "}
                  {new Date(event.start_date).toLocaleDateString()}
                </p>

                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-red-400" />
                  <span className="font-semibold">End:</span>{" "}
                  {new Date(event.end_date).toLocaleDateString()}
                </p>
              </div>

              {/* Edit Button */}
              <div className="mt-4 flex justify-end">
                <Link
                  to={`/schedule/edit/${event.event_id}`}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 
                             text-white px-4 py-2 rounded-lg text-sm shadow-md"
                >
                  <Pencil size={16} />
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
