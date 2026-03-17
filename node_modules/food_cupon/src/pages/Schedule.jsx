import React, { useEffect, useState } from "react";
import { Calendar, Clock, Pencil, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import QRScannerModal from "../components/QRScannerModal";

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] text-white">
      
      {/* 🔹 Navbar */}
      <Navbar />

      {/* 🔹 Content */}
      <main className="flex-1 px-6 py-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
          <h1 className="text-4xl font-bold">📅 Event Schedule</h1>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 shadow-lg">
            <p className="text-gray-300 text-sm">Total Events</p>
            <p className="text-3xl font-bold text-[#C77DFF]">
              {events.length}
            </p>
          </div>
        </div>

        {/* Events */}
        {loading ? (
          <p className="text-gray-300">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-300">No events available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.event_id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition"
              >
                {/* Title */}
                <Link to={`/schedule/${event.event_id}`}>
                  <h2 className="text-2xl font-semibold text-[#C77DFF] flex items-center gap-2 mb-4">
                    <Calendar size={22} />
                    {event.event_name}
                  </h2>
                </Link>

                {/* Dates */}
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center gap-2">
                    <Clock size={16} className="text-green-400" />
                    Start:{" "}
                    {new Date(event.start_date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={16} className="text-red-400" />
                    End:{" "}
                    {new Date(event.end_date).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">
                  <Link
                    to={`/schedule/edit/${event.event_id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7F5AF0] to-[#C77DFF] hover:scale-105 transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>

                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowScanner(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition"
                  >
                    <QrCode size={16} />
                    Scan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 🔹 Footer */}
      <Footer />

      {/* 🔹 QR Scanner */}
      {showScanner && (
        <QRScannerModal
          onClose={() => setShowScanner(false)}
          onScan={(value) => {
            console.log("Scanned:", value);
            setShowScanner(false);
          }}
        />
      )}
    </div>
  );
}
