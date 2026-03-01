import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commitHash, setCommitHash] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Generate a fresh hash for the "deployment" look
  useEffect(() => {
    setCommitHash(Math.random().toString(16).slice(2, 8).toUpperCase());
  }, [showToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(BASE_URL + "/signup", formData, {
        withCredentials: true,
      });

      setShowToast(true);
      dispatch(addUser(res?.data?.data));

      // Small delay to let the user see the "Deployment Successful" toast
      setTimeout(() => {
        navigate("/profile");
      }, 2500);
    } catch (err) {
      setError(err?.response?.data?.message || "ERR_DEPLOYMENT_FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center font-mono p-6 selection:bg-[#264f78]">
      {/* BACKGROUND DECO */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* SYSTEM TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-10 right-8 z-[250]"
          >
            <div className="bg-[#0b0f1a] border border-emerald-500/30 rounded-lg shadow-2xl min-w-[320px] overflow-hidden">
              <div className="bg-[#161b22] px-4 py-1.5 border-b border-slate-800 flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  Deployment_Log
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-white text-[11px] font-black tracking-tight uppercase">
                  User_Provisioned_Successfully
                </p>
                <p className="text-slate-500 text-[9px] uppercase">
                  Status: <span className="text-emerald-400">201_CREATED</span>{" "}
                  // Hash: {commitHash}
                </p>
                <div className="w-full h-[2px] bg-slate-800 mt-3 relative overflow-hidden">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 2.5, ease: "linear" }}
                    className="absolute inset-0 bg-emerald-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl z-10">
        {/* LEFT PANE: LIVE CONFIG & DIAGNOSTIC CONSOLE */}
        <div className="hidden lg:flex flex-col bg-[#0d1117] p-8 border-r border-[#30363d] relative">
          <div className="flex items-center gap-2 mb-8 text-[#8b949e]">
            <span className="text-xs uppercase tracking-widest font-bold">
              Preview: user_config.json
            </span>
          </div>

          {/* JSON Preview Section */}
          <div className="space-y-1 text-sm font-mono leading-relaxed opacity-80">
            <p className="text-indigo-400">{"{"}</p>
            <p className="pl-6">
              <span className="text-slate-500">"firstName":</span>{" "}
              <span className="text-orange-300">
                "{formData.firstName || "..."}"
              </span>
              ,
            </p>
            <p className="pl-6">
              <span className="text-slate-500">"lastName":</span>{" "}
              <span className="text-orange-300">
                "{formData.lastName || "..."}"
              </span>
              ,
            </p>
            <p className="pl-6">
              <span className="text-slate-500">"email":</span>{" "}
              <span className="text-orange-300">
                "{formData.email || "..."}"
              </span>
              ,
            </p>
            <p className="pl-6">
              <span className="text-slate-500">"auth":</span>{" "}
              <span className="text-indigo-400">true</span>
            </p>
            <p className="text-indigo-400">{"}"}</p>
          </div>
          {/* UPDATED DIAGNOSTIC CONSOLE AREA */}
          <div className="mt-auto">
            <div className="mb-4 pt-4 border-t border-[#30363d]/50">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">
                // Terminal: system_logs
              </p>

              <div className="bg-[#010409] rounded-lg p-4 border border-[#30363d] min-h-[120px] font-mono text-[11px] flex flex-col justify-end overflow-hidden">
                <AnimatePresence mode="wait">
                  {/* CASE 1: SUCCESSFUL DEPLOYMENT */}
                  {showToast ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1"
                    >
                      <p className="text-emerald-500 font-bold tracking-tighter">
                        [ {new Date().toLocaleTimeString([], { hour12: false })}{" "}
                        ] DEPLOYMENT_SUCCESS
                      </p>
                      <div className="text-slate-400 space-y-0.5">
                        <p>&gt; New user node initialized...</p>
                        <p>&gt; Injecting JWT auth_token...</p>
                        <p>
                          &gt; Status:{" "}
                          <span className="text-emerald-400">201_CREATED</span>
                        </p>
                        <p className="text-indigo-400 animate-pulse mt-1">
                          &gt; Redirecting to /profile...
                        </p>
                      </div>
                    </motion.div>
                  ) : error ? (
                    /* CASE 2: FATAL ERROR */
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-1"
                    >
                      <p className="text-red-500 font-bold">
                        [ {new Date().toLocaleTimeString([], { hour12: false })}{" "}
                        ] FATAL_ERROR
                      </p>
                      <p className="text-red-400 leading-relaxed uppercase tracking-tighter">
                        &gt; {error}
                      </p>
                      <p className="text-slate-600 italic mt-1">
                        // Fix issues in auth_key to continue.
                      </p>
                    </motion.div>
                  ) : (
                    /* CASE 3: IDLE STATE */
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      className="text-slate-500 italic"
                    >
                      <p>
                        &gt; Real-time data serialization validated by
                        system.onboard()
                      </p>
                      <p className="mt-1 animate-pulse">_</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: SIGNUP FORM */}
        <div className="p-8 lg:p-12">
          <header className="mb-10">
            <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase italic">
              New<span className="text-indigo-500">_Deployment</span>
            </h1>
            <p className="text-[#8b949e] text-xs mt-2 uppercase tracking-[0.2em]">
              Initialize your developer profile
            </p>
          </header>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                  $ First_Name
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  required
                  className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 outline-none px-4 py-3 rounded-lg text-sm text-slate-200 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                  $ Last_Name
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  required
                  className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 outline-none px-4 py-3 rounded-lg text-sm text-slate-200 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                $ Network_Identity
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                placeholder="dev@node.js"
                className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 outline-none px-4 py-3 rounded-lg text-sm text-slate-200 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                $ Access_Key
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
                autoComplete="new-password"
                className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 outline-none px-4 py-3 rounded-lg text-sm text-slate-200 transition-all"
              />
            </div>

            {/* {error && (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="p-3 bg-red-500/10 border-l-2 border-red-500 text-red-500 text-[10px] font-bold uppercase"
              >
                !! CRITICAL_ERROR: {error}
              </motion.div>
            )} */}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || showToast}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 text-xs uppercase tracking-[0.2em]"
              >
                {loading
                  ? "EXECUTING_INIT..."
                  : showToast
                    ? "SUCCESS"
                    : "PUSH_COMMIT"}
              </button>

              <p className="text-center text-slate-600 text-[10px] uppercase tracking-widest mt-6">
                Account exists?{" "}
                <Link
                  to="/login"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Authorize_Session
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
