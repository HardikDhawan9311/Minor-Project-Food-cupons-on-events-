import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  FaPhone,
  FaEnvelope,
  FaEdit,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaTrash,
} from "react-icons/fa";

export default function Setting() {
  const navigate = useNavigate();

  const user = {
    username: "hardik_123",
    name: "Hardik Dhawan",
    phone: "+91 98765 43210",
    email: "hardik@example.com",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  };

  const handleLogout = () => {
    if (!window.confirm("Logout from this account?")) return;
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12">

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-1">⚙️ Settings</h1>
          <p className="text-gray-300">
            Manage your account and preferences
          </p>
        </div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Profile */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
            <div className="flex flex-col items-center text-center">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-24 h-24 rounded-full border-4 border-white/20 mb-4"
              />
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-400">@{user.username}</p>

              <div className="mt-4 space-y-2 text-sm text-gray-300">
                <p className="flex items-center justify-center gap-2">
                  <FaPhone /> {user.phone}
                </p>
                <p className="flex items-center justify-center gap-2">
                  <FaEnvelope /> {user.email}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="mt-6 w-full py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* RIGHT: Settings */}
          <div className="lg:col-span-2 space-y-6">

            {/* Account */}
            <SettingsCard title="Account">
              <SettingItem icon={<FaEdit />} text="Edit Profile" />
              <SettingItem icon={<FaLock />} text="Change Password" />
              <SettingItem icon={<FaShieldAlt />} text="Login & Security" />
            </SettingsCard>

            {/* Preferences */}
            <SettingsCard title="Preferences">
              <SettingItem icon={<FaBell />} text="Notifications" />
            </SettingsCard>

            {/* Danger Zone */}
            <SettingsCard title="Danger Zone">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/20 transition">
                <FaTrash />
                Delete Account
              </button>
            </SettingsCard>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* Reusable components */

function SettingsCard({ title, children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-200">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SettingItem({ icon, text }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-left">
      <span className="text-[#C77DFF]">{icon}</span>
      <span className="text-gray-200">{text}</span>
    </button>
  );
}
