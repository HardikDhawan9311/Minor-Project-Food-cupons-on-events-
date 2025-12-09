// const db = require("../config/db");

// // 📌 Create Event
// exports.createEvent = async (req, res) => {
//   const { event_name, start_date, end_date } = req.body;

//   if (!event_name || !start_date || !end_date) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     const [result] = await db.execute(
//       `INSERT INTO events (event_name, start_date, end_date) VALUES (?, ?, ?)`,
//       [event_name, start_date, end_date]
//     );

//     res.status(201).json({
//       message: "🎉 Event Created Successfully!",
//       event_id: result.insertId,
//     });
//   } catch (error) {
//     console.error("❌ Database Error:", error);
//     res.status(500).json({ message: "Database Insert Failed", error });
//   }
// };


// // 📌 Fetch All Events
// exports.getEvents = async (req, res) => {
//   try {
//     const [rows] = await db.execute(`SELECT * FROM events`);
//     res.status(200).json(rows);
//   } catch (error) {
//     console.error("❌ Fetch Error:", error);
//     res.status(500).json({ message: "Database Fetch Failed", error });
//   }
// };


// // 📌 Fetch Single Event WITH Meals
// exports.getEventDetails = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [event] = await db.execute(
//       `SELECT * FROM events WHERE event_id = ?`,
//       [id]
//     );

//     if (event.length === 0) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     const [meals] = await db.execute(
//         `SELECT 
//     DATE(date) AS date,
//     meal_name,
//     start_time,
//     end_time
//   FROM event_meals
//   WHERE event_id = ?
//   ORDER BY DATE(date), start_time
// `,
//       [id]
//     );

//     const mealDays = meals.reduce((acc, row) => {
//       // ✅ NORMALIZE DATE (IMPORTANT FIX)
//       const formattedDate = row.date.toISOString().split("T")[0];

//       if (!acc[formattedDate]) {
//         acc[formattedDate] = { date: formattedDate, meals: [] };
//       }

//       acc[formattedDate].meals.push({
//         meal_name: row.meal_name,
//         start_time: row.start_time,
//         end_time: row.end_time,
//       });

//       return acc;
//     }, {});

//     res.status(200).json({
//       event: event[0],
//       meals: Object.values(mealDays),
//     });

//   } catch (error) {
//     console.error("❌ Fetch Event Details Error:", error);
//     res.status(500).json({ error: "Failed to fetch event details" });
//   }
// };



// // 📌 Toggle Enable/Disable Event
// exports.toggleEvent = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await db.execute(
//       `UPDATE events SET enabled = NOT enabled WHERE event_id = ?`,
//       [id]
//     );
//     res.status(200).json({ message: "Event status toggled successfully" });
//   } catch (error) {
//     console.error("❌ Toggle Error:", error);
//     res.status(500).json({ error: "Failed to toggle event" });
//   }
// };


// // 🌟 SAVE ALL MEALS FOR A DATE
// exports.saveAllMeals = async (req, res) => {
//   const { id } = req.params;
//   const { date, meals } = req.body;

//   if (!date || !meals || meals.length === 0) {
//     return res.status(400).json({ message: "Date and at least one meal is required" });
//   }

//   try {
//     await db.execute(
//       `DELETE FROM event_meals WHERE event_id = ? AND date = ?`,
//       [id, date]
//     );

//     for (let meal of meals) {
//       await db.execute(
//         `INSERT INTO event_meals (event_id, date, meal_name, start_time, end_time) VALUES (?, ?, ?, ?, ?)`,
//         [
//           id,
//           date,
//           meal.meal_name.trim().toLowerCase(), // ✅ HERE
//           meal.start_time,
//           meal.end_time
//         ]
//       );
//     }

//     const [updatedMeals] = await db.execute(
//       `SELECT meal_id, event_id, date, meal_name, start_time, end_time 
//        FROM event_meals 
//        WHERE event_id = ?
//        ORDER BY date, start_time`,
//       [id]
//     );

//     res.status(200).json({
//       message: "Meals saved successfully!",
//       updatedMeals,
//     });
//   } catch (error) {
//     console.error("❌ Meal Save Error:", error);
//     res.status(500).json({ error: "Error saving meals" });
//   }
// };



