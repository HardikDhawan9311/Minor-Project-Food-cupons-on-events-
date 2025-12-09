import React from "react";
import { Pizza, Home, Upload, FileText, Calendar, Settings } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2 text-purple-600 font-bold text-xl whitespace-nowrap">
          <Pizza className="text-orange-500" />
          Hackathon FoodPass
        </div>

        {/* Center Nav */}
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex items-center gap-6 bg-gray-100 px-6 py-2 rounded-full text-gray-700 font-medium">
            
            <NavItem href="/home" icon={<Home size={18} />} text="Home" />
            <NavItem href="/import" icon={<Upload size={18} />} text="Import" />
            <NavItem href="/logs" icon={<FileText size={18} />} text="Logs" />
            <NavItem href="/schedule" icon={<Calendar size={18} />} text="Schedule" />
            <NavItem href="/settings" icon={<Settings size={18} />} text="Settings" />

          </div>
        </div>

      </div>
    </nav>
  );
}

function NavItem({ href, icon, text }) {
  return (
    <a
      href={href}
      className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-white hover:text-purple-600 transition"
    >
      {icon}
      {text}
    </a>
  );
}
