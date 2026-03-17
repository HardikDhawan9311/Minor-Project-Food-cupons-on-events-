import React from "react";
import QrScanner from "react-qr-scanner";
import { X } from "lucide-react";

const QRScannerModal = ({ onClose, onScan }) => {
  const handleScan = (data) => {
    if (data) {
      onScan(data.text || data);
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
  };

  const previewStyle = {
    height: 320,
    width: 320,
    display: "flex",
    justifyContent: "center",
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-[#1a1a2e] border border-white/20 rounded-3xl p-6 shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Scan QR Code</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-[#7F5AF0]/50 bg-black flex items-center justify-center">
          <QrScanner
            delay={300}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
            constraints={{
              video: { facingMode: "environment" }
            }}
          />
          
          {/* Scanning frame overlay */}
          <div className="absolute inset-8 border-2 border-white/30 rounded-xl pointer-events-none">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#C77DFF]"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#C77DFF]"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#C77DFF]"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#C77DFF]"></div>
          </div>
        </div>

        <p className="text-gray-400 text-sm text-center mt-6">
          Position the QR code within the frame to scan
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QRScannerModal;
