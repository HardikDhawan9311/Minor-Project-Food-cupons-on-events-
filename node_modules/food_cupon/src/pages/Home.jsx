import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { Gift, CalendarDays } from "lucide-react";

export default function Home() {
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventData, setEventData] = useState({
    event_name: "",
    start_date: "",
    end_date: "",
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:5000/events");
    const data = await res.json();
    setEvents(data || []);
  };

  const handleChange = (e) =>
    setEventData({ ...eventData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/events/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
    setShowEventForm(false);
    setEventData({ event_name: "", start_date: "", end_date: "" });
    fetchEvents();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] text-white">
      <Navbar />

      <main className="flex-1 px-6 py-14 flex flex-col items-center text-center">

        {/* HERO */}
        {!showEventForm && (
          <>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              Hackathon Event Management 🎯
            </h1>
            <p className="text-gray-300 max-w-xl mb-10">
              Create, schedule, and manage hackathon events seamlessly.
            </p>

            <button
              onClick={() => setShowEventForm(true)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#7F5AF0] to-[#C77DFF] font-semibold hover:scale-105 transition flex gap-2 items-center"
            >
              <Gift size={18} />
              Create Event
            </button>

            {/* FEATURES */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl">
              {[
                { icon: Gift, title: "Event Creation" },
                { icon: CalendarDays, title: "Scheduling" },
                { icon: CalendarDays, title: "Database Connected" },
              ].map((f, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-105 transition"
                >
                  <f.icon size={40} className="mx-auto text-[#C77DFF]" />
                  <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
                  <p className="text-gray-300 mt-2 text-sm">
                    Secure and reliable hackathon management.
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* EVENT FORM */}
        {showEventForm && (
          <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">Create New Event 🎉</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="event_name"
                placeholder="Event Name"
                value={eventData.event_name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/15 text-white placeholder-gray-300 focus:ring-2 focus:ring-[#7F5AF0] outline-none"
              />
              <input
                type="date"
                name="start_date"
                value={eventData.start_date}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/15 text-white focus:ring-2 focus:ring-[#7F5AF0] outline-none"
              />
              <input
                type="date"
                name="end_date"
                value={eventData.end_date}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/15 text-white focus:ring-2 focus:ring-[#7F5AF0] outline-none"
              />

              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7F5AF0] to-[#C77DFF] font-semibold">
                Save Event
              </button>

              <button
                type="button"
                onClick={() => setShowEventForm(false)}
                className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 transition"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* EVENTS LIST */}
        <div className="w-full max-w-6xl mt-20">
          <h2 className="text-3xl font-bold mb-8">📅 Upcoming Events</h2>

          {events.length === 0 ? (
            <p className="text-gray-400">No events yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => (
                <div
                  key={e.event_id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:scale-105 transition"
                >
                  <h3 className="text-xl font-semibold">{e.event_name}</h3>
                  <p className="text-gray-300 mt-2">
                    📆 {new Date(e.start_date).toLocaleDateString()} →{" "}
                    {new Date(e.end_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>



      </main>

      <Footer />
    </div>
  );
}
