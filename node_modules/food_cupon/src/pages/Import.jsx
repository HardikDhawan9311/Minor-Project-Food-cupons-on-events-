import React, { useState } from "react";
import axios from "axios";
import { UploadCloud, FileSpreadsheet } from "lucide-react";
import Navbar from "../components/NavBar";

export default function ImportPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select an Excel file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/participants/upload-excel",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(`✅ ${response.data.message || "File uploaded successfully!"}`);
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed. Please check the file and try again");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] text-white">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-white/20 mb-4">
              <FileSpreadsheet size={28} className="text-[#C77DFF]" />
            </div>
            <h1 className="text-3xl font-bold">Import Participants</h1>
            <p className="text-gray-300 text-sm mt-1">
              Upload an Excel file (.xls or .xlsx)
            </p>
          </div>

          {/* Upload Box */}
          <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer bg-white/5 hover:bg-white/10 transition">
            <UploadCloud className="text-[#C77DFF] mb-3" size={34} />
            <p className="text-sm font-medium">Click to upload or drag & drop</p>
            <p className="text-xs text-gray-300 mt-1">Excel files only</p>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Selected File */}
          {file && (
            <p className="mt-4 text-sm text-center text-gray-300">
              📄 <span className="font-semibold">{file.name}</span>
            </p>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[#7F5AF0] to-[#C77DFF] font-semibold hover:scale-[1.02] transition"
          >
            Upload File
          </button>

          {/* Message */}
          {message && (
            <p
              className={`mt-4 text-sm text-center font-medium ${
                message.includes("✅")
                  ? "text-green-400"
                  : message.includes("⚠️")
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
