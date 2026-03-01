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
  const [consoleLogs, setConsoleLogs] = useState(["// System ready for handshake..."]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addLog = (msg) => {
    setConsoleLogs((prev) => [...prev.slice(-2), `> ${msg}`]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    addLog("Initiating POST /auth/login...");

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { email: emailId, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        addLog("Status: 200 OK. Redirecting...");
        dispatch(addUser(res.data.user));
        navigate("/");
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || "ERR_CONNECTION_REFUSED";
      addLog(`Fatal: ${errMsg}`);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#d4d4d4] font-mono flex flex-col items-center justify-center p-6 selection:bg-[#264f78]">
      {/* Background Grid Pattern - Very popular for dev tools */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, size: '40px 40px', backgroundSize: '40px 40px' }}>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl z-10 overflow-hidden rounded-lg border border-[#30363d] shadow-2xl bg-[#161b22]"
      >
        {/* Editor Tabs / Breadcrumbs */}
        <div className="bg-[#0d1117] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#8b949e]">
              <span>src</span>
              <span>/</span>
              <span className="flex items-center gap-1 text-[#e6edf3]">
                <span className="text-yellow-500 font-bold">JS</span> login.auth
              </span>
            </div>
          </div>
          <div className="text-[10px] text-emerald-500 font-bold animate-pulse uppercase tracking-widest">
             ● Branch: Master
          </div>
        </div>

        <div className="flex">
          {/* Line Number Gutter - Adds major "Tech" appeal */}
          <div className="hidden sm:flex flex-col items-center py-8 bg-[#0d1117] text-[#484f58] border-r border-[#30363d] w-12 text-xs select-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="leading-8">{i + 1}</span>
            ))}
          </div>

          <div className="flex-1 p-8">
            <header className="mb-10">
              <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase italic">
                Authenticate<span className="text-indigo-500">_User</span>
              </h1>
              <p className="text-[#8b949e] text-xs mt-2 uppercase tracking-[0.2em]">
                // Input credentials to establish session
              </p>
            </header>

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em]">
                  [0] login_id:
                </label>
                <input
                  value={emailId}
                  type="email"
                  onChange={(e) => setEmailId(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 p-3 rounded-lg outline-none transition-all text-sm font-mono text-orange-300"
                  placeholder="string@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em]">
                  [1] auth_secret:
                </label>
                <input
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 p-3 rounded-lg outline-none transition-all text-sm font-mono text-emerald-400"
                  placeholder="********"
                  required
                />
              </div>

              {/* Console Output Mock - Very cool for QAs/Testers */}
              <div className="bg-[#010409] rounded-lg p-3 border border-[#30363d] font-mono text-[10px]">
                {consoleLogs.map((log, i) => (
                  <div key={i} className={log.includes('Fatal') ? 'text-red-400' : 'text-slate-500'}>
                    {log}
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
                >
                  {loading ? "COMMITTING..." : "EXECUTE_LOGIN"}
                </button>

                <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  <Link to="/signup" className="hover:text-indigo-400 transition-colors">
                    Register_New_User
                  </Link>
                  <button type="button" className="hover:text-indigo-400 transition-colors">
                    Reset_Credentials
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;