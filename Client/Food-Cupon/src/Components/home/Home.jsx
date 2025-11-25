// import React, { useState } from "react";
// import Navbar from "./NavBar";
// import Footer from "./Footer";
// import { QrCode, Utensils, Gift } from "lucide-react";
// import QrReader  from "react-qr-reader-es6"; // ✅ Modern QR Reader for React 18

// export default function Home() {
//   const [showScanner, setShowScanner] = useState(false);
//   const [scanResult, setScanResult] = useState("");

//   // Handle successful scan
//   const handleScan = (result) => {
//     if (result) {
//       setScanResult(result?.text || result);
//     }
//   };

//   // Handle camera access error
//   const handleError = (err) => {
//     console.error("Camera Error:", err);
//     alert("Unable to access the camera. Please allow camera permissions.");
//   };

//   return (
//     <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
//       {/* Navbar */}
//       <Navbar />

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col items-center text-center px-6 py-10">
//         {!showScanner ? (
//           <>
//             {/* Hero Section */}
//             <div className="max-w-3xl">
//               <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-700 mb-4">
//                 College Hackathon Food Coupon System 🍽️
//               </h1>
//               <p className="text-gray-700 text-lg mb-8">
//                 Welcome to the{" "}
//                 <span className="font-semibold text-purple-600">
//                   Hackathon Food Coupon Management Portal
//                 </span>{" "}
//                 — a centralized system to manage food coupons digitally for
//                 hackathon participants, coordinators, and volunteers.
//               </p>

//               <div className="flex justify-center">
//                 <button
//                   onClick={() => setShowScanner(true)}
//                   className="px-8 py-3 text-lg rounded-lg shadow-md bg-purple-600 text-white hover:bg-purple-700 transition flex items-center gap-2"
//                 >
//                   <QrCode size={20} />
//                   Start Scan
//                 </button>
//               </div>
//             </div>

//             {/* Features Section */}
//             <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl">
//               {[
//                 {
//                   icon: <Utensils className="text-pink-500" size={40} />,
//                   title: "Digital Meal Passes",
//                   desc: "Provide digital food passes for hackathon participants.",
//                 },
//                 {
//                   icon: <QrCode className="text-purple-500" size={40} />,
//                   title: "QR Code Verification",
//                   desc: "Quickly scan and validate coupons to ensure transparency.",
//                 },
//                 {
//                   icon: <Gift className="text-yellow-500" size={40} />,
//                   title: "Organized Management",
//                   desc: "Simplify meal tracking for all hackathon days.",
//                 },
//               ].map((feature, index) => (
//                 <div
//                   key={index}
//                   className="p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition flex flex-col items-center text-center gap-3"
//                 >
//                   {feature.icon}
//                   <h3 className="text-xl font-semibold text-gray-700">
//                     {feature.title}
//                   </h3>
//                   <p className="text-gray-500">{feature.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           // Scanner Section
//           <div className="flex flex-col items-center gap-6 mt-10">
//             <div className="w-80 h-80 border-4 border-dashed border-purple-400 rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
//               <QrReader
//                 constraints={{ facingMode: "environment" }}
//                 onResult={(result, error) => {
//                   if (!!result) handleScan(result);
//                   if (!!error) console.info(error);
//                 }}
//                 videoStyle={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                 }}
//               />
//             </div>

//             {scanResult && (
//               <p className="text-lg font-semibold text-green-600 mt-4">
//                 ✅ Scanned Code: {scanResult}
//               </p>
//             )}

//             <button
//               onClick={() => setShowScanner(false)}
//               className="px-6 py-2 text-white bg-purple-500 rounded-lg shadow-md hover:bg-purple-600 transition"
//             >
//               Back
//             </button>
//           </div>
//         )}
//       </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { Gift, CalendarDays } from "lucide-react";

export default function Home() {
  const [showEventForm, setShowEventForm] = useState(false);

  // Form data state
  const [eventData, setEventData] = useState({
    event_name: "",
    start_date: "",
    end_date: "",
  });

  // Store events fetched from DB
  const [events, setEvents] = useState([]);

  // Fetch events when component loads
  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to fetch all events
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/events");
      const data = await response.json();

      if (Array.isArray(data)) {
        // Sort by nearest start date
        const sortedEvents = data.sort(
          (a, b) => new Date(a.start_date) - new Date(b.start_date)
        );
        setEvents(sortedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("🎉 Event Created Successfully!");
        setEventData({ event_name: "", start_date: "", end_date: "" });
        setShowEventForm(false);
        fetchEvents(); // Refresh event list
      } else {
        alert("❌ Failed: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <Navbar />

      <main className="flex-1 flex flex-col items-center text-center px-6 py-10">
        {!showEventForm ? (
          <>
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-700 mb-4">
                College Hackathon Event Management 🎯
              </h1>
              <p className="text-gray-700 text-lg mb-8">
                Create and manage hackathon events with ease.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowEventForm(true)}
                  className="px-8 py-3 text-lg rounded-lg shadow-md bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Gift size={20} />
                  Create Event
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl">
              {[
                {
                  icon: <Gift className="text-red-500" size={40} />,
                  title: "Event Creation",
                  desc: "Set up hackathon events easily.",
                },
                {
                  icon: <CalendarDays className="text-purple-500" size={40} />,
                  title: "Schedule Events",
                  desc: "Choose start and end dates for events.",
                },
                {
                  icon: <CalendarDays className="text-blue-500" size={40} />,
                  title: "Database Ready",
                  desc: "Fully connected with MySQL event table.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition flex flex-col items-center text-center gap-3"
                >
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-700">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-10 w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-purple-700 text-center">
              🎉 Create New Event
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="event_name"
                value={eventData.event_name}
                onChange={handleChange}
                placeholder="Event Name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
                required
              />

              <input
                type="date"
                name="start_date"
                value={eventData.start_date}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
                required
              />

              <input
                type="date"
                name="end_date"
                value={eventData.end_date}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
                required
              />

              <button
                type="submit"
                className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Save Event
              </button>

              <button
                type="button"
                onClick={() => setShowEventForm(false)}
                className="w-full py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* 🔹 Display Events Before Footer */}
        <div className="w-full max-w-5xl mt-16 mb-20">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
            📅 Upcoming Events
          </h2>

          {events.length === 0 ? (
            <p className="text-gray-600">No events scheduled yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.event_id}
                  className="p-5 bg-white shadow-lg rounded-xl hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {event.event_name}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    📆 {new Date(event.start_date).toLocaleDateString()} ➝{" "}
                    {new Date(event.end_date).toLocaleDateString()}
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
