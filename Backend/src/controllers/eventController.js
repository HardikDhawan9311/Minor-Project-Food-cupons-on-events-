const db = require("../config/db");

// Create Event
exports.createEvent = async (req, res) => {
  const { event_name, start_date, end_date } = req.body;

  if (!event_name || !start_date || !end_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO events (event_name, start_date, end_date) VALUES (?, ?, ?)`,
      [event_name, start_date, end_date]
    );

    res.status(201).json({
      message: "🎉 Event Created Successfully!",
      event_id: result.insertId,
    });
  } catch (error) {
    console.error("❌ Database Error:", error);
    res.status(500).json({ message: "Database Insert Failed", error });
  }
};

// Fetch All Events
exports.getEvents = async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM events`);
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ message: "Database Fetch Failed", error });
  }
};