// // 📌 Get only Meals for an Event (Optional API - used in EventDetails.jsx or Edit page)
// exports.getEventMeals = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [meals] = await db.execute(
//       `SELECT meal_id, date, meal_name, start_time, end_time
//        FROM event_meals
//        WHERE event_id = ?
//        ORDER BY date, start_time`,
//       [id]
//     );

//     res.status(200).json(meals);
//   } catch (error) {
//     console.error("❌ Fetch Meals Error:", error);
//     res.status(500).json({ error: "Failed to fetch meals" });
//   }
// };

// const db = require("../config/db");


// // 📌 Create Event
// exports.createEvent = async (req, res) => {
//   const { event_name, start_date, end_date } = req.body;

//   if (!event_name || !start_date || !end_date) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     const [result] = await db.execute(
//       `INSERT INTO events (event_name, start_date, end_date)
//        VALUES (?, ?, ?)`,
//       [event_name, start_date, end_date]
//     );

//     res.status(201).json({
//       message: "🎉 Event Created Successfully!",
//       event_id: result.insertId,
//     });
//   } catch (error) {
//     console.error("❌ Database Error:", error);
//     res.status(500).json({ message: "Database Insert Failed", error });
//   }
// };


// // 📌 Fetch All Events
// exports.getEvents = async (req, res) => {
//   try {
//     const [rows] = await db.execute(`SELECT * FROM events`);
//     res.status(200).json(rows);
//   } catch (error) {
//     console.error("❌ Fetch Error:", error);
//     res.status(500).json({ message: "Database Fetch Failed", error });
//   }
// };


// // 📌 Fetch Single Event WITH Meals ✅ FINAL
// exports.getEventDetails = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [event] = await db.execute(
//       `SELECT * FROM events WHERE event_id = ?`,
//       [id]
//     );

//     if (event.length === 0) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     const [meals] = await db.execute(
//       `SELECT 
//         DATE(date) AS date,
//         meal_name,
//         start_time,
//         end_time
//        FROM event_meals
//        WHERE event_id = ?
//        ORDER BY DATE(date), start_time`,
//       [id]
//     );

//     const mealDays = meals.reduce((acc, row) => {
//       if (!acc[row.date]) {
//         acc[row.date] = { date: row.date, meals: [] };
//       }

//       acc[row.date].meals.push({
//         meal_name: row.meal_name,
//         start_time: row.start_time,
//         end_time: row.end_time,
//       });

//       return acc;
//     }, {});

//     res.status(200).json({
//       event: event[0],
//       meals: Object.values(mealDays),
//     });

//   } catch (error) {
//     console.error("❌ Fetch Event Details Error:", error);
//     res.status(500).json({ error: "Failed to fetch event details" });
//   }
// };


// // 📌 Enable / Disable Event
// exports.toggleEvent = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await db.execute(
//       `UPDATE events SET enabled = NOT enabled WHERE event_id = ?`,
//       [id]
//     );
//     res.status(200).json({ message: "Event status toggled successfully" });
//   } catch (error) {
//     console.error("❌ Toggle Error:", error);
//     res.status(500).json({ error: "Failed to toggle event" });
//   }
// };


// // 🌟 Save All Meals for a Date ✅ FINAL
// exports.saveAllMeals = async (req, res) => {
//   const { id } = req.params;
//   const { date, meals } = req.body;

//   if (!date || !meals || meals.length === 0) {
//     return res
//       .status(400)
//       .json({ message: "Date and at least one meal is required" });
//   }

//   try {
//     // ✅ Remove existing meals for that day
//     await db.execute(
//       `DELETE FROM event_meals WHERE event_id = ? AND DATE(date) = ?`,
//       [id, date]
//     );

//     for (let meal of meals) {
//       // ✅ Prevent empty meals
//       if (!meal.meal_name || !meal.start_time || !meal.end_time) continue;

//       await db.execute(
//         `INSERT INTO event_meals 
//          (event_id, date, meal_name, start_time, end_time)
//          VALUES (?, ?, ?, ?, ?)`,
//         [
//           id,
//           `${date} 00:00:00`,                 // ✅ TIMEZONE FIX
//           meal.meal_name.trim().toLowerCase(), // ✅ CLEAN NAME
//           meal.start_time,
//           meal.end_time
//         ]
//       );
//     }

