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

  const [activeMeal, setActiveMeal] = useState(null);
  const [showMealPicker, setShowMealPicker] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleScanClick = async (event) => {
    setSelectedEvent(event);
    
    // Try to find auto-meal
    try {
      const res = await fetch(`http://localhost:5000/events/${event.event_id}/details`);
      const data = await res.json();
      
      const now = new Date();
      const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const today = now.toISOString().split("T")[0];

      let currentMeal = null;
      if (data.meals) {
        // Find if any meal is happening NOW
        data.meals.forEach(day => {
          if (day.date === today) {
            day.meals.forEach(meal => {
              const [h1, m1, s1] = meal.start_time.split(":").map(Number);
              const [h2, m2, s2] = meal.end_time.split(":").map(Number);
              const start = h1 * 3600 + m1 * 60 + s1;
              const end = h2 * 3600 + m2 * 60 + s2;
              
              if (currentTime >= start && currentTime <= end) {
                currentMeal = meal;
              }
            });
          }
        });
      }

      if (currentMeal) {
        setActiveMeal(currentMeal);
        setShowScanner(true);
      } else {
        setShowMealPicker(true);
      }
    } catch (err) {
      setShowMealPicker(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] text-white">
      
      {/* Navbar */}
      <Navbar />

      {/* Content */}
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
                    Start: {new Date(event.start_date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={16} className="text-red-400" />
                    End: {new Date(event.end_date).toLocaleDateString()}
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
                    onClick={() => handleScanClick(event)}
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

      {/* Footer */}
      <Footer />

      {/* Meal Selection Modal */}
      {showMealPicker && selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMealPicker(false)}></div>
          <div className="relative bg-[#1a1a2e] border border-white/20 rounded-3xl p-8 shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Select Meal Session</h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setActiveMeal({ meal_id: "check_in", meal_name: "Check-In" });
                  setShowMealPicker(false);
                  setShowScanner(true);
                }}
                className="w-full p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition text-left flex justify-between items-center"
              >
                <span>🚀 Event Check-In</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Required</span>
              </button>
              
              <div className="py-2 flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Or Select Meal</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Dynamic meals could go here, but for now we'll fetch them if needed or show a fallback */}
              <p className="text-xs text-gray-400 text-center italic">Tip: Active meals are auto-selected</p>
              
              <button
                onClick={() => setShowMealPicker(false)}
                className="mt-4 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner */}
      {showScanner && (
        <QRScannerModal
          onClose={() => setShowScanner(false)}
          eventId={selectedEvent.event_id}
          activeMeal={activeMeal}
        />
      )}
    </div>
  );
}
