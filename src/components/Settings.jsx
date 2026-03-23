import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Settings = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const [activeTab, setActiveTab] = useState("Security");
  const [isGhostMode, setIsGhostMode] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleUpdatePassword = async () => {
    setStatus({ type: "loading", message: "Updating credentials..." });
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      return setStatus({
        type: "error",
        message: "Password fields cannot be empty.",
      });
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      return setStatus({
        type: "error",
        message: "New password must be different.",
      });
    }

    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/password`,
        {
          currentPassword: passwordData.currentPassword,
          password: passwordData.newPassword,
        },
        { withCredentials: true },
      );
      setStatus({
        type: "success",
        message:
          res.data.message ||
          "Password updated successfully. Please login again.",
      });
      setPasswordData({ currentPassword: "", newPassword: "" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err?.response?.data?.message ||
          err?.data?.message ||
          "Failed to update password.",
      });
    }
  };

  const handleTerminateAccount = async () => {
    setStatus({ type: "loading", message: "Terminating user account..." });
    try {
      const res = await axios.delete(`${BASE_URL}/profile/delete`, {
        withCredentials: true,
      });
      setStatus({
        type: "success",
        message: res.data.message || "Account permanently deleted.",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.response?.data?.message || "Failed to terminate account.",
      });
    }
  };

  const tabs = [
    { id: "Security", icon: "🔒", label: "Security & Access" },
    { id: "Privacy", icon: "🛡️", label: "Privacy Details" },
    { id: "Developer", icon: "⌨️", label: "Developer API" },
    { id: "DangerZone", icon: "⚠️", label: "Danger Zone" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans pt-24 pb-16 px-4 sm:px-6 selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-1.5 md:sticky md:top-28">
          <div className="mb-6 px-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Settings
            </h1>
            <p className="text-sm text-zinc-500 mt-1 font-medium">
              Manage your account preferences
            </p>
          </div>

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setStatus({ type: "", message: "" });
                setConfirmDelete("");
                setPasswordData({ currentPassword: "", newPassword: "" });
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-zinc-800/80 text-white shadow-sm border border-zinc-700/50"
                  : "text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200 border border-transparent"
              } ${tab.id === "DangerZone" && activeTab !== tab.id ? "hover:text-red-400 hover:bg-red-500/10" : ""} ${
                tab.id === "DangerZone" && activeTab === tab.id
                  ? "bg-red-500/10 border-red-500/20 text-red-500"
                  : ""
              }`}
            >
              <span className="text-lg opacity-80">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* MAIN SETTINGS CONTENT */}
        <main className="flex-1 w-full flex flex-col gap-6">
          {/* Feedback Status Bar */}
          {status.message && (
            <div
              className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-3 ${
                status.type === "error"
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : status.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-blue-500/10 border-blue-500/20 text-blue-400"
              }`}
            >
              {status.type === "loading" && (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              )}
              {status.message}
            </div>
          )}

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-[2rem] p-6 md:p-10 shadow-xl overflow-hidden min-h-[400px]">
            {activeTab === "Security" && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    Update Password
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Ensure your account is using a long, random password to stay
                    secure.
                  </p>
                </div>

                <div className="space-y-5 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono placeholder:font-sans placeholder:text-zinc-600"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono placeholder:font-sans placeholder:text-zinc-600"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    onClick={handleUpdatePassword}
                    className="mt-4 bg-zinc-100 text-black font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-white transition-colors shadow-sm"
                  >
                    Save Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Privacy" && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    Privacy & Visibility
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Control how your profile behaves inside the discovery
                    network.
                  </p>
                </div>

                <div className="flex items-start justify-between p-5 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl">
                  <div className="max-w-[70%]">
                    <h3 className="text-white font-semibold mb-1">
                      Stealth Mode (Ghost)
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      When enabled, your profile is hidden from public discovery
                      swiping, but you remain visible to your existing matches
                      and active conversations.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsGhostMode(!isGhostMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                      isGhostMode ? "bg-indigo-500" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isGhostMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Developer" && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    Developer API Tokens
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Authenticated keys for direct API access to DevTinder
                    endpoints.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Token A */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                      User Access Token
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md text-[9px] font-mono">
                        ACTIVE
                      </span>
                    </label>
                    <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden group focus-within:border-indigo-500/50 transition-colors">
                      <input
                        readOnly
                        value={`dt_live_${user?._id?.slice(-8) || "xxxxxxxx"}_${Math.random()
                          .toString(36)
                          .substring(2, 10)}`}
                        className="w-full bg-transparent px-4 py-3 text-sm text-zinc-400 font-mono outline-none selection:bg-indigo-500/40"
                      />
                      <button className="px-5 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors border-l border-zinc-800 text-xs font-semibold uppercase tracking-wider bg-zinc-900/50">
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Token B */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Session RSA Secret
                    </label>
                    <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden group focus-within:border-indigo-500/50 transition-colors">
                      <input
                        readOnly
                        type="password"
                        value={`rsa_v2_${
                          user?.firstName?.toLowerCase() || "usr"
                        }_pkcs8_${user?._id?.slice(0, 4) || "xx"}`}
                        className="w-full bg-transparent px-4 py-3 text-sm text-zinc-400 font-mono outline-none select-all"
                      />
                      <button className="px-5 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors border-l border-zinc-800 text-xs font-semibold uppercase tracking-wider bg-zinc-900/50">
                        Reveal
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-sm text-blue-300 font-medium flex items-start gap-3 leading-relaxed">
                    <span className="text-blue-400/80 text-lg leading-none mt-[-2px]">
                      ℹ️
                    </span>
                    For security protocols, your personal session identifiers
                    are rotated automatically. Do not share these directly in
                    client-side code repositories.
                  </div>
                </div>
              </div>
            )}

            {activeTab === "DangerZone" && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
                    Permanently Delete Account
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                </div>

                <div className="p-6 md:p-8 border border-red-500/20 bg-red-500/5 rounded-2xl space-y-6">
                  <p className="text-red-400/90 text-[15px] font-medium leading-relaxed">
                    This action will permanently purge all your data, including
                    photos, matches, private messages, and profile
                    configurations across all network clusters.
                  </p>

                  <div className="space-y-2 max-w-md pt-2">
                    <label className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest">
                      Type "TERMINATE" to confirm
                    </label>
                    <input
                      type="text"
                      value={confirmDelete}
                      onChange={(e) => setConfirmDelete(e.target.value)}
                      className="w-full bg-black/40 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 focus:outline-none focus:border-red-500 transition-all font-mono placeholder:text-red-900/50"
                      placeholder="TERMINATE"
                    />
                  </div>

                  <button
                    disabled={confirmDelete !== "TERMINATE"}
                    onClick={handleTerminateAccount}
                    className={`mt-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                      confirmDelete === "TERMINATE"
                        ? "bg-red-600 text-white hover:bg-red-500 cursor-pointer"
                        : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
                    }`}
                  >
                    Delete My Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
