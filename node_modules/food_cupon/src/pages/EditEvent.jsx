import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { Calendar, Plus, Save } from "lucide-react";

const normalizeDate = (d) => (typeof d === "string" ? d.slice(0, 10) : "");

export default function EditEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [mealDays, setMealDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [tempMeals, setTempMeals] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/events/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setEvent(d.event);
        setMealDays(d.meals || []);
      });
  }, [id]);

  const getDateRange = (s, e) => {
    const d = [];
    let c = new Date(s);
    const l = new Date(e);
    while (c <= l) {
      d.push(c.toISOString().slice(0, 10));
      c.setDate(c.getDate() + 1);
    }
    return d;
  };

  const allDates = event ? getDateRange(event.start_date, event.end_date) : [];

  const addMealRow = () => {
    if (tempMeals.length >= 5) return;
    setTempMeals([...tempMeals, { meal_name: "", start_time: "", end_time: "" }]);
  };

  const handleMealChange = (i, f, v) => {
    const m = [...tempMeals];
    m[i][f] = v;
    setTempMeals(m);
  };

  const saveMeals = () => {
    if (!selectedDate || tempMeals.length === 0) return;

    fetch(`http://localhost:5000/events/${id}/meals/saveAll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: selectedDate, meals: tempMeals }),
    }).then(() => setTempMeals([]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-14">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold mb-2">
            🛠 Edit Event — {event?.event_name}
          </h1>
          <p className="text-gray-300">
            Configure meals day-wise for this event
          </p>
        </div>

        {/* DATE SELECT */}
        <div className="flex items-center gap-4">
          <Calendar className="text-[#C77DFF]" />
          <select
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setTempMeals([]);
            }}
            className="bg-white/10 px-5 py-3 rounded-full outline-none border border-white/20"
          >
            <option value="">Select date</option>
            {allDates.map((d) => (
              <option key={d} value={d} className="text-black">
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* ADD MEALS */}
        {selectedDate && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
              🍽 Add Meals for {selectedDate}
            </h2>

            {tempMeals.map((m, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <input
                  placeholder="Meal name"
                  className="bg-white/10 p-3 rounded-xl outline-none"
                  value={m.meal_name}
                  onChange={(e) =>
                    handleMealChange(i, "meal_name", e.target.value)
                  }
                />
                <input
                  type="time"
                  className="bg-white/10 p-3 rounded-xl"
                  value={m.start_time}
                  onChange={(e) =>
                    handleMealChange(i, "start_time", e.target.value)
                  }
                />
                <input
                  type="time"
                  className="bg-white/10 p-3 rounded-xl"
                  value={m.end_time}
                  onChange={(e) =>
                    handleMealChange(i, "end_time", e.target.value)
                  }
                />
              </div>
            ))}

            <div className="flex gap-4">
              <button
                onClick={addMealRow}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 hover:bg-white/30"
              >
                <Plus size={16} /> Add Meal
              </button>

              {tempMeals.length > 0 && (
                <button
                  onClick={saveMeals}
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#7F5AF0] to-[#C77DFF]"
                >
                  <Save size={16} /> Save Meals
                </button>
              )}
            </div>
          </div>
        )}

        {/* SAVED MEALS */}
        {selectedDate && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">📋 Saved Meals</h2>

            {mealDays.find((d) => normalizeDate(d.date) === selectedDate) ? (
              <div className="space-y-3">
                {mealDays
                  .find((d) => normalizeDate(d.date) === selectedDate)
                  .meals.map((m, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-white/10 px-6 py-4 rounded-xl"
                    >
                      <span className="font-medium">{m.meal_name}</span>
                      <span className="text-gray-300">
                        {m.start_time.slice(0, 5)} – {m.end_time.slice(0, 5)}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-400">No meals added yet.</p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
