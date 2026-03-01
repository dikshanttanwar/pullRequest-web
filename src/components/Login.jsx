import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("dikshant@gmail.com");
  const [password, setPassword] = useState("Dikshant@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { email: emailId, password },
        { withCredentials: true },
      );
      if (res.status === 200) {
        dispatch(addUser(res.data.user));
        navigate("/");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Runtime Error: Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-175 text-[#d4d4d4] font-mono flex items-center justify-center p-6 selection:bg-[#264f78]">
      {/* Ambient background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        {/* Mock Editor Header */}
        <div className="bg-[#1e1e1e] border border-[#333] border-b-0 rounded-t-lg p-3 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-xs text-[#858585] tracking-widest uppercase">
            auth_session.sh — devTinder
          </span>
          <div className="w-10"></div>
        </div>

        {/* Editor Body */}
        <div className="bg-[#181818]/80 backdrop-blur-md border border-[#333] rounded-b-lg p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-xl text-blue-400 mb-2 font-bold tracking-tight">
              &gt; system.authenticate()
            </h1>
            <p className="text-[#858585] text-sm italic">
              // Authenticate to find your coding match.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="relative group">
              <label className="block text-xs font-bold text-[#569cd6] uppercase mb-2 tracking-tighter">
                $ USER_EMAIL
              </label>
              <input
                value={emailId}
                type="email"
                onChange={(e) => setEmailId(e.target.value)}
                className="w-full bg-transparent border-b border-[#333] focus:border-blue-500 py-2 outline-none transition-all duration-300 placeholder:text-[#333]"
                placeholder="developer@example.com"
                required
              />
            </div>

            <div className="relative group">
              <label className="block text-xs font-bold text-[#569cd6] uppercase mb-2 tracking-tighter">
                $ AUTH_TOKEN
              </label>
              <input
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-[#333] focus:border-blue-500 py-2 outline-none transition-all duration-300 placeholder:text-[#333]"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Terminal-style Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/10 border-l-2 border-red-500 p-3 flex items-start gap-3 mt-4"
                >
                  <span className="text-red-500 font-bold">[!]</span>
                  <span className="text-red-400 text-xs leading-relaxed">
                    {error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 flex flex-col gap-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative bg-[#d4d4d4] text-[#0a0a0a] py-3 px-6 font-bold overflow-hidden transition-all duration-300 hover:bg-white disabled:opacity-50"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <span className="flex gap-1">
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        .
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: 0.2,
                        }}
                      >
                        .
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: 0.4,
                        }}
                      >
                        .
                      </motion.span>
                    </span>
                  ) : (
                    <>
                      RUN_AUTH <span className="text-xs">↵</span>
                    </>
                  )}
                </div>
              </button>

              <div className="flex justify-between items-center text-[10px] text-[#555] uppercase tracking-[0.2em] pt-4 border-t border-[#333]">
                <Link to={"/signup"}
                  type="button"
                  className="hover:text-[#888] transition-colors cursor-pointer"
                >
                  Register Profile
                </Link>
                <button
                  type="button"
                  className="hover:text-[#888] transition-colors"
                >
                  Forgot PWD?
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Bottom status bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#007acc] text-white text-[10px] px-4 py-1 flex justify-between items-center font-sans tracking-wide">
        <div className="flex gap-4">
          <span>Ready</span>
          <span>UTF-8</span>
        </div>
        <div>devTinder v1.0.2</div>
      </div>
    </div>
  );
};

export default Login;
