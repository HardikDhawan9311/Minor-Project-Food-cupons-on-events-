// import React, { useState } from "react";
// import axios from "axios";
// import { UploadCloud, FileSpreadsheet } from "lucide-react";
// import Navbar from "../home/NavBar";

// export default function ImportPage() {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setMessage("⚠️ Please select an Excel file first");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/participants/upload-excel",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setMessage(`✅ ${response.data.message || "File uploaded successfully!"}`);
//       setFile(null);
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Upload failed. Please check the file and try again");
//     }
//   };

//   return (
    
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-blue-100 px-4">
      
//       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
//         <Navbar />
        
//         {/* Header */}
//         <div className="text-center mb-6">
//           <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
//             <FileSpreadsheet size={28} />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800">
//             Import Participants
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Upload an Excel file (.xls or .xlsx)
//           </p>
//         </div>

//         {/* Upload Area */}
//         <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
//           <UploadCloud className="text-blue-500 mb-3" size={32} />
//           <p className="text-sm text-gray-700 font-medium">
//             Click to upload or drag & drop
//           </p>
//           <p className="text-xs text-gray-500 mt-1">
//             Excel files only
//           </p>

//           <input
//             type="file"
//             accept=".xlsx,.xls"
//             onChange={handleFileChange}
//             className="hidden"
//           />
//         </label>

//         {/* Selected File */}
//         {file && (
//           <p className="mt-3 text-sm text-gray-600 text-center">
//             📄 <span className="font-medium">{file.name}</span>
//           </p>
//         )}

//         {/* Button */}
//         <button
//           onClick={handleUpload}
//           className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
//         >
//           Upload File
//         </button>

//         {/* Message */}
//         {message && (
//           <div
//             className={`mt-4 text-sm text-center font-medium ${
//               message.includes("✅")
//                 ? "text-green-600"
//                 : message.includes("⚠️")
//                 ? "text-yellow-600"
//                 : "text-red-600"
//             }`}
//           >
//             {message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import axios from "axios";
import { UploadCloud, FileSpreadsheet } from "lucide-react";
import Navbar from "../home/NavBar";

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
    <>
      {/* ✅ Navbar stays on top */}
      <Navbar />

      {/* ✅ Page Body */}
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-blue-100 px-4">
        
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
              <FileSpreadsheet size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Import Participants
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Upload an Excel file (.xls or .xlsx)
            </p>
          </div>

          {/* Upload Box */}
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
            <UploadCloud className="text-blue-500 mb-3" size={32} />
            <p className="text-sm text-gray-700 font-medium">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Excel files only
            </p>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Selected File */}
          {file && (
            <p className="mt-3 text-sm text-gray-600 text-center">
              📄 <span className="font-medium">{file.name}</span>
            </p>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Upload File
          </button>

          {/* Message */}
          {message && (
            <div
              className={`mt-4 text-sm text-center font-medium ${
                message.includes("✅")
                  ? "text-green-600"
                  : message.includes("⚠️")
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </div>

      </div>
    </>
  );
}

