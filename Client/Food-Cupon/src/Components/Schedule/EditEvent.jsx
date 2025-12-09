// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function EditEvent() {
//   const { id } = useParams();

//   const [event, setEvent] = useState(null);
//   const [mealDays, setMealDays] = useState([]);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [tempMeals, setTempMeals] = useState([]); // Local meals (unsaved)
//   const [loading, setLoading] = useState(true);

//   // Fetch event and meals
//   useEffect(() => {
//     fetch(`http://localhost:5000/events/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setEvent(data.event);
//         setMealDays(data.meals);
//         setLoading(false);
//       })
//       .catch((err) => console.error("Error:", err));
//   }, [id]);

//   // Generate date range
//   const getDateRange = (start, end) => {
//     const dates = [];
//     let current = new Date(start);
//     const last = new Date(end);

//     while (current <= last) {
//       dates.push(current.toISOString().split("T")[0]);
//       current.setDate(current.getDate() + 1);
//     }
//     return dates;
//   };

//   const allDates = event ? getDateRange(event.start_date, event.end_date) : [];

//   // Add new blank meal row
//   const addMealRow = () => {
//     if (tempMeals.length >= 5) return alert("Maximum 5 meals allowed per day");
//     setTempMeals([...tempMeals, { meal_name: "", start_time: "", end_time: "" }]);
//   };

//   // Update meal input
//   const handleMealChange = (index, field, value) => {
//     const updatedMeals = [...tempMeals];
//     updatedMeals[index][field] = value;
//     setTempMeals(updatedMeals);
//   };

//   // Save meals to backend
//   const saveMealsToDB = () => {
//     if (!selectedDate) return alert("Select a date first");

//     fetch(`http://localhost:5000/events/${id}/meals/saveAll`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         date: selectedDate,
//         meals: tempMeals,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setMealDays(data.updatedMeals);
//         setTempMeals([]); // Clear local inputs after saving
//         alert("Meals saved successfully!");
//       })
//       .catch((err) => console.error("Save Error:", err));
//   };

//   if (loading) return <p className="text-gray-400 p-8">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">

//       <h1 className="text-3xl font-bold mb-6">Edit Event: {event.event_name}</h1>

//       {/* Date Selector */}
//       <div className="mb-6">
//         <label className="font-semibold">Select Date:</label>
//         <select
//           className="ml-3 p-2 bg-gray-800 rounded border border-gray-700"
//           value={selectedDate}
//           onChange={(e) => {
//             setSelectedDate(e.target.value);
//             setTempMeals([]); // Reset meals when changing date
//           }}
//         >
//           <option value="">Select a date</option>
//           {allDates.map((date) => (
//             <option key={date} value={date}>
//               {date}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Add Meal Rows - LOCAL (Before save) */}
//       {selectedDate && (
//         <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 w-full md:w-2/3">

//           <h3 className="text-xl font-semibold mb-4">Add Meals for {selectedDate}</h3>

//           {tempMeals.map((meal, index) => (
//             <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
//               <input
//                 type="text"
//                 placeholder="Meal Name"
//                 className="p-2 bg-gray-700 rounded"
//                 value={meal.meal_name}
//                 onChange={(e) => handleMealChange(index, "meal_name", e.target.value)}
//               />
//               <input
//                 type="time"
//                 className="p-2 bg-gray-700 rounded"
//                 value={meal.start_time}
//                 onChange={(e) => handleMealChange(index, "start_time", e.target.value)}
//               />
//               <input
//                 type="time"
//                 className="p-2 bg-gray-700 rounded"
//                 value={meal.end_time}
//                 onChange={(e) => handleMealChange(index, "end_time", e.target.value)}
//               />
//             </div>
//           ))}

//           <button
//             onClick={addMealRow}
//             disabled={tempMeals.length >= 5}
//             className={`px-4 py-2 rounded-lg mr-4 ${
//               tempMeals.length >= 5
//                 ? "bg-gray-600 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             + Add Meal
//           </button>

//           {tempMeals.length > 0 && (
//             <button
//               onClick={saveMealsToDB}
//               className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
//             >
//               Save Meals
//             </button>
//           )}
//         </div>
//       )}

//       {/* Display existing meals (Already saved meals) */}
//       {selectedDate && (
//         <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 w-full md:w-2/3">
//           <h3 className="text-lg font-semibold mb-4">Saved Meals for {selectedDate}</h3>

