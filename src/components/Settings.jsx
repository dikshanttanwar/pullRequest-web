import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Settings = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user); //
  const [activeFile, setActiveFile] = useState("auth.config");
  const [isGhostMode, setIsGhostMode] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [systemLogs, setSystemLogs] = useState([
    "[SYSTEM] Initializing configuration clusters...",
    "[SUCCESS] Connection stable.",
  ]);

  const logAction = (msg) =>
    setSystemLogs((prev) => [`[INFO] ${msg}`, ...prev].slice(0, 5));

  // --- ADDED FUNCTIONALITY: Terminate Account ---
  const handleTerminateAccount = async () => {
    logAction("sudo rm -rf ./user_data");
    logAction("Initiating recursive deletion of user object...");

    try {
      const res = await axios.delete(`${BASE_URL}/profile/delete`, {
        withCredentials: true,
      });
      logAction(`[SUCCESS] ${res.data.message || "Account purged."}`);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "DELETION_FAILED";
      logAction(`[FATAL] ${errorMsg.toUpperCase()}`);
    }
  };

  const handleUpdatePassword = async () => {
    logAction("sh rotate_keys.sh --force");
    logAction("Validating RSA keypair integrity...");

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      logAction("[ERROR] ERR_NULL_POINTER: Password fields cannot be empty.");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      logAction("[ERROR] Password cannot be same as old one!.");
      return;
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

      logAction(
        `[SUCCESS] ${res.data.message || "Credentials rotated successfully."}`,
      );
      setPasswordData({ currentPassword: "", newPassword: "" });
      navigate("/login");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.data?.message ||
        "ERR_CONNECTION_REFUSED";
      logAction(`[FATAL] ${errorMsg.toUpperCase()}`);
      logAction("Exited with code 1");
    }
  };

  const fileTree = [
    {
      name: "auth.config",
      icon: "🔑",
      color: "text-yellow-500",
      group: "SECURITY",
    },
    {
      name: "privacy.yaml",
      icon: "🛡️",
      color: "text-blue-400",
      group: "SECURITY",
    },
    {
      name: "appearance.theme",
      icon: "🎨",
      color: "text-purple-400",
      group: "UI",
    },
    {
      name: "notifications.json",
      icon: "🔔",
      color: "text-emerald-400",
      group: "UI",
    },
    {
      name: "api_keys.env",
      icon: "⚡",
      color: "text-orange-400",
      group: "DEVELOPER",
    },
    {
      name: "danger_zone.sh",
      icon: "💀",
      color: "text-red-500",
      group: "SYSTEM",
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090a] text-[#d1d5db] font-mono pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto border border-[#30363d] rounded-lg overflow-hidden shadow-2xl bg-[#0d1117] flex flex-col h-[700px]">
        {/* IDE Top Bar */}
        <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex gap-4">
            <span>File</span>
            <span>Edit</span>
            <span>Terminal</span>
            <span>Help</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-[9px] font-bold">
              V1.0.4-STABLE
            </span>
          </div>
        </div>

        <div className="flex flex-grow overflow-hidden">
          <aside className="w-64 bg-[#0d1117] border-r border-[#30363d] overflow-y-auto">
            <div className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest flex justify-between">
              Explorer <span className="opacity-50">...</span>
            </div>
            {fileTree.map((file) => (
              <div
                key={file.name}
                onClick={() => {
                  setActiveFile(file.name);
                  logAction(`Accessing ${file.name}`);
                }}
                className={`flex items-center justify-between px-6 py-2 cursor-pointer transition-colors text-xs ${
                  activeFile === file.name
                    ? "bg-[#21262d] text-white border-l-2 border-indigo-500"
                    : "hover:bg-[#161b22] text-slate-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={file.color}>{file.icon}</span> {file.name}
                </div>
                <span className="text-[8px] opacity-30 italic">
                  {file.group}
                </span>
              </div>
            ))}
          </aside>

          <main className="flex-grow flex flex-col bg-[#0d1117] relative">
            <div className="flex bg-[#161b22] border-b border-[#30363d]">
              <div className="px-6 py-2 bg-[#0d1117] border-t-2 border-indigo-500 text-xs flex items-center gap-2">
                <span className="text-blue-400">{}</span> {activeFile}
              </div>
            </div>

            <div className="flex-grow p-8 overflow-y-auto custom-scrollbar flex gap-6">
              <div className="text-slate-700 text-xs text-right select-none leading-8 opacity-40">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              <div className="flex-grow">
                {activeFile === "auth.config" && (
                  <div className="space-y-6 animate-fadeIn">
                    <p className="text-yellow-500/70 text-xs italic">
                      // SECURE_CREDENTIAL_STORE v2.1
                    </p>
                    <div className="space-y-4 max-w-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-pink-400 text-xs">
                          "current_hash":
                        </span>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          className="bg-transparent border-b border-slate-800 focus:border-indigo-500 outline-none p-1 text-emerald-400 text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-pink-400 text-xs">
                          "new_rsa_key":
                        </span>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          className="bg-transparent border-b border-slate-800 focus:border-indigo-500 outline-none p-1 text-emerald-400 text-sm"
                        />
                      </div>
                      <button
                        onClick={handleUpdatePassword}
                        className="mt-4 px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all"
                      >
                        sh rotate_keys.sh --force
                      </button>
                    </div>
                  </div>
                )}

                {activeFile === "privacy.yaml" && (
                  <div className="space-y-6 animate-fadeIn">
                    <p className="text-blue-400/70 text-xs">
                      # Network Discovery Protocols
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-pink-400 text-xs">
                          stealth_mode:
                        </span>
                        <button
                          onClick={() => {
                            setIsGhostMode(!isGhostMode);
                            logAction(`Stealth Mode: ${!isGhostMode}`);
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${isGhostMode ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}
                        >
                          {isGhostMode ? "enabled" : "disabled"}
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-pink-400 text-xs">
                          public_api_access:
                        </span>
                        <span className="text-emerald-400 text-xs">true</span>
                      </div>
                      <p className="text-slate-600 text-[10px] leading-relaxed">
                        # If stealth_mode is true, your UUID is purged from
                        'Discover' but remains in 'Matches'.
                      </p>
                    </div>
                  </div>
                )}

                {/* --- ADDED CONTENT: api_keys.env --- */}
                {activeFile === "api_keys.env" && (
                  <div className="space-y-6 animate-fadeIn">
                    <p className="text-orange-400/70 text-xs">
                      # Authenticated Developer Environment Variables
                    </p>
                    <div className="space-y-3 font-mono text-[11px]">
                      {/* Dynamic Token: Uses the first 8 chars of the User ID for uniqueness */}
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 text-[10px]">
                          # USER_SPECIFIC_ACCESS_TOKEN
                        </span>
                        <div className="flex gap-2">
                          <span className="text-pink-400">
                            DEVTINDER_ACCESS_TOKEN=
                          </span>
                          <span className="text-emerald-400 select-all tracking-tighter">
                            "dt_live_{user?._id?.slice(-8) || "00000000"}_
                            {Math.random().toString(36).substring(7)}"
                          </span>
                        </div>
                      </div>

                      {/* Dynamic Secret: Mimics an RSA key tied to the user's account */}
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 text-[10px]">
                          # SHA256_SESSION_IDENTIFIER
                        </span>
                        <div className="flex gap-2">
                          <span className="text-pink-400">SESSION_SECRET=</span>
                          <span className="text-emerald-400 select-all italic opacity-80">
                            "rsa_v2_{user?.firstName?.toLowerCase()}_pkcs8_
                            {user?._id?.slice(0, 4)}"
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span className="text-pink-400">NODE_ENV=</span>
                        <span className="text-blue-400">"production"</span>
                      </div>
                    </div>

                    <div className="mt-8 p-4 border border-indigo-500/20 bg-indigo-500/5 rounded text-[10px] text-indigo-300 italic">
                      // Note: These keys are rotated every 24 hours for
                      security compliance.
                    </div>
                  </div>
                )}

                {activeFile === "danger_zone.sh" && (
                  <div className="space-y-6 animate-fadeIn">
                    <p className="text-red-500 text-xs font-bold">
                      #!/bin/bash/system-wipe
                    </p>
                    <div className="p-6 border border-red-900/30 bg-red-900/10 rounded-lg">
                      <p className="text-red-400 text-[10px] mb-4 uppercase tracking-tighter italic">
                        // Warning: This script triggers a recursive delete on
                        assets.
                      </p>
                      <input
                        type="text"
                        placeholder="echo 'TERMINATE' to confirm"
                        value={confirmDelete}
                        onChange={(e) => setConfirmDelete(e.target.value)}
                        className="w-full bg-black/60 border border-red-900/50 p-3 rounded text-red-500 outline-none text-xs font-mono mb-4"
                      />
                      <button
                        onClick={handleTerminateAccount}
                        disabled={confirmDelete !== "TERMINATE"}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${confirmDelete === "TERMINATE" ? "bg-red-600 text-white" : "bg-slate-800 text-slate-600 cursor-not-allowed"}`}
                      >
                        sudo rm -rf ./user_data
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-24 bg-[#0d1117] border-t border-[#30363d] p-3 overflow-hidden">
              <div className="text-[9px] font-bold text-slate-600 mb-1 uppercase tracking-tighter">
                Terminal Output:
              </div>
              {systemLogs.map((log, i) => {
                const getLogColor = (text) => {
                  if (text.includes("[FATAL]") || text.includes("[ERROR]"))
                    return "text-red-500 font-bold";
                  if (text.includes("[SUCCESS]")) return "text-emerald-400";
                  if (text.includes("[INFO]")) return "text-blue-400";
                  return i === 0
                    ? "text-indigo-400"
                    : "text-slate-500 opacity-60";
                };
                return (
                  <div
                    key={i}
                    className={`text-[9px] leading-tight mb-0.5 font-mono ${getLogColor(log)}`}
                  >
                    {log}
                  </div>
                );
              })}
            </div>
          </main>
        </div>

        <div className="bg-indigo-600 text-white px-4 py-0.5 flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
          <div className="flex gap-4">
            <span>UTF-8</span>
            <span>Master_Branch</span>
          </div>
          <div className="flex gap-4">
            <span>Ready</span>
            <span>Ln 1, Col 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
