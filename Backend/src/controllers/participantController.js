const xlsx = require("xlsx");
const db = require("../config/db");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

// 🔹 Generate random 12-char token
function generateTokenId(teamName, name, email) {
  function getRandomChars(str, count) {
    if (!str) return "";
    let result = "";
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * str.length);
      result += str[index].toUpperCase();
    }
    return result;
  }

  const part1 = getRandomChars(teamName, 3);
  const part2 = getRandomChars(name, 3);
  const part3 = getRandomChars(email, 3);
  const random = Math.floor(100 + Math.random() * 900); // 3 random digits

  return (part1 + part2 + part3 + random).substring(0, 12);
}

// 🔹 Ensure unique token_id
async function getUniqueToken(teamName, name, email) {
  let token;
  let isUnique = false;

  while (!isUnique) {
    token = generateTokenId(teamName, name, email);
    const [rows] = await db.execute("SELECT id FROM participants WHERE token_id = ?", [token]);
    if (rows.length === 0) isUnique = true;
  }

  return token;
}

// 🔹 Upload Excel, insert data, generate tokens
const uploadExcel = async (req, res) => {
  try {
    const { event_id } = req.body;
    console.log("📥 Uploading Excel for event_id:", event_id);
    if (!event_id) {
      return res.status(400).json({ error: "event_id is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return res.status(400).json({ error: "Excel file is empty or invalid" });
    }

    let sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: null,
      raw: false,
    });

    console.log("📊 First row of raw sheetData:", JSON.stringify(sheetData[0], null, 2));

    if (sheetData.length === 0) {
      return res.status(400).json({ error: "Excel sheet has no rows" });
    }

    const normalize = (key) => key.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, "");

    const requiredHeaders = ["teamname", "name", "email", "checkin"];
    const fileHeaders = Object.keys(sheetData[0]).map(normalize);

    const missingHeaders = requiredHeaders.filter((h) => !fileHeaders.includes(h));

    if (missingHeaders.length > 0) {
      return res.status(400).json({
        error: "Invalid Excel format",
        expectedHeaders: requiredHeaders,
        missingHeaders,
      });
    }

    // Normalize all rows
    sheetData = sheetData.map((row) => {
      const normalizedRow = {};
      for (const key in row) {
        normalizedRow[normalize(key)] = row[key];
      }
      return normalizedRow;
    });

    let insertCount = 0;
    let errorCount = 0;

    // 🔹 Insert rows one by one
    for (let [index, row] of sheetData.entries()) {
      const { teamname, name, email, checkin } = row;

      if (!teamname || !name || !email || !checkin) {
        console.warn(`⚠️ Missing fields in row ${index + 2}, skipping...`);
        errorCount++;
        continue;
      }

      try {
        const token_id = await getUniqueToken(teamname, name, email);
        const isCheckedIn = (checkin?.toString().toLowerCase().trim() === "yes") ? 1 : 0;
        
        console.log(`📝 Inserting row ${index + 2}: ${name} (${email})`);
        const [result] = await db.execute(
          "INSERT INTO participants (event_id, team_name, name, email, check_in, token_id) VALUES (?, ?, ?, ?, ?, ?)",
          [event_id, teamname, name, email, isCheckedIn, token_id]
        );
        console.log(`✅ Row ${index + 2} affectRows: ${result.affectedRows}`);

        if (result.affectedRows > 0) {
          insertCount++;
        } else {
          console.log(`⚠️ Duplicate skipped for ${teamname} - ${email}`);
        }
      } catch (err) {
        console.error(`❌ DB Error in row ${index + 2}:`, err);
        errorCount++;
      }
    }

    // ✅ Delete uploaded file
    const absolutePath = path.resolve(filePath);
    fs.unlink(absolutePath, (err) => {
      if (err) console.error("⚠️ Failed to delete uploaded file:", err.message);
      else console.log("🗑️ Uploaded file deleted:", absolutePath);
    });

    // ✅ Auto-generate QR codes after successful upload
    try {
      const [tokenRows] = await db.execute(
        "SELECT token_id FROM participants WHERE event_id = ?",
        [event_id]
      );
      const token_ids = tokenRows.map((r) => r.token_id);

      if (token_ids.length > 0) {
        const response = await axios.post("http://localhost:8000/generate_qr_batch", {
          token_ids,
          error_correction: "M",
        });
        
        const qrResults = response.data.results;

        // 🔹 Store each QR code in DB
        for (const qr of qrResults) {
          await db.execute(
            "UPDATE participants SET qr_code = ? WHERE token_id = ?",
            [qr.qr_base64, qr.token_id]
          );
        }
        console.log("✅ QR batch generated and stored automatically after Excel upload.");
      }
    } catch (err) {
      console.error("⚠️ Failed to auto-generate and store QR batch:", err.message);
    }

    // ✅ Final response
    res.json({
      message: "Excel processed successfully",
      inserted: insertCount,
      errors: errorCount,
    });

  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ error: "Server error while processing Excel file" });
  }
};

