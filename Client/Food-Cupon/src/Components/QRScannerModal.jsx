import React, { useState, useEffect } from "react";
import QrScanner from "react-qr-scanner";
import { X, Check } from "lucide-react";
import api from "../utils/api";

const QRScannerModal = ({ onClose, eventId, activeMeal }) => {
  const [history, setHistory] = useState([]);
  const [scanning, setScanning] = useState(false);
  
  const handleScan = async (data) => {
    if (data && !scanning) {
      setScanning(true);
      const tokenId = data.text || data;
      
      try {
        // Vibrate and Sound
        if (navigator.vibrate) navigator.vibrate(50);
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
        audio.play().catch(() => {});

        const res = await api.post("/participants/scan", {
          event_id: eventId,
          meal_id: activeMeal?.meal_id,
          token_id: tokenId
        });

        const newEntry = {
          id: Date.now(),
          name: res.data.participant?.name || "Member",
          team: res.data.participant?.team_name || tokenId,
          time: new Date().toLocaleTimeString(),
          success: true
        };
        
        setHistory(prev => [newEntry, ...prev].slice(0, 5));
        
        // Wait 1.5s before next scan
        setTimeout(() => setScanning(false), 1500);
      } catch (err) {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        const newEntry = {
          id: Date.now(),
          name: "Error",
          team: err.response?.data?.message || "Scan Failed",
          time: new Date().toLocaleTimeString(),
          success: false
        };
        setHistory(prev => [newEntry, ...prev].slice(0, 5));
        setTimeout(() => setScanning(false), 2000);
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-[#1a1a2e] border border-white/20 rounded-3xl p-6 shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Scanner: {activeMeal?.meal_name || "General"}</h2>
            <p className="text-gray-400 text-xs">Event: {eventId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-[#7F5AF0]/50 bg-black flex items-center justify-center">
            <QrScanner
              delay={300}
              style={{ height: 320, width: "100%", display: "flex", justifyContent: "center" }}
              onError={handleError}
              onScan={handleScan}
              constraints={{ video: { facingMode: "environment" } }}
            />
            {scanning && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none">
                <Check size={48} className="text-green-400" />
              </div>
            )}
            <div className="absolute inset-8 border-2 border-white/30 rounded-xl pointer-events-none">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#C77DFF]"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#C77DFF]"></div>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Scan History</h3>
            <div className="flex-1 space-y-2 max-h-[250px] overflow-y-auto pr-2">
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-4 text-sm border border-dashed border-white/10 rounded-xl">No scans yet</p>
              ) : (
                history.map(item => (
                  <div key={item.id} className={`p-3 rounded-xl border ${item.success ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <span className="text-[10px] text-gray-500">{item.time}</span>
                    </div>
                    <p className={`text-[10px] truncate ${item.success ? "text-gray-400" : "text-red-400 font-medium"}`}>{item.team}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <button onClick={onClose} className="mt-6 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition">
          Close Scanner
        </button>
      </div>
    </div>
  );
};

export default QRScannerModal;