//     res.status(200).json({ message: "✅ Meals saved successfully!" });

//   } catch (error) {
//     console.error("❌ Meal Save Error:", error);
//     res.status(500).json({ error: "Error saving meals" });
//   }
// };


// // 📌 Get Only Meals (Optional)
// exports.getEventMeals = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [meals] = await db.execute(
//       `SELECT 
//         DATE_FORMAT(date, '%Y-%m-%d') AS date,
//         meal_name,
//         start_time,
//         end_time
//        FROM event_meals
//        WHERE event_id = ?
//        ORDER BY DATE(date), start_time`,
//       [id]
//     );

//     res.status(200).json(meals);
//   } catch (error) {
//     console.error("❌ Fetch Meals Error:", error);
//     res.status(500).json({ error: "Failed to fetch meals" });
//   }
// };


const db = require("../config/db");

/* =======================
   CREATE EVENT
======================= */
exports.createEvent = async (req, res) => {
  const { event_name, start_date, end_date } = req.body;

  if (!event_name || !start_date || !end_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO events (event_name, start_date, end_date)
       VALUES (?, ?, ?)`,
      [event_name, start_date, end_date]
    );

    res.status(201).json({
      message: "Event created successfully",
      event_id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};


/* =======================
   FETCH ALL EVENTS
======================= */
exports.getEvents = async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM events`);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fetch failed" });
  }
};


/* =======================
   FETCH EVENT + MEALS ✅ FINAL
======================= */
exports.getEventDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const [event] = await db.execute(
      `SELECT * FROM events WHERE event_id = ?`,
      [id]
    );

    if (!event.length) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ✅ FORCE DATE AS STRING (NO TIMEZONE)
    const [meals] = await db.execute(
      `SELECT 
         DATE_FORMAT(date, '%Y-%m-%d') AS date,
         meal_name,
         start_time,
         end_time
       FROM event_meals
       WHERE event_id = ?
       ORDER BY date, start_time`,
      [id]
    );

    const mealDays = meals.reduce((acc, row) => {
      if (!acc[row.date]) {
        acc[row.date] = { date: row.date, meals: [] };
      }

      acc[row.date].meals.push({
        meal_name: row.meal_name,
        start_time: row.start_time,
        end_time: row.end_time,
      });

      return acc;
    }, {});

    res.status(200).json({
      event: event[0],
      meals: Object.values(mealDays),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch event details" });
  }
};


/* =======================
   TOGGLE EVENT STATUS
======================= */
exports.toggleEvent = async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute(
      `UPDATE events SET enabled = NOT enabled WHERE event_id = ?`,
      [id]
    );
    res.status(200).json({ message: "Event status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Toggle failed" });
  }
};


/* =======================
   SAVE MEALS ✅ FINAL
======================= */
exports.saveAllMeals = async (req, res) => {
  const { id } = req.params;
  const { date, meals } = req.body;

  if (!date || !meals || meals.length === 0) {
    return res
      .status(400)
      .json({ message: "Date and meals are required" });
  }

  try {
    // ✅ Delete existing meals for that date
    await db.execute(
      `DELETE FROM event_meals WHERE event_id = ? AND date = ?`,
      [id, date]
    );

    for (const meal of meals) {
      if (!meal.meal_name || !meal.start_time || !meal.end_time) continue;

      await db.execute(
        `INSERT INTO event_meals
         (event_id, date, meal_name, start_time, end_time)
         VALUES (?, ?, ?, ?, ?)`,
        [
          id,
          date, // ✅ DATE column → store only date
          meal.meal_name.trim().toLowerCase(),
          meal.start_time,
          meal.end_time,
        ]
      );
    }

    res.status(200).json({ message: "Meals saved successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Saving meals failed" });
  }
};


/* =======================
   GET MEALS ONLY (OPTIONAL)
======================= */
exports.getEventMeals = async (req, res) => {
  const { id } = req.params;

  try {
    const [meals] = await db.execute(
      `SELECT 
         DATE_FORMAT(date, '%Y-%m-%d') AS date,
         meal_name,
         start_time,
         end_time
       FROM event_meals
       WHERE event_id = ?
       ORDER BY date, start_time`,
      [id]
    );

    res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Meal fetch failed" });
  }
};
