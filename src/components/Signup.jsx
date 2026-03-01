import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

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

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      navigate("/profile");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Critical Error: Registration failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => {
    setShowToast(false);
  };

  return (
    <div className="min-h-175 bg-[#030712] flex items-center justify-center font-mono p-4">

      <div
        className={`fixed bottom-10 right-8 z-[250] transition-all duration-500 transform ${
          showToast
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-[#0b0f1a] border border-emerald-500/30 rounded-lg shadow-2xl shadow-emerald-500/10 min-w-[320px] overflow-hidden">
          {/* Top Bar: Minimalist Tabs */}
          <div className="bg-[#161b22] px-4 py-1.5 border-b border-slate-800 flex justify-between items-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              System_Output
            </span>
            <div className="flex gap-1">
              <div
                className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 cursor-pointer"
                onClick={closeToast}
              ></div>
            </div>
          </div>

          {/* Content: Terminal Logs */}
          <div className="p-4 font-mono space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-emerald-500 font-bold shrink-0">&gt;</span>
              <div className="space-y-1">
                <p className="text-white text-[11px] leading-none uppercase font-black tracking-tight">
                  User_Deployment_Successful
                </p>
                <p className="text-slate-500 text-[9px] uppercase">
                  Status: <span className="text-emerald-400">201_CREATED</span>{" "}
                  // Hash: {Math.random().toString(16).slice(2, 8)}
                </p>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-[2px] bg-slate-800 mt-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500 w-full animate-progress-shrink origin-left"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md w-full bg-[#0d1117] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#161b22] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">
            user_registration.init
          </span>
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
          </div>
        </div>

        <form onSubmit={handleSignup} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                First_Name
              </label>
              <input
                // required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                type="text"
                className="w-full bg-[#030712] border border-slate-800 focus:border-indigo-500 outline-none px-4 py-2.5 rounded-xl text-sm transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Last_Name
              </label>
              <input
                // required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                type="text"
                className="w-full bg-[#030712] border border-slate-800 focus:border-indigo-500 outline-none px-4 py-2.5 rounded-xl text-sm transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Network_Identity (Email)
            </label>
            <input
              // required
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full bg-[#030712] border border-slate-800 focus:border-indigo-500 outline-none px-4 py-2.5 rounded-xl text-sm transition-all"
              placeholder="dev@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Access_Key (Password)
            </label>
            <input
              // required
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              autoCapitalize="off"
              className="w-full bg-[#030712] border border-slate-800 focus:border-indigo-500 outline-none px-4 py-2.5 rounded-xl text-sm transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-[12px] font-bold uppercase rounded-lg animate-pulse">
              !! ERROR: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 text-xs uppercase tracking-[0.2em]"
          >
            {loading ? "INITIALIZING_SESSION..." : "CREATE_ACCOUNT"}
          </button>

          <p className="text-center text-slate-600 text-[10px] uppercase tracking-widest mt-6">
            Existing developer?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
              Authorize_Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
