"use client";

import { useState } from "react";
import { FiLock, FiSave } from "react-icons/fi";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    // Call API to change password (mocked here)
    setMessage("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="p-6 max-w-lg mx-auto mt-32">
      

      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiLock /> Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 placeholder-gray-300 focus:ring-blue-400"
              placeholder="Enter your current password"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 placeholder-gray-300 focus:ring-blue-400"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
          </div>

          {message && <p className="text-sm text-red-500">{message}</p>}

          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-300"
          >
            <FiSave /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