// 🔹 Fetch all participants
const getParticipants = async (req, res) => {
  try {
    const { event_id } = req.query;
    let query = "SELECT * FROM participants";
    let params = [];

    if (event_id) {
      query += " WHERE event_id = ?";
      params.push(event_id);
    }

    const [results] = await db.execute(query, params);
    res.json(results);
  } catch (error) {
    console.error("❌ getParticipants error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔹 Fetch participants by team
const getTeamParticipants = async (req, res) => {
  try {
    const { teamName } = req.params;

    if (!teamName) {
      return res.status(400).json({ error: "Team name is required" });
    }

    const [results] = await db.execute(
      "SELECT * FROM participants WHERE LOWER(REPLACE(team_name, ' ', '')) = LOWER(REPLACE(?, ' ', ''))",
      [teamName]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: `No participants found for team ${teamName}` });
    }

    res.json(results);
  } catch (error) {
    console.error("❌ getTeamParticipants error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔹 Mark meal as eaten via QR Scan — per meal tracking
const markMealEaten = async (req, res) => {
  try {
    const { token_id, event_id, meal_id } = req.body;

    if (!token_id || !event_id || !meal_id) {
      return res.status(400).json({ error: "token_id, event_id, and meal_id are required" });
    }

    // 1. Verify token exists
    const [anyParticipant] = await db.execute(
      "SELECT * FROM participants WHERE token_id = ?",
      [token_id]
    );

    if (anyParticipant.length === 0) {
      return res.status(404).json({ error: "❌ Invalid QR code. Participant not found." });
    }

    const participant = anyParticipant[0];

    // 🚩 NEW: Handle Event Check-In session separately
    if (meal_id === "check_in") {
      if (participant.check_in === 1 || participant.check_in === "Yes" || participant.check_in === true) {
        return res.status(400).json({ 
          error: `⚠️ ${participant.name} is already checked in.`,
          already_checked_in: true 
        });
      }

      await db.execute(
        "UPDATE participants SET check_in = 1 WHERE id = ?",
        [participant.id]
      );

      return res.json({
        message: `✅ Check-In successful for ${participant.name}!`,
        name: participant.name,
        team_name: participant.team_name,
        check_in: true,
        summary: "Checked in successfully"
      });
    }

    // 🚩 NEW: Block meal scans if participant has not checked in (registration requirement)
    if (!participant.check_in || participant.check_in === "No" || participant.check_in === 0) {
      return res.status(403).json({
        error: `❌ ${participant.name} is NOT checked in. Please check in at the registration desk first.`,
      });
    }

    // 🚩 NEW: Verify participant belongs to this specific event
    if (participant.event_id !== parseInt(event_id)) {
      return res.status(403).json({
        error: "❌ This QR code belongs to another event.",
      });
    }

    // 3. Verify meal belongs to this event
    const [mealRows] = await db.execute(
      "SELECT * FROM event_meals WHERE meal_id = ? AND event_id = ?",
      [meal_id, event_id]
    );

    if (mealRows.length === 0) {
      return res.status(400).json({ error: "❌ Invalid meal selection for this event." });
    }

    const mealName = mealRows[0].meal_name;

    // 4. Check if this participant already ate this specific meal
    const [existing] = await db.execute(
      "SELECT id FROM meal_scans WHERE participant_id = ? AND meal_id = ?",
      [participant.id, meal_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        error: `⚠️ ${participant.name} has already collected ${mealName}. Cannot scan again for the same meal.`,
      });
    }

    // 5. Record the meal scan
    await db.execute(
      "INSERT INTO meal_scans (participant_id, meal_id) VALUES (?, ?)",
      [participant.id, meal_id]
    );

    // 6. Update the summary counter on participants
    await db.execute(
      "UPDATE participants SET meals_eaten = meals_eaten + 1 WHERE id = ?",
      [participant.id]
    );

    // 7. Get total meals for this event and how many this participant has eaten
    const [totalMeals] = await db.execute(
      "SELECT COUNT(*) as total FROM event_meals WHERE event_id = ?",
      [event_id]
    );
    const [eatenMeals] = await db.execute(
      "SELECT COUNT(*) as eaten FROM meal_scans WHERE participant_id = ?",
      [participant.id]
    );

    const total = totalMeals[0].total;
    const eaten = eatenMeals[0].eaten;

    res.json({
      message: `✅ ${mealName} recorded for ${participant.name}!`,
      name: participant.name,
      team_name: participant.team_name,
      meal: mealName,
      meals_eaten: eaten,
      total_meals: total,
      summary: `${eaten}/${total} meals collected`,
    });
  } catch (error) {
    // Handle duplicate key gracefully
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "⚠️ This meal has already been scanned for this participant." });
    }
    console.error("❌ markMealEaten error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { uploadExcel, getParticipants, getTeamParticipants, markMealEaten };
