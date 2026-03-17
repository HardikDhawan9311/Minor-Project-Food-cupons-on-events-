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

    if (sheetData.length === 0) {
      return res.status(400).json({ error: "Excel sheet has no rows" });
    }

    const normalize = (key) => key.toString().trim().toLowerCase().replace(/\s+/g, "");

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
        const [result] = await db.execute(
          "INSERT IGNORE INTO participants (team_name, name, email, check_in, token_id) VALUES (?, ?, ?, ?, ?)",
          [teamname, name, email, checkin, token_id]
        );

        if (result.affectedRows > 0) {
          insertCount++;
        } else {
          console.log(`⚠️ Duplicate skipped for ${teamname} - ${email}`);
        }
      } catch (err) {
        console.error(`❌ DB Error in row ${index + 2}:`, err.message);
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
      const [tokenRows] = await db.execute("SELECT token_id FROM participants");
      const token_ids = tokenRows.map((r) => r.token_id);

      if (token_ids.length > 0) {
        await axios.post("http://localhost:4000/generate_qr_batch", {
          token_ids,
          error_correction: "M",
        });
        console.log("✅ QR batch generated automatically after Excel upload.");
      }
    } catch (err) {
      console.error("⚠️ Failed to auto-generate QR batch:", err.message);
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
    const [results] = await db.execute("SELECT * FROM participants");
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

module.exports = { uploadExcel, getParticipants, getTeamParticipants };
