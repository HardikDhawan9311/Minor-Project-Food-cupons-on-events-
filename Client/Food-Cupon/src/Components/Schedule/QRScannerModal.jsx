import React from "react";
import { QrCode } from "lucide-react";
import QrScanner from "react-qr-scanner";

export default function QRScannerModal({ onClose, onScan }) {
  const previewStyle = {
    height: 300,
    width: 300,
  };

  const handleError = (error) => {
    console.error("❌ QR Scanner Error:", error);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-xl flex flex-col items-center gap-4">
        <h2 className="text-xl text-purple-400 font-semibold flex items-center gap-2">
          <QrCode size={20} />
          Scan QR Code
        </h2>

        <div className="border-4 border-dashed border-purple-500 rounded-xl overflow-hidden">
          <QrScanner
            delay={300}
            onError={handleError}
            style={previewStyle}
            constraints={{ video: { facingMode: "environment" } }}
            onScan={(result) => {
              if (result && result.text) {
                console.log("✅ SCANNED QR:", result.text);
                onScan(result.text);
              }
            }}
          />
        </div>

        <button
          onClick={onClose}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