//           {mealDays.some((day) => day.date === selectedDate) ? (
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="text-purple-400 border-b border-gray-600">
//                   <th className="py-2">Meal Name</th>
//                   <th>Start Time</th>
//                   <th>End Time</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {mealDays
//                   .find((day) => day.date === selectedDate)
//                   .meals.map((meal, idx) => (
//                     <tr key={idx} className="border-b border-gray-700">
//                       <td className="py-2">{meal.meal_name}</td>
//                       <td>{meal.start_time}</td>
//                       <td>{meal.end_time}</td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           ) : (
//             <p className="text-gray-400">No meals saved yet for this date.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// ✅ SAFE DATE NORMALIZER
const normalizeDate = (date) =>
  typeof date === "string" ? date.slice(0, 10) : "";

export default function EditEvent() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [mealDays, setMealDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [tempMeals, setTempMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch event + meals
  const fetchEventDetails = () => {
    fetch(`http://localhost:5000/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data.event);
        setMealDays(data.meals || []);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  // ✅ Generate dates safely
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

  const allDates = event ? getDateRange(event.start_date, event.end_date) : [];

  // ✅ Add meal row
  const addMealRow = () => {
    if (tempMeals.length >= 5) return alert("Max 5 meals per day");
    setTempMeals([
      ...tempMeals,
      { meal_name: "", start_time: "", end_time: "" },
    ]);
  };

  // ✅ Handle input
  const handleMealChange = (index, field, value) => {
    const updated = [...tempMeals];
    updated[index][field] = value;
    setTempMeals(updated);
  };

  // ✅ Save meals
  const saveMealsToDB = () => {
    if (!selectedDate) return alert("Select a date");
    if (tempMeals.length === 0) return alert("Add at least one meal");

    fetch(`http://localhost:5000/events/${id}/meals/saveAll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedDate,
        meals: tempMeals,
      }),
    })
      .then(() => {
        setTempMeals([]);
        fetchEventDetails(); // ✅ REFRESH FROM BACKEND
      })
      .catch(console.error);
  };

  if (loading) return <p className="text-gray-400 p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      <h1 className="text-3xl font-bold mb-6">
        Edit Event: {event?.event_name}
      </h1>

      {/* ✅ Date Selector */}
      <div className="mb-6">
        <label className="font-semibold">Select Date:</label>
        <select
          className="ml-3 p-2 bg-gray-800 rounded border border-gray-700"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setTempMeals([]);
          }}
        >
          <option value="">Select a date</option>
          {allDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Add Meals */}
      {selectedDate && (
        <div className="bg-gray-800 p-6 rounded border border-gray-700 w-full md:w-2/3">

          <h3 className="text-xl font-semibold mb-4">
            Add Meals for {selectedDate}
          </h3>

          {tempMeals.map((meal, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-3 mb-3">
              <input
                className="p-2 bg-gray-700 rounded"
                placeholder="Meal"
                value={meal.meal_name}
                onChange={(e) =>
                  handleMealChange(idx, "meal_name", e.target.value)
                }
              />
              <input
                type="time"
                className="p-2 bg-gray-700 rounded"
                value={meal.start_time}
                onChange={(e) =>
                  handleMealChange(idx, "start_time", e.target.value)
                }
              />
              <input
                type="time"
                className="p-2 bg-gray-700 rounded"
                value={meal.end_time}
                onChange={(e) =>
                  handleMealChange(idx, "end_time", e.target.value)
                }
              />
            </div>
          ))}

          <button
            onClick={addMealRow}
            className="px-4 py-2 bg-blue-600 rounded mr-3"
          >
            + Add Meal
          </button>

          {tempMeals.length > 0 && (
            <button
              onClick={saveMealsToDB}
              className="px-6 py-2 bg-green-600 rounded"
            >
              Save Meals
            </button>
          )}
        </div>
      )}

      {/* ✅ Saved Meals */}
      {selectedDate && (
        <div className="mt-6 bg-gray-800 p-6 rounded border border-gray-700 w-full md:w-2/3">

          <h3 className="text-lg font-semibold mb-4">
            Saved Meals for {selectedDate}
          </h3>

          {mealDays.find((d) => normalizeDate(d.date) === selectedDate) ? (
            mealDays
              .find((d) => normalizeDate(d.date) === selectedDate)
              ?.meals.map((meal, idx) => (
                <div
                  key={idx}
                  className="flex justify-between bg-gray-700 p-2 mb-2 rounded"
                >
                  <span>{meal.meal_name}</span>
                  <span>
                    {meal.start_time.slice(0, 5)} -{" "}
                    {meal.end_time.slice(0, 5)}
                  </span>
                </div>
              ))
          ) : (
            <p className="text-gray-400">No meals saved for this date.</p>
          )}
        </div>
      )}
    </div>
  );
}

